import { useWallet } from "@/hooks/useWallet";
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Wallet2,
} from "lucide-react";

const Wallet = () => {
  const {
    balance,
    handleTopup,
    isLoading,
    topupAmount,
    transactions,
    setTopupAmount,
  } = useWallet();
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 mt-10">
      <div className="relative overflow-hidden bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm font-medium tracking-wide">
              Available balance
            </p>
            <h1 className="text-2xl font-semibold">Rs {balance.toLocaleString("en-IN")}</h1>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
            <Wallet2 className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-2 text-xs text-blue-100">
          <ShieldCheck className="w-4 h-4" />
          <span>Secured with Razorpay Gateway</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Add Money to Wallet</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            placeholder="Enter Amount (Rs)"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleTopup(Number(topupAmount))}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition disabled:opacity-50 "
          >
            {isLoading ? (
              <RefreshCcw className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            <span>Add Funds</span>
          </button>
        </div>

        <div className="flex gap-2 pt-2">
          {[500, 1000, 2500, 5000].map((amt) => (
            <button
              key={amt}
              onClick={() => handleTopup(amt)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rouned-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
            >
              Rs {amt}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
        <div className="divide-y divide-gray-100">
          {transactions.length === 0 ? (
            <p className="text-center py-6 text-gray-400">
              No transactions yet.
            </p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="py-4 flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2.5 rounded-full ${tx.type === "CREDIT" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                  >
                    {tx.type === "CREDIT" ? (
                      <ArrowDownRight className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {tx.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-bold ${tx.type === "CREDIT" ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {tx.type === "CREDIT" ? "+" : "-"}Rs{" "}
                    {tx.amount.toLocaleString("en-IN")}
                  </p>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${tx.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700" : tx.status === "PENDING" ? "bg-amber-50 text-amber-700" : "bg-rose-100 text-rose-700"}`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
