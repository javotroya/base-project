'use strict';

if (_.isUndefined(App.Views.Accounting)) {
    App.Views.Accounting = {};
}

App.Views.Accounting.BillingPace = App.Helpers.View.extend({
    template: App.Templates.accountingBillingPace,
    className: 'AccountingBillingPace',
    initialize: function initialize(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
        this.page = this.options.page;
    },
    events: {
        'change [name="month"]': '_fetchData',
        'change [name="year"]': '_fetchData',
        'mouseover .hover-parent': 'showHoverPop',
        'mouseout .hover-parent': 'hideHoverPop'
    },
    showHoverPop: function showHoverPop(e) {
        var elem = $(e.currentTarget);
        this._hidePopOver();
        var fadingTime = 0;
        elem.find('td.b-blue-graph-bar').addClass('border-bottom-solid-black border-top-solid-black').fadeIn(fadingTime);
        elem.find('td.b-blue-graph-bar:first').addClass('border-left-solid-black').fadeIn(fadingTime);
        elem.find('.final-bar').addClass('border-right-solid-black').fadeIn(fadingTime);
        elem.find('.final-bar').addClass('border-bottom-solid-black border-top-solid-black').fadeIn(fadingTime);
        elem.find('.hover-pop').show(fadingTime);
    },
    _hidePopOver: function _hidePopOver() {
        var element = this.$el.find('#pace-table');
        element.find('.hover-pop').hide();
        element.find('td.b-blue-graph-bar').removeClass('border-bottom-solid-black border-top-solid-black');
        element.find('.final-bar').removeClass('border-bottom-solid-black border-top-solid-black');
        element.find('.final-bar').removeClass('border-right-solid-black');
        element.find('td.b-blue-graph-bar').removeClass('border-left-solid-black');
    },
    hideHoverPop: function hideHoverPop() {
        this._hidePopOver();
    },
    afterRender: function afterRender() {
        var thisMonth = moment().month() + 1;
        var thisYear = moment().year();
        var el = this.$el;

        el.find('[name="month"]').val(thisMonth);
        el.find('[name="year"]').val(thisYear);
        this._fetchData();
    },
    _fetchData: function _fetchData() {
        var self = this;
        var el = this.$el;
        var month = el.find('[name="month"]').val();
        var monthText = $('#month-select').find(':selected').text();
        var year = el.find('[name="year"]').val();
        var page = self.page;
        el.find('#month-label').html(monthText);
        el.find('#year-label').html(year);
        this.showLoader();
        this.collection.sortBy = 'user';
        this.collection.fetch({
            data: { year: year, month: month, page: page },
            success: function success(col) {
                self.removeLoader();
                self.paintTable(col);
            }
        });
    },
    _padDateNumbers: function _padDateNumbers(n) {
        //safari browser needs numbers in date for moment as 01,02,03 instead of 1,2,3.
        return n < 10 ? '0' + n : n;
    },
    paintTable: function paintTable(col) {
        var el = this.$el;
        if (col.models.length === 0) {
            el.find('#pace-table').html('<tr class="font-size-16"><td class="t-align-c font-style-italic font-size--15">No results available</td><tr/>');
            return;
        }
        var month = parseInt(el.find('[name="month"]').val(), 10);
        var year = parseInt(el.find('[name="year"]').val(), 10);
        el.find('#pace-table').empty();
        var totalDaysInMonth = moment(year + '-' + this._padDateNumbers(month) + '-' + '01').daysInMonth(); //first date of chosen month and year from select.
        var tableContent = '<tr class="font-size-16"><th width="240"></th>';
        var firstDayOfMonth = moment(year + '-' + this._padDateNumbers(month) + '-01'); //YYYY-MM-01
        var date = moment(firstDayOfMonth.format()); //important to make a clone and not modify the object firstDayOfMonth.
        var todayDate = moment().date();
        var targetPerMonth = 180;
        var ratePerDay;
        var totalWorkingDays = 0;
        var totalWorkingDaysAtBar = 0;
        var reachedBar = false;
        var chosenDateIsThisMonthAndYear = false;
        var sortedCol = col.groupBy('ufl_firm_name');
        var columnWidth = 30;
        var maxExtraTDs = 5;

        //get max hours amoung all DA's
        var maxHour = 0;
        _.each(sortedCol, function (users) {
            _.each(users, function (model) {
                if (model.get('hours') > maxHour) {
                    maxHour = model.get('hours');
                }
            });
        });

        if (month === moment().month() + 1 && year === moment().year()) {
            chosenDateIsThisMonthAndYear = true;
        }

        //paint header of table and green daily line if this month
        for (var i = 1; i <= totalDaysInMonth; i++) {
            if (date.weekday() === 0 || date.weekday() === 6) {
                //saturday or sunday
                tableContent += '<th width="' + columnWidth + '" class="c-red p-relative t-align-right">' + i;
            } else {
                totalWorkingDays += 1;
                if (reachedBar === false) {
                    totalWorkingDaysAtBar++;
                }
                if (i === todayDate && chosenDateIsThisMonthAndYear) {
                    tableContent += '<th width="' + columnWidth + '" class="p-relative t-align-right c-warning-boostrap ">' + i;
                } else {
                    tableContent += '<th width="' + columnWidth + '" class="p-relative t-align-right ">' + i;
                }
            }
            if (i === todayDate) {
                reachedBar = true;
                if (chosenDateIsThisMonthAndYear) {
                    tableContent += '<span class="p-absolute top-25 c-green-casefriend width-75 left--20 height-10 font-size-18" id="bar-target"></span>' + '<span class="p-absolute b-green-casefriend top-50 width-6 right--2 height-10 box-shadow z-index-1001" id="today-line"></span>';
                }
            }
            tableContent += '</th>';
            date = date.add(1, 'days');

            if (i === totalDaysInMonth && maxHour > 180) {
                for (var j = 0; j < maxExtraTDs; j++) {
                    // extra TD which is an estimate to support 240 hours of bar length.
                    tableContent += '<th width="' + columnWidth + '" class="p-relative c-white t-align-right">' + j + '</th>';
                }
            }
        }

        ratePerDay = targetPerMonth / totalWorkingDays;

        tableContent += '</tr><tr></tr><tr></tr>';

        var firmCounter = 0;
        var rowCounter = 0;

        //paint the DA name and bars of the graph
        _.each(sortedCol, function (users, key) {
            firmCounter++;
            tableContent += '<tr class="font-bold font-size-16"><td>' + key + '</td></tr>';
            _.each(users, function (model) {

                var dateCounter = moment(firstDayOfMonth.format()); //important to make a clone and not modify the object firstDayOfMonth.
                var amountTD = Math.floor(model.get('hours') / ratePerDay);
                amountTD = amountTD > totalDaysInMonth + maxExtraTDs ? totalDaysInMonth + maxExtraTDs - 1 : amountTD; //get max possible amount of TDS
                var realAmountTD = model.get('hours') / ratePerDay;
                tableContent += '<tr class="hover-parent"><td class="border-top-solid-white border-bottom-solid-white user-name" nowrap>' + model.get('user') + '</td>';
                rowCounter++;
                var sizeOfDecimalTDSpan;
                if (amountTD === 0) {
                    //less than a day.
                    //put hover pop up text
                    sizeOfDecimalTDSpan = Math.round(columnWidth * (realAmountTD % 1));
                    //extra decimal TD with span to paint accurate bar up until the last possible whole pixel.
                    tableContent += '<td class="p-relative">' + '<span class="display-none hover-pop">' + '<span class=" p-2 p-absolute top--40 z-index-1002  left-0 width-150 height-30 b-hover-bar border-solid-black font-size-20 t-align-center">' + model.get('hours') + ' hours</span>' + '<span class=" p-absolute arrow-down left-1 top--10 c-black z-index-1001"></span>' + '</span>' + '<span class="b-blue-graph-bar  final-bar p-absolute top-0" style="width:' + sizeOfDecimalTDSpan + 'px; height:100%;"></span>' + '</td>';
                } else {
                    //more than a day
                    for (var i = 0; i < amountTD; i++) {
                        //last td bar span.
                        if (i === amountTD - 1) {

                            if (amountTD < totalDaysInMonth && (dateCounter.weekday() === 0 || dateCounter.weekday() === 6)) {
                                //saturday or sunday paint bc hours go up to first day of next week.
                                tableContent += '<td width="30" class="b-blue-graph-bar"></td>';
                                tableContent += '<td width="30" class="b-blue-graph-bar"></td>';
                            }
                            //put hover pop up text
                            tableContent += '<td width="30" class="b-blue-graph-bar p-relative">' + '<span class="display-none hover-pop">' + '<span class=" p-2 p-absolute top--40 z-index-1002  left-0 width-150 height-30 b-hover-bar border-solid-black font-size-20 t-align-center">' + model.get('hours') + ' hours</span>' + '<span class=" p-absolute arrow-down left-1 top--10 c-black z-index-1002"></span>' + '</span>';
                            sizeOfDecimalTDSpan = 30;

                            if (model.get('hours') >= 240) {
                                tableContent += '<span class="p-absolute top-3 c-black width-75 z-index-1001 font-bold"><i class="fa fa-arrow-up p-left-5" aria-hidden="true"></i>240+</span></td>';
                            } else {
                                tableContent += '</td>';
                                sizeOfDecimalTDSpan = Math.round(columnWidth * (realAmountTD % 1));
                            }

                            if (amountTD < totalDaysInMonth && (dateCounter.weekday() + 1 === 0 || dateCounter.weekday() + 1 === 6)) {
                                //saturday or sunday
                                tableContent += '<td width="30" class="b-blue-graph-bar"></td>';
                                tableContent += '<td width="30" class="b-blue-graph-bar"></td>';
                            }

                            //extra decimal TD with span to paint accurate bar up until the last possible whole pixel.
                            tableContent += '<td class="p-relative">' + '<span class="b-blue-graph-bar final-bar p-absolute top-0" style="width:' + sizeOfDecimalTDSpan + 'px; height:100%;"></span>' + '</td>';
                        } else {
                            if (dateCounter.weekday() === 0 || dateCounter.weekday() === 6) {
                                //saturday or sunday
                                if (amountTD < totalDaysInMonth + 4) {
                                    amountTD++;
                                }
                            }
                            tableContent += '<td width="30" class="b-blue-graph-bar"></td>';
                        }
                        dateCounter = dateCounter.add(1, 'days');
                    }
                }

                tableContent += '</tr><tr></tr>';
            });
        });

        el.find('#pace-table').html(tableContent);

        //if this month then paint green pacing bar.
        if (chosenDateIsThisMonthAndYear) {
            var paceTable = document.getElementById('pace-table');
            var lineHeight = paceTable.offsetHeight - 50;
            el.find('#today-line').css('height', lineHeight + 'px');
            var barTarget = Math.round(ratePerDay * totalWorkingDaysAtBar);
            el.find('#bar-target').html(barTarget + ' hrs');
        }
    }
});
