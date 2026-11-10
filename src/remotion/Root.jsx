import React from 'react';
import { Composition, AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
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

export const ICON_REGISTRY = [
    { id: 'Recovery', title: '1. Administración y Recuperación', Component: RecoveryIcon, size: 400 },
    { id: 'Infrastructure', title: '2. Infraestructura', Component: InfrastructureIcon, size: 400 },
    { id: 'Security', title: '3. Análisis y Supervisión', Component: SecurityIcon, size: 400 },
    { id: 'Investment', title: '4. Inversión', Component: InvestmentIcon, size: 400 },
    { id: 'CustomService', title: '5. Servicio Personalizado', Component: CustomServiceIcon, size: 400 },
    { id: 'Scouting', title: '6. Scouting', Component: ScoutingIcon, size: 400 },
    { id: 'AssetManagement', title: '7. Administración de Activos', Component: AssetManagementServiceIcon, size: 500 },
    { id: 'LegalCollection', title: '8. Cobranza Judicial y Extrajudicial', Component: LegalCollectionServiceIcon, size: 500 },
    { id: 'ContactCenter', title: '9. Contact Center', Component: ContactCenterServiceIcon, size: 500 },
];

function SingleIconStage({ Component, theme = 'dark' }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const bg = theme === 'light' ? '#f8fafc' : '#111a42';

    return (
        <AbsoluteFill
            style={{
                backgroundColor: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 28,
            }}
        >
            <LiveFrameContext.Provider value={{ frame, fps, theme }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Component className="" />
                </div>
            </LiveFrameContext.Provider>
        </AbsoluteFill>
    );
}

/**
 * Filmstrip inspector for a single icon: renders 4 keyframes (f=15, 65, 110, 155) in Dark Mode
 * + 1 keyframe in Light Mode so we can visually judge every icon's motion and contrast.
 */
function IconFilmstripStage({ title, Component }) {
    const sampleFrames = [
        { frame: 15, label: 'Frame 15 (t=0.08)', theme: 'dark' },
        { frame: 65, label: 'Frame 65 (t=0.36)', theme: 'dark' },
        { frame: 110, label: 'Frame 110 (t=0.61)', theme: 'dark' },
        { frame: 155, label: 'Frame 155 (t=0.86)', theme: 'dark' },
        { frame: 65, label: 'Light Mode (f=65)', theme: 'light' },
    ];

    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#0b102b',
                color: '#f8fafc',
                fontFamily: 'sans-serif',
                padding: '24px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,107,0,0.3)', paddingBottom: 10 }}>
                <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>{title}</span>
                <span style={{ fontSize: 14, color: '#FF9E44' }}>Remotion 4.0.542 — 60fps Motion Graphics Audit</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, flex: 1, alignItems: 'center', paddingTop: 14 }}>
                {sampleFrames.map((sf, i) => {
                    const isLight = sf.theme === 'light';
                    return (
                        <div
                            key={i}
                            style={{
                                background: isLight ? '#ffffff' : 'rgba(23, 36, 89, 0.55)',
                                border: isLight ? '2px solid rgba(255,107,0,0.4)' : '1px solid rgba(255,255,255,0.12)',
                                borderRadius: 14,
                                padding: 14,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LiveFrameContext.Provider value={{ frame: sf.frame, fps: 60, theme: sf.theme }}>
                                    <Component className="" />
                                </LiveFrameContext.Provider>
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: isLight ? '#172459' : '#cbd5e1',
                                    marginTop: 8,
                                }}
                            >
                                {sf.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
}

export function RemotionRoot() {
    return (
        <>
            {ICON_REGISTRY.map((item) => (
                <React.Fragment key={item.id}>
                    <Composition
                        id={item.id}
                        component={() => <SingleIconStage Component={item.Component} theme="dark" />}
                        durationInFrames={180}
                        fps={60}
                        width={item.size}
                        height={item.size}
                    />
                    <Composition
                        id={`Audit-${item.id}`}
                        component={() => <IconFilmstripStage title={item.title} Component={item.Component} />}
                        durationInFrames={1}
                        fps={60}
                        width={1400}
                        height={360}
                    />
                </React.Fragment>
            ))}
        </>
    );
}

