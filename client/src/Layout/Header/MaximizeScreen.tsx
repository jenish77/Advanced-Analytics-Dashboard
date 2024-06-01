import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import { Href } from "@/Constant";
import React, { useState } from "react";
import { Maximize, Minimize } from "react-feather";

const MaximizeScreen = () => {
  const [fullScreen, setFullScreen] = useState(false);

  const fullScreenHandler = (isFullScreen: boolean) => {
    setFullScreen(isFullScreen);
    if (isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document?.exitFullscreen();
    }
  };

  return (
    <li id='Tooltip-1'>
      <a className="text-dark" onClick={() => fullScreenHandler(!fullScreen)} href={Href}>
        {fullScreen ? <Minimize /> : <Maximize />}
      </a>
      <CommonButtonsToolTip
        id={`Tooltip-1`}
        toolTipText={`${fullScreen ? "Exit Full screen" : "Full screen"}`}
      />
    </li>
  );
};

export default MaximizeScreen;
