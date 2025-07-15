import * as React from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { StudyData } from 'shared/types';
import useStudyData from '@/hooks/use-study-data';

export const columns: ColumnDef<StudyData>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ID
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm w-24">{row.getValue('id')}</div>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const title: string = row.getValue('title');
      return (
        <div className="max-w-xs truncate" title={title}>
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('source')}</div>
    ),
  },

  {
    accessorKey: 'sponsor',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Sponsor
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const sponsor: string = row.getValue('sponsor');
      return (
        <div className="max-w-32 truncate" title={sponsor}>
          {sponsor}
        </div>
      );
    },
  },
  {
    accessorKey: 'conditions',
    header: 'Conditions',
    cell: ({ row }) => {
      const conditions: string[] = row.getValue('conditions');
      const displayConditions = conditions.slice(0, 1).join(', ');
      const hasMore = conditions.length > 1;
      return (
        <div className="max-w-32 truncate" title={conditions.join(', ')}>
          {displayConditions}
          {hasMore ? ` +${conditions.length - 1} more` : ''}
        </div>
      );
    },
  },
  {
    accessorKey: 'startISO',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Start Date
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('startISO'));
      return <div className="text-sm">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url: string = row.getValue('url');
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          View Study
        </a>
      );
    },
  },
];

export function AllStudiesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data } = useStudyData();

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="h-full overflow-hidden">
      <CardContent className="p-4 overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter by title..."
              value={
                (table.getColumn('title')?.getFilterValue() as string) ?? ''
              }
              onChange={event =>
                table.getColumn('title')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border max-h-[500px] overflow-auto overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
