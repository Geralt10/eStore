import { createBrowserRouter, Outlet } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";

const Layout = () => {
    return (
        <div className="min-h-screen relative">
            {/* Home Page Content */}
            <h1>hello</h1>

            {/* Modal Overlay for /login and /register */}
            <Outlet />
        </div>
    );
};

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "register",
                element: <Register />
            },
            {
                path: "login",
                element: <Login />
            }
        ]
    },
    {
        path: "/seller",
        children: [
            {
                path: "create",
                element: <CreateProduct />
            },
            {
                path: "dashboard",
                element: <Dashboard />
            }
        ]

    }
]);
