"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns"; // Importamos 'format'
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

// Componentes Shadcn/UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// --- Bloco 1: Schema de Validação (Frontend) ---
const formSchema = z.object({
    titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
    descriçao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
    data_termino: z.date({
        required_error: "A data de término é obrigatória.",
    }),
    imageUrl: z.string().url("Deve ser uma URL válida (ex: http://...)").optional().or(z.literal('')),
});

// --- Bloco 2: O Componente da Página ---
export default function CriarEventoPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Configuração do Formulário
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            titulo: "",
            descriçao: "",
            data_termino: new Date(),
            imageUrl: "",
        },
    });

    // --- Bloco 3: Função de Envio (onSubmit) CORRIGIDA ---
    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        // 1. Formata a data para "AAAA-MM-DD"
        const dataFormatada = format(data.data_termino, 'yyyy-MM-dd');

        // 2. CORREÇÃO: Cria o payload "PLANO" (FLAT)
        // Removemos o "body: { ... }" que estava causando o erro de validação
        const payloadParaBackend = {
            titulo: data.titulo,
            descriçao: data.descriçao,
            data_termino: dataFormatada, // Formato YYYY-MM-DD (string)
            imagem: data.imageUrl || undefined, // Envia 'undefined' se for ""
        };

        try {
            // 3. Envia o payload plano
            await api.post("/evento", payloadParaBackend);

            toast.success("Evento criado com sucesso!");

            window.location.href = "/dashboard";

        } catch (error: any) {
            console.error("Erro ao criar evento:", error);

            // Captura erros de validação do Zod (400) do backend
            if (error.response && error.response.status === 400) {
                toast.error("Dados inválidos. Verifique o formulário.");
            } else {
                toast.error("Falha ao criar o evento. Tente novamente.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    // 4. O Visual (JSX)
    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Criar Novo Evento</CardTitle>
                <CardDescription>
                    Preencha os detalhes abaixo para registrar um novo evento financeiro.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Campo: Título */}
                        <FormField
                            control={form.control}
                            name="titulo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título do Evento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Pagamento de Fornecedores, Bônus Trimestral" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Descrição */}
                        <FormField
                            control={form.control}
                            name="descriçao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descreva o propósito deste evento..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Data de Término */}
                        <FormField
                            control={form.control}
                            name="data_termino"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Data de Término</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: ptBR })
                                                    ) : (
                                                        <span>Selecione a data</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo: URL da Imagem (Opcional) */}
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL da Imagem (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="http://exemplo.com/imagem.png" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar Evento"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

