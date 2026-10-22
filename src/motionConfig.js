// Central tuning values for scroll choreography and 3D performance.
export const motionConfig = {
  scroll: { start: 'top top', end: '+=180%', scrub: 1.15, pin: true },
  scene: {
    cameraStart: [0, 0, 8],
    cameraEnd: [0.8, 0.35, 6.2],
    objectStart: [1.9, 0.1, 0],
    objectEnd: [0.4, -0.15, 0],
    scaleStart: 0.92,
    scaleEnd: 1.2,
    rotationTurns: Math.PI * 1.6,
    accentStart: '#d9e4f2',
    accentEnd: '#e8b653',
  },
  performance: { desktopDpr: [1, 1.6], mobileDpr: [1, 1.15], mobileBreakpoint: 760 },
  reveal: { duration: 0.8, stagger: 0.12, y: 28, blur: 5 },
};
export const sceneMotion = { progress: 0, pointerX: 0, pointerY: 0 };
