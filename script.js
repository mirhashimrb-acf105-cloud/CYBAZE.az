(function () {
    'use strict';

    /* ═══════ PREMIUM PARTICLE NETWORK ═══════ */
    var pCanvas = document.getElementById('particleCanvas');
    var pCtx = pCanvas.getContext('2d');
    var W, H, particles = [], mouseX = -1000, mouseY = -1000;

    function resizeP() {
        W = pCanvas.width = window.innerWidth;
        H = pCanvas.height = window.innerHeight;
    }
    resizeP();
    window.addEventListener('resize', resizeP);

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function Particle() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.5;
        this.dx = (Math.random() - 0.5) * 0.15;
        this.dy = (Math.random() - 0.5) * 0.15;
        this.baseAlpha = Math.random() * 0.25 + 0.08;
        this.alpha = this.baseAlpha;
        this.pulseSpeed = Math.random() * 0.01 + 0.003;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    /* Theme-aware particle color */
    function isLightTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light';
    }
    function pColor(alpha) {
        return isLightTheme()
            ? 'rgba(5,150,105,' + alpha + ')'
            : 'rgba(0,255,65,' + alpha + ')';
    }

    Particle.prototype.draw = function (t) {
        this.alpha = this.baseAlpha + Math.sin(t * this.pulseSpeed + this.pulseOffset) * 0.06;
        var mdx = this.x - mouseX, mdy = this.y - mouseY;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 180) {
            this.alpha = Math.min(0.5, this.alpha + (1 - mDist / 180) * 0.25);
        }
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        pCtx.fillStyle = pColor(isLightTheme() ? this.alpha * 2.5 : this.alpha);
        pCtx.fill();
    };

    Particle.prototype.update = function () {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > W) this.dx *= -1;
        if (this.y < 0 || this.y > H) this.dy *= -1;
    };

    var isMobile = window.innerWidth < 768;
    var count = isMobile
        ? Math.min(Math.floor((W * H) / 60000), 18)
        : Math.min(Math.floor((W * H) / 25000), 60);
    for (var i = 0; i < count; i++) particles.push(new Particle());

    var LINE_DIST_SQ = 35000;
    function drawParticleLines() {
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = dx * dx + dy * dy;
                if (dist < LINE_DIST_SQ) {
                    var opacity = 0.07 * (1 - dist / LINE_DIST_SQ);
                    pCtx.beginPath();
                    pCtx.moveTo(particles[i].x, particles[i].y);
                    pCtx.lineTo(particles[j].x, particles[j].y);
                    pCtx.strokeStyle = pColor(isLightTheme() ? opacity * 3 : opacity);
                    pCtx.lineWidth = isLightTheme() ? 0.6 : 0.4;
                    pCtx.stroke();
                }
            }
        }
    }

    var pStartTime = performance.now();
    function animateParticles() {
        var t = performance.now() - pStartTime;
        pCtx.clearRect(0, 0, W, H);
        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw(t);
        }
        drawParticleLines();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* ═══════ MATRIX RAIN ═══════ */
    var mCanvas = document.getElementById('matrixCanvas');
    var mCtx = mCanvas.getContext('2d');
    var mW, mH, columns, drops, speeds;

    var matrixChars = '01アイウエオカキクケコ<>/[];:'.split('');

    function initMatrix() {
        mW = mCanvas.width = window.innerWidth;
        mH = mCanvas.height = window.innerHeight;
        var fontSize = 16;
        var totalCols = Math.floor(mW / fontSize);
        columns = [];
        drops = [];
        speeds = [];
        for (var i = 0; i < totalCols; i += 4) {
            columns.push(i);
            drops.push(Math.random() * -50);
            speeds.push(Math.random() * 0.3 + 0.12);
        }
    }
    initMatrix();
    window.addEventListener('resize', initMatrix);

    function drawMatrix() {
        mCtx.globalCompositeOperation = 'destination-out';
        mCtx.fillStyle = isLightTheme() ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.25)';
        mCtx.fillRect(0, 0, mW, mH);
        mCtx.globalCompositeOperation = 'source-over';
        var fontSize = 16;
        mCtx.font = fontSize + 'px JetBrains Mono, monospace';
        mCtx.shadowBlur = 0;
        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            var ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            var y = drops[i] * fontSize;
            mCtx.fillStyle = isLightTheme() ? 'rgba(5, 150, 105, 0.7)' : 'rgba(0, 255, 65, 0.25)';
            mCtx.fillText(ch, col * fontSize, y);
            drops[i] += speeds[i];
            if (drops[i] * fontSize > mH && Math.random() > 0.95) {
                // Shortened respawn delay to increase rain frequency since the fade is now faster
                drops[i] = -Math.floor(Math.random() * 40 + 20);
            }
        }
    }
    setInterval(drawMatrix, 70);

    /* ═══════ DOTTED CYBER GRID ANIMATION ═══════ */
    function initCyberGrid() {
        var sections = document.querySelectorAll('#whyus, #contact');
        sections.forEach(function (sec) {
            sec.style.position = 'relative';
            var canvas = document.createElement('canvas');
            canvas.className = 'cyber-grid-canvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '0';
            canvas.style.pointerEvents = 'none';
            sec.insertBefore(canvas, sec.firstChild);

            var ctx = canvas.getContext('2d');
            var cw, ch;
            var offset = 0;
            
            function resize() {
                cw = canvas.width = sec.offsetWidth;
                ch = canvas.height = sec.offsetHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            function draw() {
                ctx.clearRect(0, 0, cw, ch);
                var isLight = document.documentElement.getAttribute('data-theme') === 'light';
                ctx.fillStyle = isLight ? 'rgba(14, 165, 233, 0.25)' : 'rgba(0, 255, 65, 0.15)';
                
                var spacing = 35;
                offset = (offset + 0.35) % spacing;
                
                for (var x = (offset - spacing); x < cw + spacing; x += spacing) {
                    for (var y = (offset - spacing); y < ch + spacing; y += spacing) {
                        ctx.beginPath();
                        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                requestAnimationFrame(draw);
            }
            draw();
        });
    }
    initCyberGrid();


    /* ═══════ NAVBAR SCROLL ═══════ */
    var header = document.querySelector('header');
    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    /* ═══════ MOBILE HAMBURGER MENU ═══════ */
    var hamburger = document.querySelector('.hamburger');
    var navEl = document.querySelector('nav');

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navEl.classList.toggle('mobile-open');
        document.body.style.overflow = navEl.classList.contains('mobile-open') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navEl.classList.remove('mobile-open');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMobileMenu);
    document.querySelectorAll('nav a').forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    /* ═══════ SCROLLSPY ═══════ */
    var navLinks = document.querySelectorAll('.nav-link');
    var spySections = document.querySelectorAll('#about, #services, #whyus, #contact');

    var spyObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var id = entry.target.getAttribute('id');
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    spySections.forEach(function (sec) { spyObs.observe(sec); });

    /* ═══════ SMOOTH SCROLL ═══════ */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ═══════ SCROLL REVEAL ═══════ */
    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });

    /* ═══════ CARD MOUSE GLOW ═══════ */
    document.querySelectorAll('.card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
            card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
    });

    /* ═══════ COUNTER ANIMATION ═══════ */
    var statEls = document.querySelectorAll('.stat h3');
    var cObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting && !e.target.dataset.done) {
                animateCounter(e.target);
            }
        });
    }, { threshold: 0.5 });
    function animateCounter(el) {
        el.dataset.done = '1';
        var raw = el.dataset.value;
        var num = parseInt(raw, 10);
        var suffix = raw.replace(/^[0-9]+/, '');
        if (/\d/.test(suffix)) { el.textContent = raw; return; }
        var cur = 0;
        var step = Math.max(1, Math.ceil(num / 50));
        var interval = setInterval(function () {
            cur += step;
            if (cur >= num) { cur = num; clearInterval(interval); }
            el.textContent = cur + suffix;
        }, 30);
    }
    window.startCounters = function () {
        statEls.forEach(function (s) {
            delete s.dataset.done;
            s.textContent = '0';
            animateCounter(s);
        });
    };
    /* Initial observe for first page load */
    function observeCounters() {
        statEls.forEach(function (s) { cObs.observe(s); });
    }

    /* ═══════ TYPING EFFECT (Terminal) ═══════ */
    var typeEl = document.getElementById('typingLine');
    if (typeEl) {
        var words = ['nmap -sV target', 'sqlmap --crawl 3', 'hydra -l admin', 'nikto -h target', 'gobuster dir -u', 'msfconsole'];
        var wi = 0, ci = 0, del = false;
        function typeLoop() {
            var w = words[wi];
            if (!del) {
                typeEl.textContent = '> ' + w.substring(0, ++ci) + '█';
                if (ci === w.length) { del = true; setTimeout(typeLoop, 2000); return; }
            } else {
                typeEl.textContent = '> ' + w.substring(0, --ci) + '█';
                if (ci === 0) { del = false; wi = (wi + 1) % words.length; }
            }
            setTimeout(typeLoop, del ? 35 : 70);
        }
        typeLoop();
    }

    /* ═══════ QUOTE MODAL ═══════ */
    window.openModal = function () {
        document.getElementById('quoteOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.innerWidth < 768) {
            document.getElementById('svcSelector').classList.add('revealed');
        }
    };
    window.closeModal = function () {
        document.getElementById('quoteOverlay').classList.remove('active');
        document.body.style.overflow = '';
    };
    document.getElementById('quoteOverlay').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            var overlay = document.getElementById('quoteOverlay');
            if (overlay.classList.contains('active')) closeModal();
            var svcOverlay = document.getElementById('serviceDetailOverlay');
            if (svcOverlay && svcOverlay.classList.contains('active')) closeServiceModal();
        }
    });

    /* ═══════ SERVICE CHIPS ═══════ */
    var chips = document.querySelectorAll('.svc-chip');
    var otherCb = document.querySelector('#chipOther input');
    var otherWrap = document.getElementById('otherFieldWrap');

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            var cb = this.querySelector('input');
            var self = this;
            setTimeout(function () {
                self.classList.toggle('selected', cb.checked);
                if (cb.checked) {
                    document.getElementById('svcSelector').classList.remove('svc-error');
                    showErr('errSvc', false);
                }
                if (cb === otherCb) {
                    otherWrap.classList.toggle('open', cb.checked);
                    if (!cb.checked) document.getElementById('otherTextarea').value = '';
                }
            }, 0);
        });
    });

    /* ═══════ FORM VALIDATION & WEB3FORMS ═══════ */
    var WEB3FORMS_KEY = 'cc2af01d-04b2-4f34-88ac-44d82c862f86';
    var WEB3FORMS_URL = 'https://api.web3forms.com/submit';
    var phoneRegex = /^(?:\+994|994|0)?(?:10|12|18|22|24|36|50|51|55|60|70|77|99)\d{7}$/;
    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    function showErr(id, show) {
        var errEl = document.getElementById(id);
        if (errEl) errEl.style.display = show ? 'block' : 'none';
    }
    function setInputError(inputId, hasError) {
        var input = document.getElementById(inputId);
        if (input) { if (hasError) input.classList.add('input-error'); else input.classList.remove('input-error'); }
    }
    function normalizePhone(phone) { return phone.replace(/[\s\-\(\)]/g, ''); }

    ['fName', 'fPhone', 'fEmail'].forEach(function (id) {
        var input = document.getElementById(id);
        if (input) {
            input.addEventListener('focus', function () {
                setInputError(id, false);
                var errMap = { fName: 'errName', fPhone: 'errPhone', fEmail: 'errEmail' };
                showErr(errMap[id], false);
            });
        }
    });

    document.getElementById('quoteForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var form = this;
        var ok = true;
        var name = document.getElementById('fName').value.trim();
        var company = document.getElementById('fCompany').value.trim();
        var email = document.getElementById('fEmail').value.trim();
        var rawPhone = document.getElementById('fPhone').value.trim();
        var phone = normalizePhone(rawPhone);
        var checkedBoxes = document.querySelectorAll('.svc-chip input:checked');
        var otherText = document.getElementById('otherTextarea').value.trim();

        if (!name || name.length < 2) { showErr('errName', true); setInputError('fName', true); ok = false; }
        else { showErr('errName', false); setInputError('fName', false); }
        if (!emailRegex.test(email)) { showErr('errEmail', true); setInputError('fEmail', true); ok = false; }
        else { showErr('errEmail', false); setInputError('fEmail', false); }
        if (!phoneRegex.test(phone)) { showErr('errPhone', true); setInputError('fPhone', true); ok = false; }
        else { showErr('errPhone', false); setInputError('fPhone', false); }
        if (checkedBoxes.length === 0) { showErr('errSvc', true); document.getElementById('svcSelector').classList.add('svc-error'); ok = false; }
        else { showErr('errSvc', false); document.getElementById('svcSelector').classList.remove('svc-error'); }
        if (!ok) return;

        var services = [];
        checkedBoxes.forEach(function (cb) { services.push(cb.value); });
        var servicesStr = services.join(', ');
        var btn = form.querySelector('.btn-submit');
        var origText = btn.textContent;
        var dict = (window._T && window._T[currentLang]) || {};
        btn.textContent = dict['form.sending'] || 'GÖNDƏRİLİR...';
        btn.classList.add('sending');
        btn.classList.remove('success', 'error');
        btn.disabled = true;

        var payload = {
            access_key: WEB3FORMS_KEY,
            subject: '🚀 CYBAZE - Yeni Təklif Sorğusu',
            from_name: 'CYBAZE Təklif',
            replyto: email,
            '👤 Müştəri Adı': name,
            '📞 Əlaqə Nömrəsi': rawPhone,
            '✉️ E-poçt Ünvanı': email,
            '🏢 Şirkət / VÖEN': company || 'Qeyd edilməyib',
            '🎯 Seçilən Xidmətlər': servicesStr
        };
        if (services.indexOf('Digər') !== -1 && otherText) { payload['📝 Əlavə Qeyd'] = otherText; }

        fetch(WEB3FORMS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(function (response) {
            return response.json().then(function (json) {
                if (response.status === 200 && json.success) {
                    btn.textContent = dict['form.success'] || 'UĞURLA GÖNDƏRİLDİ ✓';
                    btn.classList.remove('sending');
                    btn.classList.add('success');
                    var toastContainer = document.getElementById('toast-container');
                    var toast = document.createElement('div');
                    toast.className = 'toast-notification';
                    toast.textContent = dict['form.toast'] || '✅ Sorğunuz şifrələnmiş kanal vasitəsilə mütəxəssislərimizə çatdırıldı';
                    toastContainer.appendChild(toast);
                    setTimeout(function () {
                        toast.classList.add('toast-out');
                        setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
                    }, 4000);
                    setTimeout(function () {
                        closeModal();
                        btn.textContent = origText;
                        btn.classList.remove('success');
                        btn.disabled = false;
                        form.reset();
                        chips.forEach(function (c) { c.classList.remove('selected'); });
                        otherWrap.classList.remove('open');
                        document.getElementById('svcSelector').classList.remove('svc-error');
                        ['fName', 'fPhone', 'fEmail'].forEach(function (id) { setInputError(id, false); });
                    }, 2000);
                } else {
                    btn.textContent = dict['form.error'] || 'XƏTA BAŞ VERDİ ✗';
                    btn.classList.remove('sending');
                    btn.classList.add('error');
                    setTimeout(function () { btn.textContent = origText; btn.classList.remove('error'); btn.disabled = false; }, 3000);
                }
            });
        })
        .catch(function () {
            btn.textContent = dict['form.retry'] || 'XƏTA — YENİDƏN CƏHD EDİN';
            btn.classList.remove('sending');
            btn.classList.add('error');
            setTimeout(function () { btn.textContent = origText; btn.classList.remove('error'); btn.disabled = false; }, 3000);
        });
    });

    /* ═══════ SCROLL TO SERVICES ═══════ */
    window.scrollToServices = function () {
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    };

    /* ═══════ MAP TOGGLE ═══════ */
    window.toggleMap = function () {
        var btn = document.getElementById('mapToggle');
        var frame = document.getElementById('mapFrameWrap');
        btn.classList.toggle('active');
        frame.classList.toggle('open');
    };

    /* ═══════ THEME TOGGLE ═══════ */
    var themeToggle = document.getElementById('themeToggle');
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('cybaze-theme', theme);
    }
    themeToggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'light' ? 'dark' : 'light');
    });

    /* ═══════ SERVICE DETAIL MODAL ═══════ */
    var serviceData = {
        redteam: {
            icon: '🔴',
            title: 'Red Teaming / Penetrasiya Testi',
            desc: 'Red Team xidmətimiz real dünya hücum ssenarilərini simulyasiya edərək təşkilatınızın müdafiə qabiliyyətini hərtərəfli qiymətləndirir. Peşəkar pentesterlərimiz ən son hücum texnikalarından istifadə edərək şəbəkə və tətbiqlərdəki kritik boşluqları tapır, istismar edir və detallı hesabatla birlikdə həll yollarını təqdim edir.',
            features: [
                { t: 'Veb Tətbiq Penetrasiya Testi', d: 'OWASP Top 10, SQL Injection, XSS, CSRF, SSRF və digər veb zəifliklərin tam analizi və istismarı.' },
                { t: 'Mobil Tətbiq Təhlükəsizliyi', d: 'Android və iOS tətbiqlərinin reverse engineering, API analizi və data leakage testləri.' },
                { t: 'Şəbəkə İnfrastruktur Auditi', d: 'Daxili və xarici şəbəkə skaneri, port analizi, servis enumerasiyası və lateral movement testləri.' },
                { t: 'Sosial Mühəndislik Simulyasiyası', d: 'Phishing kampaniyaları, vishing, pretexting və fiziki giriş sınaqları ilə insan faktorunun qiymətləndirilməsi.' },
                { t: 'API Təhlükəsizlik Testi', d: 'REST, GraphQL və SOAP API endpointlərinin autentifikasiya, avtorizasiya və injection testləri.' }
            ],
            tools: ['Burp Suite Pro', 'Metasploit', 'Nmap', 'Cobalt Strike', 'BloodHound', 'Nuclei', 'SQLMap', 'Hashcat']
        },
        blueteam: {
            icon: '🔵',
            title: 'Blue Team / SOC Analyst Xidmətləri',
            desc: 'Blue Team xidmətimiz təşkilatınızın kiber müdafiəsini 7/24 rejimində təmin edir. SOC analitiklərimiz real vaxtda təhdidləri aşkarlayır, insidentlərə dərhal cavab verir və infrastrukturunuzu proaktiv şəkildə qoruyur. SIEM, EDR və SOAR texnologiyaları ilə tam avtomatlaşdırılmış müdafiə sistemi qururuq.',
            features: [
                { t: '24/7 Log Monitorinq (SIEM)', d: 'Splunk, QRadar və ELK Stack ilə bütün sistem loglarının real vaxtda izlənməsi və korrelyasiyası.' },
                { t: 'Təhdidlərin Ovu (Threat Hunting)', d: 'Proaktiv təhdid axtarışı, IOC/IOA analizi və APT qruplarının fəaliyyətinin monitorinqi.' },
                { t: 'İnsidentə Cavab (IR)', d: 'Kiber hücum zamanı dərhal reaksiya, zərərin minimuma endirilməsi və bərpa proseslərinin idarə edilməsi.' },
                { t: 'Zərərli Proqram Analizi', d: 'Malware reverse engineering, sandboxing, yoluxma vektorlarının təhlili və IOC çıxarılması.' },
                { t: 'EDR / XDR Tətbiqi', d: 'Endpoint Detection & Response həllərinin qurulması, konfiqurasiyası və monitorinqi.' }
            ],
            tools: ['Splunk', 'IBM QRadar', 'ELK Stack', 'CrowdStrike', 'Carbon Black', 'Wireshark', 'YARA', 'TheHive']
        },
        audit: {
            icon: '📜',
            title: 'Konsultasiya və Audit Xidmətləri',
            desc: 'Beynəlxalq təhlükəsizlik standartlarına uyğunluğun təmin edilməsi və korporativ təhlükəsizlik strategiyasının qurulması. ISO 27001, GDPR, PCI DSS kimi standartlara hazırlıq, risk qiymətləndirmə və işçilərin kiber təhlükəsizlik maarifləndirmə proqramları təklif edirik.',
            features: [
                { t: 'ISO 27001 Hazırlığı', d: 'Informasiya Təhlükəsizliyi İdarəetmə Sisteminin (ISMS) qurulması, sənədləşdirilməsi və audit hazırlığı.' },
                { t: 'Təhlükəsizlik Siyasəti', d: 'Korporativ təhlükəsizlik siyasətlərinin, prosedurların və qaydaların hazırlanması və tətbiqi.' },
                { t: 'Kiber Təhlükəsizlik Təlimləri', d: 'İşçilər üçün phishing simulyasiyaları, təhlükəsizlik maarifləndirmə proqramları və masa üstü təlimlər.' },
                { t: 'Risk Qiymətləndirmə', d: 'Aktivlərin identifikasiyası, təhdid modelləmə, zəiflik analizi və risk prioritetləşdirmə.' },
                { t: 'Uyğunluq Auditi', d: 'PCI DSS, GDPR, KVKK və yerli qanunvericiliyə uyğunluğun yoxlanılması və hesabatlanması.' }
            ],
            tools: ['Nessus', 'Qualys', 'OpenVAS', 'ISO 27001 Toolkit', 'NIST Framework', 'GRC Platforms']
        }
    };

    function openServiceModal(serviceKey) {
        var fallback = serviceData[serviceKey];
        if (!fallback) return;

        /* Try to get translated service data */
        var data = fallback;
        if (window._T && window._T[currentLang] && window._T[currentLang]['svc.' + serviceKey + '.title']) {
            var dict = window._T[currentLang];
            var prefix = 'svc.' + serviceKey;
            data = {
                icon: fallback.icon,
                title: dict[prefix + '.title'] || fallback.title,
                desc: dict[prefix + '.desc'] || fallback.desc,
                features: [],
                tools: fallback.tools
            };
            for (var fi = 0; fi < fallback.features.length; fi++) {
                data.features.push({
                    t: dict[prefix + '.f' + fi + '.t'] || fallback.features[fi].t,
                    d: dict[prefix + '.f' + fi + '.d'] || fallback.features[fi].d
                });
            }
        }

        document.getElementById('svcModalIcon').textContent = data.icon;
        document.getElementById('svcModalTitle').textContent = data.title;
        document.getElementById('svcModalDesc').textContent = data.desc;

        /* Apply theme class based on serviceKey */
        var serviceModal = document.querySelector('.service-modal');
        serviceModal.classList.remove('theme-red', 'theme-blue', 'theme-amber');
        if (serviceKey === 'redteam') serviceModal.classList.add('theme-red');
        if (serviceKey === 'blueteam') serviceModal.classList.add('theme-blue');
        if (serviceKey === 'audit') serviceModal.classList.add('theme-amber');

        /* Tools heading translation */
        var toolsHeading = document.querySelector('.tools-heading');
        if (toolsHeading && window._T && window._T[currentLang] && window._T[currentLang]['svc.tools_heading']) {
            toolsHeading.textContent = window._T[currentLang]['svc.tools_heading'];
        }

        /* Features Accordion */
        var featuresEl = document.getElementById('svcModalFeatures');
        featuresEl.innerHTML = '';
        data.features.forEach(function (f) {
            var div = document.createElement('div');
            div.className = 'svc-feature-item';
            div.innerHTML = '<div class="svc-feature-header"><h5>' + f.t + '</h5><span class="svc-feature-arrow">▼</span></div><div class="svc-feature-body"><div class="svc-feature-body-inner"><p>' + f.d + '</p></div></div>';
            div.addEventListener('click', function () {
                var wasOpen = this.classList.contains('open');
                document.querySelectorAll('.svc-feature-item').forEach(function(el) { el.classList.remove('open'); });
                if (!wasOpen) this.classList.add('open');
            });
            featuresEl.appendChild(div);
        });

        /* Tools Accordion / Descriptions */
        var toolsEl = document.getElementById('svcModalTools');
        toolsEl.innerHTML = '';
        var toolsStr = (window._T && window._T[currentLang] && window._T[currentLang]['svc.' + serviceKey + '.tools_desc']) 
            ? window._T[currentLang]['svc.' + serviceKey + '.tools_desc'] 
            : (window._T && window._T['en'] && window._T['en']['svc.' + serviceKey + '.tools_desc']);

        if (toolsStr) {
            var splitted = toolsStr.split('#');
            splitted.forEach(function (tStr) {
                if (!tStr) return;
                var parts = tStr.split('|');
                var tName = parts[0];
                var tDesc = parts[1] || '';
                var toolDiv = document.createElement('div');
                toolDiv.className = 'tool-item';
                toolDiv.innerHTML = '<div class="tool-header"><span class="tool-badge">' + tName + '</span><span class="tool-arrow">▼</span></div><div class="tool-body"><div class="tool-body-inner"><p>' + tDesc + '</p></div></div>';
                toolDiv.addEventListener('click', function () {
                    var wasOpen = this.classList.contains('open');
                    document.querySelectorAll('.tool-item').forEach(function(el) { el.classList.remove('open'); });
                    if (!wasOpen) this.classList.add('open');
                });
                toolsEl.appendChild(toolDiv);
            });
        } else {
            // Fallback to badges if desc not present
            data.tools.forEach(function (tool) {
                var span = document.createElement('span');
                span.className = 'tool-badge';
                span.textContent = tool;
                toolsEl.appendChild(span);
            });
        }

        document.getElementById('serviceDetailOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    window.closeServiceModal = function () {
        document.getElementById('serviceDetailOverlay').classList.remove('active');
        document.body.style.overflow = '';
    };

    document.getElementById('serviceDetailOverlay').addEventListener('click', function (e) {
        if (e.target === this) closeServiceModal();
    });
    document.getElementById('svcModalClose').addEventListener('click', closeServiceModal);

    document.querySelectorAll('.card[data-service]').forEach(function (card) {
        card.addEventListener('click', function () {
            openServiceModal(this.dataset.service);
        });
    });

    /* ═══════ LANGUAGE SWITCHER ═══════ */
    var langSwitcher = document.getElementById('langSwitcher');
    var langBtn = document.getElementById('langBtn');
    var langDropdown = document.getElementById('langDropdown');
    var langCodeEl = document.getElementById('langCode');

    langBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        langSwitcher.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
        if (!langSwitcher.contains(e.target)) {
            langSwitcher.classList.remove('open');
        }
    });

    /* ═══════ TYPEWRITER (Hero) ═══════ */
    var typewriterTexts = {
        az: 'Biz Sizin R\u0259q\u0259msal Qalan\u0131z\u0131 Qoruyuruq.',
        en: 'We Protect Your Digital Fortress.',
        ru: '\u041c\u044b \u0417\u0430\u0449\u0438\u0449\u0430\u0435\u043c \u0412\u0430\u0448\u0443 \u0426\u0438\u0444\u0440\u043e\u0432\u0443\u044e \u041a\u0440\u0435\u043f\u043e\u0441\u0442\u044c.',
        tr: 'Dijital Kalenizi Koruyoruz.',
        zh: '\u6211\u4eec\u4fdd\u62a4\u60a8\u7684\u6570\u5b57\u5821\u5792\u3002',
        ar: '\u0646\u062d\u0646 \u0646\u062d\u0645\u064a \u062d\u0635\u0646\u0643 \u0627\u0644\u0631\u0642\u0645\u064a.',
        fa: '\u0645\u0627 \u0627\u0632 \u0642\u0644\u0639\u0647 \u062f\u06cc\u062c\u06cc\u062a\u0627\u0644 \u0634\u0645\u0627 \u0645\u062d\u0627\u0641\u0638\u062a \u0645\u06cc\u200c\u06a9\u0646\u06cc\u0645.',
        ur: '\u06c1\u0645 \u0622\u067e \u06a9\u06d2 \u0688\u06cc\u062c\u06cc\u0679\u0644 \u0642\u0644\u0639\u06d2 \u06a9\u06cc \u062d\u0641\u0627\u0638\u062a \u06a9\u0631\u062a\u06d2 \u06c1\u06cc\u06ba\u06d4',
        hi: '\u0939\u092e \u0906\u092a\u0915\u0947 \u0921\u093f\u091c\u093f\u091f\u0932 \u0915\u093f\u0932\u0947 \u0915\u0940 \u0930\u0915\u094d\u0937\u093e \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964',
        es: 'Protegemos Tu Fortaleza Digital.',
        fr: 'Nous Prot\u00e9geons Votre Forteresse Num\u00e9rique.'
    };

    var twTimeout = null;
    function startTypewriter(lang) {
        var el = document.getElementById('typewriter-text');
        if (!el) return;
        if (twTimeout) clearTimeout(twTimeout);
        el.textContent = '';
        /* Read from translations.js first, fallback to hardcoded */
        var dict = (window._T && window._T[lang]) || {};
        var text = dict['hero.typewriter'] || typewriterTexts[lang || 'az'] || typewriterTexts['az'];
        var idx = 0;
        function type() {
            if (idx <= text.length) {
                el.textContent = text.substring(0, idx);
                idx++;
                twTimeout = setTimeout(type, 55);
            }
        }
        type();
    }

    /* ═══════ TRANSLATIONS (loaded from translations.js as window._T) ═══════ */

    var currentLang = localStorage.getItem('cybaze-lang') || 'az';

    function setLanguage(lang) {
        if (!window._T || !window._T[lang]) lang = 'az';
        currentLang = lang;
        localStorage.setItem('cybaze-lang', lang);
        document.documentElement.setAttribute('lang', lang);

        var dict = window._T[lang];
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                el.textContent = dict[key];
            }
        });

        /* Translate placeholders */
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (dict[key] !== undefined) {
                el.placeholder = dict[key];
            }
        });

        langCodeEl.textContent = lang.toUpperCase();
        document.querySelectorAll('.lang-option').forEach(function (opt) {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });

        startTypewriter(lang);
    }

    langDropdown.querySelectorAll('.lang-option').forEach(function (opt) {
        opt.addEventListener('click', function () {
            var lang = this.dataset.lang;
            langSwitcher.classList.remove('open');
            if (lang === currentLang) return;
            showPreloaderForLang(lang, function () {
                setLanguage(lang);
            });
        });
    });

    /* ═══════ PRELOADER ═══════ */
    var preloader = document.getElementById('cyber-preloader');
    var preloaderDone = false;

    function hidePreloader() {
        if (preloaderDone) return;
        preloaderDone = true;
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(function () {
                preloader.style.display = 'none';
                preloader.classList.remove('fade-out');
                startTypewriter(currentLang);
                observeCounters();
                // Apply saved language after preloader
                if (window._T && currentLang !== 'az') {
                    setLanguage(currentLang);
                }
            }, 500);
        }
    }

    window.addEventListener('load', function () {
        setTimeout(hidePreloader, 1500);
    });

    window.addEventListener('DOMContentLoaded', function () {
        if (window._T) {
            var lang = localStorage.getItem('cybaze-lang') || 'az';
            setLanguage(lang);
        }
    });

    function showPreloaderForLang(targetLang, callback) {
        if (!preloader) { if (callback) callback(); return; }
        var termLoader = preloader.querySelector('.terminal-loader');
        termLoader.innerHTML = '';

        /* Read preloader messages from target language translations */
        var dict = (window._T && window._T[targetLang]) || {};
        var msgs = [
            '> ' + (dict['preloader.msg1'] || 'Decrypting language module...'),
            '> ' + (dict['preloader.msg2'] || 'Applying translation matrix...'),
            '> ' + (dict['preloader.msg3'] || 'Interface Updated.')
        ];

        preloader.style.display = 'flex';
        preloader.classList.remove('fade-out');

        msgs.forEach(function (msg, i) {
            setTimeout(function () {
                var p = document.createElement('p');
                p.textContent = msg;
                p.style.opacity = '1';
                p.style.animation = 'none';
                termLoader.appendChild(p);
            }, i * 350);
        });

        setTimeout(function () {
            if (callback) callback();
            /* Restart counter animations after language change — bypass IntersectionObserver */
            if (window.startCounters) window.startCounters();
            preloader.classList.add('fade-out');
            setTimeout(function () {
                preloader.style.display = 'none';
                preloader.classList.remove('fade-out');
            }, 600);
        }, 1400);
    }

})();
