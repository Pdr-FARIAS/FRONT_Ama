import axios from "axios";
import Cookies from "js-cookie"; // Importa a biblioteca 'js-cookie'

// Cria a instância base do Axios com a URL do seu backend
const api = axios.create({
    baseURL: "http://localhost:3000", // Verifique se esta é a porta correta do seu backend
});

// --- A CORREÇÃO ESTÁ AQUI ---
// Adiciona um "interceptor" (um "pedágio") a CADA requisição
api.interceptors.request.use(
    (config) => {
        // 1. Antes de a requisição sair, lê o token dos Cookies
        const token = Cookies.get("token");

        // 2. Se o token existir...
        if (token) {
            // 3. Anexa ele no cabeçalho 'Authorization'
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        // 4. Libera a requisição para continuar
        return config;
    },
    (error) => {
        // Em caso de erro na configuração da requisição
        return Promise.reject(error);
    }
);

export { api };

