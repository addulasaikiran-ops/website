// Central tuning values: keep animation timings and model configuration out of components.
export const modelConfig = {
  // Put the optimized vehicle model at public/models/sriram-vehicle.glb and set enabled to true.
  path: '/models/sriram-vehicle.glb',
  enabled: false,
  dracoPath: '/draco/',
};
export const motionConfig = {
  scroll: { start: 'top top', end: '+=180%', scrub: 1.15, pin: true },
  scene: {
    cameraStart: [0, 0.15, 8.4],
    cameraEnd: [0.2, 0.15, 10.5],
    heroPosition: [1.85, 0.05, 0],
    fleetPosition: [1.35, -0.1, 0],
    towingPosition: [1.25, -0.3, 0],
    contactPosition: [2.0, -0.05, 0],
    scaleStart: 0.9,
    scaleFleet: 1.03,
    scaleTowing: 1.1,
    scaleEnd: 0.72,
    rotationTurns: Math.PI * 1.25,
    accentStart: '#d9e4f2',
    accentFleet: '#c6d5e8',
    accentTowing: '#e8a34b',
    accentEnd: '#e8b653',
  },
  performance: { desktopDpr: [1, 1.8], mobileDpr: [1, 1.2], mobileBreakpoint: 760 },
  reveal: { duration: 0.8, stagger: 0.12, y: 28, blur: 5 },
  preloader: { minimumVisibleMs: 450 },
};
export const sceneMotion = { progress: 0, pointerX: 0, pointerY: 0, activeVehicle: 0 };
