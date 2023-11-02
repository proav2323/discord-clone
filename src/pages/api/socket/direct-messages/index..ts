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
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "no server id" });
    }
    if (!content) {
      return res.status(400).json({ error: "no connetn" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
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
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ error: "member not found" });
    }

    const message = await db.directMessage.create({
      data: {
        content: content,
        fileUrl: fileUrl,
        conversationId: conversationId as string,
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

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "internal error" });
  }
}
