/*
 * SonarQube, open source software quality management tool.
 * Copyright (C) 2008-2014 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * SonarQube is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * SonarQube is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.server.computation.measure;

import com.google.common.base.Optional;
import com.google.common.collect.ImmutableSetMultimap;
import com.google.common.collect.SetMultimap;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import javax.annotation.Nullable;
import org.sonar.batch.protocol.output.BatchReport;
import org.sonar.core.util.CloseableIterator;
import org.sonar.db.DbClient;
import org.sonar.db.DbSession;
import org.sonar.db.measure.MeasureDto;
import org.sonar.db.rule.RuleDto;
import org.sonar.server.computation.batch.BatchReportReader;
import org.sonar.server.computation.component.Component;
import org.sonar.server.computation.debt.Characteristic;
import org.sonar.server.computation.metric.Metric;
import org.sonar.server.computation.metric.MetricRepository;
import org.sonar.server.computation.metric.ReportMetricValidator;

import static com.google.common.base.Preconditions.checkArgument;
import static java.lang.String.format;
import static java.util.Objects.requireNonNull;

public class MeasureRepositoryImpl implements MeasureRepository {
  private final DbClient dbClient;
  private final BatchReportReader reportReader;
  private final BatchMeasureToMeasure batchMeasureToMeasure;
  private final MetricRepository metricRepository;
  private final ReportMetricValidator reportMetricValidator;

  private final MeasureDtoToMeasure measureDtoToMeasure = new MeasureDtoToMeasure();
  private final Set<Integer> loadedComponents = new HashSet<>();
  private final Map<Integer, Map<MeasureKey, Measure>> measures = new HashMap<>();

  public MeasureRepositoryImpl(DbClient dbClient, BatchReportReader reportReader, MetricRepository metricRepository, ReportMetricValidator reportMetricValidator) {
    this.dbClient = dbClient;
    this.reportReader = reportReader;
    this.reportMetricValidator = reportMetricValidator;
    this.batchMeasureToMeasure = new BatchMeasureToMeasure();
    this.metricRepository = metricRepository;
  }

  @Override
  public Optional<Measure> getBaseMeasure(Component component, Metric metric) {
    // fail fast
    requireNonNull(component);
    requireNonNull(metric);

    try (DbSession dbSession = dbClient.openSession(false)) {
      MeasureDto measureDto = dbClient.measureDao().selectByComponentKeyAndMetricKey(dbSession, component.getKey(), metric.getKey());
      return measureDtoToMeasure.toMeasure(measureDto, metric);
    }
  }

  @Override
  public Optional<Measure> getRawMeasure(final Component component, final Metric metric) {
    // fail fast
    requireNonNull(component);
    requireNonNull(metric);

    Optional<Measure> local = findLocal(component, metric, null, null);
    if (local.isPresent()) {
      return local;
    }

    // look up in batch after loading (if not yet loaded) measures from batch
    loadBatchMeasuresForComponent(component);
    return findLocal(component, metric, null, null);
  }

  @Override
  public Optional<Measure> getRawMeasure(Component component, Metric metric, RuleDto rule) {
    // fail fast
    requireNonNull(component);
    requireNonNull(metric);
    requireNonNull(rule);

    return findLocal(component, metric, rule, null);
  }

  @Override
  public Optional<Measure> getRawMeasure(Component component, Metric metric, Characteristic characteristic) {
    // fail fast
    requireNonNull(component);
    requireNonNull(metric);
    requireNonNull(characteristic);

    return findLocal(component, metric, null, characteristic);
  }

  @Override
  public void add(Component component, Metric metric, Measure measure) {
    requireNonNull(component);
    checkValueTypeConsistency(metric, measure);

    Optional<Measure> existingMeasure = findLocal(component, metric, measure);
    if (existingMeasure.isPresent()) {
      throw new UnsupportedOperationException(
        format(
          "a measure can be set only once for a specific Component (key=%s), Metric (key=%s)%s. Use update method",
          component.getKey(),
          metric.getKey(),
          buildRuleOrCharacteristicMsgPart(measure)
        ));
    }
    addLocal(component, metric, measure, OverridePolicy.OVERRIDE);
  }

  @Override
  public void update(Component component, Metric metric, Measure measure) {
    requireNonNull(component);
    checkValueTypeConsistency(metric, measure);

    Optional<Measure> existingMeasure = findLocal(component, metric, measure);
    if (!existingMeasure.isPresent()) {
      throw new UnsupportedOperationException(
        format(
          "a measure can be updated only if one already exists for a specific Component (key=%s), Metric (key=%s)%s. Use add method",
          component.getKey(),
          metric.getKey(),
          buildRuleOrCharacteristicMsgPart(measure)
        ));
    }
    addLocal(component, metric, measure, OverridePolicy.OVERRIDE);
  }

  private static void checkValueTypeConsistency(Metric metric, Measure measure) {
    checkArgument(
      measure.getValueType() == Measure.ValueType.NO_VALUE || measure.getValueType() == metric.getType().getValueType(),
      format(
        "Measure's ValueType (%s) is not consistent with the Metric's ValueType (%s)",
        measure.getValueType(), metric.getType().getValueType()));
  }

  private static String buildRuleOrCharacteristicMsgPart(Measure measure) {
    if (measure.getRuleId() != null) {
      return " and rule (id=" + measure.getRuleId() + ")";
    }
    if (measure.getCharacteristicId() != null) {
      return " and Characteristic (id=" + measure.getCharacteristicId() + ")";
    }
    return "";
  }

  @Override
  public SetMultimap<String, Measure> getRawMeasures(Component component) {
    loadBatchMeasuresForComponent(component);
    Map<MeasureKey, Measure> rawMeasures = measures.get(component.getReportAttributes().getRef());
    if (rawMeasures == null) {
      return ImmutableSetMultimap.of();
    }

    ImmutableSetMultimap.Builder<String, Measure> builder = ImmutableSetMultimap.builder();
    for (Map.Entry<MeasureKey, Measure> entry : rawMeasures.entrySet()) {
      builder.put(entry.getKey().getMetricKey(), entry.getValue());
    }
    return builder.build();
  }

  private void loadBatchMeasuresForComponent(Component component) {
    if (loadedComponents.contains(component.getReportAttributes().getRef())) {
      return;
    }

    try (CloseableIterator<BatchReport.Measure> readIt = reportReader.readComponentMeasures(component.getReportAttributes().getRef())) {
      while (readIt.hasNext()) {
        BatchReport.Measure batchMeasure = readIt.next();
        String metricKey = batchMeasure.getMetricKey();
        if (reportMetricValidator.validate(metricKey)) {
          Metric metric = metricRepository.getByKey(metricKey);
          addLocal(component, metric, batchMeasureToMeasure.toMeasure(batchMeasure, metric).get(), OverridePolicy.DO_NOT_OVERRIDE);
        }
      }
    }
    loadedComponents.add(component.getReportAttributes().getRef());
  }

  private Optional<Measure> findLocal(Component component, Metric metric,
                                      @Nullable RuleDto rule, @Nullable Characteristic characteristic) {
    Map<MeasureKey, Measure> measuresPerMetric = measures.get(component.getReportAttributes().getRef());
    if (measuresPerMetric == null) {
      return Optional.absent();
    }
    return Optional.fromNullable(measuresPerMetric.get(new MeasureKey(metric.getKey(), rule, characteristic)));
  }

  private Optional<Measure> findLocal(Component component, Metric metric, Measure measure) {
    Map<MeasureKey, Measure> measuresPerMetric = measures.get(component.getReportAttributes().getRef());
    if (measuresPerMetric == null) {
      return Optional.absent();
    }
    return Optional.fromNullable(measuresPerMetric.get(new MeasureKey(metric.getKey(), measure.getRuleId(), measure.getCharacteristicId())));
  }

  private void addLocal(Component component, Metric metric, Measure measure, OverridePolicy overridePolicy) {
    Map<MeasureKey, Measure> measuresPerMetric = measures.get(component.getReportAttributes().getRef());
    if (measuresPerMetric == null) {
      measuresPerMetric = new HashMap<>();
      measures.put(component.getReportAttributes().getRef(), measuresPerMetric);
    }
    MeasureKey key = new MeasureKey(metric.getKey(), measure.getRuleId(), measure.getCharacteristicId());
    if (!measuresPerMetric.containsKey(key) || overridePolicy == OverridePolicy.OVERRIDE) {
      measuresPerMetric.put(key, measure);
    }
  }

  private enum OverridePolicy {
    OVERRIDE, DO_NOT_OVERRIDE
  }
}
