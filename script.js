/***********************
 TOAST COPY NOTIFICATION
************************/
const showToast = () => {
    const toast = document.getElementById('copy-toast');
    if (!toast) return;
    toast.classList.remove('toast-hidden');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('toast-hidden');
    }, 2000);
};


/***********************
 PRODUCT CARD CLICK (IMAGE + TITLE → OPEN LINK)
************************/
document.addEventListener('click', (e) => {
    // ไม่เปิดลิงก์ ถ้าคลิกปุ่ม
    if (e.target.closest('button')) return;

    const wrapper = e.target.closest('.js-product-link');
    if (!wrapper) return;

    const card = wrapper.closest('.product-card');
    const link = card?.dataset.link;
    if (!link) return;

    // รองรับ Ctrl / Cmd click
    if (e.ctrlKey || e.metaKey) {
        window.open(link, '_blank');
    } else {
        window.open(link, '_blank');
    }
});


/***********************
 SECURITY PIN SYSTEM
************************/
const SECRET_KEY = "ODg4OA=="; 
const SESSION_DURATION = 12 * 60 * 60 * 1000; 

function initPinSystem() {
    const authTime = localStorage.getItem('auth_time_8baht');
    const now = new Date().getTime();
    if (authTime && (now - authTime < SESSION_DURATION)) return;

    const pinHtml = `
        <div id="pin-screen">
            <div class="pin-container">
                <p style="font-size:16px; color:rgba(255,255,255,0.6); margin-bottom:20px; font-weight:600;">Enter Security PIN</p>
                <div class="pin-display-wrapper">
                    <div class="pin-display" id="pin-dots"></div>
                </div>
                <div class="pin-grid">
                    ${[1,2,3,4,5,6,7,8,9].map(n => `
                        <button class="pin-btn" style="color: #ffffff;" onclick="pressPin('${n}')">${n}</button>
                    `).join('')}
                    <button class="pin-btn special" style="color: #ffffff;" onclick="clearPin()">Clear</button>
                    <button class="pin-btn" style="color: #ffffff;" onclick="pressPin('0')">${0}</button>
                    <button class="pin-btn ok-btn" id="ok-button" style="color: #ffffff;" onclick="validateAndUnlock()">OK</button>
                </div>
                <div id="pin-error" style="color:#ff3b30; font-size:12px; margin:15px 0; min-height:16px; font-weight:500;"></div>
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
        document.getElementById('ok-button')?.classList.add('active');
    }
};

window.clearPin = () => {
    inputCode = "";
    document.getElementById('pin-dots').innerText = "";
    document.getElementById('pin-error').innerText = "";
    document.getElementById('ok-button').classList.remove('active');
};

window.validateAndUnlock = () => {
    if (btoa(inputCode) === SECRET_KEY) {
        localStorage.setItem('auth_time_8baht', new Date().getTime());
        const screen = document.getElementById('pin-screen');
        screen.style.opacity = "0";
        setTimeout(() => screen.remove(), 400);
    } else {
        document.getElementById('pin-error').innerText = "Access Denied.";
        setTimeout(clearPin, 800);
    }
};

initPinSystem();


/***********************
 COPY BASKET SYSTEM
************************/
let basket = JSON.parse(localStorage.getItem('8baht_basket')) || [];
let isMinimized = JSON.parse(localStorage.getItem('8baht_minimized')) || false;

function updateBasketUI() {
    const basketUI = document.getElementById('copy-basket-ui');
    const basketCount = document.getElementById('basket-count');
    const previewList = document.getElementById('preview-list');
    const fabIcon = document.getElementById('basket-floating-icon');
    const fabCount = document.getElementById('fab-count');

    localStorage.setItem('8baht_basket', JSON.stringify(basket));
    localStorage.setItem('8baht_minimized', JSON.stringify(isMinimized));

    if (!basketUI || !basketCount || !previewList) return;

    if (basket.length === 0) {
        basketUI.style.display = 'none';
        if (fabIcon) fabIcon.style.display = 'none';
        return;
    }

    if (isMinimized) {
        basketUI.style.display = 'none';
        if (fabIcon) {
            fabIcon.style.display = 'flex';
            if (fabCount) fabCount.innerText = basket.length;
        }
    } else {
        basketUI.style.display = 'block';
        if (fabIcon) fabIcon.style.display = 'none';
    }

    basketCount.innerText = basket.length;
    previewList.innerHTML = basket.map((item, index) => `
        <div class="basket-item">
            <span>${item.name}</span>
            <button onclick="removeItem(${index})" style="background:none;border:none;color:#ff453a;cursor:pointer;">✕</button>
        </div>
    `).join('');
}

function toggleBasketUI(showFull) {
    isMinimized = !showFull;
    updateBasketUI();
}

function addToBasket(name, url) {
    if (!basket.find(item => item.url === url)) {
        basket.push({ name, url });
                updateBasketUI();

        const fab = document.getElementById('basket-floating-icon');
        if (fab && isMinimized) {
            fab.classList.remove('fab-animate');
            void fab.offsetWidth;
            fab.classList.add('fab-animate');
            
            setTimeout(() => fab.classList.remove('fab-animate'), 500);
        }
    }
}

function removeItem(index) {
    basket.splice(index, 1);
    updateBasketUI();
}

function clearBasket() {
    if (!confirm('ล้างรายการ?')) return;
    basket = [];
    isMinimized = false;
    updateBasketUI();
}

function copyAllItems() {
    if (basket.length === 0) return;
    let text = basket.map(item => `${item.name}\nดาวน์โหลดติดตั้ง: ${item.url}`).join('\n\n');
    text += "\n\nบริการช่วยเหลือ: https://8baht.com/help";
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.btn-copy-all');
        if (!btn) return;

        // เก็บข้อความและสไตล์เดิมไว้
        const originalText = btn.innerText;
        const originalBg = btn.style.background;
        const originalBorder = btn.style.borderColor;
        const originalColor = btn.style.color;

        // เปลี่ยนเป็นสีเขียวและเปลี่ยนข้อความ
        btn.innerText = 'คัดลอกสำเร็จ';
        btn.style.background = 'var(--accent-green)';
        btn.style.borderColor = 'var(--accent-green)';
        btn.style.color = '#ffffff';

        setTimeout(() => {
            // คืนค่าเดิม
            btn.innerText = originalText;
            btn.style.background = originalBg;
            btn.style.borderColor = originalBorder;
            btn.style.color = originalColor;
        }, 2000);
    });
}

/***********************
 COPY BUTTON GLOBAL HANDLER
************************/
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-copy-icon, .btn-copy');
    if (!btn || !btn.hasAttribute('data-url')) return;

    navigator.clipboard.writeText(btn.getAttribute('data-url')).then(() => {
        showToast();

        if (btn.classList.contains('btn-copy')) {
            const originalText = btn.innerHTML;
            btn.classList.add('success');
            btn.innerText = '✔';
            setTimeout(() => {
                btn.classList.remove('success');
                btn.innerHTML = originalText;
            }, 2000);
        }
    });
});


/***********************
 MOBILE MENU
************************/
document.addEventListener("DOMContentLoaded", () => {
    updateBasketUI();

    const mobileToggle = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.desktop-menu');
    const overlay = document.getElementById('menu-overlay');

    const toggleMenu = () => {
        const isOpen = mainNav?.classList.toggle('active');
        overlay?.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle?.addEventListener('click', toggleMenu);
    overlay?.addEventListener('click', toggleMenu);


    /***********************
     SECTION SCROLL HIGHLIGHT
    ************************/
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                document.querySelector(`.nav-item[href="#${id}"]`)?.classList.add('active');
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px' });

    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));


    /***********************
     GOOGLE DOC CARD LOGIC
    ************************/
    document.querySelectorAll('.doc-card').forEach(card => {
        const mainLink = card.querySelector('.main-link');
        if (!mainLink) return;

        const fullUrl = mainLink.href;
        const fileName = card.querySelector('.doc-name')?.innerText || 'Document';
        const fileIdMatch = fullUrl.match(/\/d\/(.+?)\//);

        if (fileIdMatch) {
            const downloadBtn = card.querySelector('.download-btn');
            if (downloadBtn) {
                downloadBtn.href = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
                downloadBtn.target = "_blank";
            }
        }

        const copyBtn = card.querySelector('.btn-copy-icon');
        if (copyBtn && !copyBtn.hasAttribute('data-url')) {
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(`${fileName}\n${fullUrl}`).then(showToast);
            });
        }
    });

});

document.addEventListener('click', (e) => {
    const wrapper = e.target.closest('.js-product-link');
    if (!wrapper) return;

    const card = wrapper.closest('.product-card');
    const link = card?.dataset.link;
    if (link) {
        window.open(link, '_blank');
    }
});

document.addEventListener('click', (e) => {
    const wrapper = e.target.closest('.js-product-link');
    if (!wrapper) return;

    const card = wrapper.closest('.product-card');
    const link = card?.dataset.link;
    if (link) {
        window.open(link, '_blank');
    }
});
