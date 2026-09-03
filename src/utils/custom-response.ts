export type ResponseStatus = "success" | "error";

export interface ApiResponse<T = unknown> {
  status: ResponseStatus;
  message?: string;
  data?: T;
}

export function customContent<T>(
  status: ResponseStatus,
  opts: { message?: string; data?: T } = {},
): ApiResponse<T> {
  const body: ApiResponse<T> = { status };

  if (opts.message !== undefined) {
    body.message = opts.message;
  }

  if (opts.data !== undefined) {
    body.data = opts.data;
  }

  return body;
}
