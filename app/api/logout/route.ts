import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout realizado com sucesso" });

  // apaga os cookies (zera o token e o tipo)
  response.cookies.set("token", "", { path: "/", maxAge: 0 });
  response.cookies.set("id", "", { path: "/", maxAge: 0 });
  response.cookies.set("tipo", "", { path: "/", maxAge: 0 });

  return response;
}
