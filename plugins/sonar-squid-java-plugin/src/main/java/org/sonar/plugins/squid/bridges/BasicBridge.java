/*
 * Sonar, open source software quality management tool.
 * Copyright (C) 2009 SonarSource SA
 * mailto:contact AT sonarsource DOT com
 *
 * Sonar is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * Sonar is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with Sonar; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package org.sonar.plugins.squid.bridges;

import org.sonar.api.resources.Project;
import org.sonar.api.resources.Resource;
import org.sonar.java.api.JavaClass;
import org.sonar.java.api.JavaMethod;
import org.sonar.squid.api.*;

public abstract class BasicBridge extends Bridge {

  protected BasicBridge(boolean needsBytecode) {
    super(needsBytecode);
  }

  @Override
  public final void onProject(SourceProject squidProject, Project sonarProject) {
    onResource(squidProject, sonarProject);
  }

  @Override
  public final void onPackage(SourcePackage squidPackage, Resource sonarPackage) {
    onResource(squidPackage, sonarPackage);
  }

  @Override
  public final void onFile(SourceFile squidFile, Resource sonarFile) {
    onResource(squidFile, sonarFile);
  }

  @Override
  public final void onClass(SourceClass squidClass, JavaClass sonarClass) {
    onResource(squidClass, sonarClass);
  }

  @Override
  public final void onMethod(SourceMethod squidMethod, JavaMethod sonarMethod) {
    onResource(squidMethod, sonarMethod);
  }

  protected void onResource(SourceCode squidResource, Resource sonarResource) {

  }
}
