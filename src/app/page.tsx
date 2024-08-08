"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/firebase/auth";


export default function LandingPage() {
  const router = useRouter();

  function handleSignIn() {
    signInWithGoogle().then(() => router.push("/explore"));
  }


  return (
    <Button onClick={handleSignIn} variant="contained" color="primary">
      Login
    </Button>
  );
}
