import { createFileRoute, redirect } from "@tanstack/react-router";
import { listRegions } from "../lib/data/regions";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    const { queryClient } = context;

    const regions = await queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: () => listRegions(),
    });

    const defaultCountry = regions?.[0]?.countries?.[0]?.iso_2?.toLowerCase() || "us";

    throw redirect({
      to: "/$countryCode",
      params: { countryCode: defaultCountry },
    });
  },
  component: () => null,
});
