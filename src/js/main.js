document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Navigation - Active Link Highlighting
    // ============================================
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // Navbar Background on Scroll
    // ============================================
    
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
        }
    });

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe only elements explicitly marked for a scroll reveal.
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // Typing Effect for Code Window (Optional)
    // ============================================
    
    const codeLines = document.querySelectorAll('.code-line');
    if (codeLines.length > 0) {
        codeLines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-10px)';
            
            setTimeout(() => {
                line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, 100 * index);
        });
    }

    // ============================================
    // Skill Tags Interactive Filter (Optional)
    // ============================================
    
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Toggle active state
            this.classList.toggle('active');
            
            // Could add filtering logic here for projects
            // based on selected skills
        });
    });
});


/* ============================================
   Interactive ASCII hero background
   ============================================ */

(function initAsciiCanvasScene() {
    const main = document.querySelector('main');
    const canvas = document.getElementById('asciiCanvas');
    if (!main || !canvas) return;

    const context = canvas.getContext('2d', { alpha: true });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const config = {
        cell: 30,
        color: '#4a4a4a',
        activeColor: '#9b2424',
        mutedColor: '#303030',
        maxDpr: 1.5,
        fps: reducedMotion ? 1 : 30,
        aspectRatio: 0.6
    };

    const chars = '@#%*+=-:.·';
    const art = {
        penguin: [
            // '        .--.        ',
            // '       |o_o |       ',
            // '       |:_/ |       ',
            // '      //   \\ \\     ',
            // '     (|     | )      ',
            // '    /\\_   _/\\      ',
            // '    \\_ )_(  /       ',
            // '      /___\\         '

            '    .--. ',
            '   |o_o | ',
            '   |:_/ | ',
            '  //   \\ \\ ',
            ' (|     | ) ',
            '/\\\'\_   _/`\\ ',
            '\\___)=(___/ '

        // This ASCII pic can be found at
        // https://asciiart.website/art/2093
        ],
        wave: [
            '  ~~~ miRx923 ~~~  ',
            ' ~~  miRx923  ~~   ',
            '~~~ miRx923 ~~~    ',
            ' ~~  miRx923  ~~   '
        ],
        diamond: [
            '       .       ',
            '     . + .     ',
            '   . + # + .   ',
            ' . + # @ # + . ',
            '   . + # + .   ',
            '     . + .     ',
            '       .       '
        ],
        orbit: [
            '      .---.      ',
            '   .-       -.   ',
            '  /   .-*- .  \\  ',
            ' |   /  o  \\   | ',
            '  \\  \\ * /  /   ',
            '   `-.     .-`   ',
            '      `---`      '
        ],
        star: [
            '     .     ',
            '  .  /\\  . ',
            '.---<  >---.',
            '  .  \\/  . ',
            '     .     '
        ],
        waveLine: [
            ' ~~~   ~~~   ~~~ ',
            '~~~   ~~~   ~~~  ',
            ' ~~~   ~~~   ~~~ '
        ]
    };

    const state = {
        width: 0,
        height: 0,
        columns: 0,
        rows: 0,
        dpr: 1,
        lastFrame: 0,
        mouseX: -9999,
        mouseY: -9999,
        mouseInside: false,
        objects: []
    };

    function resize() {
        const rect = main.getBoundingClientRect();
        state.width = Math.max(1, rect.width);
        state.height = Math.max(1, rect.height);
        state.dpr = Math.min(window.devicePixelRatio || 1, config.maxDpr);

        canvas.width = Math.floor(state.width * state.dpr);
        canvas.height = Math.floor(state.height * state.dpr);
        context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
        const monoFont = getComputedStyle(document.documentElement)
            .getPropertyValue('--font-mono')
            .trim() || 'monospace';
        context.font = `${config.cell}px ${monoFont}`;
        context.textBaseline = 'top';
        state.columns = Math.ceil(state.width / config.cell);
        state.rows = Math.ceil(state.height / config.cell);
        createObjects();
    }

    function createObjects() {
        const w = state.width;
        const h = state.height;
        const margin = Math.max(24, Math.min(w, h) * 0.035);

        state.objects = [
            { type: 'wave', art: art.wave, x: w * 0.12, y: h * 0.16, box: [w * 0.08, h * 0.08, w * 0.28, h * 0.28], vx: 0.18, vy: 0.10, phase: 0.2, scale: 0.82, aspectRatio: 1.2},
            { type: 'penguin', art: art.penguin, x: w * 0.12, y: h * 0.63, box: [margin, h * 0.55, w * 0.25, h * 0.36], vx: 0.15, vy: -0.11, phase: 1.3, scale: 0.72, aspectRatio: 0.5},
            { type: 'diamond', art: art.diamond, x: w * 0.77, y: h * 0.18, box: [w * 0.65, h * 0.08, w * 0.27, h * 0.28], vx: -0.14, vy: 0.12, phase: 2.1, scale: 0.8, aspectRatio: 1.5},
            { type: 'orbit', art: art.orbit, x: w * 0.82, y: h * 0.62, box: [w * 0.66, h * 0.48, w * 0.30, h * 0.38], vx: -0.12, vy: -0.10, phase: 3.5, scale: 0.7, aspectRatio: 1},
            { type: 'star', art: art.star, x: w * 0.47, y: h * 0.13, box: [w * 0.35, margin, w * 0.30, h * 0.23], vx: 0.10, vy: 0.12, phase: 4.2, scale: 0.8, aspectRatio: 1},
            { type: 'waveLine', art: art.waveLine, x: w * 0.70, y: h * 0.82, box: [w * 0.42, h * 0.70, w * 0.48, h * 0.24], vx: -0.15, vy: 0.08, phase: 5.1, scale: 0.75, aspectRatio: 1},
            { type: 'waveLine', art: art.waveLine, x: w * 0.20, y: h * 0.4, box: [w * 0.3, h * 0.70, w * 0.48, h * 0.24], vx: -0.15, vy: 0.08, phase: 5.1, scale: 0.75, aspectRatio: 1}
            // {
            //     type: 'kitty',
            //     art: art.kitty,
            //     x: w * 0.8,
            //     y: h * 0.75,
            //     box: [w * 0.56, h * 0.30, w * 0.40, h * 0.60],
            //     vx: -0.055,
            //     vy: 0.045,
            //     phase: 6.2,
            //     scale: 0.3
            // }
        ];
    }

    function objectSize(object) {
        if (!Array.isArray(object.art) || object.art.length === 0) {
            return { width: 0, height: 0 };
        }

        const aspectRatio = object.aspectRatio ?? config.aspectRatio;
        const longestLine = Math.max(...object.art.map(line => line.length));

        return {
            width: longestLine * config.cell * object.scale * aspectRatio,
            height: object.art.length * config.cell * object.scale
        };
    }

    function updateObject(object, time) {
        if (reducedMotion) return;

        const [boxX, boxY, boxW, boxH] = object.box;
        const size = objectSize(object);
        const halfW = size.width / 2;
        const halfH = size.height / 2;
        const left = boxX + halfW;
        const right = boxX + boxW - halfW;
        const top = boxY + halfH;
        const bottom = boxY + boxH - halfH;

        object.x += object.vx;
        object.y += object.vy;

        if (object.x < left || object.x > right) {
            object.vx *= -1;
            object.x = Math.max(left, Math.min(right, object.x));
        }
        if (object.y < top || object.y > bottom) {
            object.vy *= -1;
            object.y = Math.max(top, Math.min(bottom, object.y));
        }

        object.driftX = Math.sin(time * 0.0007 + object.phase) * 2;
        object.driftY = Math.cos(time * 0.0009 + object.phase) * 2;
    }

    function drawObject(object) {
        const size = objectSize(object);
        const aspectRatio = object.aspectRatio ?? config.aspectRatio;
        const startX = object.x - size.width / 2 + (object.driftX || 0);
        const startY = object.y - size.height / 2 + (object.driftY || 0);

        object.art.forEach((line, row) => {
            [...line].forEach((character, column) => {
                if (character === ' ') return;

                const x = startX + column * config.cell * object.scale * aspectRatio;
                const y = startY + row * config.cell * object.scale;
                const dx = x - state.mouseX;
                const dy = y - state.mouseY;
                const distance = Math.hypot(dx, dy);
                const radius = 130;
                const influence = state.mouseInside ? Math.max(0, 1 - distance / radius) : 0;
                const wave = Math.sin((column + row) * 0.7 + performance.now() * 0.002 + object.phase) * 0.5 + 0.5;

                context.globalAlpha = 0.44 + wave * 0.20 + influence * 0.28;
                context.fillStyle = influence > 0.12 ? config.activeColor : config.color;
                const offsetX = influence * (dx / Math.max(distance, 1)) * -5;
                const offsetY = influence * (dy / Math.max(distance, 1)) * -5;
                context.fillText(character, x + offsetX, y + offsetY);
            });
        });
    }

    function drawAmbientGrid(time) {
        context.globalAlpha = 0.07;
        context.fillStyle = config.mutedColor;

        const waveOffset = Math.sin(time * 0.00035) * 2;
        for (let row = 1; row < state.rows; row += 3) {
            for (let column = 1; column < state.columns; column += 7) {
                const x = column * config.cell + waveOffset;
                const y = row * config.cell;
                const symbol = chars[(row + column) % chars.length];
                context.fillText(symbol, x, y);
            }
        }
    }

    function render(time) {
        if (time - state.lastFrame < 1000 / config.fps) {
            requestAnimationFrame(render);
            return;
        }
        state.lastFrame = time;
        context.clearRect(0, 0, state.width, state.height);
        const monoFont = getComputedStyle(document.documentElement)
            .getPropertyValue('--font-mono')
            .trim() || 'monospace';
        context.font = `${config.cell}px ${monoFont}`;
        context.textBaseline = 'top';

        drawAmbientGrid(time);
        state.objects.forEach(object => {
            updateObject(object, time);
            drawObject(object);
        });

        context.globalAlpha = 1;
        requestAnimationFrame(render);
    }

    main.addEventListener('pointermove', event => {
        const rect = main.getBoundingClientRect();

        state.mouseX = event.clientX - rect.left;
        state.mouseY = event.clientY - rect.top;
        state.mouseInside = true;
    }, { passive: true });

    main.addEventListener('pointerleave', () => {
        state.mouseInside = false;
        state.mouseX = -9999;
        state.mouseY = -9999;
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(main);
    resize();
    requestAnimationFrame(render);
})();