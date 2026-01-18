let neonEnabled = true;
let rgbInterval = null;
let brightness = 1.0; 
let lastRGB = { r: 255, g: 255, b: 255 };
let localeStrings = {}; 

let currentConfig = {
    RGBBlinkSpeed: 2000,
    Presets: {
        s1: {r: 255, g: 0, b: 0},
        s2: {r: 0, g: 255, b: 0},
        s3: {r: 0, g: 0, b: 255}
    },
    AllowCustomColor: true
};

window.addEventListener('message', function(event) {
    if (event.data.action === 'open') {
        if (event.data.config) currentConfig = event.data.config;
        if (event.data.neonActive !== undefined) neonEnabled = event.data.neonActive;
        if (event.data.locales) localeStrings = event.data.locales;
        document.body.style.display = 'flex';
        document.getElementById('phone').style.display = 'flex';
        updateBrightnessUI();
        updatePowerButtonUI();
    }
});

function updatePowerButtonUI() {
    const s4Btn = document.getElementById('s4');
    if (!s4Btn) return;
    if (neonEnabled) {
        s4Btn.innerHTML = localeStrings.stop || "STÄNG AV";
        s4Btn.className = "btn-rect neon-on";
    } else {
        s4Btn.innerHTML = localeStrings.start || "SÄTT PÅ";
        s4Btn.className = "btn-rect neon-off";
    }
}

function closeUI() {
    fetch(`https://${GetParentResourceName()}/close`, { method: 'POST', body: JSON.stringify({}) });
    document.body.style.display = 'none';
}

function updateBrightnessUI() {
    const step = Math.ceil(brightness * 4);
    for (let i = 1; i <= 4; i++) {
        const el = document.getElementById('b' + i);
        if (el) i === step ? el.classList.add('active') : el.classList.remove('active');
    }
}

function stopRGB() {
    if (rgbInterval) { clearInterval(rgbInterval); rgbInterval = null; }
}

function updateColorSelector(event) {
    const wheel = document.getElementById('colorWheel');
    const selector = document.getElementById('colorSelector');
    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let x = event.clientX - centerX;
    let y = event.clientY - centerY;
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = rect.width / 2 - 5;

    // Begränsa markören till hjulet
    let finalX = x;
    let finalY = y;
    if (distance > maxDistance) {
        finalX = x / distance * maxDistance;
        finalY = y / distance * maxDistance;
    }

    selector.style.left = (rect.width / 2 + finalX - 5) + 'px';
    selector.style.top = (rect.height / 2 + finalY - 5) + 'px';
    
    // Räkna ut vinkel (Hue)
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 360 + 90) % 360; 

    // RÄKNA UT VITHET (Saturation)
    // Ju närmare mitten (distance 0), desto lägre saturation (vitare)
    let saturation = (distance / maxDistance) * 100;
    if (saturation > 100) saturation = 100;

    stopRGB();
    if (!neonEnabled) { neonEnabled = true; updatePowerButtonUI(); }
    
    applyColorHSL(angle, saturation, 50);
}

function applyColorHSL(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color);
    };
    applyColor(f(0), f(8), f(4));
}

function applyColor(r, g, b) {
    if (r !== 0 || g !== 0 || b !== 0) lastRGB = { r, g, b };
    fetch(`https://${GetParentResourceName()}/applyNeon`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ r: Math.floor(r * brightness), g: Math.floor(g * brightness), b: Math.floor(b * brightness) })
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const colorWheel = document.getElementById('colorWheel');
    let isDragging = false;
    colorWheel.addEventListener('mousedown', (e) => { isDragging = true; updateColorSelector(e); });
    document.addEventListener('mousemove', (e) => { if (isDragging) updateColorSelector(e); });
    document.addEventListener('mouseup', () => isDragging = false);
    document.getElementById('power').addEventListener('click', closeUI);
    document.getElementById('sMinus').addEventListener('click', () => {
        brightness = Math.max(0.25, brightness - 0.25);
        updateBrightnessUI();
        applyColor(lastRGB.r, lastRGB.g, lastRGB.b);
    });
    document.getElementById('sPlus').addEventListener('click', () => {
        brightness = Math.min(1.0, brightness + 0.25);
        updateBrightnessUI();
        applyColor(lastRGB.r, lastRGB.g, lastRGB.b);
    });
    document.getElementById('ww').addEventListener('click', () => {
        if (currentConfig.AllowCustomColor) { stopRGB(); document.getElementById('customColorPicker').click(); }
    });
    document.getElementById('customColorPicker').addEventListener('input', (e) => {
        const hex = e.target.value;
        applyColor(parseInt(hex.slice(1,3), 16), parseInt(hex.slice(3,5), 16), parseInt(hex.slice(5,7), 16));
    });
    document.getElementById('rgb').addEventListener('click', () => {
        if (rgbInterval) { stopRGB(); } 
        else {
            rgbInterval = setInterval(() => { applyColor(Math.random()*255, Math.random()*255, Math.random()*255); }, 2000); 
        }
    });
    ['s1', 's2', 's3'].forEach(id => {
        document.getElementById(id).addEventListener('click', () => {
            const color = currentConfig.Presets[id];
            if (color) applyColor(color.r, color.g, color.b);
        });
    });
    document.getElementById('s4').addEventListener('click', function() {
        neonEnabled = !neonEnabled;
        neonEnabled ? applyColor(lastRGB.r, lastRGB.g, lastRGB.b) : applyColor(0, 0, 0);
        updatePowerButtonUI();
    });
});