import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export interface ActiveUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "User" | "Operator" | "Admin";
}

export const useCurrentUser = (): ActiveUser | null => {
  const user = useSelector((state: RootState) => state.user?.currentUser);
  const operator = useSelector(
    (state: RootState) => state.operator?.currentOperator,
  );
  const admin = useSelector((state: RootState) => state.admin?.currentAdmin);

  if (user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: "User",
    };
  }
  if (operator) {
    return {
      id: operator._id,
      name: operator.name,
      email: operator.email,
      image: operator.image,
      role: "Operator",
    };
  }

  if (admin) {
    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
      role: "Admin",
    };
  }
  return null;
};
