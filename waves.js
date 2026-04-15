
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

        this.canvas = null;
        this.ctx = null;
        this.pixelRatio = window.devicePixelRatio || 1;
        
        this.mouse = {
            x: -1000,
            y: -1000,
            lx: 0,
            ly: 0,
            sx: 0,
            sy: 0,
            v: 0,
            vs: 0,
            a: 0,
            set: false,
        };
        this.lines = [];
        this.lineStyles = []; // Store dash styles for each line
        this.noise = null;
        this.rafId = null;
        this.bounding = null;
        this.time = 0;
        this.isVisible = true;

        this.init();
    }

    init() {
        // Create Canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'block';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        // Initialize noise
        this.noise = createNoise2D();

        // Initial setup
        this.setSize();
        this.setLines();

        // Visibility tracking
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
                if (this.isVisible && !this.rafId) {
                    this.tick();
                }
            });
        }, { threshold: 0.1 });
        this.observer.observe(this.container);

        // Events
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Start loop
        this.tick();
    }

    setSize() {
        this.bounding = this.container.getBoundingClientRect();
        this.canvas.width = this.bounding.width * this.pixelRatio;
        this.canvas.height = this.bounding.height * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);
    }

    setLines() {
        if (!this.ctx || !this.bounding) return;

        const { width, height } = this.bounding;
        this.lines = [];
        this.lineStyles = [];

        const xGap = 15;
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
            
            // Generate styles for this line (LED effect)
            this.lineStyles.push({
                dashArray: [50 + Math.random() * 50, 300 + Math.random() * 200],
                dashOffset: Math.random() * 1000
            });
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
        const mouse = this.mouse;
        const noise = this.noise;

        for (let i = 0; i < this.lines.length; i++) {
            const points = this.lines[i];
            for (let j = 0; j < points.length; j++) {
                const p = points[j];
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
            }
        }
    }

    moved(point, withCursorForce = true) {
        return {
            x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
            y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
        };
    }

    drawLines() {
        const ctx = this.ctx;
        const width = this.bounding.width;
        const height = this.bounding.height;

        ctx.clearRect(0, 0, width, height);

        // 1. Draw Base Lines (White/Faint)
        ctx.strokeStyle = this.options.strokeColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.15;
        ctx.setLineDash([]); // Plain lines

        for (let i = 0; i < this.lines.length; i++) {
            const points = this.lines[i];
            if (points.length < 2) continue;

            ctx.beginPath();
            const firstPoint = this.moved(points[0], false);
            ctx.moveTo(firstPoint.x, firstPoint.y);

            for (let j = 1; j < points.length; j++) {
                const p = this.moved(points[j]);
                ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }

        // 2. Draw LED Lines (Orange/Glow)
        ctx.strokeStyle = 'rgba(255, 107, 0, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 1.0;

        for (let i = 0; i < this.lines.length; i++) {
            const points = this.lines[i];
            const style = this.lineStyles[i];
            if (points.length < 2) continue;

            // Update dash offset
            style.dashOffset -= 2;

            ctx.setLineDash(style.dashArray);
            ctx.lineDashOffset = style.dashOffset;

            ctx.beginPath();
            const firstPoint = this.moved(points[0], false);
            ctx.moveTo(firstPoint.x, firstPoint.y);

            for (let j = 1; j < points.length; j++) {
                const p = this.moved(points[j]);
                ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }
    }

    tick() {
        if (!this.isVisible) {
            this.rafId = null;
            return;
        }

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
