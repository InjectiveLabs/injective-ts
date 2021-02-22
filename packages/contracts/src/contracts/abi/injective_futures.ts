import { AbiItem } from 'web3-utils'

const abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: '_minimumMarginRatio',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'auctionTimeInterval_',
        type: 'uint256',
      },
      {
        internalType: 'contract ERC20Burnable',
        name: 'injectiveToken_',
        type: 'address',
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
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'subAccountID',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'subAccountNonce',
        type: 'uint256',
      },
    ],
    name: 'AccountCreation',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'subaccountID',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'contractPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantityFilled',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isLong',
        type: 'bool',
      },
    ],
    name: 'FuturesCancel',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: 'isResultingPositionLong',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'positionID',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'subaccountID',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'resultingMargin',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'resultingEntryPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'resultingQuantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'cumulativeFundingEntry',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isTradeDirectionLong',
        type: 'bool',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'executionPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'executionQuantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalForOrderFilled',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum Types.TradeType',
        name: 'tradeType',
        type: 'uint8',
      },
    ],
    name: 'FuturesTrade',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'positionID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'changedMargin',
        type: 'int256',
      },
    ],
    name: 'MarginChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'string',
        name: 'ticker',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'oracle',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'maintenanceMarginRatio',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'initialMarginRatio',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'makerTxFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'takerTxFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'relayerFeePercentage',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fundingInterval',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expirationTime',
        type: 'uint256',
      },
    ],
    name: 'MarketCreation',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'fundingFee',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'cumulativeFunding',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expiryOrNextFundingTimestamp',
        type: 'uint256',
      },
    ],
    name: 'SetFunding',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'signerAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'validatorAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isApproved',
        type: 'bool',
      },
    ],
    name: 'SignatureValidatorApproval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'enum MixinAccounts.DepositChangeType',
        name: 'depositChangeType',
        type: 'uint8',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'subAccountID',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'changeAmount',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentAmount',
        type: 'uint256',
      },
    ],
    name: 'SubaccountDepositsChange',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mostRecentEpochVolume',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mostRecentEpochQuantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'mostRecentEpochScaledContractIndexDiff',
        type: 'int256',
      },
    ],
    name: 'UpdateValuesForVWAP',
    type: 'event',
  },
  {
    inputs: [],
    name: 'EIP712_EXCHANGE_DOMAIN_HASH',
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
    name: 'MINIMUM_MARGIN_RATIO',
    outputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'TEC_ADDRESS',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'accounts',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'subAccountID',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'subAccountNonce',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'subAccountID',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'positionID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'addedMargin',
        type: 'uint256',
      },
    ],
    name: 'addMarginIntoPosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'addressToSubAccountIDs',
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
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'allowedValidators',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'auction',
    outputs: [
      {
        internalType: 'contract IAuction',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'auctionTimeInterval',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'baseCurrencies',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order[]',
        name: 'orders',
        type: 'tuple[]',
      },
    ],
    name: 'batchCancelOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32[]',
        name: 'marketIDs',
        type: 'bytes32[]',
      },
    ],
    name: 'batchCheckFunding',
    outputs: [
      {
        internalType: 'bool[]',
        name: '',
        type: 'bool[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20[]',
        name: 'baseCurrencies',
        type: 'address[]',
      },
      {
        internalType: 'bytes32[]',
        name: 'subAccountIDs',
        type: 'bytes32[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    name: 'batchDepositFor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        internalType: 'int256',
        name: 'cumulativeFundingEntry',
        type: 'int256',
      },
    ],
    name: 'calcCumulativeFunding',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
    ],
    name: 'calcLiquidationFee',
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
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    name: 'calcMinMargin',
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
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'cancelOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'cancelled',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'maxBaseCurrencyCap_',
        type: 'uint256',
      },
    ],
    name: 'changeMaxBaseCurrencyCap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
    ],
    name: 'checkFunding',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionID',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order[]',
        name: 'orders',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isRevertingOnPartialFills',
        type: 'bool',
      },
      {
        internalType: 'bytes[]',
        name: 'signatures',
        type: 'bytes[]',
      },
    ],
    name: 'closePosition',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'positionID',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'marginUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quantity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fee',
            type: 'uint256',
          },
        ],
        internalType: 'struct MixinOrders.PositionResults',
        name: 'results',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'trader',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subAccountNonce',
        type: 'uint256',
      },
    ],
    name: 'computeSubAccountIdFromNonce',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'createDefaultSubAccountAndDeposit',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'ticker',
        type: 'string',
      },
      {
        internalType: 'contract IERC20',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'initialMarginRatio',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'maintenanceMarginRatio',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'fundingInterval',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expirationTime',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'makerTxFee',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'takerTxFee',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'relayerFeePercentage',
        type: 'tuple',
      },
    ],
    name: 'createMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'ticker',
        type: 'string',
      },
      {
        internalType: 'contract IERC20',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'initialMarginRatio',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'maintenanceMarginRatio',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'fundingInterval',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expirationTime',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'makerTxFee',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'takerTxFee',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'relayerFeePercentage',
        type: 'tuple',
      },
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
    ],
    name: 'createMarketWithFixedMarketId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subAccountNonce',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'createSubAccountAndDeposit',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'trader',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subAccountNonce',
        type: 'uint256',
      },
    ],
    name: 'createSubAccountForTraderWithNonce',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentEndingTimeForAuction',
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
        internalType: 'contract IERC20',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'subAccountID',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'depositFor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'subAccountID',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'depositIntoSubAccount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyStopFutures',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    name: 'epochFees',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'filled',
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
        internalType: 'contract IERC20',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'trader',
        type: 'address',
      },
    ],
    name: 'getDefaultSubAccountDeposits',
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
        name: 'trader',
        type: 'address',
      },
    ],
    name: 'getDefaultSubAccountIdForTrader',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order',
        name: 'order',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'indexPrice',
        type: 'uint256',
      },
    ],
    name: 'getOrderRelevantState',
    outputs: [
      {
        components: [
          {
            internalType: 'enum LibOrder.OrderType',
            name: 'orderType',
            type: 'uint8',
          },
          {
            internalType: 'enum LibOrder.OrderStatus',
            name: 'orderStatus',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'orderHash',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'orderTakerAssetFilledAmount',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'subAccountID',
            type: 'bytes32',
          },
          {
            internalType: 'enum Types.Direction',
            name: 'direction',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'marketID',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'entryPrice',
            type: 'uint256',
          },
        ],
        internalType: 'struct LibOrder.DerivativeOrderInfo',
        name: 'orderInfo',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'fillableTakerAssetAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isValidSignature',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order[]',
        name: 'orders',
        type: 'tuple[]',
      },
      {
        internalType: 'bytes[]',
        name: 'signatures',
        type: 'bytes[]',
      },
    ],
    name: 'getOrderRelevantStates',
    outputs: [
      {
        components: [
          {
            internalType: 'enum LibOrder.OrderType',
            name: 'orderType',
            type: 'uint8',
          },
          {
            internalType: 'enum LibOrder.OrderStatus',
            name: 'orderStatus',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'orderHash',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'orderTakerAssetFilledAmount',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'subAccountID',
            type: 'bytes32',
          },
          {
            internalType: 'enum Types.Direction',
            name: 'direction',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'marketID',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'entryPrice',
            type: 'uint256',
          },
        ],
        internalType: 'struct LibOrder.DerivativeOrderInfo[]',
        name: 'ordersInfo',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256[]',
        name: 'fillableTakerAssetAmounts',
        type: 'uint256[]',
      },
      {
        internalType: 'bool[]',
        name: 'isValidSignature',
        type: 'bool[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'trader',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
    ],
    name: 'getPositionIDsForTrader',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'positionIDs',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'trader',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
    ],
    name: 'getPositionsForTrader',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'subAccountID',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'marketID',
            type: 'bytes32',
          },
          {
            internalType: 'enum Types.Direction',
            name: 'direction',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'quantity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'entryPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'margin',
            type: 'uint256',
          },
          {
            internalType: 'int256',
            name: 'cumulativeFundingEntry',
            type: 'int256',
          },
        ],
        internalType: 'struct Types.Position[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'trader',
        type: 'address',
      },
    ],
    name: 'getTraderSubAccountsCount',
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
        internalType: 'uint256',
        name: 'positionID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'priceToUse',
        type: 'uint256',
      },
    ],
    name: 'getUnitPositionValue',
    outputs: [
      {
        internalType: 'int256',
        name: 'unitPositionValue',
        type: 'int256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'insurancePools',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'isFuturesMarketSettled',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    name: 'isValidBaseCurrency',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order',
        name: 'order',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'isValidOrderSignature',
    outputs: [
      {
        internalType: 'bool',
        name: 'isValid',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'lastValidVWAP',
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
        internalType: 'uint256',
        name: 'positionID',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order[]',
        name: 'orders',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        internalType: 'bytes[]',
        name: 'signatures',
        type: 'bytes[]',
      },
    ],
    name: 'liquidatePosition',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'positionID',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'marginUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quantity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fee',
            type: 'uint256',
          },
        ],
        internalType: 'struct MixinOrders.PositionResults',
        name: 'results',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'marketCount',
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
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order[]',
        name: 'orders',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'margin',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'subAccountID',
        type: 'bytes32',
      },
      {
        internalType: 'bool',
        name: 'isRevertingOnPartialFills',
        type: 'bool',
      },
      {
        internalType: 'bytes[]',
        name: 'signatures',
        type: 'bytes[]',
      },
    ],
    name: 'marketOrders',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'makerPositionID',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerPositionID',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerMarginUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerMarginUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quantityFilled',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFeePaid',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFeePaid',
            type: 'uint256',
          },
        ],
        internalType: 'struct MixinOrders.FillResults[]',
        name: 'results',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'marketSerialToID',
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
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'markets',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        internalType: 'contract IERC20',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'ticker',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'initialMarginRatio',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct PermyriadMath.Permyriad',
        name: 'maintenanceMarginRatio',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'indexPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiryOrNextFundingTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'fundingInterval',
        type: 'uint256',
      },
      {
        internalType: 'int256',
        name: 'cumulativeFunding',
        type: 'int256',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            internalType: 'struct PermyriadMath.Permyriad',
            name: 'maker',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            internalType: 'struct PermyriadMath.Permyriad',
            name: 'taker',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            internalType: 'struct PermyriadMath.Permyriad',
            name: 'relayer',
            type: 'tuple',
          },
        ],
        internalType: 'struct Types.TransactionFees',
        name: 'transactionFees',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order',
        name: 'leftOrder',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order',
        name: 'rightOrder',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'leftSignature',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'rightSignature',
        type: 'bytes',
      },
    ],
    name: 'matchOrders',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'leftPositionID',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rightPositionID',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'leftMarginUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rightMarginUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quantityFilled',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'leftFeePaid',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rightFeePaid',
            type: 'uint256',
          },
        ],
        internalType: 'struct MixinOrders.MatchResults',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxBaseCurrencyCap',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'mostRecentEpochQuantity',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'mostRecentEpochVolume',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'mostRecentEpochWeightedAverageContractIndexDiff',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'mostRecentmostRecentEpochVolumeEpochQuantity',
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
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order[]',
        name: 'leftOrders',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order',
        name: 'rightOrder',
        type: 'tuple',
      },
      {
        internalType: 'bytes[]',
        name: 'leftSignatures',
        type: 'bytes[]',
      },
      {
        internalType: 'bytes',
        name: 'rightSignature',
        type: 'bytes',
      },
    ],
    name: 'multiMatchOrders',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'leftPositionID',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rightPositionID',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'leftMarginUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rightMarginUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quantityFilled',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'leftFeePaid',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rightFeePaid',
            type: 'uint256',
          },
        ],
        internalType: 'struct MixinOrders.MatchResults[]',
        name: 'results',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'payIntoInsurancePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'positionCount',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'positions',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'subAccountID',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        internalType: 'enum Types.Direction',
        name: 'direction',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'entryPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'margin',
        type: 'uint256',
      },
      {
        internalType: 'int256',
        name: 'cumulativeFundingEntry',
        type: 'int256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'preSigned',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    name: 'restrictedDeposits',
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
    name: 'resumeFutures',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
    ],
    name: 'setFundingRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'subaccountID',
        type: 'bytes32',
      },
    ],
    name: 'settleExpiryFuturesPosition',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'positionID',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quantity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'txFees',
            type: 'uint256',
          },
        ],
        internalType: 'struct MixinPositions.SettleResults',
        name: 'results',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'marketID',
        type: 'bytes32',
      },
    ],
    name: 'settleMarket',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    name: 'subAccountDeposits',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'subAccountIdToAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'subAccountToMarketToPositionID',
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
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionID',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'makerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'makerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takerFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTimeSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order[]',
        name: 'orders',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        internalType: 'bytes[]',
        name: 'signatures',
        type: 'bytes[]',
      },
    ],
    name: 'vaporizePosition',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'positionID',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'marginUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quantity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fee',
            type: 'uint256',
          },
        ],
        internalType: 'struct MixinOrders.PositionResults',
        name: 'results',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'subAccountID',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawForSubAccount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawFromDefaultSubAccount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'subAccountID',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawFromSubAccount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as AbiItem[]

export default abi
