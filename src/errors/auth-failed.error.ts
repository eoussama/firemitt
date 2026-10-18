import type { IError } from "..";
import { ErrorType } from "..";

import { BaseError } from "./base.error";



/**
 * Custom error class representing an authentication failure reported by Fireguard.
 *
 * The remote error's `type`, `name`, `message` and `code` are kept on the instance (so checks such as
 * `error.type === ErrorType.InvalidApp` keep working), and the raw payload is available as `cause`.
 *
 * @category Errors
 */
export class AuthFailedError extends BaseError {
  /**
   * Creates a new instance of the AuthFailedError class from the error payload sent by Fireguard.
   *
   * @param error The error payload received from Fireguard, usually a serialized {@link IError}.
   */
  constructor(error?: unknown) {
    const remote = AuthFailedError.toRemote(error);
    const type = typeof remote.type === "number" && ErrorType[remote.type] !== undefined ? remote.type : ErrorType.AuthFailed;
    const message = typeof remote.message === "string" && remote.message.length > 0 ? remote.message : "Authentication failed";

    super(type, message);

    if (typeof remote.name === "string" && remote.name.length > 0) {
      this.name = remote.name;
    }

    if (typeof remote.code === "string" && remote.code.length > 0) {
      this.code = remote.code;
    }

    this.cause = error;
  }

  /**
   * Normalizes an unknown error payload into a partial {@link IError}.
   *
   * @param error The raw error payload.
   * @returns The partial error object.
   */
  private static toRemote(error: unknown): Partial<IError> {
    if (typeof error === "string") {
      return { message: error };
    }

    if (error !== null && typeof error === "object") {
      return error as Partial<IError>;
    }

    return {};
  }
}
