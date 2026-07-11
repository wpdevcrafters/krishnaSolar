/* solar-roi-calculator.html JS - ShriKrishna Solar */

/*
            Solar ROI Calculator (Premium Update)
            Calculates Payback Period and Internal Rate of Return (IRR) with UI Logic.
            */

            if (typeof SUBSIDY_MAX_KW === 'undefined') { var SUBSIDY_MAX_KW = 78000; } // PM Surya Ghar max subsidy (â‚¹78,000 for â‰¥3kW)

            document.addEventListener('DOMContentLoaded', () => {
                const calcForm = document.getElementById('roi-calculator-form');
                if (calcForm) {
                    calcForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        calculateROI();
                    });
                }
            });

            async function calculateROI() {
                const cost = parseFloat(document.getElementById('total_cost').value);
                const monthlyBill = parseFloat(document.getElementById('monthly_bill').value);

                // Annual Savings
                const annualSavings = monthlyBill * 12;

                // Payback Period
                const paybackYears = cost / annualSavings;

                // Lifetime Savings (25 Years)
                // Assume electricity tariff hikes cancel out performance degradation (simplification)
                const lifetimeSavings = annualSavings * 25;
                const netProfit = lifetimeSavings - cost;
                const roiPercent = (netProfit / cost) * 100;

                // Display
                const emptyState = document.getElementById('empty-state');
                if (emptyState) emptyState.style.display = 'none';

                const resultBox = document.getElementById('result-box');
                resultBox.style.display = 'block';

                const formatMoney = (amount) => {
                    const sign = amount < 0 ? '-' : '';
                    return `${sign}â‚¹${Math.abs(Math.round(amount)).toLocaleString('en-IN')}`;
                };

                document.getElementById('res_payback').innerText = `${paybackYears.toFixed(1)}`;
                document.getElementById('res_annual').innerText = formatMoney(annualSavings);
                document.getElementById('res_lifetime').innerText = formatMoney(lifetimeSavings);

                const profitEl = document.getElementById('res_profit');
                profitEl.innerText = formatMoney(netProfit);
                // Set color: Red if negative, Green if positive
                profitEl.style.color = netProfit < 0 ? '#dc3545' : '#15803d';

                document.getElementById('res_roi_percent').innerText = `${Math.round(roiPercent)}`;

                // 5. Advanced Growth: IRR Comparison
                const irrVal = (annualSavings / cost) * 100;
                document.getElementById('irr_val').innerText = `${irrVal.toFixed(1)}%`;
                document.getElementById('irr_bar').style.width = `${Math.min(irrVal, 100)}%`;



                if (window.innerWidth < 768) {
                    resultBox.scrollIntoView({ behavior: 'smooth' });
                }

                // Yield to allow UI to paint
                await new Promise(resolve => setTimeout(resolve, 0));

                // 7. Lead Capture v1 Integration
                if (window.solarLeads) {
                    setTimeout(() => {
                        window.solarLeads.showModal('Solar ROI Calculator');
                    }, 3000);
                }

                // 8. Fetch Vendors
                if (typeof fetchVendorQuotations === 'function') {
                    const city = document.getElementById('city') ? document.getElementById('city').value : null;
                    // Recommend 3kW for average bill ~1500-2500, else scale
                    let recommendedKw = Math.ceil(monthlyBill / 1000);
                    if (recommendedKw < 1) recommendedKw = 1;

                    fetchVendorQuotations(recommendedKw, SUBSIDY_MAX_KW, city); // Pass rough subsidy estimate
                }
            }
