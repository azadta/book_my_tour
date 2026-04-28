import { useState } from "react";
import ConfirmationModel from "../../components/ConfirmationModel";

const AdminUserDetails = () => {
   const [modalOpen, setModalOpen] = useState(true);
  const [modalMessage, setModalMessage] = useState("how are you");
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});
  return <div>
    <ConfirmationModel isOpen={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          modalAction();
          setModalOpen(false);
        }}/>
  </div>;
};

export default AdminUserDetails;
