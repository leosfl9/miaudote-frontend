"use client";

import Link from "next/link";
import NextImage from "next/image";
import { useState, useEffect, use } from "react";

import LinkButton from "@/components/LinkButton";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import TextAreaField from "@/components/TextAreaField";
import FormButton from "@/components/FormButton";

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

// import { Pencil } from "lucide-react";
// import Cropper from "react-easy-crop";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const petSchema = z.object({
    nome: z.string().min(2, "Nome é obrigatório"),
    especie: z.string().min(1, "Selecione a espécie"),
    idade: z.number().min(1, "Idade é obrigatória"),
    sexo: z.string().min(1, "Selecione o sexo"),
    porte: z.string().min(1, "Selecione o porte"),
    status: z.string().min(1, "Selecione o status"),
    obs: z.string().optional(),
    descricao: z.string().optional(),
});

type PetForm = z.infer<typeof petSchema>;

export default function EditarPet({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const { 
        register, 
        handleSubmit, 
        clearErrors,
        formState: { errors }, 
        setValue,
    } = useForm<PetForm>({ 
        resolver: zodResolver(petSchema),
        mode: "all",
        shouldFocusError: false,
    });

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const res = await fetch(`http://localhost:8080/animais/${id}`);
                if (!res.ok) throw new Error("Erro ao buscar animal");

                const animal = await res.json();
                console.log(animal);

                setValue("nome", animal.nome ?? "");
                setValue("especie", animal.especie ?? "");
                setValue("idade", animal.idade ?? "");
                setValue("sexo", animal.sexo ?? "");
                setValue("status", animal.status ?? "");
                setValue("porte", animal.porte ?? "");
                setValue("obs", animal.obs ?? "");
                setValue("descricao", animal.descricao ?? "");

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimal();
    }, [setValue]);

    const onSubmit = async (data: PetForm) => {
        try {
            setSending(true);

            const payload = {
                parceiroId: 37,
                especie: data.especie,
                nome: data.nome,
                sexo: data.sexo,
                porte: data.porte,
                status: data.status,
                idadeInicial: (data.idade).toString(),
                obs: data.obs || "",
                descricao: data.descricao || "",
            };

            const response = await fetch(`http://localhost:8080/animais/${id}/parceiro/37`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            Swal.fire({
                position: "top",
                icon: "success",
                title: "Alterações salvas!",
                showConfirmButton: false,
                timer: 1500
            });

            router.push("/parceiro/home");

            if (!response.ok) {
                Swal.fire({
                    position: "top",
                    icon: "error",
                    title: "Erro ao editar!",
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }

        } catch (error) {
            console.error("Erro ao editar:", error);
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Erro ao editar!",
                showConfirmButton: false,
                timer: 1500
            });
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="absolute w-screen h-screen flex flex-col gap-4 items-center justify-center bg-miau-purple">
                <div className="w-10 h-10 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                <p className="text-background font-medium text-xl">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
            bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
            
            <div className="w-full max-w-[640px] lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/parceiro/home"} text="Voltar" color="white" back={true} />
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-3 items-center w-full max-w-[640px] px-3 md:px-6 lg:px-12 py-6 rounded-4xl">
                <Link href={"/parceiro/home"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <NextImage src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </Link>
                <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center mb-2">
                    Editar Pet</h1>

                <div className="flex flex-col w-full gap-2">

                    <div className="flex flex-col ssm:flex-row gap-2 lg:gap-3">
                        <InputField label="Nome do pet *" maxLength={100} {...register("nome")} onFocus={() => clearErrors("nome")} 
                            error={errors.nome?.message} name="nome" type="text" placeholder="Digite o nome do pet" className="mb-2" />
                        <SelectField defaultValue={""} {...register("especie")} onFocus={() => clearErrors("especie")}  
                            error={errors.especie?.message} label="Espécie *" name="especie" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione uma opção</option>
                            <option value="Cachorro">Cão</option>
                            <option value="Gato">Gato</option>
                        </SelectField>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Idade do pet (em anos) *" {...register("idade")} onFocus={() => clearErrors("idade")}  
                            error={errors.idade?.message} mask={"000"} name="idade" type="text" placeholder="Digite a idade do pet" className="mb-2" />
                        <SelectField defaultValue={""} {...register("sexo")} onFocus={() => clearErrors("sexo")}
                            error={errors.sexo?.message} label="Sexo do pet *" name="sexo" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione uma opção</option>
                            <option value="Macho">Macho</option>
                            <option value="Fêmea">Fêmea</option>
                        </SelectField>
                        <SelectField defaultValue={""} {...register("porte")} onFocus={() => clearErrors("porte")}
                            error={errors.porte?.message} label="Porte do pet *" name="porte" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione uma opção</option>
                            <option value="Pequeno">Pequeno</option>
                            <option value="Médio">Médio</option>
                            <option value="Grande">Grande</option>
                        </SelectField>
                    </div>

                    <div>
                        <SelectField defaultValue={""} {...register("status")} onFocus={() => clearErrors("status")}
                            error={errors.status?.message} label="Status do pet *" name="status" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione uma opção</option>
                            <option value="Disponível">Disponível</option>
                            <option value="Adotado">Adotado</option>
                            <option value="Indisponível">Indisponível</option>
                        </SelectField>
                    </div>

                    <div className="flex flex-col gap-2 lg:gap-3">
                        <InputField label="Observações importantes" {...register("obs")} onFocus={() => clearErrors("obs")}  
                            error={errors.obs?.message} name="obs" type="text" placeholder="Ex.: FIV/FELV positivo, castrado..." className="mb-2" />
                        <TextAreaField label="Descrição do pet" rows={5} {...register("descricao")} onFocus={() => clearErrors("descricao")}
                            error={errors.descricao?.message} name="descricao" placeholder="Descreva brevemente o comportamento do pet" className="mb-2" />
                    </div>

                </div>

                <FormButton text="Salvar alterações" color={`${sending ? "disabled" : "green"}`} type="submit" className="mt-2 mb-2" disabled={sending} />
            </form>

        </div>
    );
}