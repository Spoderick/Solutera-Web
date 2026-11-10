import React from 'react';
import { interpolate, Easing } from 'remotion';
import { useLoop, wave, getPalette } from '../theme.js';

/**
 * 1. Administración y Recuperación
 * Executive portfolio vault with ascending value bars, circular recovery gauge,
 * and non-overlapping rising asset coins (coin + '$' symbol locked in one <g>).
 */
export function RecoveryIcon({ className = 'about-icon-svg' }) {
    const { progress, phase, theme } = useLoop(180);
    const c = getPalette(theme);

    // Outer gauge rotation & dash progress
    const ringSpin = progress * 360;
    const counterSpin = -progress * 180;
    const gaugeCircumference = 2 * Math.PI * 15;
    const gaugeFill = wave(progress, 0.58, 0.90, 0.1, 1);

    // 4 internal portfolio value bars anchored strictly at baseline y=88
    const barBaseline = 88;
    const barHeights = [
        wave(progress, 12, 25, 0.0, 2),
        wave(progress, 16, 31, 0.2, 2),
        wave(progress, 20, 35, 0.4, 2),
        wave(progress, 24, 39, 0.6, 2),
    ];

    // Primary rising '$' coin (rises from center dial up to y=17 cleanly)
    const coin1P = progress % 1;
    const coin1Y = interpolate(coin1P, [0, 1], [56, 16], { easing: Easing.out(Easing.cubic) });
    const coin1Scale = interpolate(coin1P, [0, 0.22, 0.82, 1], [0.55, 1.08, 1.0, 0.65]);
    const coin1Opacity = interpolate(coin1P, [0, 0.16, 0.80, 1], [0, 1, 0.95, 0]);

    // Secondary rising emerald verification badge on the right column (x=84, never overlaps center coin!)
    const coin2P = (progress + 0.5) % 1;
    const coin2Y = interpolate(coin2P, [0, 1], [52, 20], { easing: Easing.out(Easing.cubic) });
    const coin2Scale = interpolate(coin2P, [0, 0.22, 0.82, 1], [0.5, 1.0, 0.95, 0.6]);
    const coin2Opacity = interpolate(coin2P, [0, 0.18, 0.80, 1], [0, 0.92, 0.85, 0]);

    // Third rising mini badge on the left column (x=34)
    const coin3P = (progress + 0.22) % 1;
    const coin3Y = interpolate(coin3P, [0, 1], [54, 24], { easing: Easing.out(Easing.cubic) });
    const coin3Opacity = interpolate(coin3P, [0, 0.2, 0.8, 1], [0, 0.85, 0.75, 0]);

    // Vault subtle breathing
    const vaultLift = Math.sin(phase) * 1.4;

    return (
        <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="rec-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={c.accent} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={c.accent} stopOpacity="0" />
                </radialGradient>
                <linearGradient id="rec-case-grad" x1="20" y1="40" x2="100" y2="96" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={c.accent} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={c.stroke} stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="rec-bar-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.accentLight} />
                    <stop offset="100%" stopColor={c.accent} stopOpacity="0.35" />
                </linearGradient>
            </defs>

            {/* Ambient Halo */}
            <circle cx="60" cy="64" r="52" fill="url(#rec-glow)" />

            {/* Outer Tech Ring */}
            <circle
                cx="60"
                cy="64"
                r="48"
                stroke={c.strokeMuted}
                strokeWidth="1.2"
                strokeDasharray="4 6"
                transform={`rotate(${counterSpin.toFixed(1)} 60 64)`}
            />

            <g transform={`translate(0, ${vaultLift.toFixed(2)})`}>
                {/* Briefcase Handle */}
                <path
                    d="M46 40 V31 C46 27.5 48.5 25 52 25 H68 C71.5 25 74 27.5 74 31 V40"
                    stroke={c.stroke}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                />

                {/* Vault / Briefcase Main Body */}
                <rect
                    x="20"
                    y="40"
                    width="80"
                    height="54"
                    rx="9"
                    fill="url(#rec-case-grad)"
                    stroke={c.accent}
                    strokeWidth="2.6"
                />
                {/* Inner Bevel Frame */}
                <rect
                    x="25"
                    y="45"
                    width="70"
                    height="44"
                    rx="6"
                    stroke={c.strokeMuted}
                    strokeWidth="1"
                />

                {/* Ascending Portfolio Bars inside Vault (Locked to baseline y=88) */}
                {[
                    { x: 29, h: barHeights[0], isAccent: false },
                    { x: 38, h: barHeights[1], isAccent: false },
                    { x: 76, h: barHeights[2], isAccent: true },
                    { x: 85, h: barHeights[3], isAccent: true },
                ].map((b, i) => (
                    <g key={i}>
                        <rect
                            x={b.x}
                            y={(barBaseline - b.h).toFixed(2)}
                            width="6"
                            height={b.h.toFixed(2)}
                            rx="2"
                            fill={b.isAccent ? 'url(#rec-bar-grad)' : c.strokeMuted}
                        />
                        <circle
                            cx={b.x + 3}
                            cy={(barBaseline - b.h).toFixed(2)}
                            r="1.8"
                            fill={b.isAccent ? c.accentLight : c.stroke}
                        />
                    </g>
                ))}

                {/* Upper Flap Contour Line */}
                <path
                    d="M20 57 Q60 67 100 57"
                    stroke={c.strokeSecondary}
                    strokeWidth="1.8"
                    fill="none"
                />

                {/* Center Recovery Dial */}
                <circle cx="60" cy="64" r="18" fill={c.surfaceStrong} stroke={c.strokeMuted} strokeWidth="1.2" />
                <circle
                    cx="60"
                    cy="64"
                    r="15"
                    stroke={c.accent}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeDasharray={gaugeCircumference.toFixed(2)}
                    strokeDashoffset={(gaugeCircumference * (1 - gaugeFill)).toFixed(2)}
                    transform="rotate(-90 60 64)"
                />
                <circle
                    cx="60"
                    cy="64"
                    r="10.5"
                    stroke={c.stroke}
                    strokeWidth="1.4"
                    strokeDasharray="3 3"
                    transform={`rotate(${ringSpin.toFixed(1)} 60 64)`}
                />
            </g>

            {/* Left Mini Rising Up-Arrow Badge (x=34) */}
            <g transform={`translate(34, ${coin3Y.toFixed(2)})`} opacity={coin3Opacity.toFixed(3)}>
                <circle cx="0" cy="0" r="5.5" fill={c.surfaceStrong} stroke={c.accentLight} strokeWidth="1.5" />
                <path d="M-2.2 1 L0 -1.5 L2.2 1 M0 -1.5 V2.5" stroke={c.accentLight} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Right Staggered Rising Emerald Verification Coin (x=86 — cleanly separated from center!) */}
            <g
                transform={`translate(86, ${coin2Y.toFixed(2)}) scale(${coin2Scale.toFixed(3)})`}
                opacity={coin2Opacity.toFixed(3)}
            >
                <circle cx="0" cy="0" r="7" fill={c.emerald} stroke="#ffffff" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="9.5" stroke={c.emerald} strokeWidth="1" strokeOpacity="0.45" />
                <path d="M-2.5 0.2 L-0.6 2.1 L2.8 -1.6" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Primary Rising Value Coin (Center x=60) — Coin + '$' grouped so they NEVER detach */}
            <g
                transform={`translate(60, ${coin1Y.toFixed(2)}) scale(${coin1Scale.toFixed(3)})`}
                opacity={coin1Opacity.toFixed(3)}
            >
                <circle cx="0" cy="0" r="10.5" fill={c.accent} stroke="#ffffff" strokeWidth="1.6" />
                <circle cx="0" cy="0" r="13.5" stroke={c.accentLight} strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 3" />
                {/* Crisp geometric '$' sign */}
                <path
                    d="M0 -5.2 V5.2 M2.4 -2.6 C2.4 -4.2 -2.4 -4.2 -2.4 -1.8 C-2.4 0.2 2.4 -0.2 2.4 1.8 C2.4 4.2 -2.4 4.2 -2.4 2.6"
                    stroke="#ffffff"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
            </g>
        </svg>
    );
}

/**
 * 2. Infraestructura
 * High-concurrency 3-blade server cluster supporting 2,500+ users,
 * with clean inter-blade backplane connectors (not cutting through LEDs!),
 * live internal load bars, path-locked data packets, and multi-user fan-out nodes.
 */
export function InfrastructureIcon({ className = 'about-icon-svg' }) {
    const { progress, phase, theme } = useLoop(180);
    const c = getPalette(theme);

    // 3 Server blades at y = 20, 49, 78 (centers at y = 31, 60, 89)
    const blades = [
        { y: 20, cy: 31, load: wave(progress, 18, 33, 0.0, 2), ledPhase: 0 },
        { y: 49, cy: 60, load: wave(progress, 22, 35, 0.33, 2), ledPhase: 2.1 },
        { y: 78, cy: 89, load: wave(progress, 16, 31, 0.66, 2), ledPhase: 4.2 },
    ];

    // Data packets strictly following the circuit traces from blades (x=46..80) to hub (96, 60)
    const getPacketPos = (offset, startY) => {
        const p = (progress * 1.5 + offset) % 1;
        if (p < 0.58) {
            const t = p / 0.58;
            return {
                x: interpolate(t, [0, 1], [44, 80]),
                y: startY,
                opacity: interpolate(t, [0, 0.15, 1], [0, 1, 1]),
            };
        } else {
            const t = (p - 0.58) / 0.42;
            return {
                x: interpolate(t, [0, 1], [80, 96]),
                y: interpolate(t, [0, 1], [startY, 60]),
                opacity: interpolate(t, [0, 0.85, 1], [1, 1, 0]),
            };
        }
    };

    const pkt1 = getPacketPos(0.0, 31);
    const pkt2 = getPacketPos(0.33, 60);
    const pkt3 = getPacketPos(0.66, 89);

    // Hub node pulse
    const hubPulse = wave(progress, 0.98, 1.25, 0, 3);
    const hubRingR = interpolate((progress * 3) % 1, [0, 1], [6, 15]);
    const hubRingOp = interpolate((progress * 3) % 1, [0, 1], [0.85, 0]);

    return (
        <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="inf-blade-bg" x1="14" y1="20" x2="80" y2="98" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={c.stroke} stopOpacity="0.09" />
                    <stop offset="100%" stopColor={c.accent} stopOpacity="0.14" />
                </linearGradient>
            </defs>

            {/* Inter-Blade Backplane Bus Pillars (Only between blades so they never cut through LEDs!) */}
            <path
                d="M28 42 V49 M64 42 V49 M28 71 V78 M64 71 V78"
                stroke={c.strokeSecondary}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* External High-Speed Network Bus Traces to Hub (96, 60) and 3 User Output Nodes */}
            <path
                d="M80 31 H86 L96 60 M80 60 H96 M80 89 H86 L96 60"
                stroke={c.strokeSecondary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Fan-out to 3 Concurrent User Endpoint Nodes on the far right */}
            <path
                d="M96 60 L109 42 M96 60 H111 M96 60 L109 78"
                stroke={c.strokeMuted}
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            {[
                { x: 109, y: 42, color: c.emerald },
                { x: 111, y: 60, color: c.accentLight },
                { x: 109, y: 78, color: c.emerald },
            ].map((u, i) => (
                <circle
                    key={`usr-${i}`}
                    cx={u.x}
                    cy={u.y}
                    r="2.6"
                    fill={u.color}
                    opacity={wave(progress, 0.4, 1, i * 0.3, 3).toFixed(2)}
                />
            ))}

            {/* 3 Server Blades */}
            {blades.map((b, idx) => {
                const led1Op = 0.35 + 0.65 * Math.abs(Math.sin(phase * 2 + b.ledPhase));
                const led2Op = 0.35 + 0.65 * Math.abs(Math.cos(phase * 2 + b.ledPhase));
                const isMid = idx === 1;
                return (
                    <g key={idx}>
                        <rect
                            x="14"
                            y={b.y}
                            width="66"
                            height="22"
                            rx="5"
                            fill="url(#inf-blade-bg)"
                            stroke={isMid ? c.accent : c.stroke}
                            strokeWidth={isMid ? '2.4' : '2'}
                        />
                        {/* Status LEDs */}
                        <circle cx="23" cy={b.cy} r="3" fill={c.accent} opacity={led1Op.toFixed(2)} />
                        <circle cx="32" cy={b.cy} r="3" fill={c.emerald} opacity={led2Op.toFixed(2)} />

                        {/* Telemetry Track + Live Load Bar */}
                        <rect x="41" y={b.cy - 4.5} width="33" height="3.8" rx="1.9" fill={c.grid} />
                        <rect
                            x="41"
                            y={b.cy - 4.5}
                            width={b.load.toFixed(2)}
                            height="3.8"
                            rx="1.9"
                            fill={isMid ? c.accent : c.emerald}
                        />
                        {/* Secondary Bus Line inside Blade */}
                        <line
                            x1="41"
                            y1={b.cy + 3.8}
                            x2="74"
                            y2={b.cy + 3.8}
                            stroke={c.strokeMuted}
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                        />
                    </g>
                );
            })}

            {/* Path-Locked Data Packets */}
            {[
                { p: pkt1, color: c.accentLight },
                { p: pkt2, color: '#ffffff' },
                { p: pkt3, color: c.emerald },
            ].map((item, i) => (
                <g key={i} opacity={item.p.opacity.toFixed(2)}>
                    <circle cx={item.p.x.toFixed(2)} cy={item.p.y.toFixed(2)} r="5" fill={item.color} opacity="0.28" />
                    <circle cx={item.p.x.toFixed(2)} cy={item.p.y.toFixed(2)} r="2.6" fill={item.color} />
                </g>
            ))}

            {/* Right Concurrency Router Core Node (96, 60) */}
            <circle cx="96" cy="60" r={hubRingR.toFixed(2)} stroke={c.accent} strokeWidth="1.6" opacity={hubRingOp.toFixed(2)} />
            <g transform={`translate(96, 60) scale(${hubPulse.toFixed(3)})`}>
                <circle cx="0" cy="0" r="6.5" fill={c.accent} />
                <circle cx="0" cy="0" r="2.8" fill="#ffffff" />
            </g>
        </svg>
    );
}

/**
 * 3. Análisis y Supervisión
 * Cyber-security shield with a strictly clipped laser audit beam (<clipPath>),
 * true orbiting satellite nodes around the perimeter, and spring-locked verification check.
 */
export function SecurityIcon({ className = 'about-icon-svg' }) {
    const { progress, phase, theme } = useLoop(180);
    const c = getPalette(theme);

    // Laser scan strictly clipped inside the shield contour
    const scanY = wave(progress, 20, 96, 0, 1);

    // Checkmark smooth spring + hold cycle
    const checkProgress = interpolate(
        progress,
        [0, 0.25, 0.82, 0.96, 1],
        [0.18, 1, 1, 0.18, 0.18],
        { easing: Easing.inOut(Easing.cubic) }
    );
    const checkScale = wave(progress, 0.96, 1.07, 0.2, 2);

    // 3 True Orbiting Nodes around (60, 60) at radius 49
    const orbitRadius = 49;
    const satellites = [0, 1, 2].map((i) => {
        const angle = phase + (i * Math.PI * 2) / 3;
        return {
            x: 60 + Math.cos(angle) * orbitRadius,
            y: 60 + Math.sin(angle) * orbitRadius,
            isAccent: i !== 1,
        };
    });

    const shieldPath = 'M60 16 L94 29 V57 C94 81 78 97 60 105 C42 97 26 81 26 57 V29 Z';

    return (
        <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="sec-shield-clip">
                    <path d={shieldPath} />
                </clipPath>
                <linearGradient id="sec-laser-curtain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.accent} stopOpacity="0" />
                    <stop offset="100%" stopColor={c.accent} stopOpacity="0.40" />
                </linearGradient>
                <linearGradient id="sec-shield-fill" x1="26" y1="16" x2="94" y2="105" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={c.accent} stopOpacity="0.16" />
                    <stop offset="100%" stopColor={c.stroke} stopOpacity="0.05" />
                </linearGradient>
            </defs>

            {/* Outer Orbital Track */}
            <circle
                cx="60"
                cy="60"
                r={orbitRadius}
                stroke={c.accent}
                strokeOpacity="0.28"
                strokeWidth="1.4"
                strokeDasharray="6 8"
            />

            {/* True Orbiting Security Nodes (Vibrant in both Dark & Light Mode) */}
            {satellites.map((sat, i) => {
                const nodeColor = sat.isAccent ? c.accent : c.emerald;
                return (
                    <g key={i}>
                        <circle
                            cx={sat.x.toFixed(2)}
                            cy={sat.y.toFixed(2)}
                            r="6"
                            fill={nodeColor}
                            opacity="0.25"
                        />
                        <circle
                            cx={sat.x.toFixed(2)}
                            cy={sat.y.toFixed(2)}
                            r="3.4"
                            fill={nodeColor}
                            stroke="#ffffff"
                            strokeWidth="1"
                        />
                    </g>
                );
            })}

            {/* Main Shield Body */}
            <path d={shieldPath} fill="url(#sec-shield-fill)" stroke={c.stroke} strokeWidth="2.6" strokeLinejoin="round" />

            {/* Inner Shield Bevel */}
            <path
                d="M60 23 L87 33.5 V56.5 C87 76 74 89.5 60 96.5 C46 89.5 33 76 33 56.5 V33.5 Z"
                stroke={c.strokeMuted}
                strokeWidth="1.2"
                strokeLinejoin="round"
            />

            {/* Clipped Laser Scanner & Security Grid inside Shield */}
            <g clipPath="url(#sec-shield-clip)">
                <path
                    d="M45 16 V105 M60 16 V105 M75 16 V105 M26 42 H94 M26 60 H94 M26 78 H94"
                    stroke={c.grid}
                    strokeWidth="1"
                />
                {/* Trailing Laser Glow Curtain */}
                <rect x="22" y={(scanY - 18).toFixed(2)} width="76" height="18" fill="url(#sec-laser-curtain)" />
                {/* Sharp Laser Beam */}
                <line x1="22" y1={scanY.toFixed(2)} x2="98" y2={scanY.toFixed(2)} stroke={c.accentLight} strokeWidth="2.5" />
            </g>

            {/* Central Verification Reticle & Checkmark */}
            <circle
                cx="60"
                cy="58"
                r="17.5"
                fill={c.surfaceStrong}
                stroke={c.accent}
                strokeWidth="1.6"
                strokeDasharray="8 4"
                transform={`rotate(${(-progress * 180).toFixed(1)} 60 58)`}
            />
            <g transform={`translate(60, 58) scale(${checkScale.toFixed(3)}) translate(-60, -58)`}>
                <path
                    d="M49 58 L56.5 65.5 L72 50"
                    stroke={c.accent}
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="36"
                    strokeDashoffset={(36 * (1 - checkProgress)).toFixed(2)}
                />
            </g>
        </svg>
    );
}

/**
 * 4. Inversión
 * 4 Exponential growth pillars strictly anchored to baseline y=94, with a dynamically
 * coupled curved spline trend line, data nodes, and rising ROI burst.
 */
export function InvestmentIcon({ className = 'about-icon-svg' }) {
    const { progress, theme } = useLoop(180);
    const c = getPalette(theme);
    const isLight = theme === 'light';

    const baselineY = 94;
    // Exponential bar heights with distinct staggered wave motion
    const bars = [
        { x: 22, cx: 28.5, h: wave(progress, 15, 28, 0.0, 1) },
        { x: 42, cx: 48.5, h: wave(progress, 26, 44, 0.18, 1) },
        { x: 62, cx: 68.5, h: wave(progress, 40, 60, 0.36, 1) },
        { x: 82, cx: 88.5, h: wave(progress, 56, 75, 0.54, 1) },
    ];

    // Compute exact top Y of each bar and place trend line vertices 8px above each bar top
    const pts = bars.map((b) => ({
        x: b.cx,
        barTop: baselineY - b.h,
        lineY: baselineY - b.h - 7,
        h: b.h,
    }));

    // Smooth monotonic cubic bezier curve through the 4 vertices (no S-overshoot)
    const linePath = `M ${pts[0].x} ${pts[0].lineY.toFixed(2)} C ${pts[0].x + 8} ${pts[0].lineY.toFixed(2)}, ${pts[1].x - 8} ${pts[1].lineY.toFixed(2)}, ${pts[1].x} ${pts[1].lineY.toFixed(2)} C ${pts[1].x + 8} ${pts[1].lineY.toFixed(2)}, ${pts[2].x - 8} ${pts[2].lineY.toFixed(2)}, ${pts[2].x} ${pts[2].lineY.toFixed(2)} C ${pts[2].x + 8} ${pts[2].lineY.toFixed(2)}, ${pts[3].x - 8} ${pts[3].lineY.toFixed(2)}, ${pts[3].x} ${pts[3].lineY.toFixed(2)}`;

    const peakHaloR = interpolate((progress * 2) % 1, [0, 1], [5, 14]);
    const peakHaloOp = interpolate((progress * 2) % 1, [0, 1], [0.85, 0]);

    return (
        <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="inv-bar-accent" x1="0" y1="18" x2="0" y2="94" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={c.accentLight} />
                    <stop offset="100%" stopColor={c.accent} />
                </linearGradient>
                <linearGradient id="inv-bar-soft" x1="0" y1="30" x2="0" y2="94" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={c.stroke} stopOpacity={isLight ? '0.32' : '0.48'} />
                    <stop offset="100%" stopColor={c.stroke} stopOpacity={isLight ? '0.14' : '0.16'} />
                </linearGradient>
            </defs>

            {/* Horizontal Coordinate Grid Lines */}
            <line x1="16" y1="34" x2="104" y2="34" stroke={c.grid} strokeWidth="1" strokeDasharray="3 3" />
            <line x1="16" y1="54" x2="104" y2="54" stroke={c.grid} strokeWidth="1" strokeDasharray="3 3" />
            <line x1="16" y1="74" x2="104" y2="74" stroke={c.grid} strokeWidth="1" strokeDasharray="3 3" />

            {/* 4 Growth Pillars Strictly Locked to Baseline y=94 */}
            {bars.map((b, i) => {
                const isLast = i === 3;
                const yTop = baselineY - b.h;
                return (
                    <g key={i}>
                        <rect
                            x={b.x}
                            y={yTop.toFixed(2)}
                            width="13"
                            height={b.h.toFixed(2)}
                            rx="3"
                            fill={isLast ? 'url(#inv-bar-accent)' : 'url(#inv-bar-soft)'}
                            stroke={isLast ? c.accent : c.strokeSecondary}
                            strokeWidth="1.2"
                        />
                    </g>
                );
            })}

            {/* Crisp Axis Baseline */}
            <path d="M15 94 H105" stroke={c.stroke} strokeWidth="2.8" strokeLinecap="round" />

            {/* Coupled Trend Line & Nodes (Move in exact lockstep with the bar tops!) */}
            <path
                d={linePath}
                stroke={c.stroke}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {pts.map((p, i) => {
                const isPeak = i === 3;
                return (
                    <g key={i}>
                        {isPeak && (
                            <circle
                                cx={p.x}
                                cy={p.lineY.toFixed(2)}
                                r={peakHaloR.toFixed(2)}
                                stroke={c.accent}
                                strokeWidth="1.6"
                                opacity={peakHaloOp.toFixed(2)}
                            />
                        )}
                        <circle
                            cx={p.x}
                            cy={p.lineY.toFixed(2)}
                            r={isPeak ? '5.2' : '3.4'}
                            fill={isPeak ? c.accent : c.stroke}
                            stroke={isPeak ? '#ffffff' : c.accent}
                            strokeWidth="1.6"
                        />
                    </g>
                );
            })}
        </svg>
    );
}

/**
 * 5. Servicio Personalizado
 * Bespoke client profile framed inside a precision tailor dial with 3 orbiting
 * modular service satellites (with mini glyphs) and traveling connection pulses.
 */
export function CustomServiceIcon({ className = 'about-icon-svg' }) {
    const { progress, phase, theme } = useLoop(180);
    const c = getPalette(theme);

    const dialSpin = progress * 360;
    const ripple1P = (progress * 1.5) % 1;
    const ripple2P = (progress * 1.5 + 0.5) % 1;

    // 3 Orbiting Bespoke Solution Satellites at r=41
    const satRadius = 41;
    const satellites = [0, 1, 2].map((i) => {
        const a = phase + (i * Math.PI * 2) / 3 - Math.PI / 2;
        const sx = 60 + Math.cos(a) * satRadius;
        const sy = 60 + Math.sin(a) * satRadius;
        const pulseT = (progress * 2 + i * 0.33) % 1;
        return {
            x: sx,
            y: sy,
            px: interpolate(pulseT, [0, 1], [sx, 60]),
            py: interpolate(pulseT, [0, 1], [sy, 60]),
            isPrimary: i === 0,
            kind: i,
        };
    });

    return (
        <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Precision Bespoke Caliper Ring */}
            <circle
                cx="60"
                cy="60"
                r="49"
                stroke={c.accent}
                strokeWidth="1.8"
                strokeDasharray="8 10"
                strokeOpacity="0.65"
                transform={`rotate(${dialSpin.toFixed(1)} 60 60)`}
            />

            {/* Expanding Concentric Ripples */}
            {[ripple1P, ripple2P].map((rp, idx) => (
                <circle
                    key={idx}
                    cx="60"
                    cy="60"
                    r={interpolate(rp, [0, 1], [22, 46]).toFixed(2)}
                    stroke={idx === 0 ? c.accent : c.stroke}
                    strokeWidth="1.4"
                    opacity={interpolate(rp, [0, 0.2, 1], [0, 0.55, 0]).toFixed(2)}
                />
            ))}

            {/* Dynamic Connection Beams & Traveling Pulses from Satellites to Center */}
            {satellites.map((s, i) => (
                <g key={`beam-${i}`}>
                    <line
                        x1="60"
                        y1="60"
                        x2={s.x.toFixed(2)}
                        y2={s.y.toFixed(2)}
                        stroke={s.isPrimary ? c.accent : c.strokeMuted}
                        strokeWidth="1.4"
                        strokeDasharray="3 3"
                    />
                    <circle
                        cx={s.px.toFixed(2)}
                        cy={s.py.toFixed(2)}
                        r="2"
                        fill={s.isPrimary ? c.accent : c.emerald}
                    />
                </g>
            ))}

            {/* Central Medallion */}
            <circle cx="60" cy="60" r="25" fill={c.surfaceStrong} stroke={c.stroke} strokeWidth="2.2" />
            <circle cx="60" cy="60" r="21" stroke={c.accent} strokeWidth="1.2" strokeOpacity="0.45" />

            {/* Executive Client Silhouette ("Traje a la medida") */}
            <circle cx="60" cy="49" r="7.5" stroke={c.stroke} strokeWidth="2.4" fill={c.surface} />
            <path
                d="M44 74 C44 63.5 50.5 59.5 60 59.5 C69.5 59.5 76 63.5 76 74"
                stroke={c.stroke}
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            {/* Bespoke Suit Lapel / Tie Accent */}
            <path d="M55 60.5 L60 68 L65 60.5" stroke={c.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="60" cy="71" r="2.2" fill={c.accent} />

            {/* Orbiting Satellites with Mini Bespoke Glyphs */}
            {satellites.map((s, i) => (
                <g key={`sat-${i}`} transform={`translate(${s.x.toFixed(2)}, ${s.y.toFixed(2)})`}>
                    <circle
                        cx="0"
                        cy="0"
                        r="7"
                        fill={c.surfaceStrong}
                        stroke={s.isPrimary ? c.accent : c.stroke}
                        strokeWidth="2"
                    />
                    {s.kind === 0 && (
                        <path d="M0 -3 L3 0 L0 3 L-3 0 Z" fill={c.accent} />
                    )}
                    {s.kind === 1 && (
                        <path d="M-2.5 0.2 L-0.6 2.1 L2.6 -1.5" stroke={c.emerald} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                    {s.kind === 2 && (
                        <circle cx="0" cy="0" r="2.6" fill={c.emerald} />
                    )}
                </g>
            ))}
        </svg>
    );
}

/**
 * 6. Scouting
 * High-precision talent radar with rotating conical sweep sector and
 * 4 quadrant talent blips with target lock-on brackets that trigger in exact
 * mathematical sync when the radar sweep passes over each target's angle.
 */
export function ScoutingIcon({ className = 'about-icon-svg' }) {
    const { progress, theme } = useLoop(180);
    const c = getPalette(theme);

    // Sweep angle in degrees (0..360, clockwise)
    const sweepDeg = progress * 360;
    const sweepRad = (sweepDeg * Math.PI) / 180;

    // 62-degree trailing wedge sector path from sweepDeg - 62 to sweepDeg
    const R = 46;
    const startRad = ((sweepDeg - 62) * Math.PI) / 180;
    const x1 = 60 + R * Math.cos(startRad);
    const y1 = 60 + R * Math.sin(startRad);
    const x2 = 60 + R * Math.cos(sweepRad);
    const y2 = 60 + R * Math.sin(sweepRad);
    const sectorPath = `M 60 60 L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

    // 4 Talent Targets across all 4 quadrants with exact polar angles
    const targets = [
        { x: 82, y: 36, deg: 312.5, color: c.emerald, r: 4.2 },
        { x: 76, y: 82, deg: 54.0, color: c.accentLight, r: 3.8 },
        { x: 35, y: 74, deg: 150.7, color: c.accent, r: 4.2 },
        { x: 38, y: 38, deg: 225.0, color: c.emerald, r: 3.5 },
    ];

    return (
        <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="scout-cone" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={c.accent} stopOpacity="0.42" />
                    <stop offset="100%" stopColor={c.accent} stopOpacity="0.08" />
                </radialGradient>
            </defs>

            {/* Outer & Inner Radar Range Rings */}
            <circle cx="60" cy="60" r="46" stroke={c.strokeSecondary} strokeWidth="2.2" />
            <circle cx="60" cy="60" r="32" stroke={c.strokeMuted} strokeWidth="1.4" strokeDasharray="4 4" />
            <circle
                cx="60"
                cy="60"
                r="16"
                stroke={c.accent}
                strokeWidth="1.8"
                strokeDasharray="4 4"
                transform={`rotate(${(-sweepDeg * 0.5).toFixed(1)} 60 60)`}
            />

            {/* Crosshairs */}
            <path d="M60 10 V110 M10 60 H110" stroke={c.grid} strokeWidth="1.2" strokeDasharray="4 4" />

            {/* Rotating Conical Radar Sweep Wedge */}
            <path d={sectorPath} fill="url(#scout-cone)" />

            {/* Leading Radar Laser Line */}
            <line
                x1="60"
                y1="60"
                x2={x2.toFixed(2)}
                y2={y2.toFixed(2)}
                stroke={c.accentLight}
                strokeWidth="2.6"
                strokeLinecap="round"
            />

            {/* Center Radar Pivot */}
            <circle cx="60" cy="60" r="3.8" fill={c.accent} stroke="#ffffff" strokeWidth="1" />

            {/* Synchronized Talent Blips (Triggered the exact instant sweepDeg passes target.deg!) */}
            {targets.map((t, idx) => {
                const degSinceHit = (((sweepDeg - t.deg) % 360) + 360) % 360;
                const hitIntensity = interpolate(
                    degSinceHit,
                    [0, 20, 180, 360],
                    [1, 1, 0.35, 0.25],
                    { extrapolateRight: 'clamp' }
                );
                const ringScale = interpolate(degSinceHit, [0, 130], [0.9, 2.3], { extrapolateRight: 'clamp' });
                const ringOpacity = interpolate(degSinceHit, [0, 25, 130], [0.95, 0.75, 0], { extrapolateRight: 'clamp' });

                return (
                    <g key={idx}>
                        {/* Expanding Lock-On Ring when swept */}
                        <circle
                            cx={t.x}
                            cy={t.y}
                            r={(t.r * ringScale).toFixed(2)}
                            stroke={t.color}
                            strokeWidth="1.6"
                            opacity={ringOpacity.toFixed(2)}
                        />
                        {/* Target Node */}
                        <circle
                            cx={t.x}
                            cy={t.y}
                            r={(t.r * (0.85 + 0.3 * hitIntensity)).toFixed(2)}
                            fill={t.color}
                            opacity={hitIntensity.toFixed(2)}
                        />
                    </g>
                );
            })}
        </svg>
    );
}
