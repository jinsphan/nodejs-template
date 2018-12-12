$(document).ready(function () {
    /*
        -------------------------------------
        Open multiple modal
    */
    $(document).on('show.bs.modal', '.modal', function (event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length) - 2;
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
    /*
        --------------------------------------
        End multiple modal
    */
    $('#myNavba').on('click', '#accountModalLink', function (e) {
        $("#OverViewLink").tab("show");
        $('#collapseAccountOverViewTab a:first').tab('show');
        ajaxGetOverviewTab({
            duration: 'day'
        });
    });


    $("ul.nav-tabs a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $("#WalletLink").click(function (e) {
        let _wallet_list = $("#wallet-list");
        let _wallet_detail = $("#wallet-detail");
        _wallet_list.hasClass('hidden') && _wallet_list.removeClass('hidden');
        _wallet_detail.addClass('hidden');
    });
    $("button.show-wallet-detail").click(function (e) {
        $("#wallet-detail .tabbable").removeClass('hidden');
        // $("#wallet-detail .title").text($(this).attr('alt').toUpperCase() + ' Wallet');
        let _wallet_list = $("#wallet-list");
        let _wallet_detail = $("#wallet-detail");
        _wallet_list.addClass('hidden');
        _wallet_detail.hasClass('hidden') && _wallet_detail.removeClass('hidden');
        $("#WalletHistoryLink").tab("show");
        if ($(this).attr('alt') == 'pins') {
            $("#wallet-detail .tabbable").addClass('hidden');
        }
        new WalletManager().handlerEventWallet($(this).attr('alt'));
    });

    // Responsive
    var $window = $(window);
    var $pane = $('#pane1');
    var _showMobile = $('#accountModal .show-mobile');
    var _collapseTab = $('#accountModal .nav.nav-tabs');

    function checkWidth() {
        var windowsize = $window.width();
        let OverviewTradeHistoryTableBonusCol = $(`#OverviewTradeHistoryTable thead tr th`);
        if (windowsize < 768) {
            _showMobile.css('display', 'initial');
            _collapseTab.removeClass('in');
            _collapseTab.css('height', 'auto');

            // hidden item isMobile
            OverviewTradeHistoryTableBonusCol.length > 0 && $(OverviewTradeHistoryTableBonusCol[4]).css('display', 'none');

        } else {

            _showMobile.css('display', 'none');
            _collapseTab.addClass('in');

            // show item isDesktop
            OverviewTradeHistoryTableBonusCol.length > 0 && $(OverviewTradeHistoryTableBonusCol[4]).removeAttr('style');
        }
    }
    // Execute on load
    checkWidth();
    // Bind event listener
    $(window).resize(checkWidth);




    /*
        -------------------------------------------------
        SUPPORT TAB
    */


    // reset form 
    $("#Support").on('click', '#btnNewSupportModal', function () {
        $('#addNewSupportForm')[0].reset();
        $("#addNewSupportMsg").html('');
        $("#newSupportModal").modal("show");
    });

    // add new support
    $("#addNewSupportForm").submit(function (e) {
        var form = $(this);
        var url = form.attr('action');
        $("#addNewSupportMsg").html('');
        $(".btnAddNewSupport").prop('disabled', true);
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function (data) {
                let _html;
                if (!data.success) {
                    _html = `<div class="alert alert-danger" role="alert">${data.message}</div>`;
                } else {
                    _html = `<div class="alert alert-success" role="alert">${data.message}, <a href="#" data-dismiss="modal">Close</a></div>`;
                    loadDataSupport();
                    $("#addNewSupportForm")[0].reset();
                }
                $("#addNewSupportMsg").html(_html);
                $(".btnAddNewSupport").prop('disabled', false);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                $("#addNewSupportMsg").html(`<div class="alert alert-danger" role="alert">Server error</div>`)
                $(".btnAddNewSupport").prop('disabled', false);
            }
        });
        e.preventDefault();
    });

    // load data support
    $("#accountModal").on('click', '#SupportNavTab', function (e) {
        loadDataSupport();
    });

    function loadDataSupport() {
        $.ajax({
            type: "GET",
            url: '/api/support',
            success: function (res) {
                res.success && res.data && ($(".supportDataCount").html(res.data.length))
                addDataToSupportTable(res.success ? res.data.length > 0 ? res.data : 'No Data' : res.message)
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                addDataToSupportTable('Server error');
            }
        });
    }

    function addDataToSupportTable(data) {
        let _html = [];
        if ($.isArray(data)) {
            $.each(data, function (index, value) {
                _html.push(`
                    <tr>
                        <td width="20%">${value.email}</td>
                        <td width="40%">${value.message}</td>
                        <td>${value.answer}</td>
                    </tr>
                `);
            });
        } else {
            _html.push(`<tr><td colspan="3" class="text-center">${data}</td></tr>`);
        }
        $("#supportTable tbody").html(_html);
    }

    /*
        END SUPPORT TAB
        -------------------------------------------------
    */



    /*
        GET DEFAULT DATA WHEN TAB ACTIVE
        -------------------------------------------------
    */

    $(document).on('shown.bs.tab', '#collapseaccountModalTab a[data-toggle="tab"]', function (e) {
        var target = $(e.target).attr("href") // activated tab
        if (target === '#Leaderboard') {
            ajaxGetDefaultDataTab(`/api/leader-board?type=monthly`, 'LeaderBoardTable-month', ['username', 'total_bet', 'player_gross_profit', 'games'])
            ajaxGetDefaultDataTab('/api/leader-board?type=all', 'LeaderBoardTable', ['username', 'total_bet', 'player_gross_profit', 'games'])
        } else if (target === '#OverView') {
            $('#collapseAccountOverViewTab a:first').tab('show');
            ajaxGetOverviewTab({
                duration: 'day'
            });
        }
    });

    // OVERVIEW TAB
    $(document).on('shown.bs.tab', '#collapseAccountOverViewTab a[data-toggle="tab"]', function (e) {
        var target = $(e.target).attr("href") // activated tab
        let params;
        switch (target) {
            case '#OverViewWeak':
                var now = moment();
                var monday = now.clone().weekday(1);
                params = {
                    from: monday.format('YYYY-MM-DD[T]00:00:00.000[Z]'),
                    to: now.toISOString(),
                    duration: 'week'
                };
                break;
            case '#OverViewMonth':
                var now = moment();
                var monthStart = now.clone().startOf('month');
                params = {
                    from: monthStart.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'),
                    to: now.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'),
                    duration: 'month'
                };
                break;
            case '#OverViewToday':
                params = {
                    duration: 'day'
                };
                break;
            default:
                break;
        }
        ajaxGetOverviewTab(params);
    });

    $("#collapseAccountOverViewTab").on('click', '#OverViewSearchLink', function () {
        $('#overViewSearchFrom').attr('max', moment().format('YYYY-MM-DD'))
        $("#OverViewSearchModal").modal("show");
    });

    $("#overViewSearchFrom").on("change", function () {
        $('#overViewSearchTo').val('')
        $('#overViewSearchTo').attr('min', this.value)
        $('#overViewSearchTo').attr('max', moment().format('YYYY-MM-DD'))
        $('#overViewSearchTo').prop('disabled', false);
    });

    $("#overViewSearchChooseForm").submit(function (e) {
        let _from = $("#overViewSearchFrom").val();
        let _to = $("#overViewSearchTo").val();
        let params = {
            from: moment(_from).format('YYYY-MM-DD[T]00:00:00.000[Z]'),
            to: moment(_to).format('YYYY-MM-DD[T]23:59:59.999[Z]'),
            duration: "month"
        }
        ajaxGetOverviewTab(params);
        $("#OverViewSearch").tab("show");
        $("#OverViewSearchModal").modal("hide");
        e.preventDefault();
    });

    function ajaxGetDefaultDataTab(url, tableName, fields) {
        $(`#${tableName} tbody`).html(`<tr><td colspan="${fields.length}"><i class="fas fa-spinner fa-spin"></i> Loading</td></tr>`);
        $.ajax({
            type: "GET",
            url: url,
            success: function (res) {
                res.data = res.data.map(it => {
                    return {
                        ...it,
                        player_gross_profit: it.player_gross_profit.toFixed(2)
                    }
                })

                let _row = [];
                if (res.success) {
                    if (res.data.length > 0) {
                        res.data.map((v, k) => {
                            let _col = `<td>${k + 1}</td>`;
                            fields.map((v1, k1) => {
                                _col += `<td>${v1.split('.').reduce((o, i) => o[i], v)}</td>`;
                            })
                            _row.push(`<tr>${_col}</tr>`)
                        });
                    } else {
                        _row = `<tr><td colspan="${fields.length}">No Data</td></tr>`;
                    }
                } else {
                    _row = `<tr><td colspan="${fields.length}" class="text-danger">Error loading data</td></tr>`;
                }
                $(`#${tableName} tbody`).html(_row);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
            }
        });
    }

    function ajaxGetOverviewTab(params) {
        let _time = params ? `${moment(params.from).format('DD/MM/YYYY')} - ${moment(params.to).format('DD/MM/YYYY')}` : moment().format('DD/MM/YYYY');
        $('.overviewTime').html(_time);

        if (!params.from) {
            // search today
            params = {
                ...params,
                from: moment().format('YYYY-MM-DD[T]00:00:00.000[Z]'),
                to: moment().format('YYYY-MM-DD[T]23:59:59.999[Z]'),
            };
        }

        // get overview
        $.ajax({
            type: "GET",
            url: `/api/overview?${$.param(params)}`,
            success: function (res) {
                if (res.success) {
                    Object.keys(res.data).forEach(function (key) {
                        $(`#OverviewTable #${key}Field`).html(res.data[key] ? res.data[key] : "0");
                    });
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
            }
        });

        // get overview trade history
        let OverviewTradeHistoryTableCountCol = $(`#OverviewTradeHistoryTable thead tr th`).length;
        $(`#OverviewTradeHistoryTable tbody`).html(`<tr><td colspan="${OverviewTradeHistoryTableCountCol}"><i class="fas fa-spinner fa-spin"></i> Loading</td></tr>`);

        $.ajax({
            type: "GET",
            url: `/api/overview-trade-history?${$.param(params)}`,
            success: function (res) {
                if (res.success) {
                    let _tr;
                    if (res.data.length > 0) {
                        res.data.forEach(function (item, k) {
                            _tr += `
                            <tr>
                                <td>${k + 1}</td>
                                <td>${item.bet.toFixed(2)}</td>
                                <td>${(item.auto_cash_out / 100).toFixed(2)}</td>
                                <td>${(item.cashed_out / 100).toFixed(2)}</td>
                                <td>${item.bonus.toFixed(2)}</td>
                                <td>${item.profit.toFixed(2)}</td>
                                <td>${item.player_gross_profit.toFixed(2)}</td>
                                <td>${item.player_net_profit.toFixed(2)}</td>
                                <td>${item.created_at}</td>
                            </tr>
                            `;
                        });
                    } else {
                        _tr = `<tr><td colspan="${OverviewTradeHistoryTableCountCol}">No Data</td></tr>`;
                    }
                    $(`#OverviewTradeHistoryTable tbody`).html(_tr)
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
            }
        });


    }

    /*
        END GET DEFAULT DATA WHEN TAB ACTIVE
        -------------------------------------------------
    */

});
