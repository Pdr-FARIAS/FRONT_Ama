import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";


export interface Evento {
    eventoid: string;
    titulo: string;
    descriçao: string;
    data_termino: string;
    image: string | null;
    criador: { user: string };
}


const formatarData = (dataISO: string): string => {
    try {
        return format(new Date(dataISO), "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch (e) {
        return "Data inválida";
    }
};


interface EventCardProps {
    evento: Evento;
}


export const EventCard: React.FC<EventCardProps> = ({ evento }) => {
    const imageUrl = evento.image || "https://placehold.co/600x400/cbd5e0/4a5568?text=Evento";

    return (

        <div className="bg-gray-800 dark:bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="relative w-full h-48">


                <Image
                    src={imageUrl}
                    alt={evento.titulo}
                    fill
                    className="object-cover rounded-t-lg"


                    unoptimized
                />
            </div>
            <div className="p-6 flex flex-col flex-1">
                <span className="text-blue-400 dark:text-blue-600 text-sm font-semibold">
                    {formatarData(evento.data_termino)}
                </span>
                <h3 className="text-xl font-bold text-gray-100 dark:text-gray-800 mt-2 mb-3">
                    {evento.titulo}
                </h3>
                <p className="text-gray-300 dark:text-gray-600 flex-1">
                    {evento.descriçao}
                </p>


                <Link
                    href={`/registro/${evento.eventoid}`}
                    className="mt-4 text-blue-400 dark:text-blue-600 font-semibold hover:underline"
                >
                    Inscrever-se &rarr;
                </Link>
            </div>
        </div>
    );
}

export default EventCard;