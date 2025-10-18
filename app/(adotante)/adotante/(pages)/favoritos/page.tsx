"use client"

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
  parceiro: string;
  estado: string;
  favorito: boolean;
}

export default function homeAdotante(){
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    useEffect(() => {
        async function carregarAnimais() {
            try {
                setLoading(true);

                const response = await fetch(`http://localhost:8080/fotos/adotante/36/pagina/${paginaAtual}`);
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
                    parceiro: item.animal.parceiro.nome,
                    estado: item.animal.parceiro.estado,
                    favorito: item.favorito,
                }));
        
                setAnimais(listaAnimais);
            } catch (error) {
                console.error("Erro ao carregar animais:", error);
            } finally {
                setLoading(false);
            }
        }
    
        carregarAnimais();
    }, []);

    async function handleFavorito(idPet: number, favorito: boolean) {
        try {
            if (favorito) {
                const response = await fetch(`http://localhost:8080/favoritos/${idPet}`, {
                    method: "DELETE",
                });
                if (!response.ok) throw new Error("Erro ao remover favorito");

                setAnimais((prev) =>
                    prev.map((animal) =>
                        animal.id === idPet ? { ...animal, favorito: false } : animal
                    )
                );
            } else {
                const response = await fetch("http://localhost:8080/favoritos/cadastrar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        adotanteId: 36, 
                        animalId: idPet,
                    }),
                });
                if (!response.ok) throw new Error("Erro ao adicionar favorito");

                setAnimais((prev) =>
                    prev.map((animal) =>
                        animal.id === idPet ? { ...animal, favorito: true } : animal
                    )
                );
            }
        } catch (error) {
            console.error(error);
            alert("Não foi possível atualizar os favoritos.");
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
                <h1 className="font-bold text-3xl 2xl:text-4xl">Meus favoritos</h1>
                <h2 className="text-base 2xl:text-lg">Visualize  seus favoritos, toda beleza do mundo em um só lugar!</h2>
            </div>

            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start">
                {animais.length > 0 ? (
                    animais.map((animal) => (
                    <AnimalCard
                        key={animal.id}
                        idPet={animal.id}
                        tipo="adotante"
                        nome={animal.nome}
                        parceiro={animal.parceiro}
                        especie={animal.especie}
                        idade={animal.idade.toString()}
                        porte={animal.porte}
                        sexo={animal.sexo}
                        estado={animal.estado}
                        descricao={animal.descricao}
                        status={animal.status}
                        foto={`data:image/jpeg;base64,${animal.foto}`}
                        onToggleFavorito={handleFavorito}
                        favorito />
                    ))
                ) : (
                    <div className="py-8 lg:px-6">
                    <p className="text-center text-text-light-gray font-medium text-2xl">
                        Nenhum animal cadastrado no sistema!
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