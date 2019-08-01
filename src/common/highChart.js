/*export default function highChart() {
    $(function() {
        const divID = 'container';
        const dataC = {
            'title': null,
            'seriesDataConnections': 7,
            'seriesData': 80
        };

        new Highcharts.Chart({
            credits: false,
            chart: {
                renderTo: divID,
                type: 'solidgauge',
            },
            title: null,
            exporting: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{
                    outerRadius: '106%',
                    innerRadius: '94%',
                    backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
                    borderWidth: 0
                }]
            },
            yAxis: {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: []
            },
            plotOptions: {
                solidgauge: {
                    borderWidth: 2,
                    dataLabels: {
                        enabled: true,
                        y: 0,
                        borderWidth: 0,
                        backgroundColor: 'none',
                        useHTML: true,
                        shadow: false,
                        style: {
                            fontSize: '16px'
                        },
                        formatter: function() {
                            return '<span style="color:' + Highcharts.getOptions().colors[0] + ';">' + Highcharts.numberFormat(this.y / 10, 0) + '</span>';
                        }
                    },
                    linecap: 'round',
                    stickyTracking: true
                }
            },
            series: [{
                borderColor: Highcharts.getOptions().colors[0],
                data: [{
                    color: Highcharts.getOptions().colors[0],
                    radius: '100%',
                    innerRadius: '100%',
                    y: dataC.seriesData
                }]
            }],
            lang: {
                noData: "No data to display"
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#333333'
                }
            }
        });
    });
}*/

export default function highChart(id, data) {
    const score = Math.round(data.impact * 100) / 10;
    const scoreColor = Math.floor(data.impact / 2) - (data.impact % 2 === 0 ? 1 : 0);
    console.log('%c⇒ %', 'color: #82AAFF', data.impact % 2);
    console.log('%c⇒ data.impact', 'color: #82AAFF', data.impact);
    console.log('%c⇒ scoreColor', 'color: #82AAFF', scoreColor);

    Highcharts.setOptions({
        colors: ['#ff5722', '#ffc107', '#cddc39', '#8bc34a', '#4caf50']
    });

    Highcharts.chart(id, {
        credits: false,
        chart: {
            type: 'solidgauge',
            height: '100%',
            width: '30',
            spacing: [0, 0, 0, 0],
            className: 'h10-score-chart'
        },

        title: null,

        tooltip: {
            enabled: false
        },

        pane: {
            size: '100%',
            startAngle: 0,
            endAngle: 360,
            background: [{
                outerRadius: '100%',
                innerRadius: '80%',
                backgroundColor: '#dbe2e8',
                borderWidth: 0
            }]
        },

        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    borderWidth: 0,
                    enabled: true,
                    useHTML: true,
                    className: 'h10-label',
                    style: {
                        fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                        fontWeight: 'normal',
                        fontSize: '12px',
                    },
                    formatter: function () {
                        return Highcharts.numberFormat(this.y / 10, 0);
                    },
                },
                linecap: 'round',
                stickyTracking: false,
                rounded: true
            }
        },

        series: [
            {
                name: data.title,
                data: [{
                    color: Highcharts.getOptions().colors[scoreColor],
                    radius: '100%',
                    innerRadius: '80%',
                    y: score
                }]
            }]
    });
}
