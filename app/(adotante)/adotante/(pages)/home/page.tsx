"use client"

import Link from "next/link";
import AnimalCard from "@/components/AnimalCard";
import SelectField from "@/components/SelectField";
import { useState, useEffect } from "react";

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
  favoritoId: number | null;
}

export default function homeAdotante(){
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [animaisFiltrados, setAnimaisFiltrados] = useState<Animal[]>([]);

    const [loading, setLoading] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const [filtroEspecie, setFiltroEspecie] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroSexo, setFiltroSexo] = useState("");
    const [filtrosAplicados, setFiltrosAplicados] = useState(false);

    function aplicarFiltros() {
        let filtrados = animais;

        if (filtroEspecie) {
            filtrados = filtrados.filter((a) =>
            a.especie.toLowerCase() === filtroEspecie.toLowerCase()
            );
        }

        if (filtroEstado) {
            filtrados = filtrados.filter((a) =>
            a.estado.toLowerCase() === filtroEstado.toLowerCase()
            );
        }

        if (filtroSexo) {
            filtrados = filtrados.filter((a) =>
            a.sexo.toLowerCase() === filtroSexo.toLowerCase()
            );
        }

        setAnimaisFiltrados(filtrados);
    }

    useEffect(() => {
        carregarAnimais();
    }, [paginaAtual]);

    async function carregarAnimais() {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:8080/fotos/pagina/${paginaAtual}/36`);
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
          favoritoId: item.favoritoId,
        }));

        setAnimais(listaAnimais);
        setAnimaisFiltrados(listaAnimais);
      } catch (error) {
        console.error("Erro ao carregar animais:", error);
      } finally {
        setLoading(false);
      }
    }

    async function handleFavorito(idPet: number, favorito: boolean, favoritoId: number | null) {
        try {
            setLoading(true);

            if (favorito && favoritoId !== null) {
            // 🔥 Remover dos favoritos
            const response = await fetch(`http://localhost:8080/favoritos/${favoritoId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Erro ao remover favorito");

            setAnimais((prev) =>
                prev.map((animal) =>
                animal.id === idPet ? { ...animal, favorito: false, favoritoId: null } : animal
                )
            );
            } else {
            // 💚 Adicionar aos favoritos
            const response = await fetch("http://localhost:8080/favoritos/cadastrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                adotanteId: 36, // seu ID de adotante fixo
                animalId: idPet,
                }),
            });
            if (!response.ok) throw new Error("Erro ao adicionar favorito");

            const novoFav = await response.json(); // backend retorna o id do favorito

            setAnimais((prev) =>
                prev.map((animal) =>
                animal.id === idPet
                    ? { ...animal, favorito: true, favoritoId: novoFav.id }
                    : animal
                )
            );
            }

        } catch (error) {
            console.error(error);
            alert("Não foi possível atualizar os favoritos.");
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
        <div className="flex flex-col gap-6 px-4 sm:px-16 md:px-20 lg:px-30 py-4 sm:py-8 lg:py-10 w-full">
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl text-center">Pets disponíveis para adoção</h1>
            </div>

            <div className="flex flex-col plg:flex-row justify-between items-center plg:gap-2 lg:gap-4 mb-4">
                <div className="flex flex-col xsm:flex-row gap-1 xsm:gap-2 lg:gap-4 w-full">

                    <SelectField name="filtroEspecie" label="Espécie" className="appearance-none mb-2"
                        value={filtroEspecie} onChange={(e) => setFiltroEspecie(e.target.value)} >
                        <option value={""} disabled>Pesquise por espécie</option>
                        <option value="Cachorro">Cão</option>
                        <option value="Gato">Gato</option>
                    </SelectField>

                    <SelectField name="filtroEstado" label="Estado" className="appearance-none mb-2"
                        value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} >
                        <option value={""} disabled>Pesquise por estado</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                    </SelectField>

                    <SelectField name="filtroSexo" label="Sexo" className="appearance-none mb-2"
                        value={filtroSexo} onChange={(e) => setFiltroSexo(e.target.value)} >
                        <option value={""} disabled>Pesquise por sexo</option>
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                    </SelectField>
                </div>

                <button onClick={aplicarFiltros} className={`w-full plg:w-[220px] mt-4 text-lg xl:text-xl px-8 py-2 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                    shadow-[0_4px_4px_rgba(0,0,0,0.25)] h-fit bg-miau-purple hover:bg-miau-light-green active:bg-miau-light-green`}>
                    Aplicar filtros
                </button>
            </div>

            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start">
                {animaisFiltrados.length > 0 ? (
                    animaisFiltrados.map((animal) => (
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
                        favorito={animal.favorito}
                        favoritoId={animal.favoritoId}
                        onToggleFavorito={handleFavorito}
                    />
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