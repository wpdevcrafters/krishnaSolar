document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
    });

    // 2. Navbar Scroll Effect — transparent on top, white frosted-glass on scroll
    const navbar = document.querySelector('.header');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run once on load so state is correct on hard-refresh / hash links
    }

    // 3. Range Slider Syncing in Hero Section
    const billRange = document.getElementById('heroBillRange');
    const billVal   = document.getElementById('heroBillVal');
    const unitRange = document.getElementById('heroUnitRange');
    const unitVal   = document.getElementById('heroUnitVal');

    if (billRange && billVal) {
        billRange.addEventListener('input', (e) => {
            billVal.textContent = Number(e.target.value).toLocaleString('en-IN');
            const estimatedUnits = Math.round(e.target.value / 7.5);
            if (unitRange) unitRange.value = estimatedUnits;
            if (unitVal)   unitVal.textContent = estimatedUnits.toLocaleString('en-IN');
        });
    }

    if (unitRange && unitVal) {
        unitRange.addEventListener('input', (e) => {
            unitVal.textContent = Number(e.target.value).toLocaleString('en-IN');
            const estimatedBill = Math.round(e.target.value * 7.5);
            if (billRange) billRange.value = estimatedBill;
            if (billVal)   billVal.textContent = estimatedBill.toLocaleString('en-IN');
        });
    }

    // 4. Submenu toggle support for mobile drawer
    document.querySelectorAll('[data-submenu-toggle]').forEach(toggle => {
        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            const item = toggle.closest('.has-submenu');
            if (!item) return;
            item.classList.toggle('open');
            toggle.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
        });
    });

    // 5. Vanilla JS Counter Animation (Intersection Observer triggered)
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        const startCounting = (counter) => {
            const target = +counter.innerText.replace(/,/g, '');
            let count = 0;
            const inc = target / 200;
            const tick = () => {
                count += inc;
                if (count < target) {
                    counter.innerText = Math.ceil(count).toLocaleString('en-IN');
                    requestAnimationFrame(tick);
                } else {
                    counter.innerText = target.toLocaleString('en-IN');
                }
            };
            tick();
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounting(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // 6. Initialize Swiper for Projects (if element exists)
    if (document.querySelector('.projectsSwiper')) {
        new Swiper('.projectsSwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            breakpoints: {
                768:  { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
        });
    }

    if (document.querySelector('.projectSwiper')) {
        new Swiper('.projectSwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                576:  { slidesPerView: 2 },
                992:  { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
        });
    }

    // 7. Initialize Swiper for Testimonials (3 slides desktop, 2 tablet, 1 mobile)
    if (document.querySelector('.reviewsSwiper')) {
        new Swiper('.reviewsSwiper', {
            slidesPerView: 3,
            spaceBetween: 16,
            loop: true,
            navigation: {
                nextEl: '#testiNext',
                prevEl: '#testiPrev',
            },
            breakpoints: {
                0:   { slidesPerView: 1, spaceBetween: 12 },
                576: { slidesPerView: 2, spaceBetween: 14 },
                992: { slidesPerView: 3, spaceBetween: 16 },
            },
        });
    }

    const projectsListingGrid = document.getElementById('projectsListingGrid');
    const projectsLoadMore = document.getElementById('projectsLoadMore');
    if (projectsListingGrid && projectsLoadMore) {
        const listingCards = Array.from(projectsListingGrid.querySelectorAll('.projects-listing-card'));
        const listingFilterBtns = document.querySelectorAll('.projects-page .proj-filter-btn');
        let activeProjectFilter = 'all';
        let visibleProjectLimit = 9;

        const renderProjectListing = () => {
            const matchingCards = listingCards.filter(card => {
                return activeProjectFilter === 'all' || card.getAttribute('data-category') === activeProjectFilter;
            });

            listingCards.forEach(card => {
                card.classList.add('is-hidden');
            });

            matchingCards.slice(0, visibleProjectLimit).forEach(card => {
                card.classList.remove('is-hidden');
            });

            projectsLoadMore.style.display = matchingCards.length > visibleProjectLimit ? '' : 'none';
        };

        listingFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                listingFilterBtns.forEach(item => item.classList.remove('active'));
                btn.classList.add('active');
                activeProjectFilter = btn.getAttribute('data-filter') || 'all';
                visibleProjectLimit = 9;
                renderProjectListing();
            });
        });

        projectsLoadMore.addEventListener('click', () => {
            visibleProjectLimit += 6;
            renderProjectListing();
        });

        renderProjectListing();
    }

    const sliderHandle = document.querySelector("#sliderHandle");
    const sliderLine = document.querySelector(".slider-line");
    const beforeImage = document.querySelector(".before-image");
    const afterImage = document.querySelector(".after-image");
    const sliderContainer = document.querySelector(".slider-container");

    if (sliderHandle && sliderLine && beforeImage && afterImage && sliderContainer) {
        let isDragging = false;

        // Function to initialize the slider at the center position
        const initializeSlider = () => {
            const containerWidth = sliderContainer.offsetWidth;

            // Set slider handle and line at center with a transition for initialization
            sliderHandle.style.transition = "left 0.3s ease";
            sliderLine.style.transition = "left 0.3s ease";

            sliderHandle.style.left = "50%";
            sliderLine.style.left = "50%";

            // Set both images' clip-path to 50% (center)
            beforeImage.style.clipPath = `inset(0 50% 0 0)`;
            afterImage.style.clipPath = `inset(0 0 0 50%)`;
        };

        // Function to move the slider based on user interaction
        const moveSlider = (clientX) => {
            const containerRect = sliderContainer.getBoundingClientRect();
            let offsetX = clientX - containerRect.left;

            // Limit the slider movement within the full container width (0% to 100%)
            if (offsetX < 0) offsetX = 0; // Prevent overflow on the left
            if (offsetX > containerRect.width) offsetX = containerRect.width; // Prevent overflow on the right

            const percentage = Math.round((offsetX / containerRect.width) * 100);

            // Update the slider handle position and image clipping
            sliderHandle.style.left = `${percentage}%`;
            sliderLine.style.left = `${percentage}%`;

            // Adjust the clip-path for both images
            beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
        };

        // Add event listeners for both the handle and the line (including the SVG)
        const startDragging = () => {
            isDragging = true;

            // Remove transitions while dragging for instant feedback
            sliderHandle.style.transition = "none";
            sliderLine.style.transition = "none";
        };

        const stopDragging = () => {
            isDragging = false;

            // Reapply transitions after dragging ends
            sliderHandle.style.transition = "left 0.3s ease";
            sliderLine.style.transition = "left 0.3s ease";
        };

        sliderHandle.addEventListener("mousedown", startDragging);
        sliderLine.addEventListener("mousedown", startDragging); // Make SVG and line draggable

        window.addEventListener("mousemove", (event) => {
            if (isDragging) {
                moveSlider(event.clientX);
            }
        });

        window.addEventListener("mouseup", stopDragging);

        // For touch events on mobile
        sliderHandle.addEventListener("touchstart", startDragging);
        sliderLine.addEventListener("touchstart", startDragging); // Make SVG and line draggable

        window.addEventListener("touchmove", (event) => {
            if (isDragging) {
                moveSlider(event.touches[0].clientX);
            }
        });

        window.addEventListener("touchend", stopDragging);

        // Initialize the slider on page load
        window.addEventListener("load", initializeSlider);
        initializeSlider();
    }


    document.addEventListener('click', function (event) {
        const trigger = event.target.closest('[data-click-action]');
        if (!trigger) return;

        const action = trigger.dataset.clickAction;

        if (action !== 'allowDefault') {
            event.preventDefault();
        }

        if (action === 'solarLeadModal') {
            const state = document.getElementById('state');
            const city = document.getElementById('city');
            const size = document.getElementById('system_capacity');

            if (window.solarLeads && typeof window.solarLeads.showModal === 'function') {
                window.solarLeads.showModal('Inline CTA', {
                    state: state ? state.options[state.selectedIndex].text : '',
                    city: city && city.value ? city.options[city.selectedIndex].text : '',
                    size: size ? size.value : ''
                });
            }
            return;
        }

        if (action === 'toggleCategory' && typeof window.toggleCategory === 'function') {
            window.toggleCategory(Number(trigger.dataset.categoryIndex));
            return;
        }

        if (action === 'updateQty' && typeof window.updateQty === 'function') {
            window.updateQty(trigger.dataset.applianceName, Number(trigger.dataset.watts), Number(trigger.dataset.delta));
            return;
        }

        const callableActions = [
            'addCustomAppliancePrompt',
            'calcACSolar',
            'calcGeneration',
            'calcSubsidy',
            'calcVsGrid',
            'calculateBillSimulation',
            'calculateDegradation',
            'handleSaveCalculation'
        ];

        if (callableActions.includes(action) && typeof window[action] === 'function') {
            window[action](event);
        }
    });

    document.addEventListener('input', function (event) {
        const field = event.target.closest('[data-input-action]');
        const formField = event.target.closest('input, select, textarea');

        if (field && field.dataset.inputAction === 'syncText') {
            const target = document.getElementById(field.dataset.textTarget);
            if (target) target.textContent = field.value;
        }

        if (formField && formField.checkValidity()) {
            clearFieldError(formField);
        }
    });

    document.addEventListener('invalid', function (event) {
        const field = event.target.closest('input, select, textarea');
        if (!field) return;

        setFieldError(field, field.validationMessage || 'Please complete this field.');
    }, true);

    function setFieldError(field, message) {
        if (!field.id) return;

        const errorId = `${field.id}-error`;
        let error = document.getElementById(errorId);

        if (!error) {
            error = document.createElement('div');
            error.id = errorId;
            error.className = 'form-error-message';
            error.setAttribute('role', 'alert');
            field.insertAdjacentElement('afterend', error);
        }

        error.textContent = message;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', mergeDescribedBy(field.getAttribute('aria-describedby'), errorId));
    }

    function clearFieldError(field) {
        if (!field.id) return;

        const errorId = `${field.id}-error`;
        const error = document.getElementById(errorId);
        if (error) error.remove();

        field.removeAttribute('aria-invalid');

        const describedBy = (field.getAttribute('aria-describedby') || '')
            .split(/\s+/)
            .filter((id) => id && id !== errorId)
            .join(' ');

        if (describedBy) {
            field.setAttribute('aria-describedby', describedBy);
        } else {
            field.removeAttribute('aria-describedby');
        }
    }

    function mergeDescribedBy(current, id) {
        const ids = (current || '').split(/\s+/).filter(Boolean);
        if (!ids.includes(id)) ids.push(id);
        return ids.join(' ');
    }

});
