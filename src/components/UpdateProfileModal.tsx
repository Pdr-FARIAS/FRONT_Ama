"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authstore";
import Cookies from "js-cookie";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
function decodeJwtPayload(token: string): any | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}



const updateSchema = z.object({

    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),

    email: z.string().email("E-mail inválido"),

    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional().or(z.literal('')),


    agencia_conta: z.string().min(1, "A agência é obrigatória para cadastro.").optional().or(z.literal('')),
    numero_conta: z.string().min(1, "O número da conta é obrigatório.").optional().or(z.literal('')),
});
type UpdateFormData = z.infer<typeof updateSchema>;



interface UpdateProfileModalProps {
    children: React.ReactNode;
}

export function UpdateProfileModal({ children }: UpdateProfileModalProps) {

    const user = useAuthStore((state) => state.user);
    const setAuth = useAuthStore((state) => state.setAuth);

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);



    const getUserIdFromToken = (): number | null => {
        const token = Cookies.get('token');
        if (token) {
            const decoded = decodeJwtPayload(token);

            return decoded?.userId || null;
        }
        return null;
    };



    const form = useForm<UpdateFormData>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            agencia_conta: user?.agencia_conta || "",
            numero_conta: user?.numero_conta || "",
        },
        values: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            agencia_conta: user?.agencia_conta || "",
            numero_conta: user?.numero_conta || "",
        }
    });


    const onSubmit = async (data: UpdateFormData) => {

        const userId = getUserIdFromToken();
        if (!userId) {
            toast.error("Usuário não identificado. Faça o login novamente.");
            return;
        }

        setIsSubmitting(true);

        try {

            const initialPayload: Partial<UpdateFormData> = {};


            if (data.name) initialPayload.name = data.name;
            if (data.email) initialPayload.email = data.email;



            if (data.agencia_conta) initialPayload.agencia_conta = data.agencia_conta;
            if (data.numero_conta) initialPayload.numero_conta = data.numero_conta;


            if (data.password && data.password.length >= 6) {
                initialPayload.password = data.password;
            } else {

                delete initialPayload.password;
            }


            const { name, ...rest } = initialPayload;
            const payload = initialPayload;


            if (Object.keys(payload).length === 0) {
                toast.error("Nenhum campo para atualizar foi fornecido.");
                setIsSubmitting(false);
                return;
            }



            const res = await api.put(`/user`, payload);

            toast.success("Perfil atualizado com sucesso!");

            if (payload.password) {
                toast('Senha alterada! Faça o login novamente para confirmar.', { icon: '🔑' });

                Cookies.remove('token', { path: '/' });
                setAuth(null, null);
                window.location.href = "/login";
            } else {

                const currentToken = Cookies.get('token') || '';


                const updatedUser = {
                    ...user,
                    ...rest,
                    name: payload.user
                } as any;


                delete updatedUser.user;

                setAuth(currentToken, updatedUser);
                setOpen(false);
            }

        } catch (error) {
            console.error("Erro na atualização:", error);
            toast.error("Falha ao atualizar perfil. Verifique os dados.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                    <DialogDescription>
                        Atualize suas informações de conta, e-mail e senha.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Seu nome completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="seu@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <div className="grid grid-cols-2 gap-4">

                            <FormField
                                control={form.control}
                                name="agencia_conta"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Agência</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="numero_conta"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Conta</FormLabel>
                                        <FormControl>
                                            <Input placeholder="12345-6" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nova Senha (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Deixe em branco para não alterar"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Preencha apenas se quiser alterar sua senha.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
