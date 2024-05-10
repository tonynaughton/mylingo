import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  user: any;
  children: JSX.Element;
}

export function ProtectedRoute({ user, children }: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
