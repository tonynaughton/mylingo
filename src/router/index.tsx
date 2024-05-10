import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../components/login";
import Register from "../components/register";
import { Home } from "../components/home";
import { ProtectedRoute } from "./protected_route";
import { auth } from "../firebase";
import { useEffect, useState } from "react";

export function Router(): JSX.Element {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute user={currentUser}>
          <Home />
        </ProtectedRoute>
      )
    },
    {
      path: "*",
      element: (
        <ProtectedRoute user={currentUser}>
          <Home />
        </ProtectedRoute>
      )
    },
    {
      path: "/",
      element: (
        <ProtectedRoute user={currentUser}>
          <Home />
        </ProtectedRoute>
      )
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
