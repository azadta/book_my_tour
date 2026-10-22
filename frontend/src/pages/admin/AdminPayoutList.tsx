import ReUsableTable from "@/components/ReUsableTable";
import { useAdminPayout } from "@/hooks/useAdminPayout";
import type { IPopulatedPayout } from "@/interfaces/interfaces";

const AdminPayoutList = () => {
  const { payouts, loading, isSubmitting, handleProcessPayout } =
    useAdminPayout();
  const columns = [
    {
      label: "OperatorName",
      render: (p: IPopulatedPayout) => p.operatorId.name || "N/A",
    },
    {
      label: "Package",
      render: (p: IPopulatedPayout) => p.bookingId.packageId.name || "N/A",
    },
    {
      label: "Gross Amount",
      render: (p: IPopulatedPayout) =>
        p.grossAmount?.toLocaleString("en-IN", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) || "N/A",
    },
    {
      label: "Commission (5%)",
      render: (p: IPopulatedPayout) =>
        p.platformCommissionAmount?.toLocaleString("en-IN", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) || "N/A",
    },
    {
      label: "Net Payout",
      render: (p: IPopulatedPayout) =>
        `Rs ${p.netPayoutAmount?.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}` ||
        "N/A",
    },
    {
      label: "Status",
      render: (p: IPopulatedPayout) => (
        <span
          className={`px-2 py-1 text-xs rounded font-bold ${p.payoutStatus === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
        >
          {p.payoutStatus}
        </span>
      ),
    },
  ];
  const actions = [
    {
      label: () => "Pay",
      onClick: (payout: IPopulatedPayout) => handleProcessPayout(payout),
      className:
        "bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 disabled:opacity-50",
      loadingText: "Processing",
      disabled: (payout: IPopulatedPayout) =>
        isSubmitting || payout.payoutStatus === "PAID",
    },
  ];
  return (
    <div className="flex  flex-col min-h-[calc(100vh-5.125rem)]">
      <div className="flex-1 flex bg-gray-100 ">
        <div className="flex-1 p-5 min-w-0">
          <h1 className="text-md bg-sky-200 font-bold  mb-4 text-center py-2 rounded">
            Operator Eligible Payout List
          </h1>
          <ReUsableTable
            data={payouts}
            columns={columns}
            actions={actions}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPayoutList;
