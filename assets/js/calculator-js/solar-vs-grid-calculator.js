/* solar-vs-grid-calculator.html JS - ShriKrishna Solar */

function calcVsGrid() {
  var bill      = parseFloat(document.getElementById('bill').value) || 3000;
  var tariff    = parseFloat(document.getElementById('tariff').value) || 7;
  var inc       = parseFloat(document.getElementById('tariff-inc').value) / 100 || 0.05;
  var sysKw     = parseFloat(document.getElementById('sys-kw').value) || 3;
  var install   = parseFloat(document.getElementById('install-cost').value) || 175000;
  var sub       = parseFloat(document.getElementById('subsidy').value) || 78000;
  var netCost   = install - sub;

  var monthlyUnits = bill / tariff;
  var psh = 5.0, pr = 0.82;
  var solarMonthlyUnits = sysKw * psh * pr * 30;
  var degradeRate = 0.005; // 0.5% per year

  var gridCumul  = 0, solarCumul = netCost;
  var paybackYr  = null;
  var rows       = [];

  for (var yr = 1; yr <= 25; yr++) {
    // Grid cost this year
    var currentTariff = tariff * Math.pow(1 + inc, yr - 1);
    var gridYear = monthlyUnits * currentTariff * 12;
    gridCumul += gridYear;

    // Solar: small maintenance (â‚¹2000/yr), occasional panel replacement after 12 yrs
    var maint = 2000;
    if (yr === 12) maint += 8000; // inverter service
    solarCumul += maint;

    // Solar generation savings
    var degFactor = Math.pow(1 - degradeRate, yr - 1);
    var solarSavingYear = Math.min(solarMonthlyUnits * degFactor, monthlyUnits) * currentTariff * 12;

    var gridRunning  = gridCumul;
    var solarRunning = solarCumul;
    // Solar net cost = install + maint - savings
    var solarNetRunning = netCost + maint * yr - solarSavingYear * yr;

    rows.push({yr: yr, grid: gridCumul, solar: Math.max(netCost, solarCumul - solarSavingYear * yr + netCost)});

    if (!paybackYr && solarCumul - solarSavingYear * yr < gridCumul - install - maint * yr) {
      // simpler payback check
    }
  }

  // Simple payback: net investment / annual savings
  var annualSavings = solarMonthlyUnits * tariff * 12;
  var paybackYears  = (netCost / annualSavings).toFixed(1);
  var savings25     = Math.round(gridCumul - netCost - 2000 * 25);

  // 25yr grid total
  var gridTotal25 = 0;
  for (var i = 0; i < 25; i++) gridTotal25 += monthlyUnits * tariff * Math.pow(1+inc,i) * 12;
  var solarTotal25 = netCost + 2000*25 + 8000;

  document.getElementById('payback-yr').textContent = paybackYears + ' years';
  document.getElementById('verdict-sub').textContent =
    '25-year savings: â‚¹' + Math.round((gridTotal25 - solarTotal25)/1000) + ',000 vs grid';
  document.getElementById('verdict').style.display = 'block';

  var sRows = [
    {l:'Installation', v:'â‚¹'+install.toLocaleString('en-IN')},
    {l:'PM Subsidy',   v:'âˆ’ â‚¹'+sub.toLocaleString('en-IN'), cls:'solar'},
    {l:'Net Investment', v:'â‚¹'+netCost.toLocaleString('en-IN')},
    {l:'Maintenance (25yr)', v:'â‚¹'+(2000*25+8000).toLocaleString('en-IN')},
    {l:'Total 25yr Cost', v:'â‚¹'+solarTotal25.toLocaleString('en-IN'), cls:'solar'},
    {l:'Monthly Savings', v:'â‚¹'+Math.round(annualSavings/12), cls:'solar'},
  ];
  var gRows = [
    {l:'Current Monthly Bill', v:'â‚¹'+bill},
    {l:'Tariff Increase', v:Math.round(inc*100)+'% per year'},
    {l:'Year 10 Monthly Bill', v:'â‚¹'+Math.round(bill*Math.pow(1+inc,9))},
    {l:'Year 25 Monthly Bill', v:'â‚¹'+Math.round(bill*Math.pow(1+inc,24))},
    {l:'Total 25yr Cost', v:'â‚¹'+Math.round(gridTotal25/1000)+'K', cls:'grid'},
    {l:'Wasted to Grid', v:'â‚¹'+Math.round((gridTotal25-solarTotal25)/1000)+'K extra', cls:'grid'},
  ];

  document.getElementById('solar-rows').innerHTML = sRows.map(function(r){
    return '<div class="vs-row"><span class="label">'+r.l+'</span><span class="value'+(r.cls?' '+r.cls:'')+'">'+r.v+'</span></div>';
  }).join('');
  document.getElementById('grid-rows').innerHTML = gRows.map(function(r){
    return '<div class="vs-row"><span class="label">'+r.l+'</span><span class="value'+(r.cls?' '+r.cls:'')+'">'+r.v+'</span></div>';
  }).join('');

  // Year table (show every 5 years)
  var tbody = '';
  var maxG = gridTotal25;
  for (var yr2 = 1; yr2 <= 25; yr2++) {
    var gCum = 0, sCum = netCost;
    for (var j = 0; j < yr2; j++) {
      gCum += monthlyUnits * tariff * Math.pow(1+inc,j) * 12;
      sCum += 2000 + (j===11?8000:0);
      var saves = solarMonthlyUnits * tariff * Math.pow(1+inc,j) * Math.pow(1-degradeRate,j) * 12;
      sCum -= saves;
    }
    sCum = Math.max(sCum, 0);
    var saving = gCum - sCum;
    var isPayback = Math.abs(parseFloat(paybackYears) - yr2) < 0.6;
    var sW = Math.round(sCum / maxG * 100), gW = Math.round(gCum / maxG * 100);
    if (yr2 % 5 === 0 || yr2 === 1 || isPayback) {
      tbody += '<tr'+(isPayback?' class="payback-row"':'')+'>'
        +'<td>'+yr2+(isPayback?' ðŸŽ¯':'')+' </td>'
        +'<td class="calc-inline-104">â‚¹'+Math.round(sCum/1000)+'K</td>'
        +'<td class="calc-inline-376">â‚¹'+Math.round(gCum/1000)+'K</td>'
        +'<td class="calc-inline-377">'+( saving>0?'+':'' )+'â‚¹'+Math.round(saving/1000)+'K</td>'
        +'<td class="bar-cell"><div class="bar-wrap"><div class="bar-s calc-inline-378" title="Solar"></div><div class="bar-g calc-inline-379" title="Grid"></div></div></td>'
        +'</tr>';
    }
  }
  document.getElementById('year-tbody').innerHTML = tbody;
  document.getElementById('results').style.display = 'block';
  if(window.gtag) gtag('event','vs_grid_calc',{bill:bill,payback:paybackYears});
}

document.querySelectorAll('.faq-q').forEach(function(q){
  q.addEventListener('click',function(){
    var a=this.nextElementSibling,open=a.style.display==='block';
    document.querySelectorAll('.faq-a').forEach(function(x){x.style.display='none';});
    document.querySelectorAll('.faq-q').forEach(function(x){x.classList.remove('open');});
    if(!open){a.style.display='block';this.classList.add('open');}
  });
});
