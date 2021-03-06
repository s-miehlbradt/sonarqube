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

package org.sonar.server.computation.component;

public class PathAwareVisitorWrapper<T> implements VisitorWrapper {

  private final PathAwareVisitor<T> delegate;

  private final DequeBasedPath<T> stack = new DequeBasedPath<>();

  public PathAwareVisitorWrapper(PathAwareVisitor<T> delegate) {
    this.delegate = delegate;
  }

  @Override
  public void beforeComponent(Component component){
    stack.add(new PathElementImpl<>(component, createForComponent(component)));
  }

  @Override
  public void afterComponent(Component component){
    stack.pop();
  }

  @Override
  public void visitProject(Component tree) {
    delegate.visitProject(tree, stack);
  }

  @Override
  public void visitModule(Component tree) {
    delegate.visitModule(tree, stack);
  }

  @Override
  public void visitDirectory(Component tree) {
    delegate.visitDirectory(tree, stack);
  }

  @Override
  public void visitFile(Component tree) {
    delegate.visitFile(tree, stack);
  }

  @Override
  public void visitAny(Component component) {
    delegate.visitAny(component, stack);
  }

  @Override
  public ComponentVisitor.Order getOrder() {
    return delegate.getOrder();
  }

  @Override
  public Component.Type getMaxDepth() {
    return delegate.getMaxDepth();
  }

  private T createForComponent(Component component) {
    switch (component.getType()) {
      case PROJECT:
        return delegate.getFactory().createForProject(component);
      case MODULE:
        return delegate.getFactory().createForModule(component);
      case DIRECTORY:
        return delegate.getFactory().createForDirectory(component);
      case FILE:
        return delegate.getFactory().createForFile(component);
      default:
        return delegate.getFactory().createForUnknown(component);
    }
  }

}
