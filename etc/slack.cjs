const fs = require('fs')
const https = require('node:https')

function getActor() {
  const actorValue = process.argv.find((arg) => arg.startsWith('--actor'))

  return actorValue.split('=').pop()
}

function getPublishedMessage() {
  const actor = getActor()
  const commitMessageIndex = process.argv.findIndex((arg) =>
    arg.startsWith('--commit-message'),
  )

  if (commitMessageIndex === -1) {
    return `Published packages: ${actor}`
  }

  return `${process.argv
    .slice(commitMessageIndex)
    .join(' ')
    .split('=')
    .pop()} (${actor})`
}

function getSlackAPI() {
  const apiValue = process.argv.find((arg) => arg.startsWith('--api='))

  if (!apiValue) {
    return
  }

  return apiValue.split('=').pop()
}

function formatPublishedItem({ packageName, name, version }) {
  return {
    type: 'rich_text_section',
    elements: [
      {
        type: 'text',
        text: `${packageName || name}: ${version}`,
      },
    ],
  }
}

function sendSlackMessage(webhookURL, publishedItems) {
  const messageBody = JSON.stringify({
    text: 'Published packages',
    blocks: [
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_section',
            elements: [
              {
                type: 'text',
                text: getPublishedMessage(),
                style: {
                  bold: true,
                },
              },
            ],
          },
          {
            type: 'rich_text_list',
            elements: publishedItems,
            style: 'bullet',
            indent: 0,
          },
        ],
      },
    ],
  })

  return new Promise((reject) => {
    const requestOptions = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
    }

    const req = https.request(webhookURL, requestOptions)

    req.on('error', (e) => {
      reject(e)
    })

    req.write(messageBody)
    req.end()
  })
}

const main = async () => {
  let publishedItems = []

  const api = getSlackAPI()

  if (!api) {
    console.error('missing slack api endpoint')

    return
  }

  try {
    // Check for pnpm summary file first, then fall back to lerna
    const pnpmSummaryPath = './pnpm-publish-summary.json'
    const lernaSummaryPath = './lerna-publish-summary.json'

    let content
    if (fs.existsSync(pnpmSummaryPath)) {
      const rawContent = JSON.parse(
        fs.readFileSync(pnpmSummaryPath, { encoding: 'utf8' }),
      )
      // pnpm format: { publishedPackages: [{ name, version }] }
      content = rawContent.publishedPackages || []
    } else if (fs.existsSync(lernaSummaryPath)) {
      // lerna format: [{ packageName, version }]
      content = JSON.parse(
        fs.readFileSync(lernaSummaryPath, { encoding: 'utf8' }),
      )
    } else {
      console.log(
        'No publish summary file found. This typically means no packages were published (they may have already been published).',
      )

      return
    }

    publishedItems = content.map(formatPublishedItem)

    if (!publishedItems || publishedItems.length === 0) {
      console.log('No packages were published according to the summary file.')

      return
    }
  } catch (e) {
    console.error('Error reading the latest published packages')
    console.error(e.message)

    return
  }

  try {
    sendSlackMessage(api, publishedItems).then(() =>
      console.log('Broadcast packages to slack'),
    )
  } catch (e) {
    console.error('There was a error with the request', e)
  }
}

main()
