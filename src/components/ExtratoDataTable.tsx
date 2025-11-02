"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

// Componentes Shadcn/UI para a Tabela
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Interface para os dados que o componente recebe
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

// 1. Definição das Colunas (Contrato da Tabela)
// TData é o tipo de dado de cada linha
export const columns: ColumnDef<ExtratoTableData>[] = [
    {
        // Coluna de Data com ordenação
        accessorKey: "dataFormatada",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    // Toggle a ordenação ao clicar no cabeçalho
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        // Renderização da célula
        cell: ({ row }) => <div className="pl-4">{row.original.dataFormatada}</div>,
    },
    {
        // Coluna de Descrição (simples)
        accessorKey: "descricao",
        header: "Descrição",
        cell: ({ row }) => <div className="max-w-xs truncate">{row.original.descricao}</div>,
    },
    {
        // Coluna de Tipo (Crédito/Débito) com ícones
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
        // Coluna de Valor (formatada como moeda)
        accessorKey: "valorLancamento",
        header: () => <div className="text-right">Valor</div>,
        cell: ({ row }) => {
            // Garante que o valor é um número
            const valor = parseFloat(row.original.valorLancamento.toString());
            const isCredit = row.original.sinal === 'C';

            // Formata para moeda BRL
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

// 2. O Componente da Tabela
export function ExtratoDataTable<TData, TValue>({ data }: DataTableProps<TData, TValue>) {
    // Hook principal para gerenciar o estado da tabela
    const table = useReactTable({
        data: data as ExtratoTableData[],
        columns: columns as ColumnDef<TData, TValue>[],
        getCoreRowModel: getCoreRowModel(), // Necessário para funcionalidades básicas
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
                            // Usa o valor do sinal para colorir a linha (opcional)
                            // data-state={row.original.sinal === 'D' ? "gasto" : ""} 
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
