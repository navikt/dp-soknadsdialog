import { useRouter } from "next/router";

export function useUuid() {
  const router = useRouter();
  const uuid = router.query.uuid as string;

  return { uuid };
}
