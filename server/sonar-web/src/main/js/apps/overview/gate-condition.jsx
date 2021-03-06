import React from 'react';
import Card from './card';
import Measure from './helpers/measure';
import {periodLabel, getPeriodDate} from './helpers/period-label';
import DrilldownLink from './helpers/drilldown-link';

export default React.createClass({
  render() {
    const
        metricName = window.t('metric', this.props.condition.metric.name, 'name'),
        threshold = this.props.condition.level === 'ERROR' ?
            this.props.condition.error : this.props.condition.warning,
        iconClassName = 'icon-alert-' + this.props.condition.level.toLowerCase(),
        period = this.props.condition.period ?
            `(${periodLabel(this.props.component.periods, this.props.condition.period)})` : null,
        periodDate = getPeriodDate(this.props.component.periods, this.props.condition.period);

    return (
        <div>
          <h4 className="overview-gate-condition-metric">{metricName} {period}</h4>
          <div className="overview-gate-condition-value">
            <i className={iconClassName}></i>&nbsp;
            <DrilldownLink component={this.props.component.key} metric={this.props.condition.metric.name}
                           period={this.props.condition.period} periodDate={periodDate}>
              <Measure value={this.props.condition.actual} type={this.props.condition.metric.type}/>
            </DrilldownLink>&nbsp;
            <span className="overview-gate-condition-itself">
              {window.t('quality_gates.operator', this.props.condition.op, 'short')}&nbsp;
              <Measure value={threshold} type={this.props.condition.metric.type}/>
            </span>
          </div>
        </div>
    );
  }
});
