import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";

import materialRoutes from "app/views/material-kit/MaterialRoutes";
import Products from "./views/shop/Products";
import Models from "./views/shop/Models";
import User from "./views/users/User";
import Others from "./views/shop/Others";
import Orders from "./views/orders/Orders";
import OrderDetail from "./views/orders/OrderDetail";
import ChatCustomer from "./views/users/ChatCustomer";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));
// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // dashboard route
      { path: "/dashboard/default", element: <Analytics />, auth: authRoles.admin },
      { path: "/shop/products", element: <Products />, auth: authRoles.admin },
      { path: "/shop/models", element: <Models />, auth: authRoles.admin },
      { path: "/users/user", element: <User />, auth: authRoles.admin },
      { path: "/users/chat", element: <ChatCustomer />, auth: authRoles.admin },
      { path: "/shop/orders", element: <Orders />, auth: authRoles.admin },
      { path: "/shop/orders/:orderId", element: <OrderDetail />, auth: authRoles.admin },
      { path: "/shop/others", element: <Others />, auth: authRoles.admin },

      // e-chart route
      { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor }
    ]
  },

  // session pages route
  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },

  { path: "/", element: <Navigate to="dashboard/default" /> },

  { path: "*", element: <NotFound /> }
];

export default routes;
