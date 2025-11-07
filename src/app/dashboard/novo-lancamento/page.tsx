"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const formSchema = z.object({
    descricao: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres."),
    valor: z.coerce.number().positive("O valor deve ser positivo."),
    tipo: z.enum(["C", "D"], { message: "Selecione o tipo." }),
    data_movimento: z.date({ message: "Selecione a data." }),
});


export default function NovoLancamentoPage() {


    type FormSchema = z.infer<typeof formSchema>;

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            descricao: "",
            valor: undefined,
            tipo: undefined,
            data_movimento: new Date(),
        },
    });



    async function onSubmit(data: FormSchema) {

        const payloadParaBackend = {
            textoDescricaoHistorico: data.descricao,
            valorLancamento: data.valor,
            indicadorSinalLancamento: data.tipo,
            dataMovimento: data.data_movimento.toISOString(),
            dataLancamento: (new Date()).toISOString(),
        };

        try {
            console.log("📦 Dados (traduzidos) sendo enviados para o backend:", payloadParaBackend);
            await api.post("/extrato/manual", payloadParaBackend);

            toast.success("Lançamento manual salvo com sucesso!");

            window.location.href = "/dashboard";

        } catch (error) {
            console.error("Erro ao salvar lançamento:", error);
            toast.error("Falha ao salvar. Verifique o console.");
        }
    }


    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Criar Novo Lançamento Manual</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Salário, Conta de Luz" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">

                            <FormField
                                control={form.control}
                                name="valor"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Valor (R$)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="150.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="tipo"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Tipo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="C">Entrada (Crédito)</SelectItem>
                                                <SelectItem value="D">Saída (Débito)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <FormField
                            control={form.control}
                            name="data_movimento"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Data do Lançamento</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
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
                                                disabled={(date) => date > new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <Button type="submit" className="w-full">Salvar Lançamento</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
