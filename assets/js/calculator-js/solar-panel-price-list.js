/* solar-panel-price-list.html JS - ShriKrishna Solar */

// FAQ Toggle
function toggleFaq(btn) {
  var answer = btn.nextElementSibling;
  var icon = btn.querySelector('span');
  var isOpen = answer.style.display === 'block';
  answer.style.display = isOpen ? 'none' : 'block';
  icon.textContent = isOpen ? '+' : '−';
}

// Solar Price Calculator
var PANEL_RATES = {
  poly:     { min: 22, max: 25, label: 'Polycrystalline' },
  mono:     { min: 27, max: 32, label: 'Monocrystalline PERC' },
  halfcut:  { min: 30, max: 35, label: 'Half-cut PERC' },
  bifacial: { min: 32, max: 38, label: 'Bifacial Mono' }
};

// System cost lookup (panels + inverter + mounting + installation)
var SYSTEM_COST = {
  1: 65000, 2: 120000, 3: 175000, 4: 230000, 5: 280000,
  6: 330000, 7: 380000, 8: 430000, 9: 480000, 10: 530000
};

function getSubsidy(kw) {
  if (kw <= 1) return 30000;
  if (kw <= 2) return 60000;
  return 78000;
}

function formatINR(n) {
  if (n >= 100000) {
    var lakhs = (n / 100000).toFixed(2);
    return '₹' + lakhs + ' L';
  }
  return '₹' + n.toLocaleString('en-IN');
}

function calculateSolar() {
  var kw = parseFloat(document.getElementById('calc-kw').value) || 3;
  var panelType = document.getElementById('calc-panel-type').value;
  var monthlyBill = parseFloat(document.getElementById('calc-bill').value) || 3000;

  kw = Math.min(Math.max(kw, 0.5), 10);

  var rate = PANEL_RATES[panelType];
  var avgRate = (rate.min + rate.max) / 2;
  var watts = kw * 1000;
  var panelCost = Math.round(watts * avgRate);

  // Total system cost (interpolate for non-integer kW)
  var floorKw = Math.floor(kw);
  var ceilKw = Math.ceil(kw);
  var totalCost;
  if (floorKw === ceilKw) {
    totalCost = SYSTEM_COST[floorKw] || Math.round(kw * 53000);
  } else {
    var lo = SYSTEM_COST[floorKw] || Math.round(floorKw * 53000);
    var hi = SYSTEM_COST[ceilKw] || Math.round(ceilKw * 53000);
    var frac = kw - floorKw;
    totalCost = Math.round(lo + (hi - lo) * frac);
  }

  var subsidy = getSubsidy(kw);
  var netCost = Math.max(totalCost - subsidy, 0);

  // Monthly savings: assume 4 sun hours/day, ₹8/unit avg tariff
  var monthlyUnits = kw * 4 * 30;
  var monthlySavings = Math.min(Math.round(monthlyUnits * 8), monthlyBill);
  var annualSavings = monthlySavings * 12;
  var paybackYears = annualSavings > 0 ? (netCost / annualSavings).toFixed(1) : 'N/A';

  document.getElementById('res-panel-cost').textContent = formatINR(panelCost);
  document.getElementById('res-total-cost').textContent = formatINR(totalCost);
  document.getElementById('res-subsidy').textContent = '−' + formatINR(subsidy);
  document.getElementById('res-net-cost').textContent = formatINR(netCost);
  document.getElementById('res-monthly-savings').textContent = formatINR(monthlySavings) + '/mo';
  document.getElementById('res-payback').textContent = paybackYears + ' yrs';

  var note = 'Estimate for a <strong>' + kw + ' kW ' + rate.label + '</strong> on-grid system. ';
  note += 'Monthly generation: ~' + Math.round(monthlyUnits) + ' units. ';
  note += 'Savings % from bill: ' + Math.round((monthlySavings / monthlyBill) * 100) + '%. ';
  note += 'Lifetime savings (25 yr): <strong>' + formatINR(annualSavings * 25) + '</strong>.';
  document.getElementById('res-note').innerHTML = note;

  document.getElementById('calc-results').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
  var kwInput = document.getElementById('calc-kw');
  var panelType = document.getElementById('calc-panel-type');
  var billInput = document.getElementById('calc-bill');
  var calcBtn = document.getElementById('price-calc-btn');

  if (kwInput) kwInput.addEventListener('input', calculateSolar);
  if (panelType) panelType.addEventListener('change', calculateSolar);
  if (billInput) billInput.addEventListener('input', calculateSolar);
  if (calcBtn) calcBtn.addEventListener('click', calculateSolar);

  calculateSolar();
});
