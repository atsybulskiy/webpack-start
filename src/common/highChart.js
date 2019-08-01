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

export default function highChart(data) {

    Highcharts.setOptions({
        colors: ['#ff5722', '#ff9800', '#ffc107', '#ffeb3b', '#cddc39', '#8bc34a', '#4caf50']
    });

    Highcharts.chart('container', {
        credits: false,
        chart: {
            type: 'solidgauge',
            height: '100%',
            width: '35',
            spacing: [0,0,0,0]
        },

        title: null,

        tooltip: {
            enabled: false
        },

        pane: {
            size: '100%',
            startAngle: 0,
            endAngle: 360,
            background: [{ // Track for Move
                outerRadius: '100%',
                innerRadius: '80%',
                backgroundColor: '#dbe2e8',
                borderWidth: 0
            }/*, { // Track for Exercise
                outerRadius: '87%',
                innerRadius: '63%',
                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }, { // Track for Stand
                outerRadius: '62%',
                innerRadius: '38%',
                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }*/]
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
                    enabled: false
                },
                linecap: 'round',
                stickyTracking: false,
                rounded: true
            }
        },

        series: [
            {
                name: 'Move',
                data: [{
                    color: Highcharts.getOptions().colors[6],
                    radius: '100%',
                    innerRadius: '80%',
                    y: 80
                }]
            }/*, {
                name: 'Exercise',
                data: [{
                    color: Highcharts.getOptions().colors[1],
                    radius: '87%',
                    innerRadius: '63%',
                    y: 65
                }]
            }, {
                name: 'Stand',
                data: [{
                    color: Highcharts.getOptions().colors[2],
                    radius: '62%',
                    innerRadius: '38%',
                    y: 50
                }]
            }*/]
    });
}
