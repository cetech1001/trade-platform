export interface ErrorResponse {
  error?: string;
  message?: string;
  statusCode?: number;
  status?: number;
  data?: {
    error?: string;
    message?: string;
    statusCode?: number;
    status?: number;
  }
  response: {
    error?: string;
    message?: string;
    statusCode?: number;
    status?: number;
    data?: {
      error?: string;
      message?: string;
      statusCode?: number;
      status?: number;
    }
  }
}
