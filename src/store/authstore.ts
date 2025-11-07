
import { create } from "zustand";


interface User {
    userId: number;
    name: string;
    email: string;
    role?: string;

    agencia_conta?: string;
    numero_conta?: string;
}


interface AuthState {
    token: string | null;
    user: User | null;
    setAuth: (user: User | null, token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({

    token: null,
    user: null,


    setAuth: (user, token) => {
        set({ user, token });
    },
}));