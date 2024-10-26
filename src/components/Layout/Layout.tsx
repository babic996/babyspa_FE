import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FaHome, FaChild, FaBoxes, FaFileAlt, FaListUl } from "react-icons/fa";
import { useState } from "react";
import { Layout as AntLayout, Menu } from "antd";
import "./Layout.scss";
const { Sider, Content } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggleSidebar}>
        <div style={{ padding: "16px", textAlign: "center" }}>
          <img
            src="/logo.jpg"
            alt="Logo"
            style={{ width: collapsed ? "40px" : "100px" }}
          />
          {!collapsed && <h1 style={{ color: "white" }}>Baby spa Sunshine</h1>}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/" icon={<FaHome />}>
            <NavLink to="/" end>
              Pregled rezervacija
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/baby" icon={<FaChild />}>
            <NavLink to="/baby">Bebe</NavLink>
          </Menu.Item>
          <Menu.Item key="/service-package" icon={<FaBoxes />}>
            <NavLink to="/service-package">Paketi usluga</NavLink>
          </Menu.Item>
          <Menu.Item key="/arrangement" icon={<FaListUl />}>
            <NavLink to="/arrangement">Aranžmani</NavLink>
          </Menu.Item>
          <Menu.Item key="/report" icon={<FaFileAlt />}>
            <NavLink to="/report">Izvještaji</NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <AntLayout>
        <Content
          style={{
            margin: "0px",
            padding: "0px",
            backgroundImage: "url('/backgroundimage.jpg')", // zameni sa tačnom putanjom do slike
            backgroundSize: "cover", // prilagodi veličinu slike
            backgroundPosition: "center", // centriraj sliku
            borderRadius: "0px",
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
