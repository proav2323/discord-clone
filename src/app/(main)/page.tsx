import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
  <Button>this is protected route</Button>
  <UserButton afterSignOutUrl="/"/>
  </>
  )
}
