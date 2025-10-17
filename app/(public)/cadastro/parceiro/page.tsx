"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import LinkButton from "@/components/LinkButton";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import FormButton from "@/components/FormButton";
import { validaCPF } from "@/utils/validaCPF";
import { validaCNPJ } from "@/utils/validaCNPJ";
import { validaSenha } from "@/utils/validaSenha";

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

import Swal from "sweetalert2";

const cadastroSchema = z.object({ 
    nome: z.string().min(2, "Nome é obrigatório"), 
    tipo: z.string().min(1, "Selecione o tipo"),
    email: z.email("E-mail inválido"), 
    documento: z.string().superRefine((val, ctx) => {
        const limpo = val.replace(/\D/g, "");

        const valido = 
            (limpo.length === 11 && validaCPF(val)) ||
            (limpo.length === 14 && validaCNPJ(val));

        if (!valido) {
            ctx.addIssue({
            code: "custom",
            message: "Número de documento inválido",
            });
        }
    }),
    telefone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido"), 
    senha: z.string().superRefine((val, ctx) => {
        const {valido, mensagem} = validaSenha(val, 8);
        if (!valido) {
            ctx.addIssue({
                code: "custom",
                message: mensagem ?? "Senha inválida",
            });
        }
    }), 
    site: z.string().optional(),
    estado: z.string().min(2, "Estado obrigatório"), 
    cidade: z.string().min(2, "Cidade obrigatória"), });
            
type CadastroForm = z.infer<typeof cadastroSchema>;

export default function CadastroParceiro() {
    const [sending, setSending] = useState(false);

    const router = useRouter();

    const { 
        register, 
        handleSubmit, 
        clearErrors,
        formState: { errors }, 
    } = useForm<CadastroForm>({ 
        resolver: zodResolver(cadastroSchema),
        mode: "all" 
    });

    const onSubmit = async (data: CadastroForm) => {
        try {
            setSending(true);

            const payload = {
                documento: data.documento.replace(/\D/g, ''),
                tipo: data.tipo,
                site: data.site,
                usuario: {
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    estado: data.estado,
                    cidade: data.cidade,
                    telefone: data.telefone.replace(/\D/g, ''),
                },
            };

            console.log("Enviando dados:", payload);

            const response = await fetch("http://localhost:8080/parceiros/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                Swal.fire({
                    position: "top",
                    icon: "error",
                    title: "Erro ao cadastrar!",
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }

            console.log("Cadastro realizado com sucesso!");
            sessionStorage.setItem("justRegistered", "parceiro");
            router.push("/confirmacao?role=parceiro");

        } catch (error) {
            console.error("Erro ao enviar cadastro:", error);
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Erro ao cadastrar!",
                showConfirmButton: false,
                timer: 1500
            });
            
        } finally {
            setSending(false);
        }
    };


    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
            bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
            <div className="w-full max-w-4xl lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/tipo-cadastro"} text="Voltar" color="white" back={true} />
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-3 items-center w-full max-w-4xl px-3 md:px-6 lg:px-12 py-6 rounded-4xl">
                <Link href={"/"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <Image src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </Link>
                <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center">
                    Informações básicas</h1>
                <div className="flex flex-col gap-1 self-start w-full">
                    <h2 className="text-miau-green text-sm lg:text-base font-medium">Dados da ONG/protetor</h2>
                    <hr className="border-hr" />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Nome da ONG/protetor *" maxLength={100} {...register("nome")} onFocus={() => clearErrors("nome")} 
                            error={errors.nome?.message} name="nome" type="text" placeholder="Digite o nome" className="mb-2" />
                        <SelectField defaultValue={""} {...register("tipo")} onFocus={() => clearErrors("tipo")} 
                            error={errors.tipo?.message} label="Tipo *" name="tipo" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione o tipo</option>
                            <option value="ONG">ONG</option>
                            <option value="Protetor">Protetor</option>
                        </SelectField>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="CNPJ ou CPF *" {...register("documento")} onFocus={() => clearErrors("documento")} 
                            error={errors.documento?.message} mask={[{mask: "000.000.000-00", overwrite: true}, {mask: "00.000.000/0000-00", overwrite: true}]} 
                            name="documento" type="text" placeholder="Digite o CNPJ ou CPF" className="mb-2" />
                        <InputField label="E-mail *" maxLength={200} {...register("email")} onFocus={() => clearErrors("email")} 
                            error={errors.email?.message} name="email" type="text" placeholder="Digite o e-mail" className="mb-2" />
                        <InputField label="Telefone *" {...register("telefone")} onFocus={() => clearErrors("telefone")} error={errors.telefone?.message} 
                            mask={"(00) 00000-0000"} name="telefone" type="text" placeholder="Digite o telefone" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Senha *" maxLength={70} {...register("senha")} onFocus={() => clearErrors("senha")} 
                            error={errors.senha?.message} name="senha" type="password" placeholder="Crie uma senha" className="mb-2" />
                        <InputField label="Site ou rede social" maxLength={255} {...register("site")} onFocus={() => clearErrors("site")} 
                            error={errors.site?.message} name="site" type="text" placeholder="Link do site ou rede social" className="mb-2" />
                    </div>

                </div>

                <div className="flex flex-col gap-1 self-start w-full">
                    <h2 className="text-miau-green text-sm lg:text-base font-medium">Endereço</h2>
                    <hr className="border-hr" />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <SelectField defaultValue={""} {...register("estado")} onFocus={() => clearErrors("estado")} 
                            error={errors.estado?.message} label="Estado *" name="estado" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione o estado</option>
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
                        <InputField label="Cidade *" maxLength={40} {...register("cidade")} onFocus={() => clearErrors("cidade")} 
                            error={errors.cidade?.message} name="cidade" type="text" placeholder="Digite a cidade" className="mb-2" />
                    </div>

                
                </div>

                <FormButton text={`${sending ? "Cadastrando..." : "Confirmar cadastro"}`} color={`${sending ? "disabled" : "green"}`} type="submit" 
                    className="mt-2" disabled={sending} />

                <div className="w-full text-center text-miau-orange hover:text-miau-green active:text-miau-light-green">
                    <Link href="/login">Já possui uma conta? Faça login!</Link>
                </div>

            </form>
        </div>
    );

}

