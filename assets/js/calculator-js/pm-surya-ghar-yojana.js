/* pm-surya-ghar-yojana.html JS - ShriKrishna Solar */

var TARIFFS = {maharashtra:8.5,gujarat:5.5,rajasthan:6.5,up:6.0,delhi:8.0,karnataka:7.0,tamilnadu:5.0,andhra:6.5,telangana:7.5,mp:6.0,haryana:7.5,punjab:7.0,westbengal:7.5,other:7.0};
var STATE_SUB = {maharashtra:0,gujarat:10000,rajasthan:15000,up:0,delhi:2000,karnataka:0,tamilnadu:0,andhra:0,telangana:0,mp:0,haryana:15000,punjab:0,westbengal:0,other:0};

function calcSubsidy() {
  var bill     = parseFloat(document.getElementById('monthly-bill').value) || 2000;
  var stateEl  = document.getElementById('state-sel');
  var stateKey = stateEl.value;
  var tariff   = TARIFFS[stateKey] || 7;
  var stateSub = STATE_SUB[stateKey] || 0;
  var roofSqFt = parseFloat(document.getElementById('roof-area').value) || 400;

  // Units consumed
  var unitsMonth = bill / tariff;
  // System size needed (1 kW â‰ˆ 100 units/month)
  var sizeKw = Math.min(Math.max(Math.ceil(unitsMonth / 100 * 10) / 10, 1), 10);
  // Roof check (100 sqft per kW)
  var maxByRoof = Math.floor(roofSqFt / 100);
  var recommended = Math.min(sizeKw, maxByRoof);
  recommended = Math.max(recommended, 1);
  // Cap subsidy at 3kW
  var centralSub = recommended >= 3 ? 78000 : recommended >= 2 ? 60000 : 30000;
  var totalSub   = centralSub + stateSub;
  // Cost estimate
  var costPerKw  = 60000; // avg installed cost
  var totalCost  = Math.round(recommended * costPerKw);
  var afterSub   = totalCost - totalSub;
  // Units generated
  var unitsGen   = Math.round(recommended * 110); // 110 units/kW/month avg India
  // Monthly savings
  var monthlySaving = Math.round(unitsGen * tariff);
  // Payback
  var paybackMonths = afterSub > 0 ? Math.round(afterSub / monthlySaving) : 0;
  var paybackYrs    = (paybackMonths / 12).toFixed(1);

  var items = [
    {val: recommended + ' kW',    lbl: 'Recommended Size'},
    {val: 'â‚¹' + (centralSub/1000).toFixed(0) + 'K',   lbl: 'Central Subsidy'},
    {val: totalSub > centralSub ? 'â‚¹' + (totalSub/1000).toFixed(0) + 'K' : 'â‚¹' + (centralSub/1000).toFixed(0) + 'K', lbl: 'Total Subsidy'},
    {val: 'â‚¹' + Math.round(afterSub/1000) + 'K',   lbl: 'Cost After Subsidy'},
    {val: unitsGen + ' units',    lbl: 'Generation/Month'},
    {val: 'â‚¹' + monthlySaving,    lbl: 'Monthly Savings'},
    {val: paybackYrs + ' years',  lbl: 'Payback Period'},
  ];

  document.getElementById('result-grid').innerHTML = items.map(function(i){
    return '<div class="r-item"><div class="r-val">'+i.val+'</div><div class="r-lbl">'+i.lbl+'</div></div>';
  }).join('');
  var note = 'ðŸ’¡ A ' + recommended + ' kW system in ' + stateEl.options[stateEl.selectedIndex].text +
    ' generates ~' + unitsGen + ' units/month against your consumption of ~' + Math.round(unitsMonth) +
    ' units. After â‚¹' + (totalSub/1000).toFixed(0) + 'K subsidy, you pay ~â‚¹' + Math.round(afterSub/1000) +
    'K and recover it in ' + paybackYrs + ' years through electricity savings of â‚¹' + monthlySaving + '/month.';
  if (stateSub > 0) note += ' Your state ('+stateEl.options[stateEl.selectedIndex].text+') adds â‚¹' + (stateSub/1000).toFixed(0) + 'K extra subsidy.';
  document.getElementById('r-note').textContent = note;
  document.getElementById('result-box').style.display = 'block';
  if(window.gtag) gtag('event','pm_surya_calc',{recommended_kw:recommended,subsidy:totalSub});
}

document.querySelectorAll('.faq-q').forEach(function(q){
  q.addEventListener('click',function(){
    var a=this.nextElementSibling,open=a.style.display==='block';
    document.querySelectorAll('.faq-a').forEach(function(x){x.style.display='none';});
    document.querySelectorAll('.faq-q').forEach(function(x){x.classList.remove('open');});
    if(!open){a.style.display='block';this.classList.add('open');}
  });
});
