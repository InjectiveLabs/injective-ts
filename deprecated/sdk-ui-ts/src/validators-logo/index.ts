import { Validator, ChainGrpcStakingApi } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { HttpRestClient } from '@injectivelabs/utils'
import path from 'path'
import fs from 'fs'
// @ts-ignore
import validatorToAddressMapFromKeybase from './mappings.json'

export interface ValidatorMap {
  [validatorAddress: string]: string | undefined
}

const endpoints = getNetworkEndpoints(Network.Mainnet)
const chainGrpcStakingApi = new ChainGrpcStakingApi(endpoints.grpc)
const keybaseApi = new HttpRestClient('https://keybase.io/_/api/1.0/')

const KEYBASE_SUFFIX = 'user/lookup.json?fields=pictures&key_suffix='

const existingValidatorToAddressMapFromKeybase =
  { ...JSON.parse(JSON.stringify(validatorToAddressMapFromKeybase)) } || {}

/* Cli flags */
const [, , flag] = process.argv
const cliValidatorAddress =
  flag && flag.includes('--validator-address') ? flag.split('=')[1] : undefined
const shouldUpdateAllImages = flag && flag.includes('--update:all')

/* Create validator to identity map */
const fetchValidators = async () => {
  const { validators } = await chainGrpcStakingApi.fetchValidators()

  /* Filter out existing downloaded validator images */
  const filteredValidators = !shouldUpdateAllImages
    ? validators.filter(
        ({ operatorAddress: validatorAddress }) =>
          !Object.keys(existingValidatorToAddressMapFromKeybase).includes(
            validatorAddress,
          ),
      )
    : validators

  if (filteredValidators.length === 0) {
    return
  }

  return filteredValidators.reduce(
    (acc: ValidatorMap, validator: Validator) => {
      const {
        operatorAddress: validatorAddress,
        description: { identity },
      } = validator

      if (!identity) {
        return { ...acc }
      }

      return { ...acc, [validatorAddress]: identity }
    },
    {} as ValidatorMap,
  )
}

const fetchLogoUrl = async (identity: string): Promise<string | undefined> => {
  try {
    const response = (await keybaseApi.get(`${KEYBASE_SUFFIX}${identity}`)) as {
      data: any
    }

    return response.data?.them?.[0]?.pictures.primary.url
  } catch (e: unknown) {
    console.log(e)

    return
  }
}

/* Create map of validator address to url path of image */
const getLogoPathsMap = async () => {
  const validators = await fetchValidators()

  if (!validators) {
    return
  }

  return (
    await Promise.all(
      Object.entries(validators).map(async ([validatorAddress, identifier]) => {
        if (!identifier) {
          return
        }

        const logoUrl = await fetchLogoUrl(identifier as string)

        return { [validatorAddress]: logoUrl }
      }),
    )
  ).filter((validatorAddressToLogoPath) => {
    const [validator] = Object.entries(
      validatorAddressToLogoPath as ValidatorMap,
    )
    const [, logoUrl] = validator

    return logoUrl
  })
}

/* Helper function to download images to a folder */
const downloadImages = async (imageOrigin: string, imageFolderPath: string) => {
  const [imageOriginPath, imageOriginSuffix] = imageOrigin.split('.com')
  const imageOriginHttpClient = new HttpRestClient(`${imageOriginPath}.com`, {
    responseType: 'stream',
  })

  try {
    const response = (await imageOriginHttpClient.get(imageOriginSuffix)) as {
      data: any
    }
    const stream = fs.createWriteStream(imageFolderPath)

    response.data.pipe(stream)

    stream.on('finish', () => {
      stream.close()
      console.log('Image downloaded successfully')
    })
  } catch (e) {
    console.log(e)

    return
  }
}

/* Download images to validators-logo/images folder */
const queryAndMoveValidatorImages = async () => {
  const validatorToLogoPathMap = (await getLogoPathsMap()) as
    | ValidatorMap[]
    | undefined

  if (!validatorToLogoPathMap || validatorToLogoPathMap.length === 0) {
    return
  }

  validatorToLogoPathMap.forEach(async (validatorAddressToLogoPath) => {
    const [validator] = Object.entries(validatorAddressToLogoPath)
    const [validatorAddress, imageLogoPath] = validator

    if (!imageLogoPath) {
      return
    }

    fs.readFile(imageLogoPath, () => {
      const fileType = imageLogoPath.split('.').pop()
      const validatorFileName = `${validatorAddress}.${fileType}`
      const outputPath = path.resolve(
        process.cwd() + `/src/validators-logo/images/${validatorFileName}`,
      )

      downloadImages(imageLogoPath, outputPath)
    })
  })
}

/* Create map of validator address to image file name */
const getValidatorNameToImageMap = async () => {
  const logoPathsMap = (await getLogoPathsMap()) as ValidatorMap[]

  if (!logoPathsMap || logoPathsMap.length === 0) {
    return
  }

  return logoPathsMap.reduce((acc, validatorToLogoPaths) => {
    const [validator] = Object.entries(validatorToLogoPaths)
    const [validatorAddress, imageLogoPath] = validator

    if (!imageLogoPath) {
      return { ...acc }
    }

    const fileType = imageLogoPath.split('.').pop()
    const validatorFile = `${validatorAddress}.${fileType}`

    return { ...acc, [validatorAddress]: validatorFile }
  }, {}) as ValidatorMap
}

/* Create map of validator address to image file name to be stored as json */
function createValidatorMapJsonFile(validatorNameToImageMap: ValidatorMap) {
  if (!validatorNameToImageMap) {
    return
  }

  const outputPath = path.resolve(
    `${process.cwd()}/src/validators-logo/mappings.json`,
  )

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        ...existingValidatorToAddressMapFromKeybase,
        ...validatorNameToImageMap,
      },
      null,
      2,
    ),
  )
}

/* Update a single validator on json map and it's image */
async function handleSpecifiedValidatorUpdate() {
  if (!cliValidatorAddress) {
    return
  }

  const validator = await chainGrpcStakingApi.fetchValidator(
    cliValidatorAddress,
  )
  const logoUrl = await fetchLogoUrl(validator.description.identity)

  if (!logoUrl) {
    return
  }

  const fileType = logoUrl.split('.').pop()
  const validatorFile = `${cliValidatorAddress}.${fileType}`
  const outputPath = path.resolve(
    process.cwd() + `/src/validators-logo/images/${validatorFile}`,
  )

  downloadImages(logoUrl, outputPath)
  createValidatorMapJsonFile({ [cliValidatorAddress]: validatorFile })
}

async function handleValidatorLogos() {
  if (cliValidatorAddress) {
    return handleSpecifiedValidatorUpdate()
  }

  const validatorNameToImageMap = await getValidatorNameToImageMap()

  if (!validatorNameToImageMap) {
    return
  }

  createValidatorMapJsonFile(validatorNameToImageMap)
  queryAndMoveValidatorImages()
}

handleValidatorLogos()
