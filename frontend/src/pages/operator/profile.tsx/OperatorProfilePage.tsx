import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import OperatorProfile from "./OperatorProfile";
import Loading from "@/components/Loading";

const OperatorProfilePage = () => {
  const { currentOperator, loading } = useSelector(
    (state: RootState) => state.operator,
  );
  if (loading) return <Loading />;
  return (
    <div>
      <OperatorProfile key={currentOperator?._id} />
    </div>
  );
};

export default OperatorProfilePage;
