import { createBrowserRouter } from "react-router";
import App from "@/App";
import Deployment from "@/k3s/Deployment";
import Node from "@/k3s/Node";
let routerStatic = [
    {
        path: "/",
        title: "首页",
        Component: App,
        disabled: true,
    },
    {
        path: "/k3s/deployment",
        title: "Deployment",
        Component: Deployment,
    },
    {
        path: "/k3s/node",
        title: "Node",
        Component: Node,
    }
]
let router = createBrowserRouter(routerStatic);

export default router;

export {
    routerStatic
}