/* solar-panel-cost-calculator.html JS - ShriKrishna Solar */

/*
        Solar Cost Calculator Logic with Vendor Integration
        Includes Chart.js rendering, subsidy logic, and vendor quotations.
        */

        if (typeof SUBSIDY_MAX_KW === 'undefined') { var SUBSIDY_MAX_KW = 78000; } // PM Surya Ghar max subsidy (₹78,000 for ≥3kW)

        let savingsChart = null;
        let latestCalculation = null; // Store calculated values for emailing reports

        const formatCurrency = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`;

        const stateCityMap = {
            'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'],
            'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Tawang'],
            'Assam': ['Guwahati', 'Jorhat', 'Silchar'],
            'Bihar': ['Patna', 'Gaya', 'Muzaffarpur'],
            'Chhattisgarh': ['Raipur', 'Bilaspur', 'Bhilai'],
            'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
            'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
            'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Hisar'],
            'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan'],
            'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad'],
            'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi'],
            'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
            'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior'],
            'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
            'Manipur': ['Imphal', 'Thoubal'],
            'Meghalaya': ['Shillong', 'Tura'],
            'Mizoram': ['Aizawl', 'Lunglei'],
            'Nagaland': ['Kohima', 'Dimapur'],
            'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
            'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar'],
            'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur'],
            'Sikkim': ['Gangtok', 'Namchi'],
            'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
            'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
            'Tripura': ['Agartala', 'Udaipur'],
            'Uttar Pradesh': ['Lucknow', 'Noida', 'Kanpur', 'Agra'],
            'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh'],
            'West Bengal': ['Kolkata', 'Kharagpur', 'Durgapur', 'Siliguri', 'Asansol'],
            'Delhi': ['Delhi', 'Noida', 'Gurugram'],
            'Chandigarh': ['Chandigarh'],
            'Puducherry': ['Puducherry', 'Karaikal']
        };

        const setModeVisibility = () => {
            const selectedMode = document.querySelector('input[name="calc_mode"]:checked')?.value || 'bill';
            const billGroup = document.getElementById('input-bill-group');
            const kwGroup = document.getElementById('input-kw-group');
            const modeOptions = document.querySelectorAll('.calc-mode-option');
            const monthlyBillInput = document.getElementById('monthly_bill');
            const systemCapacityInput = document.getElementById('system_capacity');
            const stateInput = document.getElementById('state');

            modeOptions.forEach((option) => {
                const input = option.querySelector('input[type="radio"]');
                option.classList.toggle('active', Boolean(input && input.checked));
            });

            if (billGroup) {
                billGroup.style.display = selectedMode === 'bill' ? 'block' : 'none';
            }
            if (kwGroup) {
                kwGroup.style.display = selectedMode === 'kw' ? 'block' : 'none';
            }

            if (stateInput) {
                stateInput.setAttribute('required', 'required');
            }
            if (monthlyBillInput) {
                monthlyBillInput.required = selectedMode === 'bill';
                if (selectedMode === 'bill') {
                    monthlyBillInput.setAttribute('required', 'required');
                } else {
                    monthlyBillInput.removeAttribute('required');
                }
            }
            if (systemCapacityInput) {
                systemCapacityInput.required = selectedMode === 'kw';
                if (selectedMode === 'kw') {
                    systemCapacityInput.setAttribute('required', 'required');
                } else {
                    systemCapacityInput.removeAttribute('required');
                }
            }
        };

        const resetResultBox = () => {
            const resultBox = document.getElementById('result-box');
            const emptyState = document.getElementById('empty-state');
            const placeholder = document.getElementById('result-placeholder');
            const resultContent = document.getElementById('result-content');
            if (resultBox) {
                resultBox.style.display = 'block';
                resultBox.classList.remove('result-visible');
            }
            if (placeholder) {
                placeholder.style.display = 'flex';
            }
            if (resultContent) {
                resultContent.style.display = 'none';
            }
            if (emptyState) {
                emptyState.style.display = 'none';
            }
        };

        const initCostCalc = () => {
            const calcForm = document.getElementById('cost-calculator-form');
            const stateEl = document.getElementById('state');
            const modeInputs = document.querySelectorAll('input[name="calc_mode"]');

            if (calcForm) {
                calcForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    setModeVisibility();
                    if (!calcForm.checkValidity()) {
                        calcForm.reportValidity();
                        return;
                    }
                    calculateCostPremium();
                });
            }

            if (stateEl) {
                stateEl.addEventListener('change', () => {
                    window.loadCities();
                });
            }

            modeInputs.forEach((input) => {
                input.addEventListener('change', setModeVisibility);
            });

            window.toggleInputMode = setModeVisibility;
            window.loadCities = function () {
                const stateEl = document.getElementById('state');
                if (!stateEl) return;
                const state = stateEl.value;
                const cityGroup = document.getElementById('city-group');
                const citySelect = document.getElementById('city');

                if (!state) {
                    if (cityGroup) cityGroup.style.display = 'none';
                    if (citySelect) citySelect.innerHTML = '<option value="">All Cities</option>';
                    return;
                }

                const cities = stateCityMap[state] || ['All Cities'];
                if (citySelect) {
                    citySelect.innerHTML = '<option value="">All Cities</option>' + cities.map((city) => `<option value="${city}">${city}</option>`).join('');
                }
                if (cityGroup) cityGroup.style.display = 'block';
            };

            setModeVisibility();
            resetResultBox();
            window.loadCities();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCostCalc);
        } else {
            initCostCalc();
        }

        async function calculateCostPremium() {
            // 1. Inputs
            const mode = document.querySelector('input[name="calc_mode"]:checked').value;
            let systemKw = 0;

            if (mode === 'bill') {
                const bill = parseFloat(document.getElementById('monthly_bill').value);
                systemKw = bill / 900;
                if (systemKw < 1) systemKw = 1;
                else systemKw = Math.ceil(systemKw * 2) / 2;
            } else {
                systemKw = parseFloat(document.getElementById('system_capacity').value);
            }

            if (!systemKw || systemKw <= 0) return;

            // 2. Base Calculation (Market Default)
            let ratePerKw = 60000;
            if (systemKw <= 2) ratePerKw = 65000;
            else if (systemKw > 5) ratePerKw = 55000;
            else if (systemKw > 10) ratePerKw = 48000;

            let grossCost = systemKw * ratePerKw;

            // 3. Subsidy Logic
            let subsidy = 0;
            if (systemKw <= 2) subsidy = systemKw * 30000;
            else if (systemKw <= 3) subsidy = 60000 + (systemKw - 2) * 18000;
            else subsidy = SUBSIDY_MAX_KW;
            const netCost = grossCost - subsidy;

            // 4. Update Main Metric UI
            document.getElementById('res_size').innerText = systemKw;
            document.getElementById('res_panels').innerText = `~${Math.ceil((systemKw * 1000) / 550)} Panels`;
            document.getElementById('res_gross_cost').innerText = formatCurrency(grossCost);
            document.getElementById('res_subsidy').innerText = `- ${formatCurrency(subsidy)}`;
            document.getElementById('res_net_cost').innerText = `${Math.round(netCost).toLocaleString('en-IN')}`;
            document.getElementById('res_final_payable').innerText = formatCurrency(netCost);
            document.getElementById('res_monthly_save').innerText = formatCurrency((systemKw * 1400 * 8) / 12);
            document.getElementById('res_lifetime_save').innerText = formatCurrency((systemKw * 1400 * 8 * 25));
            // COâ‚‚ saved: India grid emission factor 0.82 kg/kWh (CEA 2024), over 25 years
            const co2Tonnes = Math.round(systemKw * 1400 * 0.82 * 25 / 1000);
            const co2El = document.getElementById('res_co2');
            if (co2El) co2El.innerText = co2Tonnes + ' T';

            // ROI
            const roi = netCost / (systemKw * 1400 * 8);
            document.getElementById('res_roi').innerText = roi.toFixed(1);

            // Save for emailing report
            latestCalculation = {
                state: document.getElementById('state') ? document.getElementById('state').value : 'India',
                capacity: systemKw,
                subsidy: subsidy,
                system_cost: grossCost,
                net_cost: netCost,
                remarks: `Estimated based on PM Surya Ghar benchmark. Payback period is ${roi.toFixed(1)} years.`
            };

            // Show Results
            const emptyState = document.getElementById('empty-state');
            const resultBox = document.getElementById('result-box');
            const placeholder = document.getElementById('result-placeholder');
            const resultContent = document.getElementById('result-content');
            if (emptyState) emptyState.style.display = 'none';
            if (resultBox) {
                resultBox.style.display = 'block';
                resultBox.classList.add('result-visible');
            }
            if (placeholder) placeholder.style.display = 'none';
            if (resultContent) resultContent.style.display = 'block';

            // Reset Save Calculation widget state to allow resending if recalculated
            const saveReportBox = document.getElementById('save-report-box');
            if (saveReportBox) {
                saveReportBox.style.background = "linear-gradient(135deg, #f8fafc, #f1f5f9)";
                saveReportBox.style.border = "1.5px dashed #cbd5e1";
                saveReportBox.innerHTML = `
                    <h4 class="calc-inline-213">ðŸ“§ Keep these numbers for reference?</h4>
                    <p class="calc-inline-214">We'll email you a beautiful custom PDF-ready feasibility report including pricing, subsidies, and regional installer details.</p>
                    <div class="calc-inline-215">
                        <input type="email" id="save-calc-email" placeholder="you@example.com" class="calc-inline-216" required>
                        <button id="save-calc-btn" onclick="handleSaveCalculation()" class="calc-inline-217">Send Report</button>
                    </div>
                    <p id="save-status-msg" class="calc-inline-218"></p>
                `;
            }

            // Chart
            renderSavingsChart(netCost, (systemKw * 1400 * 8));

            // 5. Fetch Vendor Quotations
            const city = document.getElementById('city') ? document.getElementById('city').value : null;
            if (typeof fetchVendorQuotations === 'function') {
                // No need to await here if we want the UI to be responsive, 
                // but fetchVendorQuotations now has its own internal yield.
                fetchVendorQuotations(systemKw, subsidy, city);
            }
        }

        window.loadCities = async function () {
            const stateEl = document.getElementById('state');
            if (!stateEl) return;
            const state = stateEl.value;
            const cityGroup = document.getElementById('city-group');
            const citySelect = document.getElementById('city');

            if (!state) {
                if (cityGroup) cityGroup.style.display = 'none';
                return;
            }

            // Reset
            if (citySelect) citySelect.innerHTML = '<option value="">Loading...</option>';
            if (cityGroup) cityGroup.style.display = 'block';

            try {
                const response = await fetch(`/api/public.php?action=vendor_cities&state=${encodeURIComponent(state)}`);
                const { data, error } = await response.json();

                if (error || !data || data.length === 0) {
                    if (citySelect) citySelect.innerHTML = '<option value="">All Cities</option>';
                    return;
                }

                if (citySelect) {
                    citySelect.innerHTML = '<option value="">All Cities</option>' +
                        data.map(c => `<option value="${c}">${c}</option>`).join('');
                }
            } catch (err) {
                console.error("Failed to load cities:", err);
                if (citySelect) citySelect.innerHTML = '<option value="">All Cities</option>';
            }
        }

        function renderSavingsChart(initialInvestment, annualSavings) {
            if (typeof Chart === 'undefined') {
                console.error('Chart.js library not loaded');
                return;
            }

            const canvas = document.getElementById('savingsChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const labels = [];
            const investments = [];
            const savings = [];
            let cumulativeSavings = 0;

            // Forecast for 25 Years based on the calculated annual savings.
            for (let i = 0; i <= 25; i++) {
                labels.push(`Y${i}`);
                investments.push(initialInvestment);
                cumulativeSavings += i === 0 ? 0 : annualSavings;
                savings.push(cumulativeSavings);
            }

            if (savingsChart) {
                savingsChart.data.labels = labels;
                savingsChart.data.datasets[0].data = savings;
                savingsChart.data.datasets[1].data = investments;
                savingsChart.options.plugins.title.text = 'Investment vs. Savings (25 Years)';
                savingsChart.update('none');
                return;
            }

            savingsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Cumulative Savings',
                            data: savings,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.14)',
                            pointBackgroundColor: '#10b981',
                            pointBorderColor: '#ffffff',
                            pointRadius: 3,
                            pointHoverRadius: 4,
                            fill: true,
                            tension: 0.35
                        },
                        {
                            label: 'Initial Investment',
                            data: investments,
                            borderColor: '#f59e0b',
                            borderDash: [6, 6],
                            pointRadius: 0,
                            pointHoverRadius: 0,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: { display: true, text: 'Investment vs. Savings (25 Years)', font: { weight: '700', size: 14 } },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        },
                        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                    scales: {
                        x: {
                            grid: { display: false }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value) {
                                    if (value >= 1000000) return '₹' + (value / 1000000).toFixed(1) + 'M';
                                    if (value >= 100000) return '₹' + (value / 100000).toFixed(0) + 'L';
                                    if (value >= 1000) return '₹' + (value / 1000).toFixed(0) + 'k';
                                    return '₹' + value;
                                }
                            }
                        }
                    }
                }
            });
        }

        async function handleSaveCalculation() {
            const emailInput = document.getElementById('save-calc-email');
            const email = emailInput ? emailInput.value.trim() : '';
            const btn = document.getElementById('save-calc-btn');
            const msg = document.getElementById('save-status-msg');

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            if (!latestCalculation) {
                alert("No calculation results found. Please check your solar quote details first.");
                return;
            }

            btn.disabled = true;
            btn.innerText = "Sending...";
            msg.style.display = 'none';

            try {
                const response = await fetch('/api/save_calculation.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        calc_type: 'cost',
                        calc_data: latestCalculation
                    })
                });

                const resData = await response.json();

                if (response.ok && resData.success) {
                    msg.innerText = "âœ… " + (resData.message || "Your custom report has been emailed successfully!");
                    msg.style.color = "#16a34a";
                    msg.style.display = "block";
                    
                    // Hide the input fields smoothly after a delay
                    setTimeout(() => {
                        const box = document.getElementById('save-report-box');
                        if (box) {
                            box.style.background = "#f0fdf4";
                            box.style.border = "1.5px solid #bbf7d0";
                            box.innerHTML = `
                                <h4 class="calc-inline-220">ðŸŽ‰ Report Emailed Successfully!</h4>
                                <p class="calc-inline-221">A beautifully detailed breakdown has been sent to <b>${email}</b>. You can print or download the PDF directly from your mailbox.</p>
                            `;
                        }
                    }, 1500);
                } else {
                    throw new Error(resData.error || "Failed to save calculation.");
                }
            } catch(err) {
                btn.disabled = false;
                btn.innerText = "Send Report";
                msg.innerText = "âŒ " + err.message;
                msg.style.color = "#dc2626";
                msg.style.display = "block";
            }
        }
