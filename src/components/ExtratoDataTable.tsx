"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";


interface ExtratoTableData {
    extratoid: string;
    dataFormatada: string;
    descricao: string;
    valorLancamento: number;
    sinal: 'C' | 'D';
}

interface DataTableProps<TData, TValue> {
    data: TData[];
}

export const columns: ColumnDef<ExtratoTableData>[] = [
    {

        accessorKey: "dataFormatada",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"

                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },

        cell: ({ row }) => <div className="pl-4">{row.original.dataFormatada}</div>,
    },
    {
        accessorKey: "descricao",
        header: "Descrição",
        cell: ({ row }) => <div className="max-w-xs truncate">{row.original.descricao}</div>,
    },
    {

        accessorKey: "sinal",
        header: "Tipo",
        cell: ({ row }) => {
            const sinal = row.getValue("sinal");
            const isCredit = sinal === 'C';
            return (
                <div className="font-medium flex items-center">
                    {isCredit ? (
                        <ArrowUp className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                        <ArrowDown className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    <span className={isCredit ? "text-green-600" : "text-red-600"}>
                        {isCredit ? "Crédito" : "Débito"}
                    </span>
                </div>
            );
        }
    },
    {

        accessorKey: "valorLancamento",
        header: () => <div className="text-right">Valor</div>,
        cell: ({ row }) => {

            const valor = parseFloat(row.original.valorLancamento.toString());
            const isCredit = row.original.sinal === 'C';


            const formatted = valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });

            return (
                <div className={`text-right font-medium ${isCredit ? "text-green-600" : "text-red-600"}`}>
                    {formatted}
                </div>
            );
        },
    },
];


export function ExtratoDataTable<TData, TValue>({ data }: DataTableProps<TData, TValue>) {

    const table = useReactTable({
        data: data as ExtratoTableData[],
        columns: columns as ColumnDef<TData, TValue>[],
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
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
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}

                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Nenhum extrato encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
