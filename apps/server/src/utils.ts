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

export function isValidDateInstance(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function minutesToSeconds(timeInMinutes: number) {
  return timeInMinutes * 60;
}
