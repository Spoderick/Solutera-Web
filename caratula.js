import { createNoise2D } from 'simplex-noise';

class CaratulaAnimation {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.noise = createNoise2D();
        this.particles = [];
        this.particleCount = 60;
        this.maxDistance = 150;
        this.time = 0;

        this.resize();
        this.initParticles();
        window.addEventListener('resize', () => this.resize());

        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * window.devicePixelRatio;
        this.canvas.height = this.height * window.devicePixelRatio;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        // Re-init if screen size changes significantly
        if (this.particles.length > 0) {
            this.initParticles();
        }
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 2 + 1,
                seed: Math.random() * 100
            });
        }
    }

    animate() {
        this.time += 0.002;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Background subtle gradient
        const bgGradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width
        );
        bgGradient.addColorStop(0, '#0e153a');
        bgGradient.addColorStop(1, '#050a1f');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.particles.forEach((p, index) => {
            // Apply noise for organic movement
            const nx = this.noise(p.seed, this.time) * 0.5;
            const ny = this.noise(p.seed + 100, this.time) * 0.5;

            p.x += p.vx + nx;
            p.y += p.vy + ny;

            // Bounce off edges
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.fill();

            // Draw connections
            for (let j = index + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    const opacity = 1 - (dist / this.maxDistance);
                    this.ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

new CaratulaAnimation('#animation-container');
