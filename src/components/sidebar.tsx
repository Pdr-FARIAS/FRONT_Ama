"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


import {
    LayoutDashboard,
    BarChart3,
    LogOut,
    PlusCircle,
    CalendarPlus,
    ClipboardList
} from "lucide-react";


const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/extratos", label: "Extratos", icon: BarChart3 },
    { href: "/dashboard/novo-lancamento", label: "Novo Lançamento", icon: PlusCircle },
    { href: "/dashboard/criar-evento", label: "Criar Evento", icon: CalendarPlus },
    { href: "/dashboard/eventos", label: "Eventos", icon: ClipboardList },

];

export function Sidebar() {
    const pathname = usePathname();

    return (

        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">


                <div className="flex h-16 items-center border-b px-4 lg:px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">

                        <span className="">AMA Financeiro</span>
                    </Link>
                </div>


                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Button
                                    key={item.label}
                                    asChild
                                    variant={isActive ? "secondary" : "ghost"}
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


            </div>
        </div>
    );
}
