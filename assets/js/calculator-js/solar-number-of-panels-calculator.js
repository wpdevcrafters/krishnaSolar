/* Solar number of panels calculator - ShriKrishna Solar */

let activePanelCountTab = 'bill';

function getPanelCountElement(id) {
  return document.getElementById(id);
}

function showPanelCountResult() {
  const resultBox = getPanelCountElement('result-box');
  const emptyState = getPanelCountElement('empty-state');

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

function switchTab(tab, btn) {
  activePanelCountTab = tab;

  const billTab = getPanelCountElement('tab-bill');
  const applianceTab = getPanelCountElement('tab-appliance');

  if (billTab) billTab.style.display = tab === 'bill' ? '' : 'none';
  if (applianceTab) applianceTab.style.display = tab === 'appliance' ? '' : 'none';

  document.querySelectorAll('.tab-btn').forEach(function (button) {
    button.classList.remove('active');
    button.setAttribute('aria-selected', 'false');
  });

  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
  }
}

function calcPanels() {
  const psh = parseFloat(getPanelCountElement('psh')?.value) || 5.0;
  const panelW = parseInt(getPanelCountElement('panel-w')?.value, 10) || 400;
  const pr = 0.82;
  let unitsMonth;
  let tariff;

  if (activePanelCountTab === 'bill') {
    const bill = parseFloat(getPanelCountElement('bill')?.value) || 2500;
    tariff = parseFloat(getPanelCountElement('tariff')?.value) || 7;
    unitsMonth = bill / tariff;
  } else {
    tariff = parseFloat(getPanelCountElement('tariff2')?.value) || 7;
    const hrs = parseFloat(getPanelCountElement('app-hrs')?.value) || 8;
    let totalW = 0;

    document.querySelectorAll('#appliance-list input[data-w]').forEach(function (input) {
      totalW += (parseFloat(input.value) || 0) * parseFloat(input.dataset.w);
    });

    unitsMonth = totalW / 1000 * hrs * 30;
  }

  const sysKw = Math.max(Math.ceil(unitsMonth / (psh * pr * 30) * 10) / 10, 0.5);
  const panels = Math.ceil(sysKw * 1000 / panelW);
  const roofSqFt = panels * 28;
  const costRaw = Math.round(sysKw * 62000);
  const subsidy = sysKw >= 3 ? 78000 : sysKw >= 2 ? 60000 : 30000;
  const afterSub = costRaw - subsidy;
  const monthSave = Math.round(unitsMonth * tariff);
  const payback = (afterSub / (monthSave * 12)).toFixed(1);
  const sysKwDisp = Math.round(sysKw * 10) / 10;

  const panelCount = getPanelCountElement('r-panels');
  const panelSub = getPanelCountElement('r-panels-sub');
  const visual = getPanelCountElement('panel-visual');
  const grid = getPanelCountElement('panel-grid');
  const resultGrid = getPanelCountElement('r-grid');
  const note = getPanelCountElement('r-note');

  if (panelCount) panelCount.textContent = panels;
  if (panelSub) panelSub.textContent = `${panelW}W panels for ${sysKwDisp} kW system`;

  if (grid) {
    const shownPanels = Math.min(panels, 24);
    grid.innerHTML = Array(shownPanels).fill('<div class="panel-box"></div>').join('') +
      (panels > 24 ? `<div>+${panels - 24} more</div>` : '');
  }

  if (visual) visual.style.setProperty('display', 'block', 'important');

  if (resultGrid) {
    resultGrid.innerHTML = [
      { val: `${sysKwDisp} kW`, lbl: 'System Size' },
      { val: `${panels} panels`, lbl: `${panelW}W each` },
      { val: `${roofSqFt} sq ft`, lbl: 'Roof Area' },
      { val: `₹${Math.round(costRaw / 1000)}K`, lbl: 'System Cost' },
      { val: `₹${subsidy / 1000}K`, lbl: 'PM Subsidy' },
      { val: `₹${Math.round(afterSub / 1000)}K`, lbl: 'After Subsidy' },
      { val: `₹${monthSave}/mo`, lbl: 'Monthly Savings' },
      { val: `${payback} yrs`, lbl: 'Payback Period' },
    ].map(function (item) {
      return `<div class="r-item"><div class="r-val">${item.val}</div><div class="r-lbl">${item.lbl}</div></div>`;
    }).join('');
  }

  if (note) {
    note.textContent = `For ${Math.round(unitsMonth)} units/month: you need ${panels} x ${panelW}W panels (${sysKwDisp} kW system). ` +
      `Roof area required: ~${roofSqFt} sq ft. After ₹${subsidy / 1000}K subsidy, cost is ₹${Math.round(afterSub / 1000)}K. ` +
      `Monthly electricity savings: ₹${monthSave}. Investment pays back in ${payback} years.`;
  }

  showPanelCountResult();

  if (window.gtag) {
    window.gtag('event', 'panels_calc', { panels: panels, sys_kw: sysKwDisp });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const applianceTab = getPanelCountElement('tab-appliance');
  const calculateBtn = getPanelCountElement('calculatePanelsBtn');

  if (applianceTab) applianceTab.style.display = 'none';

  document.querySelectorAll('[data-panel-tab]').forEach(function (button) {
    button.addEventListener('click', function () {
      switchTab(button.dataset.panelTab, button);
    });
  });

  if (calculateBtn) {
    calculateBtn.addEventListener('click', function (event) {
      event.preventDefault();
      calcPanels();
    });
  }
});
