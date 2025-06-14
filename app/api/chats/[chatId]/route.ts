import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch specific chat with all messages
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ chatId: string }> } // Note: params is now a Promise
) {
  try {
    const params = await context.params; // Await the params
    const chatId = params.chatId;

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

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const formattedMessages = chat.messages.map((message) => ({
      id: message.id,
      sender: message.sender,
      role: message.role,
      content: message.content,
      timestamp: new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return NextResponse.json({
      id: chat.id,
      title: chat.title,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete chat
export async function DELETE(
  request: NextRequest,
  // { params }: { params: { chatId: string } }
  context: { params: Promise<{ chatId: string }> }
) {
  try {
    const params = await context.params; // Await the params
    const chatId = params.chatId;

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

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    await prisma.chat.delete({
      where: { id: chatId },
    });

    return NextResponse.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update chat title
export async function PATCH(
  request: NextRequest,
  // { params }: { params: { chatId: string } }
  context: { params: Promise<{ chatId: string }> }
) {
  try {
    const params = await context.params; // Await the params
    const chatId = params.chatId;

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await request.json();

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { title: title.trim() },
    });

    return NextResponse.json({
      id: updatedChat.id,
      title: updatedChat.title,
    });
  } catch (error) {
    console.error("Error updating chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
