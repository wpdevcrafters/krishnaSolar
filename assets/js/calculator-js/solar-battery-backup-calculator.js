/* solar-battery-backup-calculator.html JS - ShriKrishna Solar */

/*
        Solar Battery Backup Calculator
        Calculates required Battery Capacity (Ah) based on Load and Backup Hours.
        Formula: (Load (W) * Backup Hours) / Battery Voltage = Wh / V = Ah
        */

        const initBatteryCalc = () => {
            const resultBox = document.getElementById('result-box');
            const emptyState = document.getElementById('empty-state');

            if (resultBox) resultBox.style.display = 'none';
            if (emptyState) emptyState.style.display = 'flex';

            const calcForm = document.getElementById('battery-calculator-form');
            if (calcForm) {
                calcForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    calculateBattery();
                });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initBatteryCalc);
        } else {
            initBatteryCalc();
        }

        function calculateBattery() {
            // 1. Inputs
            const totalLoad = parseFloat(document.getElementById('total_load').value); // Watts
            const backupHours = parseFloat(document.getElementById('backup_hours').value);
            const batteryVolt = parseFloat(document.getElementById('battery_voltage').value); // 12, 24, 48

            if (!totalLoad || !backupHours) return;

            // 2. Logic
            // Required Energy = Load * Hours
            const energyRequiredWh = totalLoad * backupHours;

            // Add Efficiency Loss (Inverter efficiency ~85%, Battery Depth of Discharge ~80% for Li/Tubular)
            // We need to store MORE than we need functionality.
            // Real Required = Energy / (InverterEff * DoD)
            // Let's assume combined efficiency factor of 0.7 (70%)
            const realEnergyRequiredWh = energyRequiredWh / 0.7;

            // Required Ah = Wh / Volts
            const requiredAh = realEnergyRequiredWh / batteryVolt;

            // Round to nearest standard battery size (100, 150, 200, 220)
            // Usually batteries are 150Ah. So calculate number of batteries.
            const standardBatteryAh = 150;
            const numberOfBatteries = Math.ceil(requiredAh / standardBatteryAh);

            // Total Bank Capacity
            const totalBankAh = numberOfBatteries * standardBatteryAh;

            // 3. UI
            const emptyState = document.getElementById('empty-state');
            if (emptyState) emptyState.style.display = 'none';

            const resultBox = document.getElementById('result-box');
            resultBox.style.display = 'block';

            document.getElementById('res_ah').innerText = `${Math.round(requiredAh)}`;
            document.getElementById('res_batteries').innerText = `${numberOfBatteries} x 150Ah`;
            document.getElementById('res_total_capacity').innerText = `${totalBankAh} Ah`;
            document.getElementById('res_config').innerText = `${batteryVolt}V System`;

            if (window.innerWidth < 768) {
                resultBox.scrollIntoView({ behavior: 'smooth' });
            }
        }
