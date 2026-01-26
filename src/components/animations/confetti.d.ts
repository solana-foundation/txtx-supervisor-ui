declare const confetti: {
  maxCount: number;
  speed: number;
  frameInterval: number;
  alpha: number;
  gradient: boolean;
  start: (timeout?: number, min?: number, max?: number) => void;
  stop: () => void;
  toggle: () => void;
  pause: () => void;
  resume: () => void;
  togglePause: () => void;
  remove: () => void;
  isPaused: () => boolean;
  isRunning: () => boolean;
};

export default confetti;
