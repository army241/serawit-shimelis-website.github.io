// ----------------------------------------------------
// Admin Control Panel Logic - Full Portfolio CMS
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initAdminTheme();
    initDynamicBackground();
    initPasswordToggle();
    initAdminApp();
});

// Password Visibility Toggle
function initPasswordToggle() {
    const toggleBtn = document.getElementById('togglePasswordBtn');
    const passwordInput = document.getElementById('adminPassword');
    if (!toggleBtn || !passwordInput) return;

    toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        }
    });
}

// Dynamic Floating Wallpaper Background
function initDynamicBackground() {
    const bgContainer = document.getElementById('dynamicBg');
    if (!bgContainer) return;

    bgContainer.innerHTML = '';
    const boxCount = 20;
    for (let i = 0; i < boxCount; i++) {
        const box = document.createElement('div');
        box.classList.add('bg-box');

        const size = Math.floor(Math.random() * 70) + 25;
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

// Theme Toggle for Admin Panel
function initAdminTheme() {
    const themeBtn = document.getElementById('adminThemeToggle');
    const savedTheme = localStorage.getItem('themePreference');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeBtn) themeBtn.textContent = '☀️ Light mode';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            themeBtn.textContent = isLight ? '☀️ Light mode' : '🌙 Dark mode';
            localStorage.setItem('themePreference', isLight ? 'light' : 'dark');
        });
    }
}

const API_URL = window.PORTFOLIO_API_URL || (window.location.origin.includes('http')
    ? window.location.origin + '/api'
    : 'http://localhost:5000/api');

let currentToken = sessionStorage.getItem('adminToken') || '';
let portfolioData = null;

function initAdminApp() {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    const portfolioForm = document.getElementById('portfolioForm');

    const addSkillBtn = document.getElementById('addSkillBtn');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const addCertBtn = document.getElementById('addCertBtn');

    // Auto Login check
    if (currentToken) {
        showDashboard();
    }

    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value.trim();
            const password = document.getElementById('adminPassword').value;

            loginError.classList.add('hidden');

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (result.success && result.token) {
                    currentToken = result.token;
                    sessionStorage.setItem('adminToken', currentToken);
                    showDashboard();
                } else {
                    loginError.textContent = result.message || 'Login failed';
                    loginError.classList.remove('hidden');
                }
            } catch (err) {
                console.warn('Backend server offline during login, checking offline fallback credentials...', err);
                if (username === 'noistiwares' && password === 'january22') {
                    currentToken = 'local_fallback_token';
                    sessionStorage.setItem('adminToken', currentToken);
                    showDashboard();
                } else {
                    loginError.textContent = 'Unable to connect to server or invalid credentials.';
                    loginError.classList.remove('hidden');
                }
            }
        });
    }

    // Logout Button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('adminToken');
            currentToken = '';
            dashboardSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
        });
    }

    // Sidebar Tab Navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetEl = document.getElementById(target);
            if (targetEl) targetEl.classList.add('active');
        });
    });

    // Add Item Buttons
    if (addSkillBtn) addSkillBtn.addEventListener('click', () => addSkillCard());
    if (addProjectBtn) addProjectBtn.addEventListener('click', () => addProjectCard());
    if (addCertBtn) addCertBtn.addEventListener('click', () => addCertCard());

    // Dashboard Data Loader
    async function showDashboard() {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        await loadPortfolioData();
    }

    async function loadPortfolioData() {
        try {
            const res = await fetch(`${API_URL}/portfolio`);
            const data = await res.json();
            if (data.success && data.data) {
                portfolioData = data.data;
            }
        } catch (err) {
            console.warn('Could not fetch from server, using localStorage fallback:', err);
            const local = localStorage.getItem('portfolioData');
            if (local) {
                portfolioData = JSON.parse(local);
            }
        }

        if (portfolioData) {
            populateForm(portfolioData);
        }
    }

    function populateForm(data) {
        // Tab 1: Profile
        if (data.profile) {
            document.getElementById('logoText').value = data.profile.logoText || '';
            document.getElementById('profileName').value = data.profile.name || '';
            document.getElementById('profileTagline').value = data.profile.tagline || '';
            document.getElementById('typingText').value = Array.isArray(data.profile.typingText)
                ? data.profile.typingText.join(', ')
                : (data.profile.typingText || '');
            document.getElementById('profileBio').value = data.profile.bio || '';
            document.getElementById('profileImage').value = data.profile.profileImage || '';
            document.getElementById('hireEmail').value = data.profile.hireEmail || '';
        }

        // Tab 2: Skills
        if (data.skills) {
            document.getElementById('skillsIntro').value = data.skills.intro || '';
            const skillsContainer = document.getElementById('skillsListContainer');
            skillsContainer.innerHTML = '';
            if (Array.isArray(data.skills.list)) {
                data.skills.list.forEach(skill => addSkillCard(skill.icon, skill.name, skill.desc));
            }
        }

        // Tab 3: Projects
        if (data.projects) {
            document.getElementById('projectsIntro').value = data.projects.intro || '';
            const projectsContainer = document.getElementById('projectsListContainer');
            projectsContainer.innerHTML = '';
            if (Array.isArray(data.projects.list)) {
                data.projects.list.forEach(proj => addProjectCard(proj.icon, proj.title, proj.desc, proj.url, proj.tags));
            }
        }

        // Tab 4: Certifications
        if (data.certificates) {
            document.getElementById('certsIntro').value = data.certificates.intro || '';
            const certsContainer = document.getElementById('certsListContainer');
            certsContainer.innerHTML = '';
            if (Array.isArray(data.certificates.list)) {
                data.certificates.list.forEach(cert => addCertCard(cert.icon, cert.title, cert.issuer, cert.details, cert.url, cert.badge));
            }
        }

        // Tab 5: CV Section
        if (data.cv) {
            document.getElementById('cvName').value = data.cv.name || '';
            document.getElementById('cvSubtitle').value = data.cv.subtitle || '';
            document.getElementById('cvContact').value = data.cv.contact || '';
            document.getElementById('cvProfile').value = data.cv.profile || '';
            document.getElementById('cvDegree').value = data.cv.degree || '';
            document.getElementById('cvInstitution').value = data.cv.institution || '';
            document.getElementById('cvEduMeta').value = data.cv.eduMeta || '';
            document.getElementById('cvGoals').value = Array.isArray(data.cv.goals) ? data.cv.goals.join(', ') : (data.cv.goals || '');
            document.getElementById('cvLangAmharic').value = data.cv.langAmharic || '';
            document.getElementById('cvLangEnglish').value = data.cv.langEnglish || '';
        }

        // Tab 6: Social Links
        if (data.socials) {
            document.getElementById('socialGithub').value = data.socials.github || '';
            document.getElementById('socialLinkedin').value = data.socials.linkedin || '';
            document.getElementById('socialTelegram').value = data.socials.telegram || '';
            document.getElementById('socialInstagram').value = data.socials.instagram || '';
            document.getElementById('socialEmail').value = data.socials.email || '';
        }
    }

    // Dynamic Skill Card Creator
    function addSkillCard(icon = '', name = '', desc = '') {
        const container = document.getElementById('skillsListContainer');
        const card = document.createElement('div');
        card.className = 'item-card skill-card-item';
        card.innerHTML = `
            <div class="item-card-header">
                <h4><i class="fa-solid fa-code"></i> Skill Entry</h4>
                <button type="button" class="btn btn-danger btn-sm delete-btn"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
            <div class="form-grid">
                <input type="text" class="skill-icon-val" placeholder="Icon class (e.g. devicon-python-plain colored)" value="${escapeAttr(icon)}">
                <input type="text" class="skill-name-val" placeholder="Skill Name (e.g. Python Programming)" value="${escapeAttr(name)}">
            </div>
            <textarea class="skill-desc-val" rows="2" placeholder="Skill Description...">${escapeHtml(desc)}</textarea>
        `;
        card.querySelector('.delete-btn').addEventListener('click', () => card.remove());
        container.appendChild(card);
    }

    // Dynamic Project Card Creator
    function addProjectCard(icon = '', title = '', desc = '', url = '', tags = '') {
        const container = document.getElementById('projectsListContainer');
        const card = document.createElement('div');
        card.className = 'item-card project-card-item';
        card.innerHTML = `
            <div class="item-card-header">
                <h4><i class="fa-solid fa-folder"></i> Project Entry</h4>
                <button type="button" class="btn btn-danger btn-sm delete-btn"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
            <div class="form-grid">
                <input type="text" class="proj-icon-val" placeholder="Icon (e.g. fa-solid fa-code-branch)" value="${escapeAttr(icon)}">
                <input type="text" class="proj-title-val" placeholder="Project Title" value="${escapeAttr(title)}">
            </div>
            <textarea class="proj-desc-val" rows="2" placeholder="Project Summary / Details...">${escapeHtml(desc)}</textarea>
            <div class="form-grid">
                <input type="url" class="proj-url-val" placeholder="Project Link / GitHub URL" value="${escapeAttr(url)}">
                <input type="text" class="proj-tags-val" placeholder="Tags comma-separated (e.g. HTML/CSS, JS, C++)" value="${escapeAttr(tags)}">
            </div>
        `;
        card.querySelector('.delete-btn').addEventListener('click', () => card.remove());
        container.appendChild(card);
    }

    // Dynamic Cert Card Creator
    function addCertCard(icon = '', title = '', issuer = '', details = '', url = '', badge = '') {
        const container = document.getElementById('certsListContainer');
        const card = document.createElement('div');
        card.className = 'item-card cert-card-item';
        card.innerHTML = `
            <div class="item-card-header">
                <h4><i class="fa-solid fa-certificate"></i> Certification Entry</h4>
                <button type="button" class="btn btn-danger btn-sm delete-btn"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
            <div class="form-grid">
                <input type="text" class="cert-icon-val" placeholder="Icon (e.g. fa-solid fa-certificate)" value="${escapeAttr(icon)}">
                <input type="text" class="cert-title-val" placeholder="Certification Title" value="${escapeAttr(title)}">
            </div>
            <div class="form-grid">
                <input type="text" class="cert-issuer-val" placeholder="Issuer (e.g. freeCodeCamp)" value="${escapeAttr(issuer)}">
                <input type="text" class="cert-badge-val" placeholder="Badge (e.g. In Progress)" value="${escapeAttr(badge)}">
            </div>
            <textarea class="cert-details-val" rows="2" placeholder="Certification Details...">${escapeHtml(details)}</textarea>
            <input type="url" class="cert-url-val" placeholder="Credential Verification Link (URL)" value="${escapeAttr(url)}">
        `;
        card.querySelector('.delete-btn').addEventListener('click', () => card.remove());
        container.appendChild(card);
    }

    // Form Submit & Portfolio Save Logic
    if (portfolioForm) {
        portfolioForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Collect Skills
            const skillsList = [];
            document.querySelectorAll('#skillsListContainer .item-card').forEach((card, idx) => {
                skillsList.push({
                    id: `s_${idx + 1}`,
                    icon: card.querySelector('.skill-icon-val')?.value.trim() || 'fa-solid fa-code',
                    name: card.querySelector('.skill-name-val')?.value.trim() || 'Skill',
                    desc: card.querySelector('.skill-desc-val')?.value.trim() || ''
                });
            });

            // Collect Projects
            const projectsList = [];
            document.querySelectorAll('#projectsListContainer .item-card').forEach((card, idx) => {
                projectsList.push({
                    id: `p_${idx + 1}`,
                    icon: card.querySelector('.proj-icon-val')?.value.trim() || 'fa-solid fa-folder',
                    title: card.querySelector('.proj-title-val')?.value.trim() || 'Project Title',
                    desc: card.querySelector('.proj-desc-val')?.value.trim() || '',
                    url: card.querySelector('.proj-url-val')?.value.trim() || '#',
                    tags: card.querySelector('.proj-tags-val')?.value.trim() || ''
                });
            });

            // Collect Certifications
            const certsList = [];
            document.querySelectorAll('#certsListContainer .item-card').forEach((card, idx) => {
                certsList.push({
                    id: `c_${idx + 1}`,
                    icon: card.querySelector('.cert-icon-val')?.value.trim() || 'fa-solid fa-certificate',
                    title: card.querySelector('.cert-title-val')?.value.trim() || 'Certification Title',
                    issuer: card.querySelector('.cert-issuer-val')?.value.trim() || '',
                    details: card.querySelector('.cert-details-val')?.value.trim() || '',
                    url: card.querySelector('.cert-url-val')?.value.trim() || '',
                    badge: card.querySelector('.cert-badge-val')?.value.trim() || ''
                });
            });

            // Collect Learning Goals
            const rawGoals = document.getElementById('cvGoals')?.value || '';
            const goalsArray = rawGoals.split(/,|\n/).map(g => g.trim()).filter(Boolean);

            // Collect Typing Roles
            const rawTyping = document.getElementById('typingText')?.value || '';
            const typingArray = rawTyping.split(/,|\n/).map(t => t.trim()).filter(Boolean);

            const payload = {
                profile: {
                    logoText: document.getElementById('logoText')?.value.trim() || 'Serawit',
                    name: document.getElementById('profileName')?.value.trim() || 'Serawit',
                    tagline: document.getElementById('profileTagline')?.value.trim() || '',
                    typingText: typingArray,
                    bio: document.getElementById('profileBio')?.value.trim() || '',
                    profileImage: document.getElementById('profileImage')?.value.trim() || 'photo_2025-12-22_19-34-16.jpg',
                    hireEmail: document.getElementById('hireEmail')?.value.trim() || ''
                },
                skills: {
                    intro: document.getElementById('skillsIntro')?.value.trim() || '',
                    list: skillsList
                },
                projects: {
                    intro: document.getElementById('projectsIntro')?.value.trim() || '',
                    list: projectsList
                },
                certificates: {
                    intro: document.getElementById('certsIntro')?.value.trim() || '',
                    list: certsList
                },
                cv: {
                    name: document.getElementById('cvName')?.value.trim() || '',
                    subtitle: document.getElementById('cvSubtitle')?.value.trim() || '',
                    contact: document.getElementById('cvContact')?.value.trim() || '',
                    profile: document.getElementById('cvProfile')?.value.trim() || '',
                    degree: document.getElementById('cvDegree')?.value.trim() || '',
                    institution: document.getElementById('cvInstitution')?.value.trim() || '',
                    eduMeta: document.getElementById('cvEduMeta')?.value.trim() || '',
                    goals: goalsArray,
                    langAmharic: document.getElementById('cvLangAmharic')?.value.trim() || '',
                    langEnglish: document.getElementById('cvLangEnglish')?.value.trim() || ''
                },
                socials: {
                    github: document.getElementById('socialGithub')?.value.trim() || '',
                    linkedin: document.getElementById('socialLinkedin')?.value.trim() || '',
                    telegram: document.getElementById('socialTelegram')?.value.trim() || '',
                    instagram: document.getElementById('socialInstagram')?.value.trim() || '',
                    email: document.getElementById('socialEmail')?.value.trim() || ''
                }
            };

            try {
                const res = await fetch(`${API_URL}/portfolio`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentToken}`
                    },
                    body: JSON.stringify(payload)
                });

                const result = await res.json();
                if (result.success) {
                    showToast('✅ All portfolio changes saved successfully!', 'success');
                    localStorage.setItem('portfolioData', JSON.stringify(payload));
                } else {
                    showToast(result.message || 'Failed to save updates.', 'error');
                }
            } catch (err) {
                console.warn('Backend server offline during save, saving to local storage fallback...', err);
                localStorage.setItem('portfolioData', JSON.stringify(payload));
                showToast('💾 Saved locally! (Backend server currently offline)', 'success');
            }
        });
    }
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = msg;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3500);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '&quot;');
}
