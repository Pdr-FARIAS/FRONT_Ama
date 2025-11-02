"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api"; // Assumindo alias
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authstore";
import Cookies from "js-cookie";

// Componentes Shadcn/UI
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


// --- Função para Decodificar JWT (Fallback Customizado) ---
// Usada para obter o userId do Cookie em caso de dessincronização da store.
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


// --- Bloco 1: Schema de Validação ---
const updateSchema = z.object({
    // O nome é obrigatório
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
    // O e-mail é obrigatório e deve ser válido
    email: z.string().email("E-mail inválido"),
    // Senha é opcional para a atualização
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional().or(z.literal('')),

    // Contas bancárias
    agencia_conta: z.string().min(1, "A agência é obrigatória para cadastro.").optional().or(z.literal('')),
    numero_conta: z.string().min(1, "O número da conta é obrigatório.").optional().or(z.literal('')),
});
type UpdateFormData = z.infer<typeof updateSchema>;


// --- Bloco 2: O Componente Modal (Conteúdo) ---
interface UpdateProfileModalProps {
    children: React.ReactNode;
}

export function UpdateProfileModal({ children }: UpdateProfileModalProps) {
    // Leitura da store
    const user = useAuthStore((state) => state.user);
    const setAuth = useAuthStore((state) => state.setAuth);

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // --- NOVO: Função para obter o userId do token ---
    const getUserIdFromToken = (): number | null => {
        const token = Cookies.get('token');
        if (token) {
            const decoded = decodeJwtPayload(token);
            // Assumimos que o backend usa 'userId' como chave
            return decoded?.userId || null;
        }
        return null;
    };


    // 3. Configuração do Formulário
    const form = useForm<UpdateFormData>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            agencia_conta: user?.agencia_conta || "",
            numero_conta: user?.numero_conta || "",
        },
        // Re-inicia os valores sempre que o modal abre (para pegar novos dados da store)
        // Usar 'values' faz com que o formulário se sincronize com a store.
        values: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            agencia_conta: user?.agencia_conta || "",
            numero_conta: user?.numero_conta || "",
        }
    });

    // 4. Função de Envio (PUT /user)
    const onSubmit = async (data: UpdateFormData) => {
        // Obtenção do ID (usado para o path, mas agora é o ID do token para o backend)
        const userId = getUserIdFromToken();
        if (!userId) {
            toast.error("Usuário não identificado. Faça o login novamente.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Constrói o payload de forma segura
            const initialPayload: Partial<UpdateFormData> = {};

            // Adiciona name (será renomeado para 'user') e email se eles existirem
            // Correção: Garante que 'name' e 'email' sempre vão para o payload
            if (data.name) initialPayload.name = data.name;
            if (data.email) initialPayload.email = data.email;


            // Adiciona os outros campos SE eles tiverem valor
            if (data.agencia_conta) initialPayload.agencia_conta = data.agencia_conta;
            if (data.numero_conta) initialPayload.numero_conta = data.numero_conta;

            // Adiciona a senha apenas se ela foi digitada
            if (data.password && data.password.length >= 6) {
                initialPayload.password = data.password;
            } else {
                // Se a senha estiver vazia, removemos a chave para o backend não tentar criptografar ""
                delete initialPayload.password;
            }

            // 2. CORREÇÃO DE NOME: Renomear 'name' para 'user' (o que o backend espera)
            // Extrai 'name' e o renomeia para 'user' no payload final
            const { name, ...rest } = initialPayload;
            const payload = initialPayload;

            // Se o payload for vazio (apenas 'password' e estava vazio)
            if (Object.keys(payload).length === 0) {
                toast.error("Nenhum campo para atualizar foi fornecido.");
                setIsSubmitting(false);
                return;
            }


            // 3. Envia o PUT
            const res = await api.put(`/user`, payload);

            toast.success("Perfil atualizado com sucesso!");

            // 4. Lógica de reautenticação/atualização da store
            if (payload.password) { // Se a senha foi alterada
                toast('Senha alterada! Faça o login novamente para confirmar.', { icon: '🔑' });

                Cookies.remove('token', { path: '/' });
                setAuth(null, null);
                window.location.href = "/login";
            } else {
                // ATENÇÃO: CORREÇÃO DA STORE
                const currentToken = Cookies.get('token') || '';

                // Cria o novo objeto User, mapeando 'user' (do payload) de volta para 'name'
                const updatedUser = {
                    ...user,
                    ...rest,
                    name: payload.user // Sobrescreve 'name' com o novo nome
                } as any;

                // Remove a chave 'user' que só existe no payload, mas não na store User interface
                delete updatedUser.user;

                setAuth(currentToken, updatedUser);
                setOpen(false); // Fecha o modal
            }

        } catch (error) {
            console.error("Erro na atualização:", error);
            toast.error("Falha ao atualizar perfil. Verifique os dados.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. Renderização (JSX)
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

                        {/* Campos do formulário... */}
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

                        {/* Campo: E-mail */}
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

                        {/* Contas (Agrupamento) */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Campo: Agência */}
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

                            {/* Campo: Conta */}
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


                        {/* Campo: Senha (Opcional) */}
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
