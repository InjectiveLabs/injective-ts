import { BigNumber } from '@injectivelabs/utils'
import { Schema } from 'jsonschema'
import lodash from 'lodash'
import JSONSchemaValidator from './JSONSchema'

export default class Assert {
  public isBigNumber(variableName: string, value: BigNumber): void {
    const isBigNumber = BigNumber.isBigNumber(value)

    this.assert(
      isBigNumber,
      this.typeAssertionMessage(variableName, 'BigNumber', value),
    )
  }

  public inArray(needle: any, haystack: any[]): void {
    this.assert(
      haystack.includes(needle),
      `${needle} cannot be found in ${haystack}`,
    )
  }

  conformToSchema(
    variableName: string,
    value: any,
    schema: Schema,
    subSchemas?: Schema[],
  ): void {
    if (value === undefined) {
      throw new Error(`${variableName} can't be undefined`)
    }

    const schemaValidator = new JSONSchemaValidator()

    if (subSchemas !== undefined) {
      lodash.map(subSchemas, schemaValidator.addSchema.bind(schemaValidator))
    }

    const validationResult = schemaValidator.validate(value, schema)
    const hasValidationErrors = validationResult.errors.length > 0
    const msg = `Expected ${variableName} to conform to schema ${schema.id}
Encountered: ${JSON.stringify(value, null, '\t')}
Validation errors: ${validationResult.errors.join(', ')}`

    this.assert(!hasValidationErrors, msg)
  }

  private typeAssertionMessage = (
    variableName: string,
    type: string,
    value: any,
  ): string =>
    `Expected ${variableName} to be of type ${type}, encountered: ${value}`

  private assert = (condition: boolean, message: string): void => {
    if (!condition) {
      throw new Error(message)
    }
  }
}
