"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

interface DataGridProps<TData> {
  table: Table<TData>
  recordCount?: number
  tableLayout?: {
    columnsPinnable?: boolean
    columnsResizable?: boolean
    columnsMovable?: boolean
    columnsVisibility?: boolean
  }
  children: React.ReactNode
}

export function DataGrid<TData>({
  table,
  recordCount,
  tableLayout,
  children,
}: DataGridProps<TData>) {
  return <div className="space-y-4">{children}</div>
}

