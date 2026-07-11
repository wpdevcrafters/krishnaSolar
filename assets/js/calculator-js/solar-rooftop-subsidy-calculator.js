/* solar-rooftop-subsidy-calculator.html JS - ShriKrishna Solar */

/* City data per state */
var CITIES = {
  "Andhra Pradesh":    ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Tirupati","Kakinada","Rajahmundry"],
  "Arunachal Pradesh": ["Itanagar","Naharlagun","Pasighat"],
  "Assam":             ["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur"],
  "Bihar":             ["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Arrah"],
  "Chandigarh":        ["Chandigarh"],
  "Chhattisgarh":      ["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon"],
  "Delhi":             ["New Delhi","Dwarka","Rohini","Janakpuri","Lajpat Nagar","Saket","Noida Extension"],
  "Goa":               ["Panaji","Vasco da Gama","Margao","Mapusa","Ponda"],
  "Gujarat":           ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Gandhinagar","Anand","Nadiad"],
  "Haryana":           ["Gurugram","Faridabad","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal"],
  "Himachal Pradesh":  ["Shimla","Manali","Dharamsala","Solan","Mandi","Kullu"],
  "Jharkhand":         ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribagh"],
  "Karnataka":         ["Bengaluru","Mysuru","Hubballi","Mangaluru","Belagavi","Davanagere","Ballari","Kalaburagi"],
  "Kerala":            ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Palakkad","Malappuram","Kannur"],
  "Madhya Pradesh":    ["Bhopal","Indore","Gwalior","Jabalpur","Ujjain","Sagar","Dewas","Satna"],
  "Maharashtra":       ["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Thane","Navi Mumbai","Kolhapur"],
  "Manipur":           ["Imphal","Thoubal","Bishnupur"],
  "Meghalaya":         ["Shillong","Tura","Jowai"],
  "Mizoram":           ["Aizawl","Lunglei","Champhai"],
  "Nagaland":          ["Kohima","Dimapur","Mokokchung"],
  "Odisha":            ["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore"],
  "Puducherry":        ["Puducherry","Karaikal","Yanam"],
  "Punjab":            ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Hoshiarpur"],
  "Rajasthan":         ["Jaipur","Jodhpur","Udaipur","Kota","Ajmer","Bikaner","Sikar","Alwar"],
  "Sikkim":            ["Gangtok","Namchi","Gyalshing"],
  "Tamil Nadu":        ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tiruppur","Vellore","Erode"],
  "Telangana":         ["Hyderabad","Warangal","Nizamabad","Khammam","Karimnagar","Ramagundam"],
  "Tripura":           ["Agartala","Dharmanagar","Udaipur"],
  "Uttar Pradesh":     ["Lucknow","Kanpur","Ghaziabad","Agra","Meerut","Varanasi","Allahabad","Bareilly","Aligarh","Moradabad"],
  "Uttarakhand":       ["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur"],
  "West Bengal":       ["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Bardhaman","Malda"]
};

function loadCities() {
  var state   = document.getElementById('state').value;
  var cityGrp = document.getElementById('city-group');
  var citySel = document.getElementById('city');
  citySel.innerHTML = '<option value="">All Cities</option>';
  if (state && CITIES[state]) {
    CITIES[state].forEach(function(c) {
      var opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      citySel.appendChild(opt);
    });
    cityGrp.style.display = '';
  } else {
    cityGrp.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var emptyState = document.getElementById('empty-state');
  var resultBox = document.getElementById('result-box');
  if (emptyState) emptyState.style.display = 'block';
  if (resultBox) resultBox.style.display = 'none';
  var form = document.getElementById('subsidy-calculator-form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      calculateSubsidy();
    });
  }

  var stateSelect = document.getElementById('state');
  if (stateSelect) {
    stateSelect.addEventListener('change', loadCities);
  }

  var quoteBtn = document.getElementById('subsidy-quote-btn');
  if (quoteBtn) {
    quoteBtn.addEventListener('click', handleGetQuotes);
  }

  var saveBtn = document.getElementById('save-calc-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', handleSaveCalculation);
  }
});

function formatINR(amount) {
  return Math.round(amount).toLocaleString('en-IN');
}

function getSubsidyAmount(capacity, category) {
  if (category === 'Commercial') return 0;
  if (category === 'RWA') return Math.min(capacity, 500) * 18000;
  if (capacity <= 1) return capacity * 30000;
  if (capacity <= 2) return capacity * 30000;
  if (capacity <= 3) return 60000 + ((capacity - 2) * 18000);
  return 78000;
}

function calculateSubsidy() {
  var state = document.getElementById('state');
  var city = document.getElementById('city');
  var capacityInput = document.getElementById('system_capacity');
  var categoryInput = document.getElementById('consumer_category');
  var capacity = parseFloat(capacityInput.value);
  var category = categoryInput.value;

  if (!state.value || !capacity || capacity <= 0) {
    if (capacityInput.reportValidity) capacityInput.reportValidity();
    return;
  }

  var costPerKw = category === 'RWA' ? 52000 : 65000;
  var estimatedCost = capacity * costPerKw;
  var subsidy = Math.min(getSubsidyAmount(capacity, category), estimatedCost);
  var netCost = Math.max(estimatedCost - subsidy, 0);
  var subsidyPercent = estimatedCost > 0 ? (subsidy / estimatedCost) * 100 : 0;
  var netPercent = estimatedCost > 0 ? (netCost / estimatedCost) * 100 : 0;

  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('result-box').style.display = 'flex';

  document.getElementById('res_subsidy_amount').textContent = formatINR(subsidy);
  document.getElementById('res_net_cost').textContent = formatINR(netCost);
  document.getElementById('res_state').textContent = city && city.value ? state.value + ' - ' + city.value : state.value;
  document.getElementById('res_capacity').textContent = capacity + ' kW';
  document.getElementById('res_category').textContent = category;
  document.getElementById('res_est_cost').textContent = formatINR(estimatedCost);

  var remarks = 'Eligible under PM Surya Ghar residential subsidy slab.';
  if (category === 'Commercial') remarks = 'Commercial and industrial consumers are not eligible for direct CFA subsidy.';
  if (category === 'RWA') remarks = 'RWA/common-area subsidy is calculated at Rs. 18,000 per kW up to 500kW.';
  document.getElementById('res_remarks').textContent = remarks;

  document.getElementById('bar_cost').style.width = '100%';
  document.getElementById('bar_sub').style.width = Math.min(subsidyPercent, 100) + '%';
  document.getElementById('bar_net').style.width = Math.min(netPercent, 100) + '%';
  document.getElementById('bar_cost_val').textContent = '\u20B9' + formatINR(estimatedCost);
  document.getElementById('bar_sub_val').textContent = '\u20B9' + formatINR(subsidy);
  document.getElementById('bar_net_val').textContent = '\u20B9' + formatINR(netCost);

  var tbody = document.getElementById('breakdown-body');
  tbody.innerHTML = '';
  [
    ['Estimated Project Cost', estimatedCost, 'Approx. benchmark turnkey cost'],
    ['Eligible Subsidy', -subsidy, 'Central Financial Assistance'],
    ['Net Payable Amount', netCost, 'Estimated amount after subsidy']
  ].forEach(function(row, index) {
    var tr = document.createElement('tr');
    if (index === 2) tr.className = 'total-row';
    var amount = row[1] < 0 ? '-\u20B9' + formatINR(Math.abs(row[1])) : '\u20B9' + formatINR(row[1]);
    tr.innerHTML = '<td>' + row[0] + '</td><td>' + amount + '</td><td>' + row[2] + '</td>';
    tbody.appendChild(tr);
  });

  ['slab-row-1', 'slab-row-2', 'slab-row-3', 'slab-row-4'].forEach(function(id) {
    var row = document.getElementById(id);
    if (row) row.classList.remove('hl');
  });
  var slabId = capacity <= 1 ? 'slab-row-1' : capacity <= 2 ? 'slab-row-2' : capacity <= 3 ? 'slab-row-3' : 'slab-row-4';
  var slabRow = document.getElementById(slabId);
  if (slabRow && category === 'Residential') slabRow.classList.add('hl');

  if (window.innerWidth < 768) {
    document.getElementById('result-box').scrollIntoView({ behavior: 'smooth' });
  }
}

function handleGetQuotes() {
  var state = document.getElementById('state');
  var city = document.getElementById('city');
  var capacity = document.getElementById('system_capacity');

  if (window.solarLeads) {
    window.solarLeads.showModal('Subsidy Calculator CTA', {
      state: state ? state.value : '',
      city: city && city.value ? city.value : '',
      size: capacity ? capacity.value : ''
    });
  }
}

function handleSaveCalculation() {
  var email = document.getElementById('save-calc-email');
  var status = document.getElementById('save-status-msg');
  if (!email || !status) return;
  if (!email.value || !email.checkValidity()) {
    email.reportValidity();
    return;
  }
  status.style.display = 'block';
  status.style.color = '#15803d';
  status.textContent = 'Report request saved. Our team will contact you shortly.';
}