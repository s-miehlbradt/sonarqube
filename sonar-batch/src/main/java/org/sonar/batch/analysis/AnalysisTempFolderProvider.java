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
package org.sonar.batch.analysis;

import org.sonar.batch.bootstrap.LifecycleProviderAdapter;

import org.sonar.api.utils.TempFolder;
import org.apache.commons.lang.StringUtils;
import org.sonar.api.CoreProperties;
import org.sonar.api.utils.internal.DefaultTempFolder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class AnalysisTempFolderProvider extends LifecycleProviderAdapter {
  static final String TMP_NAME = ".sonartmp";
  private DefaultTempFolder projectTempFolder;

  public TempFolder provide(AnalysisProperties props) {
    if (projectTempFolder == null) {
      String workingDirPath = StringUtils.defaultIfBlank(props.property(CoreProperties.WORKING_DIRECTORY), CoreProperties.WORKING_DIRECTORY_DEFAULT_VALUE);
      Path workingDir = Paths.get(workingDirPath).normalize();

      if (!workingDir.isAbsolute()) {
        Path base = getBasePath(props);
        workingDir = base.resolve(workingDir);
      }

      Path tempDir = workingDir.resolve(TMP_NAME);
      try {
        Files.createDirectories(tempDir);
      } catch (IOException e) {
        throw new IllegalStateException("Unable to create root temp directory " + tempDir, e);
      }
      projectTempFolder = new DefaultTempFolder(tempDir.toFile(), true);
      this.instance = projectTempFolder;
    }
    return projectTempFolder;
  }

  private static Path getBasePath(AnalysisProperties props) {
    String baseDir = props.property("sonar.projectBaseDir");
    if (baseDir == null) {
      throw new IllegalStateException("sonar.projectBaseDir needs to be specified");
    }
    return Paths.get(baseDir);
  }
}
