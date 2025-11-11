"use client";

import { useMemo, useState, useEffect } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import { Card, CardFooter, CardHeader, CardHeading, CardTable, CardToolbar } from '@/components/ui/card';

import { Checkbox } from '@/components/ui/checkbox';

import { DataGrid } from '@/components/ui/data-grid';

import { DataGridColumnHeader } from '@/components/ui/data-grid/data-grid-column-header';

import { DataGridPagination } from '@/components/ui/data-grid/data-grid-pagination';

import {
  DataGridTable,
} from '@/components/ui/data-grid/data-grid-table';

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenu,
} from '@/components/ui/dropdown-menu';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { Ellipsis, Filter, Search, UserRoundPlus, X } from 'lucide-react';

import { PegawaiFormModal } from "@/components/pegawai-form-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IPegawai {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  role: string;
  noHp: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  foto: string | null;
  statusPegawai: string;
  createdAt: string;
}

function ActionsCell({ 
  row, 
  onEdit, 
  onDelete 
}: { 
  row: Row<IPegawai>;
  onEdit: (pegawai: IPegawai) => void;
  onDelete: (pegawai: IPegawai) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => onEdit(row.original)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive" 
          onClick={() => onDelete(row.original)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DataGridDemo() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [data, setData] = useState<IPegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<IPegawai | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pegawaiToDelete, setPegawaiToDelete] = useState<IPegawai | null>(null);

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: (pagination.pageIndex + 1).toString(),
          pageSize: pagination.pageSize.toString(),
          ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
          ...(selectedStatuses.length > 0 && { status: selectedStatuses[0] }),
        });

        const response = await fetch(`/api/administrator/pegawai?${params}`);
        const result = await response.json();

        if (response.ok) {
          setData(result.data);
          setTotal(result.total);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearchQuery, selectedStatuses]);

  // Fetch status counts separately
  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const response = await fetch('/api/administrator/pegawai?countOnly=true');
        const result = await response.json();
        
        if (response.ok) {
          setStatusCounts(result);
        }
      } catch (error) {
        console.error('Error fetching status counts:', error);
      }
    };

    fetchStatusCounts();
  }, []);

  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses(
      (prev = []) => {
        const newStatuses = checked ? [...prev, value] : prev.filter((v) => v !== value);
        setPagination({ ...pagination, pageIndex: 0 });
        return newStatuses;
      }
    );
  };

  // Function to refresh data
  const refreshData = () => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: (pagination.pageIndex + 1).toString(),
          pageSize: pagination.pageSize.toString(),
          ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
          ...(selectedStatuses.length > 0 && { status: selectedStatuses[0] }),
        });

        const response = await fetch(`/api/administrator/pegawai?${params}`);
        const result = await response.json();

        if (response.ok) {
          setData(result.data);
          setTotal(result.total);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  // Handle create
  const handleCreate = () => {
    setSelectedPegawai(null);
    setIsFormModalOpen(true);
  };

  // Handle edit
  const handleEdit = (pegawai: IPegawai) => {
    setSelectedPegawai(pegawai);
    setIsFormModalOpen(true);
  };

  // Handle delete
  const handleDelete = (pegawai: IPegawai) => {
    setPegawaiToDelete(pegawai);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pegawaiToDelete) return;

    try {
      const response = await fetch(
        `/api/administrator/pegawai?id=${pegawaiToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setIsDeleteDialogOpen(false);
        setPegawaiToDelete(null);
        refreshData();
      } else {
        alert(result.error || "Gagal menghapus pegawai");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Terjadi kesalahan saat menghapus pegawai");
    }
  };

  const [columnOrder, setColumnOrder] = useState<string[]>(['name', 'role', 'status', 'actions']);

  const columns = useMemo<ColumnDef<IPegawai>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Nama Pegawai" visibility={false} column={column} />,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={row.original.foto ? (row.original.foto.startsWith("/") ? row.original.foto : `/uploads/avatars/${row.original.foto}`) : undefined} 
                  alt={row.original.name} 
                />
                <AvatarFallback>{row.original.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-px">
                <div className="font-medium text-foreground">{row.original.name}</div>
                <div className="text-sm text-muted-foreground">{row.original.email}</div>
              </div>
            </div>
          );
        },
        size: 250,
        enableSorting: true,
        enableHiding: false,
        enableResizing: true,
      },
      {
        accessorKey: 'role',
        id: 'role',
        header: ({ column }) => <DataGridColumnHeader title="Role" visibility={false} column={column} />,
        cell: ({ row }) => {
          return (
            <div className="font-medium text-foreground">{row.original.role}</div>
          );
        },
        size: 150,
        enableSorting: false,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title="Status" visibility={false} column={column} />,
        cell: ({ row }) => {
          const status = row.original.status;

          if (status === 'Active') {
            return (
              <Badge variant="primary" appearance="outline">
                Active
              </Badge>
            );
          } else {
            return (
              <Badge variant="secondary" appearance="outline">
                Inactive
              </Badge>
            );
          }
        },
        size: 100,
        enableSorting: false,
        enableHiding: true,
        enableResizing: true,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => <ActionsCell row={row} onEdit={handleEdit} onDelete={handleDelete} />,
        size: 60,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data,
    pageCount: Math.ceil(total / pagination.pageSize),
    getRowId: (row: IPegawai) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <DataGrid
        table={table}
        recordCount={total}
        tableLayout={{
          columnsPinnable: true,
          columnsResizable: true,
          columnsMovable: true,
          columnsVisibility: false,
        }}
      >
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center justify-between gap-4">
              <CardHeading className="flex-1">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search nama atau email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                    {searchQuery.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
                        onClick={() => setSearchQuery('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <Filter className="h-4 w-4" />
                        Status
                        {selectedStatuses.length > 0 && (
                          <Badge size="sm" appearance="outline" className="ml-2">
                            {selectedStatuses.length}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-3" align="start">
                      <div className="space-y-3">
                        <div className="text-xs font-medium text-muted-foreground">Filters</div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2.5">
                            <Checkbox
                              id="Active"
                              checked={selectedStatuses.includes('Active')}
                              onCheckedChange={(checked) => handleStatusChange(checked === true, 'Active')}
                            />
                            <Label
                              htmlFor="Active"
                              className="flex grow items-center justify-between font-normal gap-1.5"
                            >
                              Active
                              <span className="text-muted-foreground">{statusCounts['Active'] || 0}</span>
                            </Label>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Checkbox
                              id="Inactive"
                              checked={selectedStatuses.includes('Inactive')}
                              onCheckedChange={(checked) => handleStatusChange(checked === true, 'Inactive')}
                            />
                            <Label
                              htmlFor="Inactive"
                              className="flex grow items-center justify-between font-normal gap-1.5"
                            >
                              Inactive
                              <span className="text-muted-foreground">{statusCounts['Inactive'] || 0}</span>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeading>
              <CardToolbar>
                <Button onClick={handleCreate}>
                  <UserRoundPlus className="h-4 w-4" />
                  Add new
                </Button>
              </CardToolbar>
            </div>
          </CardHeader>
          <CardTable>
            <ScrollArea className="h-[calc(100vh-400px)] min-h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              ) : data.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">No data found</div>
                </div>
              ) : (
                <>
                  <DataGridTable table={table} />
                  <ScrollBar orientation="horizontal" />
                </>
              )}
            </ScrollArea>
          </CardTable>
          <CardFooter className="border-t py-3">
            <DataGridPagination table={table} total={total} />
          </CardFooter>
        </Card>
      </DataGrid>

      {/* Form Modal */}
      <PegawaiFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        onSuccess={refreshData}
        pegawai={selectedPegawai}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pegawai?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pegawai{" "}
              <strong>{pegawaiToDelete?.name}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
 