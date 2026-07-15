/* Solar water heater calculator - ShriKrishna Solar */

function getWaterHeaterElement(id) {
  return document.getElementById(id);
}

function showWaterHeaterResult() {
  const resultBox = getWaterHeaterElement('result-box');
  const emptyState = getWaterHeaterElement('empty-state');

  document.body.classList.add('is-calculated');

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

function calculateSWH() {
  const members = parseInt(getWaterHeaterElement('family_members')?.value, 10);
  const usage = getWaterHeaterElement('usage_type')?.value || 'medium';
  const type = getWaterHeaterElement('heater_type')?.value || 'ETC';

  if (!members || members < 1) return;

  let lpdPerPerson = 40;
  if (usage === 'medium') lpdPerPerson = 50;
  if (usage === 'high') lpdPerPerson = 75;

  const totalLPD = members * lpdPerPerson;

  let recommendedLPD = 100;
  if (totalLPD > 100 && totalLPD <= 150) recommendedLPD = 150;
  else if (totalLPD > 150 && totalLPD <= 200) recommendedLPD = 200;
  else if (totalLPD > 200 && totalLPD <= 250) recommendedLPD = 250;
  else if (totalLPD > 250 && totalLPD <= 300) recommendedLPD = 300;
  else if (totalLPD > 300) recommendedLPD = 500;

  let costPerLPD = type === 'ETC' ? 220 : 350;
  if (recommendedLPD >= 200) costPerLPD *= 0.9;

  const totalCost = recommendedLPD * costPerLPD;
  const unitsSavedPerDay = (recommendedLPD / 100) * 3.5;
  const daysUsed = 250;
  const annualUnitsSaved = Math.round(unitsSavedPerDay * daysUsed);
  const unitRate = 8;
  const annualMoneySaved = annualUnitsSaved * unitRate;
  const roiYears = totalCost / annualMoneySaved;

  getWaterHeaterElement('res_lpd').innerText = recommendedLPD;
  getWaterHeaterElement('res_cost').innerText = Math.round(totalCost).toLocaleString('en-IN');
  getWaterHeaterElement('res_units_saved').innerText = `${annualUnitsSaved} kWh`;
  getWaterHeaterElement('res_money_saved').innerText = `₹${annualMoneySaved.toLocaleString('en-IN')}`;
  getWaterHeaterElement('res_roi').innerText = `${roiYears.toFixed(1)} Years`;

  showWaterHeaterResult();

  const resultBox = getWaterHeaterElement('result-box');
  if (resultBox && window.innerWidth < 768) {
    resultBox.scrollIntoView({ behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const calcForm = getWaterHeaterElement('swh-calculator-form');

  if (calcForm) {
    calcForm.addEventListener('submit', function (event) {
      event.preventDefault();
      calculateSWH();
    });
  }
});
