"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authstore';
import Cookies from 'js-cookie';



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
interface DeleteUserModalProps {
    children: React.ReactNode;
}

export function DeleteUserModal({ children }: DeleteUserModalProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const setAuth = useAuthStore((s) => s.setAuth);


    const getUserIdFromToken = (): number | null => {
        const token = Cookies.get('token');
        if (token) {
            const decoded = decodeJwtPayload(token);

            return decoded?.userId || null;
        }
        return null;
    };

    const handleDelete = async () => {
        const userId = getUserIdFromToken();

        if (!userId) {
            toast.error("Sessão não encontrada. Redirecionando...");

            setAuth(null, null);
            Cookies.remove('token', { path: '/' });
            router.push("/login");
            return;
        }

        setIsDeleting(true);

        try {
            await api.delete(`/user/user/${userId}`);

            toast.success("Conta deletada com sucesso!");


            setAuth(null, null);
            Cookies.remove('token', { path: '/' });
            window.location.href = "/login";

        } catch (error: any) {
            console.error("Erro ao deletar conta:", error);

            const errorMessage = error.response?.data?.message || "Falha ao deletar conta. Tente novamente.";
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };


    return (
        <AlertDialog>
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
