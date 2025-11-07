"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { GraficoFinanceiro } from "@/components/GraficoFinanceiro";
import { socket } from "@/lib/socket";
import ExtratoStatus from "@/components/ExtratoStatus";



interface GraficoRawData {
    data: string | Date;
    entrada: number;
    saida: number;
}

interface ExtratoAgregado {
    totalEntradas?: number;
    totalSaidas?: number;
    quantidade?: number;
    detalhes?: any[];
}

function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export default function DashboardPage() {
    const [graficoRawData, setGraficoRawData] = useState<GraficoRawData[]>([]);
    const [entradasData, setEntradasData] = useState<ExtratoAgregado>({});
    const [saidasData, setSaidasData] = useState<ExtratoAgregado>({});
    const [isLoading, setIsLoading] = useState(true);
    const [statusExtrato, setStatusExtrato] = useState<string>("");


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [resGrafico, resEntradas, resSaidas] = await Promise.all([
                api.get("/extrato/grafico"),
                api.get("/extrato/entradas"),
                api.get("/extrato/saidas"),
            ]);

            const rawExtratos = Array.isArray(resGrafico.data)
                ? resGrafico.data
                : resGrafico.data.dados || [];

            setGraficoRawData(rawExtratos);
            setEntradasData(resEntradas.data);
            setSaidasData(resSaidas.data);
        } catch (error) {
            console.error("ERRO AO BUSCAR DADOS:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {

        function onExtratoStatus(info: any) {
            console.log("📡 STATUS:", info);
            setStatusExtrato(info.etapa || info.status);
        }

        socket.on("extrato_status", onExtratoStatus);


        function onNovoLancamento() {
            toast.success("Novo lançamento recebido! Atualizando...");
            fetchData();
        }

        function onAtualizarGrafico(payload: any) {
            console.log("📊 Atualização do gráfico recebida:", payload);

            if (Array.isArray(payload.dados)) {
                setGraficoRawData(payload.dados);
            }

            if (payload.resumoEntradas) {
                setEntradasData(payload.resumoEntradas);
            }

            if (payload.resumoSaidas) {
                setSaidasData(payload.resumoSaidas);
            }
        }

        socket.on("extrato:create", onNovoLancamento);
        socket.on("atualizar_grafico", onAtualizarGrafico);

        return () => {
            socket.off("extrato:create", onNovoLancamento);
            socket.off("atualizar_grafico", onAtualizarGrafico);
            socket.off("extrato_status", onExtratoStatus);
        };
    }, [fetchData]);

    const totalEntradas = entradasData?.totalEntradas || 0;
    const totalSaidas = saidasData?.totalSaidas || 0;
    const saldoAtual = totalEntradas - totalSaidas;

    return (
        <div className="space-y-6">
            {statusExtrato && (
                <ExtratoStatus step={statusExtrato} />
            )}

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


            <div className="bg-white p-4 shadow rounded-lg h-96 flex flex-col">
                <h3 className="font-bold mb-4">Visão Geral (Balanço por Dia)</h3>
                <div className="flex-1">
                    {isLoading ? (
                        <p className="text-center py-10">Carregando dados...</p>
                    ) : (
                        <GraficoFinanceiro data={graficoRawData} />
                    )}
                </div>
            </div>
        </div>
    );
}
