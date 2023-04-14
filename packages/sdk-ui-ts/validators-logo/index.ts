import { Validator, ChainGrpcStakingApi } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { HttpRestClient } from '@injectivelabs/utils'
import { HttpRequestException } from '@injectivelabs/exceptions'
import path from 'path'
import fs from 'fs'

export interface ValidatorMap {
  [operator_address: string]: string
}

const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcStakingApi = new ChainGrpcStakingApi(endpoints.grpc)
const keybaseApi = new HttpRestClient('https://keybase.io/')

const KEYBASE_SUFFIX = '_/api/1.0/user/lookup.json?fields=pictures&key_suffix='

/* create validator to identity map */
const fetchValidators = async () => {
  const { validators } = await chainGrpcStakingApi.fetchValidators()

  return validators.reduce((acc: ValidatorMap, validator: Validator) => {
    acc[validator.operatorAddress] = validator.description.identity
    return acc
  }, {})
}

/* fetch url where validator image is stored */
const fetchLogoUrl = async (identity: string) => {
  try {
    const response = (await keybaseApi.get(`${KEYBASE_SUFFIX}${identity}`)) as {
      data: any
    }

    return response.data?.them?.[0]?.pictures.primary.url
  } catch (e: unknown) {
    if (e instanceof HttpRequestException) {
      throw e
    }

    throw new HttpRequestException(new Error((e as any).message))
  }
}

/* create map of validator address to url path of image */
const getLogoPathsMap = async () => {
  const validators = await fetchValidators()

  return Object.entries(validators).reduce(
    async (acc: any, [validatorAddress, identifier]) => {
      const logoUrl = await fetchLogoUrl(identifier as string)

      return { ...(await acc), [validatorAddress]: logoUrl ? logoUrl : '' }
    },
    {},
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
    console.log('Image downloaded')
  })
}

/* download images to validators-logo/images folder */
const queryAndMoveValidatorImages = async () => {
  const logoPaths = (await getLogoPathsMap()) as Record<string, string>

  Object.entries(logoPaths).forEach(async ([validatorAddress, imagePath]) => {
    if (!imagePath) {
      return
    }

    fs.readFile(imagePath, () => {
      const fileType = imagePath.split('.').pop()
      const validatorFile = `${validatorAddress}.${fileType}`

      const outputPath = path.resolve(
        process.cwd() + `/./validators-logo/images/${validatorFile}`,
      )

      downloadImages(imagePath, outputPath)
    })
  })
}

/* create map of validator address to image file name */
const getValidatorNameToImageMap = async () => {
  const logoPaths = (await getLogoPathsMap()) as Record<string, string>

  return Object.entries(logoPaths).reduce(
    (acc, [validatorAddress, imagePath]) => {
      if (!imagePath) {
        return { ...acc, [validatorAddress]: '' }
      }

      const fileType = imagePath.split('.').pop()
      const validatorFile = `${validatorAddress}.${fileType}`

      return { ...acc, [validatorAddress]: validatorFile }
    },
    {},
  )
}

/* create map of validator address to image file name to be stored as json */
async function createValidatorMapFile() {
  const map = await getValidatorNameToImageMap()
  const outputPath = path.resolve(
    `${process.cwd()}/validators-logo/mappings.json`,
  )

  fs.writeFileSync(outputPath, JSON.stringify(map))
}

async function handleValidatorLogos() {
  await createValidatorMapFile()
  await queryAndMoveValidatorImages()
}

handleValidatorLogos()
