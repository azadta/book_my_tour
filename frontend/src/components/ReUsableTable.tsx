import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type CellContext,
  type SortingState,
} from "@tanstack/react-table";
import { Fragment, useMemo, useState } from "react";
import Loading from "../components/Loading";
import { Search } from "lucide-react";

export interface Column<T> {
  label: string;
  render: (item: T) => React.ReactNode;
  sortValue?: (item: T) => string | number;
  filterValue?: (item: T) => string;
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
  "use no memo";

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const tanstackColumns = useMemo(() => {
    return columns.map((column) => ({
      id: column.label.toLowerCase(),
      header: column.label,

      accessorFn: column.filterValue
        ? (row: T) => column.filterValue!(row)
        : column.sortValue
          ? (row: T) => column.sortValue!(row)
          : (row: T) => column.render(row),
      cell: ({ row }: CellContext<T, unknown>) => column.render(row.original),
    }));
  }, [columns]);
  //eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: tanstackColumns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  if (loading) return <Loading />;
  if (data.length === 0) return <p className="text-center">{noDataText}</p>;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl bg-white border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-800 placeholder:text-slate-400 shadow-xs "
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Fragment key={headerGroup.id}>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {headerGroup.headers.map((header) => {
                    const sortDirection = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/60 transition-colors select-none whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <span className="text-sky-600 font-bold">
                            {sortDirection === "asc" && "↑"}
                            {sortDirection === "desc" && "↓"}
                          </span>
                        </div>
                      </th>
                    );
                  })}

                  {actions.length > 0 && (
                    <th className="py-3.5 px-4 text-right whitespace-nowrap ">
                      Actions
                    </th>
                  )}
                </tr>
              </Fragment>
            ))}
          </thead>

          <tbody className="divide-y divide-slate-100 text-[14px] font-medium text-slate-700">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="py-12 text-center text-slate-400 font-medium"
                >
                  {noDataText}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const item = row.original;
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4 px-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}

                    {actions.length > 0 && (
                      <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                        {actions.map((action, actionIdx) => {
                          const disabled = action.disabled?.(item) || false;
                          const loading = action.isLoading?.(item) || false;
                          return (
                            <button
                              key={actionIdx}
                              className={
                                action.className
                                  ? `inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-md font-semibold shadow-xs transition-all active:scale-95 cursor-pointer ${action.className}`
                                  : `inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs shadow-sky-200 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none`
                              }
                              onClick={() => action.onClick(item)}
                              disabled={disabled || loading}
                            >
                              {loading
                                ? action.loadingText || "Processing..."
                                : action.label(item)}
                            </button>
                          );
                        })}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReUsableTable;
