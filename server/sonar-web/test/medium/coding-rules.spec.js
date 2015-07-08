define(function (require) {
  var bdd = require('intern!bdd');
  require('../helpers/test-page');

  bdd.describe('Coding Rules Page', function () {

    bdd.it('should show alert when there is no available profiles for activation', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app-no-available-profiles.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-no-available-profiles.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-no-available-profiles.json' })
          .mock({ url: '/api/issues/search' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('.coding-rules-detail-header')
          .checkElementExist('#coding-rules-quality-profile-activate')
          .clickElement('#coding-rules-quality-profile-activate')
          .checkElementExist('.modal')
          .checkElementExist('.modal .alert');
    });

    bdd.it('should show profile facet', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-profile-facet.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementInclude('#coding-rules-total', '609')
          .clickElement('[data-property="qprofile"] .js-facet-toggle')
          .checkElementExist('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { activation: true },
            file: 'coding-rules-spec/search-profile-facet-qprofile-active.json'
          })
          .clickElement('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .checkElementInclude('#coding-rules-total', '407')
          .checkElementExist('.js-facet[data-value="java-default-with-mojo-conventions-49307"] .js-active.facet-toggle-active')
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { activation: 'false' },
            file: 'coding-rules-spec/search-profile-facet-qprofile-inactive.json'
          })
          .clickElement('.js-facet[data-value="java-default-with-mojo-conventions-49307"] .js-inactive')
          .checkElementInclude('#coding-rules-total', '408')
          .checkElementExist('.js-facet[data-value="java-default-with-mojo-conventions-49307"] .js-inactive.facet-toggle-active')
          .clearMocks()
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-profile-facet.json' })
          .clickElement('[data-property="qprofile"] .js-facet-toggle')
          .checkElementInclude('#coding-rules-total', '609');
    });

    bdd.it('should show query facet', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementInclude('#coding-rules-total', '609')
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { q: 'query' },
            file: 'coding-rules-spec/search-query.json'
          })
          .fillElement('[data-property="q"] input', 'query')
          .submitForm('[data-property="q"] form')
          .checkElementInclude('#coding-rules-total', '4')
          .clearMocks()
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .fillElement('[data-property="q"] input', '')
          .submitForm('[data-property="q"] form')
          .checkElementInclude('#coding-rules-total', '609');
    });

    bdd.it('should show rule permalink', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show.json' })
          .mock({ url: '/api/issues/search' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('.coding-rules-detail-header')
          .checkElementExist('a[href="/coding_rules#rule_key=squid%3AS2204"]');
    });

    bdd.it('should activate profile', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-activate-profile.json' })
          .mock({ url: '/api/qualityprofiles/activate_rule' })
          .mock({ url: '/api/issues/search' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('.coding-rules-detail-header')
          .checkElementNotExist('.coding-rules-detail-quality-profile-name')
          .checkElementExist('#coding-rules-quality-profile-activate')
          .clickElement('#coding-rules-quality-profile-activate')
          .checkElementExist('.modal')
          .clearMocks()
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-activate-profile-with-profile.json' })
          .mock({ url: '/api/qualityprofiles/activate_rule' })
          .mock({ url: '/api/issues/search' })
          .clickElement('#coding-rules-quality-profile-activation-activate')
          .checkElementExist('.coding-rules-detail-quality-profile-name')
          .checkElementExist('.coding-rules-detail-quality-profile-name')
          .checkElementExist('.coding-rules-detail-quality-profile-severity')
          .checkElementExist('.coding-rules-detail-quality-profile-deactivate');
    });

    bdd.it('should create custom rule', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-create-custom-rules.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .clearMocks()
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-create-custom-rules.json' })
          .mock({
            url: '/api/rules/search',
            data: { template_key: 'squid:ArchitecturalConstraint' },
            file: 'coding-rules-spec/search-custom-rules.json'
          })
          .mock({ url: '/api/rules/create' })
          .mock({ url: '/api/issues/search' })
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('#coding-rules-detail-custom-rules .coding-rules-detail-list-name')
          .clearMocks()
          .mock({ url: '/api/rules/create' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-create-custom-rules.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-custom-rules2.json' })
          .checkElementCount('#coding-rules-detail-custom-rules .coding-rules-detail-list-name', 1)
          .clickElement('.js-create-custom-rule')
          .fillElement('.modal form [name="name"]', 'test')
          .fillElement('.modal form [name="markdown_description"]', 'test')
          .clickElement('#coding-rules-custom-rule-creation-create')
          .checkElementCount('#coding-rules-detail-custom-rules .coding-rules-detail-list-name', 2);
    });

    bdd.it('should reactivate custom rule', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-create-custom-rules.json' })
          .startApp('coding-rules')
          .forceJSON()
          .checkElementExist('.coding-rule.selected')
          .clearMocks()
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-create-custom-rules.json' })
          .mock({
            url: '/api/rules/search',
            data: { template_key: 'squid:ArchitecturalConstraint' },
            file: 'coding-rules-spec/search-custom-rules.json'
          })
          .mock({ url: '/api/rules/create', file: 'coding-rules-spec/create-create-custom-rules.json', status: 409 })
          .mock({ url: '/api/issues/search' })
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('.js-create-custom-rule')
          .clickElement('.js-create-custom-rule')
          .checkElementExist('.modal')
          .fillElement('.modal form [name="name"]', 'My Custom Rule')
          .fillElement('.modal form [name="markdown_description"]', 'My Description')
          .clickElement('#coding-rules-custom-rule-creation-create')
          .checkElementExist('.modal .alert-warning')
          .clearMocks()
          .mock({ url: '/api/rules/create', file: 'coding-rules-spec/create-create-custom-rules.json' })
          .mock({
            url: '/api/rules/search',
            data: { template_key: 'squid:ArchitecturalConstraint' },
            file: 'coding-rules-spec/search-custom-rules2.json'
          })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-create-custom-rules.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-create-custom-rules.json' })
          .clickElement('.modal #coding-rules-custom-rule-creation-reactivate')
          .checkElementCount('#coding-rules-detail-custom-rules .coding-rules-detail-list-name', 2);
    });

    bdd.it('should create manual rule', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-create-manual-rule.json' })
          .mock({ url: '/api/rules/create', file: 'coding-rules-spec/show-create-manual-rule.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-create-manual-rule.json' })
          .mock({ url: '/api/issues/search' })
          .startApp('coding-rules')
          .forceJSON()
          .checkElementExist('.js-create-manual-rule')
          .clickElement('.js-create-manual-rule')
          .checkElementExist('.modal')
          .fillElement('.modal [name="name"]', 'Manual Rule')
          .fillElement('.modal [name="markdown_description"]', 'Manual Rule Description')
          .clickElement('.modal #coding-rules-manual-rule-creation-create')
          .checkElementExist('.coding-rules-detail-header')
          .checkElementInclude('.coding-rules-detail-header', 'Manual Rule')
          .checkElementInclude('.coding-rule-details', 'manual:Manual_Rule')
          .checkElementInclude('.coding-rules-detail-description', 'Manual Rule Description');
    });

    bdd.it('should reactivate manual rule', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-create-manual-rule.json' })
          .mock({ url: '/api/rules/create', file: 'coding-rules-spec/show-create-manual-rule.json', status: 409 })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-create-manual-rule.json' })
          .mock({ url: '/api/issues/search' })
          .startApp('coding-rules')
          .forceJSON()
          .checkElementExist('.js-create-manual-rule')
          .clickElement('.js-create-manual-rule')
          .checkElementExist('.modal')
          .checkElementExist('.modal #coding-rules-manual-rule-creation-create')
          .fillElement('.modal [name="name"]', 'Manual Rule')
          .fillElement('.modal [name="markdown_description"]', 'Manual Rule Description')
          .clickElement('.modal #coding-rules-manual-rule-creation-create')
          .checkElementExist('.modal .alert-warning')
          .clearMocks()
          .mock({ url: '/api/rules/create', file: 'coding-rules-spec/show.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-create-manual-rule.json' })
          .clickElement('.modal #coding-rules-manual-rule-creation-reactivate')
          .checkElementExist('.coding-rules-detail-header')
          .checkElementInclude('.coding-rules-detail-header', 'Manual Rule')
          .checkElementInclude('.coding-rule-details', 'manual:Manual_Rule')
          .checkElementInclude('.coding-rules-detail-description', 'Manual Rule Description');
    });

    bdd.it('should delete custom rules', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({
            url: '/api/rules/search',
            data: { template_key: 'squid:ArchitecturalConstraint' },
            file: 'coding-rules-spec/search-delete-custom-rule-custom-rules.json'
          })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-delete-custom-rule.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-delete-custom-rule.json' })
          .mock({ url: '/api/rules/delete' })
          .mock({ url: '/api/issues/search' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('#coding-rules-detail-custom-rules .coding-rules-detail-list-name')
          .checkElementCount('#coding-rules-detail-custom-rules .coding-rules-detail-list-name', 2)
          .clickElement('.js-delete-custom-rule')
          .clickElement('[data-confirm="yes"]')
          .checkElementCount('#coding-rules-detail-custom-rules .coding-rules-detail-list-name', 1);
    });

    bdd.it('should delete manual rules', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-delete-manual-rule-before.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-delete-manual-rule.json' })
          .mock({ url: '/api/issues/search' })
          .startApp('coding-rules')
          .forceJSON()
          .checkElementExist('.coding-rule.selected')
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('.js-delete')
          .clickElement('.js-delete')
          .checkElementExist('[data-confirm="yes"]')
          .clearMocks()
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-delete-manual-rule-after.json' })
          .mock({ url: '/api/rules/delete' })
          .clickElement('[data-confirm="yes"]')
          .checkElementInclude('#coding-rules-total', 0);
    });

    bdd.it('should show custom rules', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({
            url: '/api/rules/search',
            data: { template_key: 'squid:ArchitecturalConstraint' },
            file: 'coding-rules-spec/search-show-cutsom-rule-custom-rules.json'
          })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-show-cutsom-rule.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-show-cutsom-rule.json' })
          .mock({ url: '/api/issues/search' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('#coding-rules-detail-custom-rules .coding-rules-detail-list-name')
          .checkElementExist('#coding-rules-detail-custom-rules')
          .checkElementCount('#coding-rules-detail-custom-rules .coding-rules-detail-list-name', 2)
          .checkElementInclude('#coding-rules-detail-custom-rules .coding-rules-detail-list-name',
          'Do not use org.h2.util.StringUtils');
    });

    bdd.it('should show deprecated label', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-deprecated.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .checkElementInclude('.coding-rule.selected', 'DEPRECATED');
    });

    bdd.it('should show rule details', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-show-details.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show-show-details.json' })
          .mock({ url: '/api/issues/search' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('.coding-rules-detail-header')
          .checkElementInclude('.search-navigator-workspace-details',
          'Throwable and Error classes should not be caught')
          .checkElementInclude('.search-navigator-workspace-details', 'squid:S1181')
          .checkElementExist('.coding-rules-detail-properties .icon-severity-blocker')
          .checkElementInclude('.coding-rules-detail-properties', 'error-handling')
          .checkElementInclude('.coding-rules-detail-properties', '2013')
          .checkElementInclude('.coding-rules-detail-properties', 'SonarQube (Java)')
          .checkElementInclude('.coding-rules-detail-properties', 'Reliability > Exception handling')
          .checkElementInclude('.coding-rules-detail-properties', 'LINEAR')
          .checkElementInclude('.coding-rules-detail-properties', '20min')

          .checkElementInclude('.coding-rules-detail-description', 'is the superclass of all errors and')
          .checkElementInclude('.coding-rules-detail-description', 'its subclasses should be caught.')
          .checkElementInclude('.coding-rules-detail-description', 'Noncompliant Code Example')
          .checkElementInclude('.coding-rules-detail-description', 'Compliant Solution')

          .checkElementInclude('.coding-rules-detail-parameters', 'max')
          .checkElementInclude('.coding-rules-detail-parameters', 'Maximum authorized number of parameters')
          .checkElementInclude('.coding-rules-detail-parameters', '7')

          .checkElementCount('.coding-rules-detail-quality-profile-name', 6)
          .checkElementInclude('.coding-rules-detail-quality-profile-name', 'Default - Top')
          .checkElementCount('.coding-rules-detail-quality-profile-inheritance', 4)
          .checkElementInclude('.coding-rules-detail-quality-profile-inheritance', 'Default - Top');
    });

    bdd.it('should show empty list', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search-empty.json' })
          .startApp('coding-rules')
          .checkElementExist('.search-navigator-facet-box')
          .checkElementNotExist('.coding-rule')
          .checkElementInclude('#coding-rules-total', 0)
          .checkElementExist('.search-navigator-no-results');
    });

    bdd.it('should show facets', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.search-navigator-facet-box')
          .checkElementCount('.search-navigator-facet-box', 13);
    });

    bdd.it('should show rule', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .checkElementInclude('.coding-rule.selected', 'Values passed to SQL commands should be sanitized')
          .checkElementInclude('.coding-rule.selected', 'Java')
          .checkElementInclude('.coding-rule.selected', 'cwe')
          .checkElementInclude('.coding-rule.selected', 'owasp-top10')
          .checkElementInclude('.coding-rule.selected', 'security')
          .checkElementInclude('.coding-rule.selected', 'sql')
          .checkElementInclude('.coding-rule.selected', 'custom-tag');
    });

    bdd.it('should show rule issues', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show.json' })
          .mock({ url: '/api/issues/search', file: 'coding-rules-spec/issues-search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('.coding-rules-most-violated-projects')
          .checkElementInclude('.js-rule-issues', '7')
          .checkElementInclude('.coding-rules-most-violated-projects', 'SonarQube')
          .checkElementInclude('.coding-rules-most-violated-projects', '2')
          .checkElementInclude('.coding-rules-most-violated-projects', 'SonarQube Runner')
          .checkElementInclude('.coding-rules-most-violated-projects', '1');
    });

    bdd.it('should show rules', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementCount('.coding-rule', 25)
          .checkElementInclude('.coding-rule', 'Values passed to SQL commands should be sanitized')
          .checkElementInclude('.coding-rule', 'An open curly brace should be located at the beginning of a line')
          .checkElementInclude('#coding-rules-total', '609');
    });

    bdd.it('should move between rules from detailed view', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('.coding-rules-detail-header')
          .checkElementInclude('.coding-rules-detail-header',
          '".equals()" should not be used to test the values')
          .clearMocks()
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show2.json' })
          .clickElement('.js-next')
          .checkElementInclude('.coding-rules-detail-header', '"@Override" annotation should be used on any')
          .clearMocks()
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show.json' })
          .clickElement('.js-prev')
          .checkElementInclude('.coding-rules-detail-header', '".equals()" should not be used to test the values');
    });

    bdd.it('should filter similar rules', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected .js-rule-filter')
          .checkElementInclude('#coding-rules-total', '609')
          .clickElement('.js-rule-filter')
          .checkElementExist('.bubble-popup')
          .checkElementExist('.bubble-popup [data-property="languages"][data-value="java"]')
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { tags: 'sql' },
            file: 'coding-rules-spec/search-sql-tag.json'
          })
          .clickElement('.bubble-popup [data-property="tags"][data-value="sql"]')
          .checkElementInclude('#coding-rules-total', '2');
    });

    bdd.it('should show active severity facet', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementInclude('#coding-rules-total', '609')
          .checkElementExist('.search-navigator-facet-box-forbidden[data-property="active_severities"]')
          .clickElement('[data-property="qprofile"] .js-facet-toggle')
          .checkElementExist('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { qprofile: 'java-default-with-mojo-conventions-49307' },
            file: 'coding-rules-spec/search-qprofile.json'
          })
          .clickElement('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .checkElementInclude('#coding-rules-total', '407')
          .checkElementNotExist('.search-navigator-facet-box-forbidden[data-property="active_severities"]')
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { facets: 'active_severities', ps: 1 },
            file: 'coding-rules-spec/active-severities-facet.json'
          })
          .clickElement('[data-property="active_severities"] .js-facet-toggle')
          .checkElementExist('[data-property="active_severities"] [data-value="BLOCKER"]')
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { active_severities: 'BLOCKER' },
            file: 'coding-rules-spec/search-BLOCKER.json'
          })
          .clickElement('[data-property="active_severities"] [data-value="BLOCKER"]')
          .checkElementInclude('#coding-rules-total', '4')
          .clearMocks()
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .clickElement('[data-property="qprofile"] .js-facet-toggle')
          .checkElementInclude('#coding-rules-total', '609')
          .checkElementExist('.search-navigator-facet-box-forbidden[data-property="active_severities"]');
    });

    bdd.it('should show available since facet', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementInclude('#coding-rules-total', '609')
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { available_since: '2014-12-01' },
            file: 'coding-rules-spec/search-limited.json'
          })
          .clickElement('[data-property="available_since"] .js-facet-toggle')
          .fillElement('[data-property="available_since"] input', '2014-12-01')
          .execute(function () {
            // TODO do not use jQuery
            jQuery('[data-property="available_since"] input').change();
          })
          .checkElementInclude('#coding-rules-total', '101');
    });

    bdd.it('should bulk activate', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .mock({ url: '/api/qualityprofiles/activate_rules', responseText: '{ "succeeded": 225 }' })
          .startApp('coding-rules')
          .forceJSON()
          .checkElementExist('.coding-rule')
          .checkElementExist('.js-bulk-change')
          .clickElement('.js-bulk-change')
          .checkElementExist('.bubble-popup')
          .checkElementExist('.bubble-popup .js-bulk-change[data-action="activate"]')
          .clickElement('.js-bulk-change[data-action="activate"]')
          .checkElementExist('.modal')
          .checkElementExist('.modal #coding-rules-bulk-change-profile')
          .checkElementExist('.modal #coding-rules-submit-bulk-change')
          .fillElement('#coding-rules-bulk-change-profile', 'java-default-with-mojo-conventions-49307')
          .clickElement('.modal #coding-rules-submit-bulk-change')
          .checkElementExist('.modal .alert-success')
          .checkElementInclude('.modal', 'Default - Maven Conventions')
          .checkElementInclude('.modal', 'Java')
          .checkElementInclude('.modal', '225');
    });

    bdd.it('should fail to bulk activate', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .mock({ url: '/api/qualityprofiles/activate_rules', responseText: '{ "succeeded": 225, "failed": 395 }' })
          .startApp('coding-rules')
          .forceJSON()
          .checkElementExist('.coding-rule')
          .checkElementExist('.js-bulk-change')
          .clickElement('.js-bulk-change')
          .checkElementExist('.bubble-popup')
          .checkElementExist('.bubble-popup .js-bulk-change[data-action="activate"]')
          .clickElement('.js-bulk-change[data-action="activate"]')
          .checkElementExist('.modal')
          .checkElementExist('.modal #coding-rules-bulk-change-profile')
          .checkElementExist('.modal #coding-rules-submit-bulk-change')
          .fillElement('#coding-rules-bulk-change-profile', 'java-default-with-mojo-conventions-49307')
          .clickElement('.modal #coding-rules-submit-bulk-change')
          .checkElementExist('.modal .alert-warning')
          .checkElementInclude('.modal', '225')
          .checkElementInclude('.modal', '395');
    });

    bdd.it('should filter profiles by language during bulk change', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .clickElement('.js-facet[data-value="java"]')
          .checkElementExist('.js-bulk-change')
          .clickElement('.js-bulk-change')
          .checkElementExist('.bubble-popup')
          .checkElementExist('.bubble-popup .js-bulk-change[data-action="activate"]')
          .clickElement('.js-bulk-change[data-action="activate"]')
          .checkElementExist('.modal')
          .checkElementExist('.modal #coding-rules-bulk-change-profile')
          .checkElementCount('.modal #coding-rules-bulk-change-profile option', 8);
    });

    bdd.it('should change selected profile during bulk change', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({
            url: '/api/rules/search',
            data: { activation: true },
            file: 'coding-rules-spec/search-qprofile-active.json'
          })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .mock({ url: '/api/qualityprofiles/deactivate_rules', responseText: '{ "succeeded": 7 }' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .clickElement('[data-property="qprofile"] .js-facet-toggle')
          .checkElementExist('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .clickElement('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .checkElementExist('.js-bulk-change')
          .clickElement('.js-bulk-change')
          .checkElementExist('.bubble-popup')
          .checkElementExist('.bubble-popup .js-bulk-change[data-param="java-default-with-mojo-conventions-49307"]')
          .clickElement('.js-bulk-change[data-param="java-default-with-mojo-conventions-49307"]')
          .checkElementExist('.modal')
          .checkElementNotExist('.modal #coding-rules-bulk-change-profile')
          .clickElement('.modal #coding-rules-submit-bulk-change')
          .checkElementExist('.modal .alert-success')
          .checkElementInclude('.modal', '7');
    });

    bdd.it('should show characteristic facet', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementExist('.search-navigator-facet-box-collapsed[data-property="debt_characteristics"]')
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { facets: 'debt_characteristics' },
            file: 'coding-rules-spec/search-characteristic.json'
          })
          .clickElement('[data-property="debt_characteristics"] .js-facet-toggle')
          .checkElementExist('.js-facet[data-value="PORTABILITY"]')
          .checkElementCount('[data-property="debt_characteristics"] .js-facet', 32)
          .checkElementCount('[data-property="debt_characteristics"] .js-facet.search-navigator-facet-indent', 24)
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { debt_characteristics: 'PORTABILITY' },
            file: 'coding-rules-spec/search-with-portability-characteristic.json'
          })
          .clickElement('.js-facet[data-value="PORTABILITY"]')
          .checkElementInclude('#coding-rules-total', 21)
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { has_debt_characteristic: 'false' },
            file: 'coding-rules-spec/search-without-characteristic.json'
          })
          .clickElement('.js-facet[data-empty-characteristic]')
          .checkElementInclude('#coding-rules-total', 208)
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { debt_characteristics: 'MEMORY_EFFICIENCY' },
            file: 'coding-rules-spec/search-with-memory-efficiency-characteristic.json'
          })
          .clickElement('.js-facet[data-value="MEMORY_EFFICIENCY"]')
          .checkElementInclude('#coding-rules-total', 3);
    });

    bdd.it('should disable characteristic facet', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { facets: 'debt_characteristics' },
            file: 'coding-rules-spec/search-characteristic.json'
          })
          .clickElement('[data-property="debt_characteristics"] .js-facet-toggle')
          .checkElementExist('.js-facet[data-value="PORTABILITY"]')

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { debt_characteristics: 'PORTABILITY' },
            file: 'coding-rules-spec/search-with-portability-characteristic.json'
          })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .clickElement('.js-facet[data-value="PORTABILITY"]')
          .checkElementInclude('#coding-rules-total', 21)

          .clearMocks()
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .clickElement('[data-property="debt_characteristics"] .js-facet-toggle')
          .checkElementInclude('#coding-rules-total', 609)

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { facets: 'debt_characteristics' },
            file: 'coding-rules-spec/search-characteristic.json'
          })
          .clickElement('[data-property="debt_characteristics"] .js-facet-toggle')
          .checkElementExist('.js-facet[data-value="MEMORY_EFFICIENCY"]')

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { debt_characteristics: 'MEMORY_EFFICIENCY' },
            file: 'coding-rules-spec/search-with-memory-efficiency-characteristic.json'
          })
          .clickElement('.js-facet[data-value="MEMORY_EFFICIENCY"]')
          .checkElementInclude('#coding-rules-total', 3)

          .clearMocks()
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .clickElement('[data-property="debt_characteristics"] .js-facet-toggle')
          .checkElementInclude('#coding-rules-total', 609)

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { facets: 'debt_characteristics' },
            file: 'coding-rules-spec/search-characteristic.json'
          })
          .clickElement('[data-property="debt_characteristics"] .js-facet-toggle')
          .checkElementExist('.js-facet[data-empty-characteristic]')

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { has_debt_characteristic: 'false' },
            file: 'coding-rules-spec/search-without-characteristic.json'
          })
          .clickElement('.js-facet[data-empty-characteristic]')
          .checkElementInclude('#coding-rules-total', 208)

          .clearMocks()
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .clickElement('[data-property="debt_characteristics"] .js-facet-toggle')
          .checkElementInclude('#coding-rules-total', 609);
    });

    bdd.it('should show template facet', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementExist('.search-navigator-facet-box-collapsed[data-property="is_template"]')

          .clickElement('[data-property="is_template"] .js-facet-toggle')
          .checkElementExist('[data-property="is_template"] .js-facet[data-value="true"]')

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { 'is_template': 'true' },
            file: 'coding-rules-spec/search-only-templates.json'
          })
          .clickElement('[data-property="is_template"] .js-facet[data-value="true"]')
          .checkElementInclude('#coding-rules-total', 8)

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { 'is_template': 'false' },
            file: 'coding-rules-spec/search-hide-templates.json'
          })
          .clickElement('[data-property="is_template"] .js-facet[data-value="false"]')
          .checkElementInclude('#coding-rules-total', 7)

          .clearMocks()
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .clickElement('[data-property="is_template"] .js-facet-toggle')
          .checkElementInclude('#coding-rules-total', 609);
    });

    bdd.it('should show language facet', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .mock({
            url: '/api/languages/list',
            responseText: '{"languages":[{"key":"custom","name":"Custom"}]}',
            data: { q: 'custom' }
          })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .clickElement('[data-property="languages"] .select2-choice')
          .checkElementExist('.select2-search')
          .fillElement('.select2-input', 'custom')
          .execute(function () {
            // TODO remove jQuery usage
            jQuery('.select2-input').trigger('keyup-change');
          })
          .checkElementExist('.select2-result')
          .checkElementInclude('.select2-result', 'Custom')
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { languages: 'custom' },
            file: 'coding-rules-spec/search-with-custom-language.json'
          })
          .execute(function () {
            // TODO remove jQuery usage
            jQuery('.select2-result').mouseup();
          })
          .checkElementInclude('#coding-rules-total', 13)
          .checkElementExist('[data-property="languages"] .js-facet.active')
          .checkElementInclude('[data-property="languages"] .js-facet.active', 'custom')
          .checkElementInclude('[data-property="languages"] .js-facet.active', '13');
    });

    bdd.it('should reload results', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementInclude('#coding-rules-total', 609)
          .clearMocks()
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search2.json' })
          .clickElement('.js-reload')
          .checkElementInclude('#coding-rules-total', 413);
    });

    bdd.it('should do a new search', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementInclude('#coding-rules-total', 609)
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { languages: 'java' },
            file: 'coding-rules-spec/search2.json'
          })
          .clickElement('.js-facet[data-value="java"]')
          .checkElementInclude('#coding-rules-total', 413)
          .clearMocks()
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .clickElement('.js-new-search')
          .checkElementInclude('#coding-rules-total', 609);
    });

    bdd.it('should go back', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .mock({ url: '/api/rules/show', file: 'coding-rules-spec/show.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule.selected')
          .clickElement('.coding-rule.selected .js-rule')
          .checkElementExist('.coding-rules-detail-header')
          .clickElement('.js-back')
          .checkElementNotExist('.js-back')
          .checkElementNotExist('.coding-rules-detail-header');
    });

    bdd.it('should show inheritance facet', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementInclude('#coding-rules-total', '609')
          .checkElementExist('.search-navigator-facet-box-forbidden[data-property="inheritance"]')

          .clickElement('[data-property="qprofile"] .js-facet-toggle')
          .checkElementExist('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { qprofile: 'java-default-with-mojo-conventions-49307' },
            file: 'coding-rules-spec/search-qprofile.json'
          })
          .clickElement('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .checkElementInclude('#coding-rules-total', '407')
          .checkElementNotExist('.search-navigator-facet-box-forbidden[data-property="inheritance"]')

          .clickElement('[data-property="inheritance"] .js-facet-toggle')
          .checkElementExist('[data-property="inheritance"] [data-value="NONE"]')

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { inheritance: 'NONE' },
            file: 'coding-rules-spec/search-not-inherited.json'
          })
          .clickElement('[data-property="inheritance"] [data-value="NONE"]')
          .checkElementInclude('#coding-rules-total', '103')

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { inheritance: 'INHERITED' },
            file: 'coding-rules-spec/search-inherited.json'
          })
          .clickElement('[data-property="inheritance"] [data-value="INHERITED"]')
          .checkElementInclude('#coding-rules-total', '101')

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { inheritance: 'OVERRIDES' },
            file: 'coding-rules-spec/search-overriden.json'
          })
          .clickElement('[data-property="inheritance"] [data-value="OVERRIDES"]')
          .checkElementInclude('#coding-rules-total', '102')

          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { qprofile: 'java-top-profile-without-formatting-conventions-50037' },
            file: 'coding-rules-spec/search-qprofile2.json'
          })
          .clickElement('.js-facet[data-value="java-top-profile-without-formatting-conventions-50037"]')
          .checkElementInclude('#coding-rules-total', '408')
          .checkElementExist('.search-navigator-facet-box-forbidden[data-property="inheritance"]')

          .clearMocks()
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .clickElement('[data-property="qprofile"] .js-facet-toggle')
          .checkElementInclude('#coding-rules-total', '609')
          .checkElementExist('.search-navigator-facet-box-forbidden[data-property="inheritance"]');
    });

    bdd.it('should show activation details', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementNotExist('.coding-rule-activation')
          .clickElement('[data-property="qprofile"] .js-facet-toggle')
          .checkElementExist('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .clearMocks()
          .mock({
            url: '/api/rules/search',
            data: { activation: true },
            file: 'coding-rules-spec/search-actives.json'
          })
          .clickElement('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .checkElementCount('.coding-rule-activation', 2)
          .checkElementCount('.coding-rule-activation .icon-severity-major', 2)
          .checkElementCount('.coding-rule-activation .icon-inheritance', 1)
          .checkElementNotExist('.coding-rules-detail-quality-profile-activate');
    });

    bdd.it('should activate rule', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({
            url: '/api/rules/search',
            data: { activation: 'false' },
            file: 'coding-rules-spec/search-inactive.json'
          })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .mock({ url: '/api/qualityprofiles/activate_rule' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementNotExist('.coding-rule-activation')
          .clickElement('[data-property="qprofile"] .js-facet-toggle')
          .checkElementExist('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .clickElement('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .clickElement('.js-facet[data-value="java-default-with-mojo-conventions-49307"] .js-inactive')
          .checkElementNotExist('.coding-rule-activation .icon-severity-major')
          .checkElementExist('.coding-rules-detail-quality-profile-activate')
          .clickElement('.coding-rules-detail-quality-profile-activate')
          .checkElementExist('.modal')
          .checkElementExist('#coding-rules-quality-profile-activation-select')
          .checkElementCount('#coding-rules-quality-profile-activation-select option', 1)
          .checkElementExist('#coding-rules-quality-profile-activation-severity')
          .clickElement('#coding-rules-quality-profile-activation-activate')
          .checkElementExist('.coding-rule-activation .icon-severity-major')
          .checkElementExist('.coding-rule-activation .icon-severity-major')
          .checkElementNotExist('.coding-rules-detail-quality-profile-activate')
          .checkElementExist('.coding-rules-detail-quality-profile-deactivate');
    });

    bdd.it('should deactivate rule', function () {
      return this.remote
          .open()
          .mock({ url: '/api/rules/app', file: 'coding-rules-spec/app.json' })
          .mock({ url: '/api/rules/search', file: 'coding-rules-spec/search.json' })
          .startApp('coding-rules')
          .checkElementExist('.coding-rule')
          .checkElementNotExist('.coding-rule-activation')
          .clickElement('[data-property="qprofile"] .js-facet-toggle')
          .checkElementExist('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .clearMocks()
          .mock({ url: '/api/qualityprofiles/deactivate_rule' })
          .mock({
            url: '/api/rules/search',
            data: { activation: true },
            file: 'coding-rules-spec/search-active.json'
          })
          .clickElement('.js-facet[data-value="java-default-with-mojo-conventions-49307"]')
          .checkElementExist('.coding-rule-activation .icon-severity-major')
          .checkElementNotExist('.coding-rules-detail-quality-profile-activate')
          .clickElement('.coding-rules-detail-quality-profile-deactivate')
          .checkElementExist('button[data-confirm="yes"]')
          .clickElement('button[data-confirm="yes"]')
          .checkElementNotExist('.coding-rule-activation .icon-severity-major')
          .checkElementNotExist('.coding-rule-activation .icon-severity-major')
          .checkElementExist('.coding-rules-detail-quality-profile-activate')
          .checkElementNotExist('.coding-rules-detail-quality-profile-deactivate');
    });
  });
});
