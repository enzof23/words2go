import ReactDOM from "react-dom/client";
import App from "./App";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles/index.css";
import {
  CreateList,
  ListDisplay,
  MainOutlet,
  PracticeDisplay,
} from "./components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainOutlet />,
      },
      {
        path: "practice",
        element: <MainOutlet />,
      },
      {
        path: "create-list",
        element: <CreateList />,
      },
      {
        path: ":userid/:listid",
        element: <ListDisplay />,
      },
      {
        path: "/practice/:userid/:listid",
        element: <PracticeDisplay />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
