"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


import { Button } from "@/components/ui/button";


import { useAuthStore } from "@/store/authstore";


export function Header() {
    const user = useAuthStore((s) => s.user);


    const handleLogout = () => {

        console.log("Fazendo logout...");
    };


    return (

        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">

            <div className="w-full flex-1">
                <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>

                    <Button variant="secondary" size="icon" className="rounded-full">


                        <Avatar>

                            * <AvatarImage src={"https://i.imgur.com/W5h8Qoc_d.webp?maxwidth=760&fidelity=grand"} alt={user?.name} /> */


                            <AvatarFallback>


                                {user?.name.substring(0, 2).toUpperCase() || "U"}

                            </AvatarFallback>
                        </Avatar>

                        <span className="sr-only">Toggle user menu</span>
                    </Button>

                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">


                    <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>


                    <DropdownMenuSeparator />


                    <DropdownMenuItem>Configurações</DropdownMenuItem>
                    <DropdownMenuItem>Suporte</DropdownMenuItem>


                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}