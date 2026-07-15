/* solar-energy-savings-calculator.html JS - ShriKrishna Solar */

/*
  Solar Energy Savings Calculator (25-Year Forecast)
  Calculates inflation-adjusted savings from solar.
*/

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('savings-calculator-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const bill = parseFloat(document.getElementById('monthly_bill').value);
            const inflationInput = document.getElementById('inflation');
            const inflation = inflationInput ? (parseFloat(inflationInput.value) / 100) : 0.05;

            if (isNaN(bill)) return;

            let annualBill = bill * 12;
            let totalSavings = 0;
            let savingsYear1 = 0;
            let savingsYear10 = 0;
            let savingsYear25 = 0;

            // 25 Year Loop
            for (let i = 1; i <= 25; i++) {
                if (i === 1) savingsYear1 = annualBill;
                if (i === 10) savingsYear10 = annualBill;
                if (i === 25) savingsYear25 = annualBill;

                totalSavings += annualBill;
                annualBill = annualBill * (1 + inflation); // Bill increases next year
                // Note: Simplified model ignores degradation to emphasize inflation impact on bill value
            }

            // Update UI
            updateElementText('res_total', Math.round(totalSavings).toLocaleString('en-IN'));
            updateElementText('res_year1_save', "₹ " + Math.round(savingsYear1).toLocaleString('en-IN'));
            updateElementText('res_year10_save', "₹ " + Math.round(savingsYear10).toLocaleString('en-IN'));
            updateElementText('res_year25_save', "₹ " + Math.round(savingsYear25).toLocaleString('en-IN'));

            const emptyState = document.getElementById('empty-state');
            if (emptyState) emptyState.style.display = 'none';

            const resultBox = document.getElementById('result-box');
            if (resultBox) {
                resultBox.style.display = 'block';
                if (window.innerWidth < 768) {
                    resultBox.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
});

function updateElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}
