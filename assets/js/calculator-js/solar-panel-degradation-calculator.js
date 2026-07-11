/* solar-panel-degradation-calculator.html JS - ShriKrishna Solar */

const SOILING_BASE = { urban: 8, suburban: 4, rural: 2, coastal: 5 };
        const SOILING_PER_MONTH = 0.5;
        const CLEAN_FREQ = { urban: 'Monthly', suburban: 'Every 2 months', rural: 'Quarterly', coastal: 'Monthly' };

        let degradChart = null;

        document.getElementById('degradation-form').addEventListener('submit', function(e) {
            e.preventDefault();
            calculate();
        });

        function calculate() {
            const systemKw = parseFloat(document.getElementById('system_kw').value);
            const age = parseFloat(document.getElementById('panel_age').value);
            const monthlyGen = parseFloat(document.getElementById('monthly_gen').value);
            const locType = document.getElementById('location_type').value;
            const monthsSinceCleaning = parseFloat(document.getElementById('months_since_cleaning').value);
            const tariff = parseFloat(document.getElementById('tariff').value);
            const cleaningCost = parseFloat(document.getElementById('cleaning_cost').value);

            const mfrDeg = age * 0.5;
            const soilBase = SOILING_BASE[locType];
            const soilExtra = Math.min(monthsSinceCleaning * SOILING_PER_MONTH, 15); // cap at 15%
            const totalLoss = Math.min(mfrDeg + soilBase + soilExtra, 50); // cap at 50%

            const lostGen = monthlyGen * (totalLoss / 100);
            const lostRevenue = lostGen * tariff;

            // Cleaning ROI: revenue saved by cleaning = soilExtra% of gen * tariff
            const soilRecoverable = monthlyGen * (soilExtra / 100);
            const monthlyRevSaved = soilRecoverable * tariff;
            const daysToRecover = monthlyRevSaved > 0 ? Math.round(cleaningCost / (monthlyRevSaved / 30)) : Infinity;

            document.getElementById('res_mfr_deg').textContent = mfrDeg.toFixed(1) + '%';
            document.getElementById('res_soil_base').textContent = soilBase.toFixed(1) + '%';
            document.getElementById('res_soil_extra').textContent = soilExtra.toFixed(1) + '%';
            document.getElementById('res_total_loss').textContent = totalLoss.toFixed(1) + '%';
            document.getElementById('res_lost_gen').textContent = lostGen.toFixed(1) + ' kWh';
            document.getElementById('res_lost_revenue').textContent = 'â‚¹' + Math.round(lostRevenue).toLocaleString('en-IN');

            // Cleaning ROI box
            const roiBox = document.getElementById('cleaning-roi-result');
            if (monthlyRevSaved > 0 && daysToRecover <= 180) {
                roiBox.innerHTML = '<div class="cleaning-roi-box cleaning-roi-good">âœ… Cleaning is profitable â€” recovers â‚¹' +
                    Math.round(cleaningCost).toLocaleString('en-IN') + ' cost in just <strong>' + daysToRecover + ' days</strong> of recovered generation.</div>';
            } else if (monthlyRevSaved <= 0) {
                roiBox.innerHTML = '<div class="cleaning-roi-box cleaning-roi-bad">Panels appear recently cleaned. No immediate soiling loss to recover.</div>';
            } else {
                roiBox.innerHTML = '<div class="cleaning-roi-box cleaning-roi-bad">âš ï¸ Cleaning ROI is marginal â€” payback in ~' + daysToRecover + ' days. Consider cleaning soon.</div>';
            }

            document.getElementById('res_freq').textContent = CLEAN_FREQ[locType];

            // 25-year chart
            const years = [];
            const ideal = [];
            const degraded = [];
            const baseIdeal = monthlyGen * 12;
            for (let y = 0; y <= 25; y++) {
                years.push('Year ' + y);
                ideal.push(Math.round(baseIdeal));
                const yearDeg = Math.min(y * 0.5, 20);
                degraded.push(Math.round(baseIdeal * (1 - yearDeg / 100)));
            }

            if (degradChart) degradChart.destroy();
            const ctx = document.getElementById('degradationChart').getContext('2d');
            degradChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [
                        {
                            label: 'Ideal Output (kWh/yr)',
                            data: ideal,
                            borderColor: '#22C55E',
                            backgroundColor: 'rgba(34,197,94,0.08)',
                            fill: true,
                            tension: 0.3,
                            pointRadius: 2
                        },
                        {
                            label: 'Degraded Output (kWh/yr)',
                            data: degraded,
                            borderColor: '#F59E0B',
                            backgroundColor: 'rgba(245,158,11,0.08)',
                            fill: true,
                            tension: 0.3,
                            pointRadius: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: { callback: function(v) { return v.toLocaleString('en-IN'); } }
                        }
                    }
                }
            });

            // WhatsApp share
            const msg = encodeURIComponent(
                'â˜€ï¸ Solar Panel Health Check\n' +
                'Total Performance Loss: ' + totalLoss.toFixed(1) + '%\n' +
                'Lost Revenue/Month: â‚¹' + Math.round(lostRevenue).toLocaleString('en-IN') + '\n' +
                'Check yours: https://solarcalculators.in/solar-panel-degradation-calculator/'
            );
            document.getElementById('whatsapp-share-btn').onclick = function() {
                window.open('https://wa.me/?text=' + msg, '_blank');
            };

            document.getElementById('empty-state').style.display = 'none';
            document.getElementById('result-box').style.display = 'block';
        }
