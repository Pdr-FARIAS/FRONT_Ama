"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";

import Image from "next/image";

import { api } from "../lib/api";

import { Button } from "../components/ui/button";

import { EventCard } from "../components/EventCard_Exemplo";
import { User, Menu, Calendar, Instagram, Facebook } from "lucide-react";

import { format } from "date-fns";

import { ptBR } from "date-fns/locale";





interface Criador {

  user: string;

}

export interface Evento {
  eventoid: string;

  titulo: string;

  descriçao: string;

  data_termino: string;

  image: string | null;

  criador: Criador;

}





const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (

  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>

    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.451 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.847 6.03l-.341 1.231 1.267.332zm12.351-6.836c-.225-.112-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.73-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.018-.346.093-.459c.097-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383-.13-.006-.28-.008-.429-.008s-.377.056-.579.28c-.202.225-.76.731-.76 1.77 0 1.041.777 2.049.884 2.197.106.149 1.533 2.35 3.737 3.324.525.236.934.378 1.246.486.45.152.83.129 1.121.079.31-.051.947-.386 1.078-.761.131-.374.131-.693.093-.761-.038-.068-.182-.112-.393-.225z" />

  </svg>

);
export default function HomePage() {





  const [eventos, setEventos] = useState<Evento[]>([]);

  const [isLoading, setIsLoading] = useState(true);





  useEffect(() => {

    async function fetchEventos() {

      setIsLoading(true);

      try {



        const response = await api.get('/evento');

        setEventos(response.data.slice(0, 3));

      } catch (error) {

        console.error("Falha ao buscar eventos:", error);

      } finally {

        setIsLoading(false);

      }

    }

    fetchEventos();

  }, []);




  const whatsAppLink = "https://wa.me/5514996213890?text=Vim%20atrav%C3%A9s%20do%20site%20de%20voc%C3%AAs%20e%20gostaria%20de%20saber%20como%20posso%20ajudar%20essa%20associa%C3%A7%C3%A3o.";





  return (



    <div className="bg-gray-900 dark:bg-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>





      <nav className="bg-gray-800 dark:bg-white shadow-md sticky top-0 z-50">

        <div className="container mx-auto px-4 py-4 flex justify-between items-center">





          <Link href="/" className="text-2xl font-bold text-gray-100 dark:text-gray-800">

            AMA <span className="text-blue-600">Financeiro</span>

          </Link>



          <div className="hidden md:flex space-x-6 items-center">



            <Link href="#causa" className="text-gray-300 dark:text-gray-600 hover:text-blue-400 dark:hover:text-blue-600">Nossa Causa</Link>

            <Link href="#eventos" className="text-gray-300 dark:text-gray-600 hover:text-blue-400 dark:hover:text-blue-600">Eventos</Link>



            <div className="flex items-center space-x-2">



              <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" aria-label="Acessar WhatsApp" title="Acessar WhatsApp"

                className="text-gray-300 dark:text-gray-600 hover:text-blue-400 dark:hover:text-blue-600 p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-100">

                <WhatsAppIcon className="w-5 h-5" />

              </a>

              <a href="https://www.facebook.com/share/1JKhcfNh87/" target="_blank" rel="noopener noreferrer" aria-label="Acessar Facebook" title="Acessar Facebook"

                className="text-gray-300 dark:text-gray-600 hover:text-blue-400 dark:hover:text-blue-600 p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-100">

                <Facebook className="w-5 h-5" />

              </a>

              <a href="https://www.instagram.com/amaamigosdemaosdadas" target="_blank" rel="noopener noreferrer" aria-label="Acessar Instagram" title="Acessar Instagram"

                className="text-gray-300 dark:text-gray-600 hover:text-blue-400 dark:hover:text-blue-600 p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-100">

                <Instagram className="w-5 h-5" />

              </a>

              <Button asChild variant="ghost" size="icon" className="bg-blue-600 text-white rounded-full hover:bg-blue-700">

                <Link href="/login" aria-label="Acessar Perfil ou Login" title="Acessar Login">

                  <User className="w-5 h-5" />

                </Link>

              </Button>

            </div>

          </div>

          <div className="md:hidden">

            <Button variant="ghost" size="icon">

              <Menu className="w-6 h-6 text-gray-100 dark:text-gray-800" />

            </Button>

          </div>

        </div>

      </nav>





      <header id="hero" className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white">
        <Image

          src="https://placehold.co/1600x900/a0aec0/ffffff?text=Imagem+Inspiradora+da+ONG"

          alt="Nossa Causa"

          fill
          style={{ objectFit: 'cover' }}

          className="absolute -z-10"

          priority

          unoptimized

        />

        <div className="absolute inset-0 bg-black opacity-50 -z-10"></div>



        <div className="container mx-auto px-4 text-center z-10">

          <h1 className="text-4xl md:text-6xl font-bold mb-4">Transforme Vidas</h1>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Sua contribuição ajuda a construir um futuro melhor para centenas de famílias.</p>
          <Image

            src="https://i.imgur.com/W5h8Qoc_d.webp?maxwidth=760&fidelity=grand"

            alt="Voluntários da AMA em ação"

            width={300}

            height={200}

            className="rounded-lg shadow-lg object-cover mx-auto mt-8"

          />

        </div>

      </header>





      <section id="causa" className="py-20 bg-gray-800 dark:bg-gray-50">

        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">

          <div className="md:w-1/2">



            <Image

              src="https://i.imgur.com/jj3OgTh.jpeg"

              alt="Voluntários trabalhando"

              width={600}

              height={400}

              className="rounded-lg shadow-lg object-cover"

            />

          </div>

          <div className="md:w-1/2">

            <span className="text-blue-400 dark:text-blue-600 font-semibold">NOSSO PROPÓSITO</span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 dark:text-gray-800 mt-2 mb-6">A necessidade que combatemos</h2>

            <p className="text-gray-300 dark:text-gray-600 text-lg mb-4">

              Todos os dias, inúmeras pessoas enfrentam a dura realidade da insegurança alimentar e da falta de acesso a necessidades básicas. Acreditamos que ninguém deveria ter que escolher entre se alimentar ou pagar uma conta de luz.

            </p>

            <p className="text-gray-300 dark:text-gray-600 text-lg">

              Nossa missão é atuar diretamente na raiz desse problema, fornecendo não apenas assistência imediata, mas também ferramentas para que essas comunidades possam se reerguer com dignidade.

            </p>

          </div>

        </div>

      </section>




      <section id="eventos" className="py-20 bg-gray-900 dark:bg-white">

        <div className="container mx-auto px-4">

          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 dark:text-gray-800 text-center mb-12">Próximos Eventos</h2>





          {isLoading ? (

            <p className="text-center text-gray-400 dark:text-gray-500">Carregando eventos...</p>

          ) : eventos.length > 0 ? (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">



              {eventos.map((evento) => (

                <EventCard key={evento.eventoid} evento={evento} />

              ))}

            </div>

          ) : (

            <p className="text-center text-gray-400 dark:text-gray-500">Nenhum evento agendado no momento.</p>

          )}



        </div>

      </section>
      <section id="doar" className="bg-blue-600 py-20 text-white">

        <div className="container mx-auto px-4 text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-6">Faça parte da mudança hoje mesmo.</h2>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">

            Sua ajuda, de qualquer modo, nos ajuda a continuar nosso trabalho.

          </p>
          <a

            href="https://www.vakinha.com.br/vaquinha/acao-para-as-criancas-do-cambaras-e-solemar"

            target="_blank"

            rel="noopener noreferrer"

            className="bg-green-500 hover:bg-green-600 text-lg px-10 py-4 h-auto rounded-full text-white inline-block"

          >

            FAZER MINHA DOAÇÃO

          </a>

        </div>

      </section>
      <footer className="bg-black dark:bg-gray-800 text-gray-400 dark:text-gray-300 py-12">

        <div className="container mx-auto px-4 text-center">

          <p>&copy; 2025 AMA Financeiro. Todos os direitos reservados.</p>

          <p className="text-sm mt-2">CNPJ: 00.000.000/0001-00</p>

        </div>

      </footer>



    </div>

  );

}