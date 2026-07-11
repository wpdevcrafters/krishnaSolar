/* solar-water-heater-calculator.html JS - ShriKrishna Solar */

/*
        Solar Water Heater Calculator (Premium)
        Calculates LPD req based on family size.
        */

        const initSWHCalc = () => {
            const calcForm = document.getElementById('swh-calculator-form');
            if (calcForm) {
                calcForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    calculateSWH();
                });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSWHCalc);
        } else {
            initSWHCalc();
        }

        function calculateSWH() {
            const members = parseInt(document.getElementById('family_members').value);
            const usage = document.getElementById('usage_type').value;
            const type = document.getElementById('heater_type').value;

            if (!members || members < 1) return;

            // 1. Calculate LPD
            let lpdPerPerson = 40; // Low
            if (usage === 'medium') lpdPerPerson = 50;
            if (usage === 'high') lpdPerPerson = 75;

            let totalLPD = members * lpdPerPerson;

            // Round to nearest standard size (100, 150, 200, 250, 300, 500)
            let recommendedLPD = 100;
            if (totalLPD > 100 && totalLPD <= 150) recommendedLPD = 150;
            else if (totalLPD > 150 && totalLPD <= 200) recommendedLPD = 200;
            else if (totalLPD > 200 && totalLPD <= 250) recommendedLPD = 250;
            else if (totalLPD > 250 && totalLPD <= 300) recommendedLPD = 300;
            else if (totalLPD > 300) recommendedLPD = 500;

            // 2. Cost Estimation
            let costPerLPD = (type === 'ETC') ? 220 : 350; // ETC ~22k for 100L, FPC ~35k for 100L
            // Discount for larger systems slightly
            if (recommendedLPD >= 200) costPerLPD *= 0.9;

            const totalCost = recommendedLPD * costPerLPD;

            // 3. Savings (Assume Geyser Usage Replacement)
            // 100L hot water needs ~4 kWh electricity
            const unitsSavedPerDay = (recommendedLPD / 100) * 3.5; // Conservative
            const daysUsed = 250; // Sunny days usable
            const annualUnitsSaved = Math.round(unitsSavedPerDay * daysUsed);
            const unitRate = 8;
            const annualMoneySaved = annualUnitsSaved * unitRate;

            const roiYears = totalCost / annualMoneySaved;

            // 4. UI Update
            const emptyState = document.getElementById('empty-state');
            if (emptyState) emptyState.style.display = 'none';

            const resultBox = document.getElementById('result-box');
            resultBox.style.display = 'block';

            document.getElementById('res_lpd').innerText = recommendedLPD;
            document.getElementById('res_cost').innerText = `${Math.round(totalCost).toLocaleString('en-IN')}`;

            document.getElementById('res_units_saved').innerText = `${annualUnitsSaved} kWh`;
            document.getElementById('res_money_saved').innerText = `â‚¹${annualMoneySaved.toLocaleString('en-IN')}`;
            document.getElementById('res_roi').innerText = `${roiYears.toFixed(1)} Years`;

            if (window.innerWidth < 768) {
                resultBox.scrollIntoView({ behavior: 'smooth' });
            }
        }
