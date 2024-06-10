import React, { useEffect, useState } from "react";
import { useLottie } from "lottie-react";
import progressAnimation from "../../../assets/lottie/progress-animation.json";
import { useAppSelector } from "../../hooks";
import { selectIsSomeProgressBlockVisible } from "../../reducers/runbooks-slice";
import { classNames } from "../../utils/helpers";

const END_FRAME = 900;
const RESTART_FRAME = 450;

const ProgressAnimation = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const isVisible = useAppSelector(selectIsSomeProgressBlockVisible);

  const options = {
    animationData: progressAnimation,
    loop: true,
  };
  const { View, goToAndPlay, pause, playSegments } = useLottie(options);

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      goToAndPlay(0);
      playSegments([RESTART_FRAME, END_FRAME]);
      document
        .getElementById("progress-bar")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      setVisible(false);
      pause();
    }
  }, [isVisible]);
  return (
    <div
      id="progress-bar"
      className={classNames(
        "transition-opacity ease-in-out delay-150 duration-300 text-sm text-red-500 font-['Poppins'] font-bold",
        visible ? "opacity-100" : "opacity-0 h-0",
      )}
    >
      {View}
    </div>
  );
};

export default ProgressAnimation;
