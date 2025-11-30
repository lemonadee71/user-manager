export const ApiError = class extends Error {
  public details?: Record<string, { message: string; value?: unknown }>;

  constructor(
    message: string,
    details?: Record<string, { message: string; value?: unknown }>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
  }
};
