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

        if (event.data.neonActive !== undefined) {
            neonEnabled = event.data.neonActive;
        }

        if (event.data.locales) {
            localeStrings = event.data.locales;
            
            document.getElementById('sMinus').innerHTML = localeStrings.s_minus || "S-";
            document.getElementById('sPlus').innerHTML = localeStrings.s_plus || "S+";
            document.getElementById('ww').innerHTML = localeStrings.custom || "EGEN";
            document.getElementById('rgb').innerHTML = localeStrings.rgb || "RGB";
            
            updatePowerButtonUI();
        }

        document.body.style.display = 'flex';
        document.getElementById('phone').style.display = 'flex';
        updateBrightnessUI();
    }
});

function updatePowerButtonUI() {
    const s4Btn = document.getElementById('s4');
    if (!s4Btn) return;

    if (neonEnabled) {
        s4Btn.innerHTML = localeStrings.stop || "STÄNG AV";
        s4Btn.style.color = "white";
    } else {
        s4Btn.innerHTML = localeStrings.start || "SÄTT PÅ";
        s4Btn.style.color = "#ff4444";
    }
}

function closeUI() {
    fetch(`https://${GetParentResourceName()}/close`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
    document.body.style.display = 'none';
    document.getElementById('phone').style.display = 'none';
}

function updateBrightnessUI() {
    const step = Math.round(brightness * 10);
    for (let i = 1; i <= 10; i++) {
        const el = document.getElementById('b' + i);
        if (el) {
            if (i === step) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    }
}

function stopRGB() {
    if (rgbInterval) {
        clearInterval(rgbInterval);
        rgbInterval = null;
        document.getElementById('rgb').style.boxShadow = "0 4px 0 #111";
        document.getElementById('rgb').style.color = "white";
    }
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

    if (distance > maxDistance) {
        x = x / distance * maxDistance;
        y = y / distance * maxDistance;
    }

    selector.style.left = (rect.width / 2 + x - 5) + 'px';
    selector.style.top = (rect.height / 2 + y - 5) + 'px';
    
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 360 + 90) % 360; 
    
    stopRGB();
    if (!neonEnabled) {
        neonEnabled = true;
        updatePowerButtonUI();
    }
    applyColorHSL(angle, 100, 50);
}

function applyColorHSL(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color);
    };
    lastRGB = { r: f(0), g: f(8), b: f(4) };
    applyColor(lastRGB.r, lastRGB.g, lastRGB.b);
}

function applyColor(r, g, b) {
    // Spara senaste färg om det inte är "släckning"
    if (r !== 0 || g !== 0 || b !== 0) lastRGB = { r, g, b };

    const finalR = Math.floor(r * brightness);
    const finalG = Math.floor(g * brightness);
    const finalB = Math.floor(b * brightness);

    fetch(`https://${GetParentResourceName()}/applyNeon`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ r: finalR, g: finalG, b: finalB })
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
        brightness = Math.max(0.1, brightness - 0.1); 
        updateBrightnessUI();
        applyColor(lastRGB.r, lastRGB.g, lastRGB.b);
    });

    document.getElementById('sPlus').addEventListener('click', () => {
        brightness = Math.min(1.0, brightness + 0.1);
        updateBrightnessUI();
        applyColor(lastRGB.r, lastRGB.g, lastRGB.b);
    });

    document.getElementById('ww').addEventListener('click', () => {
        if (currentConfig.AllowCustomColor) {
            stopRGB();
            document.getElementById('customColorPicker').click();
        }
    });

    document.getElementById('customColorPicker').addEventListener('input', (e) => {
        const hex = e.target.value;
        if (!neonEnabled) {
            neonEnabled = true;
            updatePowerButtonUI();
        }
        applyColor(parseInt(hex.slice(1,3), 16), parseInt(hex.slice(3,5), 16), parseInt(hex.slice(5,7), 16));
    });

    document.getElementById('rgb').addEventListener('click', () => {
        if (rgbInterval) {
            stopRGB();
        } else {
            if (!neonEnabled) {
                neonEnabled = true;
                updatePowerButtonUI();
            }
            document.getElementById('rgb').style.boxShadow = "0 0 10px #ffffff";
            document.getElementById('rgb').style.color = "#ffffff";
            const speed = currentConfig.RGBBlinkSpeed || 2000;
            rgbInterval = setInterval(() => {
                applyColor(Math.random()*255, Math.random()*255, Math.random()*255);
            }, speed); 
        }
    });

    ['s1', 's2', 's3'].forEach(id => {
        document.getElementById(id).addEventListener('click', () => {
            stopRGB();
            if (!neonEnabled) {
                neonEnabled = true;
                updatePowerButtonUI();
            }
            const color = currentConfig.Presets[id];
            if (color) applyColor(color.r, color.g, color.b);
        });
    });

    document.getElementById('s4').addEventListener('click', function() {
        neonEnabled = !neonEnabled;
        
        if (!neonEnabled) {
            stopRGB();
            applyColor(0, 0, 0); 
        } else {
            applyColor(lastRGB.r, lastRGB.g, lastRGB.b); 
        }
        updatePowerButtonUI();
    });

    document.onkeyup = function (data) {
        if (data.key == "Escape") {
            closeUI();
        }
    };
});