"use client"

import LinkButton from "@/components/LinkButton";
import Image from "next/image";
import InputField from "@/components/InputField";
import FormButton from "@/components/FormButton";
import { validaCPF } from "@/utils/validaCPF";
import { validaIdade } from "@/utils/validaIdade";
import { validaSenha } from "@/utils/validaSenha";

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

const cadastroSchema = z.object({ 
    nome: z.string().min(2, "Nome é obrigatório"), 
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido").refine((cpf) => 
        validaCPF(cpf), { message: "CPF inválido" }),
    email: z.email("E-mail inválido"), 
    telefone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido"), 
    dataNasc: z.string().superRefine((val, ctx) => {
      const { valido, mensagem } = validaIdade(val, 16);
      if (!valido) {
        ctx.addIssue({
          code: "custom",
          message: mensagem ?? "Data inválida",
        });
      }
    }),
    senha: z.string().superRefine((val, ctx) => {
        const {valido, mensagem} = validaSenha(val, 8);
        if (!valido) {
            ctx.addIssue({
                code: "custom",
                message: mensagem ?? "Senha inválida",
            });
        }
    }), 
    confSenha: z.string().min(8, "As senhas devem coincidir"), 
    cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"), 
    estado: z.string().min(2, "Estado obrigatório"), 
    bairro: z.string().min(2, "Bairro obrigatório"), 
    cidade: z.string().min(2, "Cidade obrigatória"), 
    logradouro: z.string().min(2, "Logradouro obrigatório"), 
    numero: z.string().min(1, "Número obrigatório"), 
    complemento: z.string().optional(), }).refine((data) => 
        data.senha === data.confSenha, { 
            message: "As senhas não coincidem", 
            path: ["confSenha"], }); 
            
type CadastroForm = z.infer<typeof cadastroSchema>;

export default function CadastroAdotante() {
    const { 
        register, 
        handleSubmit, 
        setValue,
        formState: { errors }, 
    } = useForm<CadastroForm>({ 
        resolver: zodResolver(cadastroSchema), 
    });

    const buscarCep = async (cep: string) => {
        const cepNumerico = cep.replace(/\D/g, "");
        if (cepNumerico.length !== 8) return;

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
            const data = await res.json();

            if (!data.erro) {
            setValue("logradouro", data.logradouro || "");
            setValue("bairro", data.bairro || "");
            setValue("cidade", data.localidade || "");
            setValue("estado", data.uf || "");
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    };


    const onSubmit = (data: CadastroForm) => { 
        console.log("ok", data); 
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
            <div className="w-full max-w-4xl lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/tipo-cadastro"} text="Voltar" color="white" back={true} />
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-3 items-center w-full max-w-4xl px-3 md:px-6 lg:px-12 py-6 rounded-4xl">
                <div className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <Image src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </div>
                <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center">
                    Informações básicas</h1>
                <div className="flex flex-col gap-1 self-start w-full">
                    <h2 className="text-miau-green text-sm lg:text-base font-medium">Dados pessoais</h2>
                    <hr className="border-hr" />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Nome completo *" {...register("nome")} error={errors.nome?.message} name="nome" type="text" placeholder="Digite seu nome e sobrenome" className="mb-2" />
                        <InputField label="CPF *" {...register("cpf")} error={errors.cpf?.message} mask={"000.000.000-00"} name="cpf" inputMode="numeric" type="text" placeholder="Digite seu CPF" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="E-mail *" {...register("email")} error={errors.email?.message} name="email" type="text" placeholder="Digite seu e-mail" className="mb-2" />
                        <InputField label="Telefone *" {...register("telefone")} error={errors.telefone?.message} name="telefone" mask={"(00) 00000-0000"} type="text" inputMode="numeric" placeholder="(00) 00000-0000" className="mb-2" />
                        <InputField label="Data de nascimento *" {...register("dataNasc")} error={errors.dataNasc?.message} mask={"00/00/0000"} name="dataNasc" type="text" placeholder="Digite sua data de nascimento" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Senha *" {...register("senha")} error={errors.senha?.message} name="senha" type="password" placeholder="Crie uma senha" className="mb-2" />
                        <InputField label="Confirmar senha *" {...register("confSenha")} error={errors.confSenha?.message} name="confSenha" type="password" placeholder="Digite a senha" className="mb-2" />
                    </div>

                </div>

                <div className="flex flex-col gap-1 self-start w-full">
                    <h2 className="text-miau-green text-sm lg:text-base font-medium">Endereço</h2>
                    <hr className="border-hr" />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="CEP *" {...register("cep", {onBlur: (e) => buscarCep(e.target.value)})} error={errors.cep?.message} mask={"00000-000"} name="cep" type="text" inputMode="numeric" placeholder="Digite o CEP" className="mb-2" />
                        <InputField label="Estado *" {...register("estado")} error={errors.estado?.message} name="estado" type="text" placeholder="Digite o estado" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Bairro *" {...register("bairro")} error={errors.bairro?.message} name="bairro" type="text" placeholder="Digite o bairro" className="mb-2" />
                        <InputField label="Cidade *" {...register("cidade")} error={errors.cidade?.message} name="cidade" type="text" placeholder="Digite a cidade" className="mb-2" />
                    </div>

                    <InputField label="Logradouro *" {...register("logradouro")} error={errors.logradouro?.message} name="logradouro" type="text" placeholder="Digite o logradouro" className="mb-2" />

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Número *" {...register("numero")} error={errors.numero?.message} name="numero" type="text" inputMode="numeric" placeholder="Digite o número" className="mb-2" />
                        <InputField label="Complemento" {...register("complemento")} error={errors.complemento?.message} name="complemento" type="text" placeholder="Digite o complemento" className="mb-2" />
                    </div>
                </div>

                <FormButton text="Cadastrar-se" color="green" type="submit" />

            </form>
        </div>
    );
}

