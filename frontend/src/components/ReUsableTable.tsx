import Loading from "../components/Loading";

export interface Column<T> {
  label: string;
  render: (item: T) => React.ReactNode;
}

export interface ActionButton<T> {
  label: (item: T) => string;
  onClick: (item: T) => void;
  className: string;
  disabled: (item: T) => boolean;
  loadingText: string;
  isLoading?: (item: T) => boolean;
}

interface ReUsableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: ActionButton<T>[];
  loading?: boolean;
  noDataText?: string;
}

const ReUsableTable = <T,>({
  data,
  columns,
  actions = [],
  loading,
  noDataText = "No data available",
}: ReUsableTableProps<T>) => {
  if (loading) return <Loading />;
  if (data.length === 0) return <p className="text-center">{noDataText}</p>;
  return (
    <table className="min-w-full table-auto border border-gray-500">
      <thead>
        <tr className="bg-gray-100">
          {columns.map((col, idx) => (
            <th key={idx} className="border border-gray-500 p-2">
              {col.label}
            </th>
          ))}
          {actions.length > 0 && (
            <th className="border  border-gray-500 p-2  ">Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rawIndex) => (
          <tr key={rawIndex}>
            {columns.map((col, colIndex) => (
              <td
                key={colIndex}
                className="border border-gray-500 p-2 text-center"
              >
                {col.render(item)}
              </td>
            ))}

            {actions.length > 0 && (
              <td className="border border-gray-500 p-2 text-center space-x-2">
                {actions.map((action, actionIdx) => {
                  const disabled = action.disabled?.(item) || false;
                  const loading = action.isLoading?.(item) || false;
                  return (
                    <button
                      key={actionIdx}
                      className={
                        action.className ||
                        "px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 "
                      }
                      onClick={() => action.onClick(item)}
                      disabled={disabled}
                    >
                      {loading
                        ? action.loadingText || "Processing"
                        : action.label(item)}
                    </button>
                  );
                })}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReUsableTable;
