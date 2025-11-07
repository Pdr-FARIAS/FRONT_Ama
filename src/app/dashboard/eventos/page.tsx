"use client";
import { socket } from "@/lib/socket";
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Search, Trash2, Pencil, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { EditEventoModal } from '@/components/EditEventoModal';


interface Criador {
    userid: number;
    user: string;
    email: string;
}

interface Evento {
    eventoid: string;
    titulo: string;
    descriçao: string;
    data_termino: string;
    image: string | null;
    criador: Criador;
}


export default function ListarEventosPage() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchEventos = useCallback(async (titulo?: string) => {
        setIsLoading(true);
        try {
            let response;
            if (titulo && titulo.trim() !== "") {
                response = await api.get('/evento/search/titulo', { params: { titulo } });
            } else {
                response = await api.get('/evento');

            }
            setEventos(response.data);

        } catch (error: any) {
            console.error("Erro ao carregar eventos:", error);
            if (error.response?.status === 404) {
                toast("Nenhum evento encontrado.");
                setEventos([]);
            } else {
                toast.error("Falha ao carregar eventos.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {

        fetchEventos();
    }, [fetchEventos]);




    const handleDelete = async (id: string) => {
        try {

            await api.delete(`/evento/${id}`);
            toast.success("Evento deletado com sucesso!");

            setEventos(prevEventos => prevEventos.filter(e => e.eventoid !== id));
        } catch (error) {
            toast.error("Falha ao deletar o evento.");
            console.error("Erro ao deletar:", error);
        }
    };


    const handleDeleteAll = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/evento/delete-all`);

            toast.success("Todos os eventos foram deletados!");
            setEventos([]);
        } catch (error) {
            toast.error("Falha ao deletar todos os eventos. (Rota do backend não implementada?)");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };


    const formatarData = (dataISO: string) => {
        try {
            return format(new Date(dataISO), "'Até' dd 'de' MMMM, yyyy", { locale: ptBR });
        } catch (e) {
            return "Data inválida";
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Eventos Criados</CardTitle>
                    <CardDescription>
                        Pesquise, edite ou delete os eventos financeiros registrados.
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <div className="flex flex-col md:flex-row gap-4 justify-between mb-6 p-4 border rounded-lg bg-gray-50">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Buscar por título do evento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                            <Button onClick={() => fetchEventos(searchTerm)} disabled={isLoading}>
                                <Search className="w-4 h-4 mr-2" />
                                Buscar
                            </Button>
                        </div>


                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    disabled={eventos.length === 0 || isLoading || isDeleting}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Deletar Todos
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem certeza que quer deletar TUDO?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação é irreversível e deletará todos os {eventos.length} eventos.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAll}
                                        disabled={isDeleting}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {isDeleting ? "Deletando..." : "Sim, deletar tudo"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>


                    {isLoading ? (
                        <p className="text-center py-10">Carregando eventos...</p>
                    ) : eventos.length === 0 ? (
                        <p className="text-center py-10 text-gray-500">Nenhum evento foi criado ainda.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {eventos.map((evento) => (
                                <Card key={evento.eventoid} className="flex flex-col">

                                    <div className="w-full h-48 rounded-t-lg relative bg-gray-200">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Calendar className="w-12 h-12 text-gray-400" />
                                        </div>
                                        {evento.image && (
                                            <img
                                                src={evento.image}
                                                alt={evento.titulo}
                                                className="absolute inset-0 w-full h-48 object-cover rounded-t-lg z-10"
                                                onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
                                            />
                                        )}
                                    </div>

                                    <CardHeader>
                                        <CardTitle>{evento.titulo}</CardTitle>
                                        <Badge variant="outline" className="w-fit">{formatarData(evento.data_termino)}</Badge>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-sm text-muted-foreground">{evento.descriçao}</p>
                                    </CardContent>


                                    <CardFooter className="flex justify-between items-center border-t pt-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <User className="w-4 h-4 mr-2" />
                                            <span>{evento.criador.user}</span>
                                        </div>

                                        <div className="flex space-x-2">


                                            <EditEventoModal
                                                eventoId={evento.eventoid}
                                                onEventUpdated={() => fetchEventos(searchTerm)}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label="Editar"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </EditEventoModal>


                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label="Ver Registros"
                                                asChild
                                            >
                                                <Link href={`/dashboard/eventos/${evento.eventoid}/registros`}>
                                                    <Users className="h-4 w-4" />
                                                </Link>
                                            </Button>


                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        aria-label="Deletar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Deletar Evento?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tem certeza que deseja deletar o evento: "{evento.titulo}"?
                                                            Esta ação não pode ser desfeita.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(evento.eventoid)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Deletar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardFooter>

                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}