export interface IApiResponse<T> {
  success: boolean;
  message: string;
  result?: T;
}
export interface IApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors: Record<string, string> | null;
}
