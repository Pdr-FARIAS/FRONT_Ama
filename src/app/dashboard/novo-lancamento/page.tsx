"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api"; // Corrigido para alias
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

// Importa os componentes do Shadcn/UI
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Bloco 1: Schema de Validação (Obrigatório) ---
// Este schema usa os nomes de campos amigáveis do frontend.
const formSchema = z.object({
    descricao: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres."),
    valor: z.coerce.number().positive("O valor deve ser positivo."),
    tipo: z.enum(["C", "D"], { message: "Selecione o tipo." }),
    data_movimento: z.date({ message: "Selecione a data." }),
});

// --- Bloco 2: O Componente da Página ---
export default function NovoLancamentoPage() {
    // Utilizamos window.location para redirecionar de forma simples

    type FormSchema = z.infer<typeof formSchema>;

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            descricao: "",
            valor: undefined, // undefined para o campo de número iniciar vazio
            tipo: undefined, // undefined para o campo select iniciar com placeholder
            data_movimento: new Date(),
        },
    });


    // --- Bloco 3: Função de Envio (COM A TRADUÇÃO) ---
    async function onSubmit(data: FormSchema) {
        // Tradução do formato amigável (frontend) para o formato do backend (schema)
        const payloadParaBackend = {
            textoDescricaoHistorico: data.descricao,
            valorLancamento: data.valor,
            indicadorSinalLancamento: data.tipo,
            dataMovimento: data.data_movimento.toISOString(), // Converte Data para string
            dataLancamento: (new Date()).toISOString(), // Data atual do lançamento
        };

        try {
            console.log("📦 Dados (traduzidos) sendo enviados para o backend:", payloadParaBackend);
            await api.post("/extrato/manual", payloadParaBackend);

            toast.success("Lançamento manual salvo com sucesso!");
            // Redirecionamento simples sem usar 'useRouter'
            window.location.href = "/dashboard";

        } catch (error) {
            console.error("Erro ao salvar lançamento:", error);
            toast.error("Falha ao salvar. Verifique o console.");
        }
    }

    // --- Bloco 4: O Visual (JSX) ---
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Criar Novo Lançamento Manual</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Campo: Descrição */}
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
                            {/* Campo: Valor */}
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

                            {/* Campo: Tipo (Entrada/Saída) */}
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

                        {/* Campo: Data */}
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
                                        {/* Este é o conteúdo da caixa flutuante */}
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single" // Permite selecionar só um dia
                                                selected={field.value} // A data selecionada vem do 'field'
                                                onSelect={field.onChange} // Quando clica, atualiza o 'field'
                                                disabled={(date) => date > new Date()} // Desativa datas futuras
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* --- Botão de Envio --- */}
                        <Button type="submit" className="w-full">Salvar Lançamento</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
