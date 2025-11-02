"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authstore";
import { LogOut, Settings, ChevronDown, Menu, BarChart3, List, User, Eye, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Componentes do Projeto
import { UpdateProfileModal } from "./UpdateProfileModal";
import { UserProfileDetails } from "./UserProfileDetails";
import { DeleteUserModal } from "./DeleteUserModal"; // <-- NOVO: Importa o modal de exclusão

// Componentes Shadcn/UI
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// --- Componente de Menu Lateral (Sidebar) para Mobile ---
const MobileMenuTrigger = () => {
    // Usamos o Sheet (que é o que a Sidebar Mobile deveria usar)
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-4">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4 flex flex-col">
                <h1 className="text-xl font-bold mb-6 text-primary">AMA Financeiro</h1>
                {/* Assumindo que o conteúdo da Sidebar está no Layout */}
                <p className="text-sm text-gray-500">Conteúdo da Sidebar...</p>
            </SheetContent>
        </Sheet>
    );
};


// --- Componente Principal NavBar ---
export function NavBar() {
    const { user, setAuth } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        // Limpa o cookie e a store
        Cookies.remove('token', { path: '/' });
        setAuth(null, null);
        // Redireciona para a página de login
        router.push("/login");
    };

    // Gera as iniciais do usuário
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : "US";

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* 1. Logo e Nome */}
                <div className="flex items-center space-x-2">
                    <MobileMenuTrigger />

                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl text-primary">AMA Financeiro</span>
                    </Link>
                </div>

                {/* 2. Área do Usuário (Avatar e Dropdown) */}
                <div className="flex items-center space-x-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full flex items-center justify-center p-0">
                                <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>

                                {/* 1. Detalhes da Conta (Somente Leitura) */}
                                <UserProfileDetails>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        <span>Detalhes da Conta</span>
                                    </DropdownMenuItem>
                                </UserProfileDetails>

                                {/* 2. Modal de Edição de Perfil */}
                                <UpdateProfileModal>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Editar Perfil</span>
                                    </DropdownMenuItem>
                                </UpdateProfileModal>

                                {/* 3. Link para Extratos */}
                                <Link href="/dashboard/extratos">
                                    <DropdownMenuItem>
                                        <List className="mr-2 h-4 w-4" />
                                        <span>Meus Extratos</span>
                                    </DropdownMenuItem>
                                </Link>

                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />

                            {/* 4. Opção SAIR */}
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>

                            {/* 5. NOVO: Opção DELETAR CONTA (com modal de confirmação) */}
                            <DeleteUserModal>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-800 focus:bg-red-100">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Deletar Conta</span>
                                </DropdownMenuItem>
                            </DeleteUserModal>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
