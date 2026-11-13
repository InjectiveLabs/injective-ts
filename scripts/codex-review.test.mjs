import test from 'node:test'
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const workflow = readFileSync(
  new URL('../.github/workflows/codex-review.yml', import.meta.url),
  'utf8',
)
const script = workflow
  .split('      - name: Resolve review request\n')[1]
  .split('      - name: Codex Review\n')[0]
  .split('          script: |\n')[1]
  .split('\n')
  .map((line) => line.slice(12))
  .join('\n')
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
const resolveRequest = new AsyncFunction('github', 'context', 'core', script)
const pullRequest = {
  number: 479,
  state: 'open',
  draft: false,
  head: { ref: 'feature', repo: { full_name: 'org/repo' } },
}

async function request({
  eventName = 'issue_comment',
  body = '@codex_review',
  permission = 'write',
  pr = pullRequest,
  isPullRequest = true,
} = {}) {
  const outputs = {}
  const calls = []
  await resolveRequest(
    {
      rest: {
        repos: {
          async getCollaboratorPermissionLevel(args) {
            calls.push('permission')
            assert.deepEqual(args, {
              owner: 'org',
              repo: 'repo',
              username: 'reviewer',
            })

            return { data: { permission } }
          },
        },
        pulls: {
          async get(args) {
            calls.push('pr')
            assert.deepEqual(args, {
              owner: 'org',
              repo: 'repo',
              pull_number: 479,
            })

            return { data: pr }
          },
        },
      },
    },
    {
      eventName,
      repo: { owner: 'org', repo: 'repo' },
      issue: { number: 479 },
      payload: {
        pull_request: eventName === 'pull_request' ? pr : undefined,
        issue: { pull_request: isPullRequest ? {} : undefined },
        comment: { body, user: { login: 'reviewer' } },
      },
    },
    {
      setOutput: (name, value) => {
        outputs[name] = value
      },
    },
  )

  return { outputs, calls }
}

test('manual review authorizes the commenter and bypasses limits', async () => {
  for (const permission of ['write', 'maintain', 'admin']) {
    for (const body of ['@codex_review', '  @CODEX_REVIEW\n']) {
      const { outputs, calls } = await request({ permission, body })
      assert.deepEqual(outputs, {
        'pull-request-number': '479',
        'bypass-limits': 'true',
      })
      assert.deepEqual(calls, ['permission', 'pr'])
    }
  }
})

test('untrusted commenters cannot request a review', async () => {
  for (const permission of ['read', 'triage', 'none']) {
    const { outputs, calls } = await request({ permission })
    assert.deepEqual(outputs, {})
    assert.deepEqual(calls, ['permission'])
  }
})

test('ordinary issues, quoted commands, and arguments schedule no review', async () => {
  for (const options of [
    { isPullRequest: false },
    { body: 'Please use @codex_review' },
    { body: '@codex_review all' },
    { body: '@codex_review_extra' },
    { body: '' },
  ]) {
    assert.deepEqual(await request(options), { outputs: {}, calls: [] })
  }
})

test('automatic and manual reviews preserve PR exclusions', async () => {
  for (const eventName of ['pull_request', 'issue_comment']) {
    for (const pr of [
      { ...pullRequest, state: 'closed' },
      { ...pullRequest, draft: true },
      {
        ...pullRequest,
        head: { ref: 'feature', repo: { full_name: 'fork/repo' } },
      },
      { ...pullRequest, head: { ref: 'feature', repo: null } },
      { ...pullRequest, head: { ...pullRequest.head, ref: 'release/v1.0.0' } },
      { ...pullRequest, title: 'chore: release' },
    ]) {
      assert.deepEqual((await request({ eventName, pr })).outputs, {})
    }
  }
})

test('automatic reviews keep limits and need no commenter permission lookup', async () => {
  assert.deepEqual(await request({ eventName: 'pull_request' }), {
    outputs: { 'pull-request-number': '479', 'bypass-limits': 'false' },
    calls: [],
  })
})

test('automatic and manual reviews use separate per-PR queues', () => {
  assert.ok(
    workflow.includes(
      "group: codex-review-${{ github.event_name == 'issue_comment' && 'manual' || 'automatic' }}-${{ github.event.pull_request.number || github.event.issue.number }}",
    ),
  )
  assert.match(
    workflow,
    /cancel-in-progress: \$\{\{ github.event_name == 'pull_request' \}\}/,
  )
})

test('workflow passes the resolved PR and bypass flag to the shared action and publisher', () => {
  assert.match(workflow, /issue_comment:\n\s+types: \[created\]/)
  assert.match(
    workflow,
    /cancel-in-progress: \$\{\{ github.event_name == 'pull_request' \}\}/,
  )
  assert.match(
    workflow,
    /pull-request-number: \$\{\{ steps.request.outputs.pull-request-number \}\}/,
  )
  assert.match(
    workflow,
    /bypass-limits: \$\{\{ steps.request.outputs.bypass-limits \}\}/,
  )
  assert.match(
    workflow,
    /PR_NUMBER: \$\{\{ steps.request.outputs.pull-request-number \}\}/,
  )
  assert.match(
    workflow,
    /if: always\(\) && steps.request.outputs.pull-request-number != ''/,
  )
})
