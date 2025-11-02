"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient(); // ✅ criado dentro do componente (garante compatibilidade com RSC)

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
}
