import React, { createContext, useContext } from 'react';
import { interpolate, spring, Easing } from 'remotion';

export const LiveFrameContext = createContext({
    frame: 0,
    fps: 60,
    theme: 'dark',
});

export function useAnimState() {
    return useContext(LiveFrameContext);
}

/**
 * Cyclical 0..1 progress for a 180-frame (3s @ 60fps) seamless loop
 */
export function useLoop(periodFrames = 180) {
    const { frame, fps, theme } = useAnimState();
    const f = ((frame % periodFrames) + periodFrames) % periodFrames;
    const progress = f / periodFrames;
    const phase = progress * Math.PI * 2;
    return { frame: f, rawFrame: frame, fps, progress, phase, periodFrames, theme };
}

/**
 * Smooth cyclical wave between [min, max] using Remotion's interpolate + Easing
 */
export function wave(progress, min, max, offset = 0, cycles = 1) {
    const p = (((progress * cycles + offset) % 1) + 1) % 1;
    // Map 0 -> 0.5 -> 1 smoothly using Easing.inOut(Easing.sin)
    const val = p <= 0.5
        ? interpolate(p, [0, 0.5], [0, 1], { easing: Easing.inOut(Easing.sin) })
        : interpolate(p, [0.5, 1], [1, 0], { easing: Easing.inOut(Easing.sin) });
    return min + (max - min) * val;
}

/**
 * Smooth cyclical pulse using Remotion's spring() with soft loop reset
 */
export function loopSpring(frame, fps, periodFrames = 180, delay = 0, config = { damping: 12, stiffness: 120, mass: 0.8 }) {
    const localFrame = (((frame - delay) % periodFrames) + periodFrames) % periodFrames;
    const enter = spring({
        frame: localFrame,
        fps,
        config,
    });
    const exit = interpolate(
        localFrame,
        [periodFrames - 24, periodFrames - 2],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
    );
    return enter * exit;
}

/**
 * Theme-aware palette that works both in standalone Remotion renders and in CSS-variable website DOM
 */
export function getPalette(theme = 'dark') {
    const isLight = theme === 'light';
    return {
        accent: '#FF6B00',
        accentLight: '#FF9E44',
        accentSoft: isLight ? 'rgba(255, 107, 0, 0.14)' : 'rgba(255, 107, 0, 0.20)',
        accentGlow: isLight ? 'rgba(255, 107, 0, 0.25)' : 'rgba(255, 107, 0, 0.45)',
        emerald: '#22C55E',
        cyan: '#38BDF8',
        stroke: isLight ? '#172459' : '#F8FAFC',
        strokeSecondary: isLight ? 'rgba(23, 36, 89, 0.55)' : 'rgba(248, 250, 252, 0.65)',
        strokeMuted: isLight ? 'rgba(23, 36, 89, 0.25)' : 'rgba(248, 250, 252, 0.28)',
        grid: isLight ? 'rgba(23, 36, 89, 0.09)' : 'rgba(248, 250, 252, 0.09)',
        surface: isLight ? 'rgba(23, 36, 89, 0.05)' : 'rgba(14, 21, 58, 0.65)',
        surfaceStrong: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(23, 36, 89, 0.85)',
    };
}

