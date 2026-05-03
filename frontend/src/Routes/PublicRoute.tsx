import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({
  isAuthenticated,
  redirectedPath,
}: {
  isAuthenticated: boolean;
  redirectedPath: string;
}) => {
  return isAuthenticated ? (
    <Navigate to={redirectedPath} replace />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
