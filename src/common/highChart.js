export default function highChart(id, data) {
    const score = 1 / data.impact * 10;
    const scoreColor = Math.floor(score / 2) - (score % 2 === 0 ? 1 : 0);

    const options = {
        width: 34,
        className: 'h10-score-chart',
        backgroundColor: '#dbe2e8',
        min: 0,
        max: 10,
        label: {
            className: 'h10-label',
            decimals: 1,
            style: {
                fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                fontWeight: 'normal',
                fontSize: '12px',
            },
        },
        colors: ['#ff5722', '#ffc107', '#cddc39', '#8bc34a', '#4caf50']
    };

    Highcharts.setOptions({
        colors: options.colors
    });

    Highcharts.chart(id, {
        credits: false,
        chart: {
            type: 'solidgauge',
            height: '100%',
            width: options.width,
            spacing: [0, 0, 0, 0],
            className: options.className
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
                backgroundColor: options.backgroundColor,
                borderWidth: 0
            }]
        },

        yAxis: {
            min: options.min,
            max: options.max,
            lineWidth: 0,
            tickPositions: []
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    borderWidth: 0,
                    enabled: true,
                    useHTML: true,
                    className: options.label.className,
                    style: options.label.style,
                    formatter: function () {
                        return Highcharts.numberFormat(data.impact, options.label.decimals);
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
