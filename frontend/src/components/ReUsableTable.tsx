import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { Fragment, useState } from "react";
import Loading from "../components/Loading";

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const tanstackColumns = columns.map((column) => ({
    id: column.label.toLowerCase(),
    header: column.label,

    accessorFn: column.filterValue
      ? (row: T) => column.filterValue!(row)
      : column.sortValue
        ? (row: T) => column.sortValue!(row)
        : (row: T) => column.render(row),
    cell: ({ row }: any) => column.render(row.original),
  }));
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
    <div className="overflow-auto  rounded shadow-md w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border rounded px-3 py-2 "
        />
      </div>
      <table className="w-full table-auto border border-gray-500">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Fragment key={headerGroup.id}>
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortDirection = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="border border-gray-500 p-2 cursor-pointer"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {sortDirection === "asc" && " ↑"}
                      {sortDirection === "desc" && " ↓"}
                    </th>
                  );
                })}
                {actions.length > 0 && (
                  <th className="border border-gray-500 p-2">Actions</th>
                )}
              </tr>
            </Fragment>
          ))}
        </thead>
        <tbody className="bg-slate-200">
          {table.getRowModel().rows.map((row) => {
            const item = row.original;
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-gray-500 p-2 text-center"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}

                {actions.length > 0 && (
                  <td className="border border-gray-500 p-2 text-center space-x-2 whitespace-nowrap">
                    {actions.map((action, actionIdx) => {
                      const disabled = action.disabled?.(item) || false;
                      const loading = action.isLoading?.(item) || false;
                      return (
                        <button
                          key={actionIdx}
                          className={
                            `w-[90px] inline-flex items-center justify-center  ${action.className}` ||
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReUsableTable;
