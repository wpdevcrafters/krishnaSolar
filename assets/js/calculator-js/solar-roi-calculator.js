/* solar-roi-calculator.html JS - ShriKrishna Solar */

/*
            Solar ROI Calculator (Premium Update)
            Calculates Payback Period and Internal Rate of Return (IRR) with UI Logic.
            */

            if (typeof SUBSIDY_MAX_KW === 'undefined') { var SUBSIDY_MAX_KW = 78000; } // PM Surya Ghar max subsidy (Rs. 78,000 for >=3kW)

            document.addEventListener('DOMContentLoaded', () => {
                const resultBox = document.getElementById('result-box');
                const emptyState = document.getElementById('roi-empty-state');
                const resultContent = document.getElementById('roi-results-content');

                if (resultBox) {
                    resultBox.style.display = 'block';
                    resultBox.classList.remove('roi-result-box--active');
                }

                if (emptyState) emptyState.style.display = 'flex';
                if (resultContent) resultContent.style.display = 'none';

                const calcForm = document.getElementById('roi-calculator-form');
                if (calcForm) {
                    calcForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        calculateROI();
                    });
                }

                const stateSelect = document.getElementById('state');
                if (stateSelect && typeof loadCities === 'function') {
                    stateSelect.addEventListener('change', loadCities);
                }

                const printBtn = document.getElementById('roi-print-btn');
                if (printBtn) {
                    printBtn.addEventListener('click', () => window.print());
                }

                const quoteBtn = document.getElementById('roi-inline-quote-btn');
                if (quoteBtn) {
                    quoteBtn.addEventListener('click', () => {
                        const state = document.getElementById('state');
                        const city = document.getElementById('city');
                        const cost = document.getElementById('total_cost');

                        if (window.solarLeads) {
                            window.solarLeads.showModal('Inline CTA', {
                                state: state ? state.options[state.selectedIndex].text : '',
                                city: city && city.value ? city.options[city.selectedIndex].text : '',
                                size: cost ? cost.value : ''
                            });
                        }
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
                const emptyState = document.getElementById('roi-empty-state');
                if (emptyState) emptyState.style.display = 'none';

                const resultContent = document.getElementById('roi-results-content');
                if (resultContent) resultContent.style.display = 'block';

                const resultBox = document.getElementById('result-box');
                resultBox.style.display = 'block';
                resultBox.classList.add('roi-result-box--active');

                const formatMoney = (amount) => {
                    const sign = amount < 0 ? '-' : '';
                    return `${sign}\u20B9${Math.abs(Math.round(amount)).toLocaleString('en-IN')}`;
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
