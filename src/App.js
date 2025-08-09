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

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
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

notification.config({
  maxCount: 2,
  placement: "bottomRight",
  duration: 3,
  pauseOnHover: false,
  showProgress: true,
  
});

function AppRoutes({ isLoggedIn, handleLoginSuccess, username }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [currentPathname, setCurrentPathname] = useState(location.pathname);
// const [animationClass, setAnimationClass] = useState(() =>
//   location.pathname === "/" ? "page-enter login-animation" : "page-enter"
// );
const [animationClass, setAnimationClass] = useState("page-enter");

  useEffect(() => {
      let timeout;

    const nextPath = location.pathname;
    const prevPath = currentPathname;
    // const shouldSkipAnimation = nextPath === "/" || prevPath === "/";
    // const shouldSkipAnimation = false;
    const shouldSkipAnimation = location.pathname === "/";


    if (nextPath !== prevPath) {
      if (shouldSkipAnimation) {
        setDisplayLocation(location);
        setCurrentPathname(nextPath);
        setAnimationClass("");
      } else {
        setAnimationClass("page-exit");
        const timeout = setTimeout(() => {
          setDisplayLocation(location);
          setCurrentPathname(nextPath);
        //    if (nextPath === "/") {
        //   setAnimationClass("page-enter login-animation");
        // } else {
        //   setAnimationClass("page-enter");
        // }
         setAnimationClass("page-enter");
        }, 400);
        return () => clearTimeout(timeout);
      }
    } else {
      setDisplayLocation(location);
    }
    return () => clearTimeout(timeout);
  }, [location, currentPathname]);

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
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Inventory /> : <Navigate to="/" />}
        />
        <Route
          path="/inventory"
          element={isLoggedIn ? <Inventory /> : <Navigate to="/" />}
        />
        <Route
          path="/productCategories"
          element={
            isLoggedIn ? (
              <ProductCategories username={username} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/customerDetails"
          element={
            isLoggedIn ? (
              <CustomerDetails username={username} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
           <Route
          path="/deliveryNote"
          element={
            isLoggedIn ? (
              <DeliveryNote username={username} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/addUser"
          element={isLoggedIn ? <AddUser /> : <Navigate to="/" />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/inventory" : "/"} />}
        />
      </Routes>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [username, setUsername] = useState("");

  const handleLoginSuccess = (usernameFromLogin) => {
    setIsLoggedIn(true);
    setUsername(usernameFromLogin);
  };

  const handleLogout = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsFadingOut(false);
      notification.success({
        message: "Success",
        description: `Logged out successfully.`,
      });
    }, 500);
  };

  return (
    <Router>
      <div
        className={`fade-container ${isFadingOut ? "fade-out" : ""}`}
        style={{ display: "flex" }}
      >
        {isLoggedIn && (
          <SideNavBar onLogout={handleLogout} username={username} />
        )}

        <div
          style={{
            marginLeft: isLoggedIn ? 260 : 0,
            flex: 1,
            overflowX: "hidden",
          }}
        >
          <AppRoutes
            isLoggedIn={isLoggedIn}
            handleLoginSuccess={handleLoginSuccess}
            username={username}
          />
        </div>
      </div>
    </Router>
  );
}

export default App;
