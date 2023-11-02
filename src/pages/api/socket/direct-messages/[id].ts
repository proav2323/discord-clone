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
    const { id, conversationId } = req.query;
    const { content } = req.body;
    if (!currentProfile) {
      return res.status(401).json({ error: "unauthorize" });
    }
    if (!conversationId) {
      return res.status(401).json({ error: "no channel id" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: currentProfile.id,
            },
          },
          {
            memberTwo: {
              profileId: currentProfile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(400).json({ error: "no conversation" });
    }

    const member =
      conversation.memberOne.profileId === currentProfile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ error: "member not found" });
    }

    let message = await db.directMessage.findFirst({
      where: {
        conversationId: conversationId as string,
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
      message = await db.directMessage.update({
        where: {
          id: id as string,
          conversationId: conversationId as string,
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
      message = await db.directMessage.update({
        where: {
          conversationId: conversationId as string,
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

    const updateKey = `chat:${conversationId}messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "internal error" + e });
  }
}
