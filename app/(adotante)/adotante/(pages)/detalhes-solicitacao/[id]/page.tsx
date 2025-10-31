"use client"

import LinkButton from "@/components/LinkButton";
import AnimalPresentation from "@/components/AnimalPresentation";

import { X } from "lucide-react";

import Cookies from "js-cookie";
import { useState, useEffect, use } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// tipagem de dados do animal
interface Animal {
    id: number;
    nome: string;
    especie: string;
    idade: number;
    descricao: string;
    porte: string;
    sexo: string;
    status: string;
    statusAdocao: string;
    dataAdocao: string;
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

export default function DetalhesSolicitacao({ params }: { params: Promise<{ id: string }> }) {
    // dados de autenticação do usuário
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    const { id } = use(params); // pega o id da solicitação pela URL

    const [animal, setAnimal] = useState<Animal | null>(null); // armazena dados do animal
    const [status, setStatus] = useState(undefined); // armazena o status da solicitação
    const [dataAdocao, setDataAdocao] = useState(undefined); // armazena a data da solicitação 
    const [fotos, setFotos] = useState([]); // armazena as fotos

    const [loading, setLoading] = useState(true); // estado de loading da página

    const router = useRouter(); // hook de roteamento

    useEffect(() => {
        // redireciona para o login se o usuário não estiver autenticado
        if (!token || !userId) {
            window.location.href = "/login";
            return;
        }

        // carrega dados da solicitação de adoção
        async function carregarSolicitacao() {
            try {
                // obtém os dados da solicitação
                const response = await fetch(`https://miaudote-8av5.onrender.com/adocoes/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                
                // se der erro, exibe um alerta
                if (!response.ok) {
                    let errorMsg = "Erro ao obter solicitação de adoção!";
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

                const data = await response.json(); // armazena  os dados da solicitação

                // armazena os dados variados
                const statusAdocao = data.adocao.status;
                const dataAdocao = data.adocao.dataCadastro;
                const animal = data.adocao.animal;
                const fotos = data.fotos.map((item: { foto: string; }) => item.foto);

                // seta os dados variados
                setAnimal(animal);
                setStatus(statusAdocao);
                setDataAdocao(dataAdocao);
                setFotos(fotos);
            } catch (error) {
                // envia um alerta para o usuário caso não haja conexão com o servidor
                Swal.fire({
                    position: "top",
                    icon: "error",
                    title: "Erro de conexão com o servidor!",
                    showConfirmButton: false,
                    timer: 2000,
                });
            } finally {
                setLoading(false); // termina o carregamento da página
            }
        }

        carregarSolicitacao(); // chama a função quando a URL termina de ser lida
    }, [id]);

    // função para excluir conta
    const handleCancelaAdocao = async () => {
        // modal de confirmação
        const confirm = await Swal.fire({
            title: "Tem certeza?",
            text: "Essa ação não poderá ser desfeita.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F35D5D",
            cancelButtonColor: "#1B998B",
            confirmButtonText: "Sim, cancelar solicitação",
            cancelButtonText: "Voltar",
        });

        if (!confirm.isConfirmed) return; // caso o usuário cancele a ação, não faz nada

        try {
            // chama o PATCH da API, alterando o status da solicitação
            const response = await fetch(`https://miaudote-8av5.onrender.com/adocoes/${id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    status: "Finalizada por desistência do adotante" 
                }),
            });

            // se der erro, exibe um alerta
            if (!response.ok) {
                let errorMsg = "Erro ao cancelar solicitação de adoção!";
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

            // mensagem de sucesso
            Swal.fire({
                position: "top",
                icon: "success",
                title: "Adoção cancelada com sucesso!",
                showConfirmButton: false,
                timer: 1500,
            });

            router.push("/adotante/solicitacoes"); // envia o usuário para a página de solicitações

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
    };

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
            
            <div className="w-full lxl:absolute lxl:top-10 lxl:pl-10">
                <LinkButton href={"/adotante/solicitacoes"} text="Voltar" color="white" back={true} />
            </div>

            {/* se o animal estiver definido, apresenta seus dados */}
            {animal 
                ? <AnimalPresentation tipo="solicitacao" nome={animal.nome} descricao={animal.descricao} idade={animal.idade} sexo={animal.sexo} 
                    porte={animal.porte} cidade={animal.parceiro.cidade} estado={animal.parceiro.estado} obs={animal.obs} especie={animal.especie}
                    fotos={fotos} href="#" telefone={animal.parceiro.telefone} onOpenModalCancela={handleCancelaAdocao} status={status} dataAdocao={dataAdocao} /> 
                : ""
            }

        </div>
    );
}