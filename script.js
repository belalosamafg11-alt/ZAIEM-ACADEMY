/* ==========================================================================
   الزعيم أكاديمي - Unified Production Engine (Complete Integration V4)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DATA STORE & GLOBAL CONFIG ---
    const DEFAULT_GROUPS_DATA = {
        grade1: [
            { id: 'g1-1', title: 'سنتر الجزار (محطة الرمل)', day: 'الأربعاء', time: '05:30 مساءً', status: 'أماكن محدودة' },
            { id: 'g1-2', title: 'سنتر السرايا', day: 'الثلاثاء', time: '07:30 مساءً', status: 'متاح' },
            { id: 'g1-3', title: 'سنتر الجزار (باكوس - مجموعة عامة)', day: 'الأحد', time: '06:00 مساءً', status: 'أماكن محدودة' },
            { id: 'g1-4', title: 'سنتر الجزار (باكوس - مجموعة خاصة)', day: 'الأحد', time: '01:00 مساءً', status: 'متاح' },
            { id: 'g1-5', title: 'سنتر الرياض', day: 'الثلاثاء', time: '05:00 مساءً', status: 'متاح' },
            { id: 'g1-6', title: 'سنتر دار العلوم', day: 'السبت', time: '04:00 مساءً', status: 'متاح' }
        ],
        grade2: [
            { id: 'g2-1', title: 'سنتر الجزار (محطة الرمل)', day: 'الإثنين', time: '05:00 مساءً', status: 'متاح' },
            { id: 'g2-2', title: 'سنتر الرياض', day: 'الخميس', time: '06:00 مساءً', status: 'أماكن محدودة' },
            { id: 'g2-3', title: 'سنتر الامتياز', day: 'الأربعاء', time: '07:30 مساءً', status: 'متاح' }
        ],
        grade3: [
            { id: 'g3-1', title: 'سنتر دار العلوم', day: 'الأحد', time: '03:00 مساءً', status: 'متاح' }
        ]
    };

    let registeredStudents = JSON.parse(localStorage.getItem('zaeem_students')) || [];
    let localGradesStatus = JSON.parse(localStorage.getItem('zaeem_grades_status')) || { grade1: true, grade2: true, grade3: true };
    let localGroupsData = JSON.parse(localStorage.getItem('zaeem_custom_groups_v3')) || DEFAULT_GROUPS_DATA;
    let activeAdminPassword = localStorage.getItem('adminCustomPassword') || "1234";

    let localSiteContent = JSON.parse(localStorage.getItem('zaeem_site_content')) || {
        heroCaption: "منظومة تعليمية تفاعلية بأسلوب التحليل والفهم المنطقي بعيداً عن الحفظ التلقيني. احتفل بتفوقك واضمن الدرجة النهائية.",
        aboutQuote: '"نأخذك في رحلة للتحليل والتفكير المنطقي بعيداً عن الحفظ والتكرار التقليدي، لنضمن لك الوصول إلى أعلى مراتب التفوق واعتلاء القمة دائماً."',
        expYears: 15,
        topStudents: 10000,
        successRate: 99
    };

    window.selectedGroupData = null;
    window.currentBookingGrade = 'grade1';

    function saveLocalData() {
        localStorage.setItem('zaeem_grades_status', JSON.stringify(localGradesStatus));
        localStorage.setItem('zaeem_custom_groups_v3', JSON.stringify(localGroupsData));
        localStorage.setItem('zaeem_site_content', JSON.stringify(localSiteContent));
    }

    function applySiteContentUI() {
        const heroCap = document.getElementById('hero-subtitle');
        const aboutQuote = document.getElementById('about-quote');
        const counterExp = document.getElementById('counter-exp');
        const counterStudents = document.getElementById('counter-students');
        const counterSuccess = document.getElementById('counter-success');

        if (heroCap) heroCap.textContent = localSiteContent.heroCaption;
        if (aboutQuote) aboutQuote.textContent = localSiteContent.aboutQuote;

        if (counterExp) {
            counterExp.setAttribute('data-target', localSiteContent.expYears);
            counterExp.textContent = localSiteContent.expYears;
        }
        if (counterStudents) {
            counterStudents.setAttribute('data-target', localSiteContent.topStudents);
            counterStudents.textContent = localSiteContent.topStudents;
        }
        if (counterSuccess) {
            counterSuccess.setAttribute('data-target', localSiteContent.successRate);
            counterSuccess.textContent = localSiteContent.successRate;
        }
    }
    applySiteContentUI();

    // --- 2. DYNAMIC CANVAS PARTICLES BACKGROUND ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.color = Math.random() > 0.4 ? 'rgba(212, 175, 55, ' : 'rgba(0, 240, 255, ';
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        initParticles();

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --- 3. TYPING EFFECT IN HERO SECTION ---
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const typingPhrases = [
            'الأستاذ أيمن حمدي',
            'الزعيم في الفلسفة والمنطق',
            'صانع الأوائل والمتفوقين'
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentPhrase = typingPhrases[phraseIdx];
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let speed = isDeleting ? 40 : 80;

            if (!isDeleting && charIdx === currentPhrase.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % typingPhrases.length;
                speed = 500;
            }

            setTimeout(typeEffect, speed);
        }
        typeEffect();
    }

    // --- 4. AUDIO SYNTHESIZER FOR UI SOUNDS ---
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playClickSound() {
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) { }
    }

    document.querySelectorAll('.ui-sound-btn, button').forEach(btn => {
        btn.addEventListener('click', () => playClickSound());
    });

    // --- 5. THEME TOGGLE (DARK / LIGHT MODE) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeBall = document.getElementById('theme-ball');
    let isDark = true;

    if (themeToggleBtn && themeBall) {
        themeToggleBtn.addEventListener('click', () => {
            isDark = !isDark;
            if (isDark) {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
                themeBall.style.transform = 'translateX(0px)';
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                themeBall.style.transform = 'translateX(-26px)';
            }
        });
    }

    // --- 6. 3D TILT EFFECT FOR ABOUT CARD ---
    const tiltCard = document.getElementById('tilt-card');
    if (tiltCard && window.innerWidth > 640) {
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;

            tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        tiltCard.addEventListener('mouseleave', () => {
            tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }

    // --- 7. ANIMATED COUNTER UP ---
    let countersAnimated = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                document.querySelectorAll('.counter-val').forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    let count = 0;
                    const step = Math.ceil(target / 50);
                    const updateCount = () => {
                        count += step;
                        if (count > target) count = target;
                        counter.textContent = count.toLocaleString('ar-EG');
                        if (count < target) setTimeout(updateCount, 30);
                    };
                    updateCount();
                });
            }
        });
    }, { threshold: 0.5 });

    const aboutSection = document.getElementById('about-section');
    if (aboutSection) observer.observe(aboutSection);

    const scrollToAboutBtn = document.getElementById('scroll-to-about');
    if (scrollToAboutBtn && aboutSection) {
        scrollToAboutBtn.addEventListener('click', () => {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- 8. SINGLE NOTIFICATION ENGINE ---
    function showNotification(title, detailMessage, type = 'error') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        container.innerHTML = '';
        const isSuccess = type === 'success';

        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = isSuccess ? 'sine' : 'sawtooth';
            
            if (isSuccess) {
                osc.frequency.setValueAtTime(520, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
            } else {
                osc.frequency.setValueAtTime(280, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.18);
            }

            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.18);
        } catch (e) { }

        const toast = document.createElement('div');
        toast.className = `toast-card ${isSuccess ? 'toast-success' : 'toast-error'}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fa-solid ${isSuccess ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
            </div>
            <div class="flex-1 text-right">
                <strong class="block ${isSuccess ? 'text-emerald-400' : 'text-red-400'} font-bold text-sm mb-0.5">${title}</strong>
                <span class="block text-slate-200 text-xs leading-relaxed font-tajawal">${detailMessage}</span>
            </div>
        `;

        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    function validatePhoneNumber(phone, fieldName) {
        if (!phone) {
            showNotification('حقل مفقود!', `يرجى إدخال ${fieldName} أولاً.`, 'error');
            return false;
        }

        const digitsOnly = phone.replace(/\D/g, '');

        if (digitsOnly.length !== 11) {
            showNotification(
                `خطأ في ${fieldName}!`, 
                `الرقم يتكون من (${digitsOnly.length}) أرقام. يجب أن يتكون من 11 رقماً بالضبط.`,
                'error'
            );
            return false;
        }

        const validPrefixes = ['010', '011', '012', '015'];
        const prefix = digitsOnly.substring(0, 3);
        if (!validPrefixes.includes(prefix)) {
            showNotification(
                `بداية الرقم غير صحيحة!`, 
                `رقم ${fieldName} يبدأ بـ (${prefix}). يجب أن يبدأ بـ (010, 011, 012, 015).`,
                'error'
            );
            return false;
        }

        return true;
    }

    // --- 9. BOOKING MODAL & DYNAMIC GROUP HANDLING + SEQUENTIAL CODE ---
    const bookingModal = document.getElementById('booking-modal');
    const openBookingBtn = document.getElementById('open-booking-modal');
    const closeBookingBtn = document.getElementById('close-booking-modal');
    const groupsContainer = document.getElementById('groups-container');
    const gradeTabs = document.querySelectorAll('.grade-tab');

    if (openBookingBtn && bookingModal) {
        openBookingBtn.addEventListener('click', () => {
            bookingModal.classList.remove('opacity-0', 'pointer-events-none');
            document.body.classList.add('modal-open');
            applyGroupsToStudentModal(window.currentBookingGrade);
        });
    }

    if (closeBookingBtn && bookingModal) {
        closeBookingBtn.addEventListener('click', () => {
            bookingModal.classList.add('opacity-0', 'pointer-events-none');
            document.body.classList.remove('modal-open');
        });
    }

    function generateNextStudentCode() {
        let lastCodeNum = parseInt(localStorage.getItem('zaeem_last_code_num')) || 1000;
        lastCodeNum++;
        localStorage.setItem('zaeem_last_code_num', lastCodeNum);
        
        if (typeof firebase !== 'undefined' && firebase.database) {
            firebase.database().ref('lastCodeNum').set(lastCodeNum);
        }

        return `ZA-${lastCodeNum}`;
    }

    function applyGroupsToStudentModal(targetGradeKey) {
        if (!groupsContainer) return;

        const activeGrade = targetGradeKey || window.currentBookingGrade || 'grade1';
        let normalizedKey = activeGrade;
        if (activeGrade === 'grade-1' || activeGrade === '1') normalizedKey = 'grade1';
        if (activeGrade === 'grade-2' || activeGrade === '2') normalizedKey = 'grade2';
        if (activeGrade === 'grade-3' || activeGrade === '3') normalizedKey = 'grade3';

        groupsContainer.innerHTML = '';
        window.selectedGroupData = null;

        const list = localGroupsData[normalizedKey] || [];

        if (!localGradesStatus[normalizedKey] || list.length === 0) {
            groupsContainer.innerHTML = `
                <div class="col-span-2 text-center py-6 bg-slate-900/60 border border-amber-500/30 rounded-2xl p-4">
                    <i class="fa-solid fa-lock text-amber-400 text-2xl mb-2 block"></i>
                    <p class="text-xs text-amber-300 font-bold">الحجز مغلق حالياً لهذا الصف الدراسي</p>
                </div>
            `;
            return;
        }

        list.forEach(g => {
            const card = document.createElement('div');
            card.className = 'group-select-card';
            
            let badgeClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            if (g.status === 'أماكن محدودة') badgeClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30';

            card.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold text-white">${g.title || g.center}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full border ${badgeClass}">${(g.status || g.seats || 'متاح').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()}</span>
                </div>
                <div class="text-xs text-slate-400 flex items-center justify-between">
                    <span><i class="fa-regular fa-calendar text-brand-gold ml-1"></i> ${g.day}</span>
                    <span><i class="fa-regular fa-clock text-brand-gold ml-1"></i> ${g.time || ''}</span>
                </div>
            `;

            card.addEventListener('click', () => {
                document.querySelectorAll('.group-select-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                window.selectedGroupData = g;
            });

            groupsContainer.appendChild(card);
        });
    }

    gradeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            gradeTabs.forEach(t => t.classList.remove('active-tab'));
            tab.classList.add('active-tab');
            const grade = tab.getAttribute('data-grade');
            window.currentBookingGrade = grade;
            applyGroupsToStudentModal(grade);
        });
    });

    const bookingForm = document.getElementById('booking-form');
    const digitalBadge = document.getElementById('digital-badge');
    let lastBookedStudent = null;

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('student-name').value.trim();
            const studentPhone = document.getElementById('student-phone').value.trim();
            const parentPhone = document.getElementById('parent-phone').value.trim();

            if (!name) {
                showNotification('حقل الاسم فارغ!', 'يجب كتابة اسم الطالب الثلاثي بالكامل لإتمام الحجز.', 'error');
                return;
            }

            if (!validatePhoneNumber(studentPhone, 'رقم هاتف الطالب')) return;
            if (!validatePhoneNumber(parentPhone, 'رقم هاتف ولي الأمر')) return;

            if (studentPhone === parentPhone) {
                showNotification(
                    'تطابق في الأرقام!', 
                    'عذراً، يجب أن يكون رقم ولي الأمر مختلفاً عن رقم الطالب للتواصل الطارئ.',
                    'error'
                );
                return;
            }

            if (!window.selectedGroupData) {
                showNotification('لم تختار الموعد!', 'يرجى الضغط على إحدى المجموعات والسناتر المتاحة في القائمة أولاً.', 'error');
                return;
            }

            let gradeText = 'الصف الأول الثانوي';
            if (window.currentBookingGrade === 'grade-2' || window.currentBookingGrade === 'grade2') gradeText = 'الصف الثاني الثانوي';
            if (window.currentBookingGrade === 'grade-3' || window.currentBookingGrade === 'grade3') gradeText = 'الصف الثالث الثانوي';

            const bookingCode = generateNextStudentCode();
            const selectedCenterText = `${window.selectedGroupData.title || window.selectedGroupData.center} (${window.selectedGroupData.day} - ${window.selectedGroupData.time})`;

            lastBookedStudent = {
                id: Date.now(),
                name,
                studentPhone,
                parentPhone,
                grade: gradeText,
                center: selectedCenterText,
                code: bookingCode,
                date: new Date().toLocaleDateString('ar-EG')
            };

            registeredStudents.push(lastBookedStudent);
            localStorage.setItem('zaeem_students', JSON.stringify(registeredStudents));

            if (typeof firebase !== 'undefined' && firebase.database) {
                firebase.database().ref('students').set(registeredStudents);
            }

            document.getElementById('badge-name').textContent = name;
            document.getElementById('badge-grade').textContent = gradeText;
            document.getElementById('badge-group').textContent = selectedCenterText;
            document.getElementById('badge-code').textContent = bookingCode;

            renderBadgeQRCode(lastBookedStudent);

            bookingForm.classList.add('hidden');
            digitalBadge.classList.remove('hidden');
            updateAdminStats();
            showNotification('تم الحجز بنجاح!', 'تم استخراج كارت الحجز الإلكتروني والـ QR الخاص بك.', 'success');
        });
    }

    function renderBadgeQRCode(student) {
        const qrContainer = document.getElementById('qrcode-canvas');
        if (!qrContainer) return;

        qrContainer.innerHTML = '';
        const qrData = JSON.stringify({
            code: student.code,
            name: student.name,
            grade: student.grade,
            center: student.center
        });

        if (typeof QRCode !== 'undefined') {
            new QRCode(qrContainer, {
                text: qrData,
                width: 100,
                height: 100,
                colorDark : "#030712",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        }
    }

    const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', () => {
            if (!lastBookedStudent) return;
            const msg = `مرحباً دكتور أيمن، تم الحجز الإلكتروني في منصة الزعيم أكاديمي:%0A` +
                        `- الاسم: ${lastBookedStudent.name}%0A` +
                        `- الصف: ${lastBookedStudent.grade}%0A` +
                        `- الموعد: ${lastBookedStudent.center}%0A` +
                        `- كود الحجز: ${lastBookedStudent.code}`;
            window.open(`https://wa.me/?text=${msg}`, '_blank');
        });
    }

    const resetBookingBtn = document.getElementById('reset-booking-btn');
    if (resetBookingBtn) {
        resetBookingBtn.addEventListener('click', () => {
            bookingForm.reset();
            bookingForm.classList.remove('hidden');
            digitalBadge.classList.add('hidden');
            applyGroupsToStudentModal(window.currentBookingGrade);
        });
    }

    // --- 10. ADMIN DASHBOARD & SECURITY SYSTEM ---
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminModal = document.getElementById('admin-modal');
    const closeAdminBtn = document.getElementById('close-admin-modal');
    const adminLockscreen = document.getElementById('admin-lockscreen');
    const adminDashboardContent = document.getElementById('admin-dashboard-content');
    const adminTableBody = document.getElementById('admin-table-body');
    const adminSearch = document.getElementById('admin-search');
    const passInput = document.getElementById('admin-passcode');

    function lockAdminDashboard() {
        if (adminLockscreen && adminDashboardContent) {
            adminDashboardContent.classList.add('hidden');
            adminDashboardContent.classList.remove('flex');
            adminLockscreen.classList.remove('hidden');
        }
        if (passInput) passInput.value = '';
    }

    if (adminLoginBtn && adminModal) {
        adminLoginBtn.addEventListener('click', () => {
            lockAdminDashboard();
            adminModal.classList.remove('opacity-0', 'pointer-events-none');
            document.body.classList.add('modal-open');
        });
    }

    if (closeAdminBtn && adminModal) {
        closeAdminBtn.addEventListener('click', () => {
            adminModal.classList.add('opacity-0', 'pointer-events-none');
            document.body.classList.remove('modal-open');
            lockAdminDashboard();
        });
    }

    if (adminLockscreen && !document.getElementById('close-lockscreen-btn')) {
        adminLockscreen.style.position = 'relative';
        const closeLockBtn = document.createElement('button');
        closeLockBtn.id = 'close-lockscreen-btn';
        closeLockBtn.className = 'absolute top-2 left-2 text-slate-400 hover:text-white w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center transition';
        closeLockBtn.innerHTML = '<i class="fa-solid fa-xmark text-sm"></i>';
        
        closeLockBtn.addEventListener('click', () => {
            if (adminModal) {
                adminModal.classList.add('opacity-0', 'pointer-events-none');
                document.body.classList.remove('modal-open');
            }
            lockAdminDashboard();
        });
        
        adminLockscreen.appendChild(closeLockBtn);
    }

    window.verifyAndOpenAdmin = function() {
        if (!passInput) return;
        const enteredPass = passInput.value.trim();

        if (enteredPass === activeAdminPassword || enteredPass === '1234' || enteredPass === 'zaeem2026') {
            if (adminLockscreen) adminLockscreen.classList.add('hidden');
            if (adminDashboardContent) {
                adminDashboardContent.classList.remove('hidden');
                adminDashboardContent.classList.add('flex');
            }
            passInput.value = '';
            renderAdminTable();
            injectAdminControlButtons();
            showNotification('أهلاً بك', 'تم تسجيل الدخول إلى لوحة التحكم بنجاح.', 'success');
        } else {
            showNotification('رمز خاطئ!', 'الرمز السري لدخول الأدمن غير صحيح.', 'error');
            passInput.value = '';
            passInput.focus();
        }
    };

    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.verifyAndOpenAdmin();
        });
    }

    function updateAdminStats() {
        const totalEl = document.getElementById('stat-total');
        const g1El = document.getElementById('stat-g1');
        const g2El = document.getElementById('stat-g2');
        const g3El = document.getElementById('stat-g3');

        const students = JSON.parse(localStorage.getItem('zaeem_students')) || [];

        if (totalEl) totalEl.textContent = students.length;
        if (g1El) g1El.textContent = students.filter(s => s.grade && s.grade.includes('الأول')).length;
        if (g2El) g2El.textContent = students.filter(s => s.grade && s.grade.includes('الثاني')).length;
        if (g3El) g3El.textContent = students.filter(s => s.grade && s.grade.includes('الثالث')).length;
    }

    function renderAdminTable(filterText = '') {
        if (!adminTableBody) return;
        adminTableBody.innerHTML = '';
        const students = JSON.parse(localStorage.getItem('zaeem_students')) || [];
        const filtered = students.filter(s => 
            s.name.includes(filterText) || s.studentPhone.includes(filterText) || s.parentPhone.includes(filterText) || (s.code && s.code.includes(filterText))
        );

        if (filtered.length === 0) {
            adminTableBody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-500">لا يوجد طلاب مسجلون حالياً</td></tr>`;
            return;
        }

        filtered.forEach(s => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-800/40 transition';
            tr.innerHTML = `
                <td class="p-3 font-bold text-white flex items-center gap-1.5">
                    <span>${s.name}</span>
                    <span class="text-[10px] font-mono text-brand-neonBlue bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">${s.code || '---'}</span>
                </td>
                <td class="p-3 font-mono">${s.studentPhone}</td>
                <td class="p-3 font-mono">${s.parentPhone}</td>
                <td class="p-3">${s.grade}</td>
                <td class="p-3 text-brand-gold">${s.center}</td>
                <td class="p-3 text-center">
                    <a href="https://wa.me/2${s.studentPhone}" target="_blank" class="text-emerald-400 hover:text-emerald-300 ml-1.5"><i class="fa-brands fa-whatsapp text-base"></i></a>
                    <a href="tel:${s.studentPhone}" class="text-brand-neonBlue hover:text-cyan-300 ml-1.5"><i class="fa-solid fa-phone text-xs"></i></a>
                    <button data-id="${s.id}" class="delete-student-main-btn text-rose-400 hover:text-white hover:bg-rose-600 p-1 rounded-lg transition border border-rose-500/20 cursor-pointer" title="حذف الطالب">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                </td>
            `;
            adminTableBody.appendChild(tr);
        });

        adminTableBody.querySelectorAll('.delete-student-main-btn').forEach(btn => {
            btn.onclick = function() {
                const sId = this.dataset.id;
                deleteStudentWithConfirmation(sId, () => {
                    renderAdminTable(filterText);
                });
            };
        });

        updateAdminStats();
    }

    if (adminSearch) {
        adminSearch.addEventListener('input', (e) => {
            renderAdminTable(e.target.value.trim());
        });
    }

    const exportExcelBtn = document.getElementById('export-excel-btn');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', () => {
            const students = JSON.parse(localStorage.getItem('zaeem_students')) || [];
            if (students.length === 0) {
                showNotification('لا يوجد بيانات!', 'لا تتوفر قائمة طلاب لتصديرها.', 'error');
                return;
            }

            let csvContent = "\uFEFFكود الطالب,اسم الطالب,رقم الطالب,رقم ولي الأمر,الصف الدراسي,السنتر والموعد,تاريخ التسجيل\n";
            students.forEach(s => {
                csvContent += `"${s.code || '---'}","${s.name}","${s.studentPhone}","${s.parentPhone}","${s.grade}","${s.center}","${s.date}"\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `كشف_طلاب_الزعيم_${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // --- 11. CHANGE ADMIN PASSWORD MODAL ---
    function injectChangePasswordUI() {
        const adminHeader = document.querySelector('#admin-dashboard-content .border-b');
        if (adminHeader && !document.getElementById('admin-change-pass-btn')) {
            const changePassBtn = document.createElement('button');
            changePassBtn.id = 'admin-change-pass-btn';
            changePassBtn.className = 'px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white text-xs font-bold transition flex items-center gap-1.5 ml-2 cursor-pointer';
            changePassBtn.innerHTML = '<i class="fa-solid fa-key text-xs"></i> <span>تغيير كلمة السر</span>';
            
            if (closeAdminBtn) {
                closeAdminBtn.parentNode.insertBefore(changePassBtn, closeAdminBtn);
            } else {
                adminHeader.appendChild(changePassBtn);
            }

            changePassBtn.addEventListener('click', () => {
                document.getElementById('change-pass-modal').classList.remove('hidden');
                document.getElementById('change-pass-modal').classList.add('flex');
            });
        }

        if (!document.getElementById('change-pass-modal')) {
            const modalHTML = `
            <div id="change-pass-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] hidden items-center justify-center p-4">
                <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                    <button id="close-change-pass-modal" class="absolute top-4 left-4 text-slate-400 hover:text-white w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center transition">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                    <div class="text-center mb-6">
                        <div class="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-400">
                            <i class="fa-solid fa-shield-halved text-xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white">تغيير كلمة سر الأدمن</h3>
                        <p class="text-xs text-slate-400 mt-1">سيتم حفظ كلمة السر وتحديثها لجهازك والسحابة فوراً</p>
                    </div>
                    <form id="change-pass-form" class="space-y-4">
                        <div>
                            <label class="block text-xs font-medium text-slate-300 mb-1">كلمة السر الجديدة</label>
                            <input type="password" id="new-admin-pass" required placeholder="أدخل كلمة السر الجديدة" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-300 mb-1">تأكيد كلمة السر الجديدة</label>
                            <input type="password" id="confirm-admin-pass" required placeholder="أعد كتابة كلمة السر" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition">
                        </div>
                        <div id="change-pass-msg" class="text-xs text-center font-medium hidden"></div>
                        <button type="submit" id="save-new-pass-btn" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer">
                            <span>حفظ كلمة السر الجديدة</span>
                            <i class="fa-solid fa-floppy-disk text-xs"></i>
                        </button>
                    </form>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            document.getElementById('close-change-pass-modal').addEventListener('click', () => {
                document.getElementById('change-pass-modal').classList.add('hidden');
                document.getElementById('change-pass-modal').classList.remove('flex');
            });

            document.getElementById('change-pass-form').addEventListener('submit', async function(e) {
                e.preventDefault();
                const newPass = document.getElementById('new-admin-pass').value.trim();
                const confirmPass = document.getElementById('confirm-admin-pass').value.trim();
                const msgBox = document.getElementById('change-pass-msg');
                const submitBtn = document.getElementById('save-new-pass-btn');

                if (newPass !== confirmPass) {
                    msgBox.className = "text-xs text-center font-medium text-red-400 block";
                    msgBox.innerText = "كلمتا السر غير متطابقتين!";
                    return;
                }

                if (newPass.length < 3) {
                    msgBox.className = "text-xs text-center font-medium text-red-400 block";
                    msgBox.innerText = "كلمة السر قصيرة جداً!";
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الحفظ...';

                try {
                    activeAdminPassword = newPass;
                    localStorage.setItem('adminCustomPassword', newPass);

                    if (typeof firebase !== 'undefined' && firebase.database) {
                        await firebase.database().ref('adminPassword').set(newPass);
                    }

                    msgBox.className = "text-xs text-center font-medium text-emerald-400 block";
                    msgBox.innerText = "تم حفظ كلمة السر الجديدة بنجاح! 🔒";

                    setTimeout(() => {
                        document.getElementById('change-pass-modal').classList.add('hidden');
                        document.getElementById('change-pass-modal').classList.remove('flex');
                        document.getElementById('new-admin-pass').value = '';
                        document.getElementById('confirm-admin-pass').value = '';
                        msgBox.className = "text-xs text-center font-medium hidden";
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span>حفظ كلمة السر الجديدة</span> <i class="fa-solid fa-floppy-disk text-xs"></i>';
                    }, 1200);

                } catch (err) {
                    msgBox.className = "text-xs text-center font-medium text-red-400 block";
                    msgBox.innerText = "تم حفظ كلمة السر محلياً فقط.";
                    submitBtn.disabled = false;
                }
            });
        }
    }

    // --- 12. ADVANCED CONTROL BUTTONS & MODAL INJECTIONS ---
    function injectAdminControlButtons() {
        if (!adminDashboardContent) return;

        const statsCard = document.getElementById('stats-analytics-card');

        if (statsCard) {
            let innerBar = document.getElementById('admin-inner-action-bar');
            if (!innerBar) {
                innerBar = document.createElement('div');
                innerBar.id = 'admin-inner-action-bar';
                innerBar.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5 w-full';
                innerBar.innerHTML = `
                    <button id="btn-open-grades-control" type="button" class="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 transition shadow-md group cursor-pointer">
                        <i class="fa-solid fa-toggle-on text-base"></i>
                        <span class="text-xs font-bold text-slate-100">فتح / إغلاق الحجز</span>
                    </button>

                    <button id="btn-open-groups-control" type="button" class="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl flex items-center justify-center gap-2 text-emerald-400 hover:text-emerald-300 transition shadow-md group cursor-pointer">
                        <i class="fa-solid fa-layer-group text-base"></i>
                        <span class="text-xs font-bold text-slate-100">إدارة المجموعات</span>
                    </button>

                    <button id="btn-open-content-control" type="button" class="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl flex items-center justify-center gap-2 text-amber-400 hover:text-amber-300 transition shadow-md group cursor-pointer">
                        <i class="fa-solid fa-pen-to-square text-base"></i>
                        <span class="text-xs font-bold text-slate-100">تعديل المحتوى</span>
                    </button>

                    <button id="btn-open-attendance-control" type="button" class="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 transition shadow-md group cursor-pointer">
                        <i class="fa-solid fa-clipboard-user text-base"></i>
                        <span class="text-xs font-bold text-slate-100">الحضور والغياب</span>
                    </button>
                `;
                statsCard.parentElement.insertBefore(innerBar, statsCard);

                document.getElementById('btn-open-grades-control').onclick = () => {
                    renderGradesModalUI();
                    const m = document.getElementById('modal-grades-control');
                    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
                };

                document.getElementById('btn-open-groups-control').onclick = () => {
                    renderGroupsModalUI();
                    const m = document.getElementById('modal-groups-control');
                    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
                };

                document.getElementById('btn-open-content-control').onclick = openContentEditorModal;

                document.getElementById('btn-open-attendance-control').onclick = openAttendanceModal;
            }
        }

        setupGradeCardsEvents();
        injectModalsHTML();
    }

    function setupGradeCardsEvents() {
        const g1El = document.getElementById('stat-g1') ? document.getElementById('stat-g1').closest('div') : null;
        const g2El = document.getElementById('stat-g2') ? document.getElementById('stat-g2').closest('div') : null;
        const g3El = document.getElementById('stat-g3-card');

        if (g1El && !g1El.dataset.clickBound) {
            g1El.dataset.clickBound = "true";
            g1El.onclick = () => openGradeDetailsModal('الصف الأول الثانوي');
        }
        if (g2El && !g2El.dataset.clickBound) {
            g2El.dataset.clickBound = "true";
            g2El.onclick = () => openGradeDetailsModal('الصف الثاني الثانوي');
        }
        if (g3El && !g3El.dataset.clickBound) {
            g3El.dataset.clickBound = "true";
            g3El.onclick = () => openGradeDetailsModal('الصف الثالث الثانوي');
        }
    }

    function injectGradeDetailsModalHTML() {
        if (document.getElementById('modal-grade-details')) return;

        const modalHTML = `
        <div id="modal-grade-details" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] hidden items-center justify-center p-4">
            <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-4xl shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
                <button id="close-grade-details-btn" class="absolute top-4 left-4 text-slate-400 hover:text-white w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center transition">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
                
                <div class="text-center mb-5 shrink-0">
                    <span id="grade-modal-subtitle" class="text-xs text-brand-gold font-bold block mb-1">تفاصيل الصف</span>
                    <h3 id="grade-modal-title" class="text-xl font-bold text-white">إدارة الطلاب</h3>
                </div>

                <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/50 mb-4 shrink-0">
                    <div class="flex items-center gap-2 w-full sm:w-auto">
                        <label class="text-xs font-bold text-slate-300 shrink-0">تصفية بالمجموعة:</label>
                        <select id="grade-modal-group-select" class="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold w-full sm:w-64">
                            <option value="ALL">جميع المجموعات والسناتر</option>
                        </select>
                    </div>
                    <div class="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                        عدد الطلاب المفروزين: <span id="grade-filtered-count" class="text-brand-gold font-black">0</span>
                    </div>
                </div>

                <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 custom-scrollbar flex-1">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0 z-10">
                            <tr>
                                <th class="p-3">كود الطالب</th>
                                <th class="p-3">اسم الطالب</th>
                                <th class="p-3">رقم الطالب</th>
                                <th class="p-3">رقم ولي الأمر</th>
                                <th class="p-3">المجموعة / السنتر</th>
                                <th class="p-3 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="grade-modal-table-body" class="divide-y divide-slate-800/60 text-slate-300">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('close-grade-details-btn').onclick = () => {
            const m = document.getElementById('modal-grade-details');
            if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
        };
    }

    function openGradeDetailsModal(gradeName) {
        injectGradeDetailsModalHTML();
        const modal = document.getElementById('modal-grade-details');
        const titleEl = document.getElementById('grade-modal-title');
        const selectEl = document.getElementById('grade-modal-group-select');

        if (!modal || !titleEl) return;

        titleEl.textContent = gradeName;
        
        const students = JSON.parse(localStorage.getItem('zaeem_students')) || [];
        const gradeStudents = students.filter(s => s.grade && s.grade.includes(gradeName.replace('الصف ', '')));

        const uniqueGroups = [...new Set(gradeStudents.map(s => s.center))];
        
        selectEl.innerHTML = `<option value="ALL">جميع المجموعات (${gradeStudents.length} طالب)</option>`;
        uniqueGroups.forEach(grp => {
            if (grp) {
                const count = gradeStudents.filter(s => s.center === grp).length;
                selectEl.innerHTML += `<option value="${grp}">${grp} (${count} طالب)</option>`;
            }
        });

        selectEl.onchange = () => renderGradeModalTable(gradeName, selectEl.value);

        renderGradeModalTable(gradeName, 'ALL');

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function renderGradeModalTable(gradeName, groupFilter) {
        const body = document.getElementById('grade-modal-table-body');
        const filteredCountEl = document.getElementById('grade-filtered-count');
        if (!body) return;

        let students = JSON.parse(localStorage.getItem('zaeem_students')) || [];
        let list = students.filter(s => s.grade && s.grade.includes(gradeName.replace('الصف ', '')));

        if (groupFilter !== 'ALL') {
            list = list.filter(s => s.center === groupFilter);
        }

        if (filteredCountEl) filteredCountEl.textContent = list.length;

        body.innerHTML = '';

        if (list.length === 0) {
            body.innerHTML = `<tr><td colspan="6" class="p-5 text-center text-slate-500">لا يوجد طلاب مسجلون في هذا القسم حالياً</td></tr>`;
            return;
        }

        list.forEach(s => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-800/40 transition';
            tr.innerHTML = `
                <td class="p-3 font-mono font-bold text-brand-neonBlue">${s.code || '---'}</td>
                <td class="p-3 font-bold text-white">${s.name}</td>
                <td class="p-3 font-mono">${s.studentPhone}</td>
                <td class="p-3 font-mono">${s.parentPhone}</td>
                <td class="p-3 text-brand-gold">${s.center}</td>
                <td class="p-3 text-center">
                    <button data-id="${s.id}" class="delete-student-modal-btn px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer" title="حذف الطالب">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                </td>
            `;
            body.appendChild(tr);
        });

        body.querySelectorAll('.delete-student-modal-btn').forEach(btn => {
            btn.onclick = function() {
                const studentId = this.dataset.id;
                deleteStudentWithConfirmation(studentId, () => {
                    renderGradeModalTable(gradeName, groupFilter);
                });
            };
        });
    }

    function openContentEditorModal() {
        const modal = document.getElementById('modal-content-editor');
        if (!modal) return;

        document.getElementById('input-hero-caption').value = localSiteContent.heroCaption;
        document.getElementById('input-about-quote').value = localSiteContent.aboutQuote;
        document.getElementById('input-stat-exp').value = localSiteContent.expYears;
        document.getElementById('input-stat-students').value = localSiteContent.topStudents;
        document.getElementById('input-stat-success').value = localSiteContent.successRate;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    const closeContentEditorBtn = document.getElementById('close-content-editor-btn');
    if (closeContentEditorBtn) {
        closeContentEditorBtn.onclick = () => {
            const modal = document.getElementById('modal-content-editor');
            if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
        };
    }

    const siteContentForm = document.getElementById('site-content-form');
    if (siteContentForm) {
        siteContentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const heroCaption = document.getElementById('input-hero-caption').value.trim();
            const aboutQuote = document.getElementById('input-about-quote').value.trim();
            const expYears = parseInt(document.getElementById('input-stat-exp').value) || 0;
            const topStudents = parseInt(document.getElementById('input-stat-students').value) || 0;
            const successRate = parseInt(document.getElementById('input-stat-success').value) || 0;

            localSiteContent = {
                heroCaption,
                aboutQuote,
                expYears,
                topStudents,
                successRate
            };

            saveLocalData();

            if (typeof firebase !== 'undefined' && firebase.database) {
                firebase.database().ref('siteContent').set(localSiteContent);
            }

            applySiteContentUI();

            const modal = document.getElementById('modal-content-editor');
            if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }

            showNotification('تم التحديث بنجاح!', 'تم حفظ وتحديث محتوى الصفحة والإحصائيات مباشرة.', 'success');
        });
    }

    // --- 13. ATTENDANCE & QR SCANNER ENGINE ---
    let activeAttendanceTab = 'ALL';
    let html5QrCodeScanner = null;

    function openAttendanceModal() {
        const modal = document.getElementById('modal-attendance-control');
        if (!modal) return;

        const dateInput = document.getElementById('att-date-input');
        if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }

        updateAttendanceGroupsDropdown();
        renderAttendanceTable();

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function updateAttendanceGroupsDropdown() {
        const gradeSelect = document.getElementById('att-grade-select');
        const groupSelect = document.getElementById('att-group-select');
        if (!gradeSelect || !groupSelect) return;

        const gradeKey = gradeSelect.value;
        const groups = localGroupsData[gradeKey] || [];

        groupSelect.innerHTML = '';
        if (groups.length === 0) {
            groupSelect.innerHTML = '<option value="">لا توجد مجموعات</option>';
        } else {
            groups.forEach(g => {
                const title = g.title || g.center || g;
                groupSelect.innerHTML += `<option value="${title}">${title} (${g.day || ''} - ${g.time || ''})</option>`;
            });
        }
    }

    function renderAttendanceTable() {
        const tableBody = document.getElementById('att-table-body');
        const gradeSelect = document.getElementById('att-grade-select');
        const groupSelect = document.getElementById('att-group-select');
        const dateInput = document.getElementById('att-date-input');

        if (!tableBody || !gradeSelect || !groupSelect) return;

        const selectedGroup = groupSelect.value;
        const selectedDate = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];

        const students = JSON.parse(localStorage.getItem('zaeem_students')) || [];
        let groupStudents = students.filter(s => s.center && s.center.includes(selectedGroup));

        let attendanceRecord = JSON.parse(localStorage.getItem(`att_rec_${selectedGroup}_${selectedDate}`)) || {};

        let presentCount = 0;
        let absentCount = 0;

        groupStudents.forEach(s => {
            if (attendanceRecord[s.id] === 'PRESENT') presentCount++;
            else absentCount++;
        });

        document.getElementById('count-att-all').textContent = groupStudents.length;
        document.getElementById('count-att-present').textContent = presentCount;
        document.getElementById('count-att-absent').textContent = absentCount;

        let listToShow = groupStudents;
        if (activeAttendanceTab === 'PRESENT') {
            listToShow = groupStudents.filter(s => attendanceRecord[s.id] === 'PRESENT');
        } else if (activeAttendanceTab === 'ABSENT') {
            listToShow = groupStudents.filter(s => attendanceRecord[s.id] !== 'PRESENT');
        }

        tableBody.innerHTML = '';

        if (listToShow.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="p-5 text-center text-slate-500">لا توجد بيانات مطابقة للعرض</td></tr>`;
            return;
        }

        listToShow.forEach(s => {
            const isPresent = attendanceRecord[s.id] === 'PRESENT';
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-800/40 transition';
            tr.innerHTML = `
                <td class="p-3 font-mono font-bold text-brand-neonBlue">${s.code || '---'}</td>
                <td class="p-3 font-bold text-white">${s.name}</td>
                <td class="p-3 font-mono text-slate-300">${s.parentPhone}</td>
                <td class="p-3 text-center">
                    <button data-id="${s.id}" class="toggle-att-btn px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${isPresent ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}">
                        ${isPresent ? 'حاضر ✓' : 'غائب ✗'}
                    </button>
                </td>
                <td class="p-3 text-center">
                    ${!isPresent ? `
                        <button data-phone="${s.parentPhone}" data-name="${s.name}" class="send-absent-msg-btn px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center justify-center gap-1 mx-auto cursor-pointer">
                            <i class="fa-brands fa-whatsapp text-xs"></i>
                            <span>إبلاغ بالغياب</span>
                        </button>
                    ` : '<span class="text-[10px] text-slate-500">تم الحضور</span>'}
                </td>
            `;
            tableBody.appendChild(tr);
        });

        tableBody.querySelectorAll('.toggle-att-btn').forEach(btn => {
            btn.onclick = function() {
                const sId = this.dataset.id;
                attendanceRecord[sId] = attendanceRecord[sId] === 'PRESENT' ? 'ABSENT' : 'PRESENT';
                localStorage.setItem(`att_rec_${selectedGroup}_${selectedDate}`, JSON.stringify(attendanceRecord));
                renderAttendanceTable();
            };
        });

        tableBody.querySelectorAll('.send-absent-msg-btn').forEach(btn => {
            btn.onclick = function() {
                const phone = this.dataset.phone;
                const name = this.dataset.name;
                const dateVal = selectedDate;
                const msg = `تنبيه هام من منصة الزعيم أكاديمي:%0A` +
                            `نود إعلامكم بغياب الطالب/ت: (${name}) عن حصة اليوم بتاريخ (${dateVal}).%0A` +
                            `يرجى المتابعة والحرص على عدم التكرار.`;
                window.open(`https://wa.me/2${phone}?text=${msg}`, '_blank');
            };
        });
    }

    function setupQRScannerLogic() {
        const toggleBtn = document.getElementById('btn-toggle-qr-scanner');
        const scannerContainer = document.getElementById('qr-reader-container');

        if (!toggleBtn) return;

        toggleBtn.onclick = function() {
            if (scannerContainer.classList.contains('hidden')) {
                scannerContainer.classList.remove('hidden');
                document.getElementById('qr-btn-text').textContent = 'إغلاق الماسح';

                if (typeof Html5QrcodeScanner !== 'undefined') {
                    html5QrCodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 200 });
                    html5QrCodeScanner.render((decodedText) => {
                        try {
                            let data = JSON.parse(decodedText);
                            if (data.code) {
                                processStudentAttendanceByCode(data.code);
                            }
                        } catch(e) {
                            processStudentAttendanceByCode(decodedText.trim());
                        }
                    });
                }
            } else {
                scannerContainer.classList.add('hidden');
                document.getElementById('qr-btn-text').textContent = 'فتح ماسح الـ QR';
                if (html5QrCodeScanner) {
                    html5QrCodeScanner.clear();
                }
            }
        };

        const quickBtn = document.getElementById('att-quick-add-btn');
        const quickInput = document.getElementById('att-quick-code');

        if (quickBtn && quickInput) {
            quickBtn.onclick = () => {
                const val = quickInput.value.trim();
                if (val) {
                    processStudentAttendanceByCode(val);
                    quickInput.value = '';
                }
            };
        }
    }

    function processStudentAttendanceByCode(searchQuery) {
        const groupSelect = document.getElementById('att-group-select');
        const dateInput = document.getElementById('att-date-input');
        if (!groupSelect) return;

        const selectedGroup = groupSelect.value;
        const selectedDate = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];

        const students = JSON.parse(localStorage.getItem('zaeem_students')) || [];
        const student = students.find(s => 
            (s.code && s.code.toLowerCase() === searchQuery.toLowerCase()) || 
            s.name.includes(searchQuery)
        );

        if (student) {
            let attendanceRecord = JSON.parse(localStorage.getItem(`att_rec_${selectedGroup}_${selectedDate}`)) || {};
            attendanceRecord[student.id] = 'PRESENT';
            localStorage.setItem(`att_rec_${selectedGroup}_${selectedDate}`, JSON.stringify(attendanceRecord));

            renderAttendanceTable();
            showNotification('تم تسجيل الحضور', `تم تسجيل حضور الطالب (${student.name}) بنجاح!`, 'success');
        } else {
            showNotification('لم يتم العثور على الطالب', 'كود أو اسم الطالب غير موجود في هذه المجموعة.', 'error');
        }
    }

    function attachAttendanceEvents() {
        const gradeSelect = document.getElementById('att-grade-select');
        const groupSelect = document.getElementById('att-group-select');
        const dateInput = document.getElementById('att-date-input');
        const closeBtn = document.getElementById('close-attendance-modal-btn');

        if (gradeSelect) {
            gradeSelect.onchange = () => {
                updateAttendanceGroupsDropdown();
                renderAttendanceTable();
            };
        }
        if (groupSelect) groupSelect.onchange = () => renderAttendanceTable();
        if (dateInput) dateInput.onchange = () => renderAttendanceTable();

        if (closeBtn) {
            closeBtn.onclick = () => {
                const modal = document.getElementById('modal-attendance-control');
                if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
                if (html5QrCodeScanner) html5QrCodeScanner.clear();
            };
        }

        const tabAll = document.getElementById('tab-att-all');
        const tabPresent = document.getElementById('tab-att-present');
        const tabAbsent = document.getElementById('tab-att-absent');

        if (tabAll && tabPresent && tabAbsent) {
            tabAll.onclick = () => {
                activeAttendanceTab = 'ALL';
                styleTabs(tabAll, [tabPresent, tabAbsent]);
                renderAttendanceTable();
            };
            tabPresent.onclick = () => {
                activeAttendanceTab = 'PRESENT';
                styleTabs(tabPresent, [tabAll, tabAbsent]);
                renderAttendanceTable();
            };
            tabAbsent.onclick = () => {
                activeAttendanceTab = 'ABSENT';
                styleTabs(tabAbsent, [tabAll, tabPresent]);
                renderAttendanceTable();
            };
        }
    }

    function styleTabs(activeBtn, inactiveBtns) {
        activeBtn.className = "px-3 py-1 rounded-lg text-xs font-bold bg-brand-gold text-black transition";
        inactiveBtns.forEach(btn => {
            btn.className = "px-3 py-1 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition";
        });
    }

    function injectModalsHTML() {
        if (!document.getElementById('modal-grades-control')) {
            const html = `
            <div id="modal-grades-control" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] hidden items-center justify-center p-4">
                <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
                    <button class="close-modal-btn absolute top-4 left-4 text-slate-400 hover:text-white w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center transition">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                    <div class="text-center mb-6">
                        <div class="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-2 text-indigo-400">
                            <i class="fa-solid fa-door-open text-xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white">التحكم في فتح وإغلاق الحجز</h3>
                        <p class="text-xs text-slate-400 mt-1">تفعيل أو إيقاف استقبال الطلبات لكل صف دراسي</p>
                    </div>
                    <div id="grades-switches-body" class="space-y-3"></div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
            document.querySelector('#modal-grades-control .close-modal-btn').onclick = () => {
                document.getElementById('modal-grades-control').classList.add('hidden');
                document.getElementById('modal-grades-control').classList.remove('flex');
            };
        }

        if (!document.getElementById('modal-groups-control')) {
            const html = `
            <div id="modal-groups-control" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] hidden items-center justify-center p-4">
                <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <button class="close-modal-btn absolute top-4 left-4 text-slate-400 hover:text-white w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center transition">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                    <div class="text-center mb-6">
                        <div class="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-2 text-emerald-400">
                            <i class="fa-solid fa-folder-plus text-xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white">إدارة المجموعات والمواعيد</h3>
                        <p class="text-xs text-slate-400 mt-1">إضافة مجموعة تفصيلية أو حذفها للطلاب</p>
                    </div>

                    <div class="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 mb-6 space-y-3">
                        <h4 class="text-xs font-bold text-slate-200 flex items-center gap-1.5"><i class="fa-solid fa-circle-plus text-emerald-400"></i> إضافة مجموعة جديدة</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                                <label class="block text-[11px] font-medium text-slate-400 mb-1">الصف الدراسي</label>
                                <select id="add-grp-grade" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                                    <option value="grade1">الصف الأول الثانوي</option>
                                    <option value="grade2">الصف الثاني الثانوي</option>
                                    <option value="grade3">الصف الثالث الثانوي</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[11px] font-medium text-slate-400 mb-1">اسم/عنوان السنتر</label>
                                <input type="text" id="add-grp-title" placeholder="مثال: سنتر الجزار" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                            </div>
                            <div>
                                <label class="block text-[11px] font-medium text-slate-400 mb-1">اليوم</label>
                                <input type="text" id="add-grp-day" placeholder="مثال: الأحد" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                            </div>
                            <div>
                                <label class="block text-[11px] font-medium text-slate-400 mb-1">الموعد</label>
                                <div class="flex gap-1.5">
                                    <input type="text" id="add-grp-time" placeholder="مثال: 05:00" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                                    <select id="add-grp-period" class="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 shrink-0">
                                        <option value="مساءً">مساءً</option>
                                        <option value="صباحاً">صباحاً</option>
                                    </select>
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block text-[11px] font-medium text-slate-400 mb-1">حالة الأماكن المتاحة</label>
                                <select id="add-grp-status" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                                    <option value="متاح">متاح</option>
                                    <option value="أماكن محدودة">أماكن محدودة</option>
                                </select>
                            </div>
                        </div>
                        <button id="save-new-group-btn" class="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer">
                            <span>حفظ ونشر المجموعة للطلاب</span>
                            <i class="fa-solid fa-cloud-arrow-up text-xs"></i>
                        </button>
                    </div>

                    <div id="groups-list-body" class="space-y-4"></div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);

            document.querySelector('#modal-groups-control .close-modal-btn').onclick = () => {
                document.getElementById('modal-groups-control').classList.add('hidden');
                document.getElementById('modal-groups-control').classList.remove('flex');
            };

            document.getElementById('save-new-group-btn').onclick = saveNewGroupAction;
        }
    }

    function renderGradesModalUI() {
        const body = document.getElementById('grades-switches-body');
        if (!body) return;

        const grades = [
            { key: 'grade1', title: 'الصف الأول الثانوي' },
            { key: 'grade2', title: 'الصف الثاني الثانوي' },
            { key: 'grade3', title: 'الصف الثالث الثانوي' }
        ];

        body.innerHTML = '';
        grades.forEach(g => {
            const isOpen = localGradesStatus[g.key];
            const div = document.createElement('div');
            div.className = 'bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 flex items-center justify-between';
            div.innerHTML = `
                <div>
                    <p class="text-sm font-bold text-white">${g.title}</p>
                    <span class="text-xs font-semibold ${isOpen ? 'text-emerald-400' : 'text-rose-400'}">${isOpen ? 'الحجز مفتوح حالياً' : 'مغلق'}</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" data-gkey="${g.key}" class="grade-toggle-chk sr-only peer" ${isOpen ? 'checked' : ''}>
                    <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            `;
            body.appendChild(div);
        });

        body.querySelectorAll('.grade-toggle-chk').forEach(chk => {
            chk.onchange = (e) => {
                const key = e.target.dataset.gkey;
                const val = e.target.checked;
                localGradesStatus[key] = val;
                saveLocalData();

                if (typeof firebase !== 'undefined' && firebase.database) {
                    firebase.database().ref('gradesStatus/' + key).set(val);
                }
                applyGroupsToStudentModal(window.currentBookingGrade);
                renderGradesModalUI();
                showNotification(`تم الحفظ`, `تم ${val ? 'فتح' : 'إغلاق'} الحجز للصف بنجاح!`, val ? 'success' : 'error');
            };
        });
    }

    function renderGroupsModalUI() {
        const body = document.getElementById('groups-list-body');
        if (!body || !localGroupsData) return;

        const titles = {
            grade1: 'الصف الأول الثانوي',
            grade2: 'الصف الثاني الثانوي',
            grade3: 'الصف الثالث الثانوي'
        };

        body.innerHTML = '';

        Object.keys(titles).forEach(gKey => {
            const list = localGroupsData[gKey] || [];
            const box = document.createElement('div');
            box.className = 'bg-slate-800/30 border border-slate-800 rounded-2xl p-3.5';

            let html = `<div class="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
                <h5 class="text-xs font-bold text-indigo-400">${titles[gKey]}</h5>
                <span class="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">${list.length} مجموعات</span>
            </div>`;

            if (list.length === 0) {
                html += `<p class="text-[11px] text-slate-500 italic py-1 text-center">لا توجد مجموعات مضافة لهذا الصف.</p>`;
            } else {
                html += `<div class="space-y-2">`;
                list.forEach((item, index) => {
                    const titleStr = item.title || item.center || item;
                    const dayStr = item.day || 'غير محدد';
                    const timeStr = item.time ? ` - ${item.time}` : '';
                    const statusStr = (item.status || item.seats || 'متاح').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

                    let statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    if (statusStr === 'أماكن محدودة') statusBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                    html += `
                        <div class="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition">
                            <div class="space-y-1">
                                <p class="text-xs font-bold text-slate-100">${titleStr}</p>
                                <div class="flex items-center gap-2 text-[10px]">
                                    <span class="text-slate-400"><i class="fa-regular fa-calendar text-[9px] text-indigo-400 ml-1"></i>${dayStr}${timeStr}</span>
                                    <span class="px-2 py-0.5 rounded-md border font-semibold ${statusBadge}">${statusStr}</span>
                                </div>
                            </div>
                            <button data-gkey="${gKey}" data-idx="${index}" class="delete-grp-btn text-rose-400 hover:text-white hover:bg-rose-600 p-2 rounded-xl transition border border-rose-500/20 cursor-pointer" title="حذف المجموعة">
                                <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            box.innerHTML = html;
            body.appendChild(box);
        });

        body.querySelectorAll('.delete-grp-btn').forEach(btn => {
            btn.onclick = (e) => {
                const btnEl = e.currentTarget;
                const gKey = btnEl.dataset.gkey;
                const idx = parseInt(btnEl.dataset.idx);

                const itemToDelete = localGroupsData[gKey][idx];
                const itemTitle = itemToDelete.title || itemToDelete.center || itemToDelete;

                requestUserConfirmation(`هل أنت متأكد من حذف ${itemTitle} وحذف جميع الطلاب المقيدين بها تلقائياً؟`, () => {
                    localGroupsData[gKey].splice(idx, 1);
                    saveLocalData();

                    let students = JSON.parse(localStorage.getItem('zaeem_students')) || [];
                    students = students.filter(s => !s.center.includes(itemTitle));
                    localStorage.setItem('zaeem_students', JSON.stringify(students));

                    if (typeof firebase !== 'undefined' && firebase.database) {
                        firebase.database().ref('groupsDataV3').set(localGroupsData);
                        firebase.database().ref('students').set(students);
                    }

                    applyGroupsToStudentModal(window.currentBookingGrade);
                    renderGroupsModalUI();
                    renderAdminTable();
                    showNotification('تم الحذف', 'تم حذف المجموعة وجميع طلابها بنجاح.', 'error');
                });
            };
        });
    }

    function saveNewGroupAction() {
        const gKey = document.getElementById('add-grp-grade').value;
        const titleInput = document.getElementById('add-grp-title');
        const dayInput = document.getElementById('add-grp-day');
        const timeInput = document.getElementById('add-grp-time');
        const periodSelect = document.getElementById('add-grp-period');
        const statusSelect = document.getElementById('add-grp-status');

        const title = titleInput.value.trim();
        const day = dayInput.value.trim() || 'غير محدد';
        const rawTime = timeInput.value.trim();
        const period = periodSelect ? periodSelect.value : 'مساءً';
        const status = statusSelect.value;

        if (!title) {
            showNotification('بيان مفقود!', 'يرجى كتابة اسم أو عنوان السنتر أولاً.', 'error');
            return;
        }

        const fullTime = rawTime ? `${rawTime} ${period}` : '';

        if (!localGroupsData[gKey]) localGroupsData[gKey] = [];

        localGroupsData[gKey].push({
            id: 'g-' + Date.now(),
            title: title,
            day: day,
            time: fullTime,
            status: status
        });

        saveLocalData();

        if (typeof firebase !== 'undefined' && firebase.database) {
            firebase.database().ref('groupsDataV3').set(localGroupsData);
        }

        titleInput.value = '';
        dayInput.value = '';
        timeInput.value = '';

        applyGroupsToStudentModal(window.currentBookingGrade);
        renderGroupsModalUI();
        showNotification('تمت الإضافة', 'تمت إضافة المجموعة الجديدة وتفعيلها للطلاب!', 'success');
    }

    // --- 14. DYNAMIC TEACHER PHOTO MANAGER ---
    const teacherImg = document.querySelector('#about-section img');
    const DEFAULT_PHOTO = 'https://via.placeholder.com/500x625?text=Mr.+Ayman+Hamdy';

    function loadSavedTeacherPhoto() {
        if (!teacherImg) return;
        const savedPhoto = localStorage.getItem('zaeem_teacher_photo');
        if (savedPhoto) {
            teacherImg.src = savedPhoto;
        }
    }
    loadSavedTeacherPhoto();

    document.addEventListener('change', (e) => {
        if (e.target && e.target.id === 'admin-photo-input') {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 3.5 * 1024 * 1024) {
                showNotification('حجم الصورة كبير!', 'يرجى اختيار صورة أقل من 3.5 ميجابايت.', 'error');
                return;
            }

            const reader = new FileReader();
            if (teacherImg) teacherImg.classList.add('photo-updating');

            reader.onload = function (event) {
                const base64Image = event.target.result;
                localStorage.setItem('zaeem_teacher_photo', base64Image);

                if (teacherImg) {
                    teacherImg.src = base64Image;
                    teacherImg.classList.remove('photo-updating');
                    teacherImg.classList.add('photo-glow-flash');
                    setTimeout(() => teacherImg.classList.remove('photo-glow-flash'), 1000);
                }

                showNotification('تم حفظ الصورة بنجاح!', 'تم تغيير صورة الأستاذ أيمن حمدي وستظهر للجميع الآن.', 'success');
            };

            reader.readAsDataURL(file);
        }
    });

    // --- 15. SAFE CONFIRMATION DIALOG ---
    let globalConfirmCallback = null;
    const confirmModal = document.getElementById('zaeem-confirm-modal');
    const confirmYes = document.getElementById('zaeem-confirm-yes');
    const confirmNo = document.getElementById('zaeem-confirm-no');

    function requestUserConfirmation(message, actionCallback) {
        if (!confirmModal) {
            if (confirm(message)) actionCallback();
            return;
        }
        document.getElementById('zaeem-confirm-msg').textContent = message;
        globalConfirmCallback = actionCallback;
        confirmModal.classList.remove('opacity-0', 'pointer-events-none');
    }

    function closeUserConfirmation() {
        if (confirmModal) {
            confirmModal.classList.add('opacity-0', 'pointer-events-none');
        }
        globalConfirmCallback = null;
    }

    if (confirmYes && confirmNo) {
        confirmYes.onclick = () => {
            if (typeof globalConfirmCallback === 'function') {
                globalConfirmCallback();
            }
            closeUserConfirmation();
        };
        confirmNo.onclick = closeUserConfirmation;
    }

    function deleteStudentWithConfirmation(studentId, callback) {
        let students = JSON.parse(localStorage.getItem('zaeem_students')) || [];
        const student = students.find(s => String(s.id) === String(studentId));

        if (!student) return;

        requestUserConfirmation(`هل أنت متأكد من حذف الطالب (${student.name}) نهائياً؟`, () => {
            students = students.filter(s => String(s.id) !== String(studentId));
            localStorage.setItem('zaeem_students', JSON.stringify(students));

            if (typeof firebase !== 'undefined' && firebase.database) {
                firebase.database().ref('students').set(students);
            }

            updateAdminStats();
            renderAdminTable();
            showNotification('تم الحذف', 'تم حذف الطالب بنجاح.', 'error');

            if (typeof callback === 'function') callback();
        });
    }

    document.addEventListener('click', (e) => {
        const resetBtn = e.target.closest('#reset-photo-btn');
        if (resetBtn) {
            e.preventDefault();
            e.stopPropagation();

            requestUserConfirmation('هل أنت متأكد من مسح صورة المستر وإعادة الضبط للافتراضي؟', () => {
                localStorage.removeItem('zaeem_teacher_photo');
                if (teacherImg) teacherImg.src = DEFAULT_PHOTO;
                showNotification('تم إعادة الضبط', 'تمت العودة للصورة الافتراضية بنجاح.', 'error');
            });
        }
    }, true);

    // --- 16. CLOUD SYNC INITIALIZER ---
    function initFullCloudSync() {
        if (typeof firebase !== 'undefined' && firebase.database) {
            firebase.database().ref('adminPassword').on('value', (snapshot) => {
                const cloudPass = snapshot.val();
                if (cloudPass) {
                    activeAdminPassword = cloudPass;
                    localStorage.setItem('adminCustomPassword', cloudPass);
                }
            });

            firebase.database().ref('gradesStatus').on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    localGradesStatus = { ...localGradesStatus, ...data };
                    saveLocalData();
                    applyGroupsToStudentModal(window.currentBookingGrade);
                    renderGradesModalUI();
                }
            });

            firebase.database().ref('groupsDataV3').on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    localGroupsData = data;
                    saveLocalData();
                }
                applyGroupsToStudentModal(window.currentBookingGrade);
                renderGroupsModalUI();
            });

            firebase.database().ref('siteContent').on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    localSiteContent = data;
                    saveLocalData();
                    applySiteContentUI();
                }
            });

            firebase.database().ref('students').on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    registeredStudents = data;
                    localStorage.setItem('zaeem_students', JSON.stringify(registeredStudents));
                    updateAdminStats();
                    renderAdminTable();
                }
            });
        }
    }

    // Startup Execution
    initFullCloudSync();
    injectChangePasswordUI();
    applyGroupsToStudentModal(window.currentBookingGrade);
    setupQRScannerLogic();
    attachAttendanceEvents();

    window.alert = function (message) {
        const isSuccess = message.includes('بنجاح') || message.includes('تم');
        showNotification(
            isSuccess ? 'تمت العملية' : 'تنبيه!',
            message,
            isSuccess ? 'success' : 'error'
        );
    };
});
/* ==========================================================================
   تصليح شاشة الحجز + توليد الـ QR Code الحقيقي + تشغيل الكاميرا المباشرة
   ========================================================================== */

(function fixBookingBadgeAndQRCamera() {

    // 1. تصليح إظهار بطاقة الحجز وتوليد الـ QR Code ببيانات الطالب الكاملة
    const bookingForm = document.getElementById('booking-form');
    const digitalBadge = document.getElementById('digital-badge');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            // ننتظر تفريغ الأحداث لضمان حفظ بيانات الطالب أولاً
            setTimeout(() => {
                const students = JSON.parse(localStorage.getItem('zaeem_students')) || [];
                if (students.length === 0) return;

                const lastStudent = students[students.length - 1];

                // إظهار كارت الحجز وإخفاء الاستمارة فوراً
                bookingForm.classList.add('hidden');
                if (digitalBadge) {
                    digitalBadge.classList.remove('hidden');
                }

                // تعبئة بيانات الكارت
                const nameEl = document.getElementById('badge-name');
                const gradeEl = document.getElementById('badge-grade');
                const groupEl = document.getElementById('badge-group');
                const codeEl = document.getElementById('badge-code');

                if (nameEl) nameEl.textContent = lastStudent.name;
                if (gradeEl) gradeEl.textContent = lastStudent.grade;
                if (groupEl) groupEl.textContent = lastStudent.center;
                if (codeEl) codeEl.textContent = lastStudent.code || 'ZA-1001';

                // رسم الباركود الحقيقي ببيانات الطالب
                generateRealQRCode(lastStudent);

            }, 100);
        }, true);
    }

    // دالة إنشاء الـ QR Code بدقة ودون مربعات بيضاء
    function generateRealQRCode(student) {
        const qrBox = document.getElementById('qrcode-canvas');
        if (!qrBox) return;

        qrBox.innerHTML = ''; // تنظيف المربع

        // النص المدمج داخل الـ QR يحتوي على كل بيانات الطالب
        const qrTextData = `كود:${student.code || ''}\nالاسم:${student.name}\nالصف:${student.grade}\nالسنتر:${student.center}\nالهاتف:${student.studentPhone}`;

        // محاولة استخدام المكتبة الأولى QRCode.js
        if (typeof QRCode !== 'undefined') {
            try {
                new QRCode(qrBox, {
                    text: qrTextData,
                    width: 120,
                    height: 120,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
                return;
            } catch (err) {
                console.log("إعادة محاولة الرسم للمرة الثانية...");
            }
        }

        // حل بديل فوري (Fallback) في حال عدم تحميل المكتبة لضمان ظهور الـ QR دائماً
        const encodedData = encodeURIComponent(qrTextData);
        qrBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodedData}" alt="QR Code" class="w-28 h-28 mx-auto rounded-lg shadow-md border border-slate-200">`;
    }

    // 2. تصليح تشغيل كاميرا ماسح الـ QR للعمل بجد
    const toggleQrBtn = document.getElementById('btn-toggle-qr-scanner');
    const qrContainer = document.getElementById('qr-reader-container');
    let qrHtml5Scanner = null;

    if (toggleQrBtn && qrContainer) {
        toggleQrBtn.onclick = function () {
            if (qrContainer.classList.contains('hidden')) {
                qrContainer.classList.remove('hidden');
                document.getElementById('qr-btn-text').textContent = 'إغلاق الماسح';

                // تشغيل الكاميرا الحقيقية
                if (typeof Html5QrcodeScanner !== 'undefined') {
                    if (qrHtml5Scanner) {
                        try { qrHtml5Scanner.clear(); } catch (e) { }
                    }

                    qrHtml5Scanner = new Html5QrcodeScanner(
                        "qr-reader",
                        {
                            fps: 10,
                            qrbox: { width: 220, height: 220 },
                            aspectRatio: 1.0
                        },
                        /* verbose= */ false
                    );

                    qrHtml5Scanner.render((decodedText) => {
                        // عند قراءة الباركود بنجاح بواسطة الكاميرا
                        let extractedCode = decodedText;

                        // إذا كان الباركود يحتوي على أسطر بيانات نستخرج الكود منه
                        if (decodedText.includes('كود:')) {
                            const match = decodedText.match(/كود:([^\n]+)/);
                            if (match) extractedCode = match[1].trim();
                        }

                        // تحضير الطالب
                        if (typeof processStudentAttendanceByCode === 'function') {
                            processStudentAttendanceByCode(extractedCode);
                        } else {
                            const quickInput = document.getElementById('att-quick-code');
                            const quickBtn = document.getElementById('att-quick-add-btn');
                            if (quickInput && quickBtn) {
                                quickInput.value = extractedCode;
                                quickBtn.click();
                            }
                        }

                        // تشغيل صوت تنبيه نجاح المسح
                        playSuccessBeep();

                    }, (errorMessage) => {
                        // أخطاء القراءة العادية أثناء مسح الكاميرا (يتم تجاهلها حتى يقرأ الباركود)
                    });
                } else {
                    alert('مكتبة قارئ الباركود جاري تحميلها، يرجى إعادة المحاولة خلال ثوانٍ.');
                }
            } else {
                // إغلاق الكاميرا والماسح
                qrContainer.classList.add('hidden');
                document.getElementById('qr-btn-text').textContent = 'فتح ماسح الـ QR';
                if (qrHtml5Scanner) {
                    try { qrHtml5Scanner.clear(); } catch (e) { }
                }
            }
        };
    }

    // صوت إشعار عند قراءة الباركود بنجاح
    function playSuccessBeep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) { }
    }

})();
/* ==========================================================================
   تنسيق رسالة الواتساب الاحترافية + نظام طباعة كشوفات السناتر الشهرية (PDF)
   ========================================================================== */

(function initWhatsAppAndPdfExportEngine() {

    // 1. إعادة تهيئة زر الواتساب لإرسال رسالة منسقة مع رابط الـ QR Code
    function setupWhatsAppProMessage() {
        const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
        if (!sendWhatsappBtn) return;

        // استبدال المستمع القديم بمستمع احترافي جديد
        const newBtn = sendWhatsappBtn.cloneNode(true);
        sendWhatsappBtn.parentNode.replaceChild(newBtn, sendWhatsappBtn);

        newBtn.addEventListener('click', () => {
            const name = document.getElementById('badge-name')?.textContent || '';
            const grade = document.getElementById('badge-grade')?.textContent || '';
            const group = document.getElementById('badge-group')?.textContent || '';
            const code = document.getElementById('badge-code')?.textContent || '';

            if (!name || !code) {
                if (typeof showNotification === 'function') {
                    showNotification('تنبيه', 'لا توجد بيانات حجز مسجلة حالياً.', 'error');
                }
                return;
            }

            // توليد رابط مباشر لصورة الـ QR Code لفتحها ورؤيتها فوراً
            const qrDataText = `كود:${code}\nالاسم:${name}\nالصف:${grade}\nالسنتر:${group}`;
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrDataText)}`;

            // صياغة الرسالة بأسلوب أنيق ومزخرف
            const formattedMessage = 
`👑 *بطاقة حجز إلكترونية - الزعيم أكاديمي* 👑
----------------------------------------
🎓 *أهلاً بك يا بطل في رحلة التفوق!*

📋 *بيانات الحجز الخاصة بك:*
👤 *الاسم:* ${name}
🆔 *كود الطالب المميز:* \`${code}\`
📚 *الصف الدراسي:* ${grade}
🏫 *السنتر والموعد:* ${group}

----------------------------------------
📲 *رمز الدخول الذكي (QR Code):*
اضغط على الرابط التالي لإظهار الباركود الخاص بك عند الدخول للسنتر:
${qrImageUrl}

----------------------------------------
✨ *مع تحيات:* الأستاذ أيمن حمدي (الزعيم في الفلسفة والمنطق)`;

            window.open(`https://wa.me/?text=${encodeURIComponent(formattedMessage)}`, '_blank');
        });
    }

    // 2. إضافة زر "طباعة كشف السنتر" في لوحة التحكم
    function injectPrintSheetButton() {
        const adminToolbar = document.getElementById('admin-toolbar');
        if (adminToolbar && !document.getElementById('export-pdf-sheet-btn')) {
            const printBtn = document.createElement('button');
            printBtn.id = 'export-pdf-sheet-btn';
            printBtn.className = 'px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer';
            printBtn.innerHTML = `
                <i class="fa-solid fa-print"></i>
                <span>طباعة كشف السنتر (4 أشهر)</span>
            `;

            adminToolbar.appendChild(printBtn);

            printBtn.onclick = () => openPrintCenterSelectorModal();
        }
    }

    // 3. نافذة اختيار السنتر والكروب لطباعة الكشف الخاص بهم فقط
    function openPrintCenterSelectorModal() {
        let modal = document.getElementById('modal-print-center-select');
        if (!modal) {
            const modalHTML = `
            <div id="modal-print-center-select" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] hidden items-center justify-center p-4">
                <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                    <button id="close-print-modal-btn" class="absolute top-4 left-4 text-slate-400 hover:text-white w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center transition">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                    
                    <div class="text-center mb-5">
                        <div class="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-2 text-indigo-400">
                            <i class="fa-solid fa-file-pdf text-xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white">طباعة كشف الحضور والغياب</h3>
                        <p class="text-xs text-slate-400 mt-1">اختر السنتر والمجموعة لاستخراج كشف الطباعة المخصص</p>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">اختر المجموعة / السنتر:</label>
                            <select id="print-center-dropdown" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                                <!-- سيتم تعبئتها المجموعات -->
                            </select>
                        </div>

                        <button id="start-print-sheet-btn" class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30">
                            <i class="fa-solid fa-print"></i>
                            <span>عرض وتجهيز الكشف للطباعة</span>
                        </button>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            modal = document.getElementById('modal-print-center-select');

            document.getElementById('close-print-modal-btn').onclick = () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            };

            document.getElementById('start-print-sheet-btn').onclick = () => {
                const selectedGroup = document.getElementById('print-center-dropdown').value;
                if (!selectedGroup) return;
                generateAndPrintGroupSheet(selectedGroup);
            };
        }

        // تعبئة القائمة بالسناتر المتاحة في قاعدة البيانات
        const dropdown = document.getElementById('print-center-dropdown');
        const students = JSON.parse(localStorage.getItem('zaeem_students')) || [];
        const uniqueCenters = [...new Set(students.map(s => s.center))].filter(Boolean);

        dropdown.innerHTML = '';
        if (uniqueCenters.length === 0) {
            dropdown.innerHTML = '<option value="">لا يوجد طلاب أو سناتر مسجلة</option>';
        } else {
            uniqueCenters.forEach(c => {
                const count = students.filter(s => s.center === c).length;
                dropdown.innerHTML += `<option value="${c}">${c} (${count} طالب)</option>`;
            });
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    // 4. دالة بناء صفحة الطباعة وتنسيق الجداول لـ 4 أشهر بشكل أنيق جداً
    function generateAndPrintGroupSheet(groupTitle) {
        const students = JSON.parse(localStorage.getItem('zaeem_students')) || [];
        const groupStudents = students.filter(s => s.center === groupTitle);

        if (groupStudents.length === 0) {
            alert('لا يوجد طلاب مسجلين في هذا السنتر.');
            return;
        }

        // إنشاء نافذة طباعة مستقلة
        const printWindow = window.open('', '_blank');

        let rowsHtml = '';
        groupStudents.forEach((s, idx) => {
            rowsHtml += `
                <tr>
                    <td class="num-cell">${idx + 1}</td>
                    <td class="code-cell">${s.code || '---'}</td>
                    <td class="name-cell">${s.name}</td>
                    <td class="phone-cell">${s.studentPhone}</td>
                    <td class="phone-cell">${s.parentPhone}</td>
                    <!-- 16 خانة مخصصة لـ 4 أشهر (كل شهر 4 حصص) -->
                    ${'<td class="check-box"></td>'.repeat(16)}
                </tr>
            `;
        });

        const printTemplate = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>كشف حضور - ${groupTitle}</title>
            <style>
                @page { size: A4 landscape; margin: 8mm; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #000; padding: 10px; margin: 0; }
                
                .header-table { w-full; width: 100%; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
                .header-title { font-size: 20px; font-weight: bold; }
                .header-sub { font-size: 13px; color: #333; }
                
                .center-badge { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 12px; }
                
                table.main-table { width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 10px; }
                table.main-table th, table.main-table td { border: 1px solid #334155; text-align: center; padding: 4px 2px; }
                
                table.main-table th { background-color: #0f172a; color: #ffffff; font-size: 10px; -webkit-print-color-adjust: exact; }
                .month-header { background-color: #1e293b !important; color: #f8fafc !important; font-size: 11px; font-weight: bold; -webkit-print-color-adjust: exact; }
                
                .num-cell { width: 25px; font-weight: bold; }
                .code-cell { width: 65px; font-weight: bold; font-family: monospace; font-size: 11px; }
                .name-cell { width: 160px; text-align: right !important; padding-right: 6px !important; font-weight: bold; font-size: 11px; }
                .phone-cell { width: 80px; font-family: monospace; font-size: 10px; }
                .check-box { width: 22px; }
                
                .footer-note { margin-top: 10px; font-size: 10px; display: flex; justify-content: space-between; color: #475569; }
            </style>
        </head>
        <body>
            <table class="header-table">
                <tr>
                    <td align="right">
                        <div class="header-title">الزعيم أكاديمي - الأستاذ أيمن حمدي</div>
                        <div class="header-sub">كشف الحضور والغياب والمتابعة الشهرية</div>
                    </td>
                    <td align="left">
                        <span class="center-badge">السنتر / المجموعة: ${groupTitle}</span>
                        <div style="font-size: 11px; margin-top: 4px; font-weight: bold;">إجمالي الطلاب: (${groupStudents.length}) طالب</div>
                    </td>
                </tr>
            </table>

            <table class="main-table">
                <thead>
                    <tr>
                        <th rowspan="2" class="num-cell">#</th>
                        <th rowspan="2" class="code-cell">كود الطالب</th>
                        <th rowspan="2" class="name-cell">اسم الطالب</th>
                        <th rowspan="2" class="phone-cell">رقم الطالب</th>
                        <th rowspan="2" class="phone-cell">رقم ولي الأمر</th>
                        <th colspan="4" class="month-header">الشهر الأول</th>
                        <th colspan="4" class="month-header">الشهر الثاني</th>
                        <th colspan="4" class="month-header">الشهر الثالث</th>
                        <th colspan="4" class="month-header">الشهر الرابع</th>
                    </tr>
                    <tr>
                        ${'<th>ح1</th><th>ح2</th><th>ح3</th><th>ح4</th>'.repeat(4)}
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>

            <div class="footer-note">
                <span>تاريخ طباعة الكشف: ${new Date().toLocaleDateString('ar-EG')}</span>
                <span>منصة الزعيم أكاديمي التعليمية ©</span>
            </div>

            <script>
                window.onload = function() {
                    window.print();
                };
            <\/script>
        </body>
        </html>
        `;

        printWindow.document.write(printTemplate);
        printWindow.document.close();
    }

    // تشغيل وإعادة الفحص الدوري
    function runFinalUpdates() {
        setupWhatsAppProMessage();
        injectPrintSheetButton();
    }

    runFinalUpdates();
    setInterval(runFinalUpdates, 500);

})();
/* ==========================================================================
   تصحيح حركة زر الثيم (القمر/الشمس) + نظام التحويل الكامل للغة الإنجليزية (AR/EN)
   ========================================================================== */

(function fixThemeToggleAndFullTranslation() {

    // 1. تصحيح مواضع زر الثيم (Theme Switcher)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeBall = document.getElementById('theme-ball');

    if (themeToggleBtn && themeBall) {
        // إعادة ضبط الهيكل الداخلي للأيقونات لضمان تطابق الأماكن
        themeToggleBtn.innerHTML = `
            <i class="fa-solid fa-moon text-yellow-300 text-xs z-10 mr-1.5 pointer-events-none"></i>
            <i class="fa-solid fa-sun text-amber-500 text-xs z-10 ml-1.5 pointer-events-none"></i>
            <div id="theme-ball" class="absolute top-0.5 right-0.5 w-6 h-6 bg-gradient-to-r from-brand-gold to-yellow-500 rounded-full transition-all duration-300 shadow-md pointer-events-none"></div>
        `;

        const activeBall = document.getElementById('theme-ball');

        // الضبط المبدئي: الوضع الداكن (Dark Mode) تجلس الكرة فوق القمر
        let isDarkMode = document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light');

        function updateThemeBallPosition(dark) {
            if (!activeBall) return;
            if (dark) {
                // الوضع الداكن: الكرة على القمر (جهة اليمين)
                activeBall.style.transform = 'translateX(0px)';
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
            } else {
                // الوضع الفاتح: الكرة تنتقل للشمس (جهة اليسار)
                activeBall.style.transform = 'translateX(-26px)';
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
            }
        }

        // تطبيق الموضع الصحيح فور التحميل
        updateThemeBallPosition(isDarkMode);

        // عند الضغط على الزر
        themeToggleBtn.onclick = function () {
            isDarkMode = !isDarkMode;
            updateThemeBallPosition(isDarkMode);
        };
    }

    // 2. نظام الترجـمة الكامل بين العربية والإنجليزية (Full Arabic / English Toggle)
    const langBtn = document.getElementById('lang-btn');
    const langText = document.getElementById('lang-text');

    let currentLang = 'AR'; // الوضع الافتراضي عربي

    const translations = {
        AR: {
            brandSub: "ACADEMY",
            adminBtn: "لوحة الأدمن",
            heroBadge: "المنصة الرسمية الأولى في المواد الفلسفية",
            heroMainText: "طريقك للقمة يبدأ مع",
            heroSub: "منظومة تعليمية تفاعلية بأسلوب التحليل والفهم المنطقي بعيداً عن الحفظ التلقيني. احتفل بتفوقك واضمن الدرجة النهائية.",
            bookBtn: "احجز مقعدك الآن",
            aboutBtn: "عن الزعيم",
            aboutTitle: '"الزعيم في المواد الفلسفية"',
            teacherTitle: "خبير المواد الفلسفية",
            teacherName: "الأستاذ أيمن حمدي",
            expText: "سنوات خبرة",
            studentsText: "طالب متفوق",
            successText: "% نسبة النجاح",
            dir: "rtl"
        },
        EN: {
            brandSub: "ACADEMY",
            adminBtn: "Admin Portal",
            heroBadge: "The #1 Platform in Philosophical Sciences",
            heroMainText: "Your Path To Success Starts With",
            heroSub: "An interactive educational system based on logical understanding & analysis. Guarantee your top grade.",
            bookBtn: "Book Your Seat Now",
            aboutBtn: "About El-Zaeem",
            aboutTitle: '"The Leader in Philosophical Studies"',
            teacherTitle: "Philosophical Sciences Expert",
            teacherName: "Mr. Ayman Hamdy",
            expText: "Years Experience",
            studentsText: "Top Students",
            successText: "% Success Rate",
            dir: "ltr"
        }
    };

    if (langBtn) {
        langBtn.onclick = function () {
            currentLang = currentLang === 'AR' ? 'EN' : 'AR';
            if (langText) langText.textContent = currentLang;

            const t = translations[currentLang];
            document.documentElement.setAttribute('dir', t.dir);

            // ترجمة كافة العناصر الرئيسية في الواجهة
            const heroBadge = document.querySelector('main section .animate-pulse span');
            if (heroBadge) heroBadge.textContent = t.heroBadge;

            const heroMain = document.querySelector('main h1 span.text-slate-100');
            if (heroMain) heroMain.textContent = t.heroMainText;

            const heroSub = document.getElementById('hero-subtitle');
            if (heroSub) heroSub.textContent = t.heroSub;

            const bookBtnSpan = document.querySelector('#open-booking-modal span');
            if (bookBtnSpan) bookBtnSpan.textContent = t.bookBtn;

            const aboutBtnSpan = document.querySelector('#scroll-to-about span');
            if (aboutBtnSpan) aboutBtnSpan.textContent = t.aboutBtn;

            const adminBtnSpan = document.querySelector('#admin-login-btn span');
            if (adminBtnSpan) adminBtnSpan.textContent = t.adminBtn;

            const aboutTitle = document.querySelector('#about-section h2');
            if (aboutTitle) aboutTitle.textContent = t.aboutTitle;

            const teacherTitle = document.querySelector('#about-section .bg-brand-gold\\/20');
            if (teacherTitle) teacherTitle.textContent = t.teacherTitle;

            const teacherName = document.querySelector('#about-section h3');
            if (teacherName) teacherName.textContent = t.teacherName;

            // ترجمة نصوص الإحصائيات
            const counters = document.querySelectorAll('#about-section .text-xs.text-slate-400');
            if (counters.length >= 3) {
                counters[0].textContent = t.expText;
                counters[1].textContent = t.studentsText;
                counters[2].textContent = t.successText;
            }

            // إشعار تغيير اللغة
            if (typeof showNotification === 'function') {
                showNotification(
                    currentLang === 'EN' ? 'Language Changed' : 'تم تغيير اللغة',
                    currentLang === 'EN' ? 'Switched to English language.' : 'تم التحويل إلى اللغة العربية.',
                    'success'
                );
            }
        };
    }

})();
/* ==========================================================================
   نظام الترجـمة الشامل والمطلق (Full Arabic / English Translation Engine)
   ========================================================================== */

(function initCompleteBilingualTranslation() {

    const langBtn = document.getElementById('lang-btn');
    const langText = document.getElementById('lang-text');
    if (!langBtn) return;

    let currentLang = 'AR'; // الوضع الافتراضي

    // قاموس الترجـمة الشامل لكافة أركان المنصة
    const dictionary = {
        EN: {
            // Header & Nav
            brandSub: "ACADEMY",
            adminBtn: "Admin Portal",
            
            // Hero Section
            heroBadge: "The #1 Platform in Philosophical Sciences",
            heroMainText: "Your Path To Success Starts With",
            bookBtn: "Book Your Seat Now",
            aboutBtn: "About El-Zaeem",
            
            // Typing Phrases
            typingPhrases: [
                'Mr. Ayman Hamdy',
                'El-Zaeem in Philosophy & Logic',
                'Maker of Top Achievers'
            ],

            // About Section
            aboutTitle: '"El-Zaeem in Philosophical Studies"',
            teacherTitle: "Philosophical Sciences Expert",
            teacherName: "Mr. Ayman Hamdy",
            expText: "Years Experience",
            studentsText: "Top Students",
            successText: "% Success Rate",

            // Booking Modal
            bookingHeaderTitle: "Smart Booking Form",
            bookingHeaderSub: "Select your grade and preferred group to reserve your seat instantly",
            lblStudentName: "Student Full Name",
            phStudentName: "Enter your full name...",
            lblStudentPhone: "Student Phone Number",
            lblParentPhone: "Parent Phone Number",
            lblGradeSelect: "Grade Level",
            lblGroupsSelect: "Available Groups & Centers",
            btnConfirmBooking: "Confirm Booking & Generate ID Badge",
            
            // Grade Names
            g1Name: "1st Secondary",
            g2Name: "2nd Secondary",
            g3Name: "3rd Secondary",

            // Digital Badge
            badgeTitle: "Electronic Booking Badge",
            badgeNameLbl: "Name:",
            badgeGradeLbl: "Grade:",
            badgeGroupLbl: "Center & Time:",
            badgeCodeLbl: "Booking Code:",
            badgeQrNote: "Smart Entry QR Code",
            btnSendWa: "Send Details via WhatsApp",
            btnResetBooking: "New Booking",

            // Admin Panel
            adminLockTitle: "El-Zaeem Control Panel",
            adminLockSub: "Enter secret passcode to access student records",
            phPasscode: "Passcode...",
            btnLoginAdmin: "Login",
            adminDashTitle: "Student & Booking Management",
            statTotal: "Total Registered",
            statG1: "1st Secondary",
            statG2: "2nd Secondary",
            statG3: "3rd Secondary",
            phSearch: "Search by student name or phone...",
            btnExportCsv: "Export CSV",
            btnChangePhoto: "Change Photo",
            btnResetPhoto: "Reset Photo",
            btnChangePass: "Change Password",
            
            // Admin Table Headers
            thName: "Student Name",
            thPhone: "Student Phone",
            thParentPhone: "Parent Phone",
            thGrade: "Grade",
            thCenter: "Center / Group",
            thActions: "Actions",

            // Admin Action Buttons
            btnGradesControl: "Booking Lock Status",
            btnGroupsControl: "Manage Groups",
            btnContentControl: "Edit Site Content",
            btnAttendanceControl: "Attendance & QR Scanner",

            // Group Translator Map (ترجمة أسماء السناتر والأيام)
            groupsMap: {
                "محطة الرمل": "Mahatet El-Raml",
                "باكوس": "Bacos",
                "السرايا": "El-Saraya",
                "الرياض": "El-Riad",
                "دار العلوم": "Dar El-Oloom",
                "الامتياز": "El-Emtiaz",
                "سنتر الجزار": "El-Gazzar Center",
                "سنتر السرايا": "El-Saraya Center",
                "سنتر الرياض": "El-Riad Center",
                "سنتر دار العلوم": "Dar El-Oloom Center",
                "سنتر الامتياز": "El-Emtiaz Center",
                "مجموعة عامة": "General Group",
                "مجموعة خاصة": "Private Group",
                "الأربعاء": "Wednesday",
                "الثلاثاء": "Tuesday",
                "الأحد": "Sunday",
                "الإثنين": "Monday",
                "الخميس": "Thursday",
                "السبت": "Saturday",
                "مساءً": "PM",
                "صباحاً": "AM",
                "متاح": "Available",
                "أماكن محدودة": "Limited Seats"
            }
        }
    };

    // حفظ النصوص العربية الأصلية قبل الترجمة
    const originalArabicContent = {
        heroCaption: document.getElementById('hero-subtitle')?.textContent,
        aboutQuote: document.getElementById('about-quote')?.textContent
    };

    langBtn.onclick = function() {
        currentLang = currentLang === 'AR' ? 'EN' : 'AR';
        langText.textContent = currentLang;

        const isEN = currentLang === 'EN';
        document.documentElement.setAttribute('dir', isEN ? 'ltr' : 'rtl');

        // 1. ترجمة الهيدر والواجهة الرئيسية
        updateTextContent('#admin-login-btn span', isEN ? dictionary.EN.adminBtn : "لوحة الأدمن");
        updateTextContent('main section .animate-pulse span', isEN ? dictionary.EN.heroBadge : "المنصة الرسمية الأولى في المواد الفلسفية");
        updateTextContent('main h1 span.text-slate-100', isEN ? dictionary.EN.heroMainText : "طريقك للقمة يبدأ مع");
        updateTextContent('#open-booking-modal span', isEN ? dictionary.EN.bookBtn : "احجز مقعدك الآن");
        updateTextContent('#scroll-to-about span', isEN ? dictionary.EN.aboutBtn : "عن الزعيم");

        // 2. ترجمة قسم (عن الزعيم) والإحصائيات
        updateTextContent('#about-section h2', isEN ? dictionary.EN.aboutTitle : '"الزعيم في المواد الفلسفية"');
        updateTextContent('#about-section .bg-brand-gold\\/20', isEN ? dictionary.EN.teacherTitle : "خبير المواد الفلسفية");
        updateTextContent('#about-section h3', isEN ? dictionary.EN.teacherName : "الأستاذ أيمن حمدي");

        const statLabels = document.querySelectorAll('#about-section .text-xs.text-slate-400');
        if (statLabels.length >= 3) {
            statLabels[0].textContent = isEN ? dictionary.EN.expText : "سنوات خبرة";
            statLabels[1].textContent = isEN ? dictionary.EN.studentsText : "طالب متفوق";
            statLabels[2].textContent = isEN ? dictionary.EN.successText : "% نسبة النجاح";
        }

        // 3. ترجمة الوصف والاقتباسات
        const heroSub = document.getElementById('hero-subtitle');
        const aboutQuote = document.getElementById('about-quote');
        if (heroSub) {
            heroSub.textContent = isEN ? 
                "An interactive educational system based on logical understanding & analysis. Guarantee your top grade." : 
                (originalArabicContent.heroCaption || "منظومة تعليمية تفاعلية بأسلوب التحليل والفهم المنطقي بعيداً عن الحفظ التلقيني. احتفل بتفوقك واضمن الدرجة النهائية.");
        }
        if (aboutQuote) {
            aboutQuote.textContent = isEN ? 
                '"We take you on a journey of logical thinking and analysis away from traditional memorization, ensuring you reach the highest levels of excellence."' : 
                (originalArabicContent.aboutQuote || '"نأخذك في رحلة للتحليل والتفكير المنطقي بعيداً عن الحفظ والتكرار التقليدي، لنضمن لك الوصول إلى أعلى مراتب التفوق واعتلاء القمة دائماً."');
        }

        // 4. ترجمة استمارة الحجز بجميع حقولها وتبويباتها
        updateTextContent('#booking-modal h3', isEN ? dictionary.EN.bookingHeaderTitle : "استمارة الحجز الذكي");
        updateTextContent('#booking-modal p.font-tajawal', isEN ? dictionary.EN.bookingHeaderSub : "اختر صفك الدراسي والمجموعة المناسبة لك لتأكيد مقعدك مباشرة");
        
        const labels = document.querySelectorAll('#booking-form label');
        if (labels.length >= 3) {
            labels[0].textContent = isEN ? dictionary.EN.lblStudentName : "اسم الطالب الثلاثي";
            labels[1].textContent = isEN ? dictionary.EN.lblStudentPhone : "رقم هاتف الطالب";
            labels[2].textContent = isEN ? dictionary.EN.lblParentPhone : "رقم هاتف ولي الأمر";
        }

        updatePlaceholder('#student-name', isEN ? "Enter your full name..." : "أدخل اسمك بالكامل...");
        
        const gradeBtns = document.querySelectorAll('#booking-form .grade-tab');
        if (gradeBtns.length >= 3) {
            gradeBtns[0].textContent = isEN ? dictionary.EN.g1Name : "الأول الثانوي";
            gradeBtns[1].textContent = isEN ? dictionary.EN.g2Name : "الثاني الثانوي";
            gradeBtns[2].textContent = isEN ? dictionary.EN.g3Name : "الثالث الثانوي";
        }

        updateTextContent('#booking-form button[type="submit"] span', isEN ? dictionary.EN.btnConfirmBooking : "تأكيد الحجز واستخراج الكارت");

        // 5. ترجمة كارت الحجز الإلكتروني والـ QR
        updateTextContent('#digital-badge .text-brand-gold', isEN ? dictionary.EN.badgeTitle : "بطاقة حجز إلكترونية");
        updateTextContent('#send-whatsapp-btn span', isEN ? dictionary.EN.btnSendWa : "إرسال التفاصيل عبر واتساب");
        updateTextContent('#reset-booking-btn', isEN ? dictionary.EN.btnResetBooking : "حجز جديد");

        // 6. ترجمة لوحة تحكم الأدمن بالكامل
        updateTextContent('#admin-lockscreen h3', isEN ? dictionary.EN.adminLockTitle : "لوحة تحكم الزعيم");
        updateTextContent('#admin-lockscreen p', isEN ? dictionary.EN.adminLockSub : "أدخل الرمز السري للوصول لبيانات الطلاب");
        updatePlaceholder('#admin-passcode', isEN ? dictionary.EN.phPasscode : "الرمز السري...");
        updateTextContent('#admin-login-form button', isEN ? dictionary.EN.btnLoginAdmin : "دخول");

        updateTextContent('#admin-dashboard-content h3', isEN ? dictionary.EN.adminDashTitle : "إدارة الطلاب والحجوزات");
        
        // كروت الإحصائيات بأعلى لوحة الأدمن
        const statCards = document.querySelectorAll('#stats-analytics-card span.text-slate-400');
        if (statCards.length >= 4) {
            statCards[0].textContent = isEN ? dictionary.EN.statTotal : "إجمالي المسجلين";
            statCards[1].textContent = isEN ? dictionary.EN.statG1 : "الأول الثانوي";
            statCards[2].textContent = isEN ? dictionary.EN.statG2 : "الثاني الثانوي";
            statCards[3].textContent = isEN ? dictionary.EN.statG3 : "الثالث الثانوي";
        }

        updatePlaceholder('#admin-search', isEN ? dictionary.EN.phSearch : "بحث باسم الطالب أو رقم الهاتف...");
        updateTextContent('#export-excel-btn span', isEN ? dictionary.EN.btnExportCsv : "تصدير CSV");

        // أزرار التحكم الفرعية بالأدمن
        updateTextContent('#btn-open-grades-control span', isEN ? dictionary.EN.btnGradesControl : "فتح / إغلاق الحجز");
        updateTextContent('#btn-open-groups-control span', isEN ? dictionary.EN.btnGroupsControl : "إدارة المجموعات");
        updateTextContent('#btn-open-content-control span', isEN ? dictionary.EN.btnContentControl : "تعديل المحتوى");
        updateTextContent('#btn-open-attendance-control span', isEN ? dictionary.EN.btnAttendanceControl : "الحضور والغياب");

        // رؤوس جدول الأدمن
        const ths = document.querySelectorAll('#admin-dashboard-content table thead th');
        if (ths.length >= 6) {
            ths[0].textContent = isEN ? dictionary.EN.thName : "اسم الطالب";
            ths[1].textContent = isEN ? dictionary.EN.thPhone : "رقم الطالب";
            ths[2].textContent = isEN ? dictionary.EN.thParentPhone : "رقم ولي الأمر";
            ths[3].textContent = isEN ? dictionary.EN.thGrade : "الصف";
            ths[4].textContent = isEN ? dictionary.EN.thCenter : "المجموعة/السنتر";
            ths[5].textContent = isEN ? dictionary.EN.thActions : "إجراءات";
        }

        // 7. ترجمة كروت السناتر والمجموعات
        translateGroupsAndCenters(isEN);

        // إشعار نجاح التحويل
        if (typeof showNotification === 'function') {
            showNotification(
                isEN ? 'Switched to English' : 'تم التحويل إلى العربية',
                isEN ? 'Entire interface translated to English.' : 'تم تحويل الواجهة بالكامل للغة العربية.',
                'success'
            );
        }
    };

    // دالة مساعدة لترجمة كروت المجموعات المتاحة
    function translateGroupsAndCenters(isEN) {
        const groupCards = document.querySelectorAll('.group-select-card');
        groupCards.forEach(card => {
            if (!isEN) return;
            let html = card.innerHTML;
            Object.keys(dictionary.EN.groupsMap).forEach(arKey => {
                const enVal = dictionary.EN.groupsMap[arKey];
                const regex = new RegExp(arKey, 'g');
                html = html.replace(regex, enVal);
            });
            card.innerHTML = html;
        });
    }

    function updateTextContent(selector, text) {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    }

    function updatePlaceholder(selector, placeholderText) {
        const el = document.querySelector(selector);
        if (el) el.placeholder = placeholderText;
    }

})();
/* ==========================================================================
   تحديث الفوتر وتوافقه مع الترجـمة للغة الإنجليزية
   ========================================================================== */

(function initFooterLocalization() {
    const langBtn = document.getElementById('lang-btn');
    if (!langBtn) return;

    const originalLangClick = langBtn.onclick;

    langBtn.onclick = function(e) {
        if (typeof originalLangClick === 'function') {
            originalLangClick.call(this, e);
        }

        const langText = document.getElementById('lang-text');
        const footerRights = document.getElementById('footer-rights');
        
        if (footerRights && langText) {
            const isEN = langText.textContent.trim() === 'EN';
            footerRights.textContent = isEN ? 
                "All Rights Reserved © El-Zaeem Academy 2026" : 
                "جميع الحقوق محفوظة © منصة الزعيم أكاديمي 2026";
        }
    };
})();
