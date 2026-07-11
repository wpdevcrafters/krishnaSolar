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
