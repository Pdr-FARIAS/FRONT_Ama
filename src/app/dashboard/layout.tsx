"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";

// Importações dos componentes do projeto
import { useAuthStore } from "@/store/authstore";
import { useAuthTimer } from "../../hooks/useAuthtimer"; // Caminho relativo para o hook
import { NavBar } from "@/components/NavBar"; // Importa a NavBar
import { Sidebar } from "@/components/sidebar"; // <-- ESSENCIAL: Importa a Sidebar

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { setAuth, user } = useAuthStore();

    const [isMounted, setIsMounted] = useState(false);

    // 1. CHAMA O HOOK DO TIMER: Inicia o monitoramento de expiração do JWT
    useAuthTimer();

    // 2. VERIFICAÇÃO INICIAL DE AUTENTICAÇÃO
    useEffect(() => {
        const storedToken = Cookies.get("token");

        setIsMounted(true);

        // Se não houver token, força a limpeza e redireciona
        if (!storedToken) {
            console.log("Sessão ausente ou expirada. Redirecionando para login.");
            setAuth(null, null);

            // Garante que o redirecionamento ocorre
            setTimeout(() => {
                router.push("/login");
            }, 50);
        }
    }, [router, setAuth]);

    // 3. Condição de Carregamento 
    const hasValidSession = !!Cookies.get("token");

    // Se ainda não montou no cliente OU a sessão é inválida, mostra o loading
    if (!isMounted || !hasValidSession) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl font-medium text-gray-700">Verificando sessão...</p>
            </div>
        );
    }

    // 4. Renderiza o Layout da Dashboard (Restaurada para incluir a Sidebar)
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* 1. BARRA DE NAVEGAÇÃO SUPERIOR (NavBar) - Fica no topo e ocupa a largura total */}
            <NavBar />

            {/* 2. CONTEÚDO PRINCIPAL: Estrutura Grid para Sidebar e Conteúdo */}
            <div className="flex flex-1 overflow-hidden">

                {/* A Sidebar fica à esquerda */}
                <Sidebar />

                {/* O conteúdo principal se expande para preencher o resto da tela */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
                    <main>{children}</main>
                </div>
            </div>

            <Toaster position="top-right" />
        </div>
    );
}
