/// <reference path="./types/sparkline.d.ts" />
import * as $ from 'jquery';
import {DATA_TABLE_COLUMNS} from './data-table-columns';
import {App} from './common/app-config';
import {Amazon} from './amazon';

export class BlackBoxDataTable {
    private isInitialized = false;
    private $blackBoxTable = $('#black-box-table');
    currentMarketplaceId: string;
    private config = {
        bInfo: false,
        paging: false,
        searching: false,
        autoWidth: true,
        deferRender: true,
        scrollY: '325',
        scrollX: true,
        scrollCollapse: true,
        scroller: true,
        fixedColumns: {
            leftColumns: 4,
            rightColumns: 1
        },
        createdRow: this.getCreatedRow,
        rowCallback: this.getRowCallback,
        columns: DATA_TABLE_COLUMNS,
    };

    constructor(private amazon: Amazon) {
        this.currentMarketplaceId = amazon.getCurrentMarketplaceId();
    }

    initialize() {
        if (this.isInitialized) {
            return;
        }

        this.isInitialized = true;
        this.initializeBlackBoxTable();
    }

    private getCreatedRow(row, data, dataIndex) {
        $(row)
            .addClass('asin-row-' + data['key'])
            .data('asin', data['key'])
            .data('imageUrl', data['imageUrl'])
            .data('isSponsored', data['isSponsored'])
            .data('isLimit', data['isLimit'])
            .data('error', data['error'])
            .data('position', data['Include in analysis']);

        if (data['imageUrl']) { // preload images
            const img = new Image();
            img.src = data['imageUrl'];
        }


        if (data.chartPoints) {
            this.showGraph(data, row);
        }

        // @ts-ignore
        const cacheKey = asinCachePrefix + data['key'];
        chrome.storage.local.get(cacheKey, asinResult => {
            if (Object.keys(asinResult).length) {
                // @ts-ignore
                updateRowData(row, asinResult[cacheKey]);
            } else {
                console.log('cache error for ' + cacheKey);
            }
        });


    }

    private getRowCallback(row, data, displayNum, displayIndex, dataIndex) {

        if (data.SellersNumber < 0) {
            $(row).find('td.h10-bb-sellers-number').html('<span style="color:#999">n/a</span>');
        }

        if (!data.Revenue) {
            const $revenueRow = $(row).find('td.h10-bb-monthly-revenue');
            $revenueRow.html('<span style="color:#999">n/a</span>');
            if (!$revenueRow.hasClass('tooltipstered')) {
                // @ts-ignore
                $revenueRow.tooltipster({
                    content: data['error']
                });
            }

        }
        if (!data.BSR) {
            const $bsrRow = $(row).find('td.h10-bb-bsr');
            $bsrRow.html('<span style="color:#999">n/a</span>');
            if (!$bsrRow.hasClass('tooltipstered')) {
                // @ts-ignore
                $bsrRow.tooltipster({
                    content: data['error']
                });
            }
        }
        if (!data.Sales) {
            const $salesRow = $(row).find('td.h10-bb-sales');
            $salesRow.html('<span style="color:#999">n/a</span>');
            if (!$salesRow.hasClass('tooltipstered')) {
                // @ts-ignore
                $salesRow.tooltipster({
                    content: data['error']
                });
            }

        }
    }

    private initializeBlackBoxTable() {
        // @ts-ignore
        this.$blackBoxTable.DataTable(this.config);
    }

    private showGraph(data, row) {
        const $rowGraph = $(row).find('td.h10-bb-salesGraph');
        if ($rowGraph.is(':visible')) {
                $rowGraph.sparkline(data.chartPoints, {
                type: 'line',
                lineColor: '#a3bff6',
                fillColor: '#ebf1fe',
                lineWidth: 1,
                spotColor: '#a3bff6',
                minSpotColor: '#a3bff6',
                maxSpotColor: '#a3bff6',
                highlightSpotColor: '#a3bff6',
                highlightLineColor: '#a3bff6',
                spotRadius: 0,
                disableTooltips: true,
                disableInteraction: true,
                height: 19
            });
        /*} else {
            setTimeout(function () {
                this.showGraph(data, row);
            }, 1000);*/
        }
    }

    private eventHandler() {
        let $loadMoreRowsButtonContainer: JQuery<HTMLElement>;
        this.$blackBoxTable
            .on('preDraw.dt', () => {
                $loadMoreRowsButtonContainer = $('#h10-bb-load-second-page').clone();
            })
            .on('draw.dt', () => {
                if ($loadMoreRowsButtonContainer.length && !$('#h10-bb-load-second-page').length) {
                    $('.DTFC_ScrollWrapper').append($loadMoreRowsButtonContainer);
                    //$('.dataTables_scroll tfoot').append($loadMoreRowsButtonContainer);
                    //$('.DTFC_LeftBodyLiner table').append('<tr><td colspan="4">&nbsp;</td></tr>');
                    //$('.DTFC_RightBodyLiner table').append('<tr><td>&nbsp;</td></tr>');

                }
                $('.DTFC_LeftBodyLiner td.h10-bb-brand div').tooltipster();
                $('.DTFC_LeftBodyLiner td.h10-bb-title div').tooltipster();
                $('.DTFC_RightBodyLiner td.h10-bb-pin').tooltipster({
                    content: 'Save to my list'
                });
            });

        const tooltipsterTimer = setTimeout(() => {
            $('th.h10-bb-seller').tooltipster({
                content: 'BuyBox owner'
            });
            $('th.h10-bb-sellers-number').tooltipster({
                content: 'Number of active sellers'
            });
            $('th.h10-bb-fulfillment').tooltipster({
                content: 'Fulfillment: Amz (Amazon), FBA (Fulfilled by Amazon) or MFN (Fulfilled by seller/manufacturer)'
            });
            $('th.h10-bb-unit-margin').tooltipster({
                content: 'Estimated FBA fee'
            });
            $('th.h10-bb-bsr').tooltipster({
                content: 'Recent BSR (Click for trend chart)'
            });
            $('th.h10-bb-sales').tooltipster({
                content: 'Estimated number of sales over the last 30 days'
            });
            $('th.h10-bb-monthly-revenue').tooltipster({
                content: 'Estimated revenue over the last 30 days'
            });
            $('th.h10-bb-rating').tooltipster({
                content: 'Amazon star rating'
            });
            $('th.h10-bb-reviews').tooltipster({
                content: 'Total number of reviews'
            });
            $('th.h10-bb-reviews-velocity').tooltipster({
                content: 'Change in review count over the last 30 days'
            });

            clearTimeout(tooltipsterTimer);
        }, 500);

        $(document).on('click', '.h10-bb-settings', () => {
            $('.h10-bb-settings-popup').toggleClass('hide');
        });

        $(document).on('click', 'td.h10-bb-bsr', () => {
            const parentTr = $(this).parent();
            const baseGraphUrl = 'https://systems.helium10.com' + '/chart/index?asin=' + parentTr.data('asin') + '&range=30&marketplace=' + this.currentMarketplaceId;
            $('#h10-bb-graph-popup-spinner').show();
            $('.h10-bb-graph-popup-header-title').html('<strong>BSR Chart</strong> ');
            $('.h10-bb-graph-popup-header-title').append(parentTr.find('.h10-bb-title').text());
            $('.h10-bb-graph-popup').removeClass('hide');
            $('#black-box-tab').css('opacity', 0.2);
            setTimeout(() => {
                $('#h10-bb-graph-popup-spinner').hide();
                $('#h10-bb-10-chart-iframe').show();
                $('#h10-bb-10-chart-iframe').attr('src', baseGraphUrl);
            }, 1000);

        });

        $(document).on('click', 'td.h10-bb-reviews', () => {
            const parentTr = $(this).parent();
            const baseGraphUrl = 'https://members.helium10.com/black-box/review-chart?asin=' + parentTr.data('asin') + '&range=30&marketplace=' + this.currentMarketplaceId;
            $('#h10-bb-graph-popup-spinner').show();
            $('.h10-bb-graph-popup-header-title')
                .html('<strong>Reviews Chart</strong> ')
                .append(parentTr.find('.h10-bb-title').text());
            $('.h10-bb-graph-popup').removeClass('hide');
            $('#black-box-tab').css('opacity', 0.2);
            setTimeout(() => {
                $('#h10-bb-graph-popup-spinner').hide();
                $('#h10-bb-10-chart-iframe')
                    .show()
                    .attr('src', baseGraphUrl);
            }, 1000);

        });
        $(document).on('click', ' td.h10-bb-salesGraph', () => {
            if (!$(this).find('canvas').get(0)) {
                return false;
            }
            const parentTr = $(this).parent();
            const baseGraphUrl = 'https://members.helium10.com/black-box/sales-chart?days=30&asin=' + parentTr.data('asin') + '&marketplace=' + this.currentMarketplaceId;
            $('#h10-bb-10-chart-iframe').attr('src', baseGraphUrl);
            $('#h10-bb-graph-popup-spinner').show();
            setTimeout(() => {
                $('#h10-bb-graph-popup-spinner').hide();
                $('#h10-bb-10-chart-iframe').show();
            }, 2000);
            $('.h10-bb-graph-popup-header-title').html('<strong> Sales Chart </strong>');
            $('.h10-bb-graph-popup-header-title').append(parentTr.find('.h10-bb-title').text());
            $('.h10-bb-graph-popup').removeClass('hide');
            $('#black-box-tab').css('opacity', 0.2);

        });
        $(document).on('click', '.h10-bb-graph-popup-header-close', () => {
            $('#h10-bb-10-chart-iframe').attr('src', null).hide();
            $('#h10-bb-graph-popup-spinner').show();
            $('.h10-bb-graph-popup').addClass('hide');
            $('#black-box-tab').css('opacity', 1);

        });
        $(document).on('click', '.container6', event => {
            const $target = $(event.target);
            try {
                if (
                    $target.parent().find('canvas').get(0)
                    // || ($target.attr('class') && $target.attr('class').includes('h10-bb-graph-popup'))
                    // || ($target.attr('class') && $target.attr('class').includes('h10-bb-bsr'))
                ) {
                    return false;
                }
            } catch (e) {
                console.log(e);
            }

            $('#h10-bb-10-chart-iframe').attr('src', null).hide();
            $('.h10-bb-graph-popup').addClass('hide');
            $('#h10-bb-graph-popup-spinner').show();
            $('#black-box-tab').css('opacity', 1);
        });

        $(document).on('click', '.h10-bb-screenshot-action', () => {
            let tableData = [];
            let rowData = [];
            $('#black-box-table thead th').each(() => {
                if ($(this).is('.h10-bb-pin')) {
                    // return true;
                    return;
                }
                if ($(this).hasClass('h10-bb-fulfillment')) {
                    rowData.push('Fulfillment');
                } else {
                    rowData.push($(this).text().trim());
                }
            });
            tableData.push(rowData);
            $('#black-box-table tbody tr').each(() => {
                if ($(this).attr('id') == 'bb-graph-wrapper') {
                    // return true;
                    return;
                }
                if ($(this).attr('id') == 'h10-bb-load-second-page') { // skip load more results button
                    // return true;
                    return;
                }
                rowData = [];
                let isLimit = $(this).data('isLimit');
                $(this).find('td').each(() => {
                    if ($(this).is('.h10-bb-pin')) {
                        // return true;
                        return;
                    }

                    if ($(this).hasClass('h10-bb-salesGraph')) {
                        if ($(this).find('canvas').get(0)) {
                            // @ts-ignore
                            rowData.push(($(this).find('canvas').get(0) as HTMLCanvasElement).toDataURL());
                        } else {
                            rowData.push('');
                        }
                        // return true;
                        return;
                    }
                    let cellText = $(this).text().trim();
                    if ($(this).is('.h10-bb-price , .h10-bb-sales , .h10-bb-bsr , .h10-bb-monthly-revenue , .h10-bb-unit-margin , .h10-bb-fulfillment') && isLimit) {
                        cellText = 'Xray limit reached';
                    }
                    if ($(this).is('.h10-bb-asin , .h10-bb-brand , .h10-bb-title , .h10-bb-seller , .h10-bb-category ')) {
                        cellText = '[blur]';
                    }
                    rowData.push(cellText);
                });
                tableData.push({
                    isSponsored: $(this).data('isSponsored'),
                    rowData: rowData
                });
            });


            const save = {
                'screenshot-data': tableData,
                'search-volume': $('#h10-bb-search-volume').text()
            };
            chrome.storage.local.set(save, () => {
                chrome.runtime.sendMessage({
                    type: 'get-screenshot-page'
                });
            });

        });

        $(document).on('click', '.h10-bb-csv-action', () => {
            let initialCsvString = '';
            $('#black-box-table th').each(() => {
                const headerText = $(this).text().trim();
                if (!$(this).hasClass('h10-bb-salesGraph') && !$(this).hasClass('h10-bb-inc-in-analysis-wrapper')) {// skip graph and num
                    if ($(this).hasClass('h10-bb-fulfillment')) {
                        initialCsvString += 'Fulfillment ,';
                    } else {
                        initialCsvString += headerText + ',';
                    }
                }
            });
            initialCsvString += '\r\n';
            $('#black-box-table tbody tr').each(() => {
                const isSponsored = $(this).data('isSponsored');
                const isLimit = $(this).data('isLimit');
                $(this).find('td').each(() => {
                    if ($(this).attr('colspan')) { // skip load more results button
                        return;
                    }
                    let cellText = $(this).text().trim();
                    if (!$(this).hasClass('h10-bb-salesGraph')
                        && !$(this).hasClass('h10-bb-inc-in-analysis-wrapper')) {// skip graph and num
                        if ($(this).is('.h10-bb-title , .h10-bb-seller , .h10-bb-brand , .h10-bb-category')) {
                            cellText = cellText.replace(/"/g, '""');
                            if (isSponsored) {
                                cellText = '($) ' + cellText;
                            }
                            cellText = '"' + cellText + '"';
                        }
                        if ($(this).is('.h10-bb-price , .h10-bb-reviews , .h10-bb-sales , .h10-bb-bsr , .h10-bb-monthly-revenue , .h10-bb-unit-margin')) {
                            cellText = cellText.replace(/[^0-9.-]+/g, '');
                        }
                        if ($(this).is('.h10-bb-price , .h10-bb-sales , .h10-bb-bsr , .h10-bb-monthly-revenue , .h10-bb-unit-margin , .h10-bb-fulfillment') && isLimit) {
                            cellText = 'Xray limit reached';
                        }

                        initialCsvString += cellText + ',';

                    }
                });
                initialCsvString += '\r\n';
            });
            const filename = 'Helium_10_Xray_export.csv';
            const blob = new Blob([initialCsvString], {type: 'text/csv;charset=utf-8;\uFEFF'});
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        $(document).on('click', 'td.h10-bb-pin', () => {
            const $pinIcon = $(this).find('i');
            const parentAsin = $('#black-box-table .' + $(this).parent('tr').attr('class').replace(/^(\S*).*/, '$1')).first().data('asin');
            $pinIcon.toggleClass('clicked');
            if ($pinIcon.hasClass('clicked')) {
                $.ajax({
                    method: 'POST',
                    url: App.config.memberAccountUrl + '/black-box/add-to-list',
                    dataType: 'json',
                    data: {
                        asin: parentAsin,
                        marketplace: this.currentMarketplaceId
                    }
                })
                    .done(response => {
                        console.log('response', response);
                    });
            } else {
                $.ajax({
                    method: 'POST',
                    url: App.config.memberAccountUrl + '/black-box/remove-from-list',
                    dataType: 'json',
                    data: {
                        asin: parentAsin,
                        marketplace: this.currentMarketplaceId
                    }
                })
                    .done(response => {
                        console.log('response', response);
                    });
            }

        });
        $(document).on('mouseover', '.DTFC_LeftBodyWrapper td.h10-bb-asin', () => {
            const $initialParentRow = $('#black-box-table .' + $(this).parent('tr').attr('class').replace(/^(\S*).*/, '$1')).first();
            const title = $initialParentRow.find('.h10-bb-title').text();
            const reviewsRating = $initialParentRow.find('.h10-bb-rating').text();
            const reviewsCount = $initialParentRow.find('.h10-bb-reviews').text();
            const price = $initialParentRow.find('.h10-bb-price').text();
            const imageUrl = $initialParentRow.data('imageUrl');
            $('.h10-bb-asin-preview img.h10-bb-asin-preview-img').attr('src', imageUrl);
            // @ts-ignore
            $('.h10-bb-asin-preview-rating').raty({
                score: reviewsRating,
                readOnly: true,
                hints: null
            });
            $('.h10-bb-asin-preview-title').text(title);
            $('.h10-bb-asin-preview-rating-count').text(reviewsCount);
            $('.h10-bb-asin-preview-price').text(price);
            $('.h10-bb-asin-preview').removeClass('hide');
        });
        $(document).on('mouseout', '.DTFC_LeftBodyWrapper td.h10-bb-asin', () => {
            $('.h10-bb-asin-preview').addClass('hide');
        });
    }


}
