document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initScrollReveal();
    initSoundToggle();
    initCopy();
});

/* ===== CONFIG ===== */
function loadConfig() {
    fetch('/api/config')
        .then(r => r.json())
        .then(cfg => {
            const ca = cfg.ca || '';
            const caShort = ca.length > 16 ? ca.slice(0, 6) + '...' + ca.slice(-4) : ca;

            document.getElementById('nav-ca').textContent = caShort || 'no CA';
            document.getElementById('nav-ca').dataset.full = ca;
            document.getElementById('footer-ca').textContent = ca || 'no CA';
            document.getElementById('footer-ca').dataset.full = ca;

            if (cfg.buy) {
                document.getElementById('btn-buy').href = cfg.buy;
                document.getElementById('btn-buy').target = '_blank';
                document.getElementById('btn-buy').rel = 'noopener';
            }
            if (cfg.community) {
                document.getElementById('btn-community').href = cfg.community;
                document.getElementById('nav-community').href = cfg.community;
            }
        })
        .catch(() => {});
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    els.forEach((el, i) => {
        // Stagger gallery items and buy steps
        const parent = el.closest('.gallery-grid, .buy-steps, .philosophy__branches');
        if (parent) {
            const siblings = parent.querySelectorAll('[data-reveal]');
            const idx = Array.from(siblings).indexOf(el);
            el.style.transitionDelay = (idx * 0.08) + 's';
        }
        observer.observe(el);
    });
}

/* ===== SOUND TOGGLE ===== */
function initSoundToggle() {
    const btn = document.getElementById('sound-btn');
    const video = document.getElementById('hero-video');
    if (!btn || !video) return;

    const icon = btn.querySelector('.sound-btn__icon');
    const text = btn.querySelector('.sound-btn__text');
    let muted = true;

    btn.addEventListener('click', () => {
        if (muted) {
            video.muted = false;
            video.volume = 0;
            let vol = 0;
            const ramp = setInterval(() => {
                vol += 0.3 / 40;
                if (vol >= 0.3) { vol = 0.3; clearInterval(ramp); }
                video.volume = vol;
            }, 50);
            icon.textContent = '🔊';
            text.textContent = 'mute';
            muted = false;
        } else {
            video.muted = true;
            video.volume = 0;
            icon.textContent = '🔇';
            text.textContent = 'sound';
            muted = true;
        }
    });
}

/* ===== COPY CA ===== */
function initCopy() {
    const toast = document.getElementById('toast');
    let timeout;

    function showToast() {
        toast.classList.add('visible');
        clearTimeout(timeout);
        timeout = setTimeout(() => toast.classList.remove('visible'), 2000);
    }

    function copyCA(el) {
        const ca = el.dataset.full || el.textContent;
        if (!ca || ca === 'loading...' || ca === 'no CA') return;
        navigator.clipboard.writeText(ca).then(showToast).catch(() => {});
    }

    document.getElementById('nav-ca').addEventListener('click', function() { copyCA(this); });
    document.getElementById('footer-ca').addEventListener('click', function() { copyCA(this); });
}