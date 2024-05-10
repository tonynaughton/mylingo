import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../components/login";
import Register from "../components/register";
import { Home } from "../components/home";

export function Router(): JSX.Element {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "*",
      element: <Home />
    },
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    }
  ]);

  return <RouterProvider router={router} />;
}
