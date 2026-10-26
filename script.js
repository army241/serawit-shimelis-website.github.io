// ----------------------------------------------------
// Personal Portfolio Script - Unified Single-Page App
// Handles: Theme Toggle, Typing Animation, API Sync,
// Admin Modal & Keyboard Shortcut (Ctrl+Shift+A), ScrollSpy
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initProfileInteraction();
    initMobileMenu();
    initScrollSpy();
    initAdminShortcut();
    initDynamicPortfolio();
    initDynamicBackground();
});

// Dynamic Floating Wallpaper Background
function initDynamicBackground() {
    const bgContainer = document.getElementById('dynamicBg');
    if (!bgContainer) return;

    bgContainer.innerHTML = '';
    const boxCount = 24;
    for (let i = 0; i < boxCount; i++) {
        const box = document.createElement('div');
        box.classList.add('bg-box');

        const size = Math.floor(Math.random() * 75) + 25;
        const left = Math.floor(Math.random() * 96);
        const duration = Math.floor(Math.random() * 14) + 10;
        const delay = (Math.random() * 12).toFixed(2);

        box.style.width = `${size}px`;
        box.style.height = `${size}px`;
        box.style.left = `${left}%`;
        box.style.animationDuration = `${duration}s`;
        box.style.animationDelay = `${delay}s`;

        bgContainer.appendChild(box);
    }
}

// 1. Theme Toggle & Status Message
const themeToggle = document.getElementById('themeToggle');
const statusMessage = document.getElementById('statusMessage');

function showStatus(message) {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.classList.add('show');
    window.clearTimeout(showStatus.timeoutId);
    showStatus.timeoutId = window.setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 2200);
}

function initThemeToggle() {
    if (!themeToggle) return;
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        themeToggle.textContent = isLightMode ? '☀️ Light mode' : '🌙 Dark mode';
        showStatus(isLightMode ? 'Light theme activated.' : 'Dark theme activated.');
    });
}

// 2. Profile Image Interaction
function initProfileInteraction() {
    const profileImage = document.getElementById('profilePhoto');
    if (!profileImage) return;

    profileImage.addEventListener('click', () => {
        profileImage.classList.remove('pulse');
        void profileImage.offsetWidth; // trigger reflow
        profileImage.classList.add('pulse');
        showStatus('That is Serawit Shimelis — nice to meet you!');
    });
}

// 3. Mobile Navigation Menu Toggle
function initMobileMenu() {
    const menuIcon = document.getElementById('menuIcon');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const icon = menuIcon.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                const icon = menuIcon.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }
}

// 4. ScrollSpy Active Section Navigation Indicator
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// 5. Admin Shortcut (Ctrl + Shift + A) & Modal Logic
// 5. Admin Shortcut (Ctrl + Shift + A) -> Navigates to Full-Screen Admin Page
function initAdminShortcut() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            window.location.href = 'admin.html';
        }
    });
}

// 6. Dynamic Portfolio Data Syncing
const API_URL = window.PORTFOLIO_API_URL || (window.location.origin.includes('http')
    ? window.location.origin + '/api'
    : 'http://localhost:5000/api');

async function initDynamicPortfolio() {
    let portfolioData = null;

    try {
        const response = await fetch(`${API_URL}/portfolio`);
        const result = await response.json();
        if (result.success && result.data) {
            portfolioData = result.data;
        }
    } catch (err) {
        console.warn('Backend API offline, loading from local storage fallback...');
        const local = localStorage.getItem('portfolioData');
        if (local) {
            portfolioData = JSON.parse(local);
        }
    }

    if (portfolioData) {
        applyPortfolioData(portfolioData);
    } else {
        startTypingEffect(["a Software Developer", "a Computer Science Student", "a Full-Stack Web Developer", "an Algorithmic Problem Solver", "an AI & ML Enthusiast", "a 1700 Rapid Chess Player", "a Level 1 Chess Coach"]);
    }
}

function applyPortfolioData(data) {
    // Profile & Hero
    if (data.profile) {
        const siteLogo = document.getElementById('siteLogo');
        if (siteLogo && data.profile.logoText) {
            siteLogo.innerHTML = `${escapeHtml(data.profile.logoText)}<span>.dev</span>`;
        }

        const userName = document.getElementById('userName');
        if (userName && data.profile.name) userName.textContent = data.profile.name;

        const userTagline = document.getElementById('userTagline');
        if (userTagline && data.profile.tagline) userTagline.textContent = data.profile.tagline;

        const userBio = document.getElementById('userBio');
        if (userBio && data.profile.bio) userBio.textContent = data.profile.bio;

        const profilePhoto = document.getElementById('profilePhoto');
        if (profilePhoto && data.profile.profileImage) profilePhoto.src = data.profile.profileImage;

        const hireMeBtn = document.getElementById('hireMeBtn');
        if (hireMeBtn && data.profile.hireEmail) hireMeBtn.href = `mailto:${data.profile.hireEmail}`;

        if (data.profile.typingText && Array.isArray(data.profile.typingText) && data.profile.typingText.length > 0) {
            startTypingEffect(data.profile.typingText);
        } else {
            startTypingEffect(["a Software Developer", "a Computer Science Student", "a Full-Stack Web Developer", "an Algorithmic Problem Solver", "an AI & ML Enthusiast", "a 1700 Rapid Chess Player", "a Level 1 Chess Coach"]);
        }
    }

    // Social Links
    if (data.socials) {
        const linkGithub = document.getElementById('linkGithub');
        if (linkGithub && data.socials.github) linkGithub.href = data.socials.github;

        const linkLinkedin = document.getElementById('linkLinkedin');
        if (linkLinkedin && data.socials.linkedin) linkLinkedin.href = data.socials.linkedin;

        const linkTelegram = document.getElementById('linkTelegram');
        if (linkTelegram && data.socials.telegram) linkTelegram.href = data.socials.telegram;

        const linkInstagram = document.getElementById('linkInstagram');
        if (linkInstagram && data.socials.instagram) linkInstagram.href = data.socials.instagram;

        const linkEmail = document.getElementById('linkEmail');
        if (linkEmail && data.socials.email) linkEmail.href = `mailto:${data.socials.email}`;
    }

    // Technical Skills
    if (data.skills) {
        const skillsIntro = document.getElementById('skillsIntro');
        if (skillsIntro && data.skills.intro) skillsIntro.textContent = data.skills.intro;

        const skillsList = document.getElementById('skillsList');
        if (skillsList && Array.isArray(data.skills.list) && data.skills.list.length > 0) {
            skillsList.innerHTML = data.skills.list.map(skill => `
                <div class="skill-card">
                    <div class="skill-icon"><i class="${escapeHtml(skill.icon)}"></i></div>
                    <h3>${escapeHtml(skill.name)}</h3>
                    <p>${escapeHtml(skill.desc || 'Proficient skill dynamically managed via admin panel.')}</p>
                </div>
            `).join('');
        }
    }

    // Featured Projects
    if (data.projects) {
        const projectsIntro = document.getElementById('projectsIntro');
        if (projectsIntro && data.projects.intro) projectsIntro.textContent = data.projects.intro;

        const projectsList = document.getElementById('projectsList');
        if (projectsList && Array.isArray(data.projects.list) && data.projects.list.length > 0) {
            projectsList.innerHTML = data.projects.list.map(proj => {
                const tagSpans = (proj.tags || '')
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean)
                    .map(t => `<span>${escapeHtml(t)}</span>`)
                    .join('');

                return `
                    <div class="project-card">
                        <div class="project-header">
                            <i class="${escapeHtml(proj.icon || 'fa-solid fa-code-branch')} project-folder-icon"></i>
                            <a href="${escapeHtml(proj.url || '#')}" target="_blank" class="ext-link" title="Open Project"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                        </div>
                        <h3>${escapeHtml(proj.title)}</h3>
                        <p>${escapeHtml(proj.desc || 'View source code and project details.')}</p>
                        <div class="project-tags">
                            ${tagSpans || '<span>Project</span>'}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Certifications
    if (data.certificates) {
        const certificatesIntro = document.getElementById('certificatesIntro');
        if (certificatesIntro && data.certificates.intro) certificatesIntro.textContent = data.certificates.intro;

        const certsGrid = document.querySelector('.certificates-grid');
        if (certsGrid && Array.isArray(data.certificates.list) && data.certificates.list.length > 0) {
            certsGrid.innerHTML = data.certificates.list.map(cert => `
                <div class="cert-card">
                    <div class="cert-icon"><i class="${escapeHtml(cert.icon || 'fa-solid fa-certificate')}"></i></div>
                    <h3>${escapeHtml(cert.title)}</h3>
                    <p class="cert-issuer">${escapeHtml(cert.issuer)}</p>
                    <p class="cert-details">${escapeHtml(cert.details)}</p>
                    ${cert.url ? `<a href="${escapeHtml(cert.url)}" target="_blank" class="btn btn-sm">Verify Credential <i class="fa-solid fa-external-link"></i></a>` : ''}
                    ${cert.badge ? `<span class="badge in-progress"><i class="fa-solid fa-spinner fa-spin"></i> ${escapeHtml(cert.badge)}</span>` : ''}
                </div>
            `).join('');
        }
    }

    // Curriculum Vitae Section Sync
    if (data.cv) {
        const cvHeaderCard = document.querySelector('.cv-header-card h2');
        if (cvHeaderCard && data.cv.name) cvHeaderCard.textContent = data.cv.name;

        const cvSubtitle = document.querySelector('.cv-header-card .subtitle');
        if (cvSubtitle && data.cv.subtitle) cvSubtitle.textContent = data.cv.subtitle;

        const cvContact = document.querySelector('.cv-header-card .cv-contact');
        if (cvContact && data.cv.contact) {
            cvContact.innerHTML = `<i class="fa-solid fa-envelope"></i> ${escapeHtml(data.cv.contact)}`;
        }
    }
}

// 7. Typing Text Animation Effect
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeoutId = null;

function startTypingEffect(words) {
    const typingSpan = document.querySelector('.typing-text span');
    if (!typingSpan || !words || words.length === 0) return;

    if (typingTimeoutId) clearTimeout(typingTimeoutId);

    function type() {
        const currentWord = words[typingIndex % words.length];

        if (isDeleting) {
            charIndex--;
            typingSpan.textContent = currentWord.substring(0, charIndex);
        } else {
            charIndex++;
            typingSpan.textContent = currentWord.substring(0, charIndex);
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            typingIndex++;
            speed = 500;
        }

        typingTimeoutId = setTimeout(type, speed);
    }

    type();
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
