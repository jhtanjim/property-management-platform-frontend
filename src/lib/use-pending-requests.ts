import { floorRequestApi, propertyRequestApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

export function usePendingRequests() {
  const { admin } = useAuth();
  const enabled = admin?.admin?.role === "superAdmin" && Boolean(admin?.token);

  const { data } = useQuery({
    // Per account, so a count from a previous sign-in in this tab is never shown.
    queryKey: ["pending-requests", admin?.admin?.id],
    enabled,
    refetchInterval: 30_000,
    queryFn: async () => {
      const [p, f] = await Promise.all([
        propertyRequestApi.list({ status: "pending", limit: 1 }),
        floorRequestApi.list({ status: "pending", limit: 1 }),
      ]);
      return { property: p.total, floor: f.total };
    },
  });

  const property = enabled ? (data?.property ?? 0) : 0;
  const floor = enabled ? (data?.floor ?? 0) : 0;
  return { property, floor, total: property + floor };
}