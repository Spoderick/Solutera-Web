import React from 'react';
import { interpolate, Easing } from 'remotion';
import { useLoop, wave, getPalette } from '../theme.js';

/**
 * Service 1: Administración de Activos (240x240)
 * Data-driven portfolio analytics terminal with comparative trend curves,
 * bottom volume histogram, milestone nodes, and a live scanning playhead
 * with adaptive tooltip offset so it never touches the top header bar.
 */
export function AssetManagementServiceIcon({ className = 'service-animation-svg' }) {
    const { progress, theme } = useLoop(180);
    const c = getPalette(theme);

    // 5 Key curve control points (x: 36..204)
    const nodes = [
        { x: 36, y: 164 },
        { x: 78, y: 112 },
        { x: 120, y: 126 },
        { x: 162, y: 76 },
        { x: 204, y: 50 },
    ];

    const curvePath = `M 36 164 C 54 164, 62 112, 78 112 C 96 112, 104 126, 120 126 C 138 126, 146 76, 162 76 C 180 76, 188 50, 204 50`;
    const areaPath = `${curvePath} L 204 184 L 36 184 Z`;

    // Playhead sweeps across x: 36 -> 204 smoothly
    const scanT = wave(progress, 0, 1, 0, 1);
    const scanX = interpolate(scanT, [0, 1], [36, 204]);

    const getCurveY = (x) => {
        for (let i = 0; i < nodes.length - 1; i++) {
            const a = nodes[i];
            const b = nodes[i + 1];
            if (x >= a.x && x <= b.x) {
                const localT = (x - a.x) / (b.x - a.x);
                const s = localT * localT * (3 - 2 * localT);
                return a.y + (b.y - a.y) * s;
            }
        }
        return nodes[nodes.length - 1].y;
    };

    const scanY = getCurveY(scanX);

    // Adaptive tooltip offset: shifts left when approaching the right edge/top so it stays comfortably inside the chart area
    const tooltipOffsetX = interpolate(scanX, [36, 150, 204], [-14, -20, -48], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const tooltipOffsetY = interpolate(scanY, [50, 90, 164], [10, -26, -28], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // 9 Volume bars along bottom axis y=184
    const volumeBars = Array.from({ length: 9 }, (_, i) => {
        const bx = 42 + i * 19;
        const bh = wave(progress, 8, 25, i * 0.11, 2);
        return { x: bx, h: bh };
    });

    return (
        <svg className={className} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="srv-asset-area" x1="0" y1="46" x2="0" y2="184" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={c.accent} stopOpacity="0.34" />
                    <stop offset="75%" stopColor={c.accent} stopOpacity="0.06" />
                    <stop offset="100%" stopColor={c.accent} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="srv-scan-beam" x1="0" y1="46" x2="0" y2="184" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={c.accentLight} stopOpacity="0.1" />
                    <stop offset="50%" stopColor={c.accentLight} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={c.accent} stopOpacity="0.15" />
                </linearGradient>
            </defs>

            {/* Analytics Terminal Frame */}
            <rect
                x="20"
                y="22"
                width="200"
                height="194"
                rx="14"
                fill={c.surface}
                stroke={c.strokeMuted}
                strokeWidth="1.5"
            />
            {/* Terminal Top Status Bar */}
            <circle cx="35" cy="33" r="3" fill={c.accent} />
            <circle cx="45" cy="33" r="3" fill={c.emerald} />
            <circle cx="55" cy="33" r="3" fill={c.strokeMuted} />
            {/* Top-Right Live Telemetry Status Pill */}
            <rect x="164" y="29" width="42" height="8" rx="4" fill={c.grid} />
            <rect
                x="164"
                y="29"
                width={interpolate(scanT, [0, 1], [16, 40]).toFixed(1)}
                height="8"
                rx="4"
                fill={c.emerald}
                opacity="0.8"
            />
            <line x1="20" y1="44" x2="220" y2="44" stroke={c.grid} strokeWidth="1.2" />

            {/* Coordinate Grid Lines */}
            {[78, 120, 162].map((gx) => (
                <line key={`vx-${gx}`} x1={gx} y1="44" x2={gx} y2="184" stroke={c.grid} strokeWidth="1.2" strokeDasharray="4 4" />
            ))}
            {[76, 112, 148].map((gy) => (
                <line key={`hy-${gy}`} x1="36" y1={gy} x2="204" y2={gy} stroke={c.grid} strokeWidth="1.2" strokeDasharray="4 4" />
            ))}

            {/* Area Fill Under Curve */}
            <path d={areaPath} fill="url(#srv-asset-area)" />

            {/* Bottom Portfolio Volume Bars */}
            {volumeBars.map((vb, i) => (
                <rect
                    key={i}
                    x={vb.x}
                    y={(184 - vb.h).toFixed(2)}
                    width="8"
                    height={vb.h.toFixed(2)}
                    rx="2"
                    fill={i >= 6 ? c.accent : c.strokeMuted}
                    opacity={i >= 6 ? '0.50' : '0.35'}
                />
            ))}

            {/* Benchmark Target Trend Line (Dotted) */}
            <path
                d="M 36 170 C 90 150, 150 118, 204 88"
                stroke={c.strokeMuted}
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
            />

            {/* Main Solutera Recovery Curve */}
            <path
                d={curvePath}
                stroke={c.accent}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Bottom & Left Axes */}
            <path d="M36 52 V184 H206" stroke={c.strokeSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Scanning Playhead Vertical Line */}
            <line
                x1={scanX.toFixed(2)}
                y1="48"
                x2={scanX.toFixed(2)}
                y2="184"
                stroke="url(#srv-scan-beam)"
                strokeWidth="2"
                strokeDasharray="3 3"
            />

            {/* Milestone Nodes along the curve */}
            {nodes.map((n, i) => {
                const dist = Math.abs(scanX - n.x);
                const activeBoost = interpolate(dist, [0, 26], [1.35, 1], { extrapolateRight: 'clamp' });
                const isPeak = i === nodes.length - 1;
                return (
                    <g key={i} transform={`translate(${n.x}, ${n.y}) scale(${activeBoost.toFixed(2)})`}>
                        {isPeak && (
                            <circle
                                cx="0"
                                cy="0"
                                r={wave(progress, 8, 14, 0, 2).toFixed(2)}
                                stroke={c.accent}
                                strokeWidth="1.5"
                                opacity={wave(progress, 0.7, 0.15, 0, 2).toFixed(2)}
                            />
                        )}
                        <circle
                            cx="0"
                            cy="0"
                            r={isPeak ? '6' : '4'}
                            fill={isPeak ? c.accent : c.stroke}
                            stroke={isPeak ? '#ffffff' : c.accent}
                            strokeWidth="2"
                        />
                    </g>
                );
            })}

            {/* Live Tracking Orb & Adaptive Floating ROI Badge on Playhead */}
            <g transform={`translate(${scanX.toFixed(2)}, ${scanY.toFixed(2)})`}>
                <circle cx="0" cy="0" r="9" fill={c.accent} opacity="0.28" />
                <circle cx="0" cy="0" r="4.5" fill="#ffffff" stroke={c.accent} strokeWidth="2.5" />
                {/* Adaptive Tooltip Pill */}
                <g transform={`translate(${tooltipOffsetX.toFixed(1)}, ${tooltipOffsetY.toFixed(1)})`}>
                    <rect x="0" y="0" width="40" height="18" rx="5" fill={c.accent} stroke="#ffffff" strokeWidth="1" />
                    <path d="M9 12 L14 7 L18 10 L26 5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="29" cy="6" r="1.8" fill="#ffffff" />
                </g>
            </g>
        </svg>
    );
}

/**
 * Service 2: Cobranza Judicial y Extrajudicial (240x240)
 * Authoritative Scales of Justice with mathematically coupled pan suspension points
 * (chains never detach from the tilting beam!) + synchronized judicial gavel strike
 * landing at t=0.35 (frame ~65) with radial impact sparks and shockwave ring.
 */
export function LegalCollectionServiceIcon({ className = 'service-animation-svg' }) {
    const { progress, phase, theme } = useLoop(180);
    const c = getPalette(theme);

    // Gavel strike cycle timed so impact occurs cleanly around t=0.35..0.38 (Frame 63..68):
    // 0.00 -> 0.14: poised (-14 deg)
    // 0.14 -> 0.28: wind up (-34 deg)
    // 0.28 -> 0.35: strike down flat onto sound block (0 deg!)
    // 0.35 -> 0.39: hold contact briefly (0 deg)
    // 0.39 -> 0.50: recoil (-18 deg)
    // 0.50 -> 1.00: settle (-14 deg)
    const gavelAngle = interpolate(
        progress,
        [0, 0.14, 0.28, 0.35, 0.39, 0.50, 0.68, 1],
        [-14, -14, -34, 0, 0, -18, -14, -14],
        { easing: Easing.inOut(Easing.cubic) }
    );

    // Impact flash & shockwave ring right at progress = 0.34..0.60
    const impactOpacity = interpolate(
        progress,
        [0, 0.33, 0.36, 0.44, 0.60, 1],
        [0, 0, 1, 0.85, 0, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const impactScale = interpolate(
        progress,
        [0.33, 0.60],
        [0.5, 1.75],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const blockCompress = interpolate(
        progress,
        [0.33, 0.36, 0.48],
        [1, 1.14, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Scale Beam tilts smoothly (±6 degrees) around pivot (132, 92)
    const pivotX = 132;
    const pivotY = 92;
    const beamRadius = 56;
    const beamDeg = Math.sin(phase - 0.5) * 6.0;
    const beamRad = (beamDeg * Math.PI) / 180;

    // Exact mathematical coordinates of the Left and Right beam tips!
    const leftTipX = pivotX - beamRadius * Math.cos(beamRad);
    const leftTipY = pivotY - beamRadius * Math.sin(beamRad);
    const rightTipX = pivotX + beamRadius * Math.cos(beamRad);
    const rightTipY = pivotY + beamRadius * Math.sin(beamRad);

    return (
        <svg className={className} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Legal Authority Halo */}
            <circle cx="132" cy="132" r="76" stroke={c.grid} strokeWidth="1.2" strokeDasharray="6 6" />

            {/* ================= JUDICIAL GAVEL & SOUND BLOCK (Upper-Left) ================= */}
            {/* Sound Block centered at (80, 68) */}
            <g transform={`translate(80, 68) scale(${blockCompress.toFixed(3)}, ${(2 - blockCompress).toFixed(3)}) translate(-80, -68)`}>
                <rect x="56" y="63" width="48" height="9" rx="4.5" fill={c.strokeMuted} stroke={c.strokeSecondary} strokeWidth="1.6" />
                <rect x="63" y="59" width="34" height="5" rx="2.5" fill={c.accent} />
            </g>

            {/* Impact Shockwave & Radial Sparks at (80, 58) */}
            <g
                transform={`translate(80, 58) scale(${impactScale.toFixed(3)}) translate(-80, -58)`}
                opacity={impactOpacity.toFixed(3)}
            >
                <circle cx="80" cy="58" r="18" stroke={c.accentLight} strokeWidth="2" strokeDasharray="5 4" />
                <line x1="80" y1="36" x2="80" y2="25" stroke={c.accentLight} strokeWidth="2.8" strokeLinecap="round" />
                <line x1="63" y1="42" x2="53" y2="33" stroke={c.accent} strokeWidth="2.8" strokeLinecap="round" />
                <line x1="97" y1="42" x2="107" y2="33" stroke={c.accent} strokeWidth="2.8" strokeLinecap="round" />
                <line x1="56" y1="54" x2="45" y2="51" stroke={c.accentLight} strokeWidth="2.2" strokeLinecap="round" />
                <line x1="104" y1="54" x2="115" y2="51" stroke={c.accentLight} strokeWidth="2.2" strokeLinecap="round" />
            </g>

            {/* Gavel Pivoting around Grip (32, 47) — At 0 deg, gavel head lands flat on Sound Block (80, 59) */}
            <g transform={`rotate(${gavelAngle.toFixed(2)} 32 47)`}>
                {/* Handle */}
                <line x1="32" y1="47" x2="80" y2="47" stroke={c.stroke} strokeWidth="5.2" strokeLinecap="round" />
                <circle cx="32" cy="47" r="4.5" fill={c.accent} stroke="#ffffff" strokeWidth="1.2" />
                {/* Sculpted Gavel Head centered at x=80, bottom at y=59 */}
                <rect x="66" y="34" width="28" height="25" rx="4.5" fill={c.accent} stroke="#ffffff" strokeWidth="1.6" />
                <line x1="66" y1="40" x2="94" y2="40" stroke="#ffffff" strokeWidth="1.6" opacity="0.7" />
                <line x1="66" y1="53" x2="94" y2="53" stroke="#ffffff" strokeWidth="1.6" opacity="0.7" />
            </g>

            {/* ================= SCALES OF JUSTICE (Center-Right Stage) ================= */}
            {/* Pedestal Base & Fluted Pillar */}
            <path d="M88 206 H176" stroke={c.stroke} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M104 196 H160 L166 206 H98 Z" fill={c.strokeMuted} />
            <path d="M132 86 V196" stroke={c.stroke} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M126 110 V190 M138 110 V190" stroke={c.grid} strokeWidth="1.2" />

            {/* Tilting Scale Beam (Connected exactly between leftTip and rightTip) */}
            <line
                x1={leftTipX.toFixed(2)}
                y1={leftTipY.toFixed(2)}
                x2={rightTipX.toFixed(2)}
                y2={rightTipY.toFixed(2)}
                stroke={c.stroke}
                strokeWidth="4.5"
                strokeLinecap="round"
            />
            {/* Central Fulcrum Crown */}
            <circle cx={pivotX} cy={pivotY} r="7.5" fill={c.surfaceStrong} stroke={c.stroke} strokeWidth="2.5" />
            <circle cx={pivotX} cy={pivotY} r="3.5" fill={c.accent} />

            {/* Left Scale Pan (Suspended directly from leftTipX, leftTipY) */}
            <g transform={`translate(${leftTipX.toFixed(2)}, ${leftTipY.toFixed(2)})`}>
                <circle cx="0" cy="0" r="3.2" fill={c.accent} />
                <line x1="0" y1="0" x2="-18" y2="38" stroke={c.strokeSecondary} strokeWidth="2" />
                <line x1="0" y1="0" x2="18" y2="38" stroke={c.strokeSecondary} strokeWidth="2" />
                {/* Legal Contract / Document Emblem inside Left Pan */}
                <rect x="-10" y="24" width="20" height="14" rx="2" fill={c.surfaceStrong} stroke={c.emerald} strokeWidth="1.8" />
                <line x1="-6" y1="29" x2="6" y2="29" stroke={c.emerald} strokeWidth="1.6" strokeLinecap="round" />
                <line x1="-6" y1="33" x2="3" y2="33" stroke={c.strokeSecondary} strokeWidth="1.6" strokeLinecap="round" />
                {/* Pan Bowl */}
                <path d="M-23 38 H23" stroke={c.accent} strokeWidth="3.2" strokeLinecap="round" />
                <path d="M-22 38 Q0 54 22 38 Z" fill={c.accentSoft} stroke={c.accent} strokeWidth="2.5" strokeLinejoin="round" />
            </g>

            {/* Right Scale Pan (Suspended directly from rightTipX, rightTipY) */}
            <g transform={`translate(${rightTipX.toFixed(2)}, ${rightTipY.toFixed(2)})`}>
                <circle cx="0" cy="0" r="3.2" fill={c.accent} />
                <line x1="0" y1="0" x2="-18" y2="38" stroke={c.strokeSecondary} strokeWidth="2" />
                <line x1="0" y1="0" x2="18" y2="38" stroke={c.strokeSecondary} strokeWidth="2" />
                {/* Recovered Asset Coin Stack inside Right Pan */}
                <ellipse cx="0" cy="34" rx="11" ry="3.5" fill={c.accent} />
                <ellipse cx="0" cy="29" rx="9.5" ry="3" fill={c.accentLight} />
                {/* Pan Bowl */}
                <path d="M-23 38 H23" stroke={c.accent} strokeWidth="3.2" strokeLinecap="round" />
                <path d="M-22 38 Q0 54 22 38 Z" fill={c.accentSoft} stroke={c.accent} strokeWidth="2.5" strokeLinejoin="round" />
            </g>
        </svg>
    );
}

/**
 * Service 3: Contact Center (240x240)
 * Omnichannel predictive contact center hub featuring a studio-grade headset,
 * live 9-bar voice equalizer inside the frame, concentric acoustic waves,
 * and predictive dialing communication nodes with trajectory arcs.
 */
export function ContactCenterServiceIcon({ className = 'service-animation-svg' }) {
    const { progress, theme } = useLoop(180);
    const c = getPalette(theme);

    // 9 Live Voice Equalizer Bars centered inside headset (x=92..148, y=114)
    const eqBars = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((idx, i) => {
        const maxH = idx === 0 ? 36 : Math.abs(idx) === 1 ? 28 : Math.abs(idx) === 2 ? 22 : Math.abs(idx) === 3 ? 16 : 10;
        const h = wave(progress, 5, maxH, i * 0.12, 3);
        return {
            x: 120 + idx * 6.5 - 1.8,
            h,
            isAccent: Math.abs(idx) <= 1,
        };
    });

    // Expanding Acoustic Ripple Rings
    const r1 = (progress * 2) % 1;
    const r2 = (progress * 2 + 0.5) % 1;

    // Soundwave arcs opacity
    const sw1 = wave(progress, 0.3, 1, 0.0, 3);
    const sw2 = wave(progress, 0.2, 0.95, 0.25, 3);

    // Incoming/Outgoing Omnichannel Signal Particles along predictive paths
    const p1 = (progress * 1.5) % 1;
    const p2 = (progress * 1.5 + 0.5) % 1;

    return (
        <svg className={className} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Concentric Predictive Dialing Rings */}
            {[r1, r2].map((rp, i) => (
                <circle
                    key={i}
                    cx="120"
                    cy="114"
                    r={interpolate(rp, [0, 1], [48, 96]).toFixed(2)}
                    stroke={i === 0 ? c.accent : c.stroke}
                    strokeWidth="1.5"
                    opacity={interpolate(rp, [0, 0.2, 1], [0, 0.35, 0]).toFixed(2)}
                />
            ))}

            {/* Outer Predictive Dialing Orbit */}
            <circle cx="120" cy="114" r="88" stroke={c.grid} strokeWidth="1.2" strokeDasharray="5 7" />

            {/* Predictive Dialing Connection Lines from Badges to Headset */}
            <line x1="56" y1="60" x2="86" y2="86" stroke={c.strokeMuted} strokeWidth="1.4" strokeDasharray="3 3" />
            <line x1="184" y1="60" x2="154" y2="86" stroke={c.strokeMuted} strokeWidth="1.4" strokeDasharray="3 3" />

            {/* Omnichannel Connection Badges (Top-Left & Top-Right) */}
            <g transform={`translate(44, ${wave(progress, 48, 55, 0, 2).toFixed(2)})`}>
                <rect x="-14" y="-11" width="28" height="22" rx="6" fill={c.surfaceStrong} stroke={c.accent} strokeWidth="1.8" />
                <line x1="-7" y1="-3" x2="7" y2="-3" stroke={c.accent} strokeWidth="2" strokeLinecap="round" />
                <line x1="-7" y1="3" x2="3" y2="3" stroke={c.strokeSecondary} strokeWidth="2" strokeLinecap="round" />
            </g>
            <g transform={`translate(196, ${wave(progress, 52, 45, 0.5, 2).toFixed(2)})`}>
                <rect x="-14" y="-11" width="28" height="22" rx="6" fill={c.surfaceStrong} stroke={c.emerald} strokeWidth="1.8" />
                <path d="M-5 0 L-1 4 L6 -4" stroke={c.emerald} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Signal Packets Traveling from Badges to Headset */}
            <circle
                cx={interpolate(p1, [0, 1], [56, 86]).toFixed(2)}
                cy={interpolate(p1, [0, 1], [60, 86]).toFixed(2)}
                r="3.8"
                fill={c.accent}
                opacity={interpolate(p1, [0, 0.2, 0.85, 1], [0, 1, 1, 0]).toFixed(2)}
            />
            <circle
                cx={interpolate(p2, [0, 1], [184, 154]).toFixed(2)}
                cy={interpolate(p2, [0, 1], [60, 86]).toFixed(2)}
                r="3.8"
                fill={c.emerald}
                opacity={interpolate(p2, [0, 0.2, 0.85, 1], [0, 1, 1, 0]).toFixed(2)}
            />

            {/* ================= STUDIO HEADSET ================= */}
            <path
                d="M68 118 V96 C68 62 90 42 120 42 C150 42 172 62 172 96 V118"
                stroke={c.stroke}
                strokeWidth="4.5"
                strokeLinecap="round"
            />
            <path
                d="M84 62 C93 52 106 48 120 48 C134 48 147 52 156 62"
                stroke={c.accent}
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Sculpted Earcups */}
            <rect x="54" y="98" width="18" height="36" rx="8" fill={c.accent} stroke={c.stroke} strokeWidth="2" />
            <rect x="168" y="98" width="18" height="36" rx="8" fill={c.accent} stroke={c.stroke} strokeWidth="2" />
            <line x1="63" y1="106" x2="63" y2="126" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <line x1="177" y1="106" x2="177" y2="126" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

            {/* Articulated Microphone Boom + Active Voice Capsule */}
            <path
                d="M63 134 C68 162 88 172 114 172"
                stroke={c.stroke}
                strokeWidth="4"
                strokeLinecap="round"
            />
            <rect x="110" y="166" width="20" height="12" rx="6" fill={c.accent} stroke="#ffffff" strokeWidth="1.6" />
            <circle
                cx="120"
                cy="172"
                r={wave(progress, 7, 13, 0, 3).toFixed(2)}
                stroke={c.emerald}
                strokeWidth="1.5"
                opacity={wave(progress, 0.7, 0.1, 0, 3).toFixed(2)}
            />
            <circle cx="120" cy="172" r="2.6" fill="#ffffff" />

            {/* Center 9-Bar Live Audio Equalizer Waveform (Inside Headset) */}
            {eqBars.map((bar, i) => (
                <rect
                    key={i}
                    x={bar.x.toFixed(2)}
                    y={(114 - bar.h / 2).toFixed(2)}
                    width="3.6"
                    height={bar.h.toFixed(2)}
                    rx="1.8"
                    fill={bar.isAccent ? c.accent : c.stroke}
                    opacity={bar.isAccent ? '1' : '0.78'}
                />
            ))}

            {/* Symmetric Left & Right Acoustic Waveforms */}
            <path
                d="M196 96 C206 106 206 126 196 136"
                stroke={c.accent}
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity={sw1.toFixed(2)}
            />
            <path
                d="M208 84 C224 100 224 132 208 148"
                stroke={c.accentLight}
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity={sw2.toFixed(2)}
            />
            <path
                d="M44 96 C34 106 34 126 44 136"
                stroke={c.accent}
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity={sw1.toFixed(2)}
            />
            <path
                d="M32 84 C16 100 16 132 32 148"
                stroke={c.accentLight}
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity={sw2.toFixed(2)}
            />
        </svg>
    );
}
