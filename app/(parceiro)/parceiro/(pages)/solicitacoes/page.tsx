import { CirclePlus } from "lucide-react";
import Link from "next/link";
import RequestCard from "@/components/RequestCard";

export default function SolicitacoesAdocao(){
    return (
        <div className="flex flex-col gap-6 px-4 sm:px-16 md:px-20 lg:px-30 py-4 sm:py-8 lg:py-10 ">
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl">Solicitações de adoção</h1>
                <h2 className="text-base 2xl:text-lg">Visualize e gerencie suas solicitações de adoção.</h2>
            </div>

            <div className="flex flex-col plg:flex-row plg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start">
                <RequestCard />
                <RequestCard />
                <RequestCard />
                <RequestCard />

            </div>
        </div>
    );
}