import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      validatedPayload?: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}