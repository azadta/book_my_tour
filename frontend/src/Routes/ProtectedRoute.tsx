import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  isAuthenticated,
  redirectedPath,
}: {
  isAuthenticated: boolean;
  redirectedPath: string;
}) => {
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectedPath} replace />
  );
};

export default ProtectedRoute;
