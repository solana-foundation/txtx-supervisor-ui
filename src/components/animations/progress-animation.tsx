import React, { useEffect, useState } from "react";
import { useLottie } from "lottie-react";
import progressAnimation from "../../../assets/lottie/progress-animation.json";
import { useAppSelector } from "../../hooks";
import {
  selectRunbook,
  selectVisibleProgressBlock,
} from "../../reducers/runbooks-slice";
import { classNames } from "../../utils/helpers";

const END_FRAME = 900;
const RESTART_FRAME = 450;

const ProgressAnimation = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const { progressBlocks } = useAppSelector(selectRunbook);
  const progressBlock = useAppSelector(selectVisibleProgressBlock);

  const options = {
    animationData: progressAnimation,
    loop: true,
  };
  const { View, goToAndPlay, pause, playSegments } = useLottie(options);

  useEffect(() => {
    if (progressBlocks.some((block) => block.visible)) {
      setVisible(true);
      goToAndPlay(0);
      playSegments([RESTART_FRAME, END_FRAME]);
      document
        .getElementById("progress-bar")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      if (visible) {
        // if previously visible, scroll up a bit to see the bottom of the last panel
        document
          .getElementById("progress-bar")
          ?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
      setVisible(false);
      pause();
    }
  }, [progressBlocks]);
  return (
    <div
      id="progress-bar"
      className={classNames(
        "transition-opacity ease-in-out delay-150 duration-300 my-20 pt-4 text-sm text-red-500 font-['Poppins'] font-bold",
        true ? "opacity-100" : "opacity-0",
      )}
    >
      {View}
    </div>
  );
};

export default ProgressAnimation;
