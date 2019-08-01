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
        impact: 1.2
    }, {
        title: "Number of competing products",
        description: "Number of competitors not available",
        impact: 1.1363636363636365
    }, {
        title: "Price : Average",
        description: "Moderate cost, low entry barrier niche.",
        impact: 1.1
    }, {
        title: "Price: Standard Deviation",
        description: "Moderate variation in pricing.",
        impact: 1.095890410958904
    }]
};

function drawCharts(viabilityScore) {
    const list = viabilityScore.list;
    console.log('%c⇒ list', 'color: #82AAFF', list);
}

highChart(viabilityScore);
