define(function (require) {
  var bdd = require('intern!bdd');
  require('../helpers/test-page');

  bdd.describe('Computation Page', function () {
    bdd.it('should show list', function () {
      return this.remote
          .open()
          .mock({ url: '/api/computation/queue', file: 'computation-spec/queue.json' })
          .mock({ url: '/api/computation/history', file: 'computation-spec/history.json' })
          .startApp('computation', { urlRoot: '/test/medium/base.html' })
          .checkElementCount('#computation-list li[data-id]', 1)
          .checkElementInclude('#computation-list', 'SonarQube')
          .checkElementInclude('#computation-list-footer', '1')
          .checkElementExist('.js-queue.selected')
          .clickElement('.js-history')
          .checkElementCount('#computation-list li[data-id]', 3)
          .checkElementInclude('#computation-list', 'Duration')
          .checkElementExist('.js-history.selected')
          .checkElementExist('.panel-danger[data-id="3"]')
          .clickElement('.js-queue')
          .checkElementCount('#computation-list li[data-id]', 1);
    });

    bdd.it('should show more', function () {
      return this.remote
          .open('#past')
          .mock({ url: '/api/computation/queue', file: 'computation-spec/queue.json' })
          .mock({ url: '/api/computation/history', file: 'computation-spec/history-big-1.json' })
          .startApp('computation', { urlRoot: '/test/medium/base.html' })
          .checkElementCount('#computation-list li[data-id]', 2)
          .clearMocks()
          .mock({
            url: '/api/computation/history',
            data: { p: 2 },
            file: 'computation-spec/history-big-2.json'
          })
          .clickElement('#computation-fetch-more')
          .checkElementCount('#computation-list li[data-id]', 3);
    });
  });
});
