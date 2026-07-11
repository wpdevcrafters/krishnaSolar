/* solar-number-of-panels-calculator.html JS - ShriKrishna Solar */

var activeTab = 'bill';

function switchTab(tab, btn) {
  activeTab = tab;
  document.getElementById('tab-bill').style.display      = tab==='bill'      ? '' : 'none';
  document.getElementById('tab-appliance').style.display = tab==='appliance' ? '' : 'none';
  document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
}

function calcPanels() {
  var psh    = parseFloat(document.getElementById('psh').value) || 5.0;
  var panelW = parseInt(document.getElementById('panel-w').value) || 400;
  var pr     = 0.82;
  var unitsMonth, tariff;

  if (activeTab === 'bill') {
    var bill  = parseFloat(document.getElementById('bill').value) || 2500;
    tariff    = parseFloat(document.getElementById('tariff').value) || 7;
    unitsMonth = bill / tariff;
  } else {
    tariff = parseFloat(document.getElementById('tariff2').value) || 7;
    var hrs = parseFloat(document.getElementById('app-hrs').value) || 8;
    var totalW = 0;
    document.querySelectorAll('#appliance-list input[data-w]').forEach(function(inp){
      totalW += (parseFloat(inp.value)||0) * parseFloat(inp.dataset.w);
    });
    unitsMonth = totalW / 1000 * hrs * 30;
  }

  var sysKw  = Math.ceil(unitsMonth / (psh * pr * 30) * 10) / 10;
  sysKw      = Math.max(sysKw, 0.5);
  var panels = Math.ceil(sysKw * 1000 / panelW);
  var roofSqFt = panels * 28;
  var costRaw  = Math.round(sysKw * 62000);
  var subsidy  = sysKw >= 3 ? 78000 : sysKw >= 2 ? 60000 : 30000;
  var afterSub = costRaw - subsidy;
  var monthSave= Math.round(unitsMonth * tariff);
  var payback  = (afterSub / (monthSave * 12)).toFixed(1);
  var sysKwDisp= Math.round(sysKw*10)/10;

  document.getElementById('r-panels').textContent    = panels;
  document.getElementById('r-panels-sub').textContent= panelW + 'W panels for ' + sysKwDisp + ' kW system';

  // Panel visual (max 24 boxes)
  var visual = document.getElementById('panel-visual');
  var grid   = document.getElementById('panel-grid');
  var show   = Math.min(panels, 24);
  grid.innerHTML = Array(show).fill('<div class="panel-box"></div>').join('') + (panels>24?'<div class="calc-inline-190">+'+( panels-24)+' more</div>':'');
  visual.style.display = 'block';

  document.getElementById('r-grid').innerHTML = [
    {val: sysKwDisp+' kW',           lbl: 'System Size'},
    {val: panels+' panels',           lbl: panelW+'W each'},
    {val: roofSqFt+' sq ft',          lbl: 'Roof Area'},
    {val: 'â‚¹'+Math.round(costRaw/1000)+'K', lbl: 'System Cost'},
    {val: 'â‚¹'+(subsidy/1000)+'K',    lbl: 'PM Subsidy'},
    {val: 'â‚¹'+Math.round(afterSub/1000)+'K', lbl: 'After Subsidy'},
    {val: 'â‚¹'+monthSave+'/mo',        lbl: 'Monthly Savings'},
    {val: payback+' yrs',             lbl: 'Payback Period'},
  ].map(function(i){return '<div class="r-item"><div class="r-val">'+i.val+'</div><div class="r-lbl">'+i.lbl+'</div></div>';}).join('');

  document.getElementById('r-note').textContent =
    'For '+Math.round(unitsMonth)+' units/month: you need '+panels+' Ã— '+panelW+'W panels ('+sysKwDisp+' kW system). '+
    'Roof area required: ~'+roofSqFt+' sq ft. After â‚¹'+(subsidy/1000)+'K subsidy, cost is â‚¹'+Math.round(afterSub/1000)+'K. '+
    'Monthly electricity savings: â‚¹'+monthSave+'. Investment pays back in '+payback+' years.';
  document.getElementById('result-box').style.display = 'block';
  if(window.gtag) gtag('event','panels_calc',{panels:panels,sys_kw:sysKwDisp});
}

document.querySelectorAll('.faq-q').forEach(function(q){
  q.addEventListener('click',function(){
    var a=this.nextElementSibling,open=a.style.display==='block';
    document.querySelectorAll('.faq-a').forEach(function(x){x.style.display='none';});
    document.querySelectorAll('.faq-q').forEach(function(x){x.classList.remove('open');});
    if(!open){a.style.display='block';this.classList.add('open');}
  });
});
