import { Validator, ChainGrpcStakingApi } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { HttpRestClient } from '@injectivelabs/utils'
import path from 'path'
import fs from 'fs'
// @ts-ignore
import validatorToAddressMapFromKeybase from './mappings.json'
import { validatorAddressToPathMap } from '../src/utils/mappings'

export interface ValidatorMap {
  [validatorAddress: string]: string
}

const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcStakingApi = new ChainGrpcStakingApi(endpoints.grpc)
const keybaseApi = new HttpRestClient('https://keybase.io/_/api/1.0/')

const KEYBASE_SUFFIX = 'user/lookup.json?fields=pictures&key_suffix='

const existingValidatorToAddressMapFromKeybase =
  { ...JSON.parse(JSON.stringify(validatorToAddressMapFromKeybase)) } || {}

/* cli flags */
const [, , flag] = process.argv
const cliValidatorAddress = flag && flag.includes('inj') ? flag : undefined
const shouldUpdateAllImages = flag && flag.includes('update:all')
const removeImages = flag && flag.includes('remove:images')

/* create validator to identity map */
const fetchValidators = async () => {
  const { validators } = await chainGrpcStakingApi.fetchValidators()

  /* if validator is already in the map, don't include it by default because that would require redownloading all images */
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

/* fetch url where validator image is stored */
const fetchLogoUrl = async (identity: string): Promise<string | undefined> => {
  try {
    const response = (await keybaseApi.get(`${KEYBASE_SUFFIX}${identity}`)) as {
      data: any
    }

    return response.data?.them?.[0]?.pictures.primary.url
  } catch (e: unknown) {
    return
    console.log(e)
  }
}

/* create map of validator address to url path of image */
const getLogoPathsMap = async () => {
  const validators = await fetchValidators()

  if (!validators) {
    return
  }

  return Object.entries(validators).reduce(
    async (acc: Promise<ValidatorMap>, [validatorAddress, identifier]) => {
      const logoUrl = await fetchLogoUrl(identifier as string)

      if (!logoUrl) {
        return { ...(await acc) } as ValidatorMap
      }

      return { ...(await acc), [validatorAddress]: logoUrl }
    },
    {} as Promise<ValidatorMap>,
  )
}

/* helper function to download images to a folder */
const downloadImages = async (imageOrigin: string, imageFolderPath: string) => {
  const [imageOriginPath, imageOriginSuffix] = imageOrigin.split('.com')
  const imageOriginHttpClient = new HttpRestClient(`${imageOriginPath}.com`, {
    responseType: 'stream',
  })
  const response = (await imageOriginHttpClient.get(imageOriginSuffix)) as {
    data: any
  }
  const stream = fs.createWriteStream(imageFolderPath)

  response.data.pipe(stream)

  stream.on('finish', () => {
    stream.close()
  })
}

/* download images to validators-logo/images folder */
const queryAndMoveValidatorImages = async () => {
  const validatorToLogoPathMap = (await getLogoPathsMap()) as Record<
    string,
    string
  >

  if (
    !validatorToLogoPathMap ||
    Object.keys(validatorToLogoPathMap).length === 0
  ) {
    return
  }
  console.log('replacing images')
  Object.entries(validatorToLogoPathMap).forEach(
    async ([validatorAddress, imagePath]) => {
      fs.readFile(imagePath, () => {
        const fileType = imagePath.split('.').pop()
        const validatorFile = `${validatorAddress}.${fileType}`

        const outputPath = path.resolve(
          process.cwd() + `/./validators-logo/images/${validatorFile}`,
        )
        console.log('download images')
        downloadImages(imagePath, outputPath)
      })
    },
  )
}

const removeDeprecatedValidatorImages = () => {
  const imagesFolderPath = path.resolve(
    process.cwd() + `/./validators-logo/images/`,
  )

  const defaultImage = 'injective.webp'

  fs.readdirSync(imagesFolderPath).forEach((fileName) => {
    if (
      !Object.values(existingValidatorToAddressMapFromKeybase).includes(
        fileName,
      ) &&
      !Object.values(validatorAddressToPathMap).includes(fileName) &&
      fileName !== defaultImage
    ) {
      fs.unlinkSync(`${imagesFolderPath}/${fileName}`)
    }
  })
}

/* create map of validator address to image file name */
const getValidatorNameToImageMap = async () => {
  const logoPaths = (await getLogoPathsMap()) as Record<string, string>

  if (!logoPaths || Object.keys(logoPaths).length === 0) {
    return
  }

  return Object.entries(logoPaths).reduce(
    (acc, [validatorAddress, imagePath]) => {
      const fileType = imagePath.split('.').pop()
      const validatorFile = `${validatorAddress}.${fileType}`

      return { ...acc, [validatorAddress]: validatorFile }
    },
    {},
  ) as Record<string, string>
}

/* create map of validator address to image file name to be stored as json */
function createValidatorMapJsonFile(
  validatorNameToImageMap: Record<string, string>,
) {
  if (!validatorNameToImageMap) {
    return
  }

  const outputPath = path.resolve(
    `${process.cwd()}/validators-logo/mappings.json`,
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

/* update a single validator on json map and it's image */
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
    process.cwd() + `/./validators-logo/images/${validatorFile}`,
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

if (removeImages) {
  removeDeprecatedValidatorImages()
} else {
  handleValidatorLogos()
}
