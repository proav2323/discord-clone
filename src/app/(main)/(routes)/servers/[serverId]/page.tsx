import { CurrentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db/utils";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerPage = async ({params}: {params: {serverId: string}}) => {
    const profile = await CurrentProfile();

    if (!profile) {
        return redirectToSignIn();
    }
    const server = await db.server.findUnique({
        where: {
            id: params?.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
           channels: {
            where: {
                name: "general"
            },
            orderBy: {
                createdAt: "asc"
            }
           }
        }
    })

    const channel = server?.channels[0];

    if (channel?.name !== "general") {
      return null;
    }

    return redirect(`/servers/${params.serverId}/channels/${channel?.id}`)

    return (
        <div>
            server
        </div>
    )
}
export default ServerPage;