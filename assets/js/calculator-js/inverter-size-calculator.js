/* Inverter Size Calculator JS — ShriKrishna Solar */

const PRESETS = [
    { id: 'fan',         name: 'Ceiling Fan',         watts: 75,   icon: '🌀' },
    { id: 'led_bulb',    name: 'LED Bulb',            watts: 10,   icon: '💡' },
    { id: 'tv_32',       name: 'LED TV 32"',          watts: 60,   icon: '📺' },
    { id: 'tv_55',       name: 'LED TV 55"',          watts: 120,  icon: '📺' },
    { id: 'fridge',      name: 'Refrigerator',        watts: 150,  icon: '🧊' },
    { id: 'ac_1ton',     name: 'AC 1 Ton',            watts: 1000, icon: '❄️' },
    { id: 'ac_1_5ton',   name: 'AC 1.5 Ton',         watts: 1500, icon: '❄️' },
    { id: 'washing',     name: 'Washing Machine',     watts: 500,  icon: '🫧' },
    { id: 'microwave',   name: 'Microwave',           watts: 1000, icon: '📡' },
    { id: 'desktop',     name: 'Desktop PC',          watts: 200,  icon: '🖥️' },
    { id: 'pump_05hp',   name: 'Water Pump 0.5HP',   watts: 375,  icon: '💧' },
    { id: 'pump_1hp',    name: 'Water Pump 1HP',     watts: 750,  icon: '💧' },
    { id: 'mixer',       name: 'Mixer / Grinder',     watts: 750,  icon: '🌪️' },
];

const INVERTER_SIZES = [
    { maxW: 600,      va: 600,  kva: '0.6',  batteries: 1, costMin: 6000,  costMax: 8000,  label: '600 VA' },
    { maxW: 900,      va: 850,  kva: '0.85', batteries: 1, costMin: 8000,  costMax: 12000, label: '850 VA' },
    { maxW: 1400,     va: 1100, kva: '1.1',  batteries: 1, costMin: 10000, costMax: 15000, label: '1100 VA' },
    { maxW: 2000,     va: 2000, kva: '2',    batteries: 2, costMin: 15000, costMax: 25000, label: '2 kVA' },
    { maxW: 2500,     va: 2500, kva: '2.5',  batteries: 2, costMin: 20000, costMax: 30000, label: '2.5 kVA' },
    { maxW: 3500,     va: 3500, kva: '3.5',  batteries: 3, costMin: 30000, costMax: 45000, label: '3.5 kVA' },
    { maxW: Infinity, va: 5000, kva: '5',    batteries: 4, costMin: 45000, costMax: 70000, label: '5 kVA' },
];

let applianceList = [];
let nextId = 1;

function renderPresets() {
    const container = document.getElementById('preset-buttons');
    if (!container) return;
    container.innerHTML = '';
    PRESETS.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'appliance-btn';
        btn.addEventListener('click', () => addPreset(p));
        btn.innerHTML = `
            <span class="btn-icon">${p.icon}</span>
            <span class="appliance-btn__name">${p.name}</span>
            <span class="btn-watts">${p.watts}W</span>
        `;
        container.appendChild(btn);
    });
}

function addPreset(preset) {
    const existing = applianceList.find(a => a.presetId === preset.id);
    if (existing) {
        existing.qty += 1;
    } else {
        applianceList.push({ id: nextId++, presetId: preset.id, name: preset.name, watts: preset.watts, qty: 1 });
    }
    renderList();
    recalculate();
}

function addCustomAppliance() {
    const nameEl = document.getElementById('custom-name');
    const wattsEl = document.getElementById('custom-watts');
    const qtyEl = document.getElementById('custom-qty');

    const name = nameEl.value.trim();
    const watts = parseInt(wattsEl.value);
    const qty = Math.max(1, parseInt(qtyEl.value) || 1);

    if (!name) { nameEl.focus(); nameEl.style.borderColor = '#EF4444'; return; }
    if (!watts || watts <= 0) { wattsEl.focus(); wattsEl.style.borderColor = '#EF4444'; return; }

    nameEl.style.borderColor = '';
    wattsEl.style.borderColor = '';

    applianceList.push({ id: nextId++, presetId: null, name, watts, qty });
    nameEl.value = '';
    wattsEl.value = '';
    qtyEl.value = '1';

    renderList();
    recalculate();
}

function renderList() {
    const tbody = document.getElementById('appliance-tbody');
    const emptyState = document.getElementById('list-empty-state');
    const tableWrapper = document.getElementById('appliance-list-table');
    const clearBtn = document.getElementById('clear-btn');

    if (applianceList.length === 0) {
        if (emptyState) emptyState.style.display = '';
        if (tableWrapper) tableWrapper.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (tableWrapper) tableWrapper.style.display = '';
    if (clearBtn) clearBtn.style.display = '';

    if (!tbody) return;
    tbody.innerHTML = '';
    applianceList.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-medium">${item.name}</td>
            <td class="text-muted">${item.watts}W</td>
            <td>
                <div class="qty-control">
                    <button type="button" class="qty-btn" data-action="qty" data-id="${item.id}" data-delta="-1">-</button>
                    <span class="qty-value">${item.qty}</span>
                    <button type="button" class="qty-btn" data-action="qty" data-id="${item.id}" data-delta="1">+</button>
                </div>
            </td>
            <td class="fw-bold text-success">${item.watts * item.qty}W</td>
            <td><button type="button" class="remove-btn" data-action="remove" data-id="${item.id}" title="Remove" aria-label="Remove ${item.name}">x</button></td>
        `;
        tbody.appendChild(row);
    });

    const total = getTotalWatts();
    const totalCell = document.getElementById('total-watts-cell');
    if (totalCell) totalCell.textContent = total + ' W';
}

function changeQty(id, delta) {
    const item = applianceList.find(a => a.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    renderList();
    recalculate();
}

function removeAppliance(id) {
    applianceList = applianceList.filter(a => a.id !== id);
    renderList();
    recalculate();
}

function clearAll() {
    applianceList = [];
    renderList();
    recalculate();
}

function getTotalWatts() {
    return applianceList.reduce((sum, a) => sum + (a.watts * a.qty), 0);
}

function recalculate() {
    const totalW = getTotalWatts();

    if (totalW === 0) {
        const re = document.getElementById('result-empty');
        const rc = document.getElementById('result-card');
        if (re) re.style.display = '';
        if (rc) rc.style.display = 'none';
        highlightSizeRow(null);
        return;
    }

    const selectedSize = INVERTER_SIZES.find(s => totalW <= s.maxW) || INVERTER_SIZES[INVERTER_SIZES.length - 1];

    const backupHoursEl = document.getElementById('backup-hours');
    const backupHours = backupHoursEl ? parseInt(backupHoursEl.value) : 4;
    const batteryVoltage = 12;
    const efficiency = 0.8;
    const totalAh = (totalW * backupHours) / (batteryVoltage * efficiency);
    const batteriesNeeded = Math.ceil(totalAh / 150);
    const actualBackupTime = (selectedSize.batteries * 150 * batteryVoltage * efficiency) / totalW;

    const costMin = (selectedSize.costMin / 1000).toFixed(0);
    const costMax = (selectedSize.costMax / 1000).toFixed(0);

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('res-kva', selectedSize.kva);
    set('res-kva-label', 'kVA');
    set('res-model-label', selectedSize.label + ' Inverter — ' + selectedSize.batteries + '-battery system');
    set('res-total-load', totalW + ' W');
    set('res-batteries', Math.max(selectedSize.batteries, batteriesNeeded) + ' nos.');
    set('res-battery-type', '× 150Ah (12V) tubular');
    set('res-backup-time', '~' + actualBackupTime.toFixed(1) + ' hrs');
    set('res-cost', '₹' + costMin + 'k – ₹' + costMax + 'k');

    const re = document.getElementById('result-empty');
    const rc = document.getElementById('result-card');
    if (re) re.style.display = 'none';
    if (rc) rc.style.display = 'block';

    highlightSizeRow(selectedSize.va);
}

function highlightSizeRow(va) {
    const rows = document.querySelectorAll('#sizes-table tbody tr');
    const sizeLabels = [600, 850, 1100, 2000, 2500, 3500, 5000];
    rows.forEach((row, i) => {
        if (va && sizeLabels[i] === va) {
            row.classList.add('highlight-row');
        } else {
            row.classList.remove('highlight-row');
        }
    });
}

function toggleFaq(questionEl) {
    questionEl.classList.toggle('open');
    const answer = questionEl.nextElementSibling;
    if (answer) answer.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
    renderPresets();

    const addCustomBtn = document.getElementById('add-custom-appliance-btn');
    if (addCustomBtn) addCustomBtn.addEventListener('click', addCustomAppliance);

    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', clearAll);

    const backupHours = document.getElementById('backup-hours');
    if (backupHours) backupHours.addEventListener('change', recalculate);

    const applianceBody = document.getElementById('appliance-tbody');
    if (applianceBody) {
        applianceBody.addEventListener('click', (event) => {
            const btn = event.target.closest('button[data-action]');
            if (!btn) return;

            const id = parseInt(btn.dataset.id, 10);
            if (btn.dataset.action === 'qty') {
                changeQty(id, parseInt(btn.dataset.delta, 10));
            }
            if (btn.dataset.action === 'remove') {
                removeAppliance(id);
            }
        });
    }
});
