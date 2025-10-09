"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import LinkButton from "@/components/LinkButton";
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
        if (val.length < 10) {
            ctx.addIssue({
            code: "custom",
            message: "Data inválida",
            });
            return;
        }
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
    numero: z.string().regex(/^\d+$/, "Número inválido, use apenas números"), 
    complemento: z.string().optional(), }).refine((data) => 
        data.senha === data.confSenha, { 
            message: "As senhas não coincidem", 
            path: ["confSenha"], }); 
            
type CadastroForm = z.infer<typeof cadastroSchema>;

export default function PerfilAdotante() {
    const router = useRouter();
    
    const { 
        register, 
        handleSubmit, 
        setValue,
        clearErrors,
        formState: { errors }, 
    } = useForm<CadastroForm>({ 
        resolver: zodResolver(cadastroSchema),
        mode: "all" 
    });

    const buscarCep = async (cep: string) => {
        const cepNumerico = cep.replace(/\D/g, "");
        if (cepNumerico.length !== 8) return;

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
            const data = await res.json();

            if (!data.erro) {
            setValue("logradouro", data.logradouro || "", { shouldValidate: true });
            setValue("bairro", data.bairro || "", { shouldValidate: true });
            setValue("cidade", data.localidade || "", { shouldValidate: true });
            setValue("estado", data.uf || "", { shouldValidate: true });
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    };


    const onSubmit = (data: CadastroForm) => { 
        console.log("ok", data); 
    };
    
    return (
        <div className="flex flex-col gap-6 px-4 sm:px-16 md:px-20 lg:px-30 py-4 sm:py-8 lg:py-10 ">
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl">Meus perfil</h1>
                <h2 className="text-base 2xl:text-lg">Configurações do perfil pessoal</h2>
            </div>

            <div className="w-full items-center justify-center flex">

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-3 items-center w-full px-3 ssm:px-8 sm:px-12 xl:px-24 pt-6 pb-10 rounded-4xl">
                    <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center">
                        Informações básicas</h1>
                    <div className="flex flex-col gap-1 self-start w-full">
                        <h2 className="text-miau-green text-sm lg:text-base font-medium">Dados pessoais</h2>
                        <hr className="border-hr" />
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                            <InputField label="Nome completo *" maxLength={100} {...register("nome")} onFocus={() => clearErrors("nome")} 
                                error={errors.nome?.message} name="nome" type="text" placeholder="Digite seu nome e sobrenome" className="mb-2" />
                            <InputField label="Celular / WhatsApp *" {...register("telefone")} onFocus={() => clearErrors("telefone")} 
                                error={errors.telefone?.message} name="telefone" mask={"(00) 00000-0000"} type="text" inputMode="numeric" 
                                placeholder="(00) 00000-0000" className="mb-2" />
                            <div className="sm:col-span-2 lg:col-span-1">
                                <InputField label="E-mail *" maxLength={200} {...register("email")} onFocus={() => clearErrors("email")} 
                                    error={errors.email?.message} name="email" type="text" placeholder="Digite seu e-mail" className="mb-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                            <InputField label="Data de nascimento *" {...register("dataNasc")} onFocus={() => clearErrors("dataNasc")} 
                                error={errors.dataNasc?.message} mask={"00/00/0000"} name="dataNasc" type="text" placeholder="Digite sua data de nascimento" className="mb-2" />
                            <InputField label="Senha *" maxLength={70} {...register("senha")} onFocus={() => clearErrors("senha")} 
                                error={errors.senha?.message} name="senha" type="password" placeholder="Crie uma senha" className="mb-2" />
                            <div className="sm:col-span-2 lg:col-span-1">
                                <InputField label="Confirmar senha *" {...register("confSenha")} onFocus={() => clearErrors("confSenha")} 
                                    error={errors.confSenha?.message} name="confSenha" type="password" placeholder="Digite a senha novamente" className="mb-2" />
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col gap-1 self-start w-full">
                        <h2 className="text-miau-green text-sm lg:text-base font-medium">Endereço</h2>
                        <hr className="border-hr" />
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                            <InputField label="CEP *" {...register("cep", {onBlur: (e) => buscarCep(e.target.value)})} onFocus={() => clearErrors("cep")} 
                                error={errors.cep?.message} mask={"00000-000"} name="cep" type="text" inputMode="numeric" placeholder="Digite seu CEP" className="mb-2" />
                            <InputField label="Cidade *" maxLength={40} {...register("cidade")} onFocus={() => clearErrors("cidade")} 
                                error={errors.cidade?.message} name="cidade" type="text" placeholder="Digite a cidade" className="mb-2" />
                            <div className="sm:col-span-2 lg:col-span-1">
                                <InputField label="Logradouro *" maxLength={200} {...register("logradouro")} onFocus={() => clearErrors("logradouro")} 
                                    error={errors.logradouro?.message} name="logradouro" type="text" placeholder="Digite o logradouro" className="mb-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-3">
                            <InputField label="Bairro *" maxLength={70} {...register("bairro")} onFocus={() => clearErrors("bairro")} 
                                error={errors.bairro?.message} name="bairro" type="text" placeholder="Digite o bairro" className="mb-2" />
                            <InputField label="Estado *" maxLength={2} {...register("estado")} onFocus={() => clearErrors("estado")} 
                                error={errors.estado?.message} name="estado" type="text" placeholder="Digite o estado" className="mb-2" />
                            <InputField label="Número *" maxLength={10} {...register("numero")} onFocus={() => clearErrors("numero")} 
                                error={errors.numero?.message} name="numero" type="text" inputMode="numeric" placeholder="Digite o número" className="mb-2" />
                            <InputField label="Complemento (opcional)" maxLength={100} {...register("complemento")} onFocus={() => clearErrors("complemento")} 
                                error={errors.complemento?.message} name="complemento" type="text" placeholder="Digite o complemento" className="mb-2" />
                        </div>
                    </div>

                    <FormButton text="Salvar alterações" color="green" type="submit" className="mt-2" />

                </form>
            </div>
        </div>
    );
}