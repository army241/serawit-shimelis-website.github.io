const themeToggle = document.getElementById('themeToggle');
const statusMessage = document.getElementById('statusMessage');
const profileImage = document.querySelector('.home-img img');
  


function showStatus(message) {
    if (!statusMessage) return;

    statusMessage.textContent = message;
    statusMessage.classList.add('show');

    window.clearTimeout(showStatus.timeoutId);
    showStatus.timeoutId = window.setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 1800);
}




if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        themeToggle.textContent = isLightMode ? '☀️ Light mode' : '🌙 Dark mode';
        showStatus(isLightMode ? 'Light mode is on.' : 'Dark mode is back.');
    });
}



if (profileImage) {
    profileImage.addEventListener('click', () => {
        profileImage.classList.remove('pulse');
        void profileImage.offsetWidth;
        profileImage.classList.add('pulse');
        showStatus('That is the profile photo — nice to meet you!');
    });
}
