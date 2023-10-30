import { CurrentProfilePages } from "@/lib/currentProfilePages";
import { NextApiResponseServerIo } from "../../../../../types";
import { NextApiRequest } from "next";
import { db } from "@/lib/db/utils";
import { membolRole } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "method not allod" });
  }
  try {
    const currentProfile = await CurrentProfilePages(req);
    const { id, channelId, serverId } = req.query;
    const { content } = req.body;
    if (!currentProfile) {
      return res.status(401).json({ error: "unauthorize" });
    }
    if (!channelId) {
      return res.status(401).json({ error: "no channel id" });
    }
    if (!serverId) {
      return res.status(401).json({ error: "no server id" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: currentProfile.id,
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

    const member = server.members.find(
      (mem) => mem.profileId === currentProfile.id
    );

    if (!member) {
      return res.status(404).json({ error: "memebr not found" });
    }

    let message = await db.message.findFirst({
      where: {
        channelId: channelId as string,
        id: id as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "message not found" });
    }

    const isOwner = message.memberId === member.id;
    const isAdmin = membolRole.ADMIN === member.role;
    const isMod = membolRole.MODERATOR === member.role;
    const canModify = isOwner || isAdmin || isMod;

    if (!canModify) {
      return res.status(401).json({ error: "not allowed" });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          channelId: channelId as string,
          id: id as string,
        },
        data: {
          fileUrl: null,
          content: "this message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isOwner) {
        return res.status(401).json({ error: "not allowed" });
      }
      message = await db.message.update({
        where: {
          channelId: channelId as string,
          id: id as string,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "internal error" + e });
  }
}
