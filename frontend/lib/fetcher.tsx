import api from "@/api/api";

export const fetcher = (url: string) => api.get(url).then((res) => res.data);