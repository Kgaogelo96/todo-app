// app/api/tasks/[id]/route.js
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const { id } = await params; // Next.js 15+: params is a Promise, must await it
  const body = await request.json();

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: body, // trust the client less than this in real life, but fine for a lab
  });

  return NextResponse.json(task);
}
