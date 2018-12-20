export class AmazonProductPage  {
    price: string;
    private App: any;


    setStateData() {
        // @ts-ignore
        let detailPage = window.DetailPage;
        const body = document.getElementsByTagName('body')[0];
        try {
            if (detailPage && detailPage.StateController) {
                body.setAttribute('data-h10-detail-state', JSON.stringify(detailPage.StateController.getState()));
            } else {
                body.setAttribute('data-h10-detail-state', '0');
            }
        } catch (e) {
            console.log(e);
        }
    }

    startPageUpdate() {
        console.log('start update');
        $('#helium-fees-wrapper').remove();
        $('#helium-seller-info').remove();
        // @ts-ignore
        const marketplaceId = getCurrentMarketplaceId();

        const extensionId = chrome.runtime.id;
        setTimeout(function () {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            // @ts-ignore
            script.text = setStateData + 'setStateData()';
            document.body.appendChild(script);
        }, 0);

        const parseProductAsin = window.location.href.match(/\/(dp|product|asin)\/([0-9A-Za-z]{10,})/);
        let asin = '';
        if (parseProductAsin !== null) {
            asin = parseProductAsin[2].toUpperCase();
        } else {
            return false;
        }
        let currentAsin = '';
        let price = $('#actualPriceValue').text() ||
            $('#priceblock_ourprice').text() ||
            $('#priceblock_saleprice').text() ||
            $('#priceBlock .priceLarge').text() ||
            $('#buyNewSection .a-color-price.offer-price').text() ||
            $('.p13n-sc-price').eq(1).text();

        const priceRegex = /(\$|€|£|CDN\$\s|EUR\s)[0-9,.]+/i;
        const currencyRegex = /(\$|€|£|CDN\$\s|EUR\s)/i;
        const thousandSeparatorRegex = /(\d+)[,.](?=\d{3}(\D|$))/g;

        price = price.match(priceRegex) ? price.match(priceRegex)[0] : '';
        price = price.replace(currencyRegex, '');
        price = price.replace(thousandSeparatorRegex, '$1');
        price = price.replace(',', '.');

        this.price = price ? price : null;

        setTimeout(function () {
            let bodyData = null;
            try {
                const $body = $('body');
                if ($body.attr('data-h10-detail-state')) {
                    bodyData = JSON.parse($body.attr('data-h10-detail-state'));
                }
            } catch (e) {
                console.log('error', e);
            }
            let additionalAsins = {};
            if (bodyData && bodyData.current_asin) {
                currentAsin = bodyData.current_asin;
                if (bodyData.parent_asin) {
                    additionalAsins['parent'] = bodyData.parent_asin;
                }
                if (bodyData.asin_variation_values) {
                    additionalAsins['variations'] = bodyData.asin_variation_values;
                }
            }

            if (currentAsin) {
                displayChart(currentAsin);
                displayCalculator(currentAsin, price);
            } else {
                displayChart(asin);
                displayCalculator(asin, price);
            }

        }, 0);

        let sellerId = '';

        $('#merchant-info a').each(function () {
            // @ts-ignore
            if ($(this).attr('href').includes('gp/help/seller/at-a-glance.html')) {
                const tmpSellerId = new URLSearchParams($(this).attr('href')).get('seller');
                if (tmpSellerId && tmpSellerId !== 'A2L77EE7U53NWQ') {
                    sellerId = tmpSellerId;
                }
            }
        });

        function showBrands(brandsScraped) {

            const $brandsContainer = $('#helium-brands-info');
            $('#helium-brands-counter').text('(' + brandsScraped.total + ')');

            $brandsContainer.append($('<ul>')).append($('<ul>')).append($('<ul>')).append($('<ul>'));
            let counter = 0;
            let totalBrandsCounter = 0;
            for (let brand in  brandsScraped.brands) {
                totalBrandsCounter++;
                let style = '';
                if (totalBrandsCounter > 24) {
                    style = 'display:none;';
                }
                if (totalBrandsCounter > 100) {
                    break;
                }
                const brandHtml = '<li style="' + style + '"><a href="' + brandsScraped.brands[brand].link + '">' + brand + '</a> <span>' + brandsScraped.brands[brand].count + '</span></li>';
                $('#helium-brands-info').find('ul').eq(counter).append(brandHtml);
                counter++;
                if (counter === 4) {
                    counter = 0;
                }

            }
            if (totalBrandsCounter > 24) {
                $brandsContainer.append(
                    `<div class="show-more-block">
                    <a class="show-more" id="helium-show-more-brands">Show more</a>
                </div>`);
            }
            if (totalBrandsCounter > 100) {
                $brandsContainer.append($('<strong>', {
                    'text': 'This seller has more than 100 brands. Only the first 100 will be shown. ',
                    'id': 'helium-show-more-brands-limit'
                }));
            }
            $('#helium-show-more-brands').click(function () {
                $(this).hide();
                $brandsContainer.find('li').show();
                $('#helium-show-more-brands-limit').css('display', 'block');
            });
            $('#helium-brands-toggle-button').click(function () {
                let $img = $(this).find('img');
                const $brandsWrapper = $('#helium-brands-info');
                if ($brandsWrapper.is(':visible')) {
                    $('#helium-brands-toggle-text').text('Show');
                    $img.attr('src', $img.data('down-arrow'));
                    $brandsWrapper.hide();
                } else {
                    $('#helium-brands-toggle-text').text('Hide');
                    $img.attr('src', $img.data('up-arrow'));
                    $brandsWrapper.show();
                }
                return false;
            });
        }

        const cerebroIcon = chrome.runtime.getURL('html/images/icons/cerebro.png');

        if (sellerId) {
            setTimeout(function () {
                chrome.storage.local.get(sellerId, function (result) {
                    if (Object.keys(result).length) {
                        showBrands(result[sellerId]);
                    } else {
                        // @ts-ignore
                        const scraper = new AmazonMerchantScraper();

                        scraper.start(sellerId);

                        $(scraper).on(scraper.externalEvents.profileNotScraped, function (event) {
                            console.log(event);
                        });
                        $(scraper).on(scraper.externalEvents.profileScraped, function (event) {
                            // @ts-ignore
                            if (event.profileScrapedData.brands.hasOwnProperty('See more')) {
                                // @ts-ignore
                                const url = event.profileScrapedData.brands['See more'];
                                // @ts-ignore
                                const scraper = new AmazonBrandsScraper();

                                scraper.start(url);
                                $(scraper).on(scraper.externalEvents.brandsNotScraped, function (event) {
                                    console.log(event);
                                });
                                $(scraper).on(scraper.externalEvents.brandsScraped, function (event) {
                                    let save = {};
                                    save[sellerId] = {
                                        // @ts-ignore
                                        count: event.brandsScraped.count,
                                        // @ts-ignore
                                        brands: event.brandsScraped.brands,
                                        // @ts-ignore
                                        total: event.brandsScraped.total
                                    };
                                    chrome.storage.local.set(save);
                                    // @ts-ignore
                                    showBrands(event.brandsScraped);

                                });
                            } else {
                                let brandsList = {};
                                brandsList['brands'] = {};
                                let total = 0;
                                // @ts-ignore
                                for (let brand in  event.profileScrapedData.brands) {
                                    total++;
                                    brandsList['brands'][brand] = {
                                        // @ts-ignore
                                        link: event.profileScrapedData.brands[brand],
                                        count: ''
                                    };
                                }
                                brandsList['total'] = total;
                                brandsList['count'] = -1;
                                let save = {};
                                save[sellerId] = {
                                    // @ts-ignore
                                    count: brandsList.count,
                                    // @ts-ignore
                                    brands: brandsList.brands,
                                    // @ts-ignore
                                    total: brandsList.total
                                };
                                chrome.storage.local.set(save);
                                showBrands(brandsList);
                            }
                        });
                    }
                });
            }, 8000);
        }

        function displayChart(asin) {
            $('#helium-charts').remove();
            const $wrapper = generateChartContainer();
            let containerWidth = '76%';
            let selector;
            if ($('#hqpWrapper').length) {
                selector = '#hqpWrapper';
            } else {
                selector = '#hqp-bottom';
                const $featureBulletsFeatureDiv = $('#featurebullets_feature_div');
                if ($featureBulletsFeatureDiv.length) {
                    containerWidth = $featureBulletsFeatureDiv.width() - 10 + 'px';
                }
            }
            if ($(selector).length) {
                $('<div>', {
                    id: 'helium-charts',
                    style: 'width: ' + containerWidth + '; border: 0 none;'
                }).insertAfter(selector);
            } else {
                containerWidth = '87%';
                $('<div>', {
                    id: 'helium-charts',
                    style: 'width: ' + containerWidth + '; border: 0 none;'
                }).insertBefore('#bottomRow');
            }
            $('#helium-charts')
                .html('')
                .append($('<div>', {id: 'helium-product-info-wrapper'}));
            const $container = $('#helium-product-info-wrapper');
            const chartUrl = `https://systems.helium10.com/chart/index?asin=${asin}&marketplace=${marketplaceId}&range=30`;

            const $chartIframe = $('<iframe/>', {
                src: chartUrl,
                style: 'width: 100%; border:0 none;overflow: hidden;min-height: 350px;max-height: 600px;',
                scrolling: 'no'
            });

            $container.append($wrapper);
            const $chartContainer = $container.find('.content');
            $chartContainer.prepend($chartIframe);

            if (!sellerId) {
                $('#helium-brands-section').remove();
            }

            $('#helium-inventory-levels').click(function () {
                // @ts-ignore
                getStockStats();
                return false;
            });
            $('#helium-black-box').click(function () {
                // @ts-ignore
                getBlackBox();
                return false;
            });
            $('#helium-profitability-calculator-link').click(function () {
                // @ts-ignore
                getCalculator();
                return false;
            });
        }

        function generateChartContainer() {
            // @ts-ignore
            const url = `${App.config.memberAccountUrl}/cerebro/reverse-search?asin=${asin}&amazonstore=${getCurrentMarketplaceDomain()}`;
            let calculatorLink = '';
            let inventoryLevelsLink = '';
            // @ts-ignore
            if (getCurrentMarketplaceId() === 'ATVPDKIKX0DER') {
                calculatorLink = `<li>
                                <span class="icon"><i class="fa fa-percent"></i></span>
                                <a id="helium-profitability-calculator-link">Profitability Calculator</a>
                            </li>`;
                inventoryLevelsLink = `<li>
                                    <span class="icon"><img alt="" src="https://assets.helium10.com/public/a4eb518b/stock-icon.png"></span>                                        
                                    <a id="helium-inventory-levels">Inventory Levels</a>
                                </li>`;
            }

            return $(
                `<div class="container4"> 
                <div class="wrapper">
                    <div class="topline">
                        <div class="logo">
                            <a href="https://members.helium10.com/" target="_blank"></a>
                        </div>
                        <div class="top-menu">
                            <ul class="helium-top-menu">
                                ${inventoryLevelsLink}
                                <li>
                                    <span class="icon"><i class="fa fa-xing"></i></span>
                                    <a id="helium-black-box">Xray</a>
                                </li>
                                <li>
                                    <span class="icon"><img class="cerebro-icon" src="${cerebroIcon}" alt=""></span>
                                    <a id="helium-keywords-link" href="${url}" target="_blank">Keywords</a>
                                </li>
                                ${calculatorLink}
                            </ul>
                        </div>
                    </div>
                    <div class="content">
                        <div id="helium-brands-section">
                            <div class="calc ver1">
                                <div class="line"></div>
                                <span class="txt">Other brands by this seller </span>
                                <a href="#" class="btn" id="helium-brands-toggle-button">
                                    <span id="helium-brands-toggle-text">Hide </span>
                                    Brands <span id="helium-brands-counter"></span>
                                    <img src="https://assets.helium10.com/public/8ae447b1/arrow4.png"
                                         data-down-arrow="https://assets.helium10.com/public/8ae447b1/arrow4.png"
                                         data-up-arrow="https://assets.helium10.com/public/8ae447b1/arrow3.png">
                                </a>
                            </div>
                            <div id="helium-brands-info"></div>
                        </div>
                    </div>
                </div>
            </div>`);
        }

        const loader = chrome.runtime.getURL('html/images/helium10-logo-animation.gif');
        const spinner = chrome.runtime.getURL('html/images/spinner32.gif');
        let attempts = 0;

        function displayCalculator(asin, price) {
            // eslint-disable-next-line no-debugger
            // @ts-ignore
            $.ajax({
                method: 'GET',
                url: this.App.config.memberAccountUrl + '/extension/calculator-json',
                dataType: 'json', // json
                data: {
                    asin: asin,
                    price: price,
                    marketplaceId: marketplaceId
                }
            })
                .done(function (response) {
                    const containerHtml = generateCalculatorHtml(response);
                    $('#helium-product-info-wrapper').find('.content').append(containerHtml);
                    console.log('response', response);

                    $('.helium-sell-price-input').change(function () {
                        const selector = '#helium-total-' + $(this).data('type');
                        if ($(this).val() < 0) {
                            // @ts-ignore
                            $(this).val($(this).val() * -1);
                        }
                        $(selector).parent().append('<img height="20px" id="helium-calculator-spinner" src="' + spinner + '" alt="spinner" >');
                        $(selector).hide();
                        $.ajax({
                            method: 'GET',
                            // @ts-ignore
                            url: App.config.memberAccountUrl + '/extension/calculate',
                            dataType: 'json',
                            data: {
                                asin: asin,
                                fbaPrice: $('#helium-sell-price-fba').val(),
                                mfnPrice: $('#helium-sell-price-mfn').val(),
                                marketplaceId: marketplaceId
                            }
                        })
                            .done(function (response) {
                                console.log('response json', response);
                                $('#helium-calculator-spinner').remove();
                                $(selector).show();
                                $('#helium-sell-price-fba').attr('data-fees-value', response.fbaFees);
                                $('#helium-sell-price-mfn').attr('data-fees-value', response.mfnFees);
                                $('#helium-mfn-tooltip').html(response.mfnFeesHtml);
                                $('#helium-fba-tooltip').html(response.fbaFeesHtml);
                                $('.helium-buy-cost-input').trigger('change');
                            });

                    });
                    $('.helium-buy-cost-input').change(function () {
                        if ($(this).val() < 0) {
                            // @ts-ignore
                            $(this).val($(this).val() * -1);
                        }
                        $('.helium-buy-cost-input').each(function () {
                            const $priceInput = $('.helium-sell-price-input[data-type="' + $(this).attr('data-type') + '"]');
                            // @ts-ignore
                            const total = $priceInput.val() - $priceInput.attr('data-fees-value') - $(this).val();
                            let color = total > 0 ? '#125ffe' : 'red';
                            $('#helium-total-' + $(this).attr('data-type')).text('$ ' + total.toFixed(2)).css('color', color);
                        });

                    });
                    $('#revenue-calculator-toggle-button').click(function () {
                        const $img = $(this).find('img');

                        const $calculatorWrapper = $('#helium-revenue-calculator-wrapper');
                        if ($calculatorWrapper.is(':visible')) {
                            $(this).find('span').text('Show');
                            $img.attr('src', $img.data('down-arrow'));
                            $calculatorWrapper.hide();
                        } else {
                            $(this).find('span').text('Hide');
                            $img.attr('src', $img.data('up-arrow'));
                            $calculatorWrapper.show();
                        }
                        return false;
                    });
                    /*$('#cerebro-toggle-button').click(function () {
                        const $img = $(this).find('img');

                        const $cerebroWrapper = $('#helium-cerebro-wrapper');
                        if ($cerebroWrapper.is(':visible')) {
                            $(this).find('span').text('Show');
                            $img.attr('src', $img.data('down-arrow'));
                            $cerebroWrapper.hide();
                        } else {
                            $(this).find('span').text('Hide');
                            $img.attr('src', $img.data('up-arrow'));
                            $cerebroWrapper.show();
                        }
                        return false;
                    });*/
                    /*$('#helium-cerebro-placeholder-button').click(function () {
                        if ($(this).data('maintance')) {
                            $('#helium-cerebro-wrapper').html($('<h3>', {
                                text: 'Cerebro is currently undergoing maintenance. Please check back in a few hours.',
                                style: 'margin-bottom:20px'
                            }));
                            return false;
                        }
                        $('#helium-cerebro-placeholder-button').remove();
                        $('img.helium-cerebro-placeholder').remove();
                        $('#helium-cerebro-wrapper').append($('<img>', {src: loader, id: 'helium-logo-loader'}));
                        $.ajax({
                            method: 'POST',
                            url: App.config.memberAccountUrl + '/cerebro/get-keywords',
                            dataType: 'json',
                            data: {
                                asin: asin,
                                marketplace: marketplaceId
                            }
                        }).done(function (response) {
                            $('#helium-cerebro-placeholder-button').remove();
                            $('img.helium-cerebro-placeholder').remove();
                            $('#helium-logo-loader').remove();
                            $('#helium-cerebro-wrapper').append($('<table>', {
                                border: '1',
                                cellspacing: '0',
                                cellpadding: '0',
                                class: 'cerebro-table'
                            }));
                            var $cerebroTable = $('table.cerebro-table');
                            $cerebroTable.append($('<tr>')).append($('<tr>')).append($('<tr>')).append($('<tr>'));
                            var counter = 0;

                            for (var keyword in  response.keywords) {
                                var colorClass, baseColorClass;
                                switch (true) {
                                    case response.keywords[keyword].score <= 3 :
                                        baseColorClass = 'red';
                                        break;
                                    case response.keywords[keyword].score <= 6 :
                                        baseColorClass = 'ellow';
                                        break;
                                    case response.keywords[keyword].score <= 10 :
                                        baseColorClass = 'green';

                                }
                                var ratingHtml = '';
                                for (var i = 1; i <= 10; i++) {
                                    colorClass = baseColorClass;
                                    if (i <= response.keywords[keyword].score) {
                                        colorClass += ' active';
                                    }
                                    ratingHtml += '<span class="' + colorClass + '">/</span>';
                                }
                                ratingHtml = '<div class="rating">' + ratingHtml + '</div>';
                                var keywordHtml = '<td>' + ratingHtml + ' <span class="txt">' + response.keywords[keyword].keyword + '</span></td>';
                                $cerebroTable.find('tr').eq(counter).append(keywordHtml);
                                counter++;
                                if (counter == 4) {
                                    counter = 0;
                                }


                            }
                            $('#helium-cerebro-wrapper').append($('<a>', {
                                href: App.config.memberAccountUrl + '/cerebro/reverse-search?asin=' + asin + '&amazonstore='+getCurrentMarketplaceDomain(),
                                class: 'show-more',
                                text: 'Show more keywords',
                                target: '_blank'
                            }));

                        });
                        return false;

                    });*/
                })
                .fail(function () {
                    attempts++;
                    if (attempts < 4) {
                        setTimeout(displayCalculator, 4000);
                    }
                });
        }

        function generateCalculatorHtml(product) {
            /*product = {
                'status': true,
                'product': {
                    'Identifiers': {
                        'MarketplaceASIN': {
                            'MarketplaceId': 'ATVPDKIKX0DER',
                            'ASIN': 'B06XD3LXXK'
                        }
                    },
                    'AttributeSets': {
                        'ItemAttributes': {
                            'Binding': 'Personal Computers',
                            'Brand': 'Acer',
                            'Color': 'N3060 | 2G | 16G SSD',
                            'CPUManufacturer': 'Intel',
                            'CPUSpeed': '1.60',
                            'CPUType': 'Celeron_D_Processor_360',
                            'DisplaySize': '15.6',
                            'HardDiskInterface': 'solid_state',
                            'HardDiskSize': '16.00',
                            'HardwarePlatform': 'PC',
                            'ItemDimensions': {
                                'Height': '1.00',
                                'Length': '10.10',
                                'Width': '15.10',
                                'Weight': '4.30'
                            },
                            'IsAdultProduct': 'false',
                            'Label': 'Acer',
                            'ListPrice': {
                                'Amount': '199.99',
                                'CurrencyCode': 'USD'
                            },
                            'Manufacturer': 'Acer',
                            'Model': 'CB3-532-C47C',
                            'OperatingSystem': 'Chrome OS',
                            'PackageDimensions': {
                                'Height': '3.49999999643',
                                'Length': '21.49999997807',
                                'Width': '15.49999998419',
                                'Weight': '5.89957013112'
                            },
                            'PackageQuantity': '1',
                            'PartNumber': 'NX.GHJAA.002',
                            'ProcessorCount': '1',
                            'ProductGroup': 'Personal Computer',
                            'ProductTypeName': 'TABLET_COMPUTER',
                            'Publisher': 'Acer',
                            'Size': '15.6 inch | HD',
                            'SmallImage': {
                                'URL': 'http://ecx.images-amazon.com/images/I/514J7FOlu9L._SL75_.jpg',
                                'Height': '53',
                                'Width': '75'
                            },
                            'Studio': 'Acer',
                            'SystemMemorySize': '2.0',
                            'SystemMemoryType': 'ddr3_sdram',
                            'Title': 'Acer Flagship CB3-532 15.6" HD Premium Chromebook - Intel Dual-Core Celeron N3060 up to 2.48GH.z, 2GB RAM, 16GB SSD, Wireless AC, HDMI, USB 3.0, Webcam, Chrome OS (Certified Refurbished)'
                        }
                    },
                    'Relationships': [],
                    'SalesRankings': {
                        'SalesRank': [
                            {
                                'ProductCategoryId': 'pc_display_on_website',
                                'Rank': '35'
                            },
                            {
                                'ProductCategoryId': 'ce_display_on_website',
                                'Rank': '155'
                            },
                            {
                                'ProductCategoryId': '13896615011',
                                'Rank': '1'
                            }
                        ]
                    }
                },
                'feeEstimateFbaListArray': [
                    {
                        'type': 'Referral Fee',
                        'amount': '1.00',
                        'currencyCode': 'USD'
                    },
                    {
                        'type': 'Variable Closing Fee',
                        'amount': '0.00',
                        'currencyCode': 'USD'
                    },
                    {
                        'type': 'Per Item Fee',
                        'amount': '0.00',
                        'currencyCode': 'USD'
                    },
                    {
                        'type': 'FBA Fulfillment Fees',
                        'amount': '11.17',
                        'currencyCode': 'USD'
                    },
                    {
                        'type': 'Total Fee',
                        'amount': '12.17',
                        'currencyCode': '$'
                    }
                ],
                'feeEstimateMfnListArray': [
                    {
                        'type': 'Referral Fee',
                        'amount': '1.00',
                        'currencyCode': 'USD'
                    },
                    {
                        'type': 'Variable Closing Fee',
                        'amount': '0.00',
                        'currencyCode': 'USD'
                    },
                    {
                        'type': 'Per Item Fee',
                        'amount': '0.00',
                        'currencyCode': 'USD'
                    }
                ],
                'feesEstimateFbaTotal': '12.17',
                'feesEstimateMfnTotal': '1.00',
                'listPrice': '199.99',
                'price': 0,
                'asin': 'B06XD3LXXK',
                'bsrList': {
                    'Traditional Laptops': '1'
                },
                'inventoryLevelsMaintenance': false,
                'marketplaceId': 'ATVPDKIKX0DER',
                'currencySign': '$'
            };*/
            console.group('product');
            console.log('product.currencySign', product.currencySign);
            console.log('product.price', product.price);
            console.log('Number(product.price)', Number(product.price));
            console.log('product.feesEstimateMfnTotal', product.feesEstimateMfnTotal);
            console.log('product', product);
            console.log('Number(product.price) - Number(product.feesEstimateFbaTotal)', Number(product.price) - Number(product.feesEstimateFbaTotal));
            console.groupEnd();
            const itemDimensions = product.product.AttributeSets.ItemAttributes.ItemDimensions;
            const packageDimensions = product.product.AttributeSets.ItemAttributes.PackageDimensions;
            return $(`<div class="calc">
                    <div class="line"></div>
                    <span class="txt">Revenue calculator</span>
                    <a href="#" class="btn" id="revenue-calculator-toggle-button">
                        <span>Hide</span>
                        <img src="https://assets.helium10.com/public/9b15df11/arrow3.png"
                             data-down-arrow="https://assets.helium10.com/public/9b15df11/arrow4.png"
                             data-up-arrow="https://assets.helium10.com/public/9b15df11/arrow3.png">
                    </a>
                </div>
                <div id="helium-revenue-calculator-wrapper">
                    <div class="left-col">
                        <div class="wrapper1">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                <tr>
                                    <td width="108">&nbsp;</td>
                                    <td width="134">MFN</td>
                                    <td>FBA</td>
                                </tr>
                                <tr>
                                    <td>Selling Price</td>
                                    <td>
                                        <input placeholder="" type="number" min="0" class="helium-sell-price-input"
                                               id="helium-sell-price-mfn"
                                               data-type="mfn" data-fees-value="${product.feesEstimateMfnTotal}"
                                               value="${product.price}">
                
                                    </td>
                                    <td>
                                        <input placeholder="" type="number" min="0" class="helium-sell-price-input"
                                               id="helium-sell-price-fba"
                                               data-type="fba" data-fees-value="${product.feesEstimateFbaTotal}"
                                               value="${product.price}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>Product Cost</td>
                                    <td>
                                        <input type="number" min="0" class="helium-buy-cost-input" data-type="mfn" value="0">
                                    </td>
                                    <td>
                                        <input type="number" class="helium-buy-cost-input" data-type="fba" value="0">
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="col">Net</th>
                                    <th scope="col">
                                        <span class="helium-tooltip">ⓘ</span>
                                        <span id="helium-mfn-tooltip" class="helium-tooltip-message">
                                            <ul>
                                                <li>Referral Fee : <span>25.40 USD</span></li>
                                                <li>Variable Closing Fee : <span>0.00 USD</span></li>
                                                <li>Per Item Fee : <span>0.00 USD</span></li>
                                            </ul>
                                        </span>
                                        <span id="helium-total-mfn">${product.currencySign} ${Math.round((Number(product.price) - Number(product.feesEstimateMfnTotal))*100)/100}</span>
                                    </th>
                                    <th scope="col">
                                        <span class="helium-tooltip">ⓘ</span>
                                        <span id="helium-fba-tooltip" class="helium-tooltip-message">
                                            <ul>
                                                <li>Referral Fee : <span>25.40 USD</span></li>
                                                <li>Variable Closing Fee : <span>0.00 USD</span></li>
                                                <li>Per Item Fee : <span>0.00 USD</span></li>
                                                <li>FBA Fulfillment Fees : <span>10.81 USD</span></li>
                                                <li>Total Fee: <span>36.21$ </span></li>
                                            </ul>
                                        </span>
                                        <span id="helium-total-fba">${product.currencySign} ${Math.round((Number(product.price) - Number(product.feesEstimateFbaTotal))*100)/100}</span>
                                    </th>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="right-col">
                        <div class="info">
                            <div class="data1">ASIN: ${product.asin}</div>
                            <div class="product-rank"></div>
                            <div class="data2"><span class="green">Listing price: ${product.listPrice} ${product.currencySign}</span></div>
                            <ul class="data3">
                                <li>Item Weight: ${itemDimensions && itemDimensions.Weight ? itemDimensions.Weight : 'N/A'} lbs</li>
                                <li>Package Dimensions: ${itemDimensions && itemDimensions.Height ? itemDimensions.Height : 'N/A'} x
                                ${itemDimensions && itemDimensions.Length ? itemDimensions.Length : 'N/A'} x 
                                ${itemDimensions && itemDimensions.Width ? itemDimensions.Width : 'N/A'} in</li>
                                <li>Package Weight: ${packageDimensions && packageDimensions.Weight ? packageDimensions.Weight : 'N/A'} lbs</li>
                            </ul>
                            <div class="note">Some data may be approximated.</div>
                        </div>
                    </div>
                </div>`);
        }
    }
}

