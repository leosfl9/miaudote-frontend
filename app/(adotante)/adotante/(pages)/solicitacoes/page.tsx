"use client"

import AnimalCard from "@/components/AnimalCard";
import { useEffect, useState } from "react";

interface Animal {
  id: number;
  idPet: number;
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

export default function SolicitacoesAdocao(){
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarAnimais() {
            try {
                const response = await fetch(`http://localhost:8080/adocoes/adotante/36`);
                if (!response.ok) throw new Error("Erro ao buscar dados");

                const data = await response.json();
                console.log("Dados recebidos:", data);

                const listaAnimais: Animal[] = data.map((item: any) => ({
                    id: item.adocao.id,
                    idPet: item.adocao.animal.id,
                    nome: item.adocao.animal.nome,
                    idade: item.adocao.animal.idade,
                    especie: item.adocao.animal.especie,
                    descricao: item.adocao.animal.descricao,
                    obs: item.adocao.animal.obs,
                    porte: item.adocao.animal.porte,
                    sexo: item.adocao.animal.sexo,
                    status: item.adocao.status,
                    foto: item.fotos[0].foto,
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
                <h1 className="font-bold text-3xl 2xl:text-4xl">Solicitações de adoção</h1>
                <h2 className="text-base 2xl:text-lg">Visualize e gerencie suas solicitações de adoção.</h2>
            </div>

            <div className="flex flex-col plg:flex-row plg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start">
                {animais.length > 0 ? (
                    animais.map((animal) => (
                    <AnimalCard
                        key={animal.id}
                        idSolicitacao={animal.id}
                        idPet={animal.idPet}
                        tipo="solicitacao"
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
                        Nenhuma solicitação realizada!
                    </p>
                    </div>
                )}

            </div>
        </div>
    );
}