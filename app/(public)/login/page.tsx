"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import LinkButton from "@/components/LinkButton";
import InputField from "@/components/InputField";
import FormButton from "@/components/FormButton";

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
    email: z.email("E-mail inválido"),
    senha: z.string().min(1, "Senha obrigatória")
})

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const { 
        register, 
        handleSubmit, 
        setValue,
        formState: { errors }, 
    } = useForm<LoginForm>({ 
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginForm) => { 
        console.log("ok", data); 
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
            bg-[url('/grafo_fundo.png')] bg-no-repeat bg-cover bg-center">
            <div className="w-full max-w-[300px] md:max-w-[340px] lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/"} text="Voltar" color="white" back={true} />
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-4 xl:gap-6 items-center
                w-full max-w-[300px] md:max-w-[340px] 2xl:max-w-[380px] px-5 md:px-6 lg:px-8 py-6 rounded-4xl ">
                <Link href={"/"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <Image src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </Link>

                <div className="flex flex-col gap-2 lg:gap-3 w-full">
                    <InputField label="E-mail *" maxLength={200} {...register("email")} error={errors.email?.message} 
                        name="email" type="text" placeholder="Digite seu e-mail" className="mb-2" />
                    <InputField label="Senha *" maxLength={70} {...register("senha")} error={errors.senha?.message} 
                        name="senha" type="password" placeholder="Digite sua senha" className="mb-2" />
                </div>

                <FormButton text="Entrar" color="purple" type="submit" className="mt-2" />

                <div className="w-full text-center text-sm md:text-base text-miau-purple hover:text-miau-green active:text-miau-light-green">
                    <Link href="/tipo-cadastro">Ainda não possui conta? Cadastre-se!</Link>
                </div>

            </form>
        </div>
    );
}