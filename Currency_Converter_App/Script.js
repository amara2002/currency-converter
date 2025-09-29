let historyData = JSON.parse(localStorage.getItem('currencyHistory')) || [];

// Swap currencies
function swapCurrencies() {
    const from = document.getElementById('fromCurrency');
    const to = document.getElementById('toCurrency');
    [from.value, to.value] = [to.value, from.value];
    convertCurrency();
}

// Convert currency
async function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const from = document.getElementById("fromCurrency").value;
    const to = document.getElementById("toCurrency").value;

    if (isNaN(amount) || amount < 0) {
        alert("Please enter a valid amount.");
        return;
    }

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/6ad09884b23882cc4b3a3125/latest/${from}`);
        const data = await response.json();

        const rate = data.conversion_rates[to];
        if (!rate) {
            alert("Conversion rate not available.");
            return;
        }

        const converted = (amount * rate).toFixed(2);
        document.getElementById("result").textContent = `Converted Amount: ${converted} ${to}`;

        // Save to history
        const entry = `${amount} ${from} → ${converted} ${to}`;
        historyData.push(entry);
        if (historyData.length > 10) historyData.shift();
        localStorage.setItem('currencyHistory', JSON.stringify(historyData));
        updateHistory();

    } catch (error) {
        alert("Error fetching exchange rate. Try again later.");
        console.error(error);
    }
}

// Update history display
function updateHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '<strong>History:</strong>';

    historyData.forEach((h, index) => {
        const p = document.createElement('p');

        const span = document.createElement('span');
        span.textContent = h;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => {
            historyData.splice(index, 1);
            localStorage.setItem('currencyHistory', JSON.stringify(historyData));
            updateHistory();
        };

        p.appendChild(span);
        p.appendChild(deleteBtn);
        historyDiv.appendChild(p);
    });
}

// Clear all history
function clearHistory() {
    if (confirm("Are you sure you want to clear all history?")) {
        historyData = [];
        localStorage.removeItem('currencyHistory');
        updateHistory();
    }
}

// Enter key support
document.getElementById('amount').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') convertCurrency();
});

// Load history on page load
updateHistory();
