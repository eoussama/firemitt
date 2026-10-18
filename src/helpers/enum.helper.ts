import type { TUnsafe } from "@eoussama/core";



/**
 * Helps with enums.
 *
 * @category Helpers
 */
export class EnumHelper {
  /**
   * Returns the name for an enum value.
   *
   * @param enumType The enumerator.
   * @param enumValue The enum value.
   * @returns {TUnsafe<keyof T>} A key name corresponding to the input value.
   */
  static getName<T extends object>(enumType: T, enumValue: T[keyof T]): TUnsafe<keyof T> {
    const keys = Object.keys(enumType) as Array<keyof T>;

    return keys.find(key => enumType[key] === enumValue);
  }
}
