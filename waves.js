
import { createNoise2D } from 'simplex-noise';

export class Waves {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.options = {
            strokeColor: options.strokeColor || "#ffffff",
            backgroundColor: options.backgroundColor || "transparent",
            pointerSize: options.pointerSize || 0.5,
            ...options
        };

        this.svg = null;
        this.mouse = {
            x: -10,
            y: 0,
            lx: 0,
            ly: 0,
            sx: 0,
            sy: 0,
            v: 0,
            vs: 0,
            a: 0,
            set: false,
        };
        this.paths = [];
        this.ledPaths = []; // Separate paths for the "LED" effect
        this.lines = [];
        this.noise = null;
        this.rafId = null;
        this.bounding = null;
        this.time = 0;

        this.init();
    }

    init() {
        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.classList.add('js-svg');
        this.svg.style.display = 'block';
        this.svg.style.width = '100%';
        this.svg.style.height = '100%';
        this.container.appendChild(this.svg);

        // Initialize noise
        this.noise = createNoise2D();

        // Initial setup
        this.setSize();
        this.setLines();

        // Events
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Start loop
        this.tick();
    }

    setSize() {
        this.bounding = this.container.getBoundingClientRect();
    }

    setLines() {
        if (!this.svg || !this.bounding) return;

        const { width, height } = this.bounding;
        this.lines = [];

        // Clear existing
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
        this.paths = [];
        this.ledPaths = [];

        const xGap = 15; // Slightly wider for performance
        const yGap = 15;

        const oWidth = width + 200;
        const oHeight = height + 30;

        const totalLines = Math.ceil(oWidth / xGap);
        const totalPoints = Math.ceil(oHeight / yGap);

        const xStart = (width - xGap * totalLines) / 2;
        const yStart = (height - yGap * totalPoints) / 2;

        for (let i = 0; i < totalLines; i++) {
            const points = [];
            for (let j = 0; j < totalPoints; j++) {
                points.push({
                    x: xStart + xGap * i,
                    y: yStart + yGap * j,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                });
            }
            this.lines.push(points);

            // 1. Base Line (White)
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', this.options.strokeColor);
            path.setAttribute('stroke-width', '1');
            path.setAttribute('opacity', '0.3'); // Faint base line
            this.svg.appendChild(path);
            this.paths.push(path);

            // 2. LED Line (Blue) - Reduced opacity and visibility
            const ledPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            ledPath.setAttribute('fill', 'none');
            // Use RGBA for transparency
            ledPath.setAttribute('stroke', 'rgba(255, 107, 0, 0.3)'); // Much lower opacity
            ledPath.setAttribute('stroke-width', '1.5'); // Slightly thinner

            // "Tiras led": Dashed lines that move
            // Dash array: 100px dash, 300px gap
            ledPath.setAttribute('stroke-dasharray', `${50 + Math.random() * 50} ${300 + Math.random() * 200}`);

            // Random start offset so they aren't synchronized
            ledPath.style.strokeDashoffset = `${Math.random() * 1000}`;

            // Add glow effect using filter or simpler css shadow (SVG filter is expensive, try simple stroke first)
            // Or we can add a simple glow filter to the SVG defs later. 
            // For now, let's rely on the color contrast.

            this.svg.appendChild(ledPath);
            this.ledPaths.push(ledPath);
        }
    }

    onResize() {
        this.setSize();
        this.setLines();
    }

    onMouseMove(e) {
        if (!this.bounding) return;
        this.updateMousePosition(e.pageX, e.pageY);
    }

    updateMousePosition(x, y) {
        this.mouse.x = x - this.bounding.left;
        this.mouse.y = y - this.bounding.top + window.scrollY;

        if (!this.mouse.set) {
            this.mouse.sx = this.mouse.x;
            this.mouse.sy = this.mouse.y;
            this.mouse.lx = this.mouse.x;
            this.mouse.ly = this.mouse.y;
            this.mouse.set = true;
        }
    }

    movePoints(time) {
        const lines = this.lines;
        const mouse = this.mouse;
        const noise = this.noise;

        lines.forEach((points) => {
            points.forEach((p) => {
                const move = noise(
                    (p.x + time * 0.008) * 0.003,
                    (p.y + time * 0.003) * 0.002
                ) * 8;

                p.wave.x = Math.cos(move) * 12;
                p.wave.y = Math.sin(move) * 6;

                const dx = p.x - mouse.sx;
                const dy = p.y - mouse.sy;
                const d = Math.hypot(dx, dy);
                const l = Math.max(175, mouse.vs);

                if (d < l) {
                    const s = 1 - d / l;
                    const f = Math.cos(d * 0.001) * s;

                    p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00035;
                    p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00035;
                }

                p.cursor.vx += (0 - p.cursor.x) * 0.01;
                p.cursor.vy += (0 - p.cursor.y) * 0.01;
                p.cursor.vx *= 0.95;
                p.cursor.vy *= 0.95;

                p.cursor.x += p.cursor.vx;
                p.cursor.y += p.cursor.vy;
            });
        });
    }

    moved(point, withCursorForce = true) {
        return {
            x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
            y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
        };
    }

    drawLines() {
        this.lines.forEach((points, i) => {
            if (points.length < 2 || !this.paths[i]) return;

            const firstPoint = this.moved(points[0], false);
            let d = `M ${firstPoint.x} ${firstPoint.y}`;

            for (let j = 1; j < points.length; j++) {
                const current = this.moved(points[j]);
                d += `L ${current.x} ${current.y}`;
            }

            // Update base path
            this.paths[i].setAttribute('d', d);

            // Update LED path
            this.ledPaths[i].setAttribute('d', d);

            // Animate LED "flow"
            // We subtract from the offset to make it move "down" or "along" the line
            const currentOffset = parseFloat(this.ledPaths[i].style.strokeDashoffset) || 0;
            this.ledPaths[i].style.strokeDashoffset = currentOffset - 2; // Speed of LED
        });
    }

    tick() {
        this.time += 1;

        // Mouse smoothing
        this.mouse.sx += (this.mouse.x - this.mouse.sx) * 0.1;
        this.mouse.sy += (this.mouse.y - this.mouse.sy) * 0.1;

        const dx = this.mouse.x - this.mouse.lx;
        const dy = this.mouse.y - this.mouse.ly;
        const d = Math.hypot(dx, dy);

        this.mouse.v = d;
        this.mouse.vs += (d - this.mouse.vs) * 0.1;
        this.mouse.vs = Math.min(100, this.mouse.vs);

        this.mouse.lx = this.mouse.x;
        this.mouse.ly = this.mouse.y;
        this.mouse.a = Math.atan2(dy, dx);

        // Update CSS variables for spotlight
        if (this.container) {
            this.container.style.setProperty('--x', `${this.mouse.sx}px`);
            this.container.style.setProperty('--y', `${this.mouse.sy}px`);
        }

        this.movePoints(this.time);
        this.drawLines();

        this.rafId = requestAnimationFrame(this.tick.bind(this));
    }
}
