import { useEffect } from "react";
import ReUsableTable from "../../components/ReUsableTable";
import { useOperatorVerification } from "../../hooks/useOperatorVerification";
import type { IOperator } from "@/interfaces/IOperator";


const AdminOperatorVerification = () => {
  const {
    actionLoading,
    getVerificationRequests,
    loading,
    operators,
    verifyOperator,
  } = useOperatorVerification();

  const columns = [
    { label: "Name", render: (op:IOperator) => op.name },
    { label: "Email", render: (op: IOperator) => op.email },
    { label: "Mobile", render: (op: IOperator) => op.mobile },
    {
      label: "Company",
      render: (op: IOperator) => op.verificationDetails?.companyName || "-",
    },
    {
      label: "License No",
      render: (op: IOperator) => op.verificationDetails?.licenseNo || "-",
    },
  ];

  const actions = [
    {
      label: () => "Verify",
      onClick: (op: IOperator) => verifyOperator(op._id, true),
      className: `bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700`,
      disabled: (op: IOperator) =>
        actionLoading.id === op._id && actionLoading.type === "verify",
      isLoading: (op:IOperator) =>
        actionLoading.id === op._id && actionLoading.type === "verify",
      loadingText: "verifying...",
    },
    {
      label: () => "Reject",
      onClick: (op: IOperator) => verifyOperator(op._id, false),
      className: `bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700`,
      disabled: (op: IOperator) =>
        actionLoading.id === op._id && actionLoading.type === "reject",
      isLoading: (op: IOperator) =>
        actionLoading.id === op._id && actionLoading.type === "reject",
      loadingText: "rejecting...",
    },
  ];

  useEffect(() => {
    getVerificationRequests();
  }, [getVerificationRequests]);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-[calc(100vh-5.125rem)]  ">
      <h1 className="text-3xl font-bold  mb-4 text-center">
        Operator Verification Requests
      </h1>
      {!operators || operators.length === 0 ? (
        <p className="text-center">No pending verification requests</p>
      ) : (
        <ReUsableTable
          data={operators}
          columns={columns}
          loading={loading}
          actions={actions}
        />
      )}
    </div>
  );
};

export default AdminOperatorVerification;
