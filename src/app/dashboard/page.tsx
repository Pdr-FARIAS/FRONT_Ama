"use client";

import { useEffect, useState, useMemo } from "react";
// CORRIGIDO: Usando caminhos de alias (assumindo que estão configurados no seu projeto)
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { GraficoFinanceiro } from "@/components/GraficoFinanceiro";

// --- Interfaces (Contratos de Dados) ---

// ATUALIZADO: Usando os nomes que o backend está DE FATO enviando
interface GraficoRawData {
    data: string | null | undefined; // O backend envia 'data'
    valor: number | string | null | undefined; // O backend envia 'valor'
    sinal: string | null | undefined; // "C" ou "D" (Pode ser inferido do valor)
}

// Dados agregados por dia
interface GraficoDataAgregada {
    data: string;
    entrada: number;
    saida: number;
}

// Para as rotas: /extrato/entradas e /extrato/saidas
interface ExtratoAgregado {
    totalEntradas?: number;
    totalSaidas?: number;
    quantidade?: number;
    detalhes?: any[];
}

// --- Função Auxiliar para formatar dinheiro ---
function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

// --- Funções Auxiliares para Agregação ---

// A função que SOMA os lançamentos por dia
function aggregateData(raw: GraficoRawData[]): GraficoDataAgregada[] {
    // Cria um mapa para somar os valores, usando a data como chave
    const map = new Map<string, { entrada: number, saida: number }>();

    raw.forEach(item => {
        // CORREÇÃO PRINCIPAL: 
        // 1. Garante que o item existe.
        // 2. Verifica se a data (item.data) existe como string válida.
        if (!item || typeof item.data !== 'string' || item.data.length < 10) return;

        // Usa apenas a data (ignora o tempo)
        const dateKey = item.data.substring(0, 10);

        if (!map.has(dateKey)) {
            map.set(dateKey, { entrada: 0, saida: 0 });
        }

        const current = map.get(dateKey)!;

        // Garante que 'valor' é um número (lidando com strings e nulos)
        const valor = Number(item.valor) || 0;

        // Agrega com base no sinal "C" ou "D". Se o sinal não vier, infere pelo valor (positivo = Entrada)
        const sinal = item.sinal || (valor >= 0 ? 'C' : 'D');


        if (sinal === 'C') {
            // Entrada: usa o valor (se for positivo, claro)
            current.entrada += Math.abs(valor);
        } else if (sinal === 'D') {

            current.saida += Math.abs(valor);
        }
    });

    // Converte o mapa de volta para um array ordenado
    const aggregated = Array.from(map.entries())
        .map(([date, values]) => ({
            data: date,
            entrada: values.entrada,
            saida: values.saida,
        }))
        // Ordena por data
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

    return aggregated;
}


// --- O Componente da Página ---
export default function DashboardPage() {
    // --- Estados ---
    // Garante que é sempre um array desde o início
    const [graficoRawData, setGraficoRawData] = useState<GraficoRawData[]>([]);
    const [entradasData, setEntradasData] = useState<ExtratoAgregado>({});
    const [saidasData, setSaidasData] = useState<ExtratoAgregado>({});
    const [isLoading, setIsLoading] = useState(true);

    // --- Agregação de Dados (useMemo) ---
    const graficoAgregado = useMemo(() => {
        // Verifica se graficoRawData é um array e não está vazio
        if (graficoRawData.length === 0) return [];
        return aggregateData(graficoRawData);
    }, [graficoRawData]);


    // --- Busca de Dados (useEffect) ---
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const [resGrafico, resEntradas, resSaidas] = await Promise.all([
                    api.get("/extrato/grafico"), // Espera uma lista PLANA de lançamentos
                    api.get("/extrato/entradas"),
                    api.get("/extrato/saidas"),
                ]);

                // 2. Logs para depuração (verifique seu console)
                console.log("Lançamentos Brutos (Gráfico):", resGrafico.data);

                // 3. Guarda os dados brutos para o useMemo agregar e os dados dos Cards
                // Supondo que a API retorna um array direto, ou um objeto com a chave 'extratos'
                const rawExtratos = Array.isArray(resGrafico.data) ? resGrafico.data : resGrafico.data.extratos || [];
                setGraficoRawData(rawExtratos);
                setEntradasData(resEntradas.data);
                setSaidasData(resSaidas.data);

            } catch (error: any) {
                console.error("ERRO AO BUSCAR DADOS:", error);

                // Se o erro for 404 (Not Found), avisa o usuário que as rotas estão faltando no backend
                if (error.response && error.response.status === 404) {
                    toast.error("Rotas /entradas ou /saidas não encontradas no backend (Erro 404).");
                } else if (error.response && error.response.status === 401) {
                    toast.error("Sessão expirada. Faça o login novamente.");
                } else {
                    toast.error("Não foi possível carregar os dados.");
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    // --- Lógica para os Cards ---
    const totalEntradas = entradasData?.totalEntradas || 0;
    const totalSaidas = saidasData?.totalSaidas || 0;
    const saldoAtual = totalEntradas - totalSaidas;

    // --- Renderização (JSX) ---
    return (
        <div className="space-y-6">

            {/* Seção de Cards (AGORA DINÂMICOS) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 shadow rounded-lg">
                    <h3 className="font-bold text-green-600">Total Entradas</h3>
                    <p className="text-2xl">
                        {isLoading ? "Carregando..." : formatCurrency(totalEntradas)}
                    </p>
                </div>
                <div className="bg-white p-4 shadow rounded-lg">
                    <h3 className="font-bold text-red-600">Total Saídas</h3>
                    <p className="text-2xl">
                        {isLoading ? "Carregando..." : formatCurrency(totalSaidas)}
                    </p>
                </div>
                <div className="bg-white p-4 shadow rounded-lg">
                    <h3 className="font-bold text-blue-600">Saldo Atual</h3>
                    <p className="text-2xl">
                        {isLoading ? "Carregando..." : formatCurrency(saldoAtual)}
                    </p>
                </div>
            </div>

            {/* Seção do Gráfico */}
            <div className="bg-white p-4 shadow rounded-lg h-96 flex flex-col">

                <h3 className="font-bold mb-4">Visão Geral (Balanço por Dia)</h3>

                <div className="flex-1">

                    {isLoading ? (
                        <p className="text-center py-10">Carregando dados...</p>
                    ) : (
                        // O gráfico agora recebe os dados AGREGADOS por dia
                        <GraficoFinanceiro data={graficoAgregado} />
                    )}

                </div>


            </div>

        </div>
    );
}
