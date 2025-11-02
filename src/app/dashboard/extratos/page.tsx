"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2 } from 'lucide-react'; // Ícone de lixeira

// Componentes Shadcn/UI
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
} from "@/components/ui/alert-dialog"; // Para confirmação

// Importa o componente da Tabela (DataTable) que definimos
import { ExtratoDataTable } from '@/components/ExtratoDataTable';

// --- Interfaces de Dados ---

// A estrutura de cada linha de extrato vinda da API
interface Extrato {
    extratoid: string;
    data_movimento: string;
    descricao: string;
    valorLancamento: number;
    sinal: 'C' | 'D'; // C = Crédito, D = Débito
    // Adicione outros campos do seu modelo 'extrato' aqui, se necessário
}

// --- O Componente da Página ---
export default function ExtratosPage() {
    const [extratos, setExtratos] = useState<Extrato[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false); // Estado para o botão de deleção

    // Função para buscar os extratos
    const fetchExtratos = async () => {
        setIsLoading(true);
        try {
            // Chama a rota que lista todos os extratos do usuário
            const response = await api.get('/extrato/extrato');

            // O seu backend retorna { extratos: [...] }, como no UserController.js
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

    // --- NOVO: Método de Deleção ---
    const handleDeleteAll = async () => {
        setIsDeleting(true);
        try {
            // Chama a rota DELETE que deleta todos os extratos do usuário
            // Rota: DELETE /extrato/ (baseado na sua informação)
            await api.delete('/extrato/');

            toast.success("Todos os extratos foram deletados com sucesso!");

            // Recarrega a lista de extratos para mostrar a tabela vazia
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
    }, []);

    // 1. Filtragem de Dados (Lógica do Frontend)
    const filteredExtratos = extratos.filter(extrato =>
        extrato.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Mapeamento para o formato da tabela
    // O componente da tabela espera uma coluna formatada chamada 'dataFormatada'
    const dataParaTabela = filteredExtratos.map(extrato => ({
        ...extrato,
        dataFormatada: format(new Date(extrato.data_movimento), 'dd/MM/yyyy', { locale: ptBR }),
    }));


    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
                <CardTitle className="text-3xl font-bold">Histórico de Extratos</CardTitle>

                {/* Container dos Botões */}
                <div className="flex space-x-3 mt-2 sm:mt-0">

                    {/* Botão para Novo Lançamento (Já existia) */}
                    <Button onClick={() => window.location.href = '/dashboard/novo-lancamento'}>
                        + Novo Lançamento
                    </Button>

                    {/* NOVO: Botão de Deleção com Confirmação */}
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
                    // 3. Renderiza a tabela com os dados processados
                    <ExtratoDataTable data={dataParaTabela} />
                )}
            </CardContent>
        </Card>
    );
}
