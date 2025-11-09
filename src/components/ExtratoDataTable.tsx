"use client";

import React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";


import { ArrowUpDown, ArrowDown, ArrowUp, Pencil } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";


import { EditExtratoModal } from "@/components/EditExtratoModal";

interface ExtratoTableData {
    extratoid: string;
    dataFormatada: string;
    descricao: string;
    valorLancamento: number;
    sinal: "C" | "D";

}

interface DataTableProps<TData, TValue> {
    data: TData[];
    onExtratoUpdated: () => void;
}


function EditarAcao({ extrato, onUpdated }: { extrato: ExtratoTableData; onUpdated: () => void }) {



    return (
        <div className="text-right">

            <EditExtratoModal

                extrato={extrato}
                onExtratoUpdated={onUpdated}
            >

                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                </Button>
            </EditExtratoModal>
        </div>
    );
}


export const getColumns = (onExtratoUpdated: () => void): ColumnDef<ExtratoTableData>[] => [
    {
        accessorKey: "dataFormatada",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Data
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="pl-4">{row.original.dataFormatada}</div>,
    },
    {
        accessorKey: "descricao",
        header: "Descrição",
        cell: ({ row }) => (
            <div className="max-w-xs truncate">{row.original.descricao}</div>
        ),
    },
    {
        accessorKey: "sinal",
        header: "Tipo",
        cell: ({ row }) => {
            const sinal = row.getValue("sinal");
            const isCredit = sinal === "C";
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
        },
    },
    {
        accessorKey: "valorLancamento",
        header: () => <div className="text-right">Valor</div>,
        cell: ({ row }) => {
            const valor = parseFloat(row.original.valorLancamento.toString());
            const isCredit = row.original.sinal === "C";

            const formatted = valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });

            return (
                <div
                    className={`text-right font-medium ${isCredit ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {formatted}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-right">Ações</div>,
        cell: ({ row }) => {
            const extrato = row.original;

            return (
                <EditarAcao
                    extrato={extrato}
                    onUpdated={onExtratoUpdated}
                />
            );
        },
    },
];


export function ExtratoDataTable<TData, TValue>({
    data,
    onExtratoUpdated
}: DataTableProps<TData, TValue>) {

    const columns = React.useMemo(
        () => getColumns(onExtratoUpdated),
        [onExtratoUpdated]
    );

    const table = useReactTable({
        data: data as ExtratoTableData[],
        columns: columns as ColumnDef<TData, TValue>[],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {},
    });

    return (
        <div className="w-full">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Nenhum extrato encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>


            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} linha(s) encontrada(s).
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Próxima
                    </Button>
                </div>
            </div>
        </div>
    );
}

