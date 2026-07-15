/* Net Metering Savings Calculator JS — ShriKrishna Solar */


function showCalculatorResult(resultId) {
  var resultBox = document.getElementById(resultId || 'result-box');
  var emptyState = document.getElementById('empty-state');

  document.body.classList.add('is-calculated');

  if (emptyState) {
    emptyState.style.setProperty('display', 'none', 'important');
    emptyState.setAttribute('aria-hidden', 'true');
  }

  if (resultBox) {
    resultBox.hidden = false;
    resultBox.removeAttribute('aria-hidden');
    resultBox.style.setProperty('display', 'block', 'important');
  }
}

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
            showCalculatorResult('result-box');
            const resultBox = document.getElementById('result-box');

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
