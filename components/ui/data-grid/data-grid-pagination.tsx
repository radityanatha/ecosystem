"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataGridPaginationProps<TData> {
  table: Table<TData>
  total?: number
}

export function DataGridPagination<TData>({
  table,
  total,
}: DataGridPaginationProps<TData>) {
  const pageCount = table.getPageCount() || 1;
  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const currentPageRows = table.getFilteredRowModel().rows.length;
  
  // Use total from props if provided (for server-side pagination), otherwise calculate from pageCount
  const totalRows = total !== undefined 
    ? total 
    : (pageCount > 0 ? pageCount * pageSize : currentPageRows);
  
  const startRow = currentPageRows > 0 ? (pageIndex * pageSize) + 1 : 0;
  const endRow = Math.min((pageIndex * pageSize) + currentPageRows, totalRows);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 w-full">
      <div className="text-sm text-muted-foreground">
        {currentPageRows > 0 ? (
          <>
            Showing {startRow} to {endRow} of {totalRows} entries
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <span className="ml-2">
                ({table.getFilteredSelectedRowModel().rows.length} selected)
              </span>
            )}
          </>
        ) : (
          "No entries found"
        )}
      </div>
      <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 flex-wrap">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground hidden sm:block">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium min-w-[100px]">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

