'use strict';

if (_.isUndefined(App.Views.Files)) {
    App.Views.Files = {};
}

if (_.isUndefined(App.Views.Files.EventCategory)) {
    App.Views.Files.EventCategory = {};
}

App.Views.Files.EventCategory.EventGeneral = App.Helpers.View.extend({
    template: App.Templates.filesEventCategoryEventGeneral,
    className: 'FilesEventCategoryEventGeneral',
    initialize: function initialize(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
        this.collection = new App.Helpers.Collection();
        this.createEventLink = options.fileModel.fileEventsUrl() + '/new?category=' + this.options.category;
        if (this.options.category === '5') {
            this.eventCategoryName = 'Medical';
            this.eventCategoryIcon = 'fa fa-heartbeat fa-lg';
            this.eventCategoryViewElem = 'dashboard-medical';
            this.getStats = 'getMedicalsStats';
        } else if (this.options.category === '3') {
            this.eventCategoryName = 'Hearing';
            this.eventCategoryIcon = 'fa fa-gavel fa-lg';
            this.eventCategoryViewElem = 'dashboard-hearing';
            this.getStats = 'getHearingStats';
        } else if (this.options.category === '4') {
            this.eventCategoryName = 'Deposition';
            this.eventCategoryIcon = 'fa fa-book fa-lg';
            this.eventCategoryViewElem = 'dashboard-deposition';
            this.getStats = 'getDepoStats';
        } else if (this.options.category === '2') {
            this.eventCategoryName = 'Subpoena';
            this.eventCategoryIcon = 'fa fa-file-text fa-lg';
            this.eventCategoryViewElem = 'dashboard-subpoena';
            this.getStats = 'getSubpoenaStats';
        } else if (this.options.category === '6') {
            this.eventCategoryName = 'Liens';
            this.eventCategoryIcon = 'fa fa-gift fa-lg';
            this.eventCategoryViewElem = 'dashboard-liens';
            this.getStats = 'getLienStats';
        }
        this.createEventText = 'Create new ';
        if (this.eventCategoryName === 'Liens') {
            this.createEventText += 'Lien';
        } else {
            this.createEventText += this.eventCategoryName;
        }
    },
    events: {
        'click .row-model': 'eventLink',
        'click .events-sortable': 'sortEvents'
    },
    eventLink: function eventLink(e) {
        var elem = $(e.currentTarget);
        Backbone.history.navigate('files/edit/' + this.options.fileModel.get('fileNumber') + '/events/edit/' + elem.data('id'), { trigger: true });
    },
    afterRender: function afterRender() {
        var fileDashboardView = $('.files-dashboard').data('view'),
            elFileDashboard = fileDashboardView.$el;

        if (!elFileDashboard.find('#' + this.eventCategoryViewElem).is(':visible')) {
            elFileDashboard.find('.' + this.eventCategoryViewElem + '-all').click();
            fileDashboardView[this.getStats]();
        }
        this.loadData();
    },
    sortEvents: function sortEvents(e) {
        var elem = $(e.currentTarget);
        var el = this.$el;
        var sortBy = elem.data('sort');
        var sortDir = void 0;

        if (elem.find('.fa-chevron-down').length) {
            sortDir = 'asc';
        } else {
            sortDir = 'DESC';
        }

        el.find('.events-sortable .fa').remove();
        if (sortDir === 'asc') {
            elem.append('<i class="fa fa-chevron-up"></i>');
        } else {
            elem.append('<i class="fa fa-chevron-down"></i>');
        }

        this.orderCol(sortBy, sortDir);
    },
    orderCol: function orderCol(sortBy, sortDir) {
        this.collection.sortBy = sortBy;
        this.collection.sortOrder = sortDir;
        this.collection.sort();
    },
    loadData: function loadData() {
        var orderBy = arguments.length <= 0 || arguments[0] === undefined ? 'eventDate' : arguments[0];
        var orderDirection = arguments.length <= 1 || arguments[1] === undefined ? 'DESC' : arguments[1];

        var self = this;
        var url = 'api/file_events_controller/get_events_pagination?fileNumber=' + this.options.fileModel.get('fileNumber') + '&orderBy=' + orderBy + '&orderDirection=' + orderDirection + '&maxRows=0&etcID=' + this.options.category + '&eventOffsetIndex=0';
        this.collection.fetch({
            url: url,
            success: function success(model, response) {
                self.collection.reset(response[0]);
                self.orderCol(orderBy, orderDirection);
            }
        });
    }
});
