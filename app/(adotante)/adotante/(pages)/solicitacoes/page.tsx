"use client"

import AnimalCard from "@/components/AnimalCard";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    const [animais, setAnimais] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
            return;
        }
        
        async function carregarAnimais() {
            try {
                const response = await fetch(`http://localhost:8080/adocoes/adotante/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                
                if (!response.ok) {
                    let errorMsg = "Erro ao editar!";
                    try {
                        const text = await response.text();
                        try {
                        const json = JSON.parse(text);
                        errorMsg = json.message || JSON.stringify(json);
                        } catch {
                        errorMsg = text;
                        }
                    } catch (error) {
                        // envia um alerta para o usuário caso não haja conexão com o servidor
                        Swal.fire({
                            position: "top",
                            icon: "error",
                            title: "Erro de conexão com o servidor!",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    }
        
                    // exibe o erro recebido
                    Swal.fire({
                        position: "top",
                        icon: "error",
                        title: errorMsg,
                        showConfirmButton: false,
                        timer: 2500,
                    });
                    return;
                }

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
                    <div className="py-8 px-0 flex flex-col gap-6 text-start text-text-light-gray font-medium text-2xl">
                        <div className="space-y-2 sm:space-y-0">
                            <p>Parece que você ainda não solicitou nenhuma adoção... </p>
                            <p>Que tal dar uma olhadinha nos nossos peludos esperando por um lar?</p>
                        </div>
                        <Link href={"/adotante/home"} className="w-fit px-6 py-2 rounded-3xl text-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition font-medium
                            bg-miau-purple text-background hover:bg-miau-green active:bg-miau-light-green">
                            Pesquisar pets</Link>
                    </div>
                )}

            </div>
        </div>
    );
}