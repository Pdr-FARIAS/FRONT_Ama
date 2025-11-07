"use client";

import React, { useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { socket } from "@/lib/socket"


import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";


export default function RegistroEventoPage() {

    const params = useParams();
    const router = useRouter();


    const eventoidStr = params.id as string;


    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [responsavel, setResponsavel] = useState("");
    const [idade, setIdade] = useState("");
    const [idadeResponsavel, setIdadeResponsavel] = useState("");


    const [lote, setLote] = useState("");
    const [numero, setNumero] = useState("");
    const [quadra, setQuadra] = useState("");
    const [bairro, setBairro] = useState("");
    const [referencia, setReferencia] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        const idadeNum = parseInt(idade, 10);
        const idadeResponsavelNum = parseInt(idadeResponsavel, 10);
        const eventoidNum = parseInt(eventoidStr, 10);

        if (isNaN(idadeNum) || idadeNum <= 0 || isNaN(idadeResponsavelNum) || idadeResponsavelNum <= 0) {
            toast.error("Idade e Idade do Responsável devem ser números válidos.");
            return;
        }

        if (isNaN(eventoidNum)) {
            toast.error("Erro: ID do evento inválido. Volte para a página inicial e tente novamente.");
            return;
        }

        setIsLoading(true);

        const payload = {
            nome,
            sobrenome,
            responsavel,
            idade: idadeNum,
            idade_responsavel: idadeResponsavelNum,
            eventoid: eventoidNum,


            enderecoid: undefined,

            endereco: {
                lote: lote || undefined,
                numero: numero || undefined,
                quadra: quadra || undefined,
                bairro: bairro || undefined,
                referencia: referencia || undefined,
            }
        };


        try {

            await api.post("/registro/registro", payload);
            socket.emit("registro:create");
            toast.success("Inscrição realizada com sucesso!");
            setIsSuccess(true);

        } catch (error: any) {
            console.error("Erro ao registrar:", error);
            if (error.response?.status === 404) {
                toast.error("Erro 404: Rota de registro não encontrada no backend.");
            } else if (error.response?.data?.message) {
                toast.error(`Erro: ${error.response.data.message}`);
            } else {
                toast.error("Falha ao realizar inscrição. Verifique os dados.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex justify-center items-center py-20 bg-gray-900 min-h-screen">
                <Card className="w-full max-w-lg text-center p-8 bg-gray-800 text-white border-gray-700">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <CardTitle className="text-2xl mb-2">Inscrição Realizada!</CardTitle>
                    <CardDescription className="text-gray-300">
                        Sua inscrição no evento foi confirmada. Obrigado por participar!
                    </CardDescription>
                    <CardFooter className="mt-6">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => router.push('/')}
                        >
                            Voltar para a Página Inicial
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }


    return (
        <div className="flex justify-center py-12 px-4 bg-gray-900 text-white min-h-screen">
            <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-white">Inscrição no Evento</CardTitle>
                    <CardDescription className="text-gray-300">
                        Preencha seus dados para garantir sua vaga no evento.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">


                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 text-white">Dados Pessoais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nome" className="text-gray-300">Nome</Label>
                                    <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required
                                        className="bg-gray-700 border-gray-600 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sobrenome" className="text-gray-300">Sobrenome</Label>
                                    <Input id="sobrenome" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} required
                                        className="bg-gray-700 border-gray-600 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="idade" className="text-gray-300">Idade</Label>
                                <Input id="idade" type="number" value={idade} onChange={(e) => setIdade(e.target.value)} required
                                    className="bg-gray-700 border-gray-600 text-white" />
                            </div>
                        </div>


                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 text-white">Dados do Responsável</h3>
                            <div className="space-y-2">
                                <Label htmlFor="responsavel" className="text-gray-300">Nome do Responsável</Label>
                                <Input id="responsavel" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} required
                                    className="bg-gray-700 border-gray-600 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="idadeResponsavel" className="text-gray-300">Idade do Responsável</Label>
                                <Input id="idadeResponsavel" type="number" value={idadeResponsavel} onChange={(e) => setIdadeResponsavel(e.target.value)} required
                                    className="bg-gray-700 border-gray-600 text-white" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 text-white">Endereço (Opcional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lote" className="text-gray-300">Lote</Label>
                                    <Input id="lote" value={lote} onChange={(e) => setLote(e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quadra" className="text-gray-300">Quadra</Label>
                                    <Input id="quadra" value={quadra} onChange={(e) => setQuadra(e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="numero" className="text-gray-300">Número</Label>
                                    <Input id="numero" value={numero} onChange={(e) => setNumero(e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bairro" className="text-gray-300">Bairro</Label>
                                <Input id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="referencia" className="text-gray-300">Ponto de Referência</Label>
                                <Input id="referencia" value={referencia} onChange={(e) => setReferencia(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white" />
                            </div>
                        </div>


                        <CardFooter className="px-0 pt-6 flex justify-end gap-4">
                            <Button variant="ghost" type="button" onClick={() => router.push('/')} className="text-gray-300 hover:bg-gray-700 hover:text-white">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Realizar Inscrição"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}