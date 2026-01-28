import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForecast, ForecastResponse, ForecastRequestParams } from "@/lib/apiprovider";

export type UseForecastArgs = ForecastRequestParams & { sku: string };

export function useForecast({ sku, horizon = 14, region, start_date }: UseForecastArgs) {
  const queryClient = useQueryClient();
  const key = ["forecast", sku, horizon, region, start_date];

  return useQuery<ForecastResponse>({
    queryKey: key,
    queryFn: () => fetchForecast({ sku, horizon, region, start_date }),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    onSuccess: (data) => {
      if (data?.ttl_seconds) {
        queryClient.setQueryDefaults(key, { staleTime: data.ttl_seconds * 1000 });
      }
    },
  });
}
