console.log('✅ script.js loaded');

const SECRET_KEY = "ODg4OA==";
const SESSION_DURATION = 12 * 60 * 60 * 1000;

function initPinSystem() {
    const authTime = localStorage.getItem('auth_time_8baht');
    const now = new Date().getTime();
    if (authTime && (now - authTime < SESSION_DURATION)) {
        console.log('✅ PIN already authenticated');
        return;
    }

    console.log('🔐 Showing PIN screen');
    const pinHtml = `
        <div id="pin-screen">
            <div class="pin-container">
                <p style="font-size:16px; color:rgba(255,255,255,0.6); margin-bottom:20px; font-weight:600;">Enter PIN (8888)</p>
                <div class="pin-display-wrapper">
                    <div class="pin-display" id="pin-dots"></div>
                </div>
                <div class="pin-grid">
                    ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="pin-btn" onclick="pressPin('${n}')">${n}</button>`).join('')}
                    <button class="pin-btn special" onclick="clearPin()">Clear</button>
                    <button class="pin-btn" onclick="pressPin('0')">0</button>
                    <button class="pin-btn ok-btn" id="ok-button" onclick="validateAndUnlock()">OK</button>
                </div>
                <div id="pin-error"></div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('afterbegin', pinHtml);
}

let inputCode = "";
window.pressPin = (num) => {
    if (inputCode.length < 6) {
        inputCode += num;
        const dots = document.getElementById('pin-dots');
        if (dots) dots.innerText = "•".repeat(inputCode.length);
    }
};

window.clearPin = () => {
    inputCode = "";
    const dots = document.getElementById('pin-dots');
    if (dots) dots.innerText = "";
    const error = document.getElementById('pin-error');
    if (error) error.innerText = "";
};

window.validateAndUnlock = () => {
    if (btoa(inputCode) === SECRET_KEY) {
        console.log('✅ PIN correct');
        localStorage.setItem('auth_time_8baht', new Date().getTime());
        const screen = document.getElementById('pin-screen');
        if (screen) {
            screen.style.opacity = "0";
            setTimeout(() => screen.remove(), 400);
        }
    } else {
        console.log('❌ PIN incorrect');
        const error = document.getElementById('pin-error');
        if (error) error.innerText = "Access Denied";
        setTimeout(clearPin, 800);
    }
};

let basket = JSON.parse(localStorage.getItem('8baht_basket')) || [];

function updateBasketUI() {
    const basketUI = document.getElementById('copy-basket-ui');
    if (!basketUI) return;

    console.log('🛒 Updating basket - items:', basket.length);

    if (basket.length === 0) {
        basketUI.style.display = 'none';
        return;
    }

    basketUI.style.display = 'block';
    document.getElementById('basket-count').innerText = basket.length;
    document.getElementById('preview-list').innerHTML = basket
        .map((item, i) => `<div class="basket-item"><span>${item.name}</span><button onclick="removeItem(${i})" style="background:none;border:none;color:var(--accent-red);cursor:pointer;">✕</button></div>`)
        .join('');
    
    localStorage.setItem('8baht_basket', JSON.stringify(basket));
}

window.addToBasket = function(name, url) {
    console.log('➕ Adding:', name);
    if (!basket.find(item => item.url === url)) {
        basket.push({ name, url });
        updateBasketUI();
    }
};

window.removeItem = function(index) {
    console.log('➖ Removing:', basket[index].name);
    basket.splice(index, 1);
    updateBasketUI();
};

window.clearBasket = function() {
    if (confirm('Clear items?')) {
        basket = [];
        updateBasketUI();
    }
};

window.copyAllItems = function() {
    if (basket.length === 0) return;
    let text = basket.map(item => `${item.name}\n${item.url}`).join('\n\n');
    navigator.clipboard.writeText(text);
    console.log('📋 Copied');
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing');
    initPinSystem();
    updateBasketUI();

    const toggle = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.desktop-menu');
    const overlay = document.getElementById('menu-overlay');

    if (toggle && menu && overlay) {
        const toggleMenu = () => {
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
        };
        toggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
    }

    document.addEventListener('click', e => {
        const btn = e.target.closest('.btn-copy');
        if (btn && btn.hasAttribute('data-url')) {
            navigator.clipboard.writeText(btn.getAttribute('data-url'));
            console.log('📋 Copied link');
        }
    });

    console.log('✅ Ready!');
});
