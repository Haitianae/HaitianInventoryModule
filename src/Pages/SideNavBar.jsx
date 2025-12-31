// import React from "react";
// import { Menu, Button, Avatar, Tooltip } from "antd";
// import {
//   UserOutlined,
//   UserAddOutlined,
//   FileDoneOutlined,
// } from "@ant-design/icons";

// import {
//   AppstoreOutlined,
//   PieChartOutlined,
//   OrderedListOutlined,
//   BarChartOutlined,
//   UnorderedListOutlined,
//   LogoutOutlined,
//   IdcardOutlined,
// } from "@ant-design/icons";
// import "../App.css";
// import HaitianLogo from "../Images/HaitianLogo.png";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function SideNavBar({ onLogout, user }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const access = user?.access || {};
//   const email = user?.email || "N/A";

//   const customStyles = `
//     .ant-menu {
//       background: #0D3884 !important;
//       border-inline-end: none !important;
//   width: 95%;
//    }

//     .ant-menu-item {
//   font-size: 15px;
//   padding: 12px 16px !important;
//   margin: 6px 10px !important;
//   border-radius: 8px !important;
//   transition: all 0.4s ease-in-out;
//   color: #e5e7eb !important;
//   overflow: hidden;
//   position: relative;
//   box-sizing: border-box;
//   font-weight: 400;
//   transform: scale(1); /* base scale */
// }

// .ant-menu-item:hover {
//   background-color: rgb(2 92 248 / 60%) !important;
//   color: #ffffff !important;
//   transform: scale(1.03); /* slight enlarge */

// }

// .ant-menu-item-selected {
//   background-color: rgb(2 92 248 / 60%) !important;
//   color: #ffffff !important;
//   font-weight: 600;
//   box-sizing: border-box;
//   transform: none;
//   margin: 6px 10px !important;
//   border-left:5px solid white
// }

//     .ant-menu-item-selected::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background-color: rgba(255, 255, 255, 0.07);
//       border-radius: 8px;
//       animation: pulseFade 1.8s infinite ease-in-out;
//       z-index: 0;
//     }

//     @keyframes pulseFade {
//       0%, 100% { opacity: 0.2; }
//       50% { opacity: 0.4; }
//     }

//     .haitian-logo {
//       display: block;
//       width: 90%;
//       marign: 0 auto !important

//     }

//     .haitian-title {
//       color: #f3f4f6;
//       font-size: 16px;
//       text-align: center;
//       font-weight: 300;
//     }

//     .sidebar-divider {
//       border-top: 2px solid  #6e6e6e;
//       width:90%;
//       margin: 0 auto;

//     }

//     .logout-container {
//       padding: 10px;
//       border-top: 2px solid #6e6e6e;
//     }

//     .logout-button {
//       color: #fff;
//       font-size: 16px !important;
//       padding: 10px 16px;
//       border-radius: 8px;
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       transition: background-color 0.3s;
//     }

//     .logout-button:hover {
//       background-color: #e11d48;
//       color: #fff;
//     }
//       .ant-tooltip .ant-tooltip-inner {
//     min-width: 28px;
//     min-height: 32px;
//     padding: 6px 8px;
//     color: white !important;
//     text-align: center !important;
//     text-decoration: none;
//     word-wrap: break-word;
//     background-color: rgba(137, 137, 137, 1) !important;
//     border-radius: 6px;
//     border: 2px solid rgba(137, 137, 137, 0.87);
//     box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
//     box-sizing: border-box;
// }
//   `;

//   return (
//     <>
//       <style>{customStyles}</style>
//       <div
//         className="shadow"
//         style={{
//           width: 270,
//           height: "100vh",
//           backgroundColor: "#0D3884",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//           position: "fixed",
//           left: 0,
//           top: 0,
//         }}
//       >
//         {/* Top: Logo + Title + Menu */}
//         <div>
//           <div style={{ width: "100%" }} className="m-auto text-center ">
//             <div className="d-flex flex-column align-items-center">
//               <img
//                 src={HaitianLogo}
//                 alt="Haitian Logo"
//                 className="haitian-logo mt-2 text-center "
//               />
//             </div>
//           </div>
//           <div className="haitian-title mt-2  ">
//             Inventory Management System
//           </div>

//           <div className="m-auto text-center mt-3 ">
//             {/* <Avatar
//               size={50}
//               style={{ backgroundColor: "white", color: "#0d3884" }}
//             /> */}
//             <div className="profile-box">
//               <Avatar size={55} className="profile-avatar">
//                 {email?.slice(0, 2).toUpperCase() || "N/A"}
//               </Avatar>
//               <Tooltip title={email}>
//                 {" "}
//                 {/* Tooltip shows full email */}
//                 <div
//                   className="profile-username"
//                   style={{
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     color: "white",
//                   }}
//                 >
//                   {email || "N/A"}
//                 </div>
//               </Tooltip>{" "}
//             </div>
//           </div>
//           <div className="sidebar-divider mt-3" />

//         <Menu
//   mode="inline"
//   theme="dark"
//   selectedKeys={[`/${location.pathname.split("/")[1] || ""}`]}
//   onClick={({ key }) => {
//     if (key === "logout") onLogout();
//     else navigate(key);
//   }}
//   className="mt-2"
// >
//   {access["Dashboard"] !== "No Access" && (
//     <Menu.Item key="/dashboard" icon={<PieChartOutlined />}>
//       Dashboard
//     </Menu.Item>
//   )}
//   {access["Inventory"] !== "No Access" && (
//     <Menu.Item key="/inventory" icon={<AppstoreOutlined />}>
//       Inventory
//     </Menu.Item>
//   )}
//   {access["Product Categories"] !== "No Access" && (
//     <Menu.Item key="/productCategories" icon={<UnorderedListOutlined />}>
//       Product Categories
//     </Menu.Item>
//   )}
//   {access["Customer Details"] !== "No Access" && (
//     <Menu.Item key="/customerDetails" icon={<IdcardOutlined />}>
//       Customer Details
//     </Menu.Item>
//   )}
//   {access["Delivery Note"] !== "No Access" && (
//     <Menu.Item key="/deliveryNote" icon={<FileDoneOutlined />}>
//       Delivery Note
//     </Menu.Item>
//   )}
//   {access["Add User"] !== "No Access" && (
//     <Menu.Item key="/addUser" icon={<UserAddOutlined />}>
//       Add New User
//     </Menu.Item>
//   )}
//   {access["Reports"] !== "No Access" && (
//     <Menu.Item key="/reports" icon={<BarChartOutlined />}>
//       Reports
//     </Menu.Item>
//   )}
// </Menu>

//         </div>

//         {/* Bottom: Logout */}
//         <div className="logout-container sidebar-divider">
//           <Button
//             className="logoutButton mb-1"
//             onClick={onLogout}
//             style={{ cursor: "pointer" }}
//             title="Logout"
//             size="large"
//           >
//             <LogoutOutlined />
//             Logout
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// }

// SideNavBar.jsx
// import React from "react";
// import { Menu, Button, Avatar, Tooltip } from "antd";
// import {
//   UserAddOutlined,
//   FileDoneOutlined,
//   AppstoreOutlined,
//   PieChartOutlined,
//   BarChartOutlined,
//   UnorderedListOutlined,
//   LogoutOutlined,
//   IdcardOutlined,
// } from "@ant-design/icons";
// import "../App.css";
// import HaitianLogo from "../Images/HaitianLogo.png";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function SideNavBar({ onLogout, user }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const access = user?.access || {};
//   const email = user?.email || "N/A";

//   const menuItemsConfig = [
//     {
//       key: "/dashboard",
//       label: "Dashboard",
//       icon: <PieChartOutlined />,
//       access: "Dashboard",
//     },
//     {
//       key: "/inventory",
//       label: "Inventory",
//       icon: <AppstoreOutlined />,
//       access: "Inventory",
//     },
//     {
//       key: "/productCategories",
//       label: "Product Categories",
//       icon: <UnorderedListOutlined />,
//       access: "Product Categories",
//     },
//     {
//       key: "/customerDetails",
//       label: "Customer Details",
//       icon: <IdcardOutlined />,
//       access: "Customer Details",
//     },
//     {
//       key: "/deliveryNote",
//       label: "Delivery Note",
//       icon: <FileDoneOutlined />,
//       access: "Delivery Note",
//     },
//     {
//       key: "/addUser",
//       label: "Add New User",
//       icon: <UserAddOutlined />,
//       access: "Add User",
//     },
//     {
//       key: "/reports",
//       label: "Reports",
//       icon: <BarChartOutlined />,
//       access: "Reports",
//     },
//   ];

//   // 👉 derive visible items directly every render
//   const visibleMenuItems = menuItemsConfig.filter(
//     (item) => (access[item.access] ?? "No Access") !== "No Access"
//   );

//   const customStyles = `
//     .ant-menu {
//       background: #0D3884 !important;
//       border-inline-end: none !important;
//   width: 95%;
//    }

//     .ant-menu-item {
//   font-size: 15px;
//   padding: 12px 16px !important;
//   margin: 6px 10px !important;
//   border-radius: 8px !important;
//   transition: all 0.4s ease-in-out;
//   color: #e5e7eb !important;
//   overflow: hidden;
//   position: relative;
//   box-sizing: border-box;
//   font-weight: 400;
//   transform: scale(1); /* base scale */
// }

// .ant-menu-item:hover {
//   background-color: rgb(2 92 248 / 60%) !important;
//   color: #ffffff !important;
//   transform: scale(1.03); /* slight enlarge */

// }

// .ant-menu-item-selected {
//   background-color: rgb(2 92 248 / 60%) !important;
//   color: #ffffff !important;
//   font-weight: 600;
//   box-sizing: border-box;
//   transform: none;
//   margin: 6px 10px !important;
//   border-left:5px solid white
// }

//     .ant-menu-item-selected::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background-color: rgba(255, 255, 255, 0.07);
//       border-radius: 8px;
//       animation: pulseFade 1.8s infinite ease-in-out;
//       z-index: 0;
//     }

//     @keyframes pulseFade {
//       0%, 100% { opacity: 0.2; }
//       50% { opacity: 0.4; }
//     }

//     .haitian-logo {
//       display: block;
//       width: 80%;
//       marign: 0 auto !important

//     }

//     .haitian-title {
//       color: #f3f4f6;
//       font-size: 16px;
//       text-align: center;
//       font-weight: 300;
//     }

//     .sidebar-divider {
//       border-top: 2px solid  #6e6e6e;
//       width:90%;
//       margin: 0 auto;

//     }

//     .logout-container {
//       padding: 10px;
//       border-top: 2px solid #6e6e6e;
//     }

//     .logout-button {
//       color: #fff;
//       font-size: 16px !important;
//       padding: 10px 16px;
//       border-radius: 8px;
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       transition: background-color 0.3s;
//     }

//     .logout-button:hover {
//       background-color: #e11d48;
//       color: #fff;
//     }
//     .ant-tooltip .ant-tooltip-inner {

//     padding: 6px 8px;
//     color: white;
//     text-align: start;
//     text-decoration: none;
//     word-wrap: break-word;
//     background-color: rgba(137, 137, 137, 1) !important;
//     border-radius: 6px;
//       border: 2px solid rgba(137, 137, 137, 0.87);
//     box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
//     box-sizing: border-box;
// }
//   `;

//   return (
//     <>
//       <style>{customStyles}</style>
//       <div
//         className="shadow"
//         style={{
//           width: 270,
//           height: "100vh",
//           backgroundColor: "#0D3884",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//           position: "fixed",
//           left: 0,
//           top: 0,
//         }}
//       >
//         <div>
//           <div className="d-flex flex-column align-items-center mt-2">
//             <img
//               src={HaitianLogo}
//               alt="Haitian Logo"
//               className="haitian-logo"
//             />
//           </div>

//           <div className="haitian-title mt-2">Inventory Management System</div>

//           {/* email with ellipsis + tooltip */}
//           <div className="m-auto text-center mt-3">
//             <div className="profile-box">
//               <Avatar size={55} className="profile-avatar">
//                 {email?.slice(0, 2).toUpperCase() || "N/A"}
//               </Avatar>
//               <Tooltip title={email}>
//                 <div
//                   className="profile-username"
//                   style={{
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     marginTop: 8,
//                     color: "white",
//                   }}
//                 >
//                   {email || "N/A"}
//                 </div>
//               </Tooltip>
//             </div>
//           </div>

//           <div className="sidebar-divider mt-3" />

//           <Menu
//             mode="inline"
//             theme="dark"
//             selectedKeys={[`/${location.pathname.split("/")[1] || ""}`]}
//             onClick={({ key }) =>
//               key === "logout" ? onLogout() : navigate(key)
//             }
//             className="mt-2"
//           >
//             {visibleMenuItems.map((item) => (
//               <Menu.Item key={item.key} icon={item.icon}>
//                 {item.label}
//               </Menu.Item>
//             ))}
//           </Menu>
//         </div>

//         <div className="logout-container sidebar-divider">
//           <Button
//             className="logoutButton mb-1"
//             onClick={onLogout}
//             title="Logout"
//             size="large"
//           >
//             <LogoutOutlined />
//             Logout
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// }

import React from "react";
import { Menu, Button, Avatar, Tooltip } from "antd";
import {
  UserAddOutlined,
  FileDoneOutlined,
  AppstoreOutlined,
  PieChartOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  IdcardOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "../App.css";
import HaitianLogo from "../Images/HaitianLogo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SideNavBar({ onLogout, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const access = user?.access || {};
  const email = user?.email || "N/A";

  const menuItemsConfig = [
    {
      key: "/dashboard",
      label: "Dashboard",
      icon: <PieChartOutlined />,
      access: "Dashboard",
    },
    {
      key: "/inventory",
      label: "Inventory",
      icon: <AppstoreOutlined />,
      access: "Inventory",
    },
    {
      key: "/productCategories",
      label: "Product Categories",
      icon: <UnorderedListOutlined />,
      access: "Product Categories",
    },
    {
      key: "/customerDetails",
      label: "Customer Details",
      icon: <IdcardOutlined />,
      access: "Customer Details",
    },
    {
      key: "/deliveryNote",
      label: "Delivery Note",
      icon: <FileDoneOutlined />,
      access: "Delivery Note",
    },
    {
      key: "/purchaseRequest",
      label: "Purchase Request",
      icon: <ShoppingCartOutlined />,
      access: "Purchase Request",
    },
    {
      key: "/addUser",
      label: "Add New User",
      icon: <UserAddOutlined />,
      access: "Add User",
    },
    // { key: "/reports", label: "Reports", icon: <BarChartOutlined />, access: "Reports" },
  ];

  // show only items where access is not "No Access"
  const visibleMenuItems = menuItemsConfig.filter(
    (item) => (access[item.access] ?? "No Access") !== "No Access"
  );
  const firstAllowedPage =
    visibleMenuItems.length > 0 ? visibleMenuItems[0].key : null;

  useEffect(() => {
    const allowed = visibleMenuItems.some(
      (item) => item.key === location.pathname
    );

    if (!allowed && firstAllowedPage) {
      navigate(firstAllowedPage);
    }
  }, [location.pathname, visibleMenuItems, firstAllowedPage]);

  const customStyles = `
    .ant-menu {
      background: #0D3884 !important;
      border-inline-end: none !important;
      width: 95%;
    }
    .ant-menu-item {
      font-size: 15px;
      padding: 12px 16px !important;
      margin: 6px 10px !important;
      border-radius: 8px !important;
      transition: all 0.4s ease-in-out;
      color: #e5e7eb !important;
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
      font-weight: 400;
      transform: scale(1);
    }
    .ant-menu-item:hover {
      background-color: rgb(2 92 248 / 60%) !important;
      color: #ffffff !important;
      transform: scale(1.03);
    }
    .ant-menu-item-selected {
      background-color: rgb(2 92 248 / 60%) !important;
      color: #ffffff !important;
      font-weight: 600;
      box-sizing: border-box;
      transform: none;
      margin: 6px 10px !important;
      border-left: 5px solid white;
    }
    .ant-menu-item-selected::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: rgba(255, 255, 255, 0.07);
      border-radius: 8px;
      animation: pulseFade 1.8s infinite ease-in-out;
      z-index: 0;
    }
    @keyframes pulseFade {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.4; }
    }
    .haitian-logo {
      display: block;
      width: 80%;
      margin: 0 auto !important; /* ✅ fixed typo */
    }
    .haitian-title {
      color: #f3f4f6;
      font-size: 16px;
      text-align: center;
      font-weight: 300;
    }
    .sidebar-divider {
      border-top: 2px solid #6e6e6e;
      width: 90%;
      margin: 0 auto;
    }
    .logout-container {
      padding: 10px;
      border-top: 2px solid #6e6e6e;
    }
    .logout-button {
      color: #fff;
      font-size: 16px !important;
      padding: 10px 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background-color 0.3s;
    }
    .logout-button:hover {
      background-color: #e11d48;
      color: #fff;
    }
    .ant-tooltip .ant-tooltip-inner {
      padding: 6px 8px;
      color: white;
      text-align: start;
      word-wrap: break-word;
      background-color: rgba(137, 137, 137, 1) !important;
      border-radius: 6px;
      border: 2px solid rgba(137, 137, 137, 0.87);
      box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
                  0 3px 6px -4px rgba(0, 0, 0, 0.12),
                  0 9px 28px 8px rgba(0, 0, 0, 0.05);
      box-sizing: border-box;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div
        className="shadow"
        style={{
          width: 290,
          height: "100vh",
          backgroundColor: "#0D3884",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        <div>
          <div className="d-flex flex-column align-items-center mt-2">
            <img
              src={HaitianLogo}
              alt="Haitian Logo"
              className="haitian-logo"
            />
          </div>

          <div className="haitian-title mt-2">Inventory Management System</div>

          {/* email with ellipsis + tooltip */}
          <div className="m-auto text-center mt-3">
            <div className="profile-box">
              <Avatar size={55} className="profile-avatar">
                {email?.slice(0, 2).toUpperCase() || "N/A"}
              </Avatar>
              <Tooltip title={email}>
                <div
                  className="profile-username"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginTop: 8,
                    color: "white",
                  }}
                >
                  {email || "N/A"}
                </div>
              </Tooltip>
            </div>
          </div>

          <div className="sidebar-divider mt-3" />

          {/* ✅ safer selectedKeys (still keeps same design) */}
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[location.pathname]}
            onClick={({ key }) =>
              key === "logout" ? onLogout() : navigate(key)
            }
            className="mt-2"
          >
            {visibleMenuItems.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        </div>
        <div>
          <p className="copyRightsText m-0 p-0 ms-4">
            © 2025 Haitian Middle East & Africa.
          </p>
        </div>
        <div className="logout-container sidebar-divider">
          <Button
            className="logoutButton mb-1"
            onClick={onLogout}
            title="Logout"
            size="large"
          >
            <LogoutOutlined /> Logout
          </Button>
        </div>
      </div>
    </>
  );
}
