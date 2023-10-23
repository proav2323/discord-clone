import { CurrentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db/utils";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { MemberId: string } }
) {
  try {
    const profile = await CurrentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("log in first", { status: 404 });
    }

    if (!serverId) {
      return new NextResponse("server is missing", { status: 400 });
    }

    if (!params.MemberId) {
      return new NextResponse("member is missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.MemberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role: role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
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

export async function DELETE(
  req: Request,
  { params }: { params: { MemberId: string } }
) {
  try {
    const profile = await CurrentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("log in first", { status: 404 });
    }

    if (!serverId) {
      return new NextResponse("server is missing", { status: 400 });
    }

    if (!params.MemberId) {
      return new NextResponse("member is missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.MemberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (Err) {
    console.log(Err);
    return new NextResponse("internal error", { status: 500 });
  }
}
