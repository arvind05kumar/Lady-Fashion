import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useRouter, usePathname } from "next/navigation";

export function useAdminAuth() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin") {
      router.push("/admin");
    }
  }, [user, loading, router, pathname]);

  return { user, loading, error };
}
