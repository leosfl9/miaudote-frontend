import PublicNavbar from "@/components/PublicNavbar";
import Link from "next/link";

export default function Home() { 
  return ( 
    <div className="flex flex-col min-h-screen"> 
      <PublicNavbar /> 
      <div className="flex items-center justify-center px-2 ssm:px-4 py-8 bg-miau-gray flex-col flex-1"> 
        <div className="flex flex-col mxl:flex-row gap-8 mxl:gap-16 xl:gap-24"> 
          {/* texto */} 
          <div className="flex flex-col gap-8 mxl:gap-12 justify-center text-5xl xl:text-[54px] 2xl:text-6xl 3xl:!text-7xl pl-2 ssm:pl-0"> 
            <p className="text-text-black font-medium text-left"> 
              Adote <span className="font-semibold">amor</span>.</p> 
            <p className="text-text-black font-medium text-left"> 
              Transforme <span className="font-semibold">vidas</span>. </p> 
            <p className="text-text-black font-medium text-left"> 
              Viva essa <span className="font-semibold">conexão</span>.</p> 
          </div> 
          {/* imagens */} 
          <div className="flex flex-col gap-16 h-full"> 
            <div className="flex flex-row"> 
              {/* gato */} 
              <div className="relative w-fit mt-36 z-1"> 
                <div className="bg-miau-purple rounded-full"> 
                  <img src="/gato_inicio.png" alt="Gato" className="w-50 mxl:w-66 xl:w-80 2xl:w-96 h-50 mxl:h-66 xl:h-80 2xl:h-96 rounded-full object-cover" /> 
                </div> 
              </div> 
              
              {/* cachorro */} 
              <div className="relative w-fit -ml-16 z-1"> 
                <div className="bg-miau-orange rounded-full"> 
                  <img src="/cachorro_inicio.png" alt="Cachorro" className="w-50 mxl:w-66 xl:w-80 2xl:w-96 h-50 mxl:h-66 xl:h-80 2xl:h-96 object-cover rounded-full" /> 
                </div>
              </div> 
            </div> 
            
            {/* grafo */} 
            <div className="flex flex-col  items-center gap-32 mxl:gap-20 xl:gap-26 2xl:gap-32"> 
              <div className="relative w-fit -ml-14 -mt-95 mxl:-mt-105 xl:-mt-120 2xl:-mt-140 z-0"> 
                  <img src="/grafo.png" alt="Grafo" className="w-86 mxl:w-100 xl:w-120 2xl:w-140 h-60 mxl:h-80 xl:h-90 2xl:h-105 object-contain" /> 
              </div> 
            
              <Link href={"/tipo-cadastro"} className="w-full mxl:w-fit mxl:px-12 text-center py-4 rounded-[48px]
              bg-miau-orange text-text-black font-bold text-3xl hover:bg-miau-green active:bg-miau-green/80 
              active:text-background hover:text-background transition shadow-[0_4px_4px_rgba(0,0,0,0.25)]"> Inscreva-se! </Link> 

            </div> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
}
