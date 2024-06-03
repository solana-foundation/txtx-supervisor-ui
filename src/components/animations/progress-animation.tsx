import React from "react";
import { useLottie } from "lottie-react";
import progressAnimation from "../../../assets/lottie/progress-animation.json";

const END_FRAME = 900;
const RESTART_FRAME = 450;

const ProgressAnimation = () => {
  const options = {
    animationData: progressAnimation,
    loop: true,
    onLoopComplete: console.log,
    // playSegments: [
    //   750, 900,
    //   // [750, END_FRAME],
    //   // [750, END_FRAME],
    // ],
  };

  const { View, goToAndPlay, getDuration, playSegments } = useLottie(options);
  console.log("duration", getDuration(true));
  playSegments([RESTART_FRAME, END_FRAME]);
  return (
    // <div className="w-full p-6 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-center items-start gap-2.5 inline-flex">
    <div>{View}</div>
    // </div>
  );
  return (
    <div className="w-full justify-center flex flex-col items-center">
      <div className="mx-auto w-[1024px] max-w-full min-h-full px-6 pt-6 justify-center flex flex-col inline-flex gap-8">
        <div className="w-full p-6 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-center items-start gap-2.5 inline-flex">
          {View}
        </div>
      </div>
    </div>
  );
};

export default ProgressAnimation;
