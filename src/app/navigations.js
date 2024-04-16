import { authRoles } from "./auth/authRoles";

export const navigations = [
  {
    name: "Dashboard",
    path: "/dashboard/default",
    icon: "dashboard",
    role: authRoles.staff
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
    role: authRoles.manager
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
    role: authRoles.staff
  },
  {
    name: "Orders",
    icon: "listalt",
    path: "/shop/orders",
    role: authRoles.staff
  },
  {
    label: "Simulation",
    type: "label",
    role: authRoles.admin
  },
  {
    name: "Shipping",
    icon: "car",
    path: "/",
    role: authRoles.admin
  }
];
