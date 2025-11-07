"use client";

import { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Cell,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { LineChartIcon, BarChart3Icon } from "lucide-react";

interface ChartProps {
    data: {
        data: string;
        entrada: number;
        saida: number;
    }[];
}

export function GraficoFinanceiro({ data }: ChartProps) {

    const [modo, setModo] = useState<"barras" | "linha">("barras");
    const chartDataComBalanço = useMemo(() => {
        return data.map((item) => {
            const balanco = item.entrada - item.saida;
            return {
                data: item.data,
                entrada: item.entrada,
                saida: item.saida,
                balanco,
                tipo: balanco >= 0 ? "ganho" : "gasto",
            };
        });
    }, [data]);

    const formatarDataX = (tickItem: string) => {
        try {
            return format(new Date(tickItem), "dd/MM", { locale: ptBR });
        } catch {
            return "";
        }
    };

    const formatarValorTooltip = (value: number) =>
        value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-white/90 p-2 border border-gray-200 rounded-md shadow-md text-sm">
                    <p className="font-bold text-gray-700 mb-1">{formatarDataX(label)}</p>
                    <p className="text-blue-600 font-bold">
                        Balanço do Dia: {formatarValorTooltip(item.balanco)}
                    </p>
                    <p className="text-green-600">
                        Entrada: {formatarValorTooltip(item.entrada)}
                    </p>
                    <p className="text-red-600">
                        Saída: {formatarValorTooltip(item.saida)}
                    </p>
                </div>
            );
        }
        return null;
    };


    const yMax = useMemo(() => {
        const max = Math.max(
            ...chartDataComBalanço.map((d) => Math.abs(d.balanco) || 0)
        );
        return max * 1.1;
    }, [chartDataComBalanço]);

    return (
        <div className="flex flex-col h-full w-full">

            <div className="flex justify-end mb-3">
                <Button
                    variant="outline"
                    onClick={() =>
                        setModo((prev) => (prev === "barras" ? "linha" : "barras"))
                    }
                    className="flex items-center gap-2"
                >
                    {modo === "barras" ? (
                        <>
                            <LineChartIcon className="w-4 h-4" />
                            Ver como linha
                        </>
                    ) : (
                        <>
                            <BarChart3Icon className="w-4 h-4" />
                            Ver como barras
                        </>
                    )}
                </Button>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                {modo === "barras" ? (
                    <BarChart
                        data={chartDataComBalanço}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        barCategoryGap="40%"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="data"
                            tickFormatter={formatarDataX}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={(val) => `R$${val.toLocaleString("pt-BR")}`}
                            domain={[-yMax, yMax]}
                            tickLine={false}
                        />
                        <ReferenceLine y={0} stroke="#4B5563" strokeWidth={2} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="balanco" name="Balanço Líquido" barSize={50}>
                            {chartDataComBalanço.map((entry, i) => (
                                <Cell
                                    key={i}
                                    fill={entry.tipo === "ganho" ? "#82ca9d" : "#ff6b6b"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                ) : (
                    <LineChart
                        data={chartDataComBalanço}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="data"
                            tickFormatter={formatarDataX}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={(val) => `R$${val.toLocaleString("pt-BR")}`}
                            domain={[-yMax, yMax]}
                            tickLine={false}
                        />
                        <ReferenceLine y={0} stroke="#4B5563" strokeWidth={2} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="balanco"
                            name="Balanço Líquido"
                            stroke="#2563EB"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
