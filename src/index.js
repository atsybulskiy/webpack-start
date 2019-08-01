import highChart from "./common/highChart";

// import app from './common/app';

export function round(num) {
    return Math.round(num * 100) / 100;
}

// $('.container').css('border', '1px solid #fff').html(storage(10, 10, 2, 0.1));

const viabilityScore = {
    status: "success",
    message: "<h3>Significant factors impacting the success score</h3><br/><h4>Number of competing products</h4><p>Number of competitors not available</p><h4>Price : Average</h4><p>Moderate cost, low entry barrier niche.</p><h4>Price: Standard Deviation</h4><p>Moderate variation in pricing.</p>",
    score: 45,
    list: [{
        title: "FBA fee %, average",
        description: "Significant distribution and fulfillment cost.",
        impact: 1.3518518518518519
    }, {
        title: "Rating: Average",
        description: "High average rating indicates a need for high quality product.",
        impact: 2
    }, {
        title: "Number of competing products",
        description: "Number of competitors not available",
        impact: 3
    }, {
        title: "Price : Average",
        description: "Moderate cost, low entry barrier niche.",
        impact: 4
    }, {
        title: "Price: Standard Deviation",
        description: "Moderate variation in pricing.",
        impact: 5
    }, {
        title: "Price: Standard Deviation",
        description: "Moderate variation in pricing.",
        impact: 6
    }, {
        title: "Price: Standard Deviation",
        description: "Moderate variation in pricing.",
        impact: 7
    }, {
        title: "Price: Standard Deviation",
        description: "Moderate variation in pricing.",
        impact: 8
    }, {
        title: "Price: Standard Deviation",
        description: "Moderate variation in pricing.",
        impact: 9
    }, {
        title: "Price: Standard Deviation",
        description: "Moderate variation in pricing.",
        impact: 10
    }]
};

function drawCharts(viabilityScore) {
    const list = viabilityScore.list;
    console.log('%c⇒ list', 'color: #82AAFF', list);
    const chartContainer = document.getElementById('chart-container');
    console.log('%c⇒ chartContainer', 'color: #82AAFF', chartContainer);
    list.forEach((item, index) => {
        console.log('%c⇒ item', 'color: #82AAFF', item, index);
        const chartId = `score-${index}`;
        let chartItem = document.createElement('div');
        chartItem.id = chartId;
        chartContainer.appendChild(chartItem);
        console.log('%c⇒ item', 'color: #82AAFF', item);
        highChart(chartId, item);
    })
}

drawCharts(viabilityScore);
