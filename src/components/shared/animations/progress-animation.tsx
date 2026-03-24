import React, { useEffect, useRef } from "react";
import Lottie from "react-lottie-player";
import progressAnimation from "../../../../assets/lottie/progress-animation.json";
import type { AnimationItem } from "lottie-web";

const END_FRAME = 900;
const RESTART_FRAME = 450;

const ProgressAnimation = () => {
  const lottieRef = useRef<AnimationItem>(null);
  useEffect(() => {
    const lottie = lottieRef.current;
    if (!lottie) return;
    lottie.goToAndPlay(0);
    lottie.playSegments([RESTART_FRAME, END_FRAME]);
  }, [lottieRef]);
  return (
    <div className="text-sm text-red-500 font-['Poppins'] font-bold">
      <Lottie animationData={progressAnimation} ref={lottieRef} play />
    </div>
  );
};

export default ProgressAnimation;
