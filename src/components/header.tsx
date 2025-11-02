// components/header.tsx

// 1. OBRIGATÓRIO: Converte para Componente de Cliente, pois é interativo e usa hooks.
"use client";

// 2. Importa todos os "sub-componentes" que formam o DropdownMenu.
import {
    DropdownMenu,
    DropdownMenuContent, // O "container" flutuante do menu
    DropdownMenuItem,    // Um item clicável (ex: "Sair")
    DropdownMenuLabel,   // Um título não-clicável (ex: o nome do usuário)
    DropdownMenuSeparator, // Uma linha cinza para separar
    DropdownMenuTrigger, // O que você clica para ABRIR o menu
} from "@/components/ui/dropdown-menu";

// 3. Importa os "sub-componentes" do Avatar.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 4. Importa o componente de Botão.
import { Button } from "@/components/ui/button";

// 5. Importa o nosso hook do Zustand (a "caixa" com os dados de login).
import { useAuthStore } from "@/store/authstore";

// 6. Define e exporta o componente Header.
export function Header() {

    // 7. HOOK ZUSTAND: "Escuta" o 'useAuthStore'.
    // 8. 's => s.user': Pega (seleciona) APENAS a propriedade 'user' de dentro do store.
    // 9. 'user' agora conterá o objeto { id, name, email, role } que salvamos no login.
    const user = useAuthStore((s) => s.user);

    // 10. Define uma função para ser chamada quando o usuário clicar em "Sair".
    const handleLogout = () => {
        // 11. TODO: Adicionar a lógica de logout real aqui
        // (ex: limpar o store, limpar o localStorage, redirecionar para /login)
        console.log("Fazendo logout...");
    };

    // 12. Retorna o JSX (HTML) do cabeçalho.
    return (
        // 13. 'className="flex...': Cria um container flexível.
        // 14. 'h-14', 'border-b', 'bg-muted/40', 'px-4': Estilização (altura, borda inferior, cor de fundo, padding).
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">

            {/* 15. Container para o título da página */}
            <div className="w-full flex-1">
                <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>

            {/* 16. O início do componente DropdownMenu. Ele é um "container" invisível. */}
            <DropdownMenu>

                {/* 17. O "gatilho" (Trigger). É o que o usuário clica. */}
                {/* 18. 'asChild': Prop mágica do Shadcn. Ela diz: "Não seja um <div>, 
         * em vez disso, 'pegue carona' no seu filho (o <Button>)". */}
                <DropdownMenuTrigger asChild>

                    {/* 19. O botão que o usuário realmente vê. */}
                    <Button variant="secondary" size="icon" className="rounded-full">

                        {/* 20. O Avatar que vai dentro do botão. */}
                        <Avatar>
                            {/* 21. <AvatarImage>: Se você tivesse uma URL de foto, colocaria aqui. 
               * <AvatarImage src={user?.avatarUrl} alt={user?.name} /> */}

                            {/* 22. <AvatarFallback>: O que aparece ENQUANTO a imagem carrega, ou SE ela falhar. */}
                            <AvatarFallback>

                                {/* 23. Pega o nome do usuário (ex: "Pedro Gabriel"), pega os 2 primeiros caracteres ("Pe"),
                 * e joga para maiúsculo ("PE"). Se não houver usuário, usa "U". */}
                                {user?.name.substring(0, 2).toUpperCase() || "U"}

                            </AvatarFallback>
                        </Avatar>

                        {/* 24. 'sr-only': (Screen-Reader Only) Texto para acessibilidade, não fica visível. */}
                        <span className="sr-only">Toggle user menu</span>
                    </Button>

                </DropdownMenuTrigger>

                {/* 25. O "Conteúdo" do menu - é o container flutuante que aparece. */}
                {/* 26. 'align="end"': Alinha o menu pela direita (para não sair da tela). */}
                <DropdownMenuContent align="end">

                    {/* 27. O "Rótulo" (Label) - mostra o nome do usuário, mas não é clicável. */}
                    <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>

                    {/* 28. Uma linha cinza separadora. */}
                    <DropdownMenuSeparator />

                    {/* 29. Um item clicável do menu. */}
                    <DropdownMenuItem>Configurações</DropdownMenuItem>
                    <DropdownMenuItem>Suporte</DropdownMenuItem>

                    {/* 30. Outro separador. */}
                    <DropdownMenuSeparator />

                    {/* 31. O item de "Sair". */}
                    {/* 32. 'onClick={handleLogout}': Quando este item for clicado, 
           * ele chama a função 'handleLogout' que definimos na linha 10. */}
                    <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}