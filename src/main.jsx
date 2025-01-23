import React, { useEffect, useState } from "react";
import {
    RouterProvider,
} from "react-router";
import ReactDOM from "react-dom/client";
import router, {routerStatic} from "./router";
import "@arco-design/web-react/dist/css/arco.css";
import { Layout, Menu, Button, Divider, Link } from '@arco-design/web-react';
import App from "./App";
const Sider = Layout.Sider;
const MenuItem = Menu.Item;


const sliderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
}

function TopLayout() {
    const [activeKey, setActiveKey] = useState("")
    useEffect(() => {
        console.log("TopLayout", window.location.pathname)
        setActiveKey(window.location.pathname)
    }, [])
    var clickMenuItem = (item) => {
       window.location.href = item.path
       setActiveKey(item.path)
       console.log("clickMenuItem", item, activeKey)
    }
    if (window.location.pathname === "/") {
        return <App />
    }
    return <Layout>
        <Sider theme='light'  style={sliderStyle}>
            <Divider><Link href='/'> Exit </Link></Divider>
            <Menu theme='light' style={{ height: '100vh' }}  selectedKeys={[activeKey]}>
                {
                    routerStatic.map((item, index) => {
                        if (item.disabled) return null
                        return <MenuItem key={item.path} onClick={clickMenuItem.bind(this, item)}>{item.title}</MenuItem>
                    })
                }
            </Menu>
        </Sider>
        <Layout style={{ marginLeft: '200px', padding: '10px 20px' }}>
            <RouterProvider router={router} />
        </Layout>
    </Layout>
}

ReactDOM.createRoot(document.getElementById("root")).render(<TopLayout />)
