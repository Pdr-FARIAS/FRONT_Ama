// store/authstore.ts
import { create } from "zustand";

// 1. Defina como é o objeto do usuário
interface User {
    userId: number;
    name: string;
    email: string;
    role?: string;
    // CORREÇÃO: Adicionamos os campos de conta bancária (opcionais, pois o usuário pode não ter preenchido)
    agencia_conta?: string;
    numero_conta?: string;
}

// 2. Atualize a "planta" do seu store
interface AuthState {
    token: string | null;
    user: User | null; // Adiciona o usuário ao store
    // Define a função 'setAuth' que seu LoginPage espera
    setAuth: (user: User | null, token: string | null) => void;
}

// 3. Implemente a nova lógica
export const useAuthStore = create<AuthState>((set) => ({
    // 4. Estado Inicial (vazio)
    token: null,
    user: null,

    // 5. A Ação de Login
    // Esta é a função que seu LoginPage estava procurando!
    setAuth: (user, token) => {
        set({ user, token }); // Salva AMBOS no estado global
    },
}));