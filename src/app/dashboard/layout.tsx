"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/authstore";
import { useAuthTimer } from "../../hooks/useAuthtimer";
import { NavBar } from "@/components/NavBar";
import { Sidebar } from "@/components/sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { setAuth, user } = useAuthStore();

    const [isMounted, setIsMounted] = useState(false);


    useAuthTimer();


    useEffect(() => {
        const storedToken = Cookies.get("token");

        setIsMounted(true);


        if (!storedToken) {
            console.log("Sessão ausente ou expirada. Redirecionando para login.");
            setAuth(null, null);


            setTimeout(() => {
                router.push("/login");
            }, 50);
        }
    }, [router, setAuth]);


    const hasValidSession = !!Cookies.get("token");


    if (!isMounted || !hasValidSession) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl font-medium text-gray-700">Verificando sessão...</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">


            <NavBar />


            <div className="flex flex-1 overflow-hidden">


                <Sidebar />


                <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
                    <main>{children}</main>
                </div>
            </div>

            <Toaster position="top-right" />
        </div>
    );
}