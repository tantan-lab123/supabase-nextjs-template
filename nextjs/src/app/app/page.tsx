"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/lib/context/GlobalContext";

export default function DashboardContent() {
  const { loading } = useGlobal();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    if (!loading && mounted) {
      // Use setTimeout to push navigation to the next tick
      setTimeout(() => {
        router.replace("/app/panel");
      }, 0);
    }
    return () => {
      mounted = false;
    };
  }, [loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
}
