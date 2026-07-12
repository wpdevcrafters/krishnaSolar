/* solar-loan-emi-calculator.html JS - ShriKrishna Solar */

(function () {
        'use strict';

        /* ---- Utility ---- */
        function fmt(n) {
            return '₹' + Math.round(n).toLocaleString('en-IN');
        }

        /* ---- Subsidy lookup ---- */
        function getSubsidy(kw) {
            if (kw <= 1) return 30000;
            if (kw <= 2) return 60000;
            return 78000;
        }

        /* ---- Auto-fill on system size change ---- */
        var sizeSlider = document.getElementById('system_size_slider');
        var sizeVal = document.getElementById('system_size_val');
        var costInput = document.getElementById('system_cost');
        var subsidyInput = document.getElementById('subsidy');
        var downSlider = document.getElementById('down_pct_slider');
        var downPctVal = document.getElementById('down_pct_val');
        var downAmtDisplay = document.getElementById('down_amt_display');
        var loanInput = document.getElementById('loan_amount');

        function updateFromSize() {
            var kw = parseFloat(sizeSlider.value);
            sizeVal.textContent = kw + ' kW';
            var cost = Math.round(kw * 65000);
            costInput.value = cost;
            subsidyInput.value = getSubsidy(kw);
            recalcLoanAmount();
        }

        function recalcLoanAmount() {
            var cost = parseFloat(costInput.value) || 0;
            var sub = parseFloat(subsidyInput.value) || 0;
            var downPct = parseFloat(downSlider.value) || 0;
            downPctVal.textContent = downPct + '%';
            var downAmt = Math.round(cost * downPct / 100);
            downAmtDisplay.textContent = fmt(downAmt);
            var loan = Math.max(0, cost - sub - downAmt);
            loanInput.value = loan;
        }

        sizeSlider.addEventListener('input', updateFromSize);
        costInput.addEventListener('input', recalcLoanAmount);
        subsidyInput.addEventListener('input', recalcLoanAmount);
        downSlider.addEventListener('input', recalcLoanAmount);

        /* ---- Interest rate slider + input sync ---- */
        var rateSlider = document.getElementById('interest_rate_slider');
        var rateVal = document.getElementById('interest_rate_val');
        var rateInput = document.getElementById('interest_rate');

        rateSlider.addEventListener('input', function () {
            rateVal.textContent = rateSlider.value + '%';
            rateInput.value = rateSlider.value;
        });
        rateInput.addEventListener('input', function () {
            var v = parseFloat(rateInput.value) || 7;
            v = Math.min(18, Math.max(6, v));
            rateSlider.value = v;
            rateVal.textContent = v + '%';
        });

        /* ---- Tenure buttons ---- */
        var tenureButtons = document.querySelectorAll('.tenure-btn');
        var tenureInput = document.getElementById('loan_tenure');
        tenureButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                tenureButtons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                tenureInput.value = btn.getAttribute('data-years');
            });
        });

        /* ---- EMI Calculation ---- */
        function calcEMI(P, annualRate, years) {
            var r = annualRate / 100 / 12;
            var n = years * 12;
            if (r === 0) return P / n;
            return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        }

        /* ---- Amortization (yearly summary) ---- */
        function buildAmortTable(P, annualRate, years) {
            var r = annualRate / 100 / 12;
            var n = years * 12;
            var emi = calcEMI(P, annualRate, years);
            var balance = P;
            var rows = [];
            for (var yr = 1; yr <= years; yr++) {
                var principalYear = 0, interestYear = 0;
                for (var m = 0; m < 12; m++) {
                    if (balance <= 0) break;
                    var intMonth = balance * r;
                    var prinMonth = Math.min(emi - intMonth, balance);
                    interestYear += intMonth;
                    principalYear += prinMonth;
                    balance -= prinMonth;
                }
                rows.push({
                    year: yr,
                    principal: principalYear,
                    interest: interestYear,
                    balance: Math.max(0, balance)
                });
            }
            return rows;
        }

        /* ---- Form submit ---- */
        document.getElementById('loan-calc-form').addEventListener('submit', function (e) {
            e.preventDefault();

            var P = parseFloat(loanInput.value) || 0;
            var rate = parseFloat(rateInput.value) || 7;
            var years = parseInt(tenureInput.value) || 7;
            var kw = parseFloat(sizeSlider.value) || 3;

            if (P <= 0) {
                alert('Please enter a valid loan amount greater than ₹0.');
                return;
            }

            var emi = calcEMI(P, rate, years);
            var totalPaid = emi * years * 12;
            var totalInterest = totalPaid - P;
            var principalPct = Math.round((P / totalPaid) * 100);
            var interestPct = 100 - principalPct;

            // Monthly savings: kW x 4 units/day x 30 days x ₹7/unit
            var monthlySavings = kw * 4 * 30 * 7;

            // Payback: net cost / annual savings
            var cost = parseFloat(costInput.value) || 0;
            var sub = parseFloat(subsidyInput.value) || 0;
            var downPct = parseFloat(downSlider.value) || 0;
            var downAmt = cost * downPct / 100;
            var netCost = cost - sub;
            var paybackYrs = netCost > 0 && monthlySavings > 0 ? (netCost / (monthlySavings * 12)).toFixed(1) : '—';

            // Update DOM
            document.getElementById('res_emi').textContent = fmt(emi);
            document.getElementById('res_savings').textContent = fmt(monthlySavings);
            document.getElementById('res_loan').textContent = fmt(P);
            document.getElementById('res_interest').textContent = fmt(totalInterest);
            document.getElementById('res_total').textContent = fmt(totalPaid);
            document.getElementById('res_payback').textContent = paybackYrs !== '—' ? paybackYrs + ' years' : '—';

            document.getElementById('principal_bar').style.width = principalPct + '%';
            document.getElementById('interest_bar').style.width = interestPct + '%';
            document.getElementById('principal_pct').textContent = principalPct + '%';
            document.getElementById('interest_pct').textContent = interestPct + '%';

            // EMI vs Savings text
            var diff = monthlySavings - emi;
            var evsText;
            if (diff >= 0) {
                evsText = 'Your EMI is ' + fmt(emi) + ' but you save ' + fmt(monthlySavings) +
                    '/month on electricity — net gain of <strong>' + fmt(diff) + '/month</strong>. Solar pays for itself!';
            } else {
                evsText = 'Your EMI is ' + fmt(emi) + ' but you save ' + fmt(monthlySavings) +
                    '/month on electricity — net extra cost is only <strong>' + fmt(Math.abs(diff)) + '/month</strong>.';
            }
            document.getElementById('emi_vs_savings_text').innerHTML = evsText;

            // Amortization table
            var rows = buildAmortTable(P, rate, years);
            var tbody = document.getElementById('amort-body');
            tbody.innerHTML = '';
            rows.forEach(function (row) {
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>Year ' + row.year + '</td>' +
                    '<td>' + fmt(row.principal) + '</td>' +
                    '<td>' + fmt(row.interest) + '</td>' +
                    '<td>' + fmt(row.balance) + '</td>';
                tbody.appendChild(tr);
            });

            // Show results
            document.getElementById('empty-state').style.display = 'none';
            document.getElementById('result-box').style.display = 'block';
            document.getElementById('amort-container').style.display = 'none';
            document.getElementById('amort-toggle-btn').textContent = 'Show Year-by-Year Amortization';

            // WhatsApp share
            document.getElementById('whatsapp-share-btn').onclick = function () {
                var msg = 'My Solar Loan EMI on SolarCalculators.in:\n' +
                    'Loan: ' + fmt(P) + '\n' +
                    'Monthly EMI: ' + fmt(emi) + '\n' +
                    'Electricity Savings: ' + fmt(monthlySavings) + '/month\n' +
                    'Total Interest: ' + fmt(totalInterest) + '\n' +
                    'Calculate yours: https://solarcalculators.in/solar-loan-emi-calculator/';
                window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
            };
        });

        /* ---- Toggle amortization ---- */
        window.toggleAmort = function () {
            var c = document.getElementById('amort-container');
            var btn = document.getElementById('amort-toggle-btn');
            if (c.style.display === 'none') {
                c.style.display = 'block';
                btn.textContent = 'Hide Amortization Table';
            } else {
                c.style.display = 'none';
                btn.textContent = 'Show Year-by-Year Amortization';
            }
        };

        /* ---- FAQ accordion ---- */
        window.toggleFaq = function (el) {
            var answer = el.nextElementSibling;
            var isOpen = answer.style.display === 'block';
            // Close all
            document.querySelectorAll('.faq-a').forEach(function (a) { a.style.display = 'none'; });
            document.querySelectorAll('.faq-q').forEach(function (q) { q.classList.remove('open'); });
            if (!isOpen) {
                answer.style.display = 'block';
                el.classList.add('open');
            }
        };

        /* ---- Init with defaults ---- */
        var resultBox = document.getElementById('result-box');
        var emptyState = document.getElementById('empty-state');
        if (resultBox) resultBox.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';

        var amortToggle = document.getElementById('amort-toggle-btn');
        if (amortToggle) amortToggle.addEventListener('click', window.toggleAmort);

        var printBtn = document.getElementById('loan-print-btn');
        if (printBtn) printBtn.addEventListener('click', function () {
            window.print();
        });

        var inlineQuoteBtn = document.getElementById('loan-inline-quote-btn');
        if (inlineQuoteBtn) {
            inlineQuoteBtn.addEventListener('click', function () {
                if (window.solarLeads) window.solarLeads.showModal('Inline CTA', {});
            });
        }

        updateFromSize();

    })();
