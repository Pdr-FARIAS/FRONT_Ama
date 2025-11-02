"use client";

import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    ReferenceLine // <-- NOVO: Para desenhar a linha do zero
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Interface para os dados que vêm da PÁGINA (page.tsx)
interface ChartProps {
    data: {
        data: string;
        entrada: number;
        saida: number;
    }[];
}

// Funções Auxiliares (mantidas)
const formatarDataX = (tickItem: string) => {
    try {
        return format(new Date(tickItem), "dd/MM", { locale: ptBR });
    } catch (e) {
        return "";
    }
};

const formatarValorTooltip = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// --- O Componente Principal do Gráfico ---
export function GraficoFinanceiro({ data }: ChartProps) {

    // 1. Prepara os dados para o BarChart (Calcula o BALANÇO e a Cor)
    const chartDataComBalanço = useMemo(() => {
        return data.map(item => {
            const balanco = item.entrada - item.saida;

            return {
                data: item.data,
                balanco: balanco,
                tipo: balanco >= 0 ? 'ganho' : 'gasto',
                entrada: item.entrada,
                saida: item.saida
            };
        });
    }, [data]);

    // 2. Calcula o valor MÁXIMO absoluto (para definir o domínio simétrico do Eixo Y)
    const yAxisMaxAbsoluto = useMemo(() => {
        let maxAbs = 0;

        chartDataComBalanço.forEach(item => {
            const abs = Math.abs(item.balanco);
            if (abs > maxAbs) {
                maxAbs = abs;
            }
        });

        // O domínio será de -maxAbs até +maxAbs, com uma margem de 10%
        const margem = maxAbs * 0.1;
        return maxAbs + margem;
    }, [chartDataComBalanço]);

    // Componente Tooltip Customizado
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;

            return (
                <div className="bg-white/90 p-2 border border-gray-200 rounded-md shadow-md text-sm">
                    <p className="font-bold text-gray-700 mb-1">{formatarDataX(label)}</p>
                    <p className="text-blue-600 font-bold">Balanço do Dia: {formatarValorTooltip(item.balanco)}</p>
                    <p className="text-green-600">Entrada: {formatarValorTooltip(item.entrada)}</p>
                    <p className="text-red-600">Saída: {formatarValorTooltip(item.saida)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* Container do Gráfico */}
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart
                        data={chartDataComBalanço}
                        // CORREÇÃO 1: Aumenta a margem esquerda para caber os rótulos
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        barCategoryGap="50%"
                    >
                        {/* Grade pontilhada (no fundo) */}
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="data"
                            tickFormatter={formatarDataX}
                            fontSize={12}

                            // Adicionamos um padding interno para compensar a margem esquerda
                            padding={{ left: 20, right: 20 }}

                            // 3. Removemos a linha do eixo X, pois vamos usar a ReferenceLine
                            axisLine={false}
                            tickLine={false}
                        />

                        {/* Eixo Y AGORA É SIMÉTRICO */}
                        <YAxis
                            fontSize={12}
                            tickFormatter={(val) => `R$${val.toLocaleString('pt-BR')}`}
                            domain={[-yAxisMaxAbsoluto, yAxisMaxAbsoluto]}
                            reversed={false}
                            allowDataOverflow={false}
                            // Move o Eixo Y para a esquerda extrema
                            axisLine={false}
                            tickLine={false}
                        />

                        {/* CORREÇÃO 2: Linha Central Forte */}
                        {/* Desenha uma linha de referência sólida no Y=0 */}
                        <ReferenceLine y={0} stroke="#4B5563" strokeWidth={2} />

                        <Tooltip content={<CustomTooltip />} />
                        <Legend />

                        {/* --- Renderiza UMA ÚNICA BARRA (o balanço) --- */}
                        <Bar dataKey="balanco" name="Balanço Líquido" barSize={50}>
                            {
                                chartDataComBalanço.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.tipo === 'ganho' ? '#82ca9d' : '#ff6b6b'}
                                    />
                                ))
                            }
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
