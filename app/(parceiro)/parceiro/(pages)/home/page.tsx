"use client"

import { CirclePlus } from "lucide-react";
import Link from "next/link";
import AnimalCard from "@/components/AnimalCard";

import { useEffect, useState } from "react";

interface Animal {
    id: number;
    nome: string;
    idade: number;
    especie: string;
    descricao: string;
    obs: string;
    porte: string;
    sexo: string;
    status: string;
    foto: string;
}

export default function homeParceiro(){
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    useEffect(() => {
      carregarAnimais();
    }, [paginaAtual]);

    async function carregarAnimais() {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:8080/fotos/parceiro/37/pagina/${paginaAtual}`);
        if (!response.ok) throw new Error("Erro ao buscar dados");

        const data = await response.json();
        console.log("Dados recebidos:", data);

        if (data.length > 0) {
          setTotalPaginas(data[0].totalPaginas);
        }

        // Agora o backend retorna um array de objetos
        const listaAnimais: Animal[] = data.map((item: any) => ({
          id: item.animal.id,
          nome: item.animal.nome,
          idade: item.animal.idade,
          especie: item.animal.especie,
          descricao: item.animal.descricao,
          obs: item.animal.obs,
          porte: item.animal.porte,
          sexo: item.animal.sexo,
          status: item.animal.status,
          foto: item.foto,
        }));

        setAnimais(listaAnimais);
      } catch (error) {
        console.error("Erro ao carregar animais:", error);
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
        return (
            <div className="absolute w-screen h-screen flex flex-col gap-4 items-center justify-center bg-miau-purple">
                <div className="w-10 h-10 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                <p className="text-background font-medium text-xl">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 px-4 sm:px-16 md:px-20 lg:px-30 py-4 sm:py-8 lg:py-10 ">
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl">Pets cadastrados</h1>
                <h2 className="text-base 2xl:text-lg">Cadastre novos pets e verifique os já cadastrados para adoção.</h2>
            </div>

            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start">
                <Link href={"/parceiro/cadastro-pet"} className="bg-[#C09BD84D] hover:bg-miau-purple active:bg-miau-purple/80 
                    text-text-gray hover:text-background active:text-background flex gap-2 items-center px-4 py-2 rounded-xl w-full max-w-[380px]
                    lg:h-[512px] lg:flex-col lg:items-center lg:justify-center lg:gap-6">
                    <CirclePlus className="w-8 lg:w-24 h-8 lg:h-24" />
                    <h3 className="font-semibold text-lg lg:text-2xl">Adicionar novo pet</h3>
                </Link>

                {animais.length > 0 ? (
                  animais.map((animal) => (
                    <AnimalCard
                      key={animal.id}
                      idPet={animal.id}
                      tipo="parceiro"
                      nome={animal.nome}
                      especie={animal.especie}
                      idade={animal.idade.toString()}
                      porte={animal.porte}
                      descricao={animal.descricao}
                      status={animal.status}
                      foto={`data:image/jpeg;base64,${animal.foto}`}
                    />
                  ))
                ) : (
                  <div className="py-8 lg:px-6">
                    <p className="text-center text-text-light-gray font-medium text-2xl">
                      Nenhum animal cadastrado!
                    </p>
                  </div>
                )}

            </div>

            <div className="flex flex-row gap-3 text-background w-full items-center justify-center text-center mt-2">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button key={num} onClick={() => setPaginaAtual(num)}
                  className={`w-8 h-8 font-semibold rounded-lg text-center cursor-pointer
                  ${paginaAtual === num ? "bg-miau-orange text-white" 
                  : "bg-miau-purple hover:bg-miau-purple/80 active:bg-miau-purple/80 text-background"}`}>
                  {num}
                </button>
              ))}
            </div>
        </div>
    );
}