import api from "./api";

export async function requestData<T>(promise: Promise<{ data: { status: string; message: string; data: T } }>): Promise<T> {
  const response = await promise;
  return response.data.data;
}

export default api;
