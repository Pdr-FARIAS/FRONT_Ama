"use client";
import React, { useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose

} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Pencil } from 'lucide-react';
interface Extrato {
    extratoid: string;
    data_movimento: string;
    descricao: string;
    valorLancamento: number;
    sinal: 'C' | 'D';
}


interface EditExtratoModalProps {
    extrato: Extrato;
    onExtratoUpdated: () => void;
    children: ReactNode;
}

export function EditExtratoModal({ extrato, onExtratoUpdated, children }: EditExtratoModalProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [descricao, setDescricao] = useState(extrato.descricao);
    const [valor, setValor] = useState(String(extrato.valorLancamento));
    const [sinal, setSinal] = useState(extrato.sinal);


    const formatarDataParaInput = (dataISO: string) => {
        try {

            const data = new Date(dataISO);
            const dataLocal = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
            return dataLocal.toISOString().split('T')[0];
        } catch {
            return "";
        }
    };
    const [dataMovimento, setDataMovimento] = useState(formatarDataParaInput(extrato.data_movimento));


    useEffect(() => {
        if (isOpen) {
            setDescricao(extrato.descricao);
            setValor(String(extrato.valorLancamento));
            setSinal(extrato.sinal);
            setDataMovimento(formatarDataParaInput(extrato.data_movimento));
        }
    }, [isOpen, extrato]); // Depende do 'isOpen' e do 'extrato'

    // --- Envio da Atualização ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const valorNum = parseFloat(valor);
        if (isNaN(valorNum)) {
            toast.error("Valor inválido.");
            setIsSubmitting(false);
            return;
        }


        const payload = {
            valorLancamento: valorNum,
            sinal: sinal,
            descricao: descricao,
            data_movimento: new Date(dataMovimento).toISOString(),
        };

        try {

            await api.put(`/extrato/${extrato.extratoid}`, payload);

            toast.success("Lançamento atualizado com sucesso!");
            setIsOpen(false);
            // AVISA A PÁGINA (via Socket.io ou refetch)
            // O seu backend já emite "extrato:update", então o listener do socket na
            // página de extratos deve pegar isso. Chamamos 'onExtratoUpdated' por segurança
            // caso o socket falhe ou para forçar um refetch se necessário.
            onExtratoUpdated();

        } catch (error: any) {

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* O 'children' é o seu botão/item de menu com o ícone de lápis */}
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Editar Lançamento</DialogTitle>
                    <DialogDescription>
                        Ajuste os detalhes do lançamento financeiro.
                    </DialogDescription>
                </DialogHeader>

                {/* (Removemos o 'isLoadingData' pois estamos a passar os dados via props) */}
                <form onSubmit={handleSubmit} className="space-y-4 py-4">

                    <div className="space-y-2">
                        <Label htmlFor="descricao">Descrição</Label>
                        <Input
                            id="descricao"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="valor">Valor (R$)</Label>
                            <Input
                                id="valor"
                                type="number"
                                step="0.01"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sinal">Tipo</Label>
                            <Select onValueChange={(value: 'C' | 'D') => setSinal(value)} value={sinal}>
                                <SelectTrigger id="sinal">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="C">Entrada (C)</SelectItem>
                                    <SelectItem value="D">Saída (D)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="data_movimento">Data</Label>
                        <Input
                            id="data_movimento"
                            type="date"
                            value={dataMovimento}
                            onChange={(e) => setDataMovimento(e.target.value)}
                        />
                    </div>

                    {/* Botões */}
                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}