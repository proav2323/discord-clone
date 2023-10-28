import { db } from "./db/utils";

const FindConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
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
  } catch {
    return null;
  }
};

const createConversation = async (memberOneId: string, memebrTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId: memberOneId,
        memberTwoId: memebrTwoId,
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
  } catch (e) {
    return null;
  }
};

export const FindOrCreateConversation = async (
  memebrOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await FindConversation(memebrOneId, memberTwoId)) ||
    (await FindConversation(memberTwoId, memebrOneId));

  if (!conversation) {
    conversation = await createConversation(memebrOneId, memberTwoId);
  }

  return conversation;
};
