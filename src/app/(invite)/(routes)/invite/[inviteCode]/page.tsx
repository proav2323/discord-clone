import { CurrentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db/utils";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function inviteCode({params}: {params: {inviteCode: string}}) {
const profile = await CurrentProfile();

if (!profile) {
    return redirectToSignIn();
}

if (!params.inviteCode) {
    return redirect("/")
}

const existingServer = await db.server.findFirst({
    where: {
        inviteCode: params.inviteCode,
        members: {
            some: {
                profileId: profile.id
            }
        }
    }
})

if (existingServer) {
    return redirect(`/servers/${existingServer.id}`)
}

   const server = await db.server.update({
    where: {
        inviteCode: params.inviteCode
    },
    data: {
        members: {
            create: [{
                profileId: profile.id
            }]
        }
    }
   })

if (server) {
    return redirect(`/servers/${server.id}`)
}

    return null;
}