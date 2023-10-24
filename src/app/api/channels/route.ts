import { CurrentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db/utils";
import { membolRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { Name, Type } = await req.json();
    const { searchParams } = new URL(req.url);
    const profile = await CurrentProfile();
    const serverId = searchParams.get("serverId");

    if (!Name && !Type) {
      return new NextResponse("channel name is required", { status: 404 });
    }

    if (!profile) {
      return new NextResponse("unauthroized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("no server id", { status: 401 });
    }

    if (Name === "general") {
      return new NextResponse("cannot use general as channel name");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [membolRole.ADMIN, membolRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: { name: Name, type: Type, profileId: profile.id },
        },
      },
    });

    return NextResponse.json(server);
  } catch (e) {
    console.log(e);
    return new NextResponse("internal error", { status: 500 });
  }
}
