import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <h2>Subscribe channel</h2>
      <Button>Subscribe</Button>
      <UserButton />
    </>
  );
}
