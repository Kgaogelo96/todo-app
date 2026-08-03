// app/api/tasks/route.js
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/tasks?sort=dueDate
export async function GET(request) {
  const { searchParams } = new URL(request.url); // instead of Express's req.query
  const sort = searchParams.get("sort") || "dueDate";

  const validSorts = ["topic", "status", "dueDate"];
  const orderBy = validSorts.includes(sort)
    ? { [sort]: "asc" }
    : { dueDate: "asc" };

  const tasks = await prisma.task.findMany({ orderBy });

  // overdue is NOT stored — derived here, at read time
  const withOverdue = tasks.map((t) => ({
    ...t,
    overdue:
      !t.archived &&
      t.status !== "COMPLETE" &&
      new Date(t.dueDate) < new Date(),
  }));

  return NextResponse.json(withOverdue); // instead of res.json(...)
}

// POST /api/tasks
export async function POST(request) {
  const body = await request.json(); // instead of Express's req.body (no body-parser needed, it's built in)
  const { title, description, dueDate, topic } = body;

  if (!title || !dueDate || !topic) {
    return NextResponse.json(
      { error: "title, dueDate and topic are required" },
      { status: 400 },
    );
  }

  const task = await prisma.task.create({
    data: {
      title,
      description: description || "",
      dueDate: new Date(dueDate),
      topic,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
