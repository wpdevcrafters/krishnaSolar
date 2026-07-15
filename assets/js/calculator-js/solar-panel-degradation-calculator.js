/* Solar panel degradation calculator JS - ShriKrishna Solar */

var DEGRADATION_SOILING_BASE = { urban: 8, suburban: 4, rural: 2, coastal: 5 };
var DEGRADATION_SOILING_PER_MONTH = 0.5;
var DEGRADATION_CLEAN_FREQ = {
  urban: 'Monthly',
  suburban: 'Every 2 months',
  rural: 'Quarterly',
  coastal: 'Monthly'
};
var degradationChart = null;

function getDegradationElement(id) {
  return document.getElementById(id);
}

function setDegradationText(id, value) {
  var el = getDegradationElement(id);
  if (el) {
    el.textContent = value;
  }
}

function showDegradationResult() {
  var resultBox = getDegradationElement('result-box');
  var emptyState = getDegradationElement('empty-state');

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

function renderDegradationChart(monthlyGen) {
  var canvas = getDegradationElement('degradationChart');
  var years = [];
  var ideal = [];
  var degraded = [];
  var baseIdeal = monthlyGen * 12;
  var degradedFinal;
  var yMin;
  var yMax;
  var year;

  for (year = 0; year <= 25; year += 1) {
    var yearDeg = Math.min(year * 0.5, 20);
    years.push('Year ' + year);
    ideal.push(Math.round(baseIdeal));
    degraded.push(Math.round(baseIdeal * (1 - yearDeg / 100)));
  }

  degradedFinal = degraded[degraded.length - 1];
  yMin = Math.max(0, Math.floor((degradedFinal - 80) / 100) * 100);
  yMax = Math.ceil((baseIdeal + 80) / 100) * 100;

  if (!canvas || typeof Chart === 'undefined') {
    return;
  }

  if (degradationChart && typeof degradationChart.destroy === 'function') {
    degradationChart.destroy();
  }

  degradationChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Ideal Output (kWh/yr)',
          data: ideal,
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.10)',
          fill: 'origin',
          borderWidth: 4,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: '#22C55E',
          pointBorderColor: '#22C55E',
          pointHoverRadius: 5
        },
        {
          label: 'Degraded Output (kWh/yr)',
          data: degraded,
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          fill: 'origin',
          borderWidth: 4,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: '#F59E0B',
          pointBorderColor: '#F59E0B',
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'center',
          labels: {
            boxWidth: 48,
            boxHeight: 16,
            color: '#6b7280',
            font: {
              size: 14,
              weight: '600'
            },
            padding: 24
          }
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ctx.dataset.label + ': ' + ctx.parsed.y.toLocaleString('en-IN') + ' kWh';
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(15, 23, 42, 0.08)',
            drawBorder: false
          },
          ticks: {
            color: '#6b7280',
            maxRotation: 55,
            minRotation: 55,
            font: {
              size: 13,
              weight: '600'
            }
          }
        },
        y: {
          beginAtZero: false,
          min: yMin,
          max: yMax,
          grid: {
            color: 'rgba(15, 23, 42, 0.10)',
            drawBorder: false
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 13,
              weight: '600'
            },
            callback: function (value) {
              return value.toLocaleString('en-IN');
            }
          }
        }
      }
    }
  });
}

function calculateDegradation(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  var systemKwEl = getDegradationElement('system_kw');
  var ageEl = getDegradationElement('panel_age');
  var monthlyGenEl = getDegradationElement('monthly_gen');
  var locTypeEl = getDegradationElement('location_type');
  var monthsSinceCleaningEl = getDegradationElement('months_since_cleaning');
  var tariffEl = getDegradationElement('tariff');
  var cleaningCostEl = getDegradationElement('cleaning_cost');

  var systemKw = systemKwEl ? parseFloat(systemKwEl.value) : 0;
  var age = ageEl ? parseFloat(ageEl.value) : 0;
  var monthlyGen = monthlyGenEl ? parseFloat(monthlyGenEl.value) : 0;
  var locType = locTypeEl ? locTypeEl.value : 'suburban';
  var monthsSinceCleaning = monthsSinceCleaningEl ? parseFloat(monthsSinceCleaningEl.value) : 0;
  var tariff = tariffEl ? parseFloat(tariffEl.value) : 0;
  var cleaningCost = cleaningCostEl ? parseFloat(cleaningCostEl.value) : 0;
  var requiredFields = [systemKwEl, ageEl, monthlyGenEl, monthsSinceCleaningEl, tariffEl, cleaningCostEl];
  var i;

  for (i = 0; i < requiredFields.length; i += 1) {
    if (requiredFields[i] && typeof requiredFields[i].checkValidity === 'function' && !requiredFields[i].checkValidity()) {
      if (typeof requiredFields[i].reportValidity === 'function') {
        requiredFields[i].reportValidity();
      }
      return false;
    }
  }

  if (!systemKw || systemKw <= 0 || !monthlyGen || monthlyGen <= 0 || !tariff || tariff <= 0) {
    if (monthlyGenEl && typeof monthlyGenEl.reportValidity === 'function') {
      monthlyGenEl.reportValidity();
    }
    return false;
  }

  var mfrDeg = age * 0.5;
  var soilBase = DEGRADATION_SOILING_BASE[locType] || DEGRADATION_SOILING_BASE.suburban;
  var soilExtra = Math.min(monthsSinceCleaning * DEGRADATION_SOILING_PER_MONTH, 15);
  var totalLoss = Math.min(mfrDeg + soilBase + soilExtra, 50);
  var lostGen = monthlyGen * (totalLoss / 100);
  var lostRevenue = lostGen * tariff;
  var soilRecoverable = monthlyGen * (soilExtra / 100);
  var monthlyRevSaved = soilRecoverable * tariff;
  var daysToRecover = monthlyRevSaved > 0 ? Math.round(cleaningCost / (monthlyRevSaved / 30)) : Infinity;
  var roiBox = getDegradationElement('cleaning-roi-result');

  setDegradationText('res_mfr_deg', mfrDeg.toFixed(1) + '%');
  setDegradationText('res_soil_base', soilBase.toFixed(1) + '%');
  setDegradationText('res_soil_extra', soilExtra.toFixed(1) + '%');
  setDegradationText('res_total_loss', totalLoss.toFixed(1) + '%');
  setDegradationText('res_lost_gen', lostGen.toFixed(1) + ' kWh');
  setDegradationText('res_lost_revenue', '₹' + Math.round(lostRevenue).toLocaleString('en-IN'));
  setDegradationText('res_freq', DEGRADATION_CLEAN_FREQ[locType] || DEGRADATION_CLEAN_FREQ.suburban);

  if (roiBox) {
    if (monthlyRevSaved > 0 && daysToRecover <= 180) {
      roiBox.innerHTML = '<div class="cleaning-roi-box cleaning-roi-good">Cleaning is profitable - recovers ₹' +
        Math.round(cleaningCost).toLocaleString('en-IN') + ' cost in just <strong>' + daysToRecover + ' days</strong> of recovered generation.</div>';
    } else if (monthlyRevSaved <= 0) {
      roiBox.innerHTML = '<div class="cleaning-roi-box cleaning-roi-bad">Panels appear recently cleaned. No immediate soiling loss to recover.</div>';
    } else {
      roiBox.innerHTML = '<div class="cleaning-roi-box cleaning-roi-bad">Cleaning ROI is marginal - payback in ~' + daysToRecover + ' days. Consider cleaning soon.</div>';
    }
  }

  showDegradationResult();
  renderDegradationChart(monthlyGen);

  if (degradationChart && typeof degradationChart.resize === 'function') {
    degradationChart.resize();
  }

  var shareBtn = getDegradationElement('whatsapp-share-btn');
  var shareMessage = encodeURIComponent(
    'Solar Panel Health Check\n' +
    'System Size: ' + systemKw + ' kW\n' +
    'Total Performance Loss: ' + totalLoss.toFixed(1) + '%\n' +
    'Lost Revenue/Month: ₹' + Math.round(lostRevenue).toLocaleString('en-IN') + '\n' +
    'Check yours: https://shrikrishnasolar.in/solar-panel-degradation-calculator/'
  );

  if (shareBtn) {
    shareBtn.onclick = function () {
      window.open('https://wa.me/?text=' + shareMessage, '_blank');
    };
  }

  return false;
}

function calculate(event) {
  return calculateDegradation(event);
}

function initDegradationCalculator() {
  var form = getDegradationElement('degradation-form');
  var button = getDegradationElement('calculateDegradationBtn');

  if (form) {
    form.onsubmit = calculateDegradation;
  }

  if (button) {
    button.onclick = calculateDegradation;
  }
}

document.addEventListener('DOMContentLoaded', initDegradationCalculator);
