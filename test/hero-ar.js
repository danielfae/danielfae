/**
 * Custom hero surface (no Spline) + AR-style insight cards.
 * Click the mesh → reticle pins the hit → tether draws → HUD card materializes at the top.
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

const canvas = document.getElementById('heroCanvas');
const wrap = document.getElementById('heroCanvasWrap');
const zone = document.getElementById('heroCardZone');
const tetherSvg = document.getElementById('arTetherLayer');
const hint = document.getElementById('heroSurfaceHint');

if (!canvas || !wrap || !zone || !tetherSvg) {
    throw new Error('Hero AR: missing required DOM nodes');
}

const isMobile = () => window.matchMedia('(max-width: 1024px)').matches;

/* ---------- Three.js surface ---------- */
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0, 3.4, 6.2);
camera.lookAt(0, 0.2, 0);

scene.add(new THREE.AmbientLight(0xf4f1ea, 0.85));
const keyLight = new THREE.DirectionalLight(0xfff6e8, 1.05);
keyLight.position.set(4, 8, 3);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xb87333, 0.35);
fillLight.position.set(-5, 2, -2);
scene.add(fillLight);

const SEG = 96;
const surfaceGeo = new THREE.PlaneGeometry(14, 10, SEG, SEG);
surfaceGeo.rotateX(-Math.PI / 2);
const basePositions = Float32Array.from(surfaceGeo.attributes.position.array);

const surfaceMesh = new THREE.Mesh(
    surfaceGeo,
    new THREE.MeshStandardMaterial({
        color: 0xe8e2d6,
        roughness: 0.62,
        metalness: 0.18,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide
    })
);
scene.add(surfaceMesh);

const wireMesh = new THREE.Mesh(
    surfaceGeo.clone(),
    new THREE.MeshBasicMaterial({
        color: 0x1a1c1e,
        wireframe: true,
        transparent: true,
        opacity: 0.14
    })
);
wireMesh.position.y = 0.01;
scene.add(wireMesh);

const nodes = new THREE.Group();
scene.add(nodes);
const nodeGeo = new THREE.SphereGeometry(0.045, 10, 10);
for (let i = 0; i < 18; i++) {
    const n = new THREE.Mesh(
        nodeGeo,
        new THREE.MeshStandardMaterial({
            color: i % 3 === 0 ? 0xb87333 : 0xd4a017,
            emissive: i % 3 === 0 ? 0xb87333 : 0xd4a017,
            emissiveIntensity: 0.35,
            roughness: 0.4,
            metalness: 0.6
        })
    );
    n.userData = {
        ox: (Math.random() - 0.5) * 10,
        oz: (Math.random() - 0.5) * 7,
        phase: Math.random() * Math.PI * 2,
        amp: 0.15 + Math.random() * 0.25
    };
    nodes.add(n);
}

const ripples = [];
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();
let hoverPoint = null;

function heightField(x, z, t) {
    return (
        Math.sin(x * 0.55 + t * 0.55) * 0.28 +
        Math.cos(z * 0.7 - t * 0.4) * 0.22 +
        Math.sin((x + z) * 0.35 + t * 0.25) * 0.18 +
        Math.sin(Math.hypot(x, z) * 0.9 - t * 0.8) * 0.08
    );
}

function deform(t) {
    const pos = surfaceGeo.attributes.position;
    const wpos = wireMesh.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const ix = i * 3;
        const x = basePositions[ix];
        const z = basePositions[ix + 2];
        let y = heightField(x, z, t);

        for (const r of ripples) {
            const age = t - r.t0;
            if (age < 0 || age > 2.4) continue;
            const dist = Math.hypot(x - r.x, z - r.z);
            y += Math.sin(dist * 4.2 - age * 9) * Math.exp(-age * 1.6) * Math.exp(-dist * 0.35) * 0.55;
        }

        if (hoverPoint) {
            const dist = Math.hypot(x - hoverPoint.x, z - hoverPoint.z);
            y += Math.exp(-dist * dist * 1.8) * 0.12;
        }

        pos.array[ix + 1] = y;
        wpos.array[ix] = x;
        wpos.array[ix + 1] = y + 0.01;
        wpos.array[ix + 2] = z;
    }
    pos.needsUpdate = true;
    wpos.needsUpdate = true;
    surfaceGeo.computeVertexNormals();

    nodes.children.forEach((n) => {
        const { ox, oz, phase, amp } = n.userData;
        n.position.set(ox, heightField(ox, oz, t) + 0.2 + Math.sin(t * 1.4 + phase) * amp, oz);
    });

    for (let i = ripples.length - 1; i >= 0; i--) {
        if (t - ripples[i].t0 > 2.5) ripples.splice(i, 1);
    }
}

function resize() {
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
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
    return heightField(x, z, t);
}

/* ---------- AR cards + tethers ---------- */
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
    const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.08, 0.12, 32),
        new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.95, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    const core = new THREE.Mesh(
        new THREE.CircleGeometry(0.04, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
    );
    core.rotation.x = -Math.PI / 2;
    core.position.y = 0.002;
    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.35, 8),
        new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.85 })
    );
    stem.position.y = 0.175;
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

function cardSlotPosition(indexAmongActive) {
    const zoneRect = zone.getBoundingClientRect();
    const cardW = Math.min(340, Math.max(240, zoneRect.width * 0.3));
    const gap = 16;
    const top = isMobile() ? 12 : 28;
    const maxRow = Math.max(1, Math.floor((zoneRect.width - 48) / (cardW + gap)));
    const slot = indexAmongActive % maxRow;
    return { left: 24 + slot * (cardW + gap), top, width: cardW };
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
        <header class="ar-card-meta">
            <span class="ar-card-code">${card.code}</span>
            <span class="ar-card-status">LOCKING…</span>
            <button class="ar-card-close" type="button" aria-label="Dismiss insight">×</button>
        </header>
        <div class="ar-card-scan" aria-hidden="true"></div>
        <p class="ar-card-text"></p>
        <footer class="ar-card-foot">SURFACE ANCHOR · LIVE</footer>
    `;
    el.querySelector('.ar-card-text').textContent = card.text;
    return el;
}

function spawnInsight(hitWorld, clientInZone) {
    const index = nextCardIndex();
    const card = CARDS[index];
    const el = buildCardElement(card, index);
    const slot = cardSlotPosition(activeAnchors.length);
    el.style.left = `${slot.left}px`;
    el.style.top = `${slot.top}px`;
    el.style.width = `${slot.width}px`;
    el.style.zIndex = String(++zTop);
    zone.appendChild(el);

    const marker = createMarker(card.accent);
    const world = hitWorld.clone();
    world.y = surfaceYAt(world.x, world.z, clock.getElapsedTime()) + 0.02;
    marker.position.copy(world);

    const { path, pulse } = makePath(card.accent);
    const anchor = { el, world, accent: card.accent, path, pulse, marker, t0: performance.now() };
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
        path.style.transition = 'stroke-dashoffset 0.85s cubic-bezier(0.22, 1, 0.36, 1)';
        path.style.strokeDashoffset = '0';
    });

    window.setTimeout(() => {
        el.classList.remove('is-loading', 'is-drawing');
        el.classList.add('is-live');
        const status = el.querySelector('.ar-card-status');
        if (status) status.textContent = 'ANCHORED';
    }, 900);

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
}

function dismissAnchor(anchor) {
    const i = activeAnchors.indexOf(anchor);
    if (i >= 0) activeAnchors.splice(i, 1);
    anchor.el.classList.add('is-dismissing');
    anchor.path.classList.add('is-dismissing');
    anchor.pulse.classList.add('is-dismissing');
    window.setTimeout(() => {
        anchor.el.remove();
        anchor.path.remove();
        anchor.pulse.remove();
        scene.remove(anchor.marker);
    }, 320);
    layoutCards();
}

function layoutCards() {
    activeAnchors.forEach((a, i) => {
        const slot = cardSlotPosition(i);
        a.el.style.left = `${slot.left}px`;
        a.el.style.top = `${slot.top}px`;
        a.el.style.width = `${slot.width}px`;
    });
    syncTethers();
}

function syncTethers() {
    const t = clock.getElapsedTime();
    activeAnchors.forEach((a) => {
        a.world.y = surfaceYAt(a.world.x, a.world.z, t) + 0.02;
        a.marker.position.copy(a.world);
        a.marker.scale.setScalar(1 + Math.sin(t * 3 + a.world.x) * 0.06);

        const hit = projectWorldToZone(a.world);
        const rect = a.el.getBoundingClientRect();
        const zoneRect = zone.getBoundingClientRect();
        const ax = rect.left - zoneRect.left + rect.width * 0.5;
        const ay = rect.top - zoneRect.top + rect.height - 4;
        const mx = (ax + hit.x) / 2 + (hit.x - ax) * 0.08;
        const my = Math.min(ay, hit.y) - Math.abs(hit.y - ay) * 0.28;
        a.path.setAttribute('d', `M ${ax} ${ay} Q ${mx} ${my} ${hit.x} ${hit.y}`);

        const age = (performance.now() - a.t0) / 1000;
        const u = (age * 0.55) % 1;
        const px = (1 - u) * (1 - u) * ax + 2 * (1 - u) * u * mx + u * u * hit.x;
        const py = (1 - u) * (1 - u) * ay + 2 * (1 - u) * u * my + u * u * hit.y;
        a.pulse.setAttribute('cx', String(px));
        a.pulse.setAttribute('cy', String(py));
    });
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

canvas.addEventListener('pointermove', (e) => {
    const hit = pick(e.clientX, e.clientY);
    if (hit) {
        hoverPoint = { x: hit.point.x, z: hit.point.z };
        canvas.style.cursor = 'crosshair';
    } else {
        hoverPoint = null;
        canvas.style.cursor = 'default';
    }
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
window.addEventListener('resize', () => {
    resize();
    layoutCards();
});

/* ---------- Loop ---------- */
function frame() {
    const t = clock.getElapsedTime();
    deform(t);
    camera.position.x = Math.sin(t * 0.08) * 0.35;
    camera.position.y = 3.4 + Math.sin(t * 0.12) * 0.08;
    camera.lookAt(0, 0.15, 0);
    renderer.render(scene, camera);
    syncTethers();
    requestAnimationFrame(frame);
}

resize();
frame();
ripples.push({ x: 0.5, z: -0.4, t0: 0.2 });
