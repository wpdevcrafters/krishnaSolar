/* solar-panel-for-ac-calculator.html JS - ShriKrishna Solar */

function calcACSolar() {
  var ton      = parseFloat(document.getElementById('ac-ton').value)    || 1.5;
  var stars    = parseFloat(document.getElementById('ac-stars').value)  || 1.2;
  var count    = parseInt(document.getElementById('ac-count').value)    || 1;
  var hrs      = parseFloat(document.getElementById('ac-hrs').value)    || 8;
  var other    = parseFloat(document.getElementById('other-load').value)|| 0.5;
  var tariff   = parseFloat(document.getElementById('tariff-sel').value)|| 7;

  // AC power consumption: ton Ã— 1000W Ã— kW_per_ton_factor
  var acKw     = ton * stars;           // kW per AC
  var totalAcKw= acKw * count;
  var totalLoad= totalAcKw + other;     // total running load kW

  // System size: cover peak load + 20% buffer, then size for daily kWh
  var dailyKwh = totalLoad * hrs;        // kWh/day needed
  var psh      = 5.0;                    // avg India sunshine hrs
  var pr       = 0.82;
  var sysKw    = Math.ceil(dailyKwh / (psh * pr) * 10) / 10;
  sysKw        = Math.max(sysKw, 1);

  var panels400= Math.ceil(sysKw * 1000 / 400);
  var roofSqFt = Math.ceil(panels400 * 28);

  // Cost
  var rawCost  = Math.round(sysKw * 62000);
  var subsidy  = sysKw >= 3 ? 78000 : sysKw >= 2 ? 60000 : 30000;
  var afterSub = rawCost - subsidy;

  // Generation & savings
  var monthlyUnits  = Math.round(sysKw * psh * pr * 30);
  var monthlySaving = Math.round(monthlyUnits * tariff);
  var paybackYrs    = (afterSub / (monthlySaving * 12)).toFixed(1);

  document.getElementById('rh-grid').innerHTML = [
    {val: sysKw + ' kW', lbl: 'System Size'},
    {val: panels400 + ' panels', lbl: '400W Panels'},
    {val: 'â‚¹' + Math.round(afterSub/1000) + 'K', lbl: 'Cost After Subsidy'},
  ].map(function(i){return '<div><div class="rh-val">'+i.val+'</div><div class="rh-lbl">'+i.lbl+'</div></div>';}).join('');

  document.getElementById('r-grid').innerHTML = [
    {val: totalLoad.toFixed(1)+' kW',  lbl: 'Total Load'},
    {val: dailyKwh.toFixed(1)+' kWh',  lbl: 'Daily Consumption'},
    {val: roofSqFt+' sq ft',            lbl: 'Roof Area Needed'},
    {val: 'â‚¹'+rawCost.toLocaleString('en-IN'), lbl: 'System Cost'},
    {val: 'â‚¹'+(subsidy/1000).toFixed(0)+'K',  lbl: 'PM Subsidy'},
    {val: monthlyUnits+' units',        lbl: 'Monthly Generation'},
    {val: 'â‚¹'+monthlySaving,            lbl: 'Monthly Savings'},
    {val: paybackYrs+' years',          lbl: 'Payback Period'},
  ].map(function(i){return '<div class="r-item"><div class="r-val">'+i.val+'</div><div class="r-lbl">'+i.lbl+'</div></div>';}).join('');

  document.getElementById('r-note').textContent =
    'For '+count+'Ã—'+ton+'T AC ('+totalAcKw.toFixed(1)+' kW) + '+other+' kW home load running '+hrs+' hrs/day: '+
    'you need a '+sysKw+' kW system with '+panels400+' Ã— 400W panels on ~'+roofSqFt+' sq ft of roof. '+
    'After â‚¹'+(subsidy/1000).toFixed(0)+'K PM Surya Ghar subsidy, cost is â‚¹'+Math.round(afterSub/1000)+'K. '+
    'Monthly savings: â‚¹'+monthlySaving+'. Payback: '+paybackYrs+' years.';
  document.getElementById('result-box').style.display = 'block';
  if(window.gtag) gtag('event','ac_solar_calc',{ton:ton,count:count,sys_kw:sysKw});
}

document.querySelectorAll('.faq-q').forEach(function(q){
  q.addEventListener('click',function(){
    var a=this.nextElementSibling,open=a.style.display==='block';
    document.querySelectorAll('.faq-a').forEach(function(x){x.style.display='none';});
    document.querySelectorAll('.faq-q').forEach(function(x){x.classList.remove('open');});
    if(!open){a.style.display='block';this.classList.add('open');}
  });
});
