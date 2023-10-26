import { CurrentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db/utils";
import { membolRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const profile = await CurrentProfile();

    if (!profile) {
      return new NextResponse("unauthorized", { status: 400 });
    }

    if (!serverId) {
      return new NextResponse("no server id", { status: 404 });
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
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log(err);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const profile = await CurrentProfile();
    const { Name, Type } = await req.json();

    if (!profile) {
      return new NextResponse("unauthorized", { status: 400 });
    }

    if (!serverId) {
      return new NextResponse("no server id", { status: 404 });
    }

    if (Name === "general") {
      return new NextResponse("can not delet general server", { status: 404 });
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
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name: Name,
              type: Type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log(err);
    return new NextResponse("internal error", { status: 500 });
  }
}
