import { IntialModel } from "@/components/ui/models/intialsModel";
import { db } from "@/lib/db/utils";
import { intialProfile } from "@/lib/intial-profile";
import {redirect} from 'next/navigation'

const setupPage = async () => {
  const profile = await intialProfile();

  const server = await db.server.findFirst({
    where:  {
        members: {
            some: {
                profileId: profile.id
            }
        }
    }
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }
  return (
  <IntialModel />
  )
}

export default setupPage;