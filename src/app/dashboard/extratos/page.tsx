"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { socket } from "@/lib/socket";


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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


import { ExtratoDataTable } from '@/components/ExtratoDataTable';



interface Extrato {
    extratoid: string;
    data_movimento: string;
    descricao: string;
    valorLancamento: number;
    sinal: 'C' | 'D';

}

export default function ExtratosPage() {
    const [extratos, setExtratos] = useState<Extrato[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);


    const fetchExtratos = async () => {
        setIsLoading(true);
        try {

            const response = await api.get('/extrato/extrato');


            const rawData = response.data.extratos || [];

            setExtratos(rawData);
            toast.success(`Foram carregados ${rawData.length} extratos.`);
            return true;

        } catch (error: any) {
            console.error("Erro ao carregar extratos:", error);
            const errorMessage = error.response?.data?.message || "Falha ao conectar com o servidor.";
            toast.error(`Erro: ${errorMessage}`);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAll = async () => {
        setIsDeleting(true);
        try {

            await api.delete('/extrato/');

            toast.success("Todos os extratos foram deletados com sucesso!");
            setExtratos([]);
            fetchExtratos();

        } catch (error: any) {
            console.error("Erro ao deletar extratos:", error);
            const errorMessage = error.response?.data?.message || "Falha ao deletar todos os extratos.";
            toast.error(`Erro: ${errorMessage}`);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchExtratos();


        socket.connect();

        socket.on("extrato_status", (info) => {
            console.log("Status do extrato:", info);
        });
        socket.on("atualizar_grafico", (dados) => {
            console.log("Atualizar gráfico:", dados);
        });



        socket.on("extrato:create", (novo) => {
            setExtratos((prev) => [...prev, novo]);
        });


        socket.on("extrato:update", (atualizado) => {
            setExtratos((prev) =>
                prev.map((e) =>
                    e.extratoid === atualizado.extratoid ? atualizado : e
                )
            );
        });


        socket.on("extrato:delete", (id) => {
            setExtratos((prev) => prev.filter((e) => e.extratoid !== id));
        });


        socket.on("extrato:delete:all", () => {
            setExtratos([]);
        });

        return () => {

            socket.off("extrato:create");
            socket.off("extrato:update");
            socket.off("extrato:delete");
            socket.off("extrato:delete:all");
        };
    }, []);



    const filteredExtratos = extratos.filter(extrato =>
        extrato.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const dataParaTabela = filteredExtratos.map(extrato => ({
        ...extrato,
        dataFormatada: format(new Date(extrato.data_movimento), 'dd/MM/yyyy', { locale: ptBR }),
    }));


    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
                <CardTitle className="text-3xl font-bold">Histórico de Extratos</CardTitle>


                <div className="flex space-x-3 mt-2 sm:mt-0">


                    <Button onClick={() => window.location.href = '/dashboard/novo-lancamento'}>
                        + Novo Lançamento
                    </Button>


                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={extratos.length === 0}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Deletar Tudo
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso irá deletar permanentemente
                                    todos os {extratos.length} extratos associados à sua conta.
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
            </CardHeader>

            <CardContent>
                <div className="mb-4">
                    <Input
                        placeholder="Buscar por descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>

                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Carregando dados...</div>
                ) : (

                    <ExtratoDataTable data={dataParaTabela} />
                )}
            </CardContent>
        </Card>
    );
}
