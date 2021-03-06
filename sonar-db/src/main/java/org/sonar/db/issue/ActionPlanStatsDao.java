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

package org.sonar.db.issue;

import java.util.List;
import org.apache.ibatis.session.SqlSession;
import org.sonar.api.utils.System2;
import org.sonar.db.AbstractDao;
import org.sonar.db.MyBatis;

public class ActionPlanStatsDao extends AbstractDao {

  public ActionPlanStatsDao(MyBatis myBatis, System2 system2) {
    super(myBatis, system2);
  }

  public List<ActionPlanStatsDto> selectByProjectId(Long projectId) {
    SqlSession session = myBatis().openSession(false);
    try {
      return session.getMapper(ActionPlanStatsMapper.class).findByProjectId(projectId);
    } finally {
      MyBatis.closeQuietly(session);
    }
  }

}
