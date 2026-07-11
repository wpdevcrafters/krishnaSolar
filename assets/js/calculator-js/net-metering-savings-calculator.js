/* Net Metering Savings Calculator JS — ShriKrishna Solar */

document.addEventListener('DOMContentLoaded', () => {
    const calcForm = document.getElementById('netmetering-calculator-form');
    if (calcForm) {
        calcForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateNetMetering();
        });
    }
});

async function calculateNetMetering() {
    const importUnits = parseFloat(document.getElementById('import_units').value);
    const exportUnits = parseFloat(document.getElementById('export_units').value);
    const tariffInput = document.getElementById('tariff');
    const tariff = tariffInput ? parseFloat(tariffInput.value) : 8;

    if (isNaN(importUnits) || isNaN(exportUnits)) return;

    let netUnits = importUnits - exportUnits;
    let billAmount = 0;
    let bankUnits = 0;
    let explanation = '';
    let statusColor = '';
    let statusText = '';

    if (netUnits > 0) {
        billAmount = netUnits * tariff;
        explanation = `You consumed ${netUnits} units more than you generated. You have to pay for these units at ₹${tariff}/unit + Fixed Charges.`;
        statusColor = '#dc3545';
        statusText = 'Payable';
    } else {
        bankUnits = Math.abs(netUnits);
        billAmount = 0;
        explanation = `Great! You generated ${bankUnits} units more than you used. These are "Banked" for next month. Your energy bill is Zero (only fixed charges apply).`;
        statusColor = '#198754';
        statusText = 'Credit';
    }

    const emptyState = document.getElementById('empty-state');
    if (emptyState) emptyState.style.display = 'none';

    const resultBox = document.getElementById('result-box');
    resultBox.style.display = 'block';

    document.getElementById('res_bill').innerText = `${Math.round(billAmount)}`;
    document.getElementById('res_banked').innerText = `${bankUnits}`;

    const explanationEl = document.getElementById('bill_explanation');
    if (explanationEl) explanationEl.innerText = explanation;

    const statusEl = document.getElementById('res_status');
    if (statusEl) {
        statusEl.innerHTML = statusText;
        statusEl.style.color = statusColor;
    }

    if (window.innerWidth < 768) {
        resultBox.scrollIntoView({ behavior: 'smooth' });
    }

    await new Promise(resolve => setTimeout(resolve, 0));
}
