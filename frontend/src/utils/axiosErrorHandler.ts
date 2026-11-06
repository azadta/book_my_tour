import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import axios from "axios";
import { toast } from "react-toastify";

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string>;
}

interface ErrorHandlerOptions {
  setFieldError?(errors: Record<string, string>): void;
  fallbackMessages?: string;
}

export const isAxiosError = (error: unknown) => {
  return axios.isAxiosError<ApiErrorResponse>(error);
};

export const handleApiError = (
  error: unknown,
  options: ErrorHandlerOptions = {},
) => {
  const {
    setFieldError,
    fallbackMessages = FEEDBACK_MESSAGES.GLOBAL.ERROR.SOMETHINK_WENT_WRONG,
  } = options;
  if (isAxiosError(error)) {
    const errors = error.response?.data?.errors;
    if (errors && setFieldError) {
      setFieldError(errors);
      return;
    }
    const message=error.response?.data?.message ?? fallbackMessages
    toast.error(message);
    console.error(error.message);
    return message
  } else if (error instanceof Error) {
    const message=FEEDBACK_MESSAGES.GLOBAL.ERROR.SOMETHINK_WENT_WRONG
    toast.error(message);
    console.error(error.message);
    return message
  } else {
    const  message=FEEDBACK_MESSAGES.GLOBAL.ERROR.SOMETHINK_WENT_WRONG
    toast.error(message);
    console.error(error);
    return message
  }
};
