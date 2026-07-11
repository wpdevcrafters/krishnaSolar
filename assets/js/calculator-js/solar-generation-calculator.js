/* solar-generation-calculator.html JS - ShriKrishna Solar */

var CITIES = [
  {name:'Jodhpur / Bikaner (Rajasthan)',  psh:6.5},
  {name:'Ahmedabad / Surat (Gujarat)',     psh:6.2},
  {name:'Bhopal / Indore (MP)',            psh:5.8},
  {name:'Delhi / NCR',                     psh:5.5},
  {name:'Hyderabad (Telangana)',           psh:5.5},
  {name:'Vijayawada (AP)',                 psh:5.5},
  {name:'Pune / Nagpur (Maharashtra)',     psh:5.5},
  {name:'Bangalore (Karnataka)',           psh:5.3},
  {name:'Mumbai (Maharashtra)',            psh:5.3},
  {name:'Lucknow / Agra (UP)',             psh:5.2},
  {name:'Chennai (Tamil Nadu)',            psh:5.0},
  {name:'Kochi (Kerala)',                  psh:5.0},
  {name:'Kolkata (West Bengal)',           psh:4.8},
  {name:'Patna (Bihar)',                   psh:4.8},
  {name:'Guwahati (Assam)',               psh:4.5},
];

// Build city table
(function(){
  var tbody = document.getElementById('city-table-body');
  var maxPsh = 6.5;
  tbody.innerHTML = CITIES.map(function(c){
    var pr = 0.82;
    var perKwDay   = (c.psh * pr).toFixed(1);
    var per3KwMon  = Math.round(c.psh * pr * 3 * 30);
    var per5KwYear = Math.round(c.psh * pr * 5 * 365);
    var pct = Math.round(c.psh / maxPsh * 100);
    return '<tr><td>'+c.name+'</td><td>'+c.psh+' hrs<div class="bar"><div class="bar-fill calc-inline-132"></div></div></td><td>'+perKwDay+' units</td><td>'+per3KwMon+' units</td><td>'+per5KwYear.toLocaleString('en-IN')+' units</td><td>'+Math.round(c.psh*365)+' kWh/mÂ²</td></tr>';
  }).join('');
})();

function calcGeneration() {
  var kw      = parseFloat(document.getElementById('sys-kw').value) || 3;
  var psh     = parseFloat(document.getElementById('city-sel').value) || 5.0;
  var pr      = parseFloat(document.getElementById('panel-type').value) || 0.82;
  var shade   = parseFloat(document.getElementById('shading').value) || 1.0;
  var cityName= document.getElementById('city-sel').options[document.getElementById('city-sel').selectedIndex].text;

  var dailyGen  = kw * psh * pr * shade;
  var monthGen  = dailyGen * 30;
  var yearGen   = dailyGen * 365;
  // Assume â‚¹7/unit average tariff
  var tariff    = 7;
  var monthlySaving = Math.round(monthGen * tariff);
  var yearlySaving  = Math.round(yearGen * tariff);
  // CO2: 0.82 kg CO2 per kWh
  var co2Year   = (yearGen * 0.82 / 1000).toFixed(1);

  document.getElementById('r-daily').textContent = dailyGen.toFixed(1);
  document.getElementById('r-grid').innerHTML = [
    {val: dailyGen.toFixed(1) + ' kWh',   lbl: 'Per Day'},
    {val: Math.round(monthGen) + ' kWh',  lbl: 'Per Month'},
    {val: Math.round(yearGen).toLocaleString('en-IN') + ' kWh', lbl: 'Per Year'},
    {val: 'â‚¹' + monthlySaving,            lbl: 'Monthly Savings'},
    {val: 'â‚¹' + yearlySaving.toLocaleString('en-IN'), lbl: 'Yearly Savings'},
    {val: co2Year + ' tonnes',            lbl: 'COâ‚‚ Saved/Year'},
  ].map(function(i){return '<div class="r-item"><div class="r-val">'+i.val+'</div><div class="r-lbl">'+i.lbl+'</div></div>';}).join('');

  document.getElementById('r-note').textContent =
    'Your '+kw+' kW system in '+cityName+' ('+psh+' peak sun hrs) generates '+dailyGen.toFixed(1)+
    ' units/day using the formula: '+kw+' kW Ã— '+psh+' hrs Ã— '+pr+' performance ratio Ã— '+shade+' shade factor. '+
    'Over a year, that is '+Math.round(yearGen).toLocaleString('en-IN')+' units worth â‚¹'+yearlySaving.toLocaleString('en-IN')+
    ' at â‚¹7/unit. COâ‚‚ avoided: '+co2Year+' tonnes/year.';
  document.getElementById('result-box').style.display = 'block';
  if(window.gtag) gtag('event','generation_calc',{kw:kw,city:cityName,daily:dailyGen.toFixed(1)});
}

document.querySelectorAll('.faq-q').forEach(function(q){
  q.addEventListener('click',function(){
    var a=this.nextElementSibling,open=a.style.display==='block';
    document.querySelectorAll('.faq-a').forEach(function(x){x.style.display='none';});
    document.querySelectorAll('.faq-q').forEach(function(x){x.classList.remove('open');});
    if(!open){a.style.display='block';this.classList.add('open');}
  });
});
