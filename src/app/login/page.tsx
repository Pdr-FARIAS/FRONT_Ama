// app/login/page.tsx (ou onde sua página de login estiver)
"use client";

// 1. Importamos o 'useState' do React
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/authstore";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookies from 'js-cookie';

// --- Bloco 1: Schemas (Regras de Validação) ---

// Schema para o formulário de LOGIN
const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// Schema para o formulário de REGISTRO
// (Baseado no seu 'createUser' e 'RegistrarUser' que vimos antes)
const registerSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    agencia_conta: z.string().min(3, "Agência inválida"),
    numero_conta: z.string().min(3, "Conta inválida"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string()

}).refine(data => data.password === data.confirmPassword, {
    // Adiciona uma validação para "Confirmar Senha"
    message: "As senhas não coincidem",
    path: ["confirmPassword"], // Onde o erro deve aparecer
});

// --- Bloco 2: O Componente da Página ---

// Renomeei para 'AuthPage' (página de autenticação), pois agora faz as duas coisas
export default function AuthPage() {

    // Estado para controlar qual formulário mostrar: 'true' para Login, 'false' para Registro
    const [isLoginView, setIsLoginView] = useState(true);
    const setAuth = useAuthStore((s) => s.setAuth);

    // --- Bloco 3: Hooks de Formulário ---

    // Hook 'useForm' separado para o LOGIN
    const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit
    } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });

    // Hook 'useForm' separado para o REGISTRO
    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors } // Para mostrar erros de validação
    } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
    });

    // --- Bloco 4: Funções de Envio ---

    // Função de envio para LOGIN (seu código original)
    const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
        try {
            const res = await api.post("/user/login", data);
            setAuth(res.data.user, res.data.token);
            Cookies.remove('token');
            Cookies.set('token', res.data.token, { expires: (1 / 12), path: '/' });
            toast.success("Login realizado com sucesso!");
            window.location.href = "/dashboard";
        } catch (error) {
            toast.error("Falha ao logar. Verifique suas credenciais.");
        }
    };

    // Nova função de envio para REGISTRO
    const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
        try {
            // Removemos 'confirmPassword' antes de enviar ao backend
            const { confirmPassword, ...payload } = data;

            // Chama a rota '/user/register' que vimos no seu backend
            await api.post("/user/register", payload);

            toast.success("Usuário criado com sucesso! Por favor, faça o login.");
            setIsLoginView(true); // Envia o usuário de volta para a tela de login

        } catch (error: any) {
            console.error("Erro no registro:", error);
            // Mostra erros específicos do backend (ex: "E-mail já existe")
            toast.error(error.response?.data?.message || "Erro ao criar usuário.");
        }
    };

    // --- Bloco 5: O Visual (JSX) ---
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            {isLoginView ? (
                // --- Formulário de LOGIN (se isLoginView === true) ---
                <form
                    onSubmit={handleLoginSubmit(onLoginSubmit)}
                    className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4"
                >
                    <h1 className="text-2xl font-bold text-center">Entrar no Sistema</h1>
                    <div>
                        <label className="text-sm font-medium" htmlFor="login-email">E-mail</label>
                        <Input id="login-email" placeholder="seu@email.com" {...loginRegister("email")} />
                    </div>
                    <div>
                        <label className="text-sm font-medium" htmlFor="login-password">Senha</label>
                        <Input id="login-password" placeholder="Sua senha" type="password" {...loginRegister("password")} />
                    </div>
                    <Button className="w-full" type="submit">Entrar</Button>

                    {/* Link para alternar para a tela de Registro */}
                    <p className="text-sm text-center">
                        Não tem uma conta?{" "}
                        <Button variant="link" type="button" onClick={() => setIsLoginView(false)}>
                            Cadastre-se
                        </Button>
                    </p>
                </form>

            ) : (

                // --- Formulário de REGISTRO (se isLoginView === false) ---
                <form
                    onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                    className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4"
                >
                    <h1 className="text-2xl font-bold text-center">Criar Conta</h1>

                    <div>
                        <label className="text-sm font-medium" htmlFor="reg-name">Nome</label>
                        <Input id="reg-name" placeholder="Nome Completo" {...registerRegister("name")} />
                        {registerErrors.name && <p className="text-red-500 text-xs mt-1">{registerErrors.name.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium" htmlFor="reg-email">E-mail</label>
                        <Input id="reg-email" placeholder="seu@email.com" {...registerRegister("email")} />
                        {registerErrors.email && <p className="text-red-500 text-xs mt-1">{registerErrors.email.message}</p>}
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium" htmlFor="reg-agencia">Agência</label>
                            <Input id="reg-agencia" placeholder="Ex: 1234" {...registerRegister("agencia_conta")} />
                            {registerErrors.agencia_conta && <p className="text-red-500 text-xs mt-1">{registerErrors.agencia_conta.message}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium" htmlFor="reg-conta">Conta (com dígito)</label>
                            <Input id="reg-conta" placeholder="Ex: 56789-0" {...registerRegister("numero_conta")} />
                            {registerErrors.numero_conta && <p className="text-red-500 text-xs mt-1">{registerErrors.numero_conta.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium" htmlFor="reg-password">Senha</label>
                        <Input id="reg-password" placeholder="Mínimo 6 caracteres" type="password" {...registerRegister("password")} />
                        {registerErrors.password && <p className="text-red-500 text-xs mt-1">{registerErrors.password.message}</p>}
                        text       </div>

                    <div>
                        <label className="text-sm font-medium" htmlFor="reg-confirm">Confirmar Senha</label>
                        <Input id="reg-confirm" placeholder="Repita a senha" type="password" {...registerRegister("confirmPassword")} />
                        {registerErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{registerErrors.confirmPassword.message}</p>}
                    </div>

                    <Button className="w-full" type="submit">Criar Conta</Button>

                    {/* Link para alternar de volta para a tela de Login */}
                    <p className="text-sm text-center">
                        Já tem uma conta?{" "}
                        <Button variant="link" type="button" onClick={() => setIsLoginView(true)}>
                            Faça o login
                        </Button>
                    </p>
                </form>
            )}
        </div>
    );
}