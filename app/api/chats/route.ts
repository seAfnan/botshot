import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all chats for authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chats = await prisma.chat.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formattedChats = chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      lastMessage: chat.messages[0]
        ? new Date(chat.messages[0].createdAt).toLocaleDateString()
        : "No messages",
      updatedAt: chat.updatedAt,
    }));

    return NextResponse.json(formattedChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new chat
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newChat = await prisma.chat.create({
      data: {
        userId: user.id,
        title: "New Chat",
      },
    });

    return NextResponse.json({
      id: newChat.id,
      title: newChat.title,
      lastMessage: "Just now",
      messages: [],
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
