import { NavLink, Outlet } from "react-router-dom";
import { FaHome, FaChild, FaBoxes, FaFileAlt, FaListUl } from "react-icons/fa";
import { useState } from "react";
import "./Layout.scss";

const Layout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className="layout">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h1 className="logo">
            {collapsed ? (
              <img src="/logo.jpg" alt="Logo" className="logo-icon" />
            ) : (
              <div className="header-content">
                <img src="/logo.jpg" alt="Logo" className="logo-icon" />
                <h1 className="logo">Sunshine</h1>
              </div>
            )}
          </h1>
          <button className="collapse-btn" onClick={toggleSidebar}>
            {collapsed ? "☰" : "✕"}
          </button>
        </div>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span className="menu-icon">
                <FaHome />
              </span>
              <span className="menu-text">Pregled rezervacija</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/baby"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span className="menu-icon">
                <FaChild />
              </span>
              <span className="menu-text">Bebe</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/service-package"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span className="menu-icon">
                <FaBoxes />
              </span>
              <span className="menu-text">Paketi usluga</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/arrangement"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span className="menu-icon">
                <FaListUl />
              </span>
              <span className="menu-text">Aranžmani</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/report"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span className="menu-icon">
                <FaFileAlt />
              </span>
              <span className="menu-text">Izvještaji</span>
            </NavLink>
          </li>
        </ul>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
