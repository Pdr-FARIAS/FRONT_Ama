"use client";

import { useAuthStore } from "@/store/authstore";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";


import { Button } from "@/components/ui/button";
import { Copy, Eye, User, Mail, Banknote, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


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


interface DetailFieldProps {
    icon: React.ReactNode;
    label: string;
    value: string | number | null | undefined;
    isSecret?: boolean;
}

const DetailField = ({ icon, label, value, isSecret = false }: DetailFieldProps) => {
    const displayValue = isSecret && value ? '••••••••' : (value || "Não informado");

    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(String(value));
            toast.success(`${label} copiado!`);
        }
    };

    return (
        <div className="flex items-start justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center space-x-3">
                <div className="text-primary/70">{icon}</div>
                <div>
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                    <p className="text-lg font-semibold text-gray-900 break-words">{displayValue}</p>
                </div>
            </div>
            {value && !isSecret && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-primary"
                    onClick={handleCopy}
                    aria-label={`Copiar ${label}`}
                >
                    <Copy className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};



export function UserProfileDetails({ children }: UserProfileDetailsProps) {
    const userStore = useAuthStore((state) => state.user);


    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [fetchedUser, setFetchedUser] = useState<any>(null);


    const getUserId = () => {
        const token = Cookies.get('token');
        if (token) {
            const decoded = decodeJwtPayload(token);

            return decoded?.userId;
        }
        return null;
    };


    useEffect(() => {
        if (open) {
            const userId = getUserId();

            if (!userId) {
                toast.error("Sessão inválida. Faça o login novamente.");
                setOpen(false);
                return;
            }

            const fetchDetails = async () => {
                setIsLoading(true);
                try {

                    const res = await api.get(`/user/${userId}`);


                    setFetchedUser(res.data);

                } catch (error) {
                    console.error("Erro ao buscar detalhes do usuário:", error);
                    toast.error("Falha ao carregar detalhes do perfil.");
                    setFetchedUser(null);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchDetails();
        } else {

            setFetchedUser(null);
        }
    }, [open]);



    const currentUser = fetchedUser || userStore;

    // Dados do Usuário
    const userName = currentUser?.user || currentUser?.name;
    const userEmail = currentUser?.email;
    const userAgencia = currentUser?.agencia_conta;
    const userConta = currentUser?.numero_conta;


    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-2xl">
                        <Eye className="mr-2 h-6 w-6 text-primary" />
                        Detalhes da Conta
                    </DialogTitle>
                    <DialogDescription>
                        Informações básicas e bancárias da sua conta AMA Financeiro.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
                        <span className="text-gray-600">Carregando dados...</span>
                    </div>
                ) : (
                    <div className="space-y-4 pt-2">

                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-primary">Pessoal</h3>
                            <DetailField
                                icon={<User className="h-5 w-5" />}
                                label="Nome de Usuário"
                                value={userName}
                            />
                            <DetailField
                                icon={<Mail className="h-5 w-5" />}
                                label="E-mail"
                                value={userEmail}
                            />
                        </div>


                        <div className="w-full h-px bg-gray-200 my-4" />


                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-primary">Informações Bancárias</h3>
                            <DetailField
                                icon={<Banknote className="h-5 w-5" />}
                                label="Agência"
                                value={userAgencia}
                            />
                            <DetailField
                                icon={<Banknote className="h-5 w-5" />}
                                label="Número da Conta"
                                value={userConta}
                            />
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <Button onClick={handleClose} className="w-full">
                        Fechar
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}
