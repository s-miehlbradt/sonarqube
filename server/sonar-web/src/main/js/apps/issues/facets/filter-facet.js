define([
  './base-facet',
  '../templates'
], function (BaseFacet) {

  var $ = jQuery;

  return BaseFacet.extend({
    template: Templates['issues-filter-facet'],

    onRender: function () {
      var filter = this.options.app.state.get('filter');
      if (filter) {
        var facet = this.$('.js-facet').filter('[data-value="' + filter.id + '"]');
        facet.addClass('active');
      }
    },

    toggleFacet: function (e) {
      var that = this;
      this.$('.js-facet').removeClass('active');
      $(e.currentTarget).toggleClass('active');
      var id = this.getValue(),
          filter = this.options.app.filters.get(id);
      return filter.fetch().done(function () {
        return that.options.app.controller.applyFilter(filter);
      });
    },

    serializeData: function () {
      return _.extend(this._super(), {
        filters: this.options.app.filters.toJSON()
      });
    }
  });

});
