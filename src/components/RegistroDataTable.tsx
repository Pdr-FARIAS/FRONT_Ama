"use client";

import React, { useState } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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


import { MoreHorizontal, Trash2, Pencil } from "lucide-react";

import { EditRegistroModal } from "@/components/EditRegistroModal";


import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


interface Registro {
    registro_id: number;
    nome: string | null;
    email: string | null;
    telefone: string;
    data_inscricao: string | null;
}


interface RegistroDataTableProps {
    data: Registro[];
    onDelete: (id: number) => void;
    onRegisterUpdated: () => void;
    isDeleting: boolean;
}

const formatarData = (dataISO: string | null): string => {
    if (!dataISO) return "N/A";
    try {
        return format(new Date(dataISO), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
        return "Data inválida";
    }
};

export const getColumns = (
    onDelete: (id: number) => void,
    onRegisterUpdated: () => void
): ColumnDef<Registro>[] => [
        {
            accessorKey: "nome",
            header: "Nome",
            cell: ({ row }) => <div className="capitalize">{row.getValue("nome") || "N/A"}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div>{row.getValue("email") || "N/A"}</div>,
        },
        {
            accessorKey: "data_inscricao",
            header: "Data da Inscrição",
            cell: ({ row }) => <div>{formatarData(row.getValue("data_inscricao"))}</div>,
        },
        {
            id: "actions",
            header: () => <div className="text-right">Ações</div>,
            enableHiding: false,
            cell: ({ row }) => {
                const registro = row.original;
                const [isAlertOpen, setIsAlertOpen] = useState(false);

                return (
                    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 float-right">
                                    <span className="sr-only">Abrir menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <EditRegistroModal
                                    registroId={registro.registro_id}
                                    onRegisterUpdated={onRegisterUpdated}
                                >
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                </EditRegistroModal>

                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setIsAlertOpen(true);
                                    }}
                                    className="text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Deletar
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>


                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Deletar Registro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja deletar o registro de "{registro.nome || 'N/A'}"?
                                    Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(registro.registro_id)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Sim, deletar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                );
            },
        },
    ];



export function RegistroDataTable({ data, onDelete, onRegisterUpdated, isDeleting }: RegistroDataTableProps) {

    const columns = React.useMemo(
        () => getColumns(onDelete, onRegisterUpdated),
        [onDelete, onRegisterUpdated]
    );

    const table = useReactTable({
        data,
        columns,
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
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}

                                    className={isDeleting ? "opacity-50 pointer-events-none" : ""}
                                >
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
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Nenhum registro encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} registro(s) encontrado(s).
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


export default RegistroDataTable;