import { CurrentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db/utils";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { Name, imgUrl } = await req.json();
    const profile = await CurrentProfile();

    if (!profile) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("server is missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name: Name,
        imgUrl: imgUrl,
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log(err);
    return new NextResponse("internal error", { status: 500 });
  }
}
