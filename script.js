let calculationHistory = [];
let chart;  // Declare a global chart variable

function toggleInputFields() {
    const probabilityType = document.getElementById('probabilityType').value;

    // Hide all fields first
    document.getElementById('simpleCompoundFields').style.display = 'none';
    document.getElementById('combinedFields').style.display = 'none';
    document.getElementById('binomialFields').style.display = 'none';

    // Show relevant fields based on probability type
    if (probabilityType === 'simple') {
        document.getElementById('simpleCompoundFields').style.display = 'block';
    } else if (probabilityType === 'combined') {
        document.getElementById('combinedFields').style.display = 'block';
    } else if (probabilityType === 'binomial') {
        document.getElementById('binomialFields').style.display = 'block';
    }
}

function calculateProbability() {
    const probabilityType = document.getElementById('probabilityType').value;
    const resultElement = document.getElementById('result');
    let resultText = '';
    let dataForChart = [];

    if (probabilityType === 'simple') {
        const favorable = parseFloat(document.getElementById('favorable').value);
        const total = parseFloat(document.getElementById('total').value);
        if (isNaN(favorable) || isNaN(total) || favorable < 0 || total <= 0 || favorable > total) {
            resultText = "Invalid inputs for simple probability!";
        } else {
            const probability = favorable / total;
            resultText = `The probability is ${(probability * 100).toFixed(2)}%`;
            dataForChart = [probability, 1 - probability]; // Success, Failure
        }
    
    } else if (probabilityType === 'combined') {
        const eventAnd = parseFloat(document.getElementById('eventAnd').value);
        const eventOr = parseFloat(document.getElementById('eventOr').value);
        if (isNaN(eventAnd) || isNaN(eventOr)) {
            resultText = "Invalid inputs for combined probability!";
        } else {
            resultText = `The probability of A AND B is ${(eventAnd * 100).toFixed(2)}%, and A OR B is ${(eventOr * 100).toFixed(2)}%`;
            dataForChart = [eventAnd, eventOr]; // AND, OR
        }
    
    } else if (probabilityType === 'binomial') {
        const successProbability = parseFloat(document.getElementById('successProbability').value);
        const trials = parseInt(document.getElementById('trials').value);
        if (isNaN(successProbability) || isNaN(trials) || successProbability < 0 || successProbability > 1 || trials <= 0) {
            resultText = "Invalid inputs for binomial probability!";
        } else {
            const failureProbability = 1 - successProbability;
            resultText = `Success probability: ${(successProbability * 100).toFixed(2)}%, Failure probability: ${(failureProbability * 100).toFixed(2)}% for ${trials} trials.`;
            dataForChart = [successProbability, failureProbability]; // Success, Failure
        }
    }

    // Display result and add to history
    resultElement.textContent = resultText;
    if (resultText !== '') {
        calculationHistory.push(resultText);
        updateHistory();
        updateChart(dataForChart);  // Update the chart with new data
    }
}

function updateHistory() {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = calculationHistory.map(entry => `<p>${entry}</p>`).join('');
}

function resetForm() {
    document.getElementById('result').textContent = '';
    document.querySelectorAll('input').forEach(input => input.value = '');
    calculationHistory = [];
    document.getElementById('history').innerHTML = '';  // Clear history on reset
    if (chart) {
        chart.destroy();  // Reset the chart
    }
}

function updateChart(data) {
    const ctx = document.getElementById('probabilityChart').getContext('2d');
    
    // Destroy the old chart if it exists
    if (chart) {
        chart.destroy();
    }

    // Create a new chart
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Success', 'Failure'],
            datasets: [{
                data: data,
                backgroundColor: ['#4CAF50', '#F44336'],  // Green for success, Red for failure
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });
}
