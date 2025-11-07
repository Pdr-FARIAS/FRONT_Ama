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
import { Loader2 } from 'lucide-react';

interface EditRegistroModalProps {
    registroId: number;
    onRegisterUpdated: () => void;
    children: ReactNode;
}


interface RegistroFormData {
    nome: string;
    sobrenome: string;
    responsavel: string;
    idade: string;
    idade_responsavel: string;


    endereco: {
        lote: string | null;
        numero: string | null;
        quadra: string | null;
        bairro: string | null;
        referencia: string | null;
    };

}


const initialState: RegistroFormData = {
    nome: "",
    sobrenome: "",
    responsavel: "",
    idade: "",
    idade_responsavel: "",
    endereco: {
        lote: "",
        numero: "",
        quadra: "",
        bairro: "",
        referencia: "",
    }
};

export function EditRegistroModal({ registroId, onRegisterUpdated, children }: EditRegistroModalProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<RegistroFormData>(initialState);


    useEffect(() => {

        if (isOpen && registroId) {



            const fetchRegistroData = async () => {
                setIsLoadingData(true);
                try {
                    const response = await api.get(`/registro/${registroId}`);
                    const data = response.data;
                    setFormData({
                        nome: data.nome || "",
                        sobrenome: data.sobrenome || "",
                        responsavel: data.responsavel || "",
                        idade: String(data.idade || ""),
                        idade_responsavel: String(data.idade_responsavel || ""),
                        endereco: {
                            lote: data.endereço?.lote || "",
                            numero: data.endereço?.numero || "",
                            quadra: data.endereço?.quadra || "",
                            bairro: data.endereço?.bairro || "",
                            referencia: data.endereço?.referencia || "",
                        }
                    });

                } catch (error) {
                    console.error("Erro ao buscar dados do registro:", error);
                    toast.error("Falha ao carregar dados do registro.");
                    setIsOpen(false);
                } finally {
                    setIsLoadingData(false);
                }
            };

            fetchRegistroData();
        }
    }, [isOpen, registroId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            endereco: {
                ...prev.endereco,
                [name]: value || null
            }
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);


        const idadeNum = parseInt(formData.idade, 10);
        const idadeResponsavelNum = parseInt(formData.idade_responsavel, 10);

        if (isNaN(idadeNum) || isNaN(idadeResponsavelNum)) {
            toast.error("Idades devem ser números válidos.");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            ...formData,
            idade: idadeNum,
            idade_responsavel: idadeResponsavelNum,
        };
        try {
            await api.put(`/registro/${registroId}`, payload);

            toast.success("Registro atualizado com sucesso!");
            setIsOpen(false);
            onRegisterUpdated();

        } catch (error: any) {
            console.error("Erro ao atualizar registro:", error);
            toast.error(error.response?.data?.message || "Falha ao atualizar registro.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                    <DialogTitle>Editar Registro</DialogTitle>
                    <DialogDescription>
                        Atualize os dados do registro. Clique em salvar quando terminar.
                    </DialogDescription>
                </DialogHeader>


                {isLoadingData ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">


                        <h4 className="text-sm font-medium border-b pb-1">Dados Pessoais</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome</Label>
                                <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sobrenome">Sobrenome</Label>
                                <Input id="sobrenome" name="sobrenome" value={formData.sobrenome} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="idade">Idade</Label>
                            <Input id="idade" name="idade" type="number" value={formData.idade} onChange={handleChange} />
                        </div>


                        <h4 className="text-sm font-medium border-b pb-1 pt-2">Responsável</h4>
                        <div className="space-y-2">
                            <Label htmlFor="responsavel">Nome do Responsável</Label>
                            <Input id="responsavel" name="responsavel" value={formData.responsavel} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="idade_responsavel">Idade do Responsável</Label>
                            <Input id="idade_responsavel" name="idade_responsavel" type="number" value={formData.idade_responsavel} onChange={handleChange} />
                        </div>


                        <h4 className="text-sm font-medium border-b pb-1 pt-2">Endereço</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="lote">Lote</Label>
                                <Input id="lote" name="lote" value={formData.endereco.lote || ''} onChange={handleEnderecoChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quadra">Quadra</Label>
                                <Input id="quadra" name="quadra" value={formData.endereco.quadra || ''} onChange={handleEnderecoChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="numero">Número</Label>
                                <Input id="numero" name="numero" value={formData.endereco.numero || ''} onChange={handleEnderecoChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bairro">Bairro</Label>
                            <Input id="bairro" name="bairro" value={formData.endereco.bairro || ''} onChange={handleEnderecoChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="referencia">Ponto de Referência</Label>
                            <Input id="referencia" name="referencia" value={formData.endereco.referencia || ''} onChange={handleEnderecoChange} />
                        </div>


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
                )}
            </DialogContent>
        </Dialog>
    );
}