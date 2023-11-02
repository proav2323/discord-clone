import { CurrentProfile } from "@/lib/currentProfile";
import { NextRequest, NextResponse } from "next/server";
import { Message, directMessage } from "@prisma/client";
import { db } from "@/lib/db/utils";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await CurrentProfile();
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("conversationId");
    const cursor = searchParams.get("cursor");

    if (!profile) {
      return new NextResponse("unauthorize", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("channel id missing", { status: 400 });
    }

    let message: directMessage[] = [];

    if (cursor) {
      message = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId: channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      message = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        where: {
          conversationId: channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (message.length === MESSAGE_BATCH) {
      nextCursor = message[MESSAGE_BATCH - 1].id;
    }

    return NextResponse.json({ items: message, nextCursor });
  } catch (e) {
    console.log(e);
    return new NextResponse("interna; error", { status: 500 });
  }
}
