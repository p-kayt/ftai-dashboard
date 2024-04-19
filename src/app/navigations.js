import { authRoles } from "./auth/authRoles";

export const navigations = [
  {
    label: "Admin",
    type: "label",
    role: authRoles.admin
  },
  {
    name: "Dashboard",
    path: "/dashboard/default",
    icon: "dashboard",
    role: authRoles.manager
  },
  {
    name: "Charts",
    icon: "chart",
    path: "/charts/echarts",
    role: authRoles.manager
  },
  {
    label: "Store",
    type: "label",
    role: authRoles.manager
  },
  {
    name: "Products",
    icon: "inventory",
    path: "/shop/products",
    role: authRoles.manager
  },

  {
    name: "Models",
    icon: "faceretouchingnatural",
    path: "/shop/models",
    role: authRoles.manager
  },

  {
    name: "Others",
    icon: "inventory",
    path: "/shop/others",
    role: authRoles.manager
  },
  {
    label: "Users",
    type: "label",
    role: authRoles.staff
  },
  {
    name: "Users",
    icon: "people",
    path: "/users/user",
    role: authRoles.admin
  },
  {
    name: "Chat",
    icon: "chat",
    path: "/users/chat",
    role: authRoles.staff
  },
  {
    label: "Control Order",
    type: "label",
    role: authRoles.staffmxmanager
  },
  {
    name: "Orders",
    icon: "listalt",
    path: "/shop/orders",
    role: authRoles.staffmxmanager
  }
];
