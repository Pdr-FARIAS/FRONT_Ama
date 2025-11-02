"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// 1. Importamos o novo ícone
import {
    LayoutDashboard,
    BarChart3, // Ícone do Extrato (Gráfico de Barras)
    LogOut,
    PlusCircle,   // Ícone para "Novo Lançamento" (financeiro)
    CalendarPlus  // NOVO: Ícone para "Criar Evento"
} from "lucide-react";

// 2. Adicionamos o novo item de navegação
const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/extratos", label: "Extratos", icon: BarChart3 },
    { href: "/dashboard/novo-lancamento", label: "Novo Lançamento", icon: PlusCircle },
    { href: "/dashboard/criar-evento", label: "Criar Evento", icon: CalendarPlus }, // <-- ADICIONADO AQUI
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        // Sidebar para desktop (md:block)
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">

                {/* Logo/Título (Opcional, já que está na NavBar) */}
                <div className="flex h-16 items-center border-b px-4 lg:px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                        {/* <BarChart3 className="h-6 w-6 text-primary" /> */}
                        <span className="">AMA Financeiro</span>
                    </Link>
                </div>

                {/* Navegação Principal */}
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Button
                                    key={item.label}
                                    asChild // Permite que o Botão se comporte como um Link
                                    variant={isActive ? "secondary" : "ghost"} // Destaca o link ativo
                                    className="w-full justify-start"
                                >
                                    <Link href={item.href}>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.label}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </div>

                {/* O botão de Sair/Logout já está no menu dropdown da NavBar, 
           mas pode ser descomentado se você quiser aqui também. */}
                {/* <div className="mt-auto p-4">
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div> */}
            </div>
        </div>
    );
}
