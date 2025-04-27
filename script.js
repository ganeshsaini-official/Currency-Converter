const apiKey = "83d00c7ca647ef3a3f562eaa"; // this is my apikey

// DOM Elements
const elements = {
    amount: document.querySelector('input[type="number"]'),
    from: document.querySelector('#from'),
    to: document.querySelector('#to'),
    msg: document.querySelector('.msg'),
    icon: document.getElementById('icon'),
    button: document.querySelector('button')
};

// Populate Currencies
function populateCurrencies() {
    const currencies = Object.keys(countryList);
    currencies.forEach(currency => {
        [elements.from, elements.to].forEach(select => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            select.appendChild(option);
        });
    });
    elements.from.value = 'USD';
    elements.to.value = 'INR';
}

// Update Flag
function updateFlag(selectElement) {
    const img = selectElement.parentElement.querySelector('img');
    img.src = `https://flagsapi.com/${countryList[selectElement.value]}/flat/64.png`;
}

// Fetch Exchange Rate
async function getExchangeRate() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${elements.from.value}/${elements.to.value}`);
        const data = await response.json();
        
        if(data.result === 'success') {
            const rate = data.conversion_rate;
            showConversion(rate);
        } else {
            elements.msg.innerHTML = `<div class="error">Error: ${data['error-type']}</div>`;
        }
    } catch(error) {
        elements.msg.innerHTML = `<div class="error">Network Error</div>`;
    }
}

// Show Conversion
function showConversion(rate) {
    const amount = parseFloat(elements.amount.value);
    if(isNaN(amount)) {
        elements.msg.innerHTML = `<div class="error">Invalid Amount</div>`;
        return;
    }
    
    const converted = (amount * rate).toFixed(2);
    elements.msg.innerHTML = `
        <div class="result">
            ${amount} ${elements.from.value} = 
            <strong>${converted} ${elements.to.value}</strong>
        </div>
    `;
}

// Event Listeners
elements.icon.addEventListener('click', () => {
    [elements.from.value, elements.to.value] = [elements.to.value, elements.from.value];
    updateFlag(elements.from);
    updateFlag(elements.to);
    getExchangeRate();
});

elements.from.addEventListener('change', () => {
    updateFlag(elements.from);
    getExchangeRate();
});

elements.to.addEventListener('change', () => {
    updateFlag(elements.to);
    getExchangeRate();
});

elements.button.addEventListener('click', (e) => {
    e.preventDefault();
    getExchangeRate();
});

// Initialize
populateCurrencies();
updateFlag(elements.from);
updateFlag(elements.to);
getExchangeRate();