import { OracleTypeMap } from '../../../types/light.js'
import type { OracleType } from '../../../types/light.js'

export const validateOracleType = (oracleType: OracleType) => {
  if (
    oracleType === OracleTypeMap.PriceFeed ||
    oracleType === OracleTypeMap.Coinbase ||
    oracleType === OracleTypeMap.Stork
  ) {
    throw new Error(
      `Oracle ${OracleTypeMap[oracleType]} has been removed in core v1.21`,
    )
  }
}
