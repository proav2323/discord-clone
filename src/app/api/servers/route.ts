import { CurrentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db/utils";
import { membolRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { Name, imgUrl } = await req.json();
    const profile = await CurrentProfile();
    if (!profile) {
      return new NextResponse("log in first", { status: 404 });
    }

    const server = await db.server.create({
      data: {
        name: Name,
        imgUrl: imgUrl,
        profileId: profile.id,
        inviteCode: v4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: membolRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("[SERVERS POST] ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
