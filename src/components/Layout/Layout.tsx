import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FaHome, FaChild, FaBoxes, FaFileAlt, FaListUl } from "react-icons/fa";
import { useState } from "react";
import { Layout as AntLayout, Menu } from "antd";
import "./Layout.scss";
const { Sider, Content, Footer } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();

  //------------------METHODS----------------

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: "/",
      icon: <FaHome />,
      label: (
        <NavLink to="/" end>
          Pregled rezervacija
        </NavLink>
      ),
    },
    {
      key: "/baby",
      icon: <FaChild />,
      label: <NavLink to="/baby">Bebe</NavLink>,
    },
    {
      key: "/service-package",
      icon: <FaBoxes />,
      label: <NavLink to="/service-package">Paketi usluga</NavLink>,
    },
    {
      key: "/arrangement",
      icon: <FaListUl />,
      label: <NavLink to="/arrangement">Aranžmani</NavLink>,
    },
    {
      key: "/report",
      icon: <FaFileAlt />,
      label: <NavLink to="/report">Izvještaji</NavLink>,
    },
  ];

  //------------------RENDER------------------

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        width={220}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <img
            src="/logo.jpg"
            alt="Logo"
            style={{ width: collapsed ? "40px" : "100px" }}
          />
          {!collapsed && <h1 style={{ color: "white" }}>Baby spa Sunshine</h1>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <AntLayout>
        <Content className="content">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
