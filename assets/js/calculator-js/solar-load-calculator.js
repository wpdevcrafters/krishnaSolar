/* solar-load-calculator.html JS - ShriKrishna Solar */

const applianceCategories = [
            {
                category: 'Cooling & Ventilation',
                icon: '<i class="bi bi-snow" aria-hidden="true"></i>',
                items: [
                    { name: 'Ceiling Fan', watts: 75 },
                    { name: 'Table Fan', watts: 50 },
                    { name: 'Pedestal Fan', watts: 100 },
                    { name: 'Air Cooler (Small)', watts: 150 },
                    { name: 'Air Cooler (Desert)', watts: 250 },
                    { name: 'Air Conditioner (1 Ton)', watts: 1000 },
                    { name: 'Air Conditioner (1.5 Ton)', watts: 1500 },
                ]
            },
            {
                category: 'Lighting',
                icon: '<i class="bi bi-lightbulb" aria-hidden="true"></i>',
                items: [
                    { name: 'LED Bulb (9W)', watts: 9 },
                    { name: 'LED Bulb (15W)', watts: 15 },
                    { name: 'Tube Light', watts: 20 },
                    { name: 'CFL', watts: 25 },
                    { name: 'Night Lamp', watts: 5 },
                ]
            },
            {
                category: 'Kitchen Appliances',
                icon: '<i class="bi bi-cup-hot" aria-hidden="true"></i>',
                items: [
                    { name: 'Refrigerator (Single Door)', watts: 200 },
                    { name: 'Refrigerator (Double Door)', watts: 350 },
                    { name: 'Microwave Oven', watts: 1200 },
                    { name: 'Mixer Grinder', watts: 500 },
                    { name: 'Toaster', watts: 800 },
                    { name: 'Electric Kettle', watts: 1500 },
                    { name: 'Induction Cooktop', watts: 2000 },
                    { name: 'Dishwasher', watts: 1200 },
                ]
            },
            {
                category: 'Entertainment & IT',
                icon: '<i class="bi bi-pc-display" aria-hidden="true"></i>',
                items: [
                    { name: 'LED TV (32 inch)', watts: 50 },
                    { name: 'LED TV (50 inch)', watts: 100 },
                    { name: 'Set Top Box', watts: 20 },
                    { name: 'Laptop', watts: 65 },
                    { name: 'Desktop PC', watts: 250 },
                    { name: 'Wi-Fi Router', watts: 10 },
                    { name: 'Gaming Console', watts: 150 },
                ]
            },
            {
                category: 'Heavy Loads',
                icon: '<i class="bi bi-lightning-charge" aria-hidden="true"></i>',
                items: [
                    { name: 'Water Geyser', watts: 2000 },
                    { name: 'Washing Machine', watts: 500 },
                    { name: 'Iron', watts: 1000 },
                    { name: 'Water Pump (0.5 HP)', watts: 375 },
                    { name: 'Water Pump (1 HP)', watts: 750 },
                    { name: 'Vacuum Cleaner', watts: 1000 },
                ]
            }
        ];

        let selectedAppliances = {};

        document.addEventListener('DOMContentLoaded', () => {
            renderCategories();
            updateTotalLoad();
        });

        function renderCategories() {
            const container = document.getElementById('appliance-list-container');
            container.innerHTML = '';

            applianceCategories.forEach((cat, catIdx) => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'load-category-section';
                categoryDiv.innerHTML = `
                    <div class="category-header" onclick="toggleCategory(${catIdx})">
                        <span>${cat.icon} ${cat.category}</span>
                        <span class="category-toggle-icon"><i class="bi bi-chevron-down" aria-hidden="true"></i></span>
                    </div>
                    <div id="category-items-${catIdx}" class="category-items${catIdx === 0 ? '' : ' is-collapsed'}">
                        ${cat.items.map(item => `
                            <div class="load-item-row">
                                <div class="load-item-info">
                                    <span class="load-item-name">${item.name}</span>
                                    <span class="load-item-watts">${item.watts}W</span>
                                </div>
                                <div class="load-item-controls">
                                    <button class="control-btn minus" onclick="updateQty('${item.name}', ${item.watts}, -1)">-</button>
                                    <span id="qty-${item.name.replace(/\s+/g, '-')}" class="load-item-qty">0</span>
                                    <button class="control-btn plus" onclick="updateQty('${item.name}', ${item.watts}, 1)">+</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                container.appendChild(categoryDiv);
            });

            // Option for custom appliance
            const customDiv = document.createElement('div');
            customDiv.className = 'load-custom-action';
            customDiv.innerHTML = `
                <button onclick="addCustomAppliancePrompt()" class="btn btn-outline">+ Add Other Appliance</button>
            `;
            container.appendChild(customDiv);
        }

        function toggleCategory(idx) {
            const itemsDiv = document.getElementById(`category-items-${idx}`);
            const isHidden = itemsDiv.classList.contains('is-collapsed') || window.getComputedStyle(itemsDiv).display === 'none';
            itemsDiv.classList.toggle('is-collapsed', !isHidden);
            itemsDiv.style.display = isHidden ? 'block' : 'none';

            // Rotate icon
            const header = itemsDiv.previousElementSibling;
            const icon = header.querySelector('.category-toggle-icon');
            icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }

        function updateQty(name, watts, delta) {
            if (!selectedAppliances[name]) {
                selectedAppliances[name] = { qty: 0, watts: watts };
            }

            selectedAppliances[name].qty += delta;
            if (selectedAppliances[name].qty < 0) selectedAppliances[name].qty = 0;

            // Update UI
            const qtySpan = document.getElementById(`qty-${name.replace(/\s+/g, '-')}`);
            if (qtySpan) qtySpan.innerText = selectedAppliances[name].qty;

            updateTotalLoad();
        }

        function updateTotalLoad() {
            let totalWatts = 0;

            for (const name in selectedAppliances) {
                totalWatts += selectedAppliances[name].qty * selectedAppliances[name].watts;
            }

            // Update Results
            document.getElementById('res_total_watts').innerText = totalWatts.toLocaleString();

            // Logic for sizing
            // Recommended Kw is totalWatts / 800 (assuming roughly 80% efficiency and a bit of buffer)
            let recommendedKw = totalWatts / 800;
            if (recommendedKw < 1 && totalWatts > 0) recommendedKw = 1;
            else if (totalWatts == 0) recommendedKw = 0;
            else recommendedKw = Math.ceil(recommendedKw * 2) / 2; // Round to nearest 0.5

            const dailyUnits = (totalWatts * 6) / 1000; // Assuming 6 hours avg operation for all added load

            document.getElementById('res_system_size').innerText = recommendedKw;
            document.getElementById('res_daily_units').innerText = dailyUnits.toFixed(1);
            document.getElementById('res_monthly_bill').innerText = `₹${Math.round(dailyUnits * 30 * 8).toLocaleString()}`;
            document.getElementById('res_gen_units').innerText = Math.round(recommendedKw * 4 * 30);

            // Show result box if load > 0
            const resultBox = document.getElementById('result-box');
            const emptyState = document.getElementById('empty-state');

            if (totalWatts > 0) {
                resultBox.style.display = 'block';
                emptyState.style.display = 'none';
            } else {
                resultBox.style.display = 'none';
                emptyState.style.display = 'block';
            }
        }

        function addCustomAppliancePrompt() {
            const name = prompt("Enter Appliance Name:");
            if (!name) return;
            const watts = parseInt(prompt("Enter Wattage (W):"));
            if (isNaN(watts)) return;

            // For simplicity, add to "Others" or just update load
            updateQty(name, watts, 1);
            alert(`Added ${name} (${watts}W) to your load list.`);
        }
