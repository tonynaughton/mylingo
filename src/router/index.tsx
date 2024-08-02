import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { Translate, Login, Register, AddWord, AllWords, Wordpacks } from "../pages";
import { ProtectedRoute } from "./protected_route";
import { auth } from "../firebase";
import { AddWordpack } from "../pages/add_wordpack";

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
          <Translate />
        </ProtectedRoute>
      )
    },
    {
      path: "*",
      element: (
        <ProtectedRoute user={currentUser}>
          <Translate />
        </ProtectedRoute>
      )
    },
    {
      path: "/add-word",
      element: (
        <ProtectedRoute user={currentUser}>
          <AddWord />
        </ProtectedRoute>
      )
    },
    {
      path: "/wordpacks",
      element: (
        <ProtectedRoute user={currentUser}>
          <Wordpacks />
        </ProtectedRoute>
      )
    },
    {
      path: "/add-wordpack",
      element: (
        <ProtectedRoute user={currentUser}>
          <AddWordpack />
        </ProtectedRoute>
      )
    },
    {
      path: "/all-words",
      element: (
        <ProtectedRoute user={currentUser}>
          <AllWords />
        </ProtectedRoute>
      )
    },
    {
      path: "/login",
      element: currentUser ? <Navigate to="/translate" replace /> : <Login />
    },
    {
      path: "/register",
      element: currentUser ? <Navigate to="/translate" replace /> : <Register />
    }
  ]);

  return <RouterProvider router={router} />;
}
