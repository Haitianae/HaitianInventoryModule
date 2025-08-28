// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import { useState, useEffect } from "react";
// import SideNavBar from "./Pages/SideNavBar";
// import Inventory from "./Pages/Inventory";
// import ProductCategories from "./Pages/ProdcutCategories";
// import Login from "./Pages/Login";
// import { notification } from "antd";
// import AddUser from "./Pages/AddUser";
// import CustomerDetails from "./Pages/CustomerDetails";

// notification.config({
//   maxCount: 2,
//   placement: "bottomRight",
//   duration: 3,
// });

// function AnimatedRoutes({ isLoggedIn, handleLoginSuccess, username }) {
//   const location = useLocation();
//   const [fadeClass, setFadeClass] = useState("fade-in");

//   useEffect(() => {
//     setFadeClass("fade-out");
//     const timeout = setTimeout(() => {
//       setFadeClass("fade-in");
//     }, 100); // short delay for fade-out

//     return () => clearTimeout(timeout);
//   }, [location.pathname]);

//   return (
//     <div className={`page-container ${fadeClass}`}>
//       <Routes location={location} key={location.pathname}>
//         <Route
//           path="/"
//           element={
//             isLoggedIn ? (
//               <Navigate to="/inventory" />
//             ) : (
//               <Login onLoginSuccess={handleLoginSuccess} />
//             )
//           }
//         />
//         <Route
//           path="/inventory"
//           element={isLoggedIn ? <Inventory /> : <Navigate to="/" />}
//         />
//         <Route
//           path="/productCategories"
//           element={
//             isLoggedIn ? (
//               <ProductCategories username={username} />
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />
//         <Route
//           path="/customerDetails"
//           element={
//             isLoggedIn ? (
//               <CustomerDetails username={username} />
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />
//         <Route
//           path="/addUser"
//           element={isLoggedIn ? <AddUser /> : <Navigate to="/" />}
//         />
//         <Route
//           path="*"
//           element={<Navigate to={isLoggedIn ? "/inventory" : "/"} />}
//         />
//       </Routes>
//     </div>
//   );
// }

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const [username, setUsername] = useState("");

//   const handleLoginSuccess = (usernameFromLogin) => {
//     setIsLoggedIn(true);
//     setUsername(usernameFromLogin);
//   };

//   const handleLogout = () => {
//     setIsFadingOut(true);
//     setTimeout(() => {
//       setIsLoggedIn(false);
//       setIsFadingOut(false);
//       notification.success({
//         message: "Success",
//         description: `Logged out successfully.`,
//       });
//     }, 500);
//   };

//   return (
//     <Router>
//       <div
//         className={`fade-container ${isFadingOut ? "fade-out" : ""}`}
//         style={{ display: "flex" }}
//       >
//         {isLoggedIn && (
//           <SideNavBar onLogout={handleLogout} username={username} />
//         )}

//         <div
//           style={{
//             marginLeft: isLoggedIn ? 260 : 0,
//             flex: 1,
//             overflowX: "hidden",
//           }}
//         >
//           <AnimatedRoutes
//             isLoggedIn={isLoggedIn}
//             handleLoginSuccess={handleLoginSuccess}
//             username={username}
//           />
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import { useState, useEffect } from "react";
// import SideNavBar from "./Pages/SideNavBar";
// import Inventory from "./Pages/Inventory";
// import ProductCategories from "./Pages/ProdcutCategories";
// import Login from "./Pages/Login";
// import { notification } from "antd";
// import AddUser from "./Pages/AddUser";
// import CustomerDetails from "./Pages/CustomerDetails";

// notification.config({
//   maxCount: 2,
//   placement: "bottomRight",
//   duration: 3,
// });

// function AnimatedRoutes({ isLoggedIn, handleLoginSuccess, username }) {
//   const location = useLocation();
//   const [currentPathname, setCurrentPathname] = useState(location.pathname);
//   const [animationClass, setAnimationClass] = useState("page-enter");
//   const [displayLocation, setDisplayLocation] = useState(location);

//   useEffect(() => {
//     if (location.pathname !== currentPathname) {
//       // path changed — run animation
//       setAnimationClass("page-exit");
//       const timeout = setTimeout(() => {
//         setDisplayLocation(location); // update the actual route
//         setCurrentPathname(location.pathname); // update path tracker
//         setAnimationClass("page-enter");
//       }, 400); // match your CSS animation time
//       return () => clearTimeout(timeout);
//     } else {
//       // same path — no animation
//       setDisplayLocation(location); // still update location
//     }
//   }, [location.pathname, currentPathname, location]);

//   return (
//     <div className={`page-container ${animationClass}`}>
//       <Routes location={displayLocation}>
//         <Route
//           path="/"
//           element={
//             isLoggedIn ? (
//               <Navigate to="/inventory" />
//             ) : (
//               <Login onLoginSuccess={handleLoginSuccess} />
//             )
//           }
//         />
//         <Route
//           path="/inventory"
//           element={isLoggedIn ? <Inventory /> : <Navigate to="/" />}
//         />
//         <Route
//           path="/productCategories"
//           element={
//             isLoggedIn ? (
//               <ProductCategories username={username} />
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />
//         <Route
//           path="/customerDetails"
//           element={
//             isLoggedIn ? (
//               <CustomerDetails username={username} />
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />
//         <Route
//           path="/addUser"
//           element={isLoggedIn ? <AddUser /> : <Navigate to="/" />}
//         />
//         <Route
//           path="*"
//           element={<Navigate to={isLoggedIn ? "/inventory" : "/"} />}
//         />
//       </Routes>
//     </div>
//   );
// }

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const [username, setUsername] = useState("");

//   const handleLoginSuccess = (usernameFromLogin) => {
//     setIsLoggedIn(true);
//     setUsername(usernameFromLogin);
//   };

//   const handleLogout = () => {
//     setIsFadingOut(true);
//     setTimeout(() => {
//       setIsLoggedIn(false);
//       setIsFadingOut(false);
//       notification.success({
//         message: "Success",
//         description: `Logged out successfully.`,
//       });
//     }, 500);
//   };

//   return (
//     <Router>
//       <div
//         className={`fade-container ${isFadingOut ? "fade-out" : ""}`}
//         style={{ display: "flex" }}
//       >
//         {isLoggedIn && (
//           <SideNavBar onLogout={handleLogout} username={username} />
//         )}

//         <div
//           style={{
//             marginLeft: isLoggedIn ? 260 : 0,
//             flex: 1,
//             overflowX: "hidden",
//           }}
//         >
//           <AnimatedRoutes
//             isLoggedIn={isLoggedIn}
//             handleLoginSuccess={handleLoginSuccess}
//             username={username}
//           />
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import { useState, useEffect } from "react";
// import SideNavBar from "./Pages/SideNavBar";
// import Inventory from "./Pages/Inventory";
// import ProductCategories from "./Pages/ProdcutCategories";
// import Login from "./Pages/Login";
// import AddUser from "./Pages/AddUser";
// import CustomerDetails from "./Pages/CustomerDetails";
// import DeliveryNote from "./Pages/DeliveryNote";
// import { notification } from "antd";

// notification.config({
//   maxCount: 2,
//   placement: "bottomRight",
//   duration: 3,
//   pauseOnHover: false,
//   showProgress: true,
  
// });

// function AppRoutes({ isLoggedIn, handleLoginSuccess, username }) {
//   const location = useLocation();
//   const [displayLocation, setDisplayLocation] = useState(location);
//   const [currentPathname, setCurrentPathname] = useState(location.pathname);
// // const [animationClass, setAnimationClass] = useState(() =>
// //   location.pathname === "/" ? "page-enter login-animation" : "page-enter"
// // );
// const [animationClass, setAnimationClass] = useState("page-enter");

//   useEffect(() => {
//       let timeout;

//     const nextPath = location.pathname;
//     const prevPath = currentPathname;
//     // const shouldSkipAnimation = nextPath === "/" || prevPath === "/";
//     // const shouldSkipAnimation = false;
//     const shouldSkipAnimation = location.pathname === "/";


//     if (nextPath !== prevPath) {
//       if (shouldSkipAnimation) {
//         setDisplayLocation(location);
//         setCurrentPathname(nextPath);
//         setAnimationClass("");
//       } else {
//         setAnimationClass("page-exit");
//         const timeout = setTimeout(() => {
//           setDisplayLocation(location);
//           setCurrentPathname(nextPath);
//         //    if (nextPath === "/") {
//         //   setAnimationClass("page-enter login-animation");
//         // } else {
//         //   setAnimationClass("page-enter");
//         // }
//          setAnimationClass("page-enter");
//         }, 300);
//         return () => clearTimeout(timeout);
//       }
//     } else {
//       setDisplayLocation(location);
//     }
//     return () => clearTimeout(timeout);
//   }, [location, currentPathname]);

//   return (
// <div className={`page-container ${location.pathname === "/" ? "" : animationClass}`}>
//       <Routes location={displayLocation}>
//         <Route
//           path="/"
//           element={
//             isLoggedIn ? (
//               <Navigate to="/inventory" />
//             ) : (
//               <Login onLoginSuccess={handleLoginSuccess} />
//             )
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={isLoggedIn ? <Inventory /> : <Navigate to="/" />}
//         />
//         <Route
//           path="/inventory"
//           element={isLoggedIn ? <Inventory  username={username} /> : <Navigate to="/" />}
//         />
//         <Route
//           path="/productCategories"
//           element={
//             isLoggedIn ? (
//               <ProductCategories username={username} />
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />
//         <Route
//           path="/customerDetails"
//           element={
//             isLoggedIn ? (
//               <CustomerDetails username={username} />
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />
//            <Route
//           path="/deliveryNote"
//           element={
//             isLoggedIn ? (
//               <DeliveryNote username={username} />
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />
//         <Route
//           path="/addUser"
//           element={isLoggedIn ? <AddUser username={username} /> : <Navigate to="/" />}
//         />
//         <Route
//           path="*"
//           element={<Navigate to={isLoggedIn ? "/inventory" : "/"} />}
//         />
//       </Routes>
//     </div>
//   );
// }

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const [username, setUsername] = useState("");

//   const handleLoginSuccess = (usernameFromLogin) => {
//     setIsLoggedIn(true);
//     setUsername(usernameFromLogin);
//   };

//   const handleLogout = () => {
//     setIsFadingOut(true);
//     setTimeout(() => {
//       setIsLoggedIn(false);
//       setIsFadingOut(false);
//       notification.success({
//         message: "Success",
//         description: `Logged out successfully.`,
//       });
//     }, 500);
//   };

//   return (
//     <Router>
//       <div
//         className={`fade-container ${isFadingOut ? "fade-out" : ""}`}
//         style={{ display: "flex" }}
//       >
//         {isLoggedIn && (
//           <SideNavBar onLogout={handleLogout} username={username} />
//         )}

//         <div
//           style={{
//             marginLeft: isLoggedIn ? 260 : 0,
//             flex: 1,
//             overflowX: "hidden",
//           }}
//         >
//           <AppRoutes
//             isLoggedIn={isLoggedIn}
//             handleLoginSuccess={handleLoginSuccess}
//             username={username}
//           />
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import { useState, useEffect } from "react";
// import SideNavBar from "./Pages/SideNavBar";
// import Inventory from "./Pages/Inventory";
// import ProductCategories from "./Pages/ProdcutCategories";
// import Login from "./Pages/Login";
// import AddUser from "./Pages/AddUser";
// import CustomerDetails from "./Pages/CustomerDetails";
// import DeliveryNote from "./Pages/DeliveryNote";
// import { notification } from "antd";

// notification.config({
//   maxCount: 2,
//   placement: "bottomRight",
//   duration: 3,
//   pauseOnHover: false,
//   showProgress: true,
// });

// function AppRoutes({ isLoggedIn, handleLoginSuccess, user }) {
//   const location = useLocation();
//   const [displayLocation, setDisplayLocation] = useState(location);
//   const [currentPathname, setCurrentPathname] = useState(location.pathname);
//   const [animationClass, setAnimationClass] = useState("page-enter");

//   useEffect(() => {
//     let timeout;
//     const nextPath = location.pathname;
//     const prevPath = currentPathname;
//     const shouldSkipAnimation = location.pathname === "/";

//     if (nextPath !== prevPath) {
//       if (shouldSkipAnimation) {
//         setDisplayLocation(location);
//         setCurrentPathname(nextPath);
//         setAnimationClass("");
//       } else {
//         setAnimationClass("page-exit");
//         const timeout = setTimeout(() => {
//           setDisplayLocation(location);
//           setCurrentPathname(nextPath);
//           setAnimationClass("page-enter");
//         }, 300);
//         return () => clearTimeout(timeout);
//       }
//     } else {
//       setDisplayLocation(location);
//     }
//     return () => clearTimeout(timeout);
//   }, [location, currentPathname]);

//   // Helper: check access for a given module
//   const hasAccess = (moduleName, requiredLevels = []) => {
//     if (!user?.access) return false;
//     const level = user.access[moduleName] || "No Access";
//     if (requiredLevels.length === 0) return level !== "No Access";
//     return requiredLevels.includes(level);
//   };

//   return (
//     <div
//       className={`page-container ${
//         location.pathname === "/" ? "" : animationClass
//       }`}
//     >
//      <Routes location={displayLocation}>
//   <Route
//     path="/"
//     element={
//       isLoggedIn ? (
//         <Navigate to="/inventory" />
//       ) : (
//         <Login onLoginSuccess={handleLoginSuccess} />
//       )
//     }
//   />

//   <Route
//     path="/inventory"
//     element={
//       isLoggedIn && hasAccess("Inventory") ? (
//         <Inventory user={user} />
//       ) : (
//         <Navigate to="/" />
//       )
//     }
//   />

//   <Route
//     path="/productCategories"
//     element={
//       isLoggedIn && hasAccess("Product Categories") ? (
//         <ProductCategories user={user} />
//       ) : (
//         <Navigate to="/" />
//       )
//     }
//   />

//   <Route
//     path="/customerDetails"
//     element={
//       isLoggedIn && hasAccess("Customer Details") ? (
//         <CustomerDetails user={user} />
//       ) : (
//         <Navigate to="/" />
//       )
//     }
//   />

//   <Route
//     path="/deliveryNote"
//     element={
//       isLoggedIn && hasAccess("Delivery Note") ? (
//         <DeliveryNote user={user} />
//       ) : (
//         <Navigate to="/" />
//       )
//     }
//   />

//   <Route
//     path="/addUser"
//     element={
//       isLoggedIn && hasAccess("Add User") ? (
//         <AddUser user={user} />
//       ) : (
//         <Navigate to="/" />
//       )
//     }
//   />

//   <Route path="*" element={<h2 style={{ padding: 20 }}>Page Not Found</h2>} />
// </Routes>

//     </div>
//   );
// }
// function Dashboard() {
//   return <h2 style={{ padding: 20 }}>Dashboard Page (Work in progress)</h2>;
// }
// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const [user, setUser] = useState(null); // { email, access }

//   const handleLoginSuccess = (userData) => {
//     setIsLoggedIn(true);
//     setUser(userData); // store { email, access }
//   };

//   const handleLogout = () => {
//     setIsFadingOut(true);
//     setTimeout(() => {
//       setIsLoggedIn(false);
//       setIsFadingOut(false);
//       setUser(null);
//       notification.success({
//         message: "Success",
//         description: `Logged out successfully.`,
//       });
//     }, 500);
//   };

//   return (
//     <Router>
//       <div
//         className={`fade-container ${isFadingOut ? "fade-out" : ""}`}
//         style={{ display: "flex" }}
//       >
//         {isLoggedIn && (
//           <SideNavBar onLogout={handleLogout} user={user} />
//         )}

//         <div
//           style={{
//             marginLeft: isLoggedIn ? 260 : 0,
//             flex: 1,
//             overflowX: "hidden",
//           }}
//         >
//           <AppRoutes
//             isLoggedIn={isLoggedIn}
//             handleLoginSuccess={handleLoginSuccess}
//             user={user}
//           />
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import React from "react"; 
// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import { useState, useEffect } from "react";
// import SideNavBar from "./Pages/SideNavBar";
// import Inventory from "./Pages/Inventory";
// import ProductCategories from "./Pages/ProdcutCategories";
// import Login from "./Pages/Login";
// import AddUser from "./Pages/AddUser";
// import CustomerDetails from "./Pages/CustomerDetails";
// import DeliveryNote from "./Pages/DeliveryNote";
// import { notification } from "antd";

// notification.config({
//   maxCount: 2,
//   placement: "bottomRight",
//   duration: 3,
//   pauseOnHover: false,
//   showProgress: true,
// });

// // ✅ Centralized menu config (same as SideNavBar.jsx)
// const menuItems = [
//   { key: "/dashboard", label: "Dashboard", access: "Dashboard", component: <h2 style={{ padding: 20, textAlign:"center" }}>Dashboard Page (Yet to work)</h2> },
//   { key: "/inventory", label: "Inventory", access: "Inventory", component: <Inventory /> },
//   { key: "/productCategories", label: "Product Categories", access: "Product Categories", component: <ProductCategories /> },
//   { key: "/customerDetails", label: "Customer Details", access: "Customer Details", component: <CustomerDetails /> },
//   { key: "/deliveryNote", label: "Delivery Note", access: "Delivery Note", component: <DeliveryNote /> },
//   { key: "/addUser", label: "Add New User", access: "Add User", component: <AddUser /> },
//   { key: "/reports", label: "Reports", access: "Reports", component: <h2 style={{ padding: 20, textAlign:"center" }}>Reports Page (Yet to work)</h2> },
// ];

// function AppRoutes({ isLoggedIn, handleLoginSuccess, user }) {
//   const location = useLocation();
//   const [displayLocation, setDisplayLocation] = useState(location);
//   const [currentPathname, setCurrentPathname] = useState(location.pathname);
//   const [animationClass, setAnimationClass] = useState("page-enter");

//   useEffect(() => {
//     let timeout;
//     const nextPath = location.pathname;
//     const prevPath = currentPathname;
//     const shouldSkipAnimation = location.pathname === "/";

//     if (nextPath !== prevPath) {
//       if (shouldSkipAnimation) {
//         setDisplayLocation(location);
//         setCurrentPathname(nextPath);
//         setAnimationClass("");
//       } else {
//         setAnimationClass("page-exit");
//         const timeout = setTimeout(() => {
//           setDisplayLocation(location);
//           setCurrentPathname(nextPath);
//           setAnimationClass("page-enter");
//         }, 300);
//         return () => clearTimeout(timeout);
//       }
//     } else {
//       setDisplayLocation(location);
//     }
//     return () => clearTimeout(timeout);
//   }, [location, currentPathname]);

//   // ✅ Helper: check access
//   const hasAccess = (moduleName) => {
//     if (!user?.access) return false;
//     return user.access[moduleName] !== "No Access";
//   };

//   return (
//     <div
//       className={`page-container ${
//         location.pathname === "/" ? "" : animationClass
//       }`}
//     >
//       <Routes location={displayLocation}>
//         <Route
//           path="/"
//           element={
//             isLoggedIn ? (
//               <Navigate to="/inventory" />
//             ) : (
//               <Login onLoginSuccess={handleLoginSuccess} />
//             )
//           }
//         />

//         {/* ✅ Dynamic route generation */}
//         {menuItems.map((item) => (
//           <Route
//             key={item.key}
//             path={item.key}
//             element={
//               isLoggedIn && hasAccess(item.access)
//                 ? React.cloneElement(item.component, { user })
//                 : <Navigate to="/" />
//             }
//           />
//         ))}

//         {/* Fallback */}
//         <Route
//           path="*"
//           element={<h2 style={{ padding: 20 }}>Page Not Found</h2>}
//         />
//       </Routes>
//     </div>
//   );
// }

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const [user, setUser] = useState(null); // { email, access }

//   const handleLoginSuccess = (userData) => {
//     setIsLoggedIn(true);
//     setUser(userData); // store { email, access }
//   };

//   const handleLogout = () => {
//     setIsFadingOut(true);
//     setTimeout(() => {
//       setIsLoggedIn(false);
//       setIsFadingOut(false);
//       setUser(null);
//       notification.success({
//         message: "Success",
//         description: `Logged out successfully.`,
//       });
//     }, 500);
//   };

//   return (
//     <Router>
//       <div
//         className={`fade-container ${isFadingOut ? "fade-out" : ""}`}
//         style={{ display: "flex" }}
//       >
//         {isLoggedIn && (
//           <SideNavBar onLogout={handleLogout} user={user} />
//         )}

//         <div
//           style={{
//             marginLeft: isLoggedIn ? 260 : 0,
//             flex: 1,
//             overflowX: "hidden",
//           }}
//         >
//           <AppRoutes
//             isLoggedIn={isLoggedIn}
//             handleLoginSuccess={handleLoginSuccess}
//             user={user}
//           />
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;


// App.js - RECOMMENDED replacement
// import React from "react";
// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import { useState, useEffect } from "react";
// import SideNavBar from "./Pages/SideNavBar";
// import Inventory from "./Pages/Inventory";
// import ProductCategories from "./Pages/ProdcutCategories";
// import Login from "./Pages/Login";
// import AddUser from "./Pages/AddUser";
// import CustomerDetails from "./Pages/CustomerDetails";
// import DeliveryNote from "./Pages/DeliveryNote";
// import { notification } from "antd";

// notification.config({
//   maxCount: 2,
//   placement: "bottomRight",
//   duration: 3,
//   pauseOnHover: false,
//   showProgress: true,
// });

// // MENU: store component types (NOT elements)
// const menuItems = [
//   { key: "/dashboard", label: "Dashboard", access: "Dashboard", component: () => <h2 style={{ padding: 20, textAlign: "center" }}>Dashboard Page (Yet to work)</h2> },
//   { key: "/inventory", label: "Inventory", access: "Inventory", component: Inventory },
//   { key: "/productCategories", label: "Product Categories", access: "Product Categories", component: ProductCategories },
//   { key: "/customerDetails", label: "Customer Details", access: "Customer Details", component: CustomerDetails },
//   { key: "/deliveryNote", label: "Delivery Note", access: "Delivery Note", component: DeliveryNote },
//   { key: "/addUser", label: "Add New User", access: "Add User", component: AddUser },
//   { key: "/reports", label: "Reports", access: "Reports", component: () => <h2 style={{ padding: 20, textAlign: "center" }}>Reports Page (Yet to work)</h2> },
// ];

// function AppRoutes({ isLoggedIn, handleLoginSuccess, user }) {
//   const location = useLocation();
//   const [displayLocation, setDisplayLocation] = useState(location);
//   const [currentPathname, setCurrentPathname] = useState(location.pathname);
//   const [animationClass, setAnimationClass] = useState("page-enter");

//   useEffect(() => {
//     let timerId = null;
//     const nextPath = location.pathname;
//     const prevPath = currentPathname;
//     const shouldSkipAnimation = location.pathname === "/";

//     if (nextPath !== prevPath) {
//       if (shouldSkipAnimation) {
//         setDisplayLocation(location);
//         setCurrentPathname(nextPath);
//         setAnimationClass("");
//       } else {
//         setAnimationClass("page-exit");
//         timerId = setTimeout(() => {
//           setDisplayLocation(location);
//           setCurrentPathname(nextPath);
//           setAnimationClass("page-enter");
//         }, 300);
//       }
//     } else {
//       setDisplayLocation(location);
//     }

//     return () => {
//       if (timerId) clearTimeout(timerId);
//     };
//   }, [location, currentPathname]);

//   // Helper: check access map safely
//   const hasAccess = (moduleName) => {
//     if (!user?.access) return false;
//     return user.access[moduleName] !== "No Access";
//   };

//   return (
//     <div className={`page-container ${location.pathname === "/" ? "" : animationClass}`}>
//       <Routes location={displayLocation}>
//         <Route
//           path="/"
//           element={isLoggedIn ? <Navigate to="/inventory" /> : <Login onLoginSuccess={handleLoginSuccess} />}
//         />

//         {menuItems.map((item) => {
//           const Component = item.component;
//           return (
//             <Route
//               key={item.key}
//               path={item.key}
//               element={
//                 isLoggedIn && hasAccess(item.access) ? (
//                   // instantiate the component now with props (safer)
//                   <Component user={user} />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//           );
//         })}

//         <Route path="*" element={<h2 style={{ padding: 20 }}>Page Not Found</h2>} />
//       </Routes>
//     </div>
//   );
// }

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const [user, setUser] = useState(null); // { email, access }

//   const handleLoginSuccess = (userData) => {
//     // IMPORTANT: expect userData = { email, access: { "Inventory": "Edit", ... } }
//     setIsLoggedIn(true);
//     setUser(userData);
//   };

//   const handleLogout = () => {
//     setIsFadingOut(true);
//     setTimeout(() => {
//       setIsLoggedIn(false);
//       setIsFadingOut(false);
//       setUser(null);
//       notification.success({
//         message: "Success",
//         description: `Logged out successfully.`,
//       });
//     }, 500);
//   };

//   return (
//     <Router>
//       <div className={`fade-container ${isFadingOut ? "fade-out" : ""}`} style={{ display: "flex" }}>
//         {isLoggedIn && <SideNavBar onLogout={handleLogout} user={user} />}

//         <div style={{ marginLeft: isLoggedIn ? 260 : 0, flex: 1, overflowX: "hidden" }}>
//           <AppRoutes isLoggedIn={isLoggedIn} handleLoginSuccess={handleLoginSuccess} user={user} />
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;


// App.js
import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import SideNavBar from "./Pages/SideNavBar";
import Inventory from "./Pages/Inventory";
import ProductCategories from "./Pages/ProdcutCategories";
import Login from "./Pages/Login";
import AddUser from "./Pages/AddUser";
import CustomerDetails from "./Pages/CustomerDetails";
import DeliveryNote from "./Pages/DeliveryNote";
import { notification } from "antd";

// 🔔 Configure notifications
notification.config({
  maxCount: 2,
  placement: "bottomRight",
  duration: 3,
  pauseOnHover: false,
  showProgress: true,
});

// ✅ Proper small components (instead of inline functions)
function Dashboard() {
  return (
    <h2 style={{ padding: 20, textAlign: "center" }}>
      Dashboard Page (Yet to work)
    </h2>
  );
}
function Reports() {
  return (
    <h2 style={{ padding: 20, textAlign: "center" }}>
      Reports Page (Yet to work)
    </h2>
  );
}

// ✅ Centralized menu config
const menuItems = [
  { key: "/dashboard", label: "Dashboard", access: "Dashboard", component: Dashboard },
  { key: "/inventory", label: "Inventory", access: "Inventory", component: Inventory },
  { key: "/productCategories", label: "Product Categories", access: "Product Categories", component: ProductCategories },
  { key: "/customerDetails", label: "Customer Details", access: "Customer Details", component: CustomerDetails },
  { key: "/deliveryNote", label: "Delivery Note", access: "Delivery Note", component: DeliveryNote },
  { key: "/addUser", label: "Add New User", access: "Add User", component: AddUser },
  { key: "/reports", label: "Reports", access: "Reports", component: Reports },
];

function AppRoutes({ isLoggedIn, handleLoginSuccess, user }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [currentPathname, setCurrentPathname] = useState(location.pathname);
  const [animationClass, setAnimationClass] = useState("page-enter");

  useEffect(() => {
    let timerId = null;
    const nextPath = location.pathname;
    const prevPath = currentPathname;
    const shouldSkipAnimation = location.pathname === "/";

    if (nextPath !== prevPath) {
      if (shouldSkipAnimation) {
        setDisplayLocation(location);
        setCurrentPathname(nextPath);
        setAnimationClass("");
      } else {
        setAnimationClass("page-exit");
        timerId = setTimeout(() => {
          setDisplayLocation(location);
          setCurrentPathname(nextPath);
          setAnimationClass("page-enter");
        }, 300);
      }
    } else {
      setDisplayLocation(location);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [location, currentPathname]);

  // ✅ Access check
  const hasAccess = (moduleName) => {
    if (!user?.access) return false;
    return user.access[moduleName] !== "No Access";
  };

  return (
    <div className={`page-container ${location.pathname === "/" ? "" : animationClass}`}>
      <Routes location={displayLocation}>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/inventory" />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {menuItems.map((item) => {
          const Component = item.component;
          return (
            <Route
              key={item.key}
              path={item.key}
              element={
                isLoggedIn && hasAccess(item.access) ? (
                  <Component user={user} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          );
        })}

        <Route path="*" element={<h2 style={{ padding: 20 }}>Page Not Found</h2>} />
      </Routes>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [user, setUser] = useState(null); // { email, access }

  const handleLoginSuccess = (userData) => {
    // userData must be: { email, access: { "Inventory": "Edit", ... } }
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsFadingOut(false);
      setUser(null);
      notification.success({
        message: "Success",
        description: `Logged out successfully.`,
      });
    }, 500);
  };

  return (
    <Router>
      <div className={`fade-container ${isFadingOut ? "fade-out" : ""}`} style={{ display: "flex" }}>
        {isLoggedIn && <SideNavBar onLogout={handleLogout} user={user} />}

        <div style={{ marginLeft: isLoggedIn ? 280 : 0, flex: 1, overflowX: "hidden" }}>
          <AppRoutes isLoggedIn={isLoggedIn} handleLoginSuccess={handleLoginSuccess} user={user} />
        </div>
      </div>
    </Router>
  );
}

export default App;

