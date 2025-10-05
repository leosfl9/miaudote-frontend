"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import LinkButton from "@/components/LinkButton";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import TextAreaField from "@/components/TextAreaField";
import FormButton from "@/components/FormButton";

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

import { Pencil } from "lucide-react";

const petSchema = z.object({
    nome: z.string().min(2, "Nome é obrigatório"),
    especie: z.string().min(1, "Selecione a espécie"),
    idade: z.string().min(1, "Idade é obrigatória"),
    sexo: z.string().min(1, "Selecione o sexo"),
    porte: z.string().min(1, "Selecione o porte"),
    obs: z.string().optional(),
    descricao: z.string().optional(), });

type PetForm = z.infer<typeof petSchema>

export default function CadastroPet() {

    const { 
        register, 
        handleSubmit, 
        clearErrors,
        formState: { errors }, 
    } = useForm<PetForm>({ 
        resolver: zodResolver(petSchema),
        mode: "all",
        shouldFocusError: false,
    });

    const onSubmit = (data: PetForm) => { 
        console.log("ok", data); 
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
            bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
            <div className="w-full max-w-[640px] lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/parceiro/home"} text="Voltar" color="white" back={true} />
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-3 items-center w-full max-w-[640px] px-3 md:px-6 lg:px-12 py-6 rounded-4xl">
                <Link href={"/parceiro/home"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <Image src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </Link>
                <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center mb-2">
                    Cadastrar novo Pet</h1>

                <div className="flex flex-col w-full gap-2">
                    <label htmlFor="fotos" className="flex flex-col gap-5 border-1 border-input-bd items-center py-3 rounded-md cursor-pointer mb-2 text-text-gray ">
                        <Pencil className="w-6 h-6" />
                        <p className="text-sm ssm:text-base">Clique para adicionar fotos (5 máx.)</p>
                    </label>
                    <input id="fotos" type="file" hidden />

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

                    <div className="flex flex-col gap-2 lg:gap-3">
                        <InputField label="Observações importantes" {...register("obs")} onFocus={() => clearErrors("obs")}  
                            error={errors.obs?.message} name="obs" type="text" placeholder="Ex.: FIV/FELV positivo, castrado..." className="mb-2" />
                        <TextAreaField label="Descrição do pet" rows={5} {...register("descricao")} onFocus={() => clearErrors("descricao")}
                            error={errors.descricao?.message} name="descricao" placeholder="Descreva brevemente o comportamento do pet" className="mb-2" />
                    </div>

                </div>

                <FormButton text="Cadastrar Pet" color="green" type="submit" className="mt-2 mb-2" />

            </form>
        </div>
    );

}