import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { CreateRequest } from "./components/CreateRequest";
import { RequestHistory } from "./components/RequestHistory";
import { ApprovalScreen } from "./components/ApprovalScreen";
import { UserManagement } from "./components/UserManagement";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    index: true,
    Component: Login,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "create-request", Component: CreateRequest },
      { path: "request-history", Component: RequestHistory },
      { path: "approvals", Component: ApprovalScreen },
      { path: "users", Component: UserManagement },
    ],
  },
]);
