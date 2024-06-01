import { Col, Tooltip } from "reactstrap";
// import { HeaderSearch } from "./HeaderSearch/HeaderSearch";
// import { Notification } from "./Notification";
import { SearchBox } from "./SearchBox";
// import { BookMark } from "./BookMark";
import { DarkMode } from "./DarkMode";
// import { MessageBox } from "./MessageBox";
// import { CartData } from "./CartData";
import { Profile } from "./Profile";
// import Languages from "./Languages";
import { useState } from "react";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import MaximizeScreen from "./MaximizeScreen";

export const HeaderRight = () => {
  const [basictooltip, setbasictooltip] = useState(false);

  return (
    <Col xxl="8" xl="6" md="7" xs="8" className="nav-right pull-right right-header p-0 ms-auto">
      <ul className="nav-menus">
        <SearchBox />
        <MaximizeScreen />
        {/* <HeaderSearch /> */}
        {/* <DarkMode /> */}
        <Profile />
      </ul>
    </Col>
  );
};
