/**
 * Hero loader. The static poster inside #heroCanvasWrap paints first and stays as
 * the hero; the Three.js scene (hero-scene.js) is fetched only after the page has
 * loaded, and never for reduced-motion viewers or devices with few CPU cores.
 */
const MIN_CORES = 4;

const wrap = document.getElementById('heroCanvasWrap');

function wantsLiveHero() {
    if (!wrap) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    const cores = navigator.hardwareConcurrency;
    return !cores || cores >= MIN_CORES;
}

function whenIdleAfterLoad(fn) {
    const idle = () =>
        'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 200);
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
}

if (wantsLiveHero()) {
    whenIdleAfterLoad(() => {
        import('./hero-scene.js').catch((err) => {
            // WebGL unavailable or three failed to load: the poster remains the hero
            console.warn('Hero: keeping static poster', err);
        });
    });
}
