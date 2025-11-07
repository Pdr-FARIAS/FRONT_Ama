"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Circle, CheckCircle2, Loader2 } from "lucide-react";

interface Props {
    step?: string;
}

export default function ExtratoStatus({ step }: Props) {
    if (!step) return null;

    const progressSteps = [
        "🔍 Iniciando busca de extrato...",
        "✅ Token do Banco do Brasil obtido com sucesso.",
        "🏦 Consultando API BB",
        "💾 Lançamentos salvos com sucesso no banco.",
        "✅ Processo de busca e salvamento concluído!"
    ];

    const currentIndex = progressSteps.findIndex((s) => step.includes(s.split(" ")[0]));
    const progressPercent = ((currentIndex + 1) / progressSteps.length) * 100;

    return (
        <AnimatePresence>
            <motion.div
                key={step}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="p-4 bg-white shadow-lg border border-gray-200 rounded-xl space-y-3"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {step.includes("processando") && (
                            <Loader2 className=" animate-spin text-blue-500 w-5 h-5" />
                        )}
                        {step.includes("ok") && (
                            <CheckCircle2 className="text-green-600 w-5 h-5" />
                        )}
                        {step.includes("Erro") && (
                            <Circle className="text-red-600 w-5 h-5" />
                        )}

                        <p className="font-medium text-gray-700">{step}</p>
                    </div>
                </div>


                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                        className="bg-blue-600 h-2.5"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>

                <div className="text-xs text-gray-500">
                    {Math.round(progressPercent)}% concluído
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
