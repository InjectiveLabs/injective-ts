import { Schema, Validator, ValidatorResult } from 'jsonschema'
import values from 'lodash.values'
import { schemas } from '../schemas'

export default class JSONSchemaValidator {
  private readonly validator: Validator

  private static assertSchemaDefined(schema: Schema): void {
    if (schema === undefined) {
      throw new Error(`Cannot add undefined schema`)
    }
  }

  /**
   * Instantiates a JSONSchemaValidator instance
   */
  constructor() {
    this.validator = new Validator()

    for (const schema of values(schemas)) {
      JSONSchemaValidator.assertSchemaDefined(schema as Schema)

      this.validator.addSchema(schema as Schema, (schema as Schema).id)
    }
  }

  /**
   * Add a schema to the validator. All schemas and sub-schemas must be added to
   * the validator before the `validate` and `isValid` methods can be called with
   * instances of that schema.
   * @param schema The schema to add
   */
  public addSchema(schema: Schema): void {
    JSONSchemaValidator.assertSchemaDefined(schema)

    this.validator.addSchema(schema, schema.id)
  }

  /**
   * Validate the JS object conforms to a specific JSON schema
   * @param instance JS object in question
   * @param schema Schema to check against
   * @returns The results of the validation
   */
  public validate(instance: any, schema: Schema): ValidatorResult {
    JSONSchemaValidator.assertSchemaDefined(schema)

    const jsonSchemaCompatibleObject = JSON.parse(JSON.stringify(instance))

    return this.validator.validate(jsonSchemaCompatibleObject, schema)
  }

  /**
   * Check whether an instance properly adheres to a JSON schema
   * @param instance JS object in question
   * @param schema Schema to check against
   * @returns Whether or not the instance adheres to the schema
   */
  public isValid(instance: any, schema: Schema): boolean {
    const isValid = this.validate(instance, schema).errors.length === 0

    return isValid
  }
}
