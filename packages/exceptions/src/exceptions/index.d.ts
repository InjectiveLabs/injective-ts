import { GrpcUnaryRequestException } from './GrpcUnaryRequestException';
import { HttpRequestException } from './HttpRequestException';
import { Web3Exception } from './Web3Exception';
import { GeneralException } from './GeneralException';
import { LedgerException } from './LedgerException';
import { LedgerCosmosException } from './LedgerCosmosException';
import { MetamaskException } from './MetamaskException';
import { TrustWalletException } from './TrustWalletException';
import { OkxWalletException } from './OkxWalletException';
import { TrezorException } from './TrezorException';
import { CosmosWalletException } from './CosmosWalletException';
import { TransactionException } from './TransactionException';
import { WalletException } from './WalletException';
import { Exception } from '../types';
import { BitGetException } from './BitGetException';
export type ThrownException = GrpcUnaryRequestException | HttpRequestException | Web3Exception | GeneralException | LedgerException | MetamaskException | TrustWalletException | OkxWalletException | TrezorException | CosmosWalletException | TransactionException | WalletException | LedgerCosmosException | BitGetException;
export declare const isThrownException: (exception: Error | Exception) => boolean;
export { Web3Exception, LedgerException, TrezorException, WalletException, GeneralException, BitGetException, MetamaskException, TransactionException, TrustWalletException, OkxWalletException, HttpRequestException, LedgerCosmosException, CosmosWalletException, GrpcUnaryRequestException, };
//# sourceMappingURL=index.d.ts.map