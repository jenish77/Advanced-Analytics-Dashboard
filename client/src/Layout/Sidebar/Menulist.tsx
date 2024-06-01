import SVG from "@/CommonComponent/SVG";
import { useAppSelector } from "@/Redux/Hooks";
import { MenuListType, SidebarItemTypes } from "@/Types/LayoutTypes";
import { useTranslation } from "@/app/i18n/client";
import { authStore } from "@/context/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Menulist: React.FC<MenuListType> = ({ menu, setActiveMenu, activeMenu, level, className }) => {
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const pathname = usePathname();
  const { updatePageTitle } = authStore();
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const { sidebarIconType } = useAppSelector((state) => state.themeCustomizer);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initializeActiveMenu(menu);
      setInitialized(true);
    }
  }, [pathname, initialized, menu]);

  const initializeActiveMenu = (menuItems: SidebarItemTypes[] | any, currentLevel = 0, parentActiveMenus: string[] = []) => {
    for (let item of menuItems) {
      if (item.path && ActiveNavLinkUrl(item.path)) {
        const newActiveMenu = [...parentActiveMenus, item.title];
        setActiveMenu(newActiveMenu);
        return true;
      }
      if (item.children && initializeActiveMenu(item.children, currentLevel + 1, [...parentActiveMenus, item.title])) {
        return true;
      }
    }
    return false;
  };

  const ActiveNavLinkUrl = (path?: string, active?: boolean) => {
    return pathname.split(`${i18LangStatus}`)[1] === path ? (active ? active : true) : "";
  };

  const shouldSetActive = ({ item }: SidebarItemTypes) => {
    let returnValue = false;
    if (item?.path === pathname.split(`${i18LangStatus}`)[1]) returnValue = true;
    if (!returnValue && item?.children) {
      item?.children.every((subItem) => {
        returnValue = shouldSetActive({ item: subItem });
        return !returnValue;
      });
    }
    return returnValue;
  };

  const handleMenuClick = (itemTitle: string, itemPath?: string) => {
    const temp = [...activeMenu];
    temp[level] = itemTitle;
    for (let i = level + 1; i < temp.length; i++) {
      temp[i] = '';
    }
    updatePageTitle(itemTitle);
    setActiveMenu(temp);
  };

  return (
    <>
      {menu?.map((item: any, index: any) => (
        <li key={index} className={`${level === 0 ? "sidebar-list" : ""} ${pinedMenu.includes(item.title || "") ? "pined" : ""} ${(item.children ? item.children.map((innerItem: any) => ActiveNavLinkUrl(innerItem.path)).includes(true) : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title ? "active" : ""} `}>
          <Link
            className={`${!className && level !== 2 ? "sidebar-link sidebar-title" : ""} ${(item.children ? item.children.map((innerItem: any) => ActiveNavLinkUrl(innerItem.path)).includes(true) : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title ? "active" : ""}`}
            href={item?.path ? `/${i18LangStatus}${item.path}` : ""}
            onClick={() => handleMenuClick(item.title, item.path)}
          >
            <div className="d-flex align-items-center gap-1 sidebar-title">
              {item.icon && (<SVG className={`${sidebarIconType}-icon`} iconId={`${sidebarIconType}-${item.icon}`} />)}
              <span className={item.lanClass && item.lanClass}>{t(item.title)}</span>
            </div>
            {item.children && (<div className="according-menu"><i className="fa fa-angle-right" /></div>)}
          </Link>
          {item.children && (
            <ul className={`${level !== 0 ? "nav-sub-childmenu submenu-content" : "sidebar-submenu "}`}>
              <Menulist menu={item.children} activeMenu={activeMenu} setActiveMenu={setActiveMenu} level={level + 1} className="sidebar-submenu" />
            </ul>
          )}
        </li>
      ))}
    </>
  );
};

export default Menulist;






// // import SVG from "@/CommonComponent/SVG";
// // import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
// // import { handlePined } from "@/Redux/Reducers/LayoutSlice";
// // import { MenuListType, SidebarItemTypes } from "@/Types/LayoutTypes";
// // import { useTranslation } from "@/app/i18n/client";
// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import { useEffect } from "react";

// // const Menulist: React.FC<MenuListType> = ({ menu, setActiveMenu, activeMenu, level, className }) => {
// //   const { pinedMenu } = useAppSelector((state) => state.layout);
// //   const pathname = usePathname();
// //   const dispatch = useAppDispatch();
// //   const { i18LangStatus } = useAppSelector((state) => state.langSlice);
// //   const { t } = useTranslation(i18LangStatus);
// //   const { sidebarIconType } = useAppSelector((state) => state.themeCustomizer)

// //   const shouldSetActive = ({ item }: SidebarItemTypes) => {
// //     var returnValue = false;
// //     if (item?.path === pathname.split(`${i18LangStatus}`)[1]) returnValue = true;
// //     if (!returnValue && item?.children) {
// //       item?.children.every((subItem) => {
// //         returnValue = shouldSetActive({ item: subItem });
// //         return !returnValue;
// //       });
// //     }
// //     return returnValue;
// //   };

// //   useEffect(() => {
// //     menu?.forEach((item: any) => {
// //       let gotValue = shouldSetActive({ item });
// //       if (gotValue) {
// //         let temp = [...activeMenu];
// //         temp[level] = t(item.title);
// //         setActiveMenu(temp);
// //       }
// //     });
// //   }, [])

// //   return (
// //     <>
// //       {menu?.map((item, index) => (
// //         <li key={index} className={`${level === 0 ? "sidebar-list" : ""} ${pinedMenu.includes(item.title || "") ? "pined" : ""}  ${activeMenu[level] === item.title ? "active" : ""} `}>
// //           {level === 0 && <i className="fa fa-thumb-tack" onClick={() => dispatch(handlePined(item.title))}></i>}
// //           <Link
// //             className={`${!className && level !== 2 ? "sidebar-link sidebar-title" : ""}  ${activeMenu[level] === item.title ? "active" : ""}`}
// //             href={item?.path ? `/${i18LangStatus}${item.path}` : ""}
// //             onClick={() => {
// //               const temp = activeMenu;
// //               temp[level] = item.title !== temp[level] && (item.title);
// //               setActiveMenu([...temp]);
// //             }}>
// //             {item.icon && (<SVG className={`${sidebarIconType}-icon`} iconId={`${sidebarIconType}-${item.icon}`} />)}
// //             <span className={item.lanClass && item.lanClass}>{t(item.title)}</span>
// //             {item.children && (<div className="according-menu"><i className="fa fa-angle-right" /></div>)}
// //           </Link>
// //           {item.children && (
// //             <ul className={`${level !== 0 ? "nav-sub-childmenu submenu-content" : "sidebar-submenu "}`}>
// //               <Menulist menu={item.children} activeMenu={activeMenu} setActiveMenu={setActiveMenu} level={level + 1} className="sidebar-submenu" />
// //             </ul>
// //           )}
// //         </li>
// //       ))}
// //     </>
// //   );
// // };

// // export default Menulist;

// import SVG from "@/CommonComponent/SVG";
// import { useAppSelector } from "@/Redux/Hooks";
// import { MenuListType, SidebarItemTypes } from "@/Types/LayoutTypes";
// import { useTranslation } from "@/app/i18n/client";
// import { authStore } from "@/context/AuthProvider";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const Menulist: React.FC<MenuListType> = ({ menu, setActiveMenu, activeMenu, level, className }) => {
//   const { pinedMenu } = useAppSelector((state) => state.layout);
//   const pathname = usePathname();
//   const { updatePageTitle } = authStore();
//   const { i18LangStatus } = useAppSelector((state) => state.langSlice);
//   const { t } = useTranslation(i18LangStatus);
//   const { sidebarIconType } = useAppSelector((state) => state.themeCustomizer)

//   const ActiveNavLinkUrl = (path?: string, active?: boolean) => {
//     return pathname.split(`${i18LangStatus}`)[1] === path ? (active ? active : true) : "";
//   };

//   const shouldSetActive = ({ item }: SidebarItemTypes) => {
//     var returnValue = false;
//     if (item?.path === pathname.split(`${i18LangStatus}`)[1]) returnValue = true;
//     if (!returnValue && item?.children) {
//       item?.children.every((subItem) => {
//         returnValue = shouldSetActive({ item: subItem });
//         return !returnValue;
//       });
//     }
//     return returnValue;
//   };

//   return (
//     <>
//       {menu?.map((item, index) => (
//         <li key={index}  className={`${level === 0 ? "sidebar-list" : ""}  ${pinedMenu.includes(item.title || "") ? "pined" : ""}  ${(item.children ? item.children.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true) : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title ? "active" : ""} `}>
//           {/* {level === 0 && <i className="fa fa-thumb-tack" onClick={() => dispatch(handlePined(item.title))}></i>} */}
//           <Link
//             className={`${!className && level !== 2 ? "sidebar-link sidebar-title" : ""}  ${(item.children ? item.children.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true) : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title ? "active" : ""}`}
//             href={item?.path ? `/${i18LangStatus}${item.path}` : ""}
//             onClick={() => {
//               const temp = activeMenu;
//               temp[level] = item.title !== temp[level] && (item.title);
//               updatePageTitle(item.title)
//               setActiveMenu([...temp]);
//             }}>
//             <div className="d-flex align-items-center gap-1 sidebar-title">
//               {item.icon && (<SVG className={`${sidebarIconType}-icon`} iconId={`${sidebarIconType}-${item.icon}`} />)}
//               <span className={item.lanClass && item.lanClass}>{t(item.title)}</span>
//             </div>
//             {item.children && (<div className="according-menu"><i className="fa fa-angle-right" /></div>)}
//           </Link>
//           {item.children && (
//             <ul className={`${level !== 0 ? "nav-sub-childmenu submenu-content" : "sidebar-submenu "}`}>
//               <Menulist menu={item.children} activeMenu={activeMenu} setActiveMenu={setActiveMenu} level={level + 1} className="sidebar-submenu" />
//             </ul>
//           )}
//         </li>
//       ))}
//     </>
//   );
// };

// export default Menulist;
