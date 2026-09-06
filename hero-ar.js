/**
 * Custom hero surface (no Spline) + AR-style insight cards.
 * Click mesh → reticle → tether → HUD card just above the surface band.
 * Max 4 cards; revisiting a card dismisses the old one and respawns at the new click.
 */
import * as THREE from 'three';

const CARDS = [
    {
        text: 'The product triangle of PM, designer, and developer is collapsing. Execution is moving closer to the decision — you need fewer translators in the middle.',
        accent: '#4a90d9',
        code: 'TRIAD→NULL'
    },
    {
        text: 'Software is getting cheaper to produce. The scarce resource is no longer code, but judgment: knowing which problems are worth solving.',
        accent: '#d4a017',
        code: 'JUDGMENT'
    },
    {
        text: 'Fast AI slop will always be slop. I pair product judgment with the ability to build, so teams ship the right thing — not just more things.',
        accent: '#7cb342',
        code: 'CRAFT≠SLOP'
    },
    {
        text: 'Every AI agent needs a human who cares. Someone still has to own the outcome, know when the system is wrong, and decide what is worth doing.',
        accent: '#ab47bc',
        code: 'OWN·OUTCOME'
    }
];

const MAX_CARDS = 4;
const SEG = 72;

const canvas = document.getElementById('heroCanvas');
const wrap = document.getElementById('heroCanvasWrap');
const zone = document.getElementById('heroCardZone');
const tetherSvg = document.getElementById('arTetherLayer');
const hint = document.getElementById('heroSurfaceHint');

if (!canvas || !wrap || !zone || !tetherSvg) {
    throw new Error('Hero AR: missing required DOM nodes');
}

const isMobile = () => window.matchMedia('(max-width: 1024px)').matches;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Three.js ---------- */
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile(),
    alpha: true,
    powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile() ? 1.25 : 1.5));
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf4f1ea, 8, 26);
// Full-bleed canvas. Perspective frames a smaller, coarser landscape in the
// lower half — wide enough to run edge-to-edge, no CSS crop of the hero.
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
camera.position.set(0, 2.1, 4.6);
camera.lookAt(0, 0.0, -6.5);

scene.add(new THREE.AmbientLight(0xf4f1ea, 0.92));
const keyLight = new THREE.DirectionalLight(0xfff6e8, 0.8);
keyLight.position.set(3, 7, 4);
scene.add(keyLight);

// Extra-wide, shallow, low-poly surface — reads as ground plane, not a cut band
const surfaceGeo = new THREE.PlaneGeometry(72, 40, SEG, 48);
surfaceGeo.rotateX(-Math.PI / 2);
const basePositions = Float32Array.from(surfaceGeo.attributes.position.array);

const surfaceMesh = new THREE.Mesh(
    surfaceGeo,
    new THREE.MeshLambertMaterial({
        color: 0xe8e2d6,
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide
    })
);
surfaceMesh.position.set(0, 0, -1.5);
scene.add(surfaceMesh);

const wireMesh = new THREE.Mesh(
    surfaceGeo,
    new THREE.MeshBasicMaterial({
        color: 0x1a1c1e,
        wireframe: true,
        transparent: true,
        opacity: 0.17
    })
);
wireMesh.position.set(0, 0.012, -1.5);
scene.add(wireMesh);

const nodes = new THREE.Group();
scene.add(nodes);
const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
const nodeCount = isMobile() ? 4 : 7;
for (let i = 0; i < nodeCount; i++) {
    const n = new THREE.Mesh(
        nodeGeo,
        new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? 0xb87333 : 0xd4a017,
            transparent: true,
            opacity: 0.9,
            depthTest: false,
            depthWrite: false
        })
    );
    n.userData = {
        ox: (Math.random() - 0.5) * 40,
        oz: (Math.random() - 0.5) * 18,
        phase: Math.random() * Math.PI * 2,
        amp: 0.12 + Math.random() * 0.18
    };
    nodes.add(n);
}

const ripples = [];
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();
let hoverPoint = null;
let heroVisible = true;
let deformTick = 0;

function heightField(x, z, t) {
    return (
        Math.sin(x * 0.16 + t * 0.28) * 0.12 +
        Math.cos(z * 0.2 - t * 0.22) * 0.09 +
        Math.sin((x + z) * 0.09 + t * 0.12) * 0.05
    );
}

function deform(t) {
    const pos = surfaceGeo.attributes.position;
    const arr = pos.array;
    const hasRipples = ripples.length > 0;
    const hover = hoverPoint;

    for (let i = 0; i < pos.count; i++) {
        const ix = i * 3;
        const x = basePositions[ix];
        const z = basePositions[ix + 2];
        let y = heightField(x, z, t);

        if (hasRipples) {
            for (let r = 0; r < ripples.length; r++) {
                const ripple = ripples[r];
                const age = t - ripple.t0;
                if (age < 0 || age > 2.2) continue;
                const dist = Math.hypot(x - ripple.x, z - ripple.z);
                if (dist > 4.5) continue;
                y += Math.sin(dist * 4.0 - age * 8) * Math.exp(-age * 1.7) * Math.exp(-dist * 0.4) * 0.45;
            }
        }

        if (hover) {
            const dist = Math.hypot(x - hover.x, z - hover.z);
            if (dist < 2.2) y += Math.exp(-dist * dist * 1.6) * 0.1;
        }

        arr[ix + 1] = y;
    }
    pos.needsUpdate = true;
    if ((deformTick & 1) === 0) surfaceGeo.computeVertexNormals();

    for (let i = 0; i < nodes.children.length; i++) {
        const n = nodes.children[i];
        const { ox, oz, phase, amp } = n.userData;
        n.position.set(ox, surfaceYAt(ox, oz, t) + 0.22 + Math.sin(t * 1.2 + phase) * amp, oz);
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
        if (t - ripples[i].t0 > 2.3) ripples.splice(i, 1);
    }
}

function syncSvgSize() {
    const w = Math.max(1, Math.round(zone.clientWidth));
    const h = Math.max(1, Math.round(zone.clientHeight));
    tetherSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    tetherSvg.setAttribute('width', String(w));
    tetherSvg.setAttribute('height', String(h));
}

function resize() {
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    syncSvgSize();
    syncTethers();
}

function projectWorldToZone(worldVec3) {
    const v = worldVec3.clone().project(camera);
    const canvasRect = canvas.getBoundingClientRect();
    const zoneRect = zone.getBoundingClientRect();
    return {
        x: ((v.x + 1) / 2) * canvasRect.width + (canvasRect.left - zoneRect.left),
        y: ((-v.y + 1) / 2) * canvasRect.height + (canvasRect.top - zoneRect.top)
    };
}

function surfaceYAt(x, z, t) {
    let y = heightField(x, z, t);
    for (let r = 0; r < ripples.length; r++) {
        const ripple = ripples[r];
        const age = t - ripple.t0;
        if (age < 0 || age > 2.2) continue;
        const dist = Math.hypot(x - ripple.x, z - ripple.z);
        if (dist > 4.5) continue;
        y += Math.sin(dist * 4.0 - age * 8) * Math.exp(-age * 1.7) * Math.exp(-dist * 0.4) * 0.45;
    }
    if (hoverPoint) {
        const dist = Math.hypot(x - hoverPoint.x, z - hoverPoint.z);
        if (dist < 2.2) y += Math.exp(-dist * dist * 1.6) * 0.1;
    }
    return y;
}

/* ---------- AR cards ---------- */
let cardCursor = -1;
const activeAnchors = [];
let zTop = 20;

function nextCardIndex() {
    cardCursor = (cardCursor + 1) % CARDS.length;
    return cardCursor;
}

function createMarker(accentHex) {
    const accent = new THREE.Color(accentHex);
    const group = new THREE.Group();
    // depthTest off so the deforming terrain never covers markers
    const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.08, 0.12, 20),
        new THREE.MeshBasicMaterial({
            color: accent,
            transparent: true,
            opacity: 0.95,
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide
        })
    );
    ring.rotation.x = -Math.PI / 2;
    const core = new THREE.Mesh(
        new THREE.CircleGeometry(0.04, 16),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide
        })
    );
    core.rotation.x = -Math.PI / 2;
    core.position.y = 0.002;
    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.35, 6),
        new THREE.MeshBasicMaterial({
            color: accent,
            transparent: true,
            opacity: 0.85,
            depthTest: false,
            depthWrite: false
        })
    );
    stem.position.y = 0.175;
    group.renderOrder = 10;
    ring.renderOrder = 10;
    core.renderOrder = 11;
    stem.renderOrder = 10;
    group.add(ring, core, stem);
    scene.add(group);
    return group;
}

function makePath(accent) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('class', 'ar-tether-path');
    path.style.stroke = accent;
    tetherSvg.appendChild(path);

    const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pulse.setAttribute('r', '3.5');
    pulse.setAttribute('class', 'ar-tether-pulse');
    pulse.style.fill = accent;
    tetherSvg.appendChild(pulse);

    return { path, pulse };
}

/** Place cards just above the visual terrain band (~mid hero) so tethers stay short. */
function cardPlacement(clientInZone, indexAmongActive) {
    const zoneRect = zone.getBoundingClientRect();
    const cardW = Math.min(320, Math.max(240, zoneRect.width * 0.28));
    const cardH = 200;
    const count = Math.max(activeAnchors.length, 1);
    const fan = indexAmongActive - (count - 1) / 2;

    let left = (clientInZone?.x ?? zoneRect.width * 0.5) - cardW / 2 + fan * 28;
    // Prefer just above the click (short tether); keep within the mid-hero band
    const preferY = (clientInZone?.y ?? zoneRect.height * 0.55) - cardH - 20;
    let top = preferY + (indexAmongActive % 2) * 10;
    top = Math.max(zoneRect.height * 0.22, Math.min(zoneRect.height * 0.52 - cardH, top));

    left = Math.max(16, Math.min(zoneRect.width - cardW - 16, left));
    return { left, top, width: cardW };
}

function buildCardElement(card, index) {
    const el = document.createElement('article');
    el.className = 'ar-card is-loading';
    el.style.setProperty('--card-accent', card.accent);
    el.dataset.index = String(index);
    el.innerHTML = `
        <div class="ar-card-brackets" aria-hidden="true">
            <span class="ar-br tl"></span><span class="ar-br tr"></span>
            <span class="ar-br bl"></span><span class="ar-br br"></span>
        </div>
        <div class="ar-card-meta">
            <span class="ar-card-code">${card.code}</span>
            <span class="ar-card-status">LOCKING…</span>
            <button class="ar-card-close" type="button" aria-label="Dismiss insight">×</button>
        </div>
        <div class="ar-card-scan" aria-hidden="true"></div>
        <p class="ar-card-text"></p>
        <div class="ar-card-foot">SURFACE ANCHOR · LIVE</div>
    `;
    el.querySelector('.ar-card-text').textContent = card.text;
    return el;
}

function removeAnchorDom(anchor) {
    anchor.el.remove();
    anchor.path.remove();
    anchor.pulse.remove();
    scene.remove(anchor.marker);
    anchor.marker.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
    });
}

function dismissAnchor(anchor, immediate = false) {
    const i = activeAnchors.indexOf(anchor);
    if (i >= 0) activeAnchors.splice(i, 1);

    if (immediate) {
        removeAnchorDom(anchor);
        return;
    }

    anchor.el.classList.add('is-dismissing');
    anchor.path.classList.add('is-dismissing');
    anchor.pulse.classList.add('is-dismissing');
    window.setTimeout(() => removeAnchorDom(anchor), 280);
}

function spawnInsight(hitWorld, clientInZone) {
    const index = nextCardIndex();
    const card = CARDS[index];

    // Same insight already on screen → fade it out, then respawn at the new click
    const existing = activeAnchors.find((a) => a.cardIndex === index);
    if (existing) dismissAnchor(existing, false);

    while (activeAnchors.length >= MAX_CARDS) {
        dismissAnchor(activeAnchors[0], false);
    }

    const el = buildCardElement(card, index);
    const slot = cardPlacement(clientInZone, activeAnchors.length);
    el.style.left = `${slot.left}px`;
    el.style.top = `${slot.top}px`;
    el.style.width = `${slot.width}px`;
    el.style.zIndex = String(++zTop);
    zone.appendChild(el);


    const marker = createMarker(card.accent);
    const world = hitWorld.clone();
    world.y = surfaceYAt(world.x, world.z, clock.getElapsedTime()) + 0.05;
    marker.position.copy(world);

    const { path, pulse } = makePath(card.accent);
    const anchor = {
        el,
        world,
        accent: card.accent,
        path,
        pulse,
        marker,
        cardIndex: index,
        t0: performance.now()
    };
    activeAnchors.push(anchor);

    const reticle = document.createElement('div');
    reticle.className = 'ar-reticle';
    reticle.style.left = `${clientInZone.x}px`;
    reticle.style.top = `${clientInZone.y}px`;
    reticle.style.setProperty('--card-accent', card.accent);
    zone.appendChild(reticle);
    reticle.addEventListener('animationend', () => reticle.remove());

    requestAnimationFrame(() => {
        el.classList.add('is-drawing');
        syncTethers();
        const len = path.getTotalLength ? path.getTotalLength() : 420;
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
        path.getBoundingClientRect();
        path.style.transition = 'stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
        path.style.strokeDashoffset = '0';
    });

    window.setTimeout(() => {
        // Drop dash array after the draw-in so live tethers stay solid
        path.style.transition = 'none';
        path.style.strokeDasharray = 'none';
        path.style.strokeDashoffset = '0';
        el.classList.remove('is-loading', 'is-drawing');
        el.classList.add('is-live');
        const status = el.querySelector('.ar-card-status');
        if (status) status.textContent = 'ANCHORED';
    }, 750);

    el.querySelector('.ar-card-close').addEventListener('click', (e) => {
        e.stopPropagation();
        dismissAnchor(anchor);
    });

    el.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.ar-card-close')) return;
        if (isMobile()) return;
        beginDrag(anchor, e);
    });

    if (hint) hint.classList.add('is-hidden');
    ripples.push({ x: hitWorld.x, z: hitWorld.z, t0: clock.getElapsedTime() });
    if (ripples.length > 3) ripples.shift();
}

function syncTethers() {
    if (!activeAnchors.length) return;
    const t = clock.getElapsedTime();
    const tip = new THREE.Vector3();
    for (let i = 0; i < activeAnchors.length; i++) {
        const a = activeAnchors[i];
        a.world.y = surfaceYAt(a.world.x, a.world.z, t) + 0.05;
        a.marker.position.copy(a.world);

        // Connect to the stem tip so the line meets the marker, not empty air below
        tip.set(a.world.x, a.world.y + 0.34, a.world.z);
        const hit = projectWorldToZone(tip);
        const ax = (parseFloat(a.el.style.left) || 0) + a.el.offsetWidth * 0.5;
        const ay = (parseFloat(a.el.style.top) || 0) + a.el.offsetHeight - 2;
        const dx = hit.x - ax;
        const dy = hit.y - ay;
        // Path runs marker → card so draw-in and pulse rise up to meet the card.
        // Soft bends near both ends when offset; straight when aligned above.
        const absDx = Math.abs(dx);
        const side = dx === 0 ? 0 : Math.sign(dx);
        const curve = Math.min(48, absDx * 0.28);
        const c1x = hit.x - dx * 0.22 + side * curve * 0.28;
        const c1y = hit.y - dy * 0.2 - curve * 0.12;
        const c2x = ax + dx * 0.22 + side * curve * 0.42;
        const c2y = ay + dy * 0.2 - curve * 0.18;
        a.path.setAttribute('d', `M ${hit.x} ${hit.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${ax} ${ay}`);

        // Slow pulse marker → card, with a pause between runs
        const age = (performance.now() - a.t0) / 1000;
        const period = 3.6;
        const phase = (age % period) / period;
        if (phase < 0.5) {
            const u = phase / 0.5;
            const omu = 1 - u;
            const px =
                omu * omu * omu * hit.x +
                3 * omu * omu * u * c1x +
                3 * omu * u * u * c2x +
                u * u * u * ax;
            const py =
                omu * omu * omu * hit.y +
                3 * omu * omu * u * c1y +
                3 * omu * u * u * c2y +
                u * u * u * ay;
            a.pulse.setAttribute('cx', String(px));
            a.pulse.setAttribute('cy', String(py));
            a.pulse.style.opacity = String(u < 0.08 || u > 0.92 ? Math.min(u, 1 - u) * 12.5 : 1);
        } else {
            a.pulse.style.opacity = '0';
        }
    }
}

/* ---------- Drag ---------- */
let drag = null;

function beginDrag(anchor, e) {
    e.preventDefault();
    const rect = anchor.el.getBoundingClientRect();
    drag = {
        anchor,
        ox: e.clientX - rect.left,
        oy: e.clientY - rect.top
    };
    anchor.el.style.zIndex = String(++zTop);
    anchor.el.classList.add('is-dragging');
}

function onPointerMove(e) {
    if (!drag) return;
    const zoneRect = zone.getBoundingClientRect();
    const w = drag.anchor.el.offsetWidth;
    const h = drag.anchor.el.offsetHeight;
    let left = e.clientX - zoneRect.left - drag.ox;
    let top = e.clientY - zoneRect.top - drag.oy;
    left = Math.max(0, Math.min(zoneRect.width - w, left));
    top = Math.max(0, Math.min(zoneRect.height - h, top));
    drag.anchor.el.style.left = `${left}px`;
    drag.anchor.el.style.top = `${top}px`;
    syncTethers();
}

function onPointerUp() {
    if (!drag) return;
    drag.anchor.el.classList.remove('is-dragging');
    drag = null;
}

/* ---------- Interaction ---------- */
function pick(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(surfaceMesh, false)[0] || null;
}

let hoverRaf = 0;
canvas.addEventListener('pointermove', (e) => {
    if (hoverRaf) return;
    const { clientX, clientY } = e;
    hoverRaf = requestAnimationFrame(() => {
        hoverRaf = 0;
        const hit = pick(clientX, clientY);
        if (hit) {
            hoverPoint = { x: hit.point.x, z: hit.point.z };
            canvas.style.cursor = 'crosshair';
        } else {
            hoverPoint = null;
            canvas.style.cursor = 'default';
        }
    });
});

canvas.addEventListener('pointerleave', () => {
    hoverPoint = null;
});

canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const hit = pick(e.clientX, e.clientY);
    if (!hit) return;
    e.preventDefault();
    const zoneRect = zone.getBoundingClientRect();
    spawnInsight(hit.point, {
        x: e.clientX - zoneRect.left,
        y: e.clientY - zoneRect.top
    });
});

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);
window.addEventListener('resize', resize);

/* ---------- Loop ---------- */
function frame() {
    requestAnimationFrame(frame);
    if (!heroVisible || document.hidden) return;

    const t = clock.getElapsedTime();
    deformTick++;

    const skipDeform = prefersReducedMotion() || (isMobile() && (deformTick & 1) === 1);
    if (!skipDeform) deform(t);

    if (!prefersReducedMotion()) {
        camera.position.x = Math.sin(t * 0.08) * 0.2;
        camera.position.y = 2.1 + Math.sin(t * 0.1) * 0.035;
        camera.lookAt(0, 0.0, -6.5);
    }

    renderer.render(scene, camera);
    syncTethers();
}

new IntersectionObserver(
    (entries) => {
        heroVisible = entries.some((e) => e.isIntersecting);
    },
    { threshold: 0.05 }
).observe(wrap);

resize();
frame();
ripples.push({ x: 0.5, z: -0.4, t0: 0.2 });
