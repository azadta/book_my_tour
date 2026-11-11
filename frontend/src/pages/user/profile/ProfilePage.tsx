import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Profile from "./Profile";
import Loading from "@/components/Loading";

const ProfilePage = () => {
  const { currentUser, loading } = useSelector(
    (state: RootState) => state.user,
  );
  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <Profile key={currentUser?._id} />
    </div>
  );
};

export default ProfilePage;
