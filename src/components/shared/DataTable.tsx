import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
}
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}
export function DataTable<T extends {
  id: string | number;
}>({
  data,
  columns,
  onRowClick
}: DataTableProps<T>) {
  return <div className="space-y-4">
      <div className="rounded-md border border-neutral-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => <TableHead key={String(column.accessorKey)}>
                  {column.header}
                </TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => <TableRow key={item.id} onClick={() => onRowClick?.(item)} className={onRowClick ? 'cursor-pointer' : ''}>
                {columns.map(column => <TableCell key={`${item.id}-${String(column.accessorKey)}`}>
                    {column.cell ? column.cell(item) : item[column.accessorKey] as React.ReactNode}
                  </TableCell>)}
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-neutral-500">
          Showing {data.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>;
}