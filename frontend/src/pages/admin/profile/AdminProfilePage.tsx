import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import AdminProfile from "./AdminProfile";
import Loading from "@/components/Loading";

const AdminProfilePage = () => {
  const { currentAdmin, loading } = useSelector(
    (state: RootState) => state.admin,
  );
  if (loading) return <Loading />;
  return (
    <div>
      <AdminProfile key={currentAdmin?._id} />
    </div>
  );
};

export default AdminProfilePage;
