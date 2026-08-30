import { createBrowserRouter, Outlet } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import SellerProductDetail from "../features/products/pages/SellerProductDetail";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
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
        path: "/product/:id",
        element: <ProductDetail />
    },
    {
        path: "/seller",
        children: [
            {
                path: "create",
                element: <Protected role="seller"><CreateProduct /></Protected>
            },
            {
                path: "dashboard",
                element: <Protected role="seller"><Dashboard /></Protected>
            },
            {
                path: "product/:id",
                element: <Protected role="seller"><SellerProductDetail /></Protected>
            }
        ]

    }
]);
