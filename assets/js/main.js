document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Management ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
        }
    }

    // --- RTL Management ---
    const rtlToggle = document.getElementById('rtl-toggle');
    const savedDir = localStorage.getItem('dir') || 'ltr';
    body.setAttribute('dir', savedDir);
    
    if (rtlToggle) {
        rtlToggle.innerText = savedDir === 'rtl' ? 'LTR' : 'RTL';
        rtlToggle.addEventListener('click', () => {
            const currentDir = body.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            body.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            rtlToggle.innerText = newDir === 'rtl' ? 'LTR' : 'RTL';
        });
    }

    // --- Sticky Navbar ---
    const navbar = document.querySelector('.navbar-custom');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // --- Confetti Animation ---
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50;
        const colors = ['#0d9488', '#14b8a6', '#0284c7', '#38bdf8', '#2dd4bf'];

        function resize() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.size = Math.random() * 8 + 4;
                this.speedY = Math.random() * 2 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 5 - 2.5;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotationSpeed;
                if (this.y > canvas.height) {
                    this.y = -20;
                    this.x = Math.random() * canvas.width;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }
        }

        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        init();
        animate();
    }

    // --- Back to Top ---
    const backToTop = document.createElement('a');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTop.href = '#';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll Reveal Animation for Giant Games
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.giant-card').forEach(card => {
        revealObserver.observe(card);
    });

    // Auto-populate default dates for Hero Booking Bar
    const heroCheckin = document.querySelector('.hero-booking-card input[name="checkin"]');
    const heroCheckout = document.querySelector('.hero-booking-card input[name="checkout"]');
    if (heroCheckin && !heroCheckin.value) {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const todayStr = today.toISOString().split('T')[0];
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        heroCheckin.value = todayStr;
        heroCheckin.min = todayStr;
        if (heroCheckout && !heroCheckout.value) {
            heroCheckout.value = tomorrowStr;
            heroCheckout.min = tomorrowStr;
        }
    }

    // Auto-fill booking enquiry from URL parameters (on quote.html)
    const urlParams = new URLSearchParams(window.location.search);
    const checkinParam = urlParams.get('checkin');
    const checkoutParam = urlParams.get('checkout');
    const roomParam = urlParams.get('room_type');

    if (checkinParam) {
        const inInput = document.querySelector('input[name="checkin"], #checkInDate');
        if (inInput) inInput.value = checkinParam;
    }
    if (checkoutParam) {
        const outInput = document.querySelector('input[name="checkout"], #checkOutDate');
        if (outInput) outInput.value = checkoutParam;
    }
    if (roomParam) {
        const roomSelect = document.querySelector('select[name="room_type"], #roomCategorySelect');
        if (roomSelect) {
            for (let option of roomSelect.options) {
                if (option.value === roomParam || option.text.toLowerCase().includes(roomParam.toLowerCase())) {
                    option.selected = true;
                    break;
                }
            }
        }
    }
});
