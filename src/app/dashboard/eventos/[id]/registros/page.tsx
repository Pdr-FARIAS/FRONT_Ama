"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';;
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { socket } from "@/lib/socket";



import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Search, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { RegistroDataTable } from '@/components/RegistroDataTable';

interface Evento {
    titulo: string;
    data_termino: string;
}


interface Registro {
    registro_id: string;
    nome: string;
    email: string;
    telefone: string;
    data_inscricao: string;
}


export default function RegistrosPage() {
    const params = useParams();
    const eventId = params.id as string;

    const [evento, setEvento] = useState<Evento | null>(null);
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPageData = useCallback(async () => {
        if (!eventId) return;

        setIsLoading(true);
        try {

            const eventoRes = await api.get(`/evento/${eventId}`);
            setEvento(eventoRes.data);


            const registrosRes = await api.get(`/registro/evento/${eventId}`);
            setRegistros(registrosRes.data);

        } catch (error: any) {
            console.error("Erro ao carregar dados:", error);
            if (error.response?.status === 404) {
                toast.error("Evento ou registros não encontrados.");
            } else {
                toast.error("Falha ao carregar dados.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [eventId]);
    useEffect(() => {
        fetchPageData();
    }, [fetchPageData])


    useEffect(() => {
        socket.connect();

        socket.on("registro:create", fetchPageData);
        socket.on("registro:update", fetchPageData);
        socket.on("registro:delete", fetchPageData);

        return () => {
            socket.off("registro:create", fetchPageData);
            socket.off("registro:update", fetchPageData);
            socket.off("registro:delete", fetchPageData);
        };
    }, [fetchPageData]);


    const handleEdit = async (dadosAtualizados: any) => {
        try {
            await api.put(`/registro/${dadosAtualizados.registro_id}`, dadosAtualizados);

            toast.success("Registro atualizado!");

            setRegistros(prev =>
                prev.map(r =>
                    r.registro_id === dadosAtualizados.registro_id ? dadosAtualizados : r
                )
            );

        } catch (err: any) {
            console.error(err);
            toast.error("Erro ao atualizar registro.");
        }
    };

    const handleDeleteAll = async () => {

        setIsDeleting(true);
        try {
            await api.delete(`/registro/${eventId}/registros`);


            toast.success("Todos os registros foram deletados!");
            setRegistros([]);
        } catch (error: any) {
            if (error.response?.status === 404) {

                toast.error("Erro 404: Rota para 'deletar todos' não encontrada no backend.");
            } else {
                toast.error("Falha ao deletar todos os registros.");
            }
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };
    const handleDeleteOne = async (id: number) => {
        try {
            await api.delete(`/registro/${id}`);
            toast.success("Registro deletado!");
            setRegistros((prev) => prev.filter(r => r.registro_id !== id));
        } catch (error: any) {
            toast.error("Erro ao deletar registro.");
            console.error(error);
        }
    };

    const filteredRegistros = useMemo(() => {
        if (!registros) return [];
        return registros.filter(reg =>
            (reg.nome && reg.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (reg.data_inscricao && reg.data_inscricao.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [registros, searchTerm]);


    const dataFormatada = evento
        ? format(new Date(evento.data_termino), 'dd/MM/yyyy', { locale: ptBR })
        : "...";

    return (
        <div className="space-y-6">

            <Button variant="outline" asChild>
                <Link href="/dashboard/eventos">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Eventos
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        {isLoading ? "Carregando..." : `Inscritos: ${evento?.titulo || 'Evento'}`}
                    </CardTitle>
                    <CardDescription>
                        {isLoading ? "Buscando registros..." : (
                            <Badge variant="secondary">Até {dataFormatada}</Badge>
                        )}
                    </CardDescription>
                </CardHeader>


                <CardContent>

                    <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">


                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar por nome."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 w-full"
                            />
                        </div>


                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    disabled={registros.length === 0 || isLoading || isDeleting}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Excluir Todos
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir Todos os Registros?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tem certeza que deseja excluir todos os {registros.length} registros deste evento? Esta ação é irreversível.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        disabled={isDeleting}
                                        onClick={handleDeleteAll}
                                    >
                                        {isDeleting ? "Excluindo..." : "Sim, excluir tudo"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </div>

                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">Carregando inscritos...</div>
                    ) : (
                        <RegistroDataTable
                            data={filteredRegistros}
                            onDelete={handleDeleteOne}
                            onRegisterUpdated={fetchPageData}
                            isDeleting={isDeleting}
                        />

                    )}
                </CardContent>
            </Card>
        </div>
    );
}
