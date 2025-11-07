
"use client";


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


const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});


const registerSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    agencia_conta: z.string().min(3, "Agência inválida"),
    numero_conta: z.string().min(3, "Conta inválida"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string()

}).refine(data => data.password === data.confirmPassword, {

    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export default function AuthPage() {


    const [isLoginView, setIsLoginView] = useState(true);
    const setAuth = useAuthStore((s) => s.setAuth);

    const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit
    } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });


    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors }
    } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
    });




    const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
        try {
            const res = await api.post("/user/login", data);
            setAuth(res.data.user, res.data.token);
            Cookies.remove('token');
            Cookies.set('token', res.data.token, { expires: (1 / 12), path: '/' });
            toast.success("Login realizado com sucesso!");
            await api.get("/extrato/sincronizar");
            window.location.href = "/dashboard";
        } catch (error) {
            toast.error("Falha ao logar. Verifique suas credenciais.");
        }
    };


    const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
        try {

            const { confirmPassword, ...payload } = data;

            await api.post("/user/register", payload);

            toast.success("Usuário criado com sucesso! Por favor, faça o login.");
            setIsLoginView(true);

        } catch (error: any) {
            console.error("Erro no registro:", error);

            toast.error(error.response?.data?.message || "Erro ao criar usuário.");
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            {isLoginView ? (

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


                    <p className="text-sm text-center">
                        Não tem uma conta?{" "}
                        <Button variant="link" type="button" onClick={() => setIsLoginView(false)}>
                            Cadastre-se
                        </Button>
                    </p>
                </form>

            ) : (


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