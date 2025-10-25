"use client"

import LinkButton from "@/components/LinkButton";
import AnimalPresentation from "@/components/AnimalPresentation";

import Cookies from "js-cookie";
import { use, useEffect, useState } from "react";
import Swal from "sweetalert2";

// tipagem dos dados do animal
interface Animal {
  id: number;
  nome: string;
  especie: string;
  idade: number;
  descricao: string;
  porte: string;
  sexo: string;
  status: string;
  obs: string;
  parceiro: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cidade: string;
    estado: string;
  };
}

export default function PetDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // pega o id do pet pela URL

    // dados de autenticação do usuário
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    // dados do animal
    const [animal, setAnimal] = useState<Animal | null>(null);
    const [fotos, setFotos] = useState([]);

    const [loading, setLoading] = useState(true); // estado de loading da página

    useEffect(() => {
        // se o usuário não estiver autenticado, é redirecionado para o login
        if (!token || !userId) {
            window.location.href = "/login";
            return;
        }

        // carrega os dados do animal
        async function carregarAnimal() {
            try {
                // API retorna dados do animal
                const response = await fetch(`https://miaudote-8av5.onrender.com/fotos/animal/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
            
                // se der erro, exibe alerta na tela
                if (!response.ok) {
                    let errorMsg = "Erro ao buscar dados do animal!";
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
                            timer: 1500,
                        });
                    }

                    // exibe o erro recebido
                    Swal.fire({
                        position: "top",
                        icon: "error",
                        title: errorMsg,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    return;
                }

                const data = await response.json(); // armazena os dados recebidos da API

                const animal = data[0]?.animal; // dados específicos do animal
                const fotos = data.map((item: { foto: string; }) => item.foto); // fotos do animal

                // armazena a lista de fotos e dados do animal
                setAnimal(animal);
                setFotos(fotos);

            } catch (error) {
                // envia um alerta para o usuário caso não haja conexão com o servidor
                Swal.fire({
                    position: "top",
                    icon: "error",
                    title: "Erro de conexão com o servidor!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } finally {
                setLoading(false); // termina de carregar a página
            }
        }

        carregarAnimal(); // chama a função
    }, [id]);

    // tela de loading
    if (loading) {
        return (
            <div className="absolute w-screen h-screen flex flex-col gap-4 items-center justify-center bg-miau-purple">
                <div className="w-10 h-10 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                <p className="text-background font-medium text-xl">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 lxl:relative sm:gap-8 items-center justify-center px-2 md:px-8 py-8 lxl:py-10 
            bg-[url('/grafo_pets.png')] bg-no-repeat bg-cover bg-center flex-1">

            {/* botão de voltar */}
            <div className="w-full lxl:absolute lxl:top-10 lxl:pl-10">
                <LinkButton href={"/parceiro/home"} text="Voltar" color="white" back={true} />
            </div>

            {/* se o animal for carregado, exibe seus dados em um card */}
            {animal 
                ? <AnimalPresentation tipo="parceiro" nome={animal.nome} descricao={animal.descricao} idade={animal.idade} sexo={animal.sexo} 
                    porte={animal.porte} cidade={animal.parceiro.cidade} estado={animal.parceiro.estado} obs={animal.obs} especie={animal.especie}
                    fotos={fotos} href={`/parceiro/editar-pet/${id}`} /> 
                : ""
            }
        </div>
    );
}