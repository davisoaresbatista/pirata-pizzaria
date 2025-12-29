import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const configs = await prisma.shiftConfig.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(configs);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { configs } = body;

    for (const config of configs) {
      await prisma.shiftConfig.update({
        where: { name: config.name },
        data: { value: config.value },
      });
    }

    const updatedConfigs = await prisma.shiftConfig.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(updatedConfigs);
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar configurações" },
      { status: 500 }
    );
  }
}

