import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { LiveFrameContext } from './theme.js';
import {
    RecoveryIcon,
    InfrastructureIcon,
    SecurityIcon,
    InvestmentIcon,
    CustomServiceIcon,
    ScoutingIcon,
} from './icons/AboutIcons.jsx';
import {
    AssetManagementServiceIcon,
    LegalCollectionServiceIcon,
    ContactCenterServiceIcon,
} from './icons/ServiceIcons.jsx';

const ICON_MAP = {
    Recovery: { Component: RecoveryIcon, className: 'about-icon-svg' },
    Infrastructure: { Component: InfrastructureIcon, className: 'about-icon-svg' },
    Security: { Component: SecurityIcon, className: 'about-icon-svg' },
    Investment: { Component: InvestmentIcon, className: 'about-icon-svg' },
    CustomService: { Component: CustomServiceIcon, className: 'about-icon-svg' },
    Scouting: { Component: ScoutingIcon, className: 'about-icon-svg' },
    AssetManagement: { Component: AssetManagementServiceIcon, className: 'service-animation-svg' },
    LegalCollection: { Component: LegalCollectionServiceIcon, className: 'service-animation-svg' },
    ContactCenter: { Component: ContactCenterServiceIcon, className: 'service-animation-svg' },
};

function LiveRemotionIconPlayer({ Component, className, containerEl }) {
    const [frame, setFrame] = useState(0);
    const [theme, setTheme] = useState(() => document.body.getAttribute('data-theme') || 'dark');
    const frameRef = useRef(0);
    const isVisibleRef = useRef(true);
    const isHoveredRef = useRef(false);

    useEffect(() => {
        // Watch theme attribute on body
        const updateTheme = () => {
            setTheme(document.body.getAttribute('data-theme') || 'dark');
        };
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

        // Watch visibility for CPU efficiency
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    isVisibleRef.current = entry.isIntersecting;
                });
            },
            { rootMargin: '200px' }
        );
        if (containerEl) io.observe(containerEl);

        // Hover speed boost on parent card
        const card = containerEl ? containerEl.closest('.feature-card, .service-item') : null;
        const onEnter = () => { isHoveredRef.current = true; };
        const onLeave = () => { isHoveredRef.current = false; };
        if (card) {
            card.addEventListener('mouseenter', onEnter);
            card.addEventListener('mouseleave', onLeave);
        }

        let rafId = null;
        let lastTime = performance.now();

        const tick = (now) => {
            const dt = Math.min(50, now - lastTime);
            lastTime = now;

            if (isVisibleRef.current) {
                const speed = isHoveredRef.current ? 1.55 : 1.0;
                frameRef.current = (frameRef.current + (dt / 1000) * 60 * speed) % 1800;
                setFrame(frameRef.current);
            }
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            observer.disconnect();
            io.disconnect();
            if (card) {
                card.removeEventListener('mouseenter', onEnter);
                card.removeEventListener('mouseleave', onLeave);
            }
        };
    }, [containerEl]);

    return (
        <LiveFrameContext.Provider value={{ frame, fps: 60, theme }}>
            <Component className={className} />
        </LiveFrameContext.Provider>
    );
}

export function mountWebsiteIcons() {
    const containers = document.querySelectorAll('[data-remotion-icon]');
    containers.forEach((el) => {
        const iconKey = el.getAttribute('data-remotion-icon');
        const entry = ICON_MAP[iconKey];
        if (!entry) return;

        const root = createRoot(el);
        root.render(
            <LiveRemotionIconPlayer
                Component={entry.Component}
                className={entry.className}
                containerEl={el}
            />
        );
    });
}

