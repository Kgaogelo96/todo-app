// app/api/tasks/[id]/archive/route.js
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const { id } = await params;

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: { archived: true },
  });

  return NextResponse.json(task);
}
