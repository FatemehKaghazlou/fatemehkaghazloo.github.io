

// =========================
// متغیرها
// =========================

let currentPage = 1;
let score = 0;
const totalPages = 9;
let studentName = "";

// =========================
// تغییر صفحه
// =========================

function nextPage(pageNumber) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });
    document.getElementById("page" + pageNumber).classList.add("active");
    currentPage = pageNumber;
    updateProgress();

    if (pageNumber === 7) setTimeout(initPage7, 50);
    if (pageNumber === 9) setTimeout(setupPage9, 50);
}

// =========================
// نوار پیشرفت
// =========================

function updateProgress() {
    let percent = ((currentPage - 1) / (totalPages - 1)) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
}

// =========================
// مودال بازخورد
// =========================

function showFeedback(isCorrect, icon, text, callback) {
    const modal = document.getElementById("feedbackModal");
    document.getElementById("modalIcon").textContent = icon;
    document.getElementById("modalText").textContent = text;
    modal.querySelector(".modal-box").style.borderTop =
        isCorrect ? "6px solid #22c55e" : "6px solid #ef4444";
    modal.classList.add("show");
    setTimeout(() => {
        modal.classList.remove("show");
        if (callback) callback();
    }, 2000);
}

// =========================
// صفحه ۳ — پاسخ‌ها
// =========================

const feedbacks = {
    "فلزی هستند":      { correct: true,  icon: "🎉", text: "آفرین! درسته، همه وسایل جذب‌شده فلزی هستند." },
    "رنگ یکسان دارند": { correct: false, icon: "😅", text: "نه دقیقاً! رنگ مهم نیست، به جنس وسایل دقت کن." },
    "سبک هستند":       { correct: false, icon: "🤔", text: "سبکی ملاک نیست! یه میخ سنگینم جذب میشه." },
    "همه کوچک هستند":  { correct: false, icon: "💡", text: "اندازه مهم نیست! جنس فلزی ملاک اصلیه." }
};

document.querySelectorAll(".answer").forEach(btn => {
    btn.addEventListener("click", () => {
        const label = btn.textContent.trim();
        const fb = feedbacks[label];
        btn.style.background = fb.correct ? "#22c55e" : "#ef4444";
        btn.style.color = "white";
        if (fb.correct) score += 10;
        showFeedback(fb.correct, fb.icon, fb.text, () => { nextPage(4); });
    });
});

// =========================
// صفحه ۲ — آهنربای متحرک
// =========================

const magnet = document.getElementById("dragMagnet");
const desk   = document.getElementById("desk");
let dragging = false, offsetX = 0, offsetY = 0;

magnet.addEventListener("mousedown", (e) => {
    dragging = true;
    const deskRect = desk.getBoundingClientRect();
    offsetX = e.clientX - deskRect.left - magnet.offsetLeft;
    offsetY = e.clientY - deskRect.top  - magnet.offsetTop;
    e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    requestAnimationFrame(() => {
        const deskRect = desk.getBoundingClientRect();
        let newX = e.clientX - deskRect.left - offsetX;
        let newY = e.clientY - deskRect.top  - offsetY;
        newX = Math.max(0, Math.min(newX, desk.offsetWidth  - magnet.offsetWidth));
        newY = Math.max(0, Math.min(newY, desk.offsetHeight - magnet.offsetHeight));
        magnet.style.left = newX + "px";
        magnet.style.top  = newY + "px";
        attractItems();
    });
});

document.addEventListener("mouseup", () => { dragging = false; });

function attractItems() {
    const magnetRect = magnet.getBoundingClientRect();
    document.querySelectorAll(".metal").forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const dx = magnetRect.left - itemRect.left;
        const dy = magnetRect.top  - itemRect.top;
        if (Math.sqrt(dx * dx + dy * dy) < 120) {
            item.style.left = parseInt(magnet.style.left) + 20 + "px";
            item.style.top  = parseInt(magnet.style.top)  + 20 + "px";
        }
    });
}

// =========================
// صفحه ۴ — آزمایش
// =========================

let selectedMaterial = "";
let testedMaterials  = [];

const dropZone   = document.getElementById("dropZone");
const paperclip  = document.getElementById("paperclip");
const runBtn     = document.getElementById("runExperiment");

document.querySelectorAll(".drag-material").forEach(item => {
    item.addEventListener("dragstart", () => { selectedMaterial = item.dataset.symbol; });
});

dropZone.addEventListener("dragover", (e) => { e.preventDefault(); });
dropZone.addEventListener("drop",     ()  => { dropZone.innerHTML = selectedMaterial; });
runBtn.addEventListener("click", runExperiment);

function runExperiment() {
    const barrier    = dropZone.innerHTML.trim();
    const hasBarrier = ["📄", "🪟", "🪵"].some(s => barrier.includes(s));

    if (!hasBarrier) {
        dropZone.style.display = "none";
        const testMagnet  = document.getElementById("testMagnet");
        const magnetLeft  = parseInt(testMagnet.style.left) || testMagnet.offsetLeft;
        paperclip.style.transition = "1.5s";
        paperclip.style.left = (magnetLeft - 70) + "px";
    } else {
        dropZone.style.fontSize = "70px";
        paperclip.style.transition = "1.5s";
        paperclip.style.left = (dropZone.offsetLeft - 165) + "px";
    }

    setTimeout(() => {
        addResult();
        setTimeout(resetExperiment, 800);
    }, 1600);
}

function resetExperiment() {
    paperclip.style.transition = "none";
    paperclip.style.left = "80px";
    paperclip.style.top  = "75px";
    dropZone.innerHTML   = "مانع را اینجا قرار بده";
    dropZone.style.display = "flex";
    selectedMaterial = "";
}

function addResult() {
    let experimentText;
    if      (dropZone.innerHTML.includes("📄")) { experimentText = "📎 📄 🧲"; if (!testedMaterials.includes("📄")) testedMaterials.push("📄"); }
    else if (dropZone.innerHTML.includes("🪟")) { experimentText = "📎 🪟 🧲"; if (!testedMaterials.includes("🪟")) testedMaterials.push("🪟"); }
    else if (dropZone.innerHTML.includes("🪵")) { experimentText = "📎 🪵 🧲"; if (!testedMaterials.includes("🪵")) testedMaterials.push("🪵"); }
    else                                        { experimentText = "📎 🧲"; }

    const row = document.createElement("tr");
    row.innerHTML = `<td>${experimentText}</td><td>✅</td>`;
    document.getElementById("resultsTable").appendChild(row);
    checkFinish();
}

function checkFinish() {
    if (testedMaterials.includes("📄") && testedMaterials.includes("🪟") && testedMaterials.includes("🪵")) {
        document.getElementById("finalQuestion").style.display = "block";
    }
}

document.getElementById("finalQuestion").style.display = "block";

const finalFeedbacks = {
    correct: { icon: "🎉", text: "آفرین! آهنربا از پشت بعضی مواد هم می‌تونه اثر کنه." },
    wrong:   { icon: "🤔", text: "نه دقیقاً! به نتایج جدول دوباره نگاه کن. گیره از پشت مانع هم جذب شد!" }
};

document.querySelectorAll(".finalAnswer").forEach(btn => {
    btn.addEventListener("click", () => {
        const isCorrect = btn.classList.contains("correct");
        const fb = isCorrect ? finalFeedbacks.correct : finalFeedbacks.wrong;
        btn.style.background = isCorrect ? "#22c55e" : "#ef4444";
        btn.style.color = "white";
        if (isCorrect) score += 15;
        showFeedback(isCorrect, fb.icon, fb.text, () => {
            if (isCorrect) document.getElementById("page4Next").style.display = "inline-block";
        });
    });
});

// =========================
// صفحه ۵ — آهنرباها
// =========================

(function initPage5() {

    const container = document.getElementById("magnetGame");
    if (!container) return;

    container.style.cssText = `
        position: relative; width: 100%; height: 340px;
        margin: 30px 0; background: #f8fafc;
        border-radius: 20px; overflow: hidden;
    `;

    const style = document.createElement("style");
    style.textContent = `
        .mag5 { position:absolute; width:150px; height:70px; display:flex; cursor:grab; box-shadow:0 5px 15px rgba(0,0,0,.2); user-select:none; }
        .mag5:active { cursor:grabbing; }
        .pole5 { width:50%; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:bold; color:white; }
        .red5  { background:#e53935; }
        .blue5 { background:#1e88e5; }
    `;
    document.head.appendChild(style);

    container.innerHTML = `
        <div id="msg5" style="position:absolute;top:15px;left:50%;transform:translateX(-50%);font-size:17px;font-weight:bold;color:#3f51b5;background:white;padding:8px 20px;border-radius:20px;box-shadow:0 3px 10px rgba(0,0,0,.1);white-space:nowrap;transition:color .3s;z-index:5;">آهنرباها را به هم نزدیک کن</div>
        <div id="magA5" class="mag5" style="left:80px;top:130px;">
            <div class="pole5 red5">N</div>
            <div class="pole5 blue5">S</div>
        </div>
        <div id="magB5" class="mag5" style="left:560px;top:130px;">
            <div class="pole5 red5">N</div>
            <div class="pole5 blue5">S</div>
        </div>
        <button id="flipBtn5" style="position:absolute;bottom:15px;left:50%;transform:translateX(-50%);background:linear-gradient(45deg,#7c3aed,#4f46e5);color:white;padding:10px 28px;border-radius:30px;font-size:15px;cursor:pointer;border:none;">🔄 برگرداندن آهنربای دوم</button>
    `;

    const magA    = document.getElementById("magA5");
    const magB    = document.getElementById("magB5");
    const msg     = document.getElementById("msg5");
    const flipBtn = document.getElementById("flipBtn5");

    let flipped  = false;
    let discovered = { repel: false, attract: false };

    flipBtn.addEventListener("click", () => {
        flipped = !flipped;
        magB.innerHTML = flipped
            ? `<div class="pole5 blue5">S</div><div class="pole5 red5">N</div>`
            : `<div class="pole5 red5">N</div><div class="pole5 blue5">S</div>`;
        flipBtn.textContent = flipped ? "🔄 برگشت به حالت اول" : "🔄 برگرداندن آهنربای دوم";
    });

    function getCenters() {
        return {
            ax: magA.offsetLeft + 75, ay: magA.offsetTop + 35,
            bx: magB.offsetLeft + 75, by: magB.offsetTop + 35
        };
    }

    // ─── اصلاح‌شده: منطق صحیح جذب/دفع ───
    function isAttract(c) {
        const dx = c.bx - c.ax;
        const dy = c.by - c.ay;
        const angle = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);
        const isHorizontal = angle < 50 || angle > 130;
        const aIsLeft = c.ax < c.bx;

        // قطب نزدیک magA به magB
        const nearA = aIsLeft ? "S" : "N";
        // قطب نزدیک magB به magA
        const nearB = !flipped
            ? (aIsLeft ? "N" : "S")
            : (aIsLeft ? "S" : "N");

        const opposite = nearA !== nearB;
        // افقی: ناهم‌نام → جذب | عمودی: هم‌نام → جذب
        return isHorizontal ? opposite : !opposite;
    }

    function clamp(el) {
        el.style.left = Math.max(0, Math.min(el.offsetLeft, container.offsetWidth  - el.offsetWidth))  + "px";
        el.style.top  = Math.max(0, Math.min(el.offsetTop,  container.offsetHeight - el.offsetHeight)) + "px";
    }

    function physicsLoop() {
        const c  = getCenters();
        const dx = c.bx - c.ax;
        const dy = c.by - c.ay;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 200) {
            msg.textContent = "آهنرباها را به هم نزدیک کن";
            msg.style.color = "#3f51b5";
        } else if (isAttract(c)) {
            msg.textContent = "💕 جذب! قطب‌های ناهم‌نام هم‌دیگر را می‌کشند";
            msg.style.color = "#10b981";
            discovered.attract = true;
            if (dist > 90) {
                const f = 0.03;
                magA.style.left = (magA.offsetLeft + dx * f) + "px";
                magA.style.top  = (magA.offsetTop  + dy * f) + "px";
                magB.style.left = (magB.offsetLeft - dx * f) + "px";
                magB.style.top  = (magB.offsetTop  - dy * f) + "px";
                clamp(magA); clamp(magB);
            }
        } else {
            msg.textContent = "⚡ دفع! قطب‌های هم‌نام هم‌دیگر را پس می‌زنند";
            msg.style.color = "#e53935";
            discovered.repel = true;
            const f = 0.04;
            magA.style.left = (magA.offsetLeft - dx * f) + "px";
            magA.style.top  = (magA.offsetTop  - dy * f) + "px";
            magB.style.left = (magB.offsetLeft + dx * f) + "px";
            magB.style.top  = (magB.offsetTop  + dy * f) + "px";
            clamp(magA); clamp(magB);
        }

        if (discovered.repel && discovered.attract) {
            const nextBtn = document.getElementById("page5Next");
            if (nextBtn) nextBtn.style.display = "inline-block";
        }

        requestAnimationFrame(physicsLoop);
    }

    function makeDraggable(el) {
        let active = false, startX, startY, startLeft, startTop;
        el.addEventListener("mousedown", (e) => {
            active = true;
            startX = e.clientX; startY = e.clientY;
            startLeft = el.offsetLeft; startTop = el.offsetTop;
            el.style.zIndex = 10;
            e.preventDefault();
        });
        document.addEventListener("mousemove", (e) => {
            if (!active) return;
            let nx = startLeft + (e.clientX - startX);
            let ny = startTop  + (e.clientY - startY);
            nx = Math.max(0, Math.min(nx, container.offsetWidth  - el.offsetWidth));
            ny = Math.max(0, Math.min(ny, container.offsetHeight - el.offsetHeight));
            el.style.left = nx + "px";
            el.style.top  = ny + "px";
        });
        document.addEventListener("mouseup", () => { active = false; el.style.zIndex = 1; });
    }

    makeDraggable(magA);
    makeDraggable(magB);
    physicsLoop();

})();

// =========================
// صفحه ۷ — کاربردها
// =========================

function initPage7() {
    const container = document.getElementById("appGame");
    if (!container) return;

    container.style.cssText = `
        position:relative; width:100%; height:420px; background:#f0f4ff;
        border-radius:20px; margin:20px 0; user-select:none; overflow:hidden;
    `;

    const devices = [
        { id:"compass", label:"قطب‌نما",       video:"./assets/videos/compass.mp4", col:"left",  row:0 },
        { id:"speaker", label:"بلندگو",         video:"./assets/videos/speaker.mp4", col:"left",  row:1 },
        { id:"fridge",  label:"یخچال",          video:"./assets/videos/fridge.mp4",  col:"right", row:0 },
        { id:"washing", label:"ماشین لباسشویی", video:"./assets/videos/washing.mp4", col:"right", row:1 },
    ];

    const CARD_W = 130, CARD_H = 110, ROW_GAP = 40, PAD_TOP = 40, LEFT_X = 30;
    let html = "";

    devices.forEach(d => {
        const y = PAD_TOP + d.row * (CARD_H + ROW_GAP);
        const posStyle = d.col === "left" ? `left:${LEFT_X}px;top:${y}px;` : `right:${LEFT_X}px;top:${y}px;`;
        html += `
            <div id="dev_${d.id}" style="position:absolute;${posStyle}width:${CARD_W}px;text-align:center;">
                <video id="vid_${d.id}" src="${d.video}" loop muted playsinline preload="auto"
                    style="width:${CARD_W}px;height:${CARD_H}px;object-fit:cover;border-radius:14px;display:block;
                    box-shadow:0 4px 12px rgba(0,0,0,.2);border:3px solid transparent;
                    transition:border .2s,filter .2s,transform .2s;"></video>
                <div style="font-size:13px;margin-top:6px;color:#444;font-weight:bold;">${d.label}</div>
            </div>`;
    });

    html += `<div id="dragMag7" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:72px;cursor:grab;z-index:10;line-height:1;filter:drop-shadow(0 4px 10px rgba(0,0,0,.3));touch-action:none;">🧲</div>`;
    container.innerHTML = html;

    function getDeviceCenters() {
        return devices.map(d => {
            const el = document.getElementById("dev_" + d.id);
            if (!el) return null;
            const rect  = el.getBoundingClientRect();
            const cRect = container.getBoundingClientRect();
            return { id: d.id, cx: rect.left - cRect.left + CARD_W / 2, cy: rect.top - cRect.top + CARD_H / 2 };
        }).filter(Boolean);
    }

    const dragMag = document.getElementById("dragMag7");
    let active = false, sx, sy, sl, st;

    function startDrag(cx, cy) {
        active = true;
        sx = cx; sy = cy;
        sl = dragMag.offsetLeft; st = dragMag.offsetTop;
    }

    dragMag.addEventListener("mousedown",  (e) => { startDrag(e.clientX, e.clientY); dragMag.style.cursor = "grabbing"; e.preventDefault(); });
    dragMag.addEventListener("touchstart", (e) => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });

    function move(cx, cy) {
        let nx = Math.max(0, Math.min(sl + (cx - sx), container.offsetWidth  - 72));
        let ny = Math.max(0, Math.min(st + (cy - sy), container.offsetHeight - 72));
        dragMag.style.left = nx + "px";
        dragMag.style.top  = ny + "px";
        dragMag.style.transform = "none";
        checkEffects();
    }

    document.addEventListener("mousemove",  (e) => { if (active) move(e.clientX, e.clientY); });
    document.addEventListener("touchmove",  (e) => { if (active) { const t = e.touches[0]; move(t.clientX, t.clientY); e.preventDefault(); } }, { passive: false });
    document.addEventListener("mouseup",    ()  => { active = false; dragMag.style.cursor = "grab"; });
    document.addEventListener("touchend",   ()  => { active = false; });

    function checkEffects() {
        const mx = dragMag.offsetLeft + 36;
        const my = dragMag.offsetTop  + 36;
        getDeviceCenters().forEach(({ id, cx, cy }) => {
            const vid = document.getElementById("vid_" + id);
            if (!vid) return;
            const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
            if (dist < 80) {
                vid.style.border     = "3px solid #fbbf24";
                vid.style.filter     = "brightness(1.15) drop-shadow(0 0 10px #fbbf24)";
                vid.style.transform  = "scale(1.05)";
                vid.play().catch(() => {});
            } else {
                vid.style.border     = "3px solid transparent";
                vid.style.filter     = "none";
                vid.style.transform  = "scale(1)";
                vid.pause();
                vid.currentTime = 0;
            }
        });
    }
}

// =========================
// صفحه ۸ — ارزشیابی
// =========================

let draggedItem = null;

// ─── فقط آیتم‌های صفحه ۸ ───
document.querySelectorAll("#page8 .drag-item").forEach(item => {
    item.draggable = true;
    item.addEventListener("dragstart", () => { draggedItem = item; });
});

document.querySelectorAll("#page8 .basket").forEach(basket => {
    basket.addEventListener("dragover", (e) => { e.preventDefault(); });
    basket.addEventListener("drop", () => {
        if (!draggedItem) return;
        basket.appendChild(draggedItem);
        draggedItem = null;
        // رنگ موقت تا کاربر دکمه بررسی بزنه
        document.querySelectorAll("#page8 .basket").forEach(b => {
            b.style.background = b.classList.contains("yes") ? "#d1fae5" : "#fee2e2";
        });
        document.getElementById("page8Next").style.display = "none";
    });
});

function checkAnswers() {
    const yesItems = ["📎", "🔑", "🧷"];
    let allCorrect = true;

    document.querySelectorAll("#page8 .basket").forEach(basket => {
        const isYesBasket = basket.classList.contains("yes");
        const items = basket.querySelectorAll(".drag-item");
        if (items.length === 0) {
            basket.style.background = "#fca5a5";
            allCorrect = false;
            return;
        }
        const basketCorrect = Array.from(items).every(item => {
            const text = item.textContent.trim();
            return isYesBasket ? yesItems.includes(text) : !yesItems.includes(text);
        });
        basket.style.background = basketCorrect ? "#86efac" : "#fca5a5";
        if (!basketCorrect) allCorrect = false;
    });

    if (allCorrect) {
        score += 20;
        showFeedback(true, "🎉", "آفرین! همه وسایل را درست جای گذاشتی!", () => {
            document.getElementById("page8Next").style.display = "inline-block";
        });
    } else {
        showFeedback(false, "🤔", "بعضی وسایل در جای اشتباه هستند. دوباره امتحان کن!", null);
    }
}

// =========================
// صفحه ۹ — گنج دانش
// =========================

let p9FlippedCount = 0;
let p9QuizScore    = 0;
let p9QuizAnswered = 0;

function setupPage9() {
    p9FlippedCount = 0;
    p9QuizScore    = 0;
    p9QuizAnswered = 0;

    document.querySelectorAll(".flip-inner").forEach(el => el.classList.remove("flipped"));

    const btn1 = document.getElementById("step1Btn");
    if (btn1) { btn1.style.opacity = "0.4"; btn1.style.pointerEvents = "none"; }

    p9ShowStep(1);
}

function p9ShowStep(n) {
    ["p9-step1", "p9-step2", "p9-step3", "p9-chest"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    const target = document.getElementById(n === "chest" ? "p9-chest" : "p9-step" + n);
    if (target) target.style.display = "block";

    ["dot1", "dot2", "dot3", "dotChest"].forEach((id, i) => {
        const dot = document.getElementById(id);
        if (!dot) return;
        dot.classList.remove("active", "done");
        const stepNum = i + 1;
        if      (n === "chest")   dot.classList.add("done");
        else if (stepNum < n)     dot.classList.add("done");
        else if (stepNum === n)   dot.classList.add("active");
    });

    if (n === "chest") document.getElementById("dotChest").classList.add("active");
}

function flipCard(card, id) {
    const inner = document.getElementById(id);
    if (!inner.classList.contains("flipped")) {
        inner.classList.add("flipped");
        p9FlippedCount++;
        if (p9FlippedCount >= 3) {
            const btn = document.getElementById("step1Btn");
            if (btn) { btn.style.opacity = "1"; btn.style.pointerEvents = "auto"; }
        }
    }
}

function goStep2() { p9ShowStep(2); initPuzzle9(); }
function goStep3() { p9ShowStep(3); initQuiz9();   }

function openChest() {
    p9ShowStep("chest");

    // گرفتن اسم
    const nameInput = document.getElementById("studentNameInput");
    if (nameInput && nameInput.value.trim()) {
        studentName = nameInput.value.trim();
    }

    const chest = document.getElementById("chestAnim");
    if (!chest) return;

    // انیمیشن باز شدن صندوق
    const frames = ["🔒", "🔓", "📦", "🎁", "🏆"];
    frames.forEach((f, i) => setTimeout(() => { chest.textContent = f; }, i * 400));

    setTimeout(() => {
        const cert = document.getElementById("certificate");
        if (cert) {
            cert.style.display = "block";
            cert.innerHTML = buildJourneyAndCert();
        }
    }, frames.length * 400 + 200);
}

function initPuzzle9() {
    const area = document.getElementById("puzzleArea");
    if (!area) return;

    area.innerHTML = `
        <div style="position:absolute;top:12px;left:50%;transform:translateX(-50%);font-size:13px;color:#666;white-space:nowrap;">
            قطعه راست را بکش. اگه دفع کرد، برگردانش!
        </div>

        <!-- ریل افقی -->
        <div style="
            position:absolute; top:50%; left:20px; right:20px; height:3px;
            background:#ddd; border-radius:2px; transform:translateY(-50%);
        "></div>

        <!-- آهنربای چپ (ثابت) -->
        <div id="mp9-left" style="
            position:absolute; left:40px; top:50%; transform:translateY(-50%);
            width:130px; height:64px; display:flex; border-radius:8px;
            box-shadow:0 5px 18px rgba(0,0,0,.2); pointer-events:none;
        ">
            <div style="width:50%;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:bold;color:white;background:#e53935;border-radius:8px 0 0 8px;">N</div>
            <div style="width:50%;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:bold;color:white;background:#1e88e5;border-radius:0 8px 8px 0;">S</div>
        </div>

        <!-- آهنربای راست (متحرک) — اول برعکسه: S|N -->
        <div id="mp9-right" style="
            position:absolute; left:420px; top:50%; transform:translateY(-50%);
            width:130px; height:64px; display:flex; border-radius:8px;
            box-shadow:0 5px 18px rgba(0,0,0,.2); cursor:grab;
        ">
            <div id="mp9-rL" style="width:50%;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:bold;color:white;background:#1e88e5;border-radius:8px 0 0 8px;">S</div>
            <div id="mp9-rR" style="width:50%;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:bold;color:white;background:#e53935;border-radius:0 8px 8px 0;">N</div>
        </div>

        <div id="p9msg" style="
            position:absolute; bottom:18px; left:50%; transform:translateX(-50%);
            font-size:16px; font-weight:bold; white-space:nowrap; min-height:24px; color:#555;
        ">آهنرباها را به هم نزدیک کن</div>

        <button id="mp9-flip" style="
            position:absolute; top:12px; right:16px;
            background:linear-gradient(45deg,#7c3aed,#4f46e5);
            color:white; padding:7px 18px; border-radius:20px;
            font-size:13px; cursor:pointer; border:none;
        ">🔄 برگرداندن قطعه</button>
    `;

    const step2Btn = document.getElementById("step2Btn");
    if (step2Btn) step2Btn.style.display = "none";

    // وضعیت اولیه: S|N  (سمت چپ magB = S، رو به magA که S داره → هم‌نام → دفع)
    let rightFlipped = false;  // false = S|N  ,  true = N|S
    let solved = false;

    // ─── flip ───
    document.getElementById("mp9-flip").onclick = function () {
        if (solved) return;
        rightFlipped = !rightFlipped;
        const rL = document.getElementById("mp9-rL");
        const rR = document.getElementById("mp9-rR");
        if (rightFlipped) {
            // N|S — سمت چپ magB = N، رو به S magA → ناهم‌نام → جذب
            rL.textContent = "N"; rL.style.background = "#e53935";
            rR.textContent = "S"; rR.style.background = "#1e88e5";
        } else {
            // S|N — دفع
            rL.textContent = "S"; rL.style.background = "#1e88e5";
            rR.textContent = "N"; rR.style.background = "#e53935";
        }
        updateMsg();
    };

    // ─── drag فقط افقی ───
    const right = document.getElementById("mp9-right");
    let active = false, sx, sl;

    // top ثابت میمونه — فقط left تغییر میکنه
    function getRailTop() {
        return area.offsetHeight / 2 - 32; // 32 = نصف ارتفاع آهنربا
    }

    right.addEventListener("mousedown", function (e) {
        if (solved) return;
        active = true;
        sx = e.clientX;
        sl = right.offsetLeft;
        right.style.zIndex = 10;
        right.style.cursor = "grabbing";
        e.preventDefault();
    });

    const onMove = function (e) {
        if (!active) return;
        const fixed = document.getElementById("mp9-left");
        const minX  = fixed.offsetLeft + fixed.offsetWidth + 2; // نمیتونه از آهنربای چپ رد بشه
        const maxX  = area.offsetWidth - right.offsetWidth - 4;
        let nx = Math.max(minX, Math.min(sl + (e.clientX - sx), maxX));
        right.style.left = nx + "px";
        right.style.top  = getRailTop() + "px"; // عمودی قفله
        right.style.transform = "none";
        checkSnap();
    };

    const onUp = function () {
        active = false;
        right.style.cursor = "grab";
        right.style.zIndex = 1;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",   onUp);

    function updateMsg() {
        if (solved) return;
        const gap = right.offsetLeft - (document.getElementById("mp9-left").offsetLeft + 130);
        const msg = document.getElementById("p9msg");
        if (gap > 60) {
            msg.textContent = rightFlipped
                ? "حالا نزدیک کن — باید جذب بشن 💕"
                : "⚡ این حالت دفع می‌کنه — دکمه برگردان رو بزن";
            msg.style.color = rightFlipped ? "#10b981" : "#e53935";
        } else {
            checkSnap();
        }
    }

    function checkSnap() {
        if (solved) return;
        const fixed  = document.getElementById("mp9-left");
        const gap    = right.offsetLeft - (fixed.offsetLeft + fixed.offsetWidth);
        const msg    = document.getElementById("p9msg");
        const lPole  = document.getElementById("mp9-rL").textContent.trim();

        if (gap <= 4) {
            // مماس شدن
            if (lPole === "N" && rightFlipped) {
                // جذب — آهنربای جدید تشکیل میشه
                solved = true;
                right.style.left   = (fixed.offsetLeft + fixed.offsetWidth + 2) + "px";
                right.style.top    = getRailTop() + "px";
                right.style.transform = "none";
                right.style.cursor = "default";
                right.style.zIndex = 1;

                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("mouseup",   onUp);
                document.getElementById("mp9-flip").style.display = "none";

                // انیمیشن تبدیل به آهنربای جدید
                formNewMagnet(fixed);

            } else {
                // دفع — هل بده عقب
                msg.textContent = "⚡ دفع! قطعه را برگردان!";
                msg.style.color = "#ef4444";
                right.style.left = (fixed.offsetLeft + fixed.offsetWidth + 30) + "px";
                sl = right.offsetLeft;
            }
        } else if (gap < 60) {
            msg.textContent = rightFlipped ? "💕 نزدیک‌تر..." : "⚡ دفع میکنه!";
            msg.style.color = rightFlipped ? "#10b981" : "#ef4444";
        }
    }

    function formNewMagnet(fixed) {
        const msg = document.getElementById("p9msg");
        msg.textContent = "💕 جذب شدند!";
        msg.style.color = "#22c55e";

        // مرحله ۱: پیام جذب (400ms)
        setTimeout(() => {
            msg.textContent = "✨ آهنربای جدید ساخته شد!";
            msg.style.color = "#7c3aed";

            // آهنربای چپ → کاملاً آبی با S
            fixed.innerHTML = `
                <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;
                    font-size:28px;font-weight:bold;color:white;background:#1e88e5;
                    border-radius:8px;letter-spacing:2px;">S</div>
            `;

            // آهنربای راست → کاملاً قرمز با N
            right.innerHTML = `
                <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;
                    font-size:28px;font-weight:bold;color:white;background:#e53935;
                    border-radius:8px;letter-spacing:2px;">N</div>
            `;

            // مرحله ۲: نوار اتصال بین دو تا (نشون بده به هم وصلن)
            setTimeout(() => {
                const connector = document.createElement("div");
                connector.style.cssText = `
                    position:absolute;
                    left:${fixed.offsetLeft}px;
                    top:${getRailTop()}px;
                    width:${right.offsetLeft + right.offsetWidth - fixed.offsetLeft}px;
                    height:64px;
                    border:3px solid #7c3aed;
                    border-radius:10px;
                    pointer-events:none;
                    box-sizing:border-box;
                `;
                area.appendChild(connector);

                // مرحله ۳: نمایش دکمه بعد
                setTimeout(() => {
                    if (step2Btn) step2Btn.style.display = "inline-block";
                }, 600);
            }, 400);

        }, 400);
    }

    // تنظیم جای اولیه روی ریل
    right.style.top       = getRailTop() + "px";
    right.style.transform = "none";
    updateMsg();
}

function initQuiz9() {
    const area = document.getElementById("quizArea");
    if (!area) return;
    p9QuizScore    = 0;
    p9QuizAnswered = 0;

    const step3Btn   = document.getElementById("step3Btn");
    const quizResult = document.getElementById("quizResult");
    if (step3Btn)   step3Btn.style.display  = "none";
    if (quizResult) quizResult.textContent  = "";

    const questions = [
        {
            q:       "۱. کدام جسم به آهنربا جذب می‌شود؟",
            opts:    ["📎 گیره فلزی", "✏️ مداد", "📄 کاغذ"],
            correct: 0,
            explain: "فقط اجسام فلزی مثل گیره به آهنربا جذب می‌شوند. مداد و کاغذ فلزی نیستند."
        },
        {
            q:       "۲. قطب‌های هم‌نام آهنربا چه می‌کنند؟",
            opts:    ["جذب می‌کنند", "دفع می‌کنند", "هیچ اثری ندارند"],
            correct: 1,
            explain: "قطب‌های هم‌نام (N-N یا S-S) همیشه یکدیگر را دفع می‌کنند. فقط قطب‌های ناهم‌نام جذب می‌کنند."
        },
        {
            q:       "۳. آهنربا از پشت کاغذ می‌تواند روی گیره اثر کند؟",
            opts:    ["بله، نیروی مغناطیسی از کاغذ رد می‌شود", "خیر، کاغذ مانع نیرو می‌شود"],
            correct: 0,
            explain: "نیروی مغناطیسی از مواد غیرفلزی مثل کاغذ، شیشه و چوب رد می‌شود و می‌تواند اثر کند."
        },
    ];

    // ساخت HTML سوالات
    area.innerHTML = `
        <div id="quiz-questions">
            ${questions.map((q, i) => `
                <div id="p9qb${i}" style="
                    margin-bottom:20px; background:#f8fafc;
                    border-radius:14px; padding:16px 18px;
                    border:2px solid #e2e8f0; transition:border .2s;
                ">
                    <p style="font-size:16px;font-weight:bold;margin:0 0 12px;color:#1e293b;">${q.q}</p>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${q.opts.map((o, j) => `
                            <label id="lbl${i}_${j}" style="
                                display:flex; align-items:center; gap:10px;
                                padding:10px 14px; border-radius:10px;
                                background:white; border:1.5px solid #e2e8f0;
                                cursor:pointer; transition:background .15s,border .15s;
                                font-size:15px; color:#334155;
                            ">
                                <input type="radio" name="q${i}" value="${j}"
                                    style="accent-color:#7c3aed;width:17px;height:17px;cursor:pointer;">
                                ${o}
                            </label>
                        `).join("")}
                    </div>
                </div>
            `).join("")}

            <!-- دکمه ثبت -->
            <div style="text-align:center;margin-top:8px;">
                <div id="quiz-warning" style="
                    color:#ef4444;font-size:14px;min-height:20px;
                    margin-bottom:8px;font-weight:500;
                "></div>
                <button id="submitQuizBtn" style="
                    background:linear-gradient(45deg,#7c3aed,#4f46e5);
                    color:white;padding:11px 32px;border-radius:24px;
                    font-size:16px;cursor:pointer;border:none;
                ">✅ ثبت پاسخ‌ها</button>
            </div>
        </div>

        <!-- نتیجه — اول مخفیه -->
        <div id="quiz-result-panel" style="display:none;">
            <!-- اسکور -->
            <div id="quiz-score-box" style="
                text-align:center;padding:20px;border-radius:16px;
                margin-bottom:20px;
            "></div>

            <!-- تحلیل سوالات غلط -->
            <div id="quiz-analysis"></div>

            <!-- دکمه مطالعه کردم -->
            <div style="text-align:center;margin-top:16px;">
                <button id="doneReadingBtn" style="
                    background:linear-gradient(45deg,#10b981,#059669);
                    color:white;padding:11px 30px;border-radius:24px;
                    font-size:15px;cursor:pointer;border:none;
                ">📖 مطالعه کردم، بریم جلو ➜</button>
            </div>
        </div>
    `;

    // هایلایت label هنگام انتخاب
    area.querySelectorAll("input[type=radio]").forEach(radio => {
        radio.addEventListener("change", function () {
            const qi = this.name.replace("q", "");
            area.querySelectorAll(`input[name="q${qi}"]`).forEach(r => {
                const lbl = r.closest("label");
                lbl.style.background = r.checked ? "#ede9fe" : "white";
                lbl.style.border     = r.checked ? "1.5px solid #7c3aed" : "1.5px solid #e2e8f0";
            });
        });
    });

    // ثبت پاسخ‌ها
    document.getElementById("submitQuizBtn").addEventListener("click", function () {
        const warning = document.getElementById("quiz-warning");

        // چک همه سوالات پر شده باشن
        const unanswered = questions.map((_, i) => {
            const sel = area.querySelector(`input[name="q${i}"]:checked`);
            return sel ? null : i + 1;
        }).filter(Boolean);

        if (unanswered.length > 0) {
            warning.textContent = `⚠️ سوال ${unanswered.join(" و ")} را هنوز پاسخ نداده‌ای!`;
            return;
        }
        warning.textContent = "";

        // جمع‌آوری پاسخ‌ها
        let correct = 0;
        const results = questions.map((q, i) => {
            const sel     = +area.querySelector(`input[name="q${i}"]:checked`).value;
            const isRight = sel === q.correct;
            if (isRight) correct++;
            return { q, selectedIdx: sel, isRight };
        });

        // رنگ‌گذاری گزینه‌ها
        results.forEach(({ q, selectedIdx, isRight }, i) => {
            const block = document.getElementById("p9qb" + i);
            block.style.border = isRight ? "2px solid #22c55e" : "2px solid #ef4444";
            q.opts.forEach((_, j) => {
                const lbl = document.getElementById(`lbl${i}_${j}`);
                if (j === q.correct) {
                    lbl.style.background = "#d1fae5";
                    lbl.style.border     = "1.5px solid #22c55e";
                } else if (j === selectedIdx && !isRight) {
                    lbl.style.background = "#fee2e2";
                    lbl.style.border     = "1.5px solid #ef4444";
                }
                lbl.style.cursor     = "default";
                lbl.querySelector("input").disabled = true;
            });
        });

        // محاسبه امتیاز
        p9QuizScore = correct;
        score += correct * 10;

        // نمایش پنل نتیجه
        document.getElementById("quiz-questions").style.pointerEvents = "none";
        document.getElementById("submitQuizBtn").style.display        = "none";

        const scoreBox = document.getElementById("quiz-score-box");
        const allRight = correct === questions.length;
        scoreBox.style.background = allRight ? "#d1fae5" : correct > 0 ? "#fef3c7" : "#fee2e2";
        scoreBox.innerHTML = `
            <div style="font-size:42px;margin-bottom:6px;">${allRight ? "🎉" : correct > 0 ? "👍" : "😔"}</div>
            <div style="font-size:22px;font-weight:bold;color:${allRight ? "#065f46" : correct > 0 ? "#92400e" : "#991b1b"};">
                ${correct} از ${questions.length} درست
            </div>
            <div style="font-size:14px;color:#64748b;margin-top:4px;">
                ${allRight ? "عالی! همه سوالات را درست جواب دادی." : "سوالات اشتباه را بخوان تا یاد بگیری."}
            </div>
        `;

        // تحلیل سوالات غلط
        const wrongOnes = results.filter(r => !r.isRight);
        const analysis  = document.getElementById("quiz-analysis");

        if (wrongOnes.length > 0) {
            analysis.innerHTML = `
                <div style="font-size:15px;font-weight:bold;color:#7c3aed;margin-bottom:12px;">
                    📌 توضیح سوالات اشتباه:
                </div>
                ${wrongOnes.map(({ q, selectedIdx }) => `
                    <div style="
                        background:#faf5ff; border-right:4px solid #7c3aed;
                        border-radius:10px; padding:14px 16px; margin-bottom:12px;
                    ">
                        <div style="font-size:15px;font-weight:bold;color:#1e293b;margin-bottom:8px;">${q.q}</div>
                        <div style="font-size:13px;color:#64748b;margin-bottom:6px;">
                            پاسخ تو: <span style="color:#ef4444;font-weight:500;">${q.opts[selectedIdx]}</span>
                            &nbsp;|&nbsp;
                            پاسخ درست: <span style="color:#22c55e;font-weight:500;">${q.opts[q.correct]}</span>
                        </div>
                        <div style="font-size:14px;color:#475569;line-height:1.7;">💡 ${q.explain}</div>
                    </div>
                `).join("")}
            `;
        } else {
            analysis.innerHTML = "";
        }

        document.getElementById("quiz-result-panel").style.display = "block";
        document.getElementById("quiz-result-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });

        // دکمه مطالعه کردم
        document.getElementById("doneReadingBtn").addEventListener("click", function () {
            if (step3Btn) step3Btn.style.display = "inline-block";
            this.style.display = "none";
        });
    });
}

function buildJourneyAndCert() {
    const name = studentName || "دانش‌آموز عزیز";
    const today = new Date();
    const dateStr = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric", month: "long", day: "numeric"
    }).format(today);

    const stops = [
        { icon: "🧲", title: "کشف آهنربا", desc: "برای اولین بار با آهنربا آشنا شدی و دیدی که چه چیزهایی را جذب می‌کند." },
        { icon: "🔍", title: "آزمایش روی میز", desc: "آهنربا را روی میز کشیدی و فهمیدی فقط اجسام فلزی جذب می‌شوند." },
        { icon: "📄", title: "راز نیروی پنهان", desc: "کشف کردی آهنربا از پشت کاغذ، شیشه و چوب هم می‌تواند اثر کند." },
        { icon: "🔴🔵", title: "دو قطب آهنربا", desc: "با قطب‌های N و S آشنا شدی — هم‌نام‌ها دفع، ناهم‌نام‌ها جذب می‌کنند." },
        { icon: "🏭", title: "آهنربا در زندگی", desc: "دیدی آهنربا در قطب‌نما، بلندگو، یخچال و ماشین لباسشویی به کار می‌رود." },
        { icon: "🧩", title: "آهنربای جدید", desc: "با ترکیب دو آهنربا، یک آهنربای کاملاً جدید ساختی!" },
        { icon: "💎", title: "ارزشیابی گنج", desc: "سه مرحله ارزشیابی را با موفقیت پشت سر گذاشتی و دانشت را به نمایش گذاشتی." },
    ];

    return `
    <!-- ───── سفرنامه ───── -->
    <div id="journey-section" style="
        font-family: inherit;
        background: #fefce8;
        border: 2.5px solid #d97706;
        border-radius: 20px;
        padding: 28px 32px;
        margin-bottom: 32px;
        position: relative;
        overflow: hidden;
    ">
        <!-- بافت کاغذ -->
        <div style="
            position:absolute;inset:0;
            background: repeating-linear-gradient(
                transparent, transparent 27px,
                #fde68a 28px
            );
            opacity:.35;pointer-events:none;
        "></div>

        <!-- هدر دفترچه -->
        <div style="position:relative;text-align:center;margin-bottom:24px;">
            <div style="font-size:36px;margin-bottom:6px;">🗺️</div>
            <h2 style="
                font-size:22px;color:#92400e;margin:0 0 4px;
                font-weight:bold;letter-spacing:1px;
            ">دفترچه سفر کاوشگر</h2>
            <p style="font-size:14px;color:#a16207;margin:0;">
                کاوشگر: <strong>${name}</strong> &nbsp;|&nbsp; تاریخ: ${dateStr}
            </p>
            <div style="
                margin:12px auto 0;width:60px;height:3px;
                background:linear-gradient(90deg,#d97706,#f59e0b);
                border-radius:2px;
            "></div>
        </div>

        <!-- ایستگاه‌ها -->
        <div style="position:relative;">
            <!-- خط عمودی مسیر -->
            <div style="
                position:absolute;right:19px;top:0;bottom:0;width:3px;
                background:linear-gradient(180deg,#f59e0b,#d97706);
                border-radius:2px;
            "></div>

            ${stops.map((s, i) => `
            <div style="
                display:flex;align-items:flex-start;gap:16px;
                margin-bottom:${i < stops.length - 1 ? "20px" : "0"};
                position:relative;
            ">
                <!-- آیکون ایستگاه -->
                <div style="
                    position:relative;z-index:1;
                    min-width:40px;height:40px;
                    background:#fff;border:2.5px solid #d97706;
                    border-radius:50%;display:flex;align-items:center;
                    justify-content:center;font-size:18px;
                    box-shadow:0 2px 6px rgba(217,119,6,.2);
                    flex-shrink:0;
                ">${s.icon}</div>

                <!-- محتوا -->
                <div style="
                    background:rgba(255,255,255,.75);
                    border:1px solid #fde68a;border-radius:12px;
                    padding:10px 14px;flex:1;
                ">
                    <div style="font-size:15px;font-weight:bold;color:#92400e;margin-bottom:3px;">
                        ایستگاه ${i + 1} — ${s.title}
                    </div>
                    <div style="font-size:13px;color:#78350f;line-height:1.7;">${s.desc}</div>
                </div>
            </div>`).join("")}
        </div>

        <!-- پایان سفر -->
        <div style="
            position:relative;text-align:center;margin-top:24px;
            padding-top:16px;border-top:1.5px dashed #d97706;
        ">
            <span style="font-size:22px;">🏁</span>
            <p style="font-size:14px;color:#92400e;margin:4px 0 0;font-weight:500;">
                سفر کاوشگری تو با موفقیت به پایان رسید!
            </p>
        </div>
    </div>

    <!-- دکمه رفتن به گواهی‌نامه -->
    <div style="text-align:center;margin-bottom:28px;">
        <button onclick="showCertificate()" style="
            background:linear-gradient(45deg,#1e40af,#3b82f6);
            color:white;padding:12px 32px;border-radius:28px;
            font-size:16px;cursor:pointer;border:none;
            box-shadow:0 4px 14px rgba(59,130,246,.4);
        ">🎖️ دریافت گواهی‌نامه ➜</button>
    </div>

    <!-- ───── گواهی‌نامه ───── -->
    <div id="cert-section" style="display:none;">
        <div id="cert-printable" style="
            background: linear-gradient(135deg, #fefef9 0%, #f0f7ff 100%);
            border: 4px double #1e40af;
            border-radius: 20px;
            padding: 40px 44px;
            text-align: center;
            position: relative;
            overflow: hidden;
        ">
            <!-- تزئین گوشه‌ها -->
            <div style="position:absolute;top:10px;right:10px;font-size:22px;opacity:.35;">✦</div>
            <div style="position:absolute;top:10px;left:10px;font-size:22px;opacity:.35;">✦</div>
            <div style="position:absolute;bottom:10px;right:10px;font-size:22px;opacity:.35;">✦</div>
            <div style="position:absolute;bottom:10px;left:10px;font-size:22px;opacity:.35;">✦</div>

            <!-- سربرگ -->
            <div style="font-size:44px;margin-bottom:8px;">🏅</div>
            <div style="
                font-size:13px;letter-spacing:3px;color:#1e40af;
                font-weight:bold;text-transform:uppercase;margin-bottom:4px;
            ">CERTIFICATE OF ACHIEVEMENT</div>
            <h2 style="
                font-size:24px;color:#1e3a8a;margin:0 0 20px;
                font-weight:bold;letter-spacing:1px;
            ">گواهی‌نامه دانشمند کوچک</h2>

            <div style="
                width:80px;height:2px;margin:0 auto 20px;
                background:linear-gradient(90deg,#1e40af,#3b82f6);
            "></div>

            <p style="font-size:16px;color:#475569;margin:0 0 10px;line-height:1.8;">
                این گواهی‌نامه با افتخار اعطا می‌شود به
            </p>

            <!-- اسم -->
            <div style="
                font-size:30px;font-weight:bold;color:#1e3a8a;
                border-bottom:2px solid #93c5fd;
                display:inline-block;padding:0 20px 6px;
                margin:0 0 20px;letter-spacing:1px;
            ">${name}</div>

            <p style="font-size:15px;color:#475569;line-height:1.9;margin:0 0 24px;">
                به‌خاطر تکمیل موفقیت‌آمیز درس <strong style="color:#1e40af;">«مهمان جدید کلاس ما»</strong><br>
                و کشف رازهای شگفت‌انگیز <strong style="color:#1e40af;">آهنربا</strong>
            </p>

            <!-- مهارت‌ها -->
            <div style="
                display:flex;justify-content:center;gap:16px;
                flex-wrap:wrap;margin-bottom:28px;
            ">
                ${[
                    ["🔬","آزمایشگر"],
                    ["🧲","متخصص آهنربا"],
                    ["🧩","حل‌کننده"],
                    ["🏆","کاوشگر"]
                ].map(([ic, lb]) => `
                <div style="
                    background:#eff6ff;border:1.5px solid #bfdbfe;
                    border-radius:20px;padding:6px 14px;
                    font-size:13px;color:#1e40af;font-weight:500;
                ">${ic} ${lb}</div>`).join("")}
            </div>

            <!-- تاریخ و مهر -->
            <div style="
                display:flex;justify-content:space-between;align-items:flex-end;
                border-top:1.5px solid #bfdbfe;padding-top:20px;margin-top:4px;
            ">
                <div style="text-align:right;">
                    <div style="font-size:12px;color:#94a3b8;margin-bottom:4px;">تاریخ صدور</div>
                    <div style="font-size:14px;color:#1e3a8a;font-weight:500;">${dateStr}</div>
                </div>

                <!-- مهر -->
                <div style="
                    width:80px;height:80px;border:3px solid #1e40af;
                    border-radius:50%;display:flex;flex-direction:column;
                    align-items:center;justify-content:center;
                    color:#1e40af;font-size:10px;font-weight:bold;
                    line-height:1.4;text-align:center;
                    box-shadow:inset 0 0 0 2px #bfdbfe;
                ">
                    <div style="font-size:20px;">🧲</div>
                    <div>تأیید شد</div>
                </div>

                <div style="text-align:left;">
                    <div style="font-size:12px;color:#94a3b8;margin-bottom:4px;">امضای مربی</div>
                    <div style="
                        font-size:20px;color:#1e3a8a;
                        font-family:cursive;letter-spacing:2px;
                        border-bottom:1.5px solid #93c5fd;padding-bottom:2px;
                    ">✍ مربی علوم</div>
                </div>
            </div>
        </div>

        <!-- دکمه پرینت -->
        <div style="text-align:center;margin-top:16px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <button onclick="window.print()" style="
                background:linear-gradient(45deg,#1e40af,#3b82f6);
                color:white;padding:10px 26px;border-radius:22px;
                font-size:14px;cursor:pointer;border:none;
            ">🖨️ چاپ گواهی‌نامه</button>
            <button onclick="location.reload()" style="
                background:linear-gradient(45deg,#7c3aed,#4f46e5);
                color:white;padding:10px 26px;border-radius:22px;
                font-size:14px;cursor:pointer;border:none;
            ">🔄 شروع دوباره</button>
        </div>
    </div>
    `;
}

function showCertificate() {
    const cert = document.getElementById("cert-section");
    if (cert) {
        cert.style.display = "block";
        cert.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// =========================
// شروع سفر از صفحه ۱
// =========================
function startJourney() {
    const input = document.getElementById("studentNameInput");
    if (input && input.value.trim()) {
        studentName = input.value.trim();
        nextPage(2);
    } else {
        if (input) {
            input.style.borderColor = "#ef4444";
            input.placeholder = "اول اسمت را بنویس! 😊";
            input.focus();
        }
    }
}
// =========================
// شروع
// =========================

updateProgress();
