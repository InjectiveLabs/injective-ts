import { AbiItem } from 'web3-utils'

const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenContract',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_destination',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'sendToCosmos',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
    ],
    name: 'setNonce',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_peggyId',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_powerThreshold',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: '_validators',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_powers',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_tokenContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_destination',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_eventNonce',
        type: 'uint256',
      },
    ],
    name: 'SendToCosmosEvent',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_currentValidators',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_currentPowers',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: '_currentValsetNonce',
        type: 'uint256',
      },
      {
        internalType: 'uint8[]',
        name: '_v',
        type: 'uint8[]',
      },
      {
        internalType: 'bytes32[]',
        name: '_r',
        type: 'bytes32[]',
      },
      {
        internalType: 'bytes32[]',
        name: '_s',
        type: 'bytes32[]',
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'address[]',
        name: '_destinations',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_fees',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: '_batchNonce',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_tokenContract',
        type: 'address',
      },
    ],
    name: 'submitBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: '_batchNonce',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_eventNonce',
        type: 'uint256',
      },
    ],
    name: 'TransactionBatchExecutedEvent',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_newValidators',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_newPowers',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: '_newValsetNonce',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: '_currentValidators',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_currentPowers',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: '_currentValsetNonce',
        type: 'uint256',
      },
      {
        internalType: 'uint8[]',
        name: '_v',
        type: 'uint8[]',
      },
      {
        internalType: 'bytes32[]',
        name: '_r',
        type: 'bytes32[]',
      },
      {
        internalType: 'bytes32[]',
        name: '_s',
        type: 'bytes32[]',
      },
    ],
    name: 'updateValset',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: '_newValsetNonce',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: '_validators',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: '_powers',
        type: 'uint256[]',
      },
    ],
    name: 'ValsetUpdatedEvent',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_erc20Address',
        type: 'address',
      },
    ],
    name: 'lastBatchNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'state_lastBatchNonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'state_lastEventNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'state_lastValsetCheckpoint',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'state_lastValsetNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'state_peggyId',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'state_powerThreshold',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_currentValidators',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_currentPowers',
        type: 'uint256[]',
      },
      {
        internalType: 'uint8[]',
        name: '_v',
        type: 'uint8[]',
      },
      {
        internalType: 'bytes32[]',
        name: '_r',
        type: 'bytes32[]',
      },
      {
        internalType: 'bytes32[]',
        name: '_s',
        type: 'bytes32[]',
      },
      {
        internalType: 'bytes32',
        name: '_theHash',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_powerThreshold',
        type: 'uint256',
      },
    ],
    name: 'testCheckValidatorSignatures',
    outputs: [],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_validators',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_powers',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: '_valsetNonce',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_peggyId',
        type: 'bytes32',
      },
    ],
    name: 'testMakeCheckpoint',
    outputs: [],
    stateMutability: 'pure',
    type: 'function',
  },
] as AbiItem[]

export default abi
