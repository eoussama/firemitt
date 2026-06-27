import type { TUnsafe } from "@eoussama/core";



/**
 * @category Helpers
 *
 * @description
 * Helps with enums.
 *
 * @class EnumHelper
 */
export class EnumHelper {
  /**
   * @description
   * Returns the name for an enum value.
   *
   * @param enumType The enumurator.
   * @param enumValue The enum value.
   * @returns {TUnsafe<keyof T>} A key name corresponding to the input value.
   */
  static getName<T extends object>(enumType: T, enumValue: T[keyof T]): TUnsafe<keyof T> {
    const keys = Object.keys(enumType) as Array<keyof T>;

    return keys.find(key => enumType[key] === enumValue);
  }
}
