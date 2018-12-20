const settingsImage = chrome.extension.getURL('html/images/svg/setting.svg');

export const DATA_TABLE_COLUMNS = [
    {
        name: '#',
        data: 'Include in analysis',
        title: '#',
        className: 'h10-bb-inc-in-analysis-wrapper'
    },
    {
        name: 'ASIN',
        data: 'ASIN',
        title: 'ASIN',
        className: 'h10-bb-asin',
        render: function (data) {
            return '<a href="/dp/' + data + '" target="_blank" > ' + data + '</a>';
        }
    },
    {
        name: 'Brand',
        data: 'Brand',
        title: 'Brand',
        className: 'h10-bb-brand',
        render: function (data, type, full, meta) {
            return '<div  title="' + data + '"> ' + data + '</div>';
        }

    },
    {
        name: 'Title',
        data: 'Title',
        title: 'Title',
        className: 'h10-bb-title',
        render: function (data, type, full, meta) {
            if (full.isSponsored) {
                // @ts-ignore
                return '<div title=\'' + data + '\'> ' + sponsoredImageHtml + data + '</div>';
            } else {
                return '<div title=\'' + data + '\'> ' + data + '</div>';
            }

        }
    },
    {
        name: 'Category',
        data: 'Category',
        title: 'Category',
        className: 'h10-bb-category',
        render: function (data, type, full, meta) {
            return '<div title="' + data + '"> ' + data + '</div>';
        }

    },
    {
        name: 'Seller',
        data: 'Seller',
        title: 'BuyBox',
        className: 'h10-bb-seller'
    },
    {
        name: 'SellersNumber',
        data: 'SellersNumber',
        title: '#',
        className: 'h10-bb-sellers-number',
        orderable: true
    },
    {
        name: 'Fulfillment',
        data: 'Fulfillment',
        title: '<i class="fa fa-truck" aria-hidden="true"></i>',
        className: 'h10-bb-fulfillment',
        render: function (data) {
            switch (data) {
                case 1 :
                    return 'AMZ';
                case 2 :
                    return 'FBA';
                case 3 :
                    return 'MFN';
                case 4:
                    return '<span class="h10-bb-blur">FLF</span>';
                default :
                    return 'N/A';
            }
        }
    },
    {
        name: 'Price',
        data: 'Price',
        title: 'Price',
        className: 'h10-bb-price',
        orderSequence: ['desc', 'asc'],
        render: function (data) {
            if (data > 1000) {
                // @ts-ignore
                data = data.toLocaleString(getCurrentLocale().locale, {
                    style: 'currency',
                    // @ts-ignore
                    currency: getCurrentLocale().currency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            } else {
                // @ts-ignore
                data = data.toLocaleString(getCurrentLocale().locale, {
                    style: 'currency',
                    // @ts-ignore
                    currency: getCurrentLocale().currency
                });
            }
            return data;
        }
    },
    {
        name: 'Margin',
        data: 'Margin',
        title: 'FBA fee',
        className: 'h10-bb-unit-margin',
        orderSequence: ['desc', 'asc'],
        render: function (data) {
            // @ts-ignore
            return data.toLocaleString(getCurrentLocale().locale, {
                style: 'currency',
                // @ts-ignore
                currency: getCurrentLocale().currency
            });
        }

    },
    {
        name: 'Sales',
        data: 'Sales',
        title: 'Sales',
        className: 'h10-bb-sales',
        orderSequence: ['desc', 'asc'],
        render: function (data) {
            // @ts-ignore
            return data.toLocaleString(getCurrentLocale().locale);
        }

    },
    {
        name: 'Sales 30',
        data: 'Sales 30',
        title: 'Sales <i class="fa fa-line-chart"></i>',
        className: 'h10-bb-salesGraph',
        orderable: false
    },

    {
        name: 'Revenue',
        data: 'Revenue',
        title: 'Revenue',
        className: 'h10-bb-monthly-revenue',
        orderSequence: ['desc', 'asc'],
        render: function (data) {
            // @ts-ignore
            return data.toLocaleString(getCurrentLocale().locale, {
                minimumFractionDigits: 2,
            });
        }

    },
    {
        name: 'BSR',
        data: 'BSR',
        title: 'BSR <i class="fa fa-line-chart"></i>',
        className: 'h10-bb-bsr',
        render: function (data) {
            // @ts-ignore
            return data.toLocaleString(getCurrentLocale().locale);
        }
    },
    {
        name: 'Rating',
        data: 'Rating',
        title: 'Rating',
        className: 'h10-bb-rating'
    },
    {
        name: 'Reviews',
        data: 'Reviews',
        title: 'Review Count <i class="fa fa-line-chart"></i>',
        className: 'h10-bb-reviews',
        render: function (data) {
            // @ts-ignore
            return data.toLocaleString(getCurrentLocale().locale);
        }
    },
    {
        name: 'Review Velocity',
        data: 'Review Velocity',
        title: 'Review Velocity',
        className: 'h10-bb-reviews-velocity',
        render: function (data) {
            // @ts-ignore
            if (!Number.isInteger(data)) {
                return '<span style="color:#999">n/a</span>';
            }
            let color = '#999';
            if (data > 0) {
                color = '#62cb31';
            }
            if (data < 0) {
                color = '#e74c3c';
            }
            return '<span style="color:' + color + '">' + data + '</span>';
        }
    },
    {
        name: 'Dimensions',
        data: 'Dimensions',
        title: 'Dimensions',
        className: 'h10-bb-dimensions',
        render: function (data) {
            return data.toString();
        }

    },
    {
        name: 'Weight',
        data: 'Weight',
        title: 'Weight',
        className: 'h10-bb-weight',
        render: function (data) {
            return data.toString();
        }

    },
    {
        name: 'Size Tier',
        data: 'Size Tier',
        title: 'Size Tier',
        className: 'h10-bb-size-tier',
        render: function (data) {
            return data.toString();
        }

    },
    {
        name: 'Images',
        data: 'Images',
        title: 'Images',
        className: 'h10-bb-images',
        render: function (data) {
            return data.toString();
        }

    },
    {
        name: 'Pin',
        data: 'Pin',
        // @ts-ignore
        title: '<img class="h10-bb-settings" src="' + settingsImage + '" height="20px" alt=""/>',
        className: 'h10-bb-pin',
        orderable: false,
        render: function (data, type, full, meta) {
            return '<i class="fa fa-thumb-tack"></i>';

        }
    }
];
