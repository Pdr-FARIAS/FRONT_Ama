"use client";

import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/authstore';


function decodeJwt(token: string): { exp: number } | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(atob(parts[1]));


        return { exp: payload.exp };
    } catch (e) {
        console.error("Falha ao decodificar JWT para timer:", e);
        return null;
    }
}

export const useAuthTimer = () => {
    const setAuth = useAuthStore((s) => s.setAuth);

    const handleLogout = () => {

        setAuth(null, null);

        Cookies.remove('token', { path: '/' });
        window.location.href = '/login';
    };

    useEffect(() => {
        const token = Cookies.get('token');
        let timer: NodeJS.Timeout | null = null;

        if (!token) {

            handleLogout();
            return;
        }

        const decoded = decodeJwt(token);

        if (decoded && decoded.exp) {

            const expiryTimeMs = decoded.exp * 1000;
            const currentTimeMs = Date.now();
            const timeUntilExpiry = expiryTimeMs - currentTimeMs;


            if (timeUntilExpiry < 0) {
                handleLogout();
                return;
            }


            const timeToSetTimeout = timeUntilExpiry - 10000;

            if (timeToSetTimeout > 0) {
                timer = setTimeout(handleLogout, timeToSetTimeout);
            }
        } else {

            handleLogout();
        }


        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);

    return null;
};
