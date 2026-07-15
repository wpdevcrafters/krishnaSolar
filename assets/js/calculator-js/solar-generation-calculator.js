/* Solar generation calculator - ShriKrishna Solar */

var generationCities = [
  { name: 'Jodhpur / Bikaner (Rajasthan)', psh: 6.5 },
  { name: 'Ahmedabad / Surat (Gujarat)', psh: 6.2 },
  { name: 'Bhopal / Indore (MP)', psh: 5.8 },
  { name: 'Delhi / NCR', psh: 5.5 },
  { name: 'Hyderabad (Telangana)', psh: 5.5 },
  { name: 'Vijayawada (AP)', psh: 5.5 },
  { name: 'Pune / Nagpur (Maharashtra)', psh: 5.5 },
  { name: 'Bangalore (Karnataka)', psh: 5.3 },
  { name: 'Mumbai (Maharashtra)', psh: 5.3 },
  { name: 'Lucknow / Agra (UP)', psh: 5.2 },
  { name: 'Chennai (Tamil Nadu)', psh: 5.0 },
  { name: 'Kochi (Kerala)', psh: 5.0 },
  { name: 'Kolkata (West Bengal)', psh: 4.8 },
  { name: 'Patna (Bihar)', psh: 4.8 },
  { name: 'Guwahati (Assam)', psh: 4.5 }
];

function getGenerationElement(id) {
  return document.getElementById(id);
}

function showGenerationResult() {
  var resultBox = getGenerationElement('result-box');
  var emptyState = getGenerationElement('empty-state');

  document.body.className = document.body.className.indexOf('is-calculated') === -1
    ? document.body.className + ' is-calculated'
    : document.body.className;

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

function buildGenerationCityTable() {
  var tbody = getGenerationElement('city-table-body');
  if (!tbody) return;

  var maxPsh = 6.5;
  var pr = 0.82;
  var rows = [];

  for (var i = 0; i < generationCities.length; i++) {
    var city = generationCities[i];
    var perKwDay = (city.psh * pr).toFixed(1);
    var per3KwMon = Math.round(city.psh * pr * 3 * 30);
    var per5KwYear = Math.round(city.psh * pr * 5 * 365);
    var pct = Math.round(city.psh / maxPsh * 100);

    rows.push(
      '<tr>' +
      '<td>' + city.name + '</td>' +
      '<td>' + city.psh + ' hrs<div class="bar"><div class="bar-fill" style="--bar-width:' + pct + '%"></div></div></td>' +
      '<td>' + perKwDay + ' units</td>' +
      '<td>' + per3KwMon + ' units</td>' +
      '<td>' + per5KwYear.toLocaleString('en-IN') + ' units</td>' +
      '<td>' + Math.round(city.psh * 365) + ' kWh/m²</td>' +
      '</tr>'
    );
  }

  tbody.innerHTML = rows.join('');
}

function calcGeneration(event) {
  if (event && event.preventDefault) event.preventDefault();

  var kwInput = getGenerationElement('sys-kw');
  var citySelect = getGenerationElement('city-sel');
  var panelType = getGenerationElement('panel-type');
  var shading = getGenerationElement('shading');

  var kw = parseFloat(kwInput && kwInput.value) || 3;
  var psh = parseFloat(citySelect && citySelect.value) || 5.0;
  var pr = parseFloat(panelType && panelType.value) || 0.82;
  var shade = parseFloat(shading && shading.value) || 1.0;
  var cityName = citySelect ? citySelect.options[citySelect.selectedIndex].text : 'your city';

  var dailyGen = kw * psh * pr * shade;
  var monthGen = dailyGen * 30;
  var yearGen = dailyGen * 365;
  var tariff = 7;
  var monthlySaving = Math.round(monthGen * tariff);
  var yearlySaving = Math.round(yearGen * tariff);
  var co2Year = (yearGen * 0.82 / 1000).toFixed(1);

  var dailyEl = getGenerationElement('r-daily');
  var gridEl = getGenerationElement('r-grid');
  var noteEl = getGenerationElement('r-note');

  if (dailyEl) dailyEl.textContent = dailyGen.toFixed(1);

  if (gridEl) {
    var items = [
      { val: dailyGen.toFixed(1) + ' kWh', lbl: 'Per Day' },
      { val: Math.round(monthGen) + ' kWh', lbl: 'Per Month' },
      { val: Math.round(yearGen).toLocaleString('en-IN') + ' kWh', lbl: 'Per Year' },
      { val: '₹' + monthlySaving, lbl: 'Monthly Savings' },
      { val: '₹' + yearlySaving.toLocaleString('en-IN'), lbl: 'Yearly Savings' },
      { val: co2Year + ' tonnes', lbl: 'CO2 Saved/Year' }
    ];
    var html = [];

    for (var j = 0; j < items.length; j++) {
      html.push('<div class="r-item"><div class="r-val">' + items[j].val + '</div><div class="r-lbl">' + items[j].lbl + '</div></div>');
    }

    gridEl.innerHTML = html.join('');
  }

  if (noteEl) {
    noteEl.textContent =
      'Your ' + kw + ' kW system in ' + cityName + ' (' + psh + ' peak sun hrs) generates ' +
      dailyGen.toFixed(1) + ' units/day using the formula: ' + kw + ' kW x ' + psh +
      ' hrs x ' + pr + ' performance ratio x ' + shade + ' shade factor. Over a year, that is ' +
      Math.round(yearGen).toLocaleString('en-IN') + ' units worth ₹' +
      yearlySaving.toLocaleString('en-IN') + ' at ₹7/unit. CO2 avoided: ' + co2Year + ' tonnes/year.';
  }

  showGenerationResult();

  if (window.gtag) {
    window.gtag('event', 'generation_calc', { kw: kw, city: cityName, daily: dailyGen.toFixed(1) });
  }

  return false;
}

document.addEventListener('DOMContentLoaded', function () {
  buildGenerationCityTable();

  var calculateBtn = getGenerationElement('calculateGenerationBtn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calcGeneration);
  }
});
