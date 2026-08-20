(function () {
    const marks = document.querySelectorAll('[data-name-mark]');
    if (!marks.length) return;

    const NAME = 'DANIEL AREVALO';

    function measureGlyphs(text, reference) {
        const cs = getComputedStyle(reference);
        const probe = document.createElement('span');
        probe.setAttribute('aria-hidden', 'true');
        probe.style.cssText = [
            'position:absolute',
            'left:0',
            'top:0',
            'visibility:hidden',
            'pointer-events:none',
            'white-space:nowrap',
            'display:inline-block',
            'font-kerning:normal',
            'font-feature-settings:"kern" 1',
            'font-family:' + cs.fontFamily,
            'font-weight:' + cs.fontWeight,
            'font-size:' + cs.fontSize,
            'font-style:' + cs.fontStyle,
            'letter-spacing:' + cs.letterSpacing,
            'line-height:' + cs.lineHeight,
            'text-transform:uppercase'
        ].join(';');
        probe.textContent = text;
        document.body.appendChild(probe);

        const textNode = probe.firstChild;
        const origin = probe.getBoundingClientRect();
        const range = document.createRange();
        const glyphs = [];
        const em = parseFloat(cs.fontSize) || 16;

        for (let i = 0; i < text.length; i++) {
            range.setStart(textNode, i);
            range.setEnd(textNode, i + 1);
            const box = range.getBoundingClientRect();
            const isSpace = text[i] === ' ';
            glyphs.push({
                ch: text[i],
                x: box.left - origin.left,
                width: isSpace ? Math.max(box.width, em * 0.25) : box.width
            });
        }

        const size = { width: origin.width, height: origin.height };
        probe.remove();
        return { glyphs: glyphs, size: size };
    }

    function splitMark(el) {
        if (el.classList.contains('is-ready')) return;

        const text = (el.getAttribute('data-name') || el.textContent.trim() || NAME).toUpperCase();
        const measured = measureGlyphs(text, el);

        el.textContent = '';
        el.style.width = measured.size.width + 'px';
        el.style.height = measured.size.height + 'px';

        measured.glyphs.forEach(function (glyph, i) {
            const span = document.createElement('span');
            const isSpace = glyph.ch === ' ';
            span.className = isSpace ? 'name-mark__char name-mark__char--space' : 'name-mark__char';
            span.style.setProperty('--i', String(i));
            span.style.left = glyph.x + 'px';
            span.textContent = isSpace ? '\u00a0' : glyph.ch;
            span.setAttribute('aria-hidden', 'true');
            el.appendChild(span);
        });

        el.classList.add('is-ready');
    }

    function run() {
        marks.forEach(splitMark);
    }

    function waitForOutfit() {
        const timeout = new Promise(function (resolve) {
            setTimeout(resolve, 400);
        });

        if (!document.fonts || !document.fonts.load) {
            return timeout;
        }

        return Promise.race([
            document.fonts.load('800 1.575rem "Outfit"'),
            timeout
        ]);
    }

    waitForOutfit().then(run);
})();
