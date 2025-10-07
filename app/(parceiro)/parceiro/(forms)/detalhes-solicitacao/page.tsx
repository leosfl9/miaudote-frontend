"use client";

import Link from "next/link";
import NextImage from "next/image";
import { useState, useEffect } from "react";

import LinkButton from "@/components/LinkButton";

import Swal from "sweetalert2";


export default function DetalhesSolicitacao() {
    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
            bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
            
            <div className="w-full max-w-[600px] lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/parceiro/solicitacoes"} text="Voltar" color="white" back={true} />
            </div>
            
            <form className="bg-white flex flex-col gap-3 items-center w-full max-w-[600px] px-3 md:px-6 lg:px-12 py-6 rounded-4xl">
                <Link href={"/parceiro/home"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <NextImage src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </Link>
                <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center mb-4">
                    Solicitação de adoção</h1>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <h2 className="font-medium text-text-gray">Nome do pet</h2>
                            <h3 className="font-semibold text-text-light-gray">Bolt</h3>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-medium text-text-gray">Nome do adotante</h2>
                            <h3 className="font-semibold text-text-light-gray text-ellipsis overflow-clip">Leonardo da Silva Flores</h3>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-medium text-text-gray">CPF do adotante</h2>
                            <h3 className="font-semibold text-text-light-gray">123.456.789-10</h3>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-medium text-text-gray">Idade do adotante</h2>
                            <h3 className="font-semibold text-text-light-gray">21 anos</h3>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-medium text-text-gray">Celular do adotante</h2>
                            <h3 className="font-semibold text-text-light-gray">(11) 91339-8588</h3>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-medium text-text-gray">E-mail do adotante</h2>
                            <h3 className="font-semibold text-text-light-gray text-ellipsis overflow-clip">leonardosilvaflores29@gmail.com</h3>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-medium text-text-gray">Endereço do adotante</h2>
                            <h3 className="font-semibold text-text-light-gray text-ellipsis overflow-clip"><span>01234-567</span>, <span>
                                Estrada do Campo Limpo</span>, <span>111</span> - <span>Pirajussara</span>, <span>São Paulo</span>, <span>SP</span></h3>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col w-full">
                    <div className="flex flex-col xsm:flex-row xsm:gap-3">
                        <button className={`w-full text-lg xl:text-xl px-8 py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                            shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 bg-miau-green hover:bg-miau-light-green active:bg-miau-light-green`}>
                            Aceitar solicitação
                        </button>
                        <button className={`w-full text-lg xl:text-xl px-8 py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                            shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 bg-[#F35D5D] hover:bg-[#fA7C7C] active:bg-[#fA7C7C]`}>
                            Recusar solicitação
                        </button>
                    </div>

                    <button className={`w-full text-lg xl:text-xl px-8 py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                        shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 bg-miau-purple hover:bg-miau-purple/80 active:bg-miau-purple/80`}>
                        Contatar adotante
                    </button>
                </div>
            </form>

        </div>
    );
}
