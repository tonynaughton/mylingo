import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Home, Login, Register } from "../pages";
import { ProtectedRoute } from "./protected_route";
import { auth } from "../firebase";

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
