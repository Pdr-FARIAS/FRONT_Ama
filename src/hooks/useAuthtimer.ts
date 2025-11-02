"use client";

import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/authstore'; // Caminho relativo ajustado (assumindo que o store está um nível acima)

// Função auxiliar para decodificar o token sem dependências de biblioteca pesada
function decodeJwt(token: string): { exp: number } | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // Decodifica a parte do payload (o meio do token)
        const payload = JSON.parse(atob(parts[1]));

        // Retorna apenas a propriedade de expiração
        return { exp: payload.exp };
    } catch (e) {
        console.error("Falha ao decodificar JWT para timer:", e);
        return null;
    }
}

export const useAuthTimer = () => {
    const setAuth = useAuthStore((s) => s.setAuth);

    const handleLogout = () => {
        // 1. Limpa o estado global
        setAuth(null, null);
        // 2. Remove o cookie
        Cookies.remove('token', { path: '/' });
        // 3. Redireciona
        window.location.href = '/login';
    };

    useEffect(() => {
        const token = Cookies.get('token');
        let timer: NodeJS.Timeout | null = null;

        if (!token) {
            // Se não houver token, força o logout (para o caso de alguém ter limpado o cookie manualmente)
            handleLogout();
            return;
        }

        const decoded = decodeJwt(token);

        if (decoded && decoded.exp) {
            // O 'exp' está em segundos (epoch time). Multiplicamos por 1000 para milissegundos.
            const expiryTimeMs = decoded.exp * 1000;
            const currentTimeMs = Date.now();
            const timeUntilExpiry = expiryTimeMs - currentTimeMs;

            // Se o token já expirou, força o logout imediato.
            if (timeUntilExpiry < 0) {
                handleLogout();
                return;
            }

            // Configura o timer para 10 segundos ANTES da expiração real
            const timeToSetTimeout = timeUntilExpiry - 10000;

            if (timeToSetTimeout > 0) {
                timer = setTimeout(handleLogout, timeToSetTimeout);
            }
        } else {
            // Se o token não for válido (mal formatado), força o logout
            handleLogout();
        }

        // Função de limpeza: OBRIGATÓRIA para evitar vazamento de memória do timer
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []); // Roda apenas uma vez na montagem

    return null; // Este hook não renderiza nada
};
