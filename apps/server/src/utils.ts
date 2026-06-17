export function apiJsonRseponse<T = unknown>(
  success: boolean,
  data: T | null = null,
  message: string = "",
  errors: unknown | null = null,
) {
  return {
    success,
    message,
    data,
    errors,
  };
}
