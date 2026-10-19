import { RpcError } from '@protobuf-ts/runtime-rpc'
import { vi, test, expect, describe, afterEach } from 'vitest'
import { GrpcUnaryRequestException } from '@injectivelabs/exceptions'
import * as CompetitionPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_tc_competition_service_pb'
import { CompetitionGrpcApi } from './CompetitionGrpcApi.js'

const api = new CompetitionGrpcApi('http://localhost:9090')
const accountAddress = 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e'
const id = 9007199254740993n

function mockResponse(response: object) {
  const transport = api.getTransport()

  // executeGrpcCall awaits the UnaryCall's completed result, not just its response.
  return vi
    .spyOn(transport, 'unary')
    .mockImplementation(
      () =>
        Promise.resolve({ response }) as unknown as ReturnType<
          typeof transport.unary
        >,
    )
}

afterEach(() => vi.restoreAllMocks())

describe('CompetitionGrpcApi', () => {
  test('fetchCurrentCompetition dispatches the empty request and preserves exact values', async () => {
    const unary = mockResponse(
      CompetitionPb.GetCurrentCompetitionResponse.create({
        id,
        title: 'Competition',
        start: '2026-10-01T00:00:00Z',
        end: '2026-11-01T00:00:00Z',
        status: 'future-status',
        final: true,
        minEntryVolumeUsd: '1000.000000000000000001',
        roiMin: '0.050000000000000001',
      }),
    )

    expect(await api.fetchCurrentCompetition()).toStrictEqual({
      id: '9007199254740993',
      title: 'Competition',
      start: '2026-10-01T00:00:00Z',
      end: '2026-11-01T00:00:00Z',
      status: 'future-status',
      final: true,
      minEntryVolumeUsd: '1000.000000000000000001',
      roiMin: '0.050000000000000001',
    })
    expect(unary).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        name: 'GetCurrentCompetition',
        service: expect.objectContaining({
          typeName: 'tc_competition_service.TCCompetitionService',
        }),
      }),
      CompetitionPb.GetCurrentCompetitionRequest.create(),
      expect.any(Object),
    )
  })

  test('fetchCompetitionTrader maps its request and lossless IDs/ranks without deriving flags', async () => {
    const unary = mockResponse(
      CompetitionPb.GetCompetitionTraderResponse.create({
        competitionId: id,
        accountAddress,
        referred: false,
        participating: true,
        referrerCode: 'CODE',
        volumeUsd: '1234.000000000000000001',
        volumeRank: 9007199254740995n,
        entered: false,
        roi: '-0.123456789012345678901',
        roiRank: 9007199254740997n,
        roiQualified: true,
      }),
    )

    expect(
      await api.fetchCompetitionTrader({ id, accountAddress }),
    ).toStrictEqual({
      competitionId: '9007199254740993',
      accountAddress,
      referred: false,
      participating: true,
      referrerCode: 'CODE',
      volumeUsd: '1234.000000000000000001',
      volumeRank: '9007199254740995',
      entered: false,
      roi: '-0.123456789012345678901',
      roiRank: '9007199254740997',
      roiQualified: true,
    })
    expect(unary).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ name: 'GetCompetitionTrader' }),
      { id: 9007199254740993n, accountAddress },
      expect.any(Object),
    )
  })

  test('fetchCompetitionReferrer maps its request and every bigint count independently', async () => {
    const unary = mockResponse(
      CompetitionPb.GetCompetitionReferrerResponse.create({
        competitionId: id,
        accountAddress,
        codes: ['CODE', 'OTHER'],
        inviteesTotal: 9007199254740999n,
        inviteesEntered: 9007199254740995n,
        inviteesClose: 9007199254740997n,
      }),
    )

    expect(
      await api.fetchCompetitionReferrer({ id, accountAddress }),
    ).toStrictEqual({
      competitionId: '9007199254740993',
      accountAddress,
      codes: ['CODE', 'OTHER'],
      inviteesTotal: '9007199254740999',
      inviteesEntered: '9007199254740995',
      inviteesClose: '9007199254740997',
    })
    expect(unary).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ name: 'GetCompetitionReferrer' }),
      { id: 9007199254740993n, accountAddress },
      expect.any(Object),
    )
  })

  test('fetchCompetitionReferrerInvitees maps the repeated filter and each invitee', async () => {
    const unary = mockResponse(
      CompetitionPb.ListCompetitionReferrerInviteesResponse.create({
        invitees: [
          CompetitionPb.CompetitionInvitee.create({
            accountAddress,
            volumeUsd: '0.000000000000000001',
            entered: true,
          }),
          CompetitionPb.CompetitionInvitee.create(),
        ],
      }),
    )

    expect(
      await api.fetchCompetitionReferrerInvitees({
        id,
        accountAddress,
        invitee: [accountAddress, '0x0000000000000000000000000000000000000001'],
      }),
    ).toStrictEqual({
      invitees: [
        { accountAddress, volumeUsd: '0.000000000000000001', entered: true },
        { accountAddress: '', volumeUsd: '', entered: false },
      ],
    })
    expect(unary).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ name: 'ListCompetitionReferrerInvitees' }),
      {
        id: 9007199254740993n,
        accountAddress,
        invitee: [accountAddress, '0x0000000000000000000000000000000000000001'],
      },
      expect.any(Object),
    )
  })

  test('preserves absent trader optionals and generated defaults', async () => {
    mockResponse(CompetitionPb.GetCompetitionTraderResponse.create())

    expect(
      await api.fetchCompetitionTrader({ id: 0n, accountAddress: '' }),
    ).toStrictEqual({
      competitionId: '0',
      accountAddress: '',
      referred: false,
      participating: false,
      referrerCode: undefined,
      volumeUsd: '',
      volumeRank: undefined,
      entered: false,
      roi: undefined,
      roiRank: undefined,
      roiQualified: false,
    })
  })

  test('preserves present zero ranks, empty optional strings, and independent opposite flags', async () => {
    mockResponse(
      CompetitionPb.GetCompetitionTraderResponse.create({
        referred: true,
        participating: false,
        referrerCode: '',
        volumeRank: 0n,
        entered: true,
        roi: '',
        roiRank: 0n,
        roiQualified: false,
      }),
    )

    expect(
      await api.fetchCompetitionTrader({ id: 0n, accountAddress: '' }),
    ).toStrictEqual({
      competitionId: '0',
      accountAddress: '',
      referred: true,
      participating: false,
      referrerCode: '',
      volumeUsd: '',
      volumeRank: '0',
      entered: true,
      roi: '',
      roiRank: '0',
      roiQualified: false,
    })
  })

  test('preserves positive decimal ROI and distinguishes all trader flags', async () => {
    mockResponse(
      CompetitionPb.GetCompetitionTraderResponse.create({
        referred: true,
        participating: true,
        entered: false,
        roiQualified: false,
        roi: '0.123456789012345678901',
      }),
    )

    expect(
      await api.fetchCompetitionTrader({ id: 0n, accountAddress: '' }),
    ).toStrictEqual({
      competitionId: '0',
      accountAddress: '',
      referred: true,
      participating: true,
      referrerCode: undefined,
      volumeUsd: '',
      volumeRank: undefined,
      entered: false,
      roi: '0.123456789012345678901',
      roiRank: undefined,
      roiQualified: false,
    })
  })

  test('preserves current competition defaults', async () => {
    mockResponse(CompetitionPb.GetCurrentCompetitionResponse.create())

    expect(await api.fetchCurrentCompetition()).toStrictEqual({
      id: '0',
      title: '',
      start: '',
      end: '',
      status: '',
      final: false,
      minEntryVolumeUsd: '',
      roiMin: '',
    })
  })

  test('preserves referrer zero counts and empty codes', async () => {
    mockResponse(CompetitionPb.GetCompetitionReferrerResponse.create())

    expect(
      await api.fetchCompetitionReferrer({ id: 0n, accountAddress: '' }),
    ).toStrictEqual({
      competitionId: '0',
      accountAddress: '',
      codes: [],
      inviteesTotal: '0',
      inviteesEntered: '0',
      inviteesClose: '0',
    })
  })

  test('preserves an empty invitee filter and empty response list', async () => {
    const unary = mockResponse(
      CompetitionPb.ListCompetitionReferrerInviteesResponse.create(),
    )

    expect(
      await api.fetchCompetitionReferrerInvitees({
        id,
        accountAddress,
        invitee: [],
      }),
    ).toStrictEqual({ invitees: [] })
    expect(unary.mock.calls[0][1]).toEqual({ id, accountAddress, invitee: [] })
  })

  test.each([
    ['NOT_FOUND', 5, 'getCurrentCompetition'],
    ['INVALID_ARGUMENT', 3, 'getCompetitionTrader'],
  ] as const)(
    'wraps %s using existing error handling without retrying',
    async (status, code, method) => {
      const unary = vi
        .spyOn(api.getTransport(), 'unary')
        .mockImplementation(() => {
          throw new RpcError('competition request failed', status)
        })
      const call =
        method === 'getCurrentCompetition'
          ? api.fetchCurrentCompetition()
          : api.fetchCompetitionTrader({ id: -1n, accountAddress: 'invalid' })

      await expect(call).rejects.toBeInstanceOf(GrpcUnaryRequestException)
      await expect(call).rejects.toMatchObject({
        message: 'competition request failed',
        code,
        contextModule: 'platform-services',
        context: `${method} (baseUrl: http://localhost:9090)`,
        metadata: {
          grpcStatusName: status,
          isRetryableGrpcStatus: false,
          retryAttempt: 1,
          wasRetried: false,
        },
      })
      expect(unary).toHaveBeenCalledTimes(1)
    },
  )
})
