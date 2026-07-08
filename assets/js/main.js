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

});