"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    telefone: z.string().regex(/^\(\d{2}\)\s(9\d{4}-\d{4}|\d{4}-\d{4})$/, "Telefone inválido"), 
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
    cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"), 
    estado: z.string().min(2, "Estado obrigatório"), 
    bairro: z.string().min(2, "Bairro obrigatório"), 
    cidade: z.string().min(2, "Cidade obrigatória"), 
    logradouro: z.string().min(2, "Logradouro obrigatório"), 
    numero: z.string().regex(/^\d+$/, "Número inválido"), 
    complemento: z.string().optional(), });
            
type CadastroForm = z.infer<typeof cadastroSchema>;

export default function CadastroParceiro() {
    const router = useRouter();

    const { 
        register, 
        handleSubmit, 
        setValue,
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
        sessionStorage.setItem("justRegistered", "parceiro");
        router.push("/confirmacao?role=parceiro")
    };


    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
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
                        <InputField label="Nome da ONG/protetor *" {...register("nome")} error={errors.nome?.message} name="nome" type="text" placeholder="Digite o nome" className="mb-2" />
                        <SelectField defaultValue={""} {...register("tipo")} error={errors.tipo?.message} label="Tipo *" name="tipo" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione o tipo</option>
                            <option value="ONG">ONG</option>
                            <option value="Protetor">Protetor</option>
                        </SelectField>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="CNPJ ou CPF *" {...register("documento")} error={errors.documento?.message} mask={[{mask: "000.000.000-00", overwrite: true}, {mask: "00.000.000/0000-00", overwrite: true}]} name="documento" type="text" placeholder="Digite o CNPJ ou CPF" className="mb-2" />
                        <InputField label="E-mail *" {...register("email")} error={errors.email?.message} name="email" type="text" placeholder="Digite o e-mail" className="mb-2" />
                        <InputField label="Telefone *" {...register("telefone")} error={errors.telefone?.message} mask={[{mask: "(00) 0000-0000", overwrite: true}, {mask: "(00) 00000-0000", overwrite: true}]} name="telefone" type="text" placeholder="Digite o telefone" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Senha *" {...register("senha")} error={errors.senha?.message} name="senha" type="password" placeholder="Crie uma senha" className="mb-2" />
                        <InputField label="Site ou rede social" {...register("site")} error={errors.site?.message} name="site" type="text" placeholder="Link do site ou rede social" className="mb-2" />
                    </div>

                </div>

                <div className="flex flex-col gap-1 self-start w-full">
                    <h2 className="text-miau-green text-sm lg:text-base font-medium">Endereço</h2>
                    <hr className="border-hr" />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="CEP *" {...register("cep", {onBlur: (e) => buscarCep(e.target.value)})} error={errors.cep?.message} mask={"00000-000"} name="cep" type="text" placeholder="Digite o CEP" className="mb-2" />
                        <InputField label="Logradouro *" {...register("logradouro")} error={errors.logradouro?.message} name="logradouro" type="text" placeholder="Digite o logradouro" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Cidade *" {...register("cidade")} error={errors.cidade?.message} name="cidade" type="text" placeholder="Digite a cidade" className="mb-2" />
                        <InputField label="Bairro *" {...register("bairro")} error={errors.bairro?.message} name="bairro" type="text" placeholder="Digite o bairro" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Estado *" {...register("estado")} error={errors.estado?.message} name="estado" type="text" placeholder="Digite o estado" className="mb-2" />
                        <InputField label="Número *" {...register("numero")} error={errors.numero?.message} name="numero" type="text" placeholder="Digite o número" className="mb-2" />
                        <InputField label="Complemento (opcional)" {...register("complemento")} error={errors.complemento?.message} name="complemento" type="text" placeholder="Digite o complemento" className="mb-2" />
                    </div>
                </div>

                <FormButton text="Confirmar cadastro" color="green" type="submit" className="mt-2" />

                <div className="w-full text-center text-md text-miau-orange hover:text-miau-green active:text-miau-light-green">
                    <Link href="/login">Já possui uma conta? Faça login</Link>
                </div>

            </form>
        </div>
    );

}

