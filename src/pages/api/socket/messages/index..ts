import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "../../../../../types";
import { CurrentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const profile = await CurrentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { channelId, serverId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "no server id" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "no channel id" });
    }
    if (!content) {
      return res.status(400).json({ error: "no connetn" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "channel not found" });
    }

    const member = server.members.find((data) => data.profileId === profile.id);

    if (!member) {
      return res.status(404).json({ error: "member not found" });
    }

    const message = await db.message.create({
      data: {
        content: content,
        fileUrl: fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "internal error" });
  }
}
