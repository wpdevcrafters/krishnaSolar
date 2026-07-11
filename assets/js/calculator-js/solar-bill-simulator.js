/* Solar Bill Simulator JS — ShriKrishna Solar */

const SEASONALITY = [0.80, 0.85, 0.95, 1.20, 1.40, 1.10, 0.85, 0.80, 0.90, 0.95, 0.85, 0.80];
const SOLAR_GEN = [1.0, 1.0, 1.0, 1.15, 1.15, 1.15, 0.75, 0.75, 0.75, 1.0, 1.0, 1.0];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const ORIENTATION_FACTOR = { south: 1.0, eastwest: 0.90, mixed: 0.80 };
const UNITS_PER_KW_DAY = 4.0;
const CO2_FACTOR = 0.82;

let billChart = null;

document.addEventListener('DOMContentLoaded', function () {
    const kwSlider = document.getElementById('system_kw');
    if (kwSlider) {
        kwSlider.addEventListener('input', function () {
            const label = document.getElementById('kw-label');
            const display = document.getElementById('kw-display');
            if (label) label.textContent = this.value;
            if (display) display.textContent = this.value + ' kW';
        });
    }

    const form = document.getElementById('bill-sim-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            calculate();
        });
    }
});

function calculate() {
    const baseBill = parseFloat(document.getElementById('monthly_bill').value);
    const systemKw = parseFloat(document.getElementById('system_kw').value);
    const orientation = document.getElementById('orientation').value;
    const orFactor = ORIENTATION_FACTOR[orientation];
    const dailyGen = systemKw * UNITS_PER_KW_DAY * orFactor;

    const currentBills = [];
    const postSolarBills = [];
    let totalSavings = 0;
    let totalUnits = 0;

    for (let m = 0; m < 12; m++) {
        const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31][m];
        const currentBill = baseBill * SEASONALITY[m];
        const monthlyGen = dailyGen * daysInMonth * SOLAR_GEN[m];
        const avgTariff = 7.0;
        const unitsConsumed = currentBill / avgTariff;
        const unitsOffset = Math.min(monthlyGen, unitsConsumed);
        const saving = unitsOffset * avgTariff;
        const postBill = Math.max(0, currentBill - saving);

        currentBills.push(Math.round(currentBill));
        postSolarBills.push(Math.round(postBill));
        totalSavings += saving;
        totalUnits += monthlyGen;
    }

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('res_annual_savings', '₹' + Math.round(totalSavings).toLocaleString('en-IN'));
    set('res_monthly_avg', '₹' + Math.round(totalSavings / 12).toLocaleString('en-IN'));
    set('res_units', Math.round(totalUnits).toLocaleString('en-IN') + ' kWh');
    set('res_co2', Math.round(totalUnits * CO2_FACTOR).toLocaleString('en-IN') + ' kg');

    // Chart (requires Chart.js — loaded on page)
    if (typeof Chart !== 'undefined') {
        if (billChart) billChart.destroy();
        const canvas = document.getElementById('billChart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            billChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: MONTHS,
                    datasets: [
                        { label: 'Current Bill (₹)', data: currentBills, backgroundColor: 'rgba(239,68,68,0.75)', borderColor: '#DC2626', borderWidth: 1, borderRadius: 4 },
                        { label: 'Post-Solar Bill (₹)', data: postSolarBills, backgroundColor: 'rgba(34,197,94,0.75)', borderColor: '#16A34A', borderWidth: 1, borderRadius: 4 }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: { callbacks: { label: function(ctx) { return ctx.dataset.label + ': ₹' + ctx.parsed.y.toLocaleString('en-IN'); } } }
                    },
                    scales: { y: { beginAtZero: true, ticks: { callback: function(v) { return '₹' + v.toLocaleString('en-IN'); } } } }
                }
            });
        }
    }

    const emptyState = document.getElementById('empty-state');
    const resultBox = document.getElementById('result-box');
    if (emptyState) emptyState.style.display = 'none';
    if (resultBox) resultBox.style.display = 'block';

    const state = document.getElementById('state') ? document.getElementById('state').value || 'India' : 'India';
    const msg = encodeURIComponent(
        '☀️ Solar Bill Simulation Results\nState: ' + state + ' | System: ' + systemKw + ' kW\n' +
        'Annual Savings: ₹' + Math.round(totalSavings).toLocaleString('en-IN') + '\n' +
        'CO₂ Offset: ' + Math.round(totalUnits * CO2_FACTOR).toLocaleString('en-IN') + ' kg/year'
    );
    const shareBtn = document.getElementById('whatsapp-share-btn');
    if (shareBtn) shareBtn.onclick = function () { window.open('https://wa.me/?text=' + msg, '_blank'); };
}

function submitLead(e) {
    e.preventDefault();
    document.getElementById('lead-form').style.display = 'none';
    const success = document.getElementById('lead-success');
    if (success) success.style.display = 'block';
}
