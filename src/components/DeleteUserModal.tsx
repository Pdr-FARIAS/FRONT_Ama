"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authstore';
import Cookies from 'js-cookie';


// Componentes Shadcn/UI
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

// --- Função Auxiliar para Decodificar JWT (para obter o ID) ---
function decodeJwtPayload(token: string): any | null {
    try {
        // Usamos o decode simples que não requer imports extras e que funciona em ambiente web
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


// --- O Componente Modal de Exclusão ---

interface DeleteUserModalProps {
    children: React.ReactNode; // O gatilho que abre o modal (DropdownMenuItem)
}

export function DeleteUserModal({ children }: DeleteUserModalProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const setAuth = useAuthStore((s) => s.setAuth);

    // Função para obter o userId do token (fonte mais confiável)
    const getUserIdFromToken = (): number | null => {
        const token = Cookies.get('token');
        if (token) {
            const decoded = decodeJwtPayload(token);
            // Assumimos que o backend usa 'userId' como chave no JWT
            return decoded?.userId || null;
        }
        return null;
    };

    const handleDelete = async () => {
        const userId = getUserIdFromToken();

        if (!userId) {
            toast.error("Sessão não encontrada. Redirecionando...");
            // Se não há ID, tratamos como logout
            setAuth(null, null);
            Cookies.remove('token', { path: '/' });
            router.push("/login");
            return;
        }

        setIsDeleting(true);

        try {
            // Chama a rota DELETE /user/:id (a rota do seu backend)
            // Nota: Se você removeu verifyUserPermission, o ID do token é suficiente.
            await api.delete(`/user/user/${userId}`);

            toast.success("Conta deletada com sucesso!");

            // Limpa a sessão e redireciona
            setAuth(null, null);
            Cookies.remove('token', { path: '/' });
            window.location.href = "/login";

        } catch (error: any) {
            console.error("Erro ao deletar conta:", error);
            // O backend deve retornar uma mensagem de erro (ex: 404, 500)
            const errorMessage = error.response?.data?.message || "Falha ao deletar conta. Tente novamente.";
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };


    return (
        <AlertDialog>
            {/* O DropdownMenuItem que veio da NavBar atua como o gatilho (trigger) */}
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl flex items-center text-red-600">
                        <Trash2 className="w-6 h-6 mr-2" />
                        Confirmação de Exclusão da Conta
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação é **irreversível**. Você perderá todos os seus dados e extratos financeiros.
                        Tem certeza que deseja deletar permanentemente sua conta?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? "Deletando..." : "Sim, Deletar Conta"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
