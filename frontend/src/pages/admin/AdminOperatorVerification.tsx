import { useEffect } from "react";
import { useOperatorVerification } from "../../hooks/useOperatorVerification";
import BackToDashboard from "../../components/BackToDashboard";
import ReUsableTable from "../../components/ReUsableTable";

const AdminOperatorVerification = () => {
  const {
    actionLoading,
    getVerificationRequests,
    loading,
    operators,
    verifyOperator,
  } = useOperatorVerification();

  const columns = [
    { label: "Name", render: (op: any) => op.name },
    { label: "Email", render: (op: any) => op.email },
    { label: "Mobile", render: (op: any) => op.mobile },
    {
      label: "Company",
      render: (op: any) => op.verificationDetails?.companyName || "-",
    },
    {
      label: "License No",
      render: (op: any) => op.verificationDetails?.licenseNo || "-",
    },
  ];

  const actions = [
    {
      label:()=> "Verify",
      onClick: (op: any) => verifyOperator(op._id, true),
      className: `bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700`,
      disabled: (op: any) =>
        actionLoading.id === op._id && actionLoading.type === "verify",
      isLoading: (op: any) =>
        actionLoading.id === op._id && actionLoading.type === "verify",
      loadingText: "verifying...",
    },
    {
      label:()=> "Reject",
      onClick: (op: any) => verifyOperator(op._id, false),
      className: `bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700`,
      disabled: (op: any) =>
        actionLoading.id === op._id && actionLoading.type === "reject",
      isLoading: (op: any) =>
        actionLoading.id === op._id && actionLoading.type === "reject",
      loadingText: "rejecting...",
    },
  ];

  useEffect(() => {
    getVerificationRequests();
  }, [getVerificationRequests]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <BackToDashboard path="/admin/dashboard" />
      <h1 className="text-3xl font-bold  mb-4 text-center">
        Operator Verification Requests
      </h1>
      <ReUsableTable data={operators} columns={columns} loading={loading} actions={actions} />
    </div>
  );
};

export default AdminOperatorVerification;
