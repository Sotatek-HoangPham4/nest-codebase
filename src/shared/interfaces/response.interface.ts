export interface SuccessResponse<T = any> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  status: string;
  error: {
    code: number;
    message: string;
  };
  timestamp: string;
}
