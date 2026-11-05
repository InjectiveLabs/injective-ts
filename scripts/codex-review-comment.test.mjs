import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

const workflow = readFileSync(
  new URL('../.github/workflows/codex-review.yml', import.meta.url),
  'utf8',
)
const script = workflow
  .split('      - name: Publish Codex Review Comment\n')[1]
  .split('          script: |\n')[1]
  .split('\n')
  .map((line) => line.slice(12))
  .join('\n')
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
const publish = new AsyncFunction(
  'require',
  'process',
  'github',
  'context',
  'core',
  'exec',
  script,
)
const require = createRequire(import.meta.url)
const reviewedHead = 'a'.repeat(40)

async function publishReview({
  currentHead = reviewedHead,
  review = 'LGTM',
  actionOutcome = 'success',
  skipReason = '',
  reviewable = 'true',
  failure = '',
} = {}) {
  const directory = mkdtempSync(path.join(tmpdir(), 'codex-review-comment-'))
  const reviewFile = path.join(directory, 'review.md')
  writeFileSync(reviewFile, review)
  const result = {
    comments: [],
    summaries: [],
    logs: [],
    gitCalls: 0,
    prCalls: 0,
  }
  const summary = {
    addHeading() {
      return this
    },
    addRaw(body) {
      result.summaries.push(body)
      return this
    },
    async write() {},
  }
  try {
    await publish(
      require,
      {
        env: {
          ACTION_OUTCOME: actionOutcome,
          CODEX_OUTCOME: 'success',
          REVIEWABLE: reviewable,
          SKIP_REASON: skipReason,
          CANDIDATE_COUNT: '154',
          CHANGED_LINES: '7852',
          REVIEW_FILE: reviewFile,
          RUNNER_TEMP: directory,
          PR_NUMBER: '479',
          GITHUB_SHA: 'default-branch-sha',
          GITHUB_SERVER_URL: 'https://github.com',
          GITHUB_REPOSITORY: 'owner/repo',
        },
      },
      {
        rest: {
          pulls: {
            async get(args) {
              result.prCalls += 1
              assert.deepEqual(args, {
                owner: 'owner',
                repo: 'repo',
                pull_number: 479,
              })
              if (failure === 'api') throw new Error('PR lookup failed')
              return { data: { head: { sha: currentHead } } }
            },
          },
        },
      },
      { repo: { owner: 'owner', repo: 'repo' } },
      { summary, info: (message) => result.logs.push(message) },
      {
        async getExecOutput(command, args, options) {
          result.gitCalls += 1
          assert.equal(command, 'git')
          assert.deepEqual(args, ['rev-parse', 'HEAD^2'])
          assert.equal(options.silent, true)
          if (failure === 'git') throw new Error('Reviewed head lookup failed')
          return { stdout: reviewedHead + '\n' }
        },
        async exec(command, args) {
          assert.equal(command, 'timeout')
          assert.equal(args[1], 'gh')
          assert.ok(args.includes('POST'))
          assert.ok(args.includes('repos/owner/repo/issues/479/comments'))
          result.comments.push(
            JSON.parse(readFileSync(args.at(-1), 'utf8')).body,
          )
          return 0
        },
      },
    )
    return result
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

test('current reviews publish the checked-out PR head, including LGTM', async () => {
  const result = await publishReview()
  assert.equal(result.gitCalls, 1)
  assert.equal(result.prCalls, 1)
  assert.deepEqual(result.comments, [
    `Reviewed commit: [aaaaaaa](https://github.com/owner/repo/commit/${reviewedHead})\n\nLGTM`,
  ])
  assert.deepEqual(result.summaries, result.comments)
})

test('size-limit skips match the UI comment and explain the manual bypass', async () => {
  for (const [skipReason, message] of [
    [
      'limit',
      '⚠️ Codex review skipped: 154 reviewable files / 7852 changed lines\n' +
        'exceed the automated-review limit (150 files / 15,000 lines).',
    ],
    [
      'diff-size',
      '⚠️ Codex review skipped because the filtered diff exceeds the 512 KiB automated-review limit.',
    ],
  ]) {
    const result = await publishReview({ skipReason, reviewable: 'false' })
    assert.deepEqual(result.comments, [
      `Reviewed commit: [aaaaaaa](https://github.com/owner/repo/commit/${reviewedHead})\n\n` +
        message +
        '\nSplit this PR or comment `@codex_review` to run manually and bypass size limits (requires write access).',
    ])
    assert.deepEqual(result.summaries, result.comments)
  }
})

test('stale size-limit skips and non-reviewable changes publish nothing', async () => {
  for (const skipReason of ['limit', 'diff-size', '']) {
    const result = await publishReview({
      currentHead: 'b'.repeat(40),
      skipReason,
      reviewable: 'false',
    })
    assert.deepEqual(result.comments, [])
    assert.deepEqual(result.summaries, [])
  }
})

test('a new PR head suppresses both LGTM and findings from an older review', async () => {
  for (const review of ['LGTM', 'A finding from the old commit']) {
    const result = await publishReview({ currentHead: 'b'.repeat(40), review })
    assert.equal(result.gitCalls, 1)
    assert.equal(result.prCalls, 1)
    assert.deepEqual(result.comments, [])
    assert.deepEqual(result.summaries, [])
    assert.match(result.logs[0], /Skipping stale Codex review/)
  }
})

test('revision lookup failures prevent publishing an unverified review', async () => {
  await assert.rejects(
    publishReview({ failure: 'git' }),
    /Reviewed head lookup failed/,
  )
  await assert.rejects(publishReview({ failure: 'api' }), /PR lookup failed/)
})

test('workspace preparation failures still publish without requiring a checkout', async () => {
  const result = await publishReview({
    actionOutcome: 'failure',
    failure: 'git',
  })
  assert.equal(result.gitCalls, 0)
  assert.equal(result.prCalls, 0)
  assert.deepEqual(result.comments, [
    '⚠️ Codex review could not prepare the PR workspace. Please check the workflow logs.',
  ])
})
