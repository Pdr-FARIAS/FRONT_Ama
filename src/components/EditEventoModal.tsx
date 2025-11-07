"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";


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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
const formSchema = z.object({
    titulo: z.string().min(5, "O título deve ter pelo menos 5 caracteres."),
    descriçao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
    data_termino: z.date({
        required_error: "A data de término é obrigatória.",
    }),
    imageUrl: z.string().url("Deve ser uma URL válida (ex: http://...)").optional().or(z.literal('')),
});


interface EditEventoModalProps {
    eventoId: string;
    children: React.ReactNode;
    onEventUpdated: () => void;
}

export function EditEventoModal({ eventoId, children, onEventUpdated }: EditEventoModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            titulo: "",
            descriçao: "",
            imageUrl: "",
        },
    });


    useEffect(() => {
        if (open) {
            const fetchEventData = async () => {
                setIsLoading(true);
                try {
                    const response = await api.get(`/evento/${eventoId}`);
                    const evento = response.data;


                    form.reset({
                        titulo: evento.titulo,
                        descriçao: evento.descriçao,
                        imageUrl: evento.image || "",

                        data_termino: parseISO(evento.data_termino),
                    });

                } catch (error) {
                    console.error("Erro ao buscar dados do evento:", error);
                    toast.error("Não foi possível carregar os dados para edição.");
                    setOpen(false);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchEventData();
        }
    }, [open, eventoId, form]);


    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);


        const payload = {
            ...data,

            data_termino: format(data.data_termino, 'yyyy-MM-dd'),
            image: data.imageUrl || null,
        };


        delete (payload as any).imageUrl;


        try {

            await api.put(`/evento/${eventoId}`, payload);
            toast.success("Evento atualizado com sucesso!");

            setOpen(false);
            onEventUpdated();
        } catch (error) {
            console.error("Erro ao atualizar evento:", error);
            toast.error("Falha ao atualizar o evento.");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Evento</DialogTitle>
                    <DialogDescription>
                        Modifique os detalhes do evento abaixo.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
                        <span>Carregando dados...</span>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">


                            <FormField
                                control={form.control}
                                name="titulo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título do Evento</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Título do evento" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="descriçao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descreva o evento..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


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

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}

