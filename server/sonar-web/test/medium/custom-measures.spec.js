define(function (require) {
  var bdd = require('intern!bdd');
  require('../helpers/test-page');

  bdd.describe('Custom Measures Page', function () {
    var projectId = 'eb294572-a6a4-43cf-acc2-33c2fe37c02e';

    bdd.it('should show list', function () {
      return this.remote
          .open()
          .mock({
            url: '/api/custom_measures/search',
            data: { projectId: projectId },
            file: 'custom-measures-spec/search.json'
          })
          .startApp('custom-measures', { projectId: projectId })
          .checkElementCount('#custom-measures-list li[data-id]', 4)
          .checkElementInclude('#custom-measures-list .js-custom-measure-value', '35')
          .checkElementInclude('#custom-measures-list .js-custom-measure-metric-name', 'Distribution')
          .checkElementInclude('#custom-measures-list .js-custom-measure-domain', 'Management')
          .checkElementInclude('#custom-measures-list .js-custom-measure-description', 'Description...')
          .checkElementInclude('#custom-measures-list .js-custom-measure-created-at', '2015')
          .checkElementInclude('#custom-measures-list .js-custom-measure-user', 'Administrator')
          .checkElementCount('#custom-measures-list .js-custom-measure-pending', 4)
          .checkElementCount('#custom-measures-list .js-custom-measure-update', 4)
          .checkElementCount('#custom-measures-list .js-custom-measure-delete', 4)
          .checkElementInclude('#custom-measures-list-footer', '4/4');
    });

    bdd.it('should show more', function () {
      return this.remote
          .open()
          .mock({
            url: '/api/custom_measures/search',
            data: { projectId: projectId },
            file: 'custom-measures-spec/search-big-1.json'
          })
          .startApp('custom-measures', { projectId: projectId })
          .checkElementCount('#custom-measures-list li[data-id]', 2)
          .checkElementNotExist('[data-id="3"]')
          .clearMocks()
          .mock({
            url: '/api/custom_measures/search',
            data: { projectId: projectId, p: 2 },
            file: 'custom-measures-spec/search-big-2.json'
          })
          .clickElement('#custom-measures-fetch-more')
          .checkElementExist('[data-id="3"]')
          .checkElementCount('#custom-measures-list li[data-id]', 4);
    });

    bdd.it('should create a new custom measure', function () {
      return this.remote
          .open()
          .mock({
            url: '/api/custom_measures/search',
            data: { projectId: projectId },
            file: 'custom-measures-spec/search.json'
          })
          .mock({
            url: '/api/metrics/search',
            data: { isCustom: true },
            file: 'custom-measures-spec/metrics.json'
          })
          .startApp('custom-measures', { projectId: projectId })
          .checkElementCount('#custom-measures-list li[data-id]', 4)
          .clickElement('#custom-measures-create')
          .checkElementExist('#create-custom-measure-form')
          .clearMocks()
          .mock({
            url: '/api/custom_measures/search',
            data: { projectId: projectId },
            file: 'custom-measures-spec/search-created.json'
          })
          .mock({
            url: '/api/custom_measures/create',
            data: {
              metricId: '156',
              value: '17',
              description: 'example',
              projectId: projectId
            },
            responseText: '{}'
          })
          .fillElement('#create-custom-measure-metric', '156')
          .fillElement('#create-custom-measure-value', '17')
          .fillElement('#create-custom-measure-description', 'example')
          .clickElement('#create-custom-measure-submit')
          .checkElementExist('[data-id="6"]')
          .checkElementCount('#custom-measures-list li[data-id]', 5)
          .checkElementInclude('[data-id="6"] .js-custom-measure-value', '17');
    });

    bdd.it('should filter available metrics', function () {
      return this.remote
          .open()
          .mock({
            url: '/api/custom_measures/search',
            data: { projectId: projectId },
            file: 'custom-measures-spec/search.json'
          })
          .mock({
            url: '/api/metrics/search',
            data: { isCustom: true },
            file: 'custom-measures-spec/metrics.json'
          })
          .startApp('custom-measures', { projectId: projectId })
          .clickElement('#custom-measures-create')
          .checkElementExist('#create-custom-measure-form')
          .checkElementCount('#create-custom-measure-metric option', 1)
          .checkElementExist('#create-custom-measure-metric option[value="156"]');
    });

    bdd.it('should show warning when there are no available metrics', function () {
      return this.remote
          .open()
          .mock({
            url: '/api/custom_measures/search',
            data: { projectId: projectId },
            file: 'custom-measures-spec/search.json'
          })
          .mock({
            url: '/api/metrics/search',
            data: { isCustom: true },
            file: 'custom-measures-spec/metrics-limited.json'
          })
          .startApp('custom-measures', { projectId: projectId })
          .clickElement('#custom-measures-create')
          .checkElementExist('#create-custom-measure-form')
          .checkElementNotExist('#create-custom-measure-metric')
          .checkElementExist('#create-custom-measure-form .alert-warning')
          .checkElementExist('#create-custom-measure-submit[disabled]');
    });

    bdd.it('should update a custom measure', function () {
      return this.remote
          .open()
          .mock({
            url: '/api/custom_measures/search',
            data: { projectId: projectId },
            file: 'custom-measures-spec/search.json'
          })
          .mock({
            url: '/api/metrics/search',
            data: { isCustom: true },
            file: 'custom-measures-spec/metrics.json'
          })
          .startApp('custom-measures', { projectId: projectId })
          .clickElement('[data-id="5"] .js-custom-measure-update')
          .checkElementExist('#create-custom-measure-form')
          .clearMocks()
          .mock({
            url: '/api/custom_measures/search',
            data: { projectId: projectId },
            file: 'custom-measures-spec/search-updated.json'
          })
          .mock({
            url: '/api/custom_measures/update',
            data: {
              id: '5',
              value: '2',
              description: 'new!'
            },
            responseText: '{}'
          })
          .fillElement('#create-custom-measure-value', '2')
          .fillElement('#create-custom-measure-description', 'new!')
          .clickElement('#create-custom-measure-submit')
          .checkElementExist('[data-id="5"]')
          .checkElementInclude('[data-id="5"] .js-custom-measure-value', 'B')
          .checkElementInclude('[data-id="5"] .js-custom-measure-description', 'new!');
    });

    bdd.it('should delete a custom measure', function () {
      return this.remote
          .open()
          .mock({
            url: '/api/custom_measures/search',
            data: { projectId: projectId },
            file: 'custom-measures-spec/search.json'
          })
          .startApp('custom-measures', { projectId: projectId })
          .clickElement('[data-id="5"] .js-custom-measure-delete')
          .checkElementExist('#delete-custom-measure-form', 1)
          .clearMocks()
          .mock({
            url: '/api/custom_measures/search',
            data: { projectId: projectId },
            file: 'custom-measures-spec/search-deleted.json'
          })
          .mock({ url: '/api/custom_measures/delete', data: { id: '5' } })
          .clickElement('#delete-custom-measure-submit')
          .checkElementNotExist('[data-id="5"]');
    });
  });

});
