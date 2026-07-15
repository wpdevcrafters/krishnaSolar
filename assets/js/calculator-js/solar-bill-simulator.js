/* Solar Bill Simulator JS - ShriKrishna Solar */

var BILL_SEASONALITY = [0.80, 0.85, 0.95, 1.20, 1.40, 1.10, 0.85, 0.80, 0.90, 0.95, 0.85, 0.80];
var BILL_SOLAR_GEN = [1.0, 1.0, 1.0, 1.15, 1.15, 1.15, 0.75, 0.75, 0.75, 1.0, 1.0, 1.0];
var BILL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var BILL_ORIENTATION_FACTOR = { south: 1.0, eastwest: 0.90, mixed: 0.80 };
var BILL_UNITS_PER_KW_DAY = 4.0;
var BILL_CO2_FACTOR = 0.82;
var billSimulationChart = null;

function getBillElement(id) {
  return document.getElementById(id);
}

function setBillText(id, value) {
  var el = getBillElement(id);
  if (el) {
    el.textContent = value;
  }
}

function formatBillCurrency(value) {
  return '₹' + Math.round(value).toLocaleString('en-IN');
}

function showBillSimulationResult() {
  var resultBox = getBillElement('result-box');
  var emptyState = getBillElement('empty-state');

  if (document.body) {
    if (document.body.classList) {
      document.body.classList.add('is-calculated');
    } else if (document.body.className.indexOf('is-calculated') === -1) {
      document.body.className += ' is-calculated';
    }
  }

  if (emptyState) {
    emptyState.hidden = true;
    emptyState.setAttribute('aria-hidden', 'true');
    emptyState.style.setProperty('display', 'none', 'important');
  }

  if (resultBox) {
    resultBox.hidden = false;
    resultBox.removeAttribute('aria-hidden');
    resultBox.style.setProperty('display', 'block', 'important');
  }
}

function updateBillSliderLabel() {
  var kwSlider = getBillElement('system_kw');
  var label = getBillElement('kw-label');
  var display = getBillElement('kw-display');

  if (!kwSlider) {
    return;
  }

  if (label) {
    label.textContent = kwSlider.value;
  }

  if (display) {
    display.textContent = kwSlider.value + ' kW';
  }
}

function renderBillChart(currentBills, postSolarBills) {
  var canvas = getBillElement('billChart');

  if (!canvas || typeof Chart === 'undefined') {
    return;
  }

  if (billSimulationChart && typeof billSimulationChart.destroy === 'function') {
    billSimulationChart.destroy();
  }

  billSimulationChart = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: BILL_MONTHS,
      datasets: [
        {
          label: 'Current Bill (₹)',
          data: currentBills,
          backgroundColor: 'rgba(239, 68, 68, 0.75)',
          borderColor: '#DC2626',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Post-Solar Bill (₹)',
          data: postSolarBills,
          backgroundColor: 'rgba(34, 197, 94, 0.75)',
          borderColor: '#16A34A',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ctx.dataset.label + ': ₹' + ctx.parsed.y.toLocaleString('en-IN');
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return '₹' + value.toLocaleString('en-IN');
            }
          }
        }
      }
    }
  });
}

function calculateBillSimulation(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  var monthlyBillEl = getBillElement('monthly_bill');
  var systemKwEl = getBillElement('system_kw');
  var orientationEl = getBillElement('orientation');
  var stateEl = getBillElement('state');

  var baseBill = monthlyBillEl ? parseFloat(monthlyBillEl.value) : 0;
  var systemKw = systemKwEl ? parseFloat(systemKwEl.value) : 3;
  var orientation = orientationEl ? orientationEl.value : 'south';
  var orientationFactor = BILL_ORIENTATION_FACTOR[orientation] || 1;
  var dailyGeneration = systemKw * BILL_UNITS_PER_KW_DAY * orientationFactor;
  var daysByMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var averageTariff = 7.0;
  var currentBills = [];
  var postSolarBills = [];
  var totalSavings = 0;
  var totalUnits = 0;
  var i;

  if (!baseBill || baseBill <= 0) {
    if (monthlyBillEl && typeof monthlyBillEl.reportValidity === 'function') {
      monthlyBillEl.reportValidity();
    }
    return false;
  }

  for (i = 0; i < 12; i += 1) {
    var currentBill = baseBill * BILL_SEASONALITY[i];
    var monthlyGeneration = dailyGeneration * daysByMonth[i] * BILL_SOLAR_GEN[i];
    var unitsConsumed = currentBill / averageTariff;
    var unitsOffset = Math.min(monthlyGeneration, unitsConsumed);
    var saving = unitsOffset * averageTariff;
    var postBill = Math.max(0, currentBill - saving);

    currentBills.push(Math.round(currentBill));
    postSolarBills.push(Math.round(postBill));
    totalSavings += saving;
    totalUnits += monthlyGeneration;
  }

  setBillText('res_annual_savings', formatBillCurrency(totalSavings));
  setBillText('res_monthly_avg', formatBillCurrency(totalSavings / 12));
  setBillText('res_units', Math.round(totalUnits).toLocaleString('en-IN') + ' kWh');
  setBillText('res_co2', Math.round(totalUnits * BILL_CO2_FACTOR).toLocaleString('en-IN') + ' kg');

  renderBillChart(currentBills, postSolarBills);
  showBillSimulationResult();

  var state = stateEl && stateEl.value ? stateEl.value : 'India';
  var shareMessage = encodeURIComponent(
    'Solar Bill Simulation Results\nState: ' + state + ' | System: ' + systemKw + ' kW\n' +
    'Annual Savings: ' + formatBillCurrency(totalSavings) + '\n' +
    'CO2 Offset: ' + Math.round(totalUnits * BILL_CO2_FACTOR).toLocaleString('en-IN') + ' kg/year'
  );
  var shareBtn = getBillElement('whatsapp-share-btn');

  if (shareBtn) {
    shareBtn.onclick = function () {
      window.open('https://wa.me/?text=' + shareMessage, '_blank');
    };
  }

  return false;
}

function calculate(event) {
  return calculateBillSimulation(event);
}

function initBillSimulator() {
  var kwSlider = getBillElement('system_kw');
  var form = getBillElement('bill-sim-form');
  var button = getBillElement('simulateBillBtn');

  updateBillSliderLabel();

  if (kwSlider) {
    kwSlider.oninput = updateBillSliderLabel;
  }

  if (form) {
    form.onsubmit = calculateBillSimulation;
  }

  if (button) {
    button.onclick = calculateBillSimulation;
  }
}

document.addEventListener('DOMContentLoaded', initBillSimulator);
