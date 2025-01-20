# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.14.35 (2025-01-20)


### Bug Fixes

* account pagination ([3edcd33](https://github.com/InjectiveLabs/injective-ts/commit/3edcd334245ed13d84e7ec65600c1999bada06e6))
* account txs messages returned as empty array ([a7df3ae](https://github.com/InjectiveLabs/injective-ts/commit/a7df3ae9ebd620b4d3188bc1e9756c872b782ae9))
* actual block time ([f31d2df](https://github.com/InjectiveLabs/injective-ts/commit/f31d2dfe8f03f66108793a05bdee8968ab723eda))
* add DerivativeOrderSide ([5ce6a71](https://github.com/InjectiveLabs/injective-ts/commit/5ce6a71ab37a6d1c6e3de0dfa7afaa505f966891))
* add ethereumAddress from wallet ([5f27985](https://github.com/InjectiveLabs/injective-ts/commit/5f27985a3512fbab3f5c0a7defc7989dac6646dc))
* add linebrakes in transformer file ([2c8effd](https://github.com/InjectiveLabs/injective-ts/commit/2c8effdfde1f190e46f99e916a20974db8a002b2))
* add missing params in functions ([3cd74e9](https://github.com/InjectiveLabs/injective-ts/commit/3cd74e91a3b77779b1bf4b77af89e098442ddc6a))
* add order mask to batch cancel spot order message ([#71](https://github.com/InjectiveLabs/injective-ts/issues/71)) ([def9257](https://github.com/InjectiveLabs/injective-ts/commit/def9257f957fe0f543ca02550fae86f9a59bc642))
* add timeout height option to pk broadcaster ([1430d84](https://github.com/InjectiveLabs/injective-ts/commit/1430d84381bd7243a7b38b01e4f5a0de345aef10))
* added eip712 sign on private key ([84b628c](https://github.com/InjectiveLabs/injective-ts/commit/84b628c967d57c977b981faeca2021d8711a0de1))
* added executionSide prop to trade objects ([#78](https://github.com/InjectiveLabs/injective-ts/issues/78)) ([35da59c](https://github.com/InjectiveLabs/injective-ts/commit/35da59c33c9fb8a198306b4bbcaf27dd407a4fda))
* added no throw variant of oracle prices for BO ([7fbfd77](https://github.com/InjectiveLabs/injective-ts/commit/7fbfd77998aa5259f774d6f22e0b2d6cb6aeb26c))
* added symbols for erc20 ([e157eb9](https://github.com/InjectiveLabs/injective-ts/commit/e157eb91f1621ed4b3ced8b0ee81adbfb25782df))
* added version to sign only a hashed message ([ad31809](https://github.com/InjectiveLabs/injective-ts/commit/ad318090893900df76a6de24de55a2964f9610f0))
* address derivation ([ef5f438](https://github.com/InjectiveLabs/injective-ts/commit/ef5f43800d521a062b8a3399c844eaa1a8ef25fe))
* alchemy version ([b3cdb5f](https://github.com/InjectiveLabs/injective-ts/commit/b3cdb5fd3aaf0feb51332af65749d113ac666c5c))
* amino for msggrant ([c7f8193](https://github.com/InjectiveLabs/injective-ts/commit/c7f8193fccd85a3b1da5f52a434d1e51311d879c))
* any for contractExecutionAuthorization ([8a2a5d7](https://github.com/InjectiveLabs/injective-ts/commit/8a2a5d73889c0e1a163a3bd5ce2c1dca96a416d1))
* archiver endpoint ([6b295f5](https://github.com/InjectiveLabs/injective-ts/commit/6b295f52cb2d93cf874d929d731ce28bcbc5354e))
* args for MsgExec ([33d5bf4](https://github.com/InjectiveLabs/injective-ts/commit/33d5bf42da38db60e659f640809f37895cfbc32a))
* args for sending cw20 ([b2395de](https://github.com/InjectiveLabs/injective-ts/commit/b2395dece37532562c9fcba442ec6733cf6e5fce))
* auth parsing for different cosmos accounts ([eb8ebf0](https://github.com/InjectiveLabs/injective-ts/commit/eb8ebf0ce1d4ee40134c685f0dee0f9f5367a4ea))
* auth support and positions querying ([bdebabb](https://github.com/InjectiveLabs/injective-ts/commit/bdebabbd3d8218e99a5ba1b66c62465994c8b5ba))
* authorization typeUrl ([f872999](https://github.com/InjectiveLabs/injective-ts/commit/f8729991aeeee8aaf564eaed74ab5b0a5af69e70))
* authz grants ([a71c22b](https://github.com/InjectiveLabs/injective-ts/commit/a71c22bbe7059f09fb7d11cf426c719cd72c57e7))
* base account parsing ([f680ece](https://github.com/InjectiveLabs/injective-ts/commit/f680ece4c4e657d6b0efdbcab1d2bf3c542ba135))
* batch market update params ([4039440](https://github.com/InjectiveLabs/injective-ts/commit/40394409e3a4e421540380e69a946e57a8703308))
* batch update web3 parsing ([13be8ea](https://github.com/InjectiveLabs/injective-ts/commit/13be8eae21fa0dd48c1104d57c59a6e6fbf83a0d))
* bid type map ([8cd3a6d](https://github.com/InjectiveLabs/injective-ts/commit/8cd3a6db24c241eea5255e8d713a058d4036de94))
* bignumber conversion ([7559a3c](https://github.com/InjectiveLabs/injective-ts/commit/7559a3c82bd0acc427d3c0528e1ae8b8ef28cced))
* binary options types ([be3645e](https://github.com/InjectiveLabs/injective-ts/commit/be3645e9c7504eaad89ec54538a06d6d83e99dc4))
* binary options unify ([fa1c0aa](https://github.com/InjectiveLabs/injective-ts/commit/fa1c0aab00d977f73243703bd5f1d4d5e3ec1fb0))
* bind ([f18ae29](https://github.com/InjectiveLabs/injective-ts/commit/f18ae29b91cd23f63171760d59fa5eadf440f895))
* bojan's comment ([e378cf7](https://github.com/InjectiveLabs/injective-ts/commit/e378cf78900fcd4aade5ce5aee1417d4b408ebe5))
* broadcasting and proto decoding ([0cf6367](https://github.com/InjectiveLabs/injective-ts/commit/0cf6367932492aa33b9835ae565bf7a91e16f385))
* broadcasting sync mode on web3gw ([3075246](https://github.com/InjectiveLabs/injective-ts/commit/3075246a17d58bd51594f1882112630f35601ac9))
* broadcasting tx ([5816180](https://github.com/InjectiveLabs/injective-ts/commit/5816180ed2a5c5fdec61ef018d0ae7121f4f9072))
* build ([c511a2b](https://github.com/InjectiveLabs/injective-ts/commit/c511a2ba8da9985536cb168fa3683c77cfaae984))
* build ([c30f86b](https://github.com/InjectiveLabs/injective-ts/commit/c30f86b9e2a18495c3388fa59f945b6de3a4dbf7))
* build errors ([f9771df](https://github.com/InjectiveLabs/injective-ts/commit/f9771dfdc4acd3ba2a34cc603431786323ecfa41))
* build script ([6e8c15f](https://github.com/InjectiveLabs/injective-ts/commit/6e8c15f5d0c0d61e15766abb6217f3fa34cdf791))
* cached denom tokens ([a3abfdd](https://github.com/InjectiveLabs/injective-ts/commit/a3abfdd427b28b3d1e0458fac550b9a5c4d6c360))
* change limit param to optional ([daae254](https://github.com/InjectiveLabs/injective-ts/commit/daae254755b3f8c495e358a6b95fba0b0b35c03e))
* change log ([e039b61](https://github.com/InjectiveLabs/injective-ts/commit/e039b6173a1037bafb026c71f82cb08a073fad6a))
* circular deps ([fc41599](https://github.com/InjectiveLabs/injective-ts/commit/fc415999e4494085d86924736f4dae6d77b2487a))
* class name export ([21c58ab](https://github.com/InjectiveLabs/injective-ts/commit/21c58abd9f5496b43ccfc7a0420d424bb88aa7c3))
* conditional check ([573d75a](https://github.com/InjectiveLabs/injective-ts/commit/573d75a0f9e680e9c7a759ba86070eb01d363b21))
* console log removal ([da3dda8](https://github.com/InjectiveLabs/injective-ts/commit/da3dda8f4e02a2bf98ff8c8448eccb437bd94f8b))
* console logs ([046c171](https://github.com/InjectiveLabs/injective-ts/commit/046c171e1e58e2bf8ba4ada3871a846e1dc013cc))
* correct eip712 hash ([ef45b0f](https://github.com/InjectiveLabs/injective-ts/commit/ef45b0f2f991e6263c04d2a4c0f3ad8a03d4fc95))
* cosmos wallet ([c3416df](https://github.com/InjectiveLabs/injective-ts/commit/c3416dfb68f32d6d4568a6fdb5dd0a7e2bfb60d2))
* cosmos wallet fixes ([71965cb](https://github.com/InjectiveLabs/injective-ts/commit/71965cbc3a8cba1a8fab5dbd0a9e73adf9566714))
* cosmoshub endpoints ([3ddce39](https://github.com/InjectiveLabs/injective-ts/commit/3ddce399160c66853054d99bc05bc5fbf9b97291))
* cw20 send args ([c4a7518](https://github.com/InjectiveLabs/injective-ts/commit/c4a7518c20aaa6d79cb668c4ae70dc1b41023d2b))
* declare interface using pattern of other files ([73de2ab](https://github.com/InjectiveLabs/injective-ts/commit/73de2ab904d8b9334ef246865c43463801a56b37))
* denom client grpc endpoints ([b5aab84](https://github.com/InjectiveLabs/injective-ts/commit/b5aab845a034458b6f312224fe7193767e4a6d5c))
* denom client return undefined for no token denom ([29c6080](https://github.com/InjectiveLabs/injective-ts/commit/29c60809b7f785b23fa34fb0919731cdd40da42b))
* deprecate block mode ([e3975ca](https://github.com/InjectiveLabs/injective-ts/commit/e3975ca06d73508977eb5ce507a9ffa3c7a13b73))
* derivative types ([324829e](https://github.com/InjectiveLabs/injective-ts/commit/324829e741f857211c31c1f657b704cb57474e8c))
* double hashing ([6408b32](https://github.com/InjectiveLabs/injective-ts/commit/6408b3292b38e3e3cda7a2c617c2b7cde3264727))
* eip712 cid ([dcdb609](https://github.com/InjectiveLabs/injective-ts/commit/dcdb6098446413215482e083cc6047ffcad39604))
* eip712 domain ([c2f19ff](https://github.com/InjectiveLabs/injective-ts/commit/c2f19ff1616ac428dff3b3a5ec236085232eea9d))
* eip712 for msgExecuteContract ([b923f1c](https://github.com/InjectiveLabs/injective-ts/commit/b923f1cd6737587f4975fdafee2553c22ec2bd4e))
* eip712 generation ([767f2d7](https://github.com/InjectiveLabs/injective-ts/commit/767f2d7e6b4241945f7a488232b9f08a9093e242))
* eip712 hash ([d35d1dc](https://github.com/InjectiveLabs/injective-ts/commit/d35d1dc55b81b9b9409eb8c050d531ed024db000))
* eip712 improvements ([bfd0f05](https://github.com/InjectiveLabs/injective-ts/commit/bfd0f057bb282e85251c9c56e71289d630dee2a5))
* eip712 types ordering ([f6b96f7](https://github.com/InjectiveLabs/injective-ts/commit/f6b96f77342f45d16f5a39eddf0bedebec3aa38c))
* eip712 typing order ([10e4b6d](https://github.com/InjectiveLabs/injective-ts/commit/10e4b6dad70ae7130a73f23097311f40d61f4859))
* eip712v2 for authz authorizations ([bd99fb4](https://github.com/InjectiveLabs/injective-ts/commit/bd99fb431633a6321d3f522999de4052acc3da29))
* enums ([a6cbd5a](https://github.com/InjectiveLabs/injective-ts/commit/a6cbd5abe32d56533144852284f9f2511147d70e))
* error parsing ([bec75d4](https://github.com/InjectiveLabs/injective-ts/commit/bec75d4ef132ae29f2328f8f71a961c5cf04c4c1))
* error parsing ([def2bf5](https://github.com/InjectiveLabs/injective-ts/commit/def2bf592e8bd0fc092704aaf2c45ead6be19e57))
* error parsing and token type ([c6650fb](https://github.com/InjectiveLabs/injective-ts/commit/c6650fb53dd03fdd87792a4ae4a5b92437b254ed))
* esm import grpc-web ([3cf209f](https://github.com/InjectiveLabs/injective-ts/commit/3cf209f121ca439d025a6cbe6e3d541c1934f27a))
* esm imports ([7ba5cf6](https://github.com/InjectiveLabs/injective-ts/commit/7ba5cf69a58a3d4bb677859737089592c081552a))
* ethers import ([3ea3eae](https://github.com/InjectiveLabs/injective-ts/commit/3ea3eae37f7ab3126d0d67d2a3154d7badc082bd))
* exceptions thrown ([5c6f2ea](https://github.com/InjectiveLabs/injective-ts/commit/5c6f2eacf241a42b52b9e22e1ddf20647aa8d360))
* exchange auction transformer ([383c647](https://github.com/InjectiveLabs/injective-ts/commit/383c647f2cd0ac15a39a101cc99c486b60010230))
* ExchangeRestExplorerTransformer contract transaction transfomer add support for null gas_fee txs ([36b566c](https://github.com/InjectiveLabs/injective-ts/commit/36b566c5ed1bee3c73ed866061cd1e2b150b5142))
* exec args for cw20 send ([de5e9c2](https://github.com/InjectiveLabs/injective-ts/commit/de5e9c2e1e787959af2618e31b78c577c402a038))
* exec function ([e22460e](https://github.com/InjectiveLabs/injective-ts/commit/e22460ec5a50fb573c8a89c9ba10f645e3b10b4d))
* exec params for vaults ([1196e13](https://github.com/InjectiveLabs/injective-ts/commit/1196e13037f6bab7a0132c7e6dc0f6c107506113))
* exec params for vaults ([ec3f4d7](https://github.com/InjectiveLabs/injective-ts/commit/ec3f4d72195a37d2c1b329ebfbf2bc7dde900495))
* exec vault data ([248a3c5](https://github.com/InjectiveLabs/injective-ts/commit/248a3c53f49ff1bee4beb1949de6acfb2e6c62db))
* explorer endpoint ([a39fd93](https://github.com/InjectiveLabs/injective-ts/commit/a39fd93143640d960b075c187d013682e119021a))
* explorer rpc service ([6ab6652](https://github.com/InjectiveLabs/injective-ts/commit/6ab6652af86efc47b300446ea9b7db1cfe074ffc))
* export ([a56004f](https://github.com/InjectiveLabs/injective-ts/commit/a56004fc8cb8f4a933956960e4b7cb9897f698c4))
* export ([9360564](https://github.com/InjectiveLabs/injective-ts/commit/9360564743b3314897700de2fc1ecda18eea7ed1))
* export ([c743932](https://github.com/InjectiveLabs/injective-ts/commit/c74393231625db81a1df6359c43458e28723b1fb))
* export enums ([44f0fb5](https://github.com/InjectiveLabs/injective-ts/commit/44f0fb5c62b6da3dd10d3812b0ac26cba6aaf5f0))
* export for MsgExternalTransfer ([f241a94](https://github.com/InjectiveLabs/injective-ts/commit/f241a94ed8685658a206cb74c60d634deb11c3e7))
* export grpc related fns ([83c8b3c](https://github.com/InjectiveLabs/injective-ts/commit/83c8b3c676196989bf91bb50661a4793e675e178))
* export MsgBatchUpdateOrders ([1a191a4](https://github.com/InjectiveLabs/injective-ts/commit/1a191a4aaef9d4fb1b50606bcee64d12534372b0))
* export MsgTransferAndExecute ([2c0e7dc](https://github.com/InjectiveLabs/injective-ts/commit/2c0e7dc1be7ff8a00cb27b890e84ee58a7552033))
* export permissions API for external use ([de299f6](https://github.com/InjectiveLabs/injective-ts/commit/de299f6d7df21032f6e454ef5cfe2efcb88f3a1d))
* export utils ([9e3d07c](https://github.com/InjectiveLabs/injective-ts/commit/9e3d07c1d32825ba89a2b57f1e460e16f899592e))
* export wasm ([1d2112f](https://github.com/InjectiveLabs/injective-ts/commit/1d2112fa9cb715ef4ca439947c28c382de1a98db))
* exports ([a232ce7](https://github.com/InjectiveLabs/injective-ts/commit/a232ce7ad3f22247ba10ba0ef22aae0f6b0c59bc))
* exports ([bc77a41](https://github.com/InjectiveLabs/injective-ts/commit/bc77a4179fa642f3fd2fc38f0ac7c02eb2965f1e))
* exports ([5c775c3](https://github.com/InjectiveLabs/injective-ts/commit/5c775c3c5dff065ff426ccc2c54d7cbf6e9b08e2))
* exports ([750a096](https://github.com/InjectiveLabs/injective-ts/commit/750a096aa3cea4d1793cc4775bb7f0392ce4f165))
* exports ([a9df1bb](https://github.com/InjectiveLabs/injective-ts/commit/a9df1bb50f72feeb7f056847752995fd4f76c2c9))
* feePaidAmount to volume ([88c202f](https://github.com/InjectiveLabs/injective-ts/commit/88c202f99dd930c1555b9b91b84c7f7e408c660c))
* fetchBinaryOptionsMarkets pagination format ([921c5ae](https://github.com/InjectiveLabs/injective-ts/commit/921c5ae54d0b01402ad26c4c67394741ef5c1b8d))
* fetchSpotSubaccountTradesList ([e7c6b24](https://github.com/InjectiveLabs/injective-ts/commit/e7c6b248f46f44b057b10503adfd96be7e78dfb6))
* fix issues ([47c9000](https://github.com/InjectiveLabs/injective-ts/commit/47c9000481f8c38c4d08cb343cb98fd586a5390a))
* format documents uniformly and remove unnneeded imports ([f28d104](https://github.com/InjectiveLabs/injective-ts/commit/f28d1046430205931af64c97c393715f3c677b40))
* funds array for MsgExecuteContract ([77dcb24](https://github.com/InjectiveLabs/injective-ts/commit/77dcb248cdc6de496235a8aa6a40a92949b02a9e))
* gas limit for contracts ([8677227](https://github.com/InjectiveLabs/injective-ts/commit/86772270ae17fbf69829243509f2c68fba7d0d6e))
* gov modules ([beb1eb4](https://github.com/InjectiveLabs/injective-ts/commit/beb1eb4935e4fd9c156d761cb9487e805a585646))
* gov proposal msg typings ([31b354f](https://github.com/InjectiveLabs/injective-ts/commit/31b354fc52fa8d1cb58ce8a97213e8da9cddb391))
* gov transformer ([46e1113](https://github.com/InjectiveLabs/injective-ts/commit/46e111336e7cafbbef17d3be064f1e57964473a9))
* grant transforming ([8b64eb8](https://github.com/InjectiveLabs/injective-ts/commit/8b64eb8d1349cb7d663cb5aba902503427d3bf22))
* grpc broadcast sync tx ([8fdc8de](https://github.com/InjectiveLabs/injective-ts/commit/8fdc8de4c0aacec037b5b17a885a7d780059498b))
* grpc error handling ([40fb0fd](https://github.com/InjectiveLabs/injective-ts/commit/40fb0fde7a8cece703d2c7c223793b0afdaeb353))
* handle 0 case differently in tens multiplier logic ([246ff6a](https://github.com/InjectiveLabs/injective-ts/commit/246ff6a2a574e07deb0ae8d58adccea0491f52ce))
* handles invalid factory denom seperator format ([5bd9c35](https://github.com/InjectiveLabs/injective-ts/commit/5bd9c35bd4660e85c9659269f904833127020f68))
* helpers export ([f0a51e2](https://github.com/InjectiveLabs/injective-ts/commit/f0a51e20862280ec78a69f78dafef8039db22836))
* ibc transfer memo ([8815bf9](https://github.com/InjectiveLabs/injective-ts/commit/8815bf9f3aa6571802a6715ddd7f42e9b031e372))
* icons ([c3f3ed8](https://github.com/InjectiveLabs/injective-ts/commit/c3f3ed8b37ea12bb918e992b887e1c5a8d74a686))
* import ([a898113](https://github.com/InjectiveLabs/injective-ts/commit/a898113871da1f038597a76fd75bd071d324dd03))
* import ([cfc70ec](https://github.com/InjectiveLabs/injective-ts/commit/cfc70ec11fba9e40867e554a18219055842ea6af))
* import js missing ([01835b4](https://github.com/InjectiveLabs/injective-ts/commit/01835b4cb631b7b5778f77bf44c60dd4d0be18ac))
* imports ([877486d](https://github.com/InjectiveLabs/injective-ts/commit/877486d027440d54d043f5b3b8f8a6f45be6521e))
* imports ([8c7ef36](https://github.com/InjectiveLabs/injective-ts/commit/8c7ef3689b4016b9eab83f5914255933f59bec4a))
* imports ([5554857](https://github.com/InjectiveLabs/injective-ts/commit/5554857b690dc7e697f55be8d96ac12ff70caaac))
* include memo ([778e3bb](https://github.com/InjectiveLabs/injective-ts/commit/778e3bb9383a77e4a22734ca5766edf6c0ba4ee5))
* indexer token meta ([ec7eb2f](https://github.com/InjectiveLabs/injective-ts/commit/ec7eb2fb76a700e098598c94b1dda20ed64ba145))
* indexerRestMarketChronosApi casing ([335757f](https://github.com/InjectiveLabs/injective-ts/commit/335757f584e25ee64c5ad05732ace69ae7a11f9d))
* instantiate vault cw20 code id typing ([f2dbd5e](https://github.com/InjectiveLabs/injective-ts/commit/f2dbd5e83ea4a1519edc90486708e12193775b27))
* insurance fund eip712 msg ([cccb603](https://github.com/InjectiveLabs/injective-ts/commit/cccb603aca811f2661ff58c4aa280901218e155a))
* keplr eth sign based on features ([b70e568](https://github.com/InjectiveLabs/injective-ts/commit/b70e5688a79f250798a6b21fa4e9d9fbac2a17d1))
* keplrReclaimFunds message ([dd2136e](https://github.com/InjectiveLabs/injective-ts/commit/dd2136ee3c62ab3dcdc3141928f3ef56446200e1))
* leftover console log ([c3d7c89](https://github.com/InjectiveLabs/injective-ts/commit/c3d7c894be06ff4ab53c8a6af818e5411df4ca84))
* linting and initial fetch ofac ([58983fc](https://github.com/InjectiveLabs/injective-ts/commit/58983fc0f02ea6e80b3788a03f4780dc6b85e9e3))
* local only util classes ([bd99108](https://github.com/InjectiveLabs/injective-ts/commit/bd991083964a673ef54418f504e8fed959ade812))
* mapping of grantAuthorization ([58d1310](https://github.com/InjectiveLabs/injective-ts/commit/58d1310895c2a6abdd19fc9a8e651708d570ff55))
* market quantity decimals ([b34b4ee](https://github.com/InjectiveLabs/injective-ts/commit/b34b4ee743c8fdf2d95bdbe95e52a55694c7c20d))
* marketIDs history query ([38bc1aa](https://github.com/InjectiveLabs/injective-ts/commit/38bc1aadeaa95f72e7e3e446f5c72af97693cae3))
* marketIDs history query ([e9f3038](https://github.com/InjectiveLabs/injective-ts/commit/e9f30386638dcac3a48a2668c6f76c53986cda45))
* marketing info undefined on contract ([72dce9f](https://github.com/InjectiveLabs/injective-ts/commit/72dce9f8f8372b1ea9169356d53c53765a6c8eee))
* memo as a number ([1ce2d9c](https://github.com/InjectiveLabs/injective-ts/commit/1ce2d9c897b0dcc134410056d53dd72b0b231449))
* minor ([5e3cac2](https://github.com/InjectiveLabs/injective-ts/commit/5e3cac21a98657bdb19ec78402e0e694688519e6))
* minor ([0aba365](https://github.com/InjectiveLabs/injective-ts/commit/0aba365de5b8696860625428ed2a9936a8556978))
* minor ([c7e31e3](https://github.com/InjectiveLabs/injective-ts/commit/c7e31e3bea7035aa49a1e0280559619ed90b6ad7))
* minor ([253737c](https://github.com/InjectiveLabs/injective-ts/commit/253737c9a122fa7735e23f294ff6c0ea7958f845))
* minor ([a462cf7](https://github.com/InjectiveLabs/injective-ts/commit/a462cf7444237590ecdc08fd982f48ce636e47c7))
* minor ([5c9e79c](https://github.com/InjectiveLabs/injective-ts/commit/5c9e79c382b4aad9215838fd59fe900d733db420))
* minor ([d1f31e5](https://github.com/InjectiveLabs/injective-ts/commit/d1f31e58bbe178b63d3cd844ad4769faaf7ae4b1))
* minor ([d4783a3](https://github.com/InjectiveLabs/injective-ts/commit/d4783a371f2cfa6c2cb9c813b8c454d2ab51ce91))
* minor ([299ad3d](https://github.com/InjectiveLabs/injective-ts/commit/299ad3de59f96df7261e6bdb9935e2db6608e295))
* minor ([65fa29c](https://github.com/InjectiveLabs/injective-ts/commit/65fa29c416f9f164a558927b90f353680b3a9164))
* minor ([94cdf4e](https://github.com/InjectiveLabs/injective-ts/commit/94cdf4e051516da6226761405827883ff3b94014))
* minor ([b29ec24](https://github.com/InjectiveLabs/injective-ts/commit/b29ec24c91d103ad0f18f97fff1bf5c9bb5c3359))
* minor ([2dee193](https://github.com/InjectiveLabs/injective-ts/commit/2dee193534ddd50de1281d7aed616876fc56932f))
* minor ([1be70b2](https://github.com/InjectiveLabs/injective-ts/commit/1be70b24a01f1e6907145fd740d4aa1f425748bd))
* minor ([a433519](https://github.com/InjectiveLabs/injective-ts/commit/a433519292d8a56e02d65bac2c41ae29f8d98626))
* minor ([aa83920](https://github.com/InjectiveLabs/injective-ts/commit/aa839202286c892b619500757bbe81c206b66157))
* minor ([5c6fef7](https://github.com/InjectiveLabs/injective-ts/commit/5c6fef719b7836f04612449dca4849b002f7a1df))
* minor ([39b553b](https://github.com/InjectiveLabs/injective-ts/commit/39b553b40cd7623836268651e892e5ed10812828))
* minor ([af6fffe](https://github.com/InjectiveLabs/injective-ts/commit/af6fffe5cecec8b4405b09c27ce99ad75c6f8b3e))
* minor ([8283050](https://github.com/InjectiveLabs/injective-ts/commit/82830500b133aa504c3a18143e459a34783fb291))
* minor ([ef541cf](https://github.com/InjectiveLabs/injective-ts/commit/ef541cfd69ea2a6f00680e10d0d965281cabd2ee))
* minor ([cc45f46](https://github.com/InjectiveLabs/injective-ts/commit/cc45f46242964e1491b039f6de85f5b27c019f28))
* minor ([6ee390a](https://github.com/InjectiveLabs/injective-ts/commit/6ee390a4336e62a7656cde9d9f7e0fc58251348b))
* minor ([099b33d](https://github.com/InjectiveLabs/injective-ts/commit/099b33d0e1ce111cfdec9163bec464aa5e1a797f))
* minor ([82f2708](https://github.com/InjectiveLabs/injective-ts/commit/82f2708bf0bf159df75568d0e4b3298abf99bca2))
* minor ([cadaff2](https://github.com/InjectiveLabs/injective-ts/commit/cadaff2f3d89f54d6643b85dcfec0a2d74ff84d7))
* minor args pgt ([2d0b137](https://github.com/InjectiveLabs/injective-ts/commit/2d0b137605b14d9cb993bd83aa45e27fc7aa4261))
* minor condition check ([418431c](https://github.com/InjectiveLabs/injective-ts/commit/418431cb7f594c2252a6534e01b30b749d084a85))
* minor conversion to token info ([d8e3d81](https://github.com/InjectiveLabs/injective-ts/commit/d8e3d81c87e2cdea32f57a947e1b3fc20fb40dc4))
* minor for MsgTransfer ([2912a65](https://github.com/InjectiveLabs/injective-ts/commit/2912a650ce7153e241cd0a86014050a58d694985))
* minor naming ([9f679e2](https://github.com/InjectiveLabs/injective-ts/commit/9f679e2d10461cabf571f161d4076c5aaf8848f2))
* minor tests ([0f9baf1](https://github.com/InjectiveLabs/injective-ts/commit/0f9baf1753525018ecf352f498e2cea99f43a3df))
* minor todos ([b661ec9](https://github.com/InjectiveLabs/injective-ts/commit/b661ec9f38030c51c7cae67754ff30557e2f9275))
* minor typing ([9a59b76](https://github.com/InjectiveLabs/injective-ts/commit/9a59b766343ee8eae99f3a56000ed0304e4dc236))
* minor typings ([5059968](https://github.com/InjectiveLabs/injective-ts/commit/5059968ef1d02454ffcf449f2da5b6573b60664d))
* minor undefined error ([ecec926](https://github.com/InjectiveLabs/injective-ts/commit/ecec9262d2e2137c306788ec4a35d60436e96b8a))
* minor util function ([55db0c8](https://github.com/InjectiveLabs/injective-ts/commit/55db0c8debff6336950b05fd9824fcf545636497))
* minor vault config ([ebdffcd](https://github.com/InjectiveLabs/injective-ts/commit/ebdffcd73dfc9356f98b9195b23dacd7dc287898))
* move dependency to proper package.json ([3e57c96](https://github.com/InjectiveLabs/injective-ts/commit/3e57c96e4a3af096d7e3815f4d3e5b183bd5bdf4))
* msg import ([629478c](https://github.com/InjectiveLabs/injective-ts/commit/629478ce9943e2dd421b315ca4a4fd9e134ea2d6))
* msg params fix ([d738d01](https://github.com/InjectiveLabs/injective-ts/commit/d738d01d2e565e6d765de8472341718d43742251))
* msg parsing ([588d97e](https://github.com/InjectiveLabs/injective-ts/commit/588d97e75118be278b980c6655511ac7f0bab66c))
* msgBatchUpdateOrders amino ([0a8bc64](https://github.com/InjectiveLabs/injective-ts/commit/0a8bc64c5e3dda07ec8765b160259571547642ca))
* msgExec cannot unmarshal object into Go value of type []json.RawMessage error ([146d17e](https://github.com/InjectiveLabs/injective-ts/commit/146d17ea725eba2835776598232caa00dacc8651))
* msgexec params ([3f01ef8](https://github.com/InjectiveLabs/injective-ts/commit/3f01ef8fc1d632014b751bb2c308d0b97471523e))
* msgGrant web3 ([9e0eb14](https://github.com/InjectiveLabs/injective-ts/commit/9e0eb14be27d89b67e8d18520956e04d3d68cd92))
* msgs type ([7b18629](https://github.com/InjectiveLabs/injective-ts/commit/7b1862917abd07771deb7b1fbc2b5d9a2725ba9c))
* msgSubmitProposalPerpetualMarketLaunch toWeb3 format ([59e8163](https://github.com/InjectiveLabs/injective-ts/commit/59e816339f9820e485ad0b3b391a601d39d998e4))
* MsgSubmitTextProposal type not found issue ([9cb4db7](https://github.com/InjectiveLabs/injective-ts/commit/9cb4db7e80454bf2655e61dbfe0715a7487ba743))
* msgTransfer tokens param ([8bd257d](https://github.com/InjectiveLabs/injective-ts/commit/8bd257d275ccd9e2923477de2a5899e866001464))
* msgTransferCosmJs toAmino ([0561ad8](https://github.com/InjectiveLabs/injective-ts/commit/0561ad8e7099b48c10980eeab089e404214537fe))
* msgTransferCosmJs toAmino ([05b2182](https://github.com/InjectiveLabs/injective-ts/commit/05b21829734f08be33acc0484cb79ad27246d6eb))
* naming ([eee281a](https://github.com/InjectiveLabs/injective-ts/commit/eee281ae025dee267af5ad8d20b521a769c2487d))
* network information ([853f467](https://github.com/InjectiveLabs/injective-ts/commit/853f4677b278b0ff1f111a3c9f2cb77d993a1508))
* nonce on orderhash manager ([a269718](https://github.com/InjectiveLabs/injective-ts/commit/a269718a647c53e93612b283fcc720d8e2462dde))
* not awaiting for error ([b97cc8a](https://github.com/InjectiveLabs/injective-ts/commit/b97cc8aeab0f8d779342746aaf2c6ad5c48df7bc))
* not found tx polling ([92f2bc3](https://github.com/InjectiveLabs/injective-ts/commit/92f2bc32a9c9e7e6fa5112141ce0dee25b995202))
* not found tx polling ([226f2bf](https://github.com/InjectiveLabs/injective-ts/commit/226f2bf6a4368d33cd17428f87752fe6bb56a6c5))
* nullable strings in value ([32bf7f1](https://github.com/InjectiveLabs/injective-ts/commit/32bf7f16a226fd81bd136b40db43fe9735fd83cc))
* optional params ([e4a9b24](https://github.com/InjectiveLabs/injective-ts/commit/e4a9b243690f29ff31158300d91c926b32e4a43e))
* order hash manager ([f29c236](https://github.com/InjectiveLabs/injective-ts/commit/f29c236bfd4bd1b82bc34d523c6ea92f82cae0fc))
* order hash manager ([7db92b2](https://github.com/InjectiveLabs/injective-ts/commit/7db92b28f8214786e61dadad353da48c4b45cb7a))
* order of conditionals ([20b78e7](https://github.com/InjectiveLabs/injective-ts/commit/20b78e7fc3101799e7ebd049cbbfd40874e4218a))
* orderbooks response ([d6225f2](https://github.com/InjectiveLabs/injective-ts/commit/d6225f20d94344ab65955b4f82f66b0a88711dbd))
* orderMask and twitter link ([0474569](https://github.com/InjectiveLabs/injective-ts/commit/047456994f5233ed099174cd7f96a34f29dfbce8))
* orderMask field ([9670e1e](https://github.com/InjectiveLabs/injective-ts/commit/9670e1ecb0621a73aa75c7df37b9c5bf27dc9828))
* package version ([f861fbf](https://github.com/InjectiveLabs/injective-ts/commit/f861fbf21f5f78d1b840930a67b05c578087a3b8))
* pagination for token holders ([e09bea3](https://github.com/InjectiveLabs/injective-ts/commit/e09bea3bfca498ac6fedff130dffeab34d9b1466))
* paging pagination ([bfbac3e](https://github.com/InjectiveLabs/injective-ts/commit/bfbac3ed608368d6bef066569f1b819b1afb1b36))
* params for rest indexer api ([c149563](https://github.com/InjectiveLabs/injective-ts/commit/c149563be1a17b91148f2f1d96673d5051d44c4e))
* path import for icons ([ef07786](https://github.com/InjectiveLabs/injective-ts/commit/ef0778652376013a8b91109935156cd5d410932b))
* peggy denom ([d3976f6](https://github.com/InjectiveLabs/injective-ts/commit/d3976f6203ac325d9cf5a7e68a11764ac832b6a1))
* pk generating ([0cc94e1](https://github.com/InjectiveLabs/injective-ts/commit/0cc94e1ed53f93ad27c081e3745ab4c6dc29d301))
* pk resubmitting tx twice in case of out of gas ([8179115](https://github.com/InjectiveLabs/injective-ts/commit/81791158de364232a50208d115daad3c78df5b12))
* pk signing eip712 ([c042f4a](https://github.com/InjectiveLabs/injective-ts/commit/c042f4af8982fd5913ee9eb2b24220fc1d8aa910))
* private key import ([653d3ba](https://github.com/InjectiveLabs/injective-ts/commit/653d3ba6ce24631786cd453be2d5d92472b00195))
* projx typings ([6a3c532](https://github.com/InjectiveLabs/injective-ts/commit/6a3c53280cd9e63c682d18567277628a2d25cd15))
* protoObject function ([999dbd3](https://github.com/InjectiveLabs/injective-ts/commit/999dbd3745c04f675594df5d324c5368fe6e32b3))
* pubKey conversion to bec32 ([5f44b77](https://github.com/InjectiveLabs/injective-ts/commit/5f44b7796441749711c170bf3ebdcbed2664bb5a))
* pubkey derivation ([b487019](https://github.com/InjectiveLabs/injective-ts/commit/b487019075dca1564aba55dcadb5cda4fa57b49a))
* pubKey deriving ([d7139c1](https://github.com/InjectiveLabs/injective-ts/commit/d7139c107bb52deb16cdb73cb461a2c0222ddcf8))
* pubkey to bech32 pubkey ([d1962f9](https://github.com/InjectiveLabs/injective-ts/commit/d1962f9b34dfa1478b85b0d7f28513ad69266955))
* public key ([fe13df0](https://github.com/InjectiveLabs/injective-ts/commit/fe13df0c91088edb3d0bc7a1cc497030dade7f07))
* public key derivation from private key hex ([90b2de6](https://github.com/InjectiveLabs/injective-ts/commit/90b2de66bf26f7aff6fc18bfe30fb05c877bd3e8))
* public key derivation from private key hex ([354b3c0](https://github.com/InjectiveLabs/injective-ts/commit/354b3c003b4e74d0392b85ea157e22a642c82aae))
* react native check ([b7815b9](https://github.com/InjectiveLabs/injective-ts/commit/b7815b91f7fa63d049c65e8a854e43590ff3f9fe))
* redundant params ([47ca9f2](https://github.com/InjectiveLabs/injective-ts/commit/47ca9f2f34ec9b2902511176c7c91df6560a1c24))
* remove blank strings ([104b4ea](https://github.com/InjectiveLabs/injective-ts/commit/104b4ea3c273492027e8eafa52d37b50a3334b6d))
* remove retries from msgBroadcaster ([a60bc4e](https://github.com/InjectiveLabs/injective-ts/commit/a60bc4eefc30c8e460e748c5e38bb97e8315c45e))
* removed examples ([a88625c](https://github.com/InjectiveLabs/injective-ts/commit/a88625c0f49e8bf4176905b0b5196be5c5e7ad31))
* resolutions ([10f1156](https://github.com/InjectiveLabs/injective-ts/commit/10f11561ec8c38c62332f06535af63d480a0830a))
* resolutions ([8a3b0b0](https://github.com/InjectiveLabs/injective-ts/commit/8a3b0b00c164e308e65ce6519ed923445cca8bb5))
* resolutions ([bff3ca0](https://github.com/InjectiveLabs/injective-ts/commit/bff3ca0222ab4d69ff804ba9a54ee667e1dfd9fa))
* resolutions ([4910ff3](https://github.com/InjectiveLabs/injective-ts/commit/4910ff361033ad22cbc52a636e0df817c988af19))
* rest api ([35fb2e3](https://github.com/InjectiveLabs/injective-ts/commit/35fb2e375d3e4d43eafb53a3264a6ade7a33dc49))
* return correct signature ([99da278](https://github.com/InjectiveLabs/injective-ts/commit/99da278ae2d5e812763cea84a94f3fdf9e88e0ed))
* return types from stream ([45ff576](https://github.com/InjectiveLabs/injective-ts/commit/45ff576e663209c01f2c95e71880da3fa40f65c9))
* rounding to tick size ([c693113](https://github.com/InjectiveLabs/injective-ts/commit/c6931139e248a1c18faeb15255c9d7dc62c20404))
* script minor ([adb7c76](https://github.com/InjectiveLabs/injective-ts/commit/adb7c764ad00a0cfa38223cecf9b221873cd31b8))
* sdk-ts docs ([cc4bf85](https://github.com/InjectiveLabs/injective-ts/commit/cc4bf85c33389e313b7263f11091012f7f6e91ee))
* sdk-ts README.md (format) ([27b9440](https://github.com/InjectiveLabs/injective-ts/commit/27b9440bdae644833ae02adc6661a234dfe6a202))
* sdk-ts README.md (hex string type) ([c107257](https://github.com/InjectiveLabs/injective-ts/commit/c107257d4e3210f7e537133db2d08e335003d88e))
* sdk-ts README.md (PrivateKey import path) ([9d6f6cb](https://github.com/InjectiveLabs/injective-ts/commit/9d6f6cb572fdcb4a2b18e6c502d284f193ed4d6c))
* sdk-ts README.md (pubKey type) ([0fd1a4f](https://github.com/InjectiveLabs/injective-ts/commit/0fd1a4f29f1281fcb0090e06d7a169be95baa77b))
* sender not set ([58cc039](https://github.com/InjectiveLabs/injective-ts/commit/58cc03947ebc051e7168159f0e717daa8ad70abe))
* set funds as 0 for msgExecuteContractCompat ([bbcfa54](https://github.com/InjectiveLabs/injective-ts/commit/bbcfa54a6e678b0a2f9613c9e1b5098c9d9cf63d))
* sign mode ([5597703](https://github.com/InjectiveLabs/injective-ts/commit/55977038b418fea25578a985a6cf791a5155be83))
* signature derivation ([6f0b5d2](https://github.com/InjectiveLabs/injective-ts/commit/6f0b5d27fafbddaf49831d01bc53e27fe92d53f7))
* signature list on simulating transaction ([ac77679](https://github.com/InjectiveLabs/injective-ts/commit/ac77679b8651ffc22b2e19275f2ffbb8397a5e12))
* signature propert typing ([da77d09](https://github.com/InjectiveLabs/injective-ts/commit/da77d09f2e36b826fdec3b9fc8a5e791aeec5571))
* signing with private key ([ac1032b](https://github.com/InjectiveLabs/injective-ts/commit/ac1032b2beca129d0ba07065944ee8b65e6c80ed))
* simple jest setup ([0ccea6e](https://github.com/InjectiveLabs/injective-ts/commit/0ccea6ed99319adaa6a47fa7d7b4b267f5900b46))
* simplifying TokenInfo class ([1089c71](https://github.com/InjectiveLabs/injective-ts/commit/1089c717b3175b4d37e3fa145c55585c12d02daa))
* snakecase fields ([96b5b47](https://github.com/InjectiveLabs/injective-ts/commit/96b5b4763f9b672e1b8e9b7782fce36671e0edd7))
* snakekeys vault exec args ([243450a](https://github.com/InjectiveLabs/injective-ts/commit/243450afc9f4a19a7ed951bf8742182e0565a4d1))
* spot order price ([e278d73](https://github.com/InjectiveLabs/injective-ts/commit/e278d73a7eafe52fa22232ce7de44414ddbd3ce3))
* std fee minor ([a4bfdbf](https://github.com/InjectiveLabs/injective-ts/commit/a4bfdbf907a71501348012b6ccec6e430beb18ff))
* stream exports ([a555444](https://github.com/InjectiveLabs/injective-ts/commit/a55544408c483dc29ae2f87473e2e7cbaa411e0a))
* subscribe and redeem from vault ([4a47e6f](https://github.com/InjectiveLabs/injective-ts/commit/4a47e6ff14424543fbdab7e6548c55bed482dd41))
* terrajs version ([04288df](https://github.com/InjectiveLabs/injective-ts/commit/04288df12673e80fe131fa77f13aa30c7be501d4))
* testnet tokens ([1209081](https://github.com/InjectiveLabs/injective-ts/commit/12090815b2c39e165c8e673487b21d5734fb690f))
* tests ([062e713](https://github.com/InjectiveLabs/injective-ts/commit/062e7137b8f33498f8eb7e89be9074c2f3860c64))
* tests ([4accbb2](https://github.com/InjectiveLabs/injective-ts/commit/4accbb2b86d4ba70670ab979f559af544fb232a2))
* tick sizes less than 0 not parsing properly ([5ad85dd](https://github.com/InjectiveLabs/injective-ts/commit/5ad85dde5c3a65503a5e5bbf3200269bd8dc9e6a))
* time utils export ([90eb637](https://github.com/InjectiveLabs/injective-ts/commit/90eb637c61d92b6bf83b3ac4b8516f5c8fcf77b1))
* timeout and blocktime ([b4e11cd](https://github.com/InjectiveLabs/injective-ts/commit/b4e11cdcafda875ab5a5cca00b8e818a55a9bf8a))
* timeout for rest queries ([4d64636](https://github.com/InjectiveLabs/injective-ts/commit/4d6463674ee9f1b63138d8cc7e1cb81b19e09835))
* token denom mapping ([3584927](https://github.com/InjectiveLabs/injective-ts/commit/3584927b97e40171fdae6a24f6aa528bc5a6eaae))
* token meta not populated on devnet env ([11fead4](https://github.com/InjectiveLabs/injective-ts/commit/11fead46519b883cd676db027162189402d17d06))
* token service ([f94e037](https://github.com/InjectiveLabs/injective-ts/commit/f94e037a2a7124f3db5616d71be3a5c0c06d8c38))
* token type unification ([8dc921b](https://github.com/InjectiveLabs/injective-ts/commit/8dc921b6e620eb01ddff3ac3154fcb1fce651982))
* token utils coingecko api ([69c1533](https://github.com/InjectiveLabs/injective-ts/commit/69c15339bef85a9537a70ef1524debec413ddea2))
* tokenFactoryStatic - getMetaByDenomOrAddress returning 2 tokens ([f7f22dc](https://github.com/InjectiveLabs/injective-ts/commit/f7f22dc96b10314a86dbf3e3cd09bedaaec8bcb5))
* TradeExecutionSide enum values ([00b5325](https://github.com/InjectiveLabs/injective-ts/commit/00b53255de72fa6157a28a5b9bb4fc0df662b6ef))
* trading volume ([2b3da1a](https://github.com/InjectiveLabs/injective-ts/commit/2b3da1a0a2603447d1fc1da3ed0399ebdc0f14e6))
* transaction exceptions ([2083bb8](https://github.com/InjectiveLabs/injective-ts/commit/2083bb80770b5ad954d2249d119ed72113f6b0c2))
* transaction fail exception ([02be379](https://github.com/InjectiveLabs/injective-ts/commit/02be379f90d51982d4963c99d6985966fe170ab8))
* transaction fail exception ([763931e](https://github.com/InjectiveLabs/injective-ts/commit/763931e21cdaca141149bff23fa9673b9dc5e5f0))
* transform response ([3c56d5f](https://github.com/InjectiveLabs/injective-ts/commit/3c56d5faf71b680b80591297bfc633308f3b626b))
* transport for stream ([2e3e929](https://github.com/InjectiveLabs/injective-ts/commit/2e3e929c18db669cc4461310befad34172f21d88))
* trigger price ([9a9294b](https://github.com/InjectiveLabs/injective-ts/commit/9a9294b46ea3b40125ae597ef3b1f07ab893412a))
* trigger price null ([4ea1a7c](https://github.com/InjectiveLabs/injective-ts/commit/4ea1a7ce46ad668fd12eda61479366403f0d52b0))
* tx broadcast clients ([72fb92a](https://github.com/InjectiveLabs/injective-ts/commit/72fb92a54334a6aa6d943c29f2b9c5bba699a778))
* tx clients ([0160e7f](https://github.com/InjectiveLabs/injective-ts/commit/0160e7f24fed4ce49dd627f91390ebbc42721003))
* tx error parsin ([c281fec](https://github.com/InjectiveLabs/injective-ts/commit/c281fec94e5ebaecf6b1830228ae6bada5bbea4f))
* tx polling interval ([402189f](https://github.com/InjectiveLabs/injective-ts/commit/402189f62b41e6cbfd8f8ae402ab323610131d1d))
* tx polling interval ([536e10f](https://github.com/InjectiveLabs/injective-ts/commit/536e10f35257d8967fa2aff1ab97513d999be3f7))
* txGrpcApi exception handling ([a5b077a](https://github.com/InjectiveLabs/injective-ts/commit/a5b077a044fa2acf051483bded9486159be5a95b))
* txresponse interface ([950461c](https://github.com/InjectiveLabs/injective-ts/commit/950461cc7695e28ec9f08ec1fed92e9cc095f317))
* type added ([ee571c5](https://github.com/InjectiveLabs/injective-ts/commit/ee571c59ce60654ef8fa464beab4f6766a9f4983))
* type export ([a3ba34f](https://github.com/InjectiveLabs/injective-ts/commit/a3ba34fc8cb66ca3673ff983905e904d4756d379))
* type export ([70995ef](https://github.com/InjectiveLabs/injective-ts/commit/70995ef0a64e921674b91a0cfd16b679c7d5b327))
* types ([95bc799](https://github.com/InjectiveLabs/injective-ts/commit/95bc799f96836a02c20ec9a3614d9751aa47e759))
* types and conditions for keplr + ledger ([5bc4a9a](https://github.com/InjectiveLabs/injective-ts/commit/5bc4a9a93af98acf76ddf98d899adb6898e28b08))
* types export ([ff44030](https://github.com/InjectiveLabs/injective-ts/commit/ff44030661df32b3566efaa1b3c9403d3d59e225))
* types for createTransaction ([b08b76d](https://github.com/InjectiveLabs/injective-ts/commit/b08b76dc71a83822ddb101657ef69e5e6994085b))
* types import ([1f749f2](https://github.com/InjectiveLabs/injective-ts/commit/1f749f26bd9fa0d7f08533e99cf0a94faab6496e))
* typing ([05c49bf](https://github.com/InjectiveLabs/injective-ts/commit/05c49bfd9427d4c6db6ffe7b16c52904da73b6b7))
* typing ([d96c26a](https://github.com/InjectiveLabs/injective-ts/commit/d96c26a74147833dbcadb59ddc0898c971aea260))
* typo ([2056cd6](https://github.com/InjectiveLabs/injective-ts/commit/2056cd6bedeb53adfb6d9ba0b9e76f84183d0524))
* typo ([b673377](https://github.com/InjectiveLabs/injective-ts/commit/b6733777a47f659c4912015a1f373adbb2354912))
* undefined prop on PrepareTx ([a14f810](https://github.com/InjectiveLabs/injective-ts/commit/a14f810901a77f08277eb04b92e263e991bf9be3))
* update naming structure in types file ([b48f698](https://github.com/InjectiveLabs/injective-ts/commit/b48f69893036b968c9e0df8476cbff0f3baa7ffd))
* Update package name after it was updated upstream ([8efe048](https://github.com/InjectiveLabs/injective-ts/commit/8efe04878d77e3e6ab9117cdfe417bc11cae8d69))
* update proto definition in MsgClaimVoucher ([9efc4c9](https://github.com/InjectiveLabs/injective-ts/commit/9efc4c9a59ba108022b15baea13fb6b968ef32b2))
* update proto definition in MsgCreateNamespace ([b043cfb](https://github.com/InjectiveLabs/injective-ts/commit/b043cfb9539e76086d69af47bf29fabcc8417874))
* update proto definition in MsgDeleteNamespace ([fc25c3d](https://github.com/InjectiveLabs/injective-ts/commit/fc25c3dde8cbff42e2b186df912fedc9483e4a09))
* update proto definition in MsgRevokeNamespaceRoles ([14a4b30](https://github.com/InjectiveLabs/injective-ts/commit/14a4b30dd30ea02626077f0c8cf6ec43c9a40118))
* update proto definition in MsgUpdateNamespace ([d7140b8](https://github.com/InjectiveLabs/injective-ts/commit/d7140b82333f44af41e494b856c9eb287966a548))
* update proto definition in MsgUpdateNamespaceRoles ([3dcdbe4](https://github.com/InjectiveLabs/injective-ts/commit/3dcdbe4f4052aca769c490581f218a4b604a8fd1))
* update proto definition in MsgUpdateParams ([cb695c2](https://github.com/InjectiveLabs/injective-ts/commit/cb695c2293d72f08d335fe97540cf83a1e1a8e65))
* update sdk-ui-ts typings to import from sdk-ts indexer instead of exchange ([950079e](https://github.com/InjectiveLabs/injective-ts/commit/950079ea7b1703ff7ea0a4d2c8a8ae14a0bb4df7))
* updated core mito indexer proto-ts ([622c66f](https://github.com/InjectiveLabs/injective-ts/commit/622c66f6e1b4860372718cde91973f663acf84eb))
* updated std fee based on gas ([0a86900](https://github.com/InjectiveLabs/injective-ts/commit/0a869004eacfaaa2fc1b1b0567937eb948bd1c59))
* uptime percentage ([ef0a1a3](https://github.com/InjectiveLabs/injective-ts/commit/ef0a1a38e3ff48064ffacaaf23bf653695603bdb))
* value decrypt from contract ([83312ac](https://github.com/InjectiveLabs/injective-ts/commit/83312acd37b7e4786b1ac36689eaa4f7c1cc6b44))
* variable casing for MsgExec ([bc50627](https://github.com/InjectiveLabs/injective-ts/commit/bc50627e50d9313f45d2a6ead12b1e2a74c45ff0))
* version ([24f63c9](https://github.com/InjectiveLabs/injective-ts/commit/24f63c9d175507982ac77ce24e5cbce4cab96804))
* version ([222b42c](https://github.com/InjectiveLabs/injective-ts/commit/222b42ccccc65daa02739b116744331dcdfffdcc))
* versions ([b7770bf](https://github.com/InjectiveLabs/injective-ts/commit/b7770bf382619115063ecdee2a9bd39b520e70de))
* wallet issues ([a67b6fb](https://github.com/InjectiveLabs/injective-ts/commit/a67b6fb15666c2b2e9f4745b522dfc493981f918))
* window obj removed from wallet instance ([2a51b62](https://github.com/InjectiveLabs/injective-ts/commit/2a51b62eb0c6259326d275cd76b3e74c8a2a818e))
* yarn version ([b51c8d9](https://github.com/InjectiveLabs/injective-ts/commit/b51c8d907c9b15ad324f55b8efcdb12863c455f9))
* zeros in a number ([107c49f](https://github.com/InjectiveLabs/injective-ts/commit/107c49f63f0ed00ac4861b8ac173c2b022f78a64))


### Features

* abacus abstractions ([08dfc49](https://github.com/InjectiveLabs/injective-ts/commit/08dfc494c78fa3fa4bc8feda19c32ff442c63895))
* activity page pagination ([068d54e](https://github.com/InjectiveLabs/injective-ts/commit/068d54e33dd2a5df91485246b3c4732bb1eeb960))
* activity page pagination ([35dc4e3](https://github.com/InjectiveLabs/injective-ts/commit/35dc4e34235f09cb8060fc2c4932a5714e118df1))
* activity page pagination ([79e85b9](https://github.com/InjectiveLabs/injective-ts/commit/79e85b99d7ff81b4c96069c1db20777e3cc94213))
* activity page pagination ([1da66fc](https://github.com/InjectiveLabs/injective-ts/commit/1da66fcdce9698687ee6fd3fbd7e00c647e5e720))
* activity page pagination ([60e91d0](https://github.com/InjectiveLabs/injective-ts/commit/60e91d09358c6b18fa7f6e234dc750e6aeb5b420))
* activity pagination ([41f2ca2](https://github.com/InjectiveLabs/injective-ts/commit/41f2ca2c4624da8ca04155826a6f870ec8855e31))
* activity pagination ([bb91c17](https://github.com/InjectiveLabs/injective-ts/commit/bb91c17460cd313d24df8666449ef0b76cbdad2f))
* activity pagination ([a91bb5e](https://github.com/InjectiveLabs/injective-ts/commit/a91bb5e94788e423e0c803a0e503a7a97a6c8eb5))
* activity pagination - bump to indexer 1.0.5 ([a7d98a3](https://github.com/InjectiveLabs/injective-ts/commit/a7d98a33fa8afecf29f9d23c750042fe7676067e))
* activity pagination - remove duplicate code ([5c6efec](https://github.com/InjectiveLabs/injective-ts/commit/5c6efece6e7d133eddfe94872216ad435d736412))
* activity pagination - removed unused code ([9e73339](https://github.com/InjectiveLabs/injective-ts/commit/9e73339f0c1b2fa111cababd2605fd4565173787))
* activity pagination - renamed paging -> pagination ([9227787](https://github.com/InjectiveLabs/injective-ts/commit/9227787ecbc8b247516004f1bc95afab4e77f44f))
* activity pagination - use indexer instead of exchange api ([7de4dca](https://github.com/InjectiveLabs/injective-ts/commit/7de4dca9a4b9b8490710d4e80a31d4951706416c))
* activity pagination updates ([#63](https://github.com/InjectiveLabs/injective-ts/issues/63)) ([f999db1](https://github.com/InjectiveLabs/injective-ts/commit/f999db13b635a95433a91815e357d927ae793602))
* add AddressRoles fn with test and tranformer ([be65227](https://github.com/InjectiveLabs/injective-ts/commit/be65227969f4e69d21465d45800c9b2960f8814a))
* add authorization ([76b6e0a](https://github.com/InjectiveLabs/injective-ts/commit/76b6e0a88154079b56e193c6d89574da17568b0b))
* add correct EIP-712 signing support ([d11a532](https://github.com/InjectiveLabs/injective-ts/commit/d11a532789d860ca9a6184d315985e51b4fe24d0))
* add fetch multiple denoms token meta ([a73872b](https://github.com/InjectiveLabs/injective-ts/commit/a73872ba58fc139e8ff4e1e01b97ae523610a6d4))
* add fetchAddressesByRole fn with test and transformer ([b3e6bb8](https://github.com/InjectiveLabs/injective-ts/commit/b3e6bb89705a2b02f1aa1465eabaf4ed7fe23c4c))
* add fetchAllNamespaces fn with test and transformers ([0911b58](https://github.com/InjectiveLabs/injective-ts/commit/0911b588a342f0f1f5fd55be2f4eb8603c15e2e1))
* add fetchModuleParams fn with tests and transformer ([0cc3e44](https://github.com/InjectiveLabs/injective-ts/commit/0cc3e446aa7b95a18540d5b19c40f8929d04fe26))
* add fetchVouchersForAddress fn with test and transformer ([4e7e31a](https://github.com/InjectiveLabs/injective-ts/commit/4e7e31af0a14bf05d1b2382990bdf6838ade2453))
* add functionality to query on chain cosmswasm contract info ([1215b7a](https://github.com/InjectiveLabs/injective-ts/commit/1215b7a84ae3506ba1fc885d8551dfeb799f9253))
* add functionality to query on chain cosmwasm data ([7b7793a](https://github.com/InjectiveLabs/injective-ts/commit/7b7793a6e34b560831779311b462bc83fead7d12))
* add functions ([4761770](https://github.com/InjectiveLabs/injective-ts/commit/4761770454e481ae85175232423f814a1c3434b5))
* add getchNamespaceByDenom fn with test and transformer ([9544df7](https://github.com/InjectiveLabs/injective-ts/commit/9544df78a2c1c73894667ed9816ace37623b15c6))
* add grpc support for ninja api ([0445623](https://github.com/InjectiveLabs/injective-ts/commit/04456234d2efa44a692beeccaf89e38894e71081))
* add image url to validator ([1f5d893](https://github.com/InjectiveLabs/injective-ts/commit/1f5d893a8ddb726efe390de45c85ae76d102fa53))
* add index file to export permission fns ([b8c9b06](https://github.com/InjectiveLabs/injective-ts/commit/b8c9b06178de39e6acfd9aa9acf9975513a624cb))
* add mito and olp proto and refactor esm imports ([f50e172](https://github.com/InjectiveLabs/injective-ts/commit/f50e1726aa2f808f0fdb53d159c01b90c59b8449))
* add more methods in ExplorerRPC ([08b4a0a](https://github.com/InjectiveLabs/injective-ts/commit/08b4a0a6f076379bbfaee6d1f25a07ed9755cf11))
* add msg multi send ([6a494aa](https://github.com/InjectiveLabs/injective-ts/commit/6a494aa9e989134f61b9c6bd7959f314d8acc72f))
* add MsgClaimVoucher file and spec file ([c24aae2](https://github.com/InjectiveLabs/injective-ts/commit/c24aae2231925992ee6a2288b8e46a6b27978cbf))
* add MsgCreateNamespace file and spec file ([6c62089](https://github.com/InjectiveLabs/injective-ts/commit/6c6208918181018cad94e232334788a535aca653))
* add MsgDeleteNamespace file and spec file ([fd13581](https://github.com/InjectiveLabs/injective-ts/commit/fd13581eb7c140c351e25d5cf757e993081b5652))
* add msgExternalTransfer ([d9b5444](https://github.com/InjectiveLabs/injective-ts/commit/d9b5444e93bbbb323e5ad6fdb84ff00d751a6196))
* add MsgRevokeNamespaceRoles file and spec file ([0e16f25](https://github.com/InjectiveLabs/injective-ts/commit/0e16f25cd035ec95a0363ccd8fb039a288a5d71d))
* add MsgUpdateNamespace file and spec file ([3de8410](https://github.com/InjectiveLabs/injective-ts/commit/3de8410dd1d81ad1af2c13446c308116aa0594f9))
* add MsgUpdateNamespaceRoles file and spec file ([13c0dad](https://github.com/InjectiveLabs/injective-ts/commit/13c0dadb4737e24397e20952706904faf83af3f4))
* add MsgUpdateParams file and spec file ([191e2f4](https://github.com/InjectiveLabs/injective-ts/commit/191e2f40db691d1da099f2bc26a804f3863d0841))
* add permissions types ([fb1bfb0](https://github.com/InjectiveLabs/injective-ts/commit/fb1bfb0c45910bbb8d6f3940f5f48f7d8b7db36c))
* add skip & limit params ([35012a4](https://github.com/InjectiveLabs/injective-ts/commit/35012a4a88ce3e24f2e2f7cfa5fcd5da97d20964))
* add streamSpotMarket ([66e392c](https://github.com/InjectiveLabs/injective-ts/commit/66e392c5e8e8cb2a6febffb9bdac00355827f8be))
* add support for CW20 balance ([0eeb3b8](https://github.com/InjectiveLabs/injective-ts/commit/0eeb3b80c5319db10d77c31b286b69b654a155d1))
* add unit test coverage for eip712 messages ([#75](https://github.com/InjectiveLabs/injective-ts/issues/75)) ([cf7e2fd](https://github.com/InjectiveLabs/injective-ts/commit/cf7e2fde727979fcf2187385d72b96efbed6d61a))
* add unit test for remaining eip 712 messages ([#77](https://github.com/InjectiveLabs/injective-ts/issues/77)) ([2584aa0](https://github.com/InjectiveLabs/injective-ts/commit/2584aa09eb3f410f911509a23aca753ba696d773))
* added ability to pass pk as a class to MsgBroadcastWithPk ([7ab121d](https://github.com/InjectiveLabs/injective-ts/commit/7ab121dd91f60484a61b92c05b12eafaa1e7b0c1))
* added amino and proper web3 support for all msgs ([83f1857](https://github.com/InjectiveLabs/injective-ts/commit/83f1857981468ed16c2295c3f814eaa12256c7b3))
* added amino sign for Keplr ([a3fa523](https://github.com/InjectiveLabs/injective-ts/commit/a3fa523179151bceb701d0216499dc2c21480ed5))
* added bonfida sol domains ([2e67999](https://github.com/InjectiveLabs/injective-ts/commit/2e67999a91854c79c6c260493ac3d629285b2c1d))
* added context to exceptions ([ccfd06b](https://github.com/InjectiveLabs/injective-ts/commit/ccfd06b84fc1acb542e28f1d39ac251730750afa))
* added cosmos fee delegation support ([f3e2b0f](https://github.com/InjectiveLabs/injective-ts/commit/f3e2b0ff1bdea77c8b408c7fa88a32c610063000))
* added cw20transfer args ([5861fe5](https://github.com/InjectiveLabs/injective-ts/commit/5861fe5b5fdec2cf5066d49fe950bdb579aca273))
* added cw20transfer args ([0b53619](https://github.com/InjectiveLabs/injective-ts/commit/0b53619d29fe3203c9a2bdc44cb819ca42e36f4c))
* added fromBase64 init for PublicKey ([77b6104](https://github.com/InjectiveLabs/injective-ts/commit/77b610476d75096176605e6c73729e0f7163dbcc))
* added granter and fee payer to std fee ([904b973](https://github.com/InjectiveLabs/injective-ts/commit/904b97336f391552e016e7789599b2e243554688))
* added httpRestClient which handles timeout exceptions ([c200bc2](https://github.com/InjectiveLabs/injective-ts/commit/c200bc25fe67901ad80462166c5cc841449df6b8))
* added insurance funds explorer api types ([5dcf7da](https://github.com/InjectiveLabs/injective-ts/commit/5dcf7da4323546ef4e4cff064960aa59f4a67ea6))
* added messages to contract response ([59f5f5a](https://github.com/InjectiveLabs/injective-ts/commit/59f5f5a2e5ea15e9eea58a40cdc1c31852562bfb))
* added metadata ([7a1e408](https://github.com/InjectiveLabs/injective-ts/commit/7a1e408e99ea320da8bf7fef91545a73ecc15a03))
* added msg store code ([7159995](https://github.com/InjectiveLabs/injective-ts/commit/715999592efa2d912e69860cec5d7d206df1f2cc))
* added msgEditValidator and msgWithdrawValidatorCommission ([09a03a5](https://github.com/InjectiveLabs/injective-ts/commit/09a03a548035c11c571d238da90f15b047fdf96a))
* added multiple signers while creating a transaction ([c10442d](https://github.com/InjectiveLabs/injective-ts/commit/c10442d172fa49a479f2e4708c3c8a5ed7ef6e77))
* added number flooring for chain numbers ([83eafe9](https://github.com/InjectiveLabs/injective-ts/commit/83eafe901501713263fbd39aef7238001afd2467))
* added number formatters ([f13d177](https://github.com/InjectiveLabs/injective-ts/commit/f13d177c2600da39af2974318e25052ea8c63101))
* added object formatter ([6a4621a](https://github.com/InjectiveLabs/injective-ts/commit/6a4621a62ea4267c3df9de82b31798bfe1245c02))
* added rest consumer example ([aa20951](https://github.com/InjectiveLabs/injective-ts/commit/aa2095126bbfae2bd851f0417cd98144b7bcbda0))
* added support for insurance funds and custom token factory denoms ([1c82a82](https://github.com/InjectiveLabs/injective-ts/commit/1c82a824c1c1876aeb88c34088e9c95e15f4d8c0))
* added testnet old endpoints ([79358b1](https://github.com/InjectiveLabs/injective-ts/commit/79358b1ce2f775cacb8c278a58caaea90a8e98bb))
* added timestamp filtering for trades ([541554f](https://github.com/InjectiveLabs/injective-ts/commit/541554fa9ff145c3ed6e64f1bd8239a9ade6ad0b))
* added token factory token type ([ad23e66](https://github.com/InjectiveLabs/injective-ts/commit/ad23e6662cc10d721da0545368642e6a6ae0665d))
* added tradeId ([21dba26](https://github.com/InjectiveLabs/injective-ts/commit/21dba26fd094b9eb15d891ac4a7ec106d0337142))
* added tx-ts ([ae9ebc7](https://github.com/InjectiveLabs/injective-ts/commit/ae9ebc7e2c34eaf60e894cd70e6b0778e6b71bbf))
* added validator details and uptime ([b775f91](https://github.com/InjectiveLabs/injective-ts/commit/b775f919eeb652d18c37abd557d2c2a429c3ac21))
* allow multiple amounts on Msgsend ([3294e7d](https://github.com/InjectiveLabs/injective-ts/commit/3294e7dc7422636c4dc1c47075d7c667256b6a36))
* arbitrary data verification ([83e36f6](https://github.com/InjectiveLabs/injective-ts/commit/83e36f68492d69743c880d41e679f0d32abd6882))
* authz module - add MsgExec and new param MsgGrant ([#57](https://github.com/InjectiveLabs/injective-ts/issues/57)) ([3c2b103](https://github.com/InjectiveLabs/injective-ts/commit/3c2b10300828c751dd2dcc92e01729b0afa9925d))
* authz stake grants ([228e884](https://github.com/InjectiveLabs/injective-ts/commit/228e8841d7b08e6a63a47c376028883e44eaa15a))
* authz types and more methods ([6e6a1d8](https://github.com/InjectiveLabs/injective-ts/commit/6e6a1d8420a19866256c895107d67e4e1099c77b))
* baseDenom introduced ([7c8f895](https://github.com/InjectiveLabs/injective-ts/commit/7c8f89557ccf4b272b1235593ba1ad6934d23cb7))
* binary options support on the sdk ([c5f6bc8](https://github.com/InjectiveLabs/injective-ts/commit/c5f6bc8313cc48281a426f84a352f212449bbb98))
* bridge-ts initial ([4320b1c](https://github.com/InjectiveLabs/injective-ts/commit/4320b1c256b58caec7a08c33854f0bdde9681c3c))
* broadcaster used instead of provider to support metamask ([bed89c0](https://github.com/InjectiveLabs/injective-ts/commit/bed89c0bbff34e74731885f5367f7276a0706383))
* caching denom traces ([7b7f89e](https://github.com/InjectiveLabs/injective-ts/commit/7b7f89eb3e61efa22f28f707bd96038371d01c6b))
* cancelation order bitmask ([70fed5e](https://github.com/InjectiveLabs/injective-ts/commit/70fed5ee71bd3ea4b5624096e6cd73ed2d43120c))
* checksum address calc ([3b1946e](https://github.com/InjectiveLabs/injective-ts/commit/3b1946e2ebdf09c075a1a53fb4d3c1ba7b851bd2))
* cid ([b286316](https://github.com/InjectiveLabs/injective-ts/commit/b286316549a80ba64af9ba946d9166e1cd638fd7))
* commented msgReclaimLockedFunds ([316af92](https://github.com/InjectiveLabs/injective-ts/commit/316af9266cc84e57a8b0b1c48d5a1e3149b36486))
* community spend pool ([d08a04b](https://github.com/InjectiveLabs/injective-ts/commit/d08a04b1dc3610371d4f2c8c65a07b3b59f36e58))
* comsostation eth version ([a10d278](https://github.com/InjectiveLabs/injective-ts/commit/a10d27849b593b6cedec2d66e7d08e691f0a0c47))
* cosmos sdk doc convenient method ([8b8dab7](https://github.com/InjectiveLabs/injective-ts/commit/8b8dab7f25b657f4419ec916823807336548852d))
* cosmwasm map ([697422e](https://github.com/InjectiveLabs/injective-ts/commit/697422ed3608750f025b315236680a185e411b5f))
* create spot grid strategy ([a57c40b](https://github.com/InjectiveLabs/injective-ts/commit/a57c40bb58071539545fc2dae45f5f50e0fb2499))
* cw20 adapter contract args ([036fc91](https://github.com/InjectiveLabs/injective-ts/commit/036fc9186ef43bd49cc526555dba0431f63a5935))
* cw20 addr validation ([c4332e0](https://github.com/InjectiveLabs/injective-ts/commit/c4332e05cc63f0f5b3bc36797970571cf0347643))
* cw20 send args ([b36e5ed](https://github.com/InjectiveLabs/injective-ts/commit/b36e5ed5e2bfbcb5e5648c6a4257a778b3784a2a))
* cw20 send args ([22ee502](https://github.com/InjectiveLabs/injective-ts/commit/22ee502ba8c7f6af165c85db15b21f5c826aed93))
* denom async client ([72127aa](https://github.com/InjectiveLabs/injective-ts/commit/72127aa9c357e22d121c8357fb9a13471ae31744))
* denom client ([581977b](https://github.com/InjectiveLabs/injective-ts/commit/581977b7e8534fa0e80fa8b41845b38500293ca0))
* denomClientAsync ([8628f46](https://github.com/InjectiveLabs/injective-ts/commit/8628f46ea30a50d1a69899f5f791612fe3cd2f38))
* denomClientAsync ([e820eb9](https://github.com/InjectiveLabs/injective-ts/commit/e820eb93cd335358c91a8627f67521b806359b49))
* eip712 signing fix ([774b1dd](https://github.com/InjectiveLabs/injective-ts/commit/774b1ddd94062820a62fecb4a33aa4882a40bdf8))
* eip712 v2 ([8eaaeba](https://github.com/InjectiveLabs/injective-ts/commit/8eaaebabe4e715d91a56eafa55366275753d05a2))
* eip712 v2 ([e14b015](https://github.com/InjectiveLabs/injective-ts/commit/e14b015403c6b3f0b1f4d81760d3e5e06102cb36))
* eip712 verification against chain ([4fd66f7](https://github.com/InjectiveLabs/injective-ts/commit/4fd66f7ff1fc88b5e41dccd4442489748626ba24))
* enable keplr on devnet ([021a315](https://github.com/InjectiveLabs/injective-ts/commit/021a3156090398fde4b645bf3aecf5fa3a327b1c))
* enabled disabling a wallet for wallet-ts, refactored to use sync broadcasting mode ([c1dde3f](https://github.com/InjectiveLabs/injective-ts/commit/c1dde3f5efd644de194d4e50b77c8c484d11a4b9))
* ethereum native wallets optional on wallet-ts ([15300dc](https://github.com/InjectiveLabs/injective-ts/commit/15300dc2a182d7e557b5337847ba7a81977e1ce8))
* evmos fix ([6d6d46e](https://github.com/InjectiveLabs/injective-ts/commit/6d6d46e4c3ba8d8411d66f84d66e86f6c1c4c83a))
* exceptions part 2 ([1919620](https://github.com/InjectiveLabs/injective-ts/commit/191962094f9ec7036c54425e35c6aa476c70ea79))
* exchange module state ([ab8fcd2](https://github.com/InjectiveLabs/injective-ts/commit/ab8fcd28cbf6bbac4b4d524d8d3d202937c935cb))
* exec exchange contracts ([3e365ce](https://github.com/InjectiveLabs/injective-ts/commit/3e365ceda17721862dc669bdd169a86a97944be4))
* experimental support for eip712 broadcasting ([69fc77a](https://github.com/InjectiveLabs/injective-ts/commit/69fc77aa16862d88556d0d8fb560e41c99710abe))
* explorer stats api ([9fdd911](https://github.com/InjectiveLabs/injective-ts/commit/9fdd91104d2807f59d162596a96067c8c9775913))
* explorer utils and generic types for wallet provider ([b31b3ff](https://github.com/InjectiveLabs/injective-ts/commit/b31b3ff3bf27e74208cf03f10ea8fff762b0cae9))
* fee payer fetching from indexer api ([439f245](https://github.com/InjectiveLabs/injective-ts/commit/439f245e52037d0f5d06a79402cad08918c25512))
* from bytes pub key ([c7c744b](https://github.com/InjectiveLabs/injective-ts/commit/c7c744b14d9d8e5d59093ddd297592c49a901bc0))
* funds stringified ([14d262f](https://github.com/InjectiveLabs/injective-ts/commit/14d262f32b7ad5d0840e1597798ee49787f66d26))
* gas based on message ([929f117](https://github.com/InjectiveLabs/injective-ts/commit/929f117934120122286e87428707d4536e026f35))
* gas limit from simulation ([6305f0d](https://github.com/InjectiveLabs/injective-ts/commit/6305f0d62da57ae3539cd203ac8314a796679073))
* gas price fetching ([476f4e4](https://github.com/InjectiveLabs/injective-ts/commit/476f4e49f62ecdfc482ddde6789483fd09fd4fff))
* gas simulation on web3 wallets ([65e5d97](https://github.com/InjectiveLabs/injective-ts/commit/65e5d97fb2f9edcb68be85dc6d98b868a7079ff6))
* geometric sgt init ([1055590](https://github.com/InjectiveLabs/injective-ts/commit/1055590ab9b17944107c82683a860146a490fe74))
* get injective address from subaccount ([203c223](https://github.com/InjectiveLabs/injective-ts/commit/203c2235fbde30eda4f6f853394112cc7c83fe66))
* getExactDecimalsFromNumber ([07421dd](https://github.com/InjectiveLabs/injective-ts/commit/07421dd15884f4b89f677ea58da1a83f6a53b80d))
* getTensMultiplier function for handling decimals ([3b66d5d](https://github.com/InjectiveLabs/injective-ts/commit/3b66d5d8e9f608b153b11c61e0e65dad0d44041a))
* grid sc config ([91c0c86](https://github.com/InjectiveLabs/injective-ts/commit/91c0c86125ad7dee2b1d66e83c564ba65663c473))
* grpc indexer campaign api ([1a2c561](https://github.com/InjectiveLabs/injective-ts/commit/1a2c561bcd128c9a69e6b8938bfaf71bac59a93f))
* helper functions for prepping a transaction ([3c9a806](https://github.com/InjectiveLabs/injective-ts/commit/3c9a8067f18ef0cbb37e2e09f2534245f35efb82))
* helper utils for sorting object keys ([b48c598](https://github.com/InjectiveLabs/injective-ts/commit/b48c598fe90ff5ba83b930f0ec60771e86fdfb02))
* ibc gateway support for wormhole ([fbf7d96](https://github.com/InjectiveLabs/injective-ts/commit/fbf7d9600507367687ebe8bebbb00485583c79d3))
* implement grpc oracle stream for prices by markets ([e24887f](https://github.com/InjectiveLabs/injective-ts/commit/e24887f01d6fe136fe55d831930c03c09ab86b6f))
* implement retries on grpc and rest query calls ([d8c4486](https://github.com/InjectiveLabs/injective-ts/commit/d8c4486722c52a669b17ffe8875855e543f573e8))
* implemented a way to fetch grpc all records from pagination ([5b2f888](https://github.com/InjectiveLabs/injective-ts/commit/5b2f888424ab21c8db825a8c5ebcdf8775794fbc))
* indexer api bump ([76635c2](https://github.com/InjectiveLabs/injective-ts/commit/76635c2e6d725c68ed10bf47171b8a4e3bda9432))
* indexer migration ([351320b](https://github.com/InjectiveLabs/injective-ts/commit/351320b46ac7244af44728db7b67472e6b9a8105))
* indexerTradingApi - autzh api - create strategy ([ec2e1a4](https://github.com/InjectiveLabs/injective-ts/commit/ec2e1a4649cbacb1b2f25d4b0b73e9d3f6d74f8a))
* initial eip712 ([956d451](https://github.com/InjectiveLabs/injective-ts/commit/956d451f487a120395d42318aafaa2fc856e4a81))
* initial exceptions setup ([6da9f2e](https://github.com/InjectiveLabs/injective-ts/commit/6da9f2eb2df2fcd2995fc9cd25a615dc607da253))
* initial grid strategies list impl ([955ac92](https://github.com/InjectiveLabs/injective-ts/commit/955ac923e52be707fda327b4bd99060a4ea6401d))
* initial order hash manage ([3f1c9ec](https://github.com/InjectiveLabs/injective-ts/commit/3f1c9ec4276120df49b5692c34fc3295714fa36d))
* initial sdk-ui-ts and sdk-ts refactor ([fe00582](https://github.com/InjectiveLabs/injective-ts/commit/fe005820114dcfca2fe28a70f465a048550f4932))
* initial setup ledger cosmos app ([d113d86](https://github.com/InjectiveLabs/injective-ts/commit/d113d86447d53fa859c2744f9895871264930adc))
* initial sig verify for cosmos ([63a3cfc](https://github.com/InjectiveLabs/injective-ts/commit/63a3cfca6c0d1486113f54808f3a50ebd3335af1))
* inj name resolution ([ce0ce62](https://github.com/InjectiveLabs/injective-ts/commit/ce0ce6281265dabfe1ceaddf90d5c7aecd3a671f))
* integrate portfolio api ([4ba36ff](https://github.com/InjectiveLabs/injective-ts/commit/4ba36ffd01f62277f5d673495e5bd26ea26bde35))
* jest setup, msgBid unit tests ([9caa08f](https://github.com/InjectiveLabs/injective-ts/commit/9caa08f68617661dc0d675c3238bbf6592b494f4))
* keplr reclaim funds ([6f35de5](https://github.com/InjectiveLabs/injective-ts/commit/6f35de51585a87dd47d37d4a34b496b234f2f185))
* leaderboard ([f69cee4](https://github.com/InjectiveLabs/injective-ts/commit/f69cee45ca4354333056cde17c35d8537ff37fb8))
* leaderboard - restore shx & link-module-alias ([71236e2](https://github.com/InjectiveLabs/injective-ts/commit/71236e20528a5306216628be96ab022e97bf988c))
* migrated to grpcWebImpl ([bbf4e37](https://github.com/InjectiveLabs/injective-ts/commit/bbf4e3715c20cd2948b77e3be4dac45123b29859))
* minor authz utils ([72fc977](https://github.com/InjectiveLabs/injective-ts/commit/72fc977a8cca34a78a7ae9b1247c233632c28b7e))
* minor util and readme update ([9be782b](https://github.com/InjectiveLabs/injective-ts/commit/9be782bf5f085743bdb631ba601368a02abca795))
* msg multi execute ([2f67682](https://github.com/InjectiveLabs/injective-ts/commit/2f67682e030be0dc3fd7eeee87c24891ad605dd2))
* msgBatchUpdate ([7bc3787](https://github.com/InjectiveLabs/injective-ts/commit/7bc3787a4feab80ba506aaa90726e8465a77bfa6))
* MsgBroadcaster in sdk-ts ([7747ea8](https://github.com/InjectiveLabs/injective-ts/commit/7747ea8f6aaa61f9a81fde8178a10b2c48535775))
* msgBroadcaster on wallet-ts ([d06a3db](https://github.com/InjectiveLabs/injective-ts/commit/d06a3db58400577a0c4cfdf6bc2b56659fac734a))
* MsgBroadcasterLocal for broadcasting tx in a node environment ([8fd484b](https://github.com/InjectiveLabs/injective-ts/commit/8fd484b7393db1d9be90da869c4de5a7dafff479))
* msgExecuteContract add typing support ([866c605](https://github.com/InjectiveLabs/injective-ts/commit/866c6059d2f54826f4d799500274b0a1d8984b06))
* msgExecuteContractCompat ([9c63a64](https://github.com/InjectiveLabs/injective-ts/commit/9c63a645493af7077a5561f25e526a4a20d2d218))
* msgMultiExecute ([c53cb78](https://github.com/InjectiveLabs/injective-ts/commit/c53cb78ec5a4df95b376eb1a4db173e9f5336280))
* msgmultisend ([77adf6f](https://github.com/InjectiveLabs/injective-ts/commit/77adf6ff9437f23fd73c2c75fd74299978c22ddd))
* msgReclaimLockedFunds ([b6b7ce8](https://github.com/InjectiveLabs/injective-ts/commit/b6b7ce8d4c7e644623068e2f5afaedb12f102a33))
* msgSubmitGenericProposal ([d9de27b](https://github.com/InjectiveLabs/injective-ts/commit/d9de27b72d97a218f12f1cc968903b21efc0c69e))
* MsgTransfer for external chains ([96ee3de](https://github.com/InjectiveLabs/injective-ts/commit/96ee3de9e1daddd802075498b03ffdc67b57ec1f))
* msgTransferAndExecute support ([4a2c286](https://github.com/InjectiveLabs/injective-ts/commit/4a2c286b1e964b9f97fe7be0439208fe376d7d17))
* msgTransferExternal ([0ebaa6e](https://github.com/InjectiveLabs/injective-ts/commit/0ebaa6e33588f003628a5fa7ad73964b76d4b5e6))
* neptune service ([68bc897](https://github.com/InjectiveLabs/injective-ts/commit/68bc897324626bbee8b9045ca2579f3e63f01398))
* new token metadata implementation ([a285b1a](https://github.com/InjectiveLabs/injective-ts/commit/a285b1aead2f7a7806169ac78fd22c5c2e4dc4c3))
* new wallet ts ([e43b933](https://github.com/InjectiveLabs/injective-ts/commit/e43b933f8a5e6bd6c51f5e890ec0f0e61992b647))
* optimise bundle size ([03bb060](https://github.com/InjectiveLabs/injective-ts/commit/03bb060357d7b89802ec1422ccbc44841acbbeb5))
* optional orderHash ([f741e35](https://github.com/InjectiveLabs/injective-ts/commit/f741e35ce79aa80bb03d76a5caa51507962d5594))
* order history ([#64](https://github.com/InjectiveLabs/injective-ts/issues/64)) ([d86021a](https://github.com/InjectiveLabs/injective-ts/commit/d86021a64228e10e6cd72f97109a114fd698a3ca))
* order history ([#65](https://github.com/InjectiveLabs/injective-ts/issues/65)) ([c179735](https://github.com/InjectiveLabs/injective-ts/commit/c179735d5b3f7168a017073720721332e44319cb))
* order history ([#68](https://github.com/InjectiveLabs/injective-ts/issues/68)) ([9e431a7](https://github.com/InjectiveLabs/injective-ts/commit/9e431a73f3f89dae4a295f4b6a77c6efbafee9ea))
* order history ([#69](https://github.com/InjectiveLabs/injective-ts/issues/69)) ([6bd506e](https://github.com/InjectiveLabs/injective-ts/commit/6bd506e24dbc549ebe921dacc7d8af68928ce372))
* order history ([#70](https://github.com/InjectiveLabs/injective-ts/issues/70)) ([74dcc0f](https://github.com/InjectiveLabs/injective-ts/commit/74dcc0f1373c3cc13934cee8b70095df17032cb4))
* order history stream ([#72](https://github.com/InjectiveLabs/injective-ts/issues/72)) ([4a1f6cd](https://github.com/InjectiveLabs/injective-ts/commit/4a1f6cd68d081bc74574b08c1a65239d8a2e6d4a))
* order history updates ([#67](https://github.com/InjectiveLabs/injective-ts/issues/67)) ([43d8472](https://github.com/InjectiveLabs/injective-ts/commit/43d84721c97fa964ef61eece8e60bcbcdd26f999))
* orderbook v2 ([889689d](https://github.com/InjectiveLabs/injective-ts/commit/889689d4939ace5b1e6396e6c91c795686e36a13))
* pagination for binary options markets ([e9ce348](https://github.com/InjectiveLabs/injective-ts/commit/e9ce3489bb20b118ecb7d2ff7d3aabb0415bad4b))
* path updated for wasmx ([2bebb9d](https://github.com/InjectiveLabs/injective-ts/commit/2bebb9d02999f2b7a1be6494c353d0650475cfdf))
* path updated for wasmx ([36b594a](https://github.com/InjectiveLabs/injective-ts/commit/36b594a4465227e01ec60d3caae226fe03c3ab1b))
* pgt and contract queries ([a9698f6](https://github.com/InjectiveLabs/injective-ts/commit/a9698f6ccc60801241c9a61330a7bf6dddc062c7))
* pgt init ([063551f](https://github.com/InjectiveLabs/injective-ts/commit/063551f55b9a9326a7741cd501612ffbcde4229e))
* portfolio balance request ([ec22208](https://github.com/InjectiveLabs/injective-ts/commit/ec222084e4c99b268c4fd719438fcbf528c062d6))
* positions v2 ([552c522](https://github.com/InjectiveLabs/injective-ts/commit/552c522892d58a0f3bbcd65302f9563e8c13df68))
* proposal decomposer ([cf63bc0](https://github.com/InjectiveLabs/injective-ts/commit/cf63bc0fa2aae144c4f1bdffd3c6bc7ecb55c41d))
* querier active stake delegation ([564335d](https://github.com/InjectiveLabs/injective-ts/commit/564335d12df0e8b5ba7d8b4cf1fe403cdf5d850c))
* redeem from sdk-ts not wormhole-sdk ([6492495](https://github.com/InjectiveLabs/injective-ts/commit/64924954d2e635c0d0098594ff18191beca300f5))
* remove gst strategy ([0c11071](https://github.com/InjectiveLabs/injective-ts/commit/0c110718956701080e4adb84ebb1f3d24b8f5b06))
* removed numbers converters from utils ([36b7bcf](https://github.com/InjectiveLabs/injective-ts/commit/36b7bcf8ec7eb5ea8a815e4a808ddd0494565735))
* response transformers ([b72ce57](https://github.com/InjectiveLabs/injective-ts/commit/b72ce575d5f613a92ad9dd49748a88f220d05bf5))
* rest endpoints decoupling ([cba0e1a](https://github.com/InjectiveLabs/injective-ts/commit/cba0e1a62ee4e24ceb4f749411618112ec0f961b))
* retries on mempool full ([309317a](https://github.com/InjectiveLabs/injective-ts/commit/309317a4be674c0538474ed5cac49b007b764e7d))
* retry on broadcast ([6aaed21](https://github.com/InjectiveLabs/injective-ts/commit/6aaed216e433260f0e2b5683d52b364bf8824db1))
* rounds api ([d4da4d4](https://github.com/InjectiveLabs/injective-ts/commit/d4da4d423a37ce3bb75f6a40dbbaadfcebdf35e9))
* sc search ([778ee05](https://github.com/InjectiveLabs/injective-ts/commit/778ee05b762ee476bf57500d4c582dd4a42a69d0))
* sdk-ts initial ([1d2ef9b](https://github.com/InjectiveLabs/injective-ts/commit/1d2ef9bdd02e3684162374479324ee9dc1f896b5))
* sdk-ui-ts ([4c8f902](https://github.com/InjectiveLabs/injective-ts/commit/4c8f90262b0d7cf2df3038c23fda4a9e83bb8c6a))
* sepholia migration ([2b7823b](https://github.com/InjectiveLabs/injective-ts/commit/2b7823bed6d8ddd2faa979dc71d7360d40e7630d))
* setup indexer grpc account portfolio api and stream ([72d7d85](https://github.com/InjectiveLabs/injective-ts/commit/72d7d85e66e2932b60b3e6215d5cda11b036e6a5))
* simulating fee on ethereum wallets ([5ff04e6](https://github.com/InjectiveLabs/injective-ts/commit/5ff04e645cb41fbc09d823bf4a52778387ffe925))
* spl tokens transfer ([bc78a26](https://github.com/InjectiveLabs/injective-ts/commit/bc78a26f89245813eb88453648799f990b5807b9))
* token service for cw20 balances ([4850924](https://github.com/InjectiveLabs/injective-ts/commit/4850924e3caa7499eef86d794f31681120d5e7f7))
* trading strategies stats api ([cfc1699](https://github.com/InjectiveLabs/injective-ts/commit/cfc1699f68ba77a2ef2d615d69821fccfc68782e))
* trailing spot sgt ([9b77594](https://github.com/InjectiveLabs/injective-ts/commit/9b775944bd8e2e52e9a2a741178739bef68eb8d9))
* transaction error handling ([d0bc738](https://github.com/InjectiveLabs/injective-ts/commit/d0bc738ab4b99248b81e3387dba5914974ae0c17))
* tx filters ([1b48cd8](https://github.com/InjectiveLabs/injective-ts/commit/1b48cd81bffe85ee8556826274d9eb92eb67fb1d))
* tx response now returned instead of the txhash only ([7959791](https://github.com/InjectiveLabs/injective-ts/commit/7959791eb86a81eb32b6b10411ad503deb9bdd07))
* txClient ([efab6c8](https://github.com/InjectiveLabs/injective-ts/commit/efab6c80190b44620cdce8aa20fed4fef213de79))
* unified tx clients ([e404930](https://github.com/InjectiveLabs/injective-ts/commit/e404930c4fe095972c135bd982d7287cdd19dddd))
* update mito indexer vesion ([96c0a35](https://github.com/InjectiveLabs/injective-ts/commit/96c0a35e3f1481e58f492b58cfaabc2ccde6bf29))
* update oracle price stream ([2c8de1b](https://github.com/InjectiveLabs/injective-ts/commit/2c8de1bd1c81a997b56f38260d9f54c70b2814bc))
* update order object ([2857701](https://github.com/InjectiveLabs/injective-ts/commit/2857701d89c94db9e2377e4efc7f970bdb58fb0c))
* update supernova folder structure ([a220ecd](https://github.com/InjectiveLabs/injective-ts/commit/a220ecd97f94819ce839ac03facfa1a3c98f5b51))
* updated docs ([7c38c6d](https://github.com/InjectiveLabs/injective-ts/commit/7c38c6def49ee6064e14cd6acefa783013219e2c))
* utils for token metadata and networks ([271ac4c](https://github.com/InjectiveLabs/injective-ts/commit/271ac4c165ee5899b01b714d75a5b2335c934d1f))
* verify sig and pk wallet strategy ([d3a4794](https://github.com/InjectiveLabs/injective-ts/commit/d3a4794720a51529167680eee54bb6c0f751ebc0))
* verify signature on pk ([85f4a0e](https://github.com/InjectiveLabs/injective-ts/commit/85f4a0e807bb313e2eb0196d812f2fac775fe620))
* wasm code grpc queries ([91e618d](https://github.com/InjectiveLabs/injective-ts/commit/91e618de8c83e58052cbebe6bc4bd3ed5d826ff5))
* wasm messages ([3773c39](https://github.com/InjectiveLabs/injective-ts/commit/3773c39d8e61c70eec3f14683240a7f787fdd70e))
* web3 client ([8f286b2](https://github.com/InjectiveLabs/injective-ts/commit/8f286b2b42d0955ecf7cc74344f4bf28e2409e0b))
* wh gateway and new tokens ([d36f586](https://github.com/InjectiveLabs/injective-ts/commit/d36f58621a359c1c1bb69a4f78f513c346eb5c47))
* wormhole gw ([1253e57](https://github.com/InjectiveLabs/injective-ts/commit/1253e57341ecae8da67e4132957b7d8dc21a65f4))
* wormhole mainnet ([600926f](https://github.com/InjectiveLabs/injective-ts/commit/600926f6e14724cfcd1d78cc0789bca15a51426a))
* wormhole redeem flow ([5509b49](https://github.com/InjectiveLabs/injective-ts/commit/5509b4978dc7d8e8c5e34b4e8c03c07f4dc34afb))


### Reverts

* Revert "chore: added cid" ([30af4a2](https://github.com/InjectiveLabs/injective-ts/commit/30af4a22d00a04d0378fdcd0dd83cd8dc63646a0))
* Revert "chore: update sdk-ts with latest indexer protos" ([fcb9d33](https://github.com/InjectiveLabs/injective-ts/commit/fcb9d33cc66211df368b25fc71b5c0627ee2d4eb))
* faulty version ([6e25b3f](https://github.com/InjectiveLabs/injective-ts/commit/6e25b3f156d964666db8bc7885df653166aac523))





#  (2025-01-20)


### Bug Fixes

* account pagination ([3edcd33](https://github.com/InjectiveLabs/injective-ts/commit/3edcd334245ed13d84e7ec65600c1999bada06e6))
* account txs messages returned as empty array ([a7df3ae](https://github.com/InjectiveLabs/injective-ts/commit/a7df3ae9ebd620b4d3188bc1e9756c872b782ae9))
* actual block time ([f31d2df](https://github.com/InjectiveLabs/injective-ts/commit/f31d2dfe8f03f66108793a05bdee8968ab723eda))
* add DerivativeOrderSide ([5ce6a71](https://github.com/InjectiveLabs/injective-ts/commit/5ce6a71ab37a6d1c6e3de0dfa7afaa505f966891))
* add ethereumAddress from wallet ([5f27985](https://github.com/InjectiveLabs/injective-ts/commit/5f27985a3512fbab3f5c0a7defc7989dac6646dc))
* add linebrakes in transformer file ([2c8effd](https://github.com/InjectiveLabs/injective-ts/commit/2c8effdfde1f190e46f99e916a20974db8a002b2))
* add missing params in functions ([3cd74e9](https://github.com/InjectiveLabs/injective-ts/commit/3cd74e91a3b77779b1bf4b77af89e098442ddc6a))
* add order mask to batch cancel spot order message ([#71](https://github.com/InjectiveLabs/injective-ts/issues/71)) ([def9257](https://github.com/InjectiveLabs/injective-ts/commit/def9257f957fe0f543ca02550fae86f9a59bc642))
* add timeout height option to pk broadcaster ([1430d84](https://github.com/InjectiveLabs/injective-ts/commit/1430d84381bd7243a7b38b01e4f5a0de345aef10))
* added eip712 sign on private key ([84b628c](https://github.com/InjectiveLabs/injective-ts/commit/84b628c967d57c977b981faeca2021d8711a0de1))
* added executionSide prop to trade objects ([#78](https://github.com/InjectiveLabs/injective-ts/issues/78)) ([35da59c](https://github.com/InjectiveLabs/injective-ts/commit/35da59c33c9fb8a198306b4bbcaf27dd407a4fda))
* added no throw variant of oracle prices for BO ([7fbfd77](https://github.com/InjectiveLabs/injective-ts/commit/7fbfd77998aa5259f774d6f22e0b2d6cb6aeb26c))
* added symbols for erc20 ([e157eb9](https://github.com/InjectiveLabs/injective-ts/commit/e157eb91f1621ed4b3ced8b0ee81adbfb25782df))
* added version to sign only a hashed message ([ad31809](https://github.com/InjectiveLabs/injective-ts/commit/ad318090893900df76a6de24de55a2964f9610f0))
* address derivation ([ef5f438](https://github.com/InjectiveLabs/injective-ts/commit/ef5f43800d521a062b8a3399c844eaa1a8ef25fe))
* alchemy version ([b3cdb5f](https://github.com/InjectiveLabs/injective-ts/commit/b3cdb5fd3aaf0feb51332af65749d113ac666c5c))
* amino for msggrant ([c7f8193](https://github.com/InjectiveLabs/injective-ts/commit/c7f8193fccd85a3b1da5f52a434d1e51311d879c))
* any for contractExecutionAuthorization ([8a2a5d7](https://github.com/InjectiveLabs/injective-ts/commit/8a2a5d73889c0e1a163a3bd5ce2c1dca96a416d1))
* archiver endpoint ([6b295f5](https://github.com/InjectiveLabs/injective-ts/commit/6b295f52cb2d93cf874d929d731ce28bcbc5354e))
* args for MsgExec ([33d5bf4](https://github.com/InjectiveLabs/injective-ts/commit/33d5bf42da38db60e659f640809f37895cfbc32a))
* args for sending cw20 ([b2395de](https://github.com/InjectiveLabs/injective-ts/commit/b2395dece37532562c9fcba442ec6733cf6e5fce))
* auth parsing for different cosmos accounts ([eb8ebf0](https://github.com/InjectiveLabs/injective-ts/commit/eb8ebf0ce1d4ee40134c685f0dee0f9f5367a4ea))
* auth support and positions querying ([bdebabb](https://github.com/InjectiveLabs/injective-ts/commit/bdebabbd3d8218e99a5ba1b66c62465994c8b5ba))
* authorization typeUrl ([f872999](https://github.com/InjectiveLabs/injective-ts/commit/f8729991aeeee8aaf564eaed74ab5b0a5af69e70))
* authz grants ([a71c22b](https://github.com/InjectiveLabs/injective-ts/commit/a71c22bbe7059f09fb7d11cf426c719cd72c57e7))
* base account parsing ([f680ece](https://github.com/InjectiveLabs/injective-ts/commit/f680ece4c4e657d6b0efdbcab1d2bf3c542ba135))
* batch market update params ([4039440](https://github.com/InjectiveLabs/injective-ts/commit/40394409e3a4e421540380e69a946e57a8703308))
* batch update web3 parsing ([13be8ea](https://github.com/InjectiveLabs/injective-ts/commit/13be8eae21fa0dd48c1104d57c59a6e6fbf83a0d))
* bid type map ([8cd3a6d](https://github.com/InjectiveLabs/injective-ts/commit/8cd3a6db24c241eea5255e8d713a058d4036de94))
* bignumber conversion ([7559a3c](https://github.com/InjectiveLabs/injective-ts/commit/7559a3c82bd0acc427d3c0528e1ae8b8ef28cced))
* binary options types ([be3645e](https://github.com/InjectiveLabs/injective-ts/commit/be3645e9c7504eaad89ec54538a06d6d83e99dc4))
* binary options unify ([fa1c0aa](https://github.com/InjectiveLabs/injective-ts/commit/fa1c0aab00d977f73243703bd5f1d4d5e3ec1fb0))
* bind ([f18ae29](https://github.com/InjectiveLabs/injective-ts/commit/f18ae29b91cd23f63171760d59fa5eadf440f895))
* bojan's comment ([e378cf7](https://github.com/InjectiveLabs/injective-ts/commit/e378cf78900fcd4aade5ce5aee1417d4b408ebe5))
* broadcasting and proto decoding ([0cf6367](https://github.com/InjectiveLabs/injective-ts/commit/0cf6367932492aa33b9835ae565bf7a91e16f385))
* broadcasting sync mode on web3gw ([3075246](https://github.com/InjectiveLabs/injective-ts/commit/3075246a17d58bd51594f1882112630f35601ac9))
* broadcasting tx ([5816180](https://github.com/InjectiveLabs/injective-ts/commit/5816180ed2a5c5fdec61ef018d0ae7121f4f9072))
* build ([c511a2b](https://github.com/InjectiveLabs/injective-ts/commit/c511a2ba8da9985536cb168fa3683c77cfaae984))
* build ([c30f86b](https://github.com/InjectiveLabs/injective-ts/commit/c30f86b9e2a18495c3388fa59f945b6de3a4dbf7))
* build errors ([f9771df](https://github.com/InjectiveLabs/injective-ts/commit/f9771dfdc4acd3ba2a34cc603431786323ecfa41))
* build script ([6e8c15f](https://github.com/InjectiveLabs/injective-ts/commit/6e8c15f5d0c0d61e15766abb6217f3fa34cdf791))
* cached denom tokens ([a3abfdd](https://github.com/InjectiveLabs/injective-ts/commit/a3abfdd427b28b3d1e0458fac550b9a5c4d6c360))
* change limit param to optional ([daae254](https://github.com/InjectiveLabs/injective-ts/commit/daae254755b3f8c495e358a6b95fba0b0b35c03e))
* change log ([e039b61](https://github.com/InjectiveLabs/injective-ts/commit/e039b6173a1037bafb026c71f82cb08a073fad6a))
* circular deps ([fc41599](https://github.com/InjectiveLabs/injective-ts/commit/fc415999e4494085d86924736f4dae6d77b2487a))
* class name export ([21c58ab](https://github.com/InjectiveLabs/injective-ts/commit/21c58abd9f5496b43ccfc7a0420d424bb88aa7c3))
* conditional check ([573d75a](https://github.com/InjectiveLabs/injective-ts/commit/573d75a0f9e680e9c7a759ba86070eb01d363b21))
* console log removal ([da3dda8](https://github.com/InjectiveLabs/injective-ts/commit/da3dda8f4e02a2bf98ff8c8448eccb437bd94f8b))
* console logs ([046c171](https://github.com/InjectiveLabs/injective-ts/commit/046c171e1e58e2bf8ba4ada3871a846e1dc013cc))
* correct eip712 hash ([ef45b0f](https://github.com/InjectiveLabs/injective-ts/commit/ef45b0f2f991e6263c04d2a4c0f3ad8a03d4fc95))
* cosmos wallet ([c3416df](https://github.com/InjectiveLabs/injective-ts/commit/c3416dfb68f32d6d4568a6fdb5dd0a7e2bfb60d2))
* cosmos wallet fixes ([71965cb](https://github.com/InjectiveLabs/injective-ts/commit/71965cbc3a8cba1a8fab5dbd0a9e73adf9566714))
* cosmoshub endpoints ([3ddce39](https://github.com/InjectiveLabs/injective-ts/commit/3ddce399160c66853054d99bc05bc5fbf9b97291))
* cw20 send args ([c4a7518](https://github.com/InjectiveLabs/injective-ts/commit/c4a7518c20aaa6d79cb668c4ae70dc1b41023d2b))
* declare interface using pattern of other files ([73de2ab](https://github.com/InjectiveLabs/injective-ts/commit/73de2ab904d8b9334ef246865c43463801a56b37))
* denom client grpc endpoints ([b5aab84](https://github.com/InjectiveLabs/injective-ts/commit/b5aab845a034458b6f312224fe7193767e4a6d5c))
* denom client return undefined for no token denom ([29c6080](https://github.com/InjectiveLabs/injective-ts/commit/29c60809b7f785b23fa34fb0919731cdd40da42b))
* deprecate block mode ([e3975ca](https://github.com/InjectiveLabs/injective-ts/commit/e3975ca06d73508977eb5ce507a9ffa3c7a13b73))
* derivative types ([324829e](https://github.com/InjectiveLabs/injective-ts/commit/324829e741f857211c31c1f657b704cb57474e8c))
* double hashing ([6408b32](https://github.com/InjectiveLabs/injective-ts/commit/6408b3292b38e3e3cda7a2c617c2b7cde3264727))
* eip712 cid ([dcdb609](https://github.com/InjectiveLabs/injective-ts/commit/dcdb6098446413215482e083cc6047ffcad39604))
* eip712 domain ([c2f19ff](https://github.com/InjectiveLabs/injective-ts/commit/c2f19ff1616ac428dff3b3a5ec236085232eea9d))
* eip712 for msgExecuteContract ([b923f1c](https://github.com/InjectiveLabs/injective-ts/commit/b923f1cd6737587f4975fdafee2553c22ec2bd4e))
* eip712 generation ([767f2d7](https://github.com/InjectiveLabs/injective-ts/commit/767f2d7e6b4241945f7a488232b9f08a9093e242))
* eip712 hash ([d35d1dc](https://github.com/InjectiveLabs/injective-ts/commit/d35d1dc55b81b9b9409eb8c050d531ed024db000))
* eip712 improvements ([bfd0f05](https://github.com/InjectiveLabs/injective-ts/commit/bfd0f057bb282e85251c9c56e71289d630dee2a5))
* eip712 types ordering ([f6b96f7](https://github.com/InjectiveLabs/injective-ts/commit/f6b96f77342f45d16f5a39eddf0bedebec3aa38c))
* eip712 typing order ([10e4b6d](https://github.com/InjectiveLabs/injective-ts/commit/10e4b6dad70ae7130a73f23097311f40d61f4859))
* eip712v2 for authz authorizations ([bd99fb4](https://github.com/InjectiveLabs/injective-ts/commit/bd99fb431633a6321d3f522999de4052acc3da29))
* enums ([a6cbd5a](https://github.com/InjectiveLabs/injective-ts/commit/a6cbd5abe32d56533144852284f9f2511147d70e))
* error parsing ([bec75d4](https://github.com/InjectiveLabs/injective-ts/commit/bec75d4ef132ae29f2328f8f71a961c5cf04c4c1))
* error parsing ([def2bf5](https://github.com/InjectiveLabs/injective-ts/commit/def2bf592e8bd0fc092704aaf2c45ead6be19e57))
* error parsing and token type ([c6650fb](https://github.com/InjectiveLabs/injective-ts/commit/c6650fb53dd03fdd87792a4ae4a5b92437b254ed))
* esm import grpc-web ([3cf209f](https://github.com/InjectiveLabs/injective-ts/commit/3cf209f121ca439d025a6cbe6e3d541c1934f27a))
* esm imports ([7ba5cf6](https://github.com/InjectiveLabs/injective-ts/commit/7ba5cf69a58a3d4bb677859737089592c081552a))
* ethers import ([3ea3eae](https://github.com/InjectiveLabs/injective-ts/commit/3ea3eae37f7ab3126d0d67d2a3154d7badc082bd))
* exceptions thrown ([5c6f2ea](https://github.com/InjectiveLabs/injective-ts/commit/5c6f2eacf241a42b52b9e22e1ddf20647aa8d360))
* exchange auction transformer ([383c647](https://github.com/InjectiveLabs/injective-ts/commit/383c647f2cd0ac15a39a101cc99c486b60010230))
* ExchangeRestExplorerTransformer contract transaction transfomer add support for null gas_fee txs ([36b566c](https://github.com/InjectiveLabs/injective-ts/commit/36b566c5ed1bee3c73ed866061cd1e2b150b5142))
* exec args for cw20 send ([de5e9c2](https://github.com/InjectiveLabs/injective-ts/commit/de5e9c2e1e787959af2618e31b78c577c402a038))
* exec function ([e22460e](https://github.com/InjectiveLabs/injective-ts/commit/e22460ec5a50fb573c8a89c9ba10f645e3b10b4d))
* exec params for vaults ([1196e13](https://github.com/InjectiveLabs/injective-ts/commit/1196e13037f6bab7a0132c7e6dc0f6c107506113))
* exec params for vaults ([ec3f4d7](https://github.com/InjectiveLabs/injective-ts/commit/ec3f4d72195a37d2c1b329ebfbf2bc7dde900495))
* exec vault data ([248a3c5](https://github.com/InjectiveLabs/injective-ts/commit/248a3c53f49ff1bee4beb1949de6acfb2e6c62db))
* explorer endpoint ([a39fd93](https://github.com/InjectiveLabs/injective-ts/commit/a39fd93143640d960b075c187d013682e119021a))
* explorer rpc service ([6ab6652](https://github.com/InjectiveLabs/injective-ts/commit/6ab6652af86efc47b300446ea9b7db1cfe074ffc))
* export ([a56004f](https://github.com/InjectiveLabs/injective-ts/commit/a56004fc8cb8f4a933956960e4b7cb9897f698c4))
* export ([9360564](https://github.com/InjectiveLabs/injective-ts/commit/9360564743b3314897700de2fc1ecda18eea7ed1))
* export ([c743932](https://github.com/InjectiveLabs/injective-ts/commit/c74393231625db81a1df6359c43458e28723b1fb))
* export enums ([44f0fb5](https://github.com/InjectiveLabs/injective-ts/commit/44f0fb5c62b6da3dd10d3812b0ac26cba6aaf5f0))
* export for MsgExternalTransfer ([f241a94](https://github.com/InjectiveLabs/injective-ts/commit/f241a94ed8685658a206cb74c60d634deb11c3e7))
* export grpc related fns ([83c8b3c](https://github.com/InjectiveLabs/injective-ts/commit/83c8b3c676196989bf91bb50661a4793e675e178))
* export MsgBatchUpdateOrders ([1a191a4](https://github.com/InjectiveLabs/injective-ts/commit/1a191a4aaef9d4fb1b50606bcee64d12534372b0))
* export MsgTransferAndExecute ([2c0e7dc](https://github.com/InjectiveLabs/injective-ts/commit/2c0e7dc1be7ff8a00cb27b890e84ee58a7552033))
* export permissions API for external use ([de299f6](https://github.com/InjectiveLabs/injective-ts/commit/de299f6d7df21032f6e454ef5cfe2efcb88f3a1d))
* export utils ([9e3d07c](https://github.com/InjectiveLabs/injective-ts/commit/9e3d07c1d32825ba89a2b57f1e460e16f899592e))
* export wasm ([1d2112f](https://github.com/InjectiveLabs/injective-ts/commit/1d2112fa9cb715ef4ca439947c28c382de1a98db))
* exports ([a232ce7](https://github.com/InjectiveLabs/injective-ts/commit/a232ce7ad3f22247ba10ba0ef22aae0f6b0c59bc))
* exports ([bc77a41](https://github.com/InjectiveLabs/injective-ts/commit/bc77a4179fa642f3fd2fc38f0ac7c02eb2965f1e))
* exports ([5c775c3](https://github.com/InjectiveLabs/injective-ts/commit/5c775c3c5dff065ff426ccc2c54d7cbf6e9b08e2))
* exports ([750a096](https://github.com/InjectiveLabs/injective-ts/commit/750a096aa3cea4d1793cc4775bb7f0392ce4f165))
* exports ([a9df1bb](https://github.com/InjectiveLabs/injective-ts/commit/a9df1bb50f72feeb7f056847752995fd4f76c2c9))
* feePaidAmount to volume ([88c202f](https://github.com/InjectiveLabs/injective-ts/commit/88c202f99dd930c1555b9b91b84c7f7e408c660c))
* fetchBinaryOptionsMarkets pagination format ([921c5ae](https://github.com/InjectiveLabs/injective-ts/commit/921c5ae54d0b01402ad26c4c67394741ef5c1b8d))
* fetchSpotSubaccountTradesList ([e7c6b24](https://github.com/InjectiveLabs/injective-ts/commit/e7c6b248f46f44b057b10503adfd96be7e78dfb6))
* fix issues ([47c9000](https://github.com/InjectiveLabs/injective-ts/commit/47c9000481f8c38c4d08cb343cb98fd586a5390a))
* format documents uniformly and remove unnneeded imports ([f28d104](https://github.com/InjectiveLabs/injective-ts/commit/f28d1046430205931af64c97c393715f3c677b40))
* funds array for MsgExecuteContract ([77dcb24](https://github.com/InjectiveLabs/injective-ts/commit/77dcb248cdc6de496235a8aa6a40a92949b02a9e))
* gas limit for contracts ([8677227](https://github.com/InjectiveLabs/injective-ts/commit/86772270ae17fbf69829243509f2c68fba7d0d6e))
* gov modules ([beb1eb4](https://github.com/InjectiveLabs/injective-ts/commit/beb1eb4935e4fd9c156d761cb9487e805a585646))
* gov proposal msg typings ([31b354f](https://github.com/InjectiveLabs/injective-ts/commit/31b354fc52fa8d1cb58ce8a97213e8da9cddb391))
* gov transformer ([46e1113](https://github.com/InjectiveLabs/injective-ts/commit/46e111336e7cafbbef17d3be064f1e57964473a9))
* grant transforming ([8b64eb8](https://github.com/InjectiveLabs/injective-ts/commit/8b64eb8d1349cb7d663cb5aba902503427d3bf22))
* grpc broadcast sync tx ([8fdc8de](https://github.com/InjectiveLabs/injective-ts/commit/8fdc8de4c0aacec037b5b17a885a7d780059498b))
* grpc error handling ([40fb0fd](https://github.com/InjectiveLabs/injective-ts/commit/40fb0fde7a8cece703d2c7c223793b0afdaeb353))
* handle 0 case differently in tens multiplier logic ([246ff6a](https://github.com/InjectiveLabs/injective-ts/commit/246ff6a2a574e07deb0ae8d58adccea0491f52ce))
* handles invalid factory denom seperator format ([5bd9c35](https://github.com/InjectiveLabs/injective-ts/commit/5bd9c35bd4660e85c9659269f904833127020f68))
* helpers export ([f0a51e2](https://github.com/InjectiveLabs/injective-ts/commit/f0a51e20862280ec78a69f78dafef8039db22836))
* ibc transfer memo ([8815bf9](https://github.com/InjectiveLabs/injective-ts/commit/8815bf9f3aa6571802a6715ddd7f42e9b031e372))
* icons ([c3f3ed8](https://github.com/InjectiveLabs/injective-ts/commit/c3f3ed8b37ea12bb918e992b887e1c5a8d74a686))
* import ([a898113](https://github.com/InjectiveLabs/injective-ts/commit/a898113871da1f038597a76fd75bd071d324dd03))
* import ([cfc70ec](https://github.com/InjectiveLabs/injective-ts/commit/cfc70ec11fba9e40867e554a18219055842ea6af))
* import js missing ([01835b4](https://github.com/InjectiveLabs/injective-ts/commit/01835b4cb631b7b5778f77bf44c60dd4d0be18ac))
* imports ([877486d](https://github.com/InjectiveLabs/injective-ts/commit/877486d027440d54d043f5b3b8f8a6f45be6521e))
* imports ([8c7ef36](https://github.com/InjectiveLabs/injective-ts/commit/8c7ef3689b4016b9eab83f5914255933f59bec4a))
* imports ([5554857](https://github.com/InjectiveLabs/injective-ts/commit/5554857b690dc7e697f55be8d96ac12ff70caaac))
* include memo ([778e3bb](https://github.com/InjectiveLabs/injective-ts/commit/778e3bb9383a77e4a22734ca5766edf6c0ba4ee5))
* indexer token meta ([ec7eb2f](https://github.com/InjectiveLabs/injective-ts/commit/ec7eb2fb76a700e098598c94b1dda20ed64ba145))
* indexerRestMarketChronosApi casing ([335757f](https://github.com/InjectiveLabs/injective-ts/commit/335757f584e25ee64c5ad05732ace69ae7a11f9d))
* instantiate vault cw20 code id typing ([f2dbd5e](https://github.com/InjectiveLabs/injective-ts/commit/f2dbd5e83ea4a1519edc90486708e12193775b27))
* insurance fund eip712 msg ([cccb603](https://github.com/InjectiveLabs/injective-ts/commit/cccb603aca811f2661ff58c4aa280901218e155a))
* keplr eth sign based on features ([b70e568](https://github.com/InjectiveLabs/injective-ts/commit/b70e5688a79f250798a6b21fa4e9d9fbac2a17d1))
* keplrReclaimFunds message ([dd2136e](https://github.com/InjectiveLabs/injective-ts/commit/dd2136ee3c62ab3dcdc3141928f3ef56446200e1))
* leftover console log ([c3d7c89](https://github.com/InjectiveLabs/injective-ts/commit/c3d7c894be06ff4ab53c8a6af818e5411df4ca84))
* linting and initial fetch ofac ([58983fc](https://github.com/InjectiveLabs/injective-ts/commit/58983fc0f02ea6e80b3788a03f4780dc6b85e9e3))
* local only util classes ([bd99108](https://github.com/InjectiveLabs/injective-ts/commit/bd991083964a673ef54418f504e8fed959ade812))
* mapping of grantAuthorization ([58d1310](https://github.com/InjectiveLabs/injective-ts/commit/58d1310895c2a6abdd19fc9a8e651708d570ff55))
* market quantity decimals ([b34b4ee](https://github.com/InjectiveLabs/injective-ts/commit/b34b4ee743c8fdf2d95bdbe95e52a55694c7c20d))
* marketIDs history query ([38bc1aa](https://github.com/InjectiveLabs/injective-ts/commit/38bc1aadeaa95f72e7e3e446f5c72af97693cae3))
* marketIDs history query ([e9f3038](https://github.com/InjectiveLabs/injective-ts/commit/e9f30386638dcac3a48a2668c6f76c53986cda45))
* marketing info undefined on contract ([72dce9f](https://github.com/InjectiveLabs/injective-ts/commit/72dce9f8f8372b1ea9169356d53c53765a6c8eee))
* memo as a number ([1ce2d9c](https://github.com/InjectiveLabs/injective-ts/commit/1ce2d9c897b0dcc134410056d53dd72b0b231449))
* minor ([5e3cac2](https://github.com/InjectiveLabs/injective-ts/commit/5e3cac21a98657bdb19ec78402e0e694688519e6))
* minor ([0aba365](https://github.com/InjectiveLabs/injective-ts/commit/0aba365de5b8696860625428ed2a9936a8556978))
* minor ([c7e31e3](https://github.com/InjectiveLabs/injective-ts/commit/c7e31e3bea7035aa49a1e0280559619ed90b6ad7))
* minor ([253737c](https://github.com/InjectiveLabs/injective-ts/commit/253737c9a122fa7735e23f294ff6c0ea7958f845))
* minor ([a462cf7](https://github.com/InjectiveLabs/injective-ts/commit/a462cf7444237590ecdc08fd982f48ce636e47c7))
* minor ([5c9e79c](https://github.com/InjectiveLabs/injective-ts/commit/5c9e79c382b4aad9215838fd59fe900d733db420))
* minor ([d1f31e5](https://github.com/InjectiveLabs/injective-ts/commit/d1f31e58bbe178b63d3cd844ad4769faaf7ae4b1))
* minor ([d4783a3](https://github.com/InjectiveLabs/injective-ts/commit/d4783a371f2cfa6c2cb9c813b8c454d2ab51ce91))
* minor ([299ad3d](https://github.com/InjectiveLabs/injective-ts/commit/299ad3de59f96df7261e6bdb9935e2db6608e295))
* minor ([65fa29c](https://github.com/InjectiveLabs/injective-ts/commit/65fa29c416f9f164a558927b90f353680b3a9164))
* minor ([94cdf4e](https://github.com/InjectiveLabs/injective-ts/commit/94cdf4e051516da6226761405827883ff3b94014))
* minor ([b29ec24](https://github.com/InjectiveLabs/injective-ts/commit/b29ec24c91d103ad0f18f97fff1bf5c9bb5c3359))
* minor ([2dee193](https://github.com/InjectiveLabs/injective-ts/commit/2dee193534ddd50de1281d7aed616876fc56932f))
* minor ([1be70b2](https://github.com/InjectiveLabs/injective-ts/commit/1be70b24a01f1e6907145fd740d4aa1f425748bd))
* minor ([a433519](https://github.com/InjectiveLabs/injective-ts/commit/a433519292d8a56e02d65bac2c41ae29f8d98626))
* minor ([aa83920](https://github.com/InjectiveLabs/injective-ts/commit/aa839202286c892b619500757bbe81c206b66157))
* minor ([5c6fef7](https://github.com/InjectiveLabs/injective-ts/commit/5c6fef719b7836f04612449dca4849b002f7a1df))
* minor ([39b553b](https://github.com/InjectiveLabs/injective-ts/commit/39b553b40cd7623836268651e892e5ed10812828))
* minor ([af6fffe](https://github.com/InjectiveLabs/injective-ts/commit/af6fffe5cecec8b4405b09c27ce99ad75c6f8b3e))
* minor ([8283050](https://github.com/InjectiveLabs/injective-ts/commit/82830500b133aa504c3a18143e459a34783fb291))
* minor ([ef541cf](https://github.com/InjectiveLabs/injective-ts/commit/ef541cfd69ea2a6f00680e10d0d965281cabd2ee))
* minor ([cc45f46](https://github.com/InjectiveLabs/injective-ts/commit/cc45f46242964e1491b039f6de85f5b27c019f28))
* minor ([6ee390a](https://github.com/InjectiveLabs/injective-ts/commit/6ee390a4336e62a7656cde9d9f7e0fc58251348b))
* minor ([099b33d](https://github.com/InjectiveLabs/injective-ts/commit/099b33d0e1ce111cfdec9163bec464aa5e1a797f))
* minor ([82f2708](https://github.com/InjectiveLabs/injective-ts/commit/82f2708bf0bf159df75568d0e4b3298abf99bca2))
* minor ([cadaff2](https://github.com/InjectiveLabs/injective-ts/commit/cadaff2f3d89f54d6643b85dcfec0a2d74ff84d7))
* minor args pgt ([2d0b137](https://github.com/InjectiveLabs/injective-ts/commit/2d0b137605b14d9cb993bd83aa45e27fc7aa4261))
* minor condition check ([418431c](https://github.com/InjectiveLabs/injective-ts/commit/418431cb7f594c2252a6534e01b30b749d084a85))
* minor conversion to token info ([d8e3d81](https://github.com/InjectiveLabs/injective-ts/commit/d8e3d81c87e2cdea32f57a947e1b3fc20fb40dc4))
* minor for MsgTransfer ([2912a65](https://github.com/InjectiveLabs/injective-ts/commit/2912a650ce7153e241cd0a86014050a58d694985))
* minor naming ([9f679e2](https://github.com/InjectiveLabs/injective-ts/commit/9f679e2d10461cabf571f161d4076c5aaf8848f2))
* minor tests ([0f9baf1](https://github.com/InjectiveLabs/injective-ts/commit/0f9baf1753525018ecf352f498e2cea99f43a3df))
* minor todos ([b661ec9](https://github.com/InjectiveLabs/injective-ts/commit/b661ec9f38030c51c7cae67754ff30557e2f9275))
* minor typing ([9a59b76](https://github.com/InjectiveLabs/injective-ts/commit/9a59b766343ee8eae99f3a56000ed0304e4dc236))
* minor typings ([5059968](https://github.com/InjectiveLabs/injective-ts/commit/5059968ef1d02454ffcf449f2da5b6573b60664d))
* minor undefined error ([ecec926](https://github.com/InjectiveLabs/injective-ts/commit/ecec9262d2e2137c306788ec4a35d60436e96b8a))
* minor util function ([55db0c8](https://github.com/InjectiveLabs/injective-ts/commit/55db0c8debff6336950b05fd9824fcf545636497))
* minor vault config ([ebdffcd](https://github.com/InjectiveLabs/injective-ts/commit/ebdffcd73dfc9356f98b9195b23dacd7dc287898))
* move dependency to proper package.json ([3e57c96](https://github.com/InjectiveLabs/injective-ts/commit/3e57c96e4a3af096d7e3815f4d3e5b183bd5bdf4))
* msg import ([629478c](https://github.com/InjectiveLabs/injective-ts/commit/629478ce9943e2dd421b315ca4a4fd9e134ea2d6))
* msg params fix ([d738d01](https://github.com/InjectiveLabs/injective-ts/commit/d738d01d2e565e6d765de8472341718d43742251))
* msg parsing ([588d97e](https://github.com/InjectiveLabs/injective-ts/commit/588d97e75118be278b980c6655511ac7f0bab66c))
* msgBatchUpdateOrders amino ([0a8bc64](https://github.com/InjectiveLabs/injective-ts/commit/0a8bc64c5e3dda07ec8765b160259571547642ca))
* msgExec cannot unmarshal object into Go value of type []json.RawMessage error ([146d17e](https://github.com/InjectiveLabs/injective-ts/commit/146d17ea725eba2835776598232caa00dacc8651))
* msgexec params ([3f01ef8](https://github.com/InjectiveLabs/injective-ts/commit/3f01ef8fc1d632014b751bb2c308d0b97471523e))
* msgGrant web3 ([9e0eb14](https://github.com/InjectiveLabs/injective-ts/commit/9e0eb14be27d89b67e8d18520956e04d3d68cd92))
* msgs type ([7b18629](https://github.com/InjectiveLabs/injective-ts/commit/7b1862917abd07771deb7b1fbc2b5d9a2725ba9c))
* msgSubmitProposalPerpetualMarketLaunch toWeb3 format ([59e8163](https://github.com/InjectiveLabs/injective-ts/commit/59e816339f9820e485ad0b3b391a601d39d998e4))
* MsgSubmitTextProposal type not found issue ([9cb4db7](https://github.com/InjectiveLabs/injective-ts/commit/9cb4db7e80454bf2655e61dbfe0715a7487ba743))
* msgTransfer tokens param ([8bd257d](https://github.com/InjectiveLabs/injective-ts/commit/8bd257d275ccd9e2923477de2a5899e866001464))
* msgTransferCosmJs toAmino ([0561ad8](https://github.com/InjectiveLabs/injective-ts/commit/0561ad8e7099b48c10980eeab089e404214537fe))
* msgTransferCosmJs toAmino ([05b2182](https://github.com/InjectiveLabs/injective-ts/commit/05b21829734f08be33acc0484cb79ad27246d6eb))
* naming ([eee281a](https://github.com/InjectiveLabs/injective-ts/commit/eee281ae025dee267af5ad8d20b521a769c2487d))
* network information ([853f467](https://github.com/InjectiveLabs/injective-ts/commit/853f4677b278b0ff1f111a3c9f2cb77d993a1508))
* nonce on orderhash manager ([a269718](https://github.com/InjectiveLabs/injective-ts/commit/a269718a647c53e93612b283fcc720d8e2462dde))
* not awaiting for error ([b97cc8a](https://github.com/InjectiveLabs/injective-ts/commit/b97cc8aeab0f8d779342746aaf2c6ad5c48df7bc))
* not found tx polling ([92f2bc3](https://github.com/InjectiveLabs/injective-ts/commit/92f2bc32a9c9e7e6fa5112141ce0dee25b995202))
* not found tx polling ([226f2bf](https://github.com/InjectiveLabs/injective-ts/commit/226f2bf6a4368d33cd17428f87752fe6bb56a6c5))
* nullable strings in value ([32bf7f1](https://github.com/InjectiveLabs/injective-ts/commit/32bf7f16a226fd81bd136b40db43fe9735fd83cc))
* optional params ([e4a9b24](https://github.com/InjectiveLabs/injective-ts/commit/e4a9b243690f29ff31158300d91c926b32e4a43e))
* order hash manager ([f29c236](https://github.com/InjectiveLabs/injective-ts/commit/f29c236bfd4bd1b82bc34d523c6ea92f82cae0fc))
* order hash manager ([7db92b2](https://github.com/InjectiveLabs/injective-ts/commit/7db92b28f8214786e61dadad353da48c4b45cb7a))
* order of conditionals ([20b78e7](https://github.com/InjectiveLabs/injective-ts/commit/20b78e7fc3101799e7ebd049cbbfd40874e4218a))
* orderbooks response ([d6225f2](https://github.com/InjectiveLabs/injective-ts/commit/d6225f20d94344ab65955b4f82f66b0a88711dbd))
* orderMask and twitter link ([0474569](https://github.com/InjectiveLabs/injective-ts/commit/047456994f5233ed099174cd7f96a34f29dfbce8))
* orderMask field ([9670e1e](https://github.com/InjectiveLabs/injective-ts/commit/9670e1ecb0621a73aa75c7df37b9c5bf27dc9828))
* package version ([f861fbf](https://github.com/InjectiveLabs/injective-ts/commit/f861fbf21f5f78d1b840930a67b05c578087a3b8))
* pagination for token holders ([e09bea3](https://github.com/InjectiveLabs/injective-ts/commit/e09bea3bfca498ac6fedff130dffeab34d9b1466))
* paging pagination ([bfbac3e](https://github.com/InjectiveLabs/injective-ts/commit/bfbac3ed608368d6bef066569f1b819b1afb1b36))
* params for rest indexer api ([c149563](https://github.com/InjectiveLabs/injective-ts/commit/c149563be1a17b91148f2f1d96673d5051d44c4e))
* path import for icons ([ef07786](https://github.com/InjectiveLabs/injective-ts/commit/ef0778652376013a8b91109935156cd5d410932b))
* peggy denom ([d3976f6](https://github.com/InjectiveLabs/injective-ts/commit/d3976f6203ac325d9cf5a7e68a11764ac832b6a1))
* pk generating ([0cc94e1](https://github.com/InjectiveLabs/injective-ts/commit/0cc94e1ed53f93ad27c081e3745ab4c6dc29d301))
* pk resubmitting tx twice in case of out of gas ([8179115](https://github.com/InjectiveLabs/injective-ts/commit/81791158de364232a50208d115daad3c78df5b12))
* pk signing eip712 ([c042f4a](https://github.com/InjectiveLabs/injective-ts/commit/c042f4af8982fd5913ee9eb2b24220fc1d8aa910))
* private key import ([653d3ba](https://github.com/InjectiveLabs/injective-ts/commit/653d3ba6ce24631786cd453be2d5d92472b00195))
* projx typings ([6a3c532](https://github.com/InjectiveLabs/injective-ts/commit/6a3c53280cd9e63c682d18567277628a2d25cd15))
* protoObject function ([999dbd3](https://github.com/InjectiveLabs/injective-ts/commit/999dbd3745c04f675594df5d324c5368fe6e32b3))
* pubKey conversion to bec32 ([5f44b77](https://github.com/InjectiveLabs/injective-ts/commit/5f44b7796441749711c170bf3ebdcbed2664bb5a))
* pubkey derivation ([b487019](https://github.com/InjectiveLabs/injective-ts/commit/b487019075dca1564aba55dcadb5cda4fa57b49a))
* pubKey deriving ([d7139c1](https://github.com/InjectiveLabs/injective-ts/commit/d7139c107bb52deb16cdb73cb461a2c0222ddcf8))
* pubkey to bech32 pubkey ([d1962f9](https://github.com/InjectiveLabs/injective-ts/commit/d1962f9b34dfa1478b85b0d7f28513ad69266955))
* public key ([fe13df0](https://github.com/InjectiveLabs/injective-ts/commit/fe13df0c91088edb3d0bc7a1cc497030dade7f07))
* public key derivation from private key hex ([90b2de6](https://github.com/InjectiveLabs/injective-ts/commit/90b2de66bf26f7aff6fc18bfe30fb05c877bd3e8))
* public key derivation from private key hex ([354b3c0](https://github.com/InjectiveLabs/injective-ts/commit/354b3c003b4e74d0392b85ea157e22a642c82aae))
* react native check ([b7815b9](https://github.com/InjectiveLabs/injective-ts/commit/b7815b91f7fa63d049c65e8a854e43590ff3f9fe))
* redundant params ([47ca9f2](https://github.com/InjectiveLabs/injective-ts/commit/47ca9f2f34ec9b2902511176c7c91df6560a1c24))
* remove blank strings ([104b4ea](https://github.com/InjectiveLabs/injective-ts/commit/104b4ea3c273492027e8eafa52d37b50a3334b6d))
* remove retries from msgBroadcaster ([a60bc4e](https://github.com/InjectiveLabs/injective-ts/commit/a60bc4eefc30c8e460e748c5e38bb97e8315c45e))
* removed examples ([a88625c](https://github.com/InjectiveLabs/injective-ts/commit/a88625c0f49e8bf4176905b0b5196be5c5e7ad31))
* resolutions ([10f1156](https://github.com/InjectiveLabs/injective-ts/commit/10f11561ec8c38c62332f06535af63d480a0830a))
* resolutions ([8a3b0b0](https://github.com/InjectiveLabs/injective-ts/commit/8a3b0b00c164e308e65ce6519ed923445cca8bb5))
* resolutions ([bff3ca0](https://github.com/InjectiveLabs/injective-ts/commit/bff3ca0222ab4d69ff804ba9a54ee667e1dfd9fa))
* resolutions ([4910ff3](https://github.com/InjectiveLabs/injective-ts/commit/4910ff361033ad22cbc52a636e0df817c988af19))
* rest api ([35fb2e3](https://github.com/InjectiveLabs/injective-ts/commit/35fb2e375d3e4d43eafb53a3264a6ade7a33dc49))
* return correct signature ([99da278](https://github.com/InjectiveLabs/injective-ts/commit/99da278ae2d5e812763cea84a94f3fdf9e88e0ed))
* return types from stream ([45ff576](https://github.com/InjectiveLabs/injective-ts/commit/45ff576e663209c01f2c95e71880da3fa40f65c9))
* rounding to tick size ([c693113](https://github.com/InjectiveLabs/injective-ts/commit/c6931139e248a1c18faeb15255c9d7dc62c20404))
* script minor ([adb7c76](https://github.com/InjectiveLabs/injective-ts/commit/adb7c764ad00a0cfa38223cecf9b221873cd31b8))
* sdk-ts docs ([cc4bf85](https://github.com/InjectiveLabs/injective-ts/commit/cc4bf85c33389e313b7263f11091012f7f6e91ee))
* sdk-ts README.md (format) ([27b9440](https://github.com/InjectiveLabs/injective-ts/commit/27b9440bdae644833ae02adc6661a234dfe6a202))
* sdk-ts README.md (hex string type) ([c107257](https://github.com/InjectiveLabs/injective-ts/commit/c107257d4e3210f7e537133db2d08e335003d88e))
* sdk-ts README.md (PrivateKey import path) ([9d6f6cb](https://github.com/InjectiveLabs/injective-ts/commit/9d6f6cb572fdcb4a2b18e6c502d284f193ed4d6c))
* sdk-ts README.md (pubKey type) ([0fd1a4f](https://github.com/InjectiveLabs/injective-ts/commit/0fd1a4f29f1281fcb0090e06d7a169be95baa77b))
* sender not set ([58cc039](https://github.com/InjectiveLabs/injective-ts/commit/58cc03947ebc051e7168159f0e717daa8ad70abe))
* set funds as 0 for msgExecuteContractCompat ([bbcfa54](https://github.com/InjectiveLabs/injective-ts/commit/bbcfa54a6e678b0a2f9613c9e1b5098c9d9cf63d))
* sign mode ([5597703](https://github.com/InjectiveLabs/injective-ts/commit/55977038b418fea25578a985a6cf791a5155be83))
* signature derivation ([6f0b5d2](https://github.com/InjectiveLabs/injective-ts/commit/6f0b5d27fafbddaf49831d01bc53e27fe92d53f7))
* signature list on simulating transaction ([ac77679](https://github.com/InjectiveLabs/injective-ts/commit/ac77679b8651ffc22b2e19275f2ffbb8397a5e12))
* signature propert typing ([da77d09](https://github.com/InjectiveLabs/injective-ts/commit/da77d09f2e36b826fdec3b9fc8a5e791aeec5571))
* signing with private key ([ac1032b](https://github.com/InjectiveLabs/injective-ts/commit/ac1032b2beca129d0ba07065944ee8b65e6c80ed))
* simple jest setup ([0ccea6e](https://github.com/InjectiveLabs/injective-ts/commit/0ccea6ed99319adaa6a47fa7d7b4b267f5900b46))
* simplifying TokenInfo class ([1089c71](https://github.com/InjectiveLabs/injective-ts/commit/1089c717b3175b4d37e3fa145c55585c12d02daa))
* snakecase fields ([96b5b47](https://github.com/InjectiveLabs/injective-ts/commit/96b5b4763f9b672e1b8e9b7782fce36671e0edd7))
* snakekeys vault exec args ([243450a](https://github.com/InjectiveLabs/injective-ts/commit/243450afc9f4a19a7ed951bf8742182e0565a4d1))
* spot order price ([e278d73](https://github.com/InjectiveLabs/injective-ts/commit/e278d73a7eafe52fa22232ce7de44414ddbd3ce3))
* std fee minor ([a4bfdbf](https://github.com/InjectiveLabs/injective-ts/commit/a4bfdbf907a71501348012b6ccec6e430beb18ff))
* stream exports ([a555444](https://github.com/InjectiveLabs/injective-ts/commit/a55544408c483dc29ae2f87473e2e7cbaa411e0a))
* subscribe and redeem from vault ([4a47e6f](https://github.com/InjectiveLabs/injective-ts/commit/4a47e6ff14424543fbdab7e6548c55bed482dd41))
* terrajs version ([04288df](https://github.com/InjectiveLabs/injective-ts/commit/04288df12673e80fe131fa77f13aa30c7be501d4))
* testnet tokens ([1209081](https://github.com/InjectiveLabs/injective-ts/commit/12090815b2c39e165c8e673487b21d5734fb690f))
* tests ([062e713](https://github.com/InjectiveLabs/injective-ts/commit/062e7137b8f33498f8eb7e89be9074c2f3860c64))
* tests ([4accbb2](https://github.com/InjectiveLabs/injective-ts/commit/4accbb2b86d4ba70670ab979f559af544fb232a2))
* tick sizes less than 0 not parsing properly ([5ad85dd](https://github.com/InjectiveLabs/injective-ts/commit/5ad85dde5c3a65503a5e5bbf3200269bd8dc9e6a))
* time utils export ([90eb637](https://github.com/InjectiveLabs/injective-ts/commit/90eb637c61d92b6bf83b3ac4b8516f5c8fcf77b1))
* timeout and blocktime ([b4e11cd](https://github.com/InjectiveLabs/injective-ts/commit/b4e11cdcafda875ab5a5cca00b8e818a55a9bf8a))
* timeout for rest queries ([4d64636](https://github.com/InjectiveLabs/injective-ts/commit/4d6463674ee9f1b63138d8cc7e1cb81b19e09835))
* token denom mapping ([3584927](https://github.com/InjectiveLabs/injective-ts/commit/3584927b97e40171fdae6a24f6aa528bc5a6eaae))
* token meta not populated on devnet env ([11fead4](https://github.com/InjectiveLabs/injective-ts/commit/11fead46519b883cd676db027162189402d17d06))
* token service ([f94e037](https://github.com/InjectiveLabs/injective-ts/commit/f94e037a2a7124f3db5616d71be3a5c0c06d8c38))
* token type unification ([8dc921b](https://github.com/InjectiveLabs/injective-ts/commit/8dc921b6e620eb01ddff3ac3154fcb1fce651982))
* token utils coingecko api ([69c1533](https://github.com/InjectiveLabs/injective-ts/commit/69c15339bef85a9537a70ef1524debec413ddea2))
* tokenFactoryStatic - getMetaByDenomOrAddress returning 2 tokens ([f7f22dc](https://github.com/InjectiveLabs/injective-ts/commit/f7f22dc96b10314a86dbf3e3cd09bedaaec8bcb5))
* TradeExecutionSide enum values ([00b5325](https://github.com/InjectiveLabs/injective-ts/commit/00b53255de72fa6157a28a5b9bb4fc0df662b6ef))
* trading volume ([2b3da1a](https://github.com/InjectiveLabs/injective-ts/commit/2b3da1a0a2603447d1fc1da3ed0399ebdc0f14e6))
* transaction exceptions ([2083bb8](https://github.com/InjectiveLabs/injective-ts/commit/2083bb80770b5ad954d2249d119ed72113f6b0c2))
* transaction fail exception ([02be379](https://github.com/InjectiveLabs/injective-ts/commit/02be379f90d51982d4963c99d6985966fe170ab8))
* transaction fail exception ([763931e](https://github.com/InjectiveLabs/injective-ts/commit/763931e21cdaca141149bff23fa9673b9dc5e5f0))
* transform response ([3c56d5f](https://github.com/InjectiveLabs/injective-ts/commit/3c56d5faf71b680b80591297bfc633308f3b626b))
* transport for stream ([2e3e929](https://github.com/InjectiveLabs/injective-ts/commit/2e3e929c18db669cc4461310befad34172f21d88))
* trigger price ([9a9294b](https://github.com/InjectiveLabs/injective-ts/commit/9a9294b46ea3b40125ae597ef3b1f07ab893412a))
* trigger price null ([4ea1a7c](https://github.com/InjectiveLabs/injective-ts/commit/4ea1a7ce46ad668fd12eda61479366403f0d52b0))
* tx broadcast clients ([72fb92a](https://github.com/InjectiveLabs/injective-ts/commit/72fb92a54334a6aa6d943c29f2b9c5bba699a778))
* tx clients ([0160e7f](https://github.com/InjectiveLabs/injective-ts/commit/0160e7f24fed4ce49dd627f91390ebbc42721003))
* tx error parsin ([c281fec](https://github.com/InjectiveLabs/injective-ts/commit/c281fec94e5ebaecf6b1830228ae6bada5bbea4f))
* tx polling interval ([402189f](https://github.com/InjectiveLabs/injective-ts/commit/402189f62b41e6cbfd8f8ae402ab323610131d1d))
* tx polling interval ([536e10f](https://github.com/InjectiveLabs/injective-ts/commit/536e10f35257d8967fa2aff1ab97513d999be3f7))
* txGrpcApi exception handling ([a5b077a](https://github.com/InjectiveLabs/injective-ts/commit/a5b077a044fa2acf051483bded9486159be5a95b))
* txresponse interface ([950461c](https://github.com/InjectiveLabs/injective-ts/commit/950461cc7695e28ec9f08ec1fed92e9cc095f317))
* type added ([ee571c5](https://github.com/InjectiveLabs/injective-ts/commit/ee571c59ce60654ef8fa464beab4f6766a9f4983))
* type export ([a3ba34f](https://github.com/InjectiveLabs/injective-ts/commit/a3ba34fc8cb66ca3673ff983905e904d4756d379))
* type export ([70995ef](https://github.com/InjectiveLabs/injective-ts/commit/70995ef0a64e921674b91a0cfd16b679c7d5b327))
* types ([95bc799](https://github.com/InjectiveLabs/injective-ts/commit/95bc799f96836a02c20ec9a3614d9751aa47e759))
* types and conditions for keplr + ledger ([5bc4a9a](https://github.com/InjectiveLabs/injective-ts/commit/5bc4a9a93af98acf76ddf98d899adb6898e28b08))
* types export ([ff44030](https://github.com/InjectiveLabs/injective-ts/commit/ff44030661df32b3566efaa1b3c9403d3d59e225))
* types for createTransaction ([b08b76d](https://github.com/InjectiveLabs/injective-ts/commit/b08b76dc71a83822ddb101657ef69e5e6994085b))
* types import ([1f749f2](https://github.com/InjectiveLabs/injective-ts/commit/1f749f26bd9fa0d7f08533e99cf0a94faab6496e))
* typing ([05c49bf](https://github.com/InjectiveLabs/injective-ts/commit/05c49bfd9427d4c6db6ffe7b16c52904da73b6b7))
* typing ([d96c26a](https://github.com/InjectiveLabs/injective-ts/commit/d96c26a74147833dbcadb59ddc0898c971aea260))
* typo ([2056cd6](https://github.com/InjectiveLabs/injective-ts/commit/2056cd6bedeb53adfb6d9ba0b9e76f84183d0524))
* typo ([b673377](https://github.com/InjectiveLabs/injective-ts/commit/b6733777a47f659c4912015a1f373adbb2354912))
* undefined prop on PrepareTx ([a14f810](https://github.com/InjectiveLabs/injective-ts/commit/a14f810901a77f08277eb04b92e263e991bf9be3))
* update naming structure in types file ([b48f698](https://github.com/InjectiveLabs/injective-ts/commit/b48f69893036b968c9e0df8476cbff0f3baa7ffd))
* Update package name after it was updated upstream ([8efe048](https://github.com/InjectiveLabs/injective-ts/commit/8efe04878d77e3e6ab9117cdfe417bc11cae8d69))
* update proto definition in MsgClaimVoucher ([9efc4c9](https://github.com/InjectiveLabs/injective-ts/commit/9efc4c9a59ba108022b15baea13fb6b968ef32b2))
* update proto definition in MsgCreateNamespace ([b043cfb](https://github.com/InjectiveLabs/injective-ts/commit/b043cfb9539e76086d69af47bf29fabcc8417874))
* update proto definition in MsgDeleteNamespace ([fc25c3d](https://github.com/InjectiveLabs/injective-ts/commit/fc25c3dde8cbff42e2b186df912fedc9483e4a09))
* update proto definition in MsgRevokeNamespaceRoles ([14a4b30](https://github.com/InjectiveLabs/injective-ts/commit/14a4b30dd30ea02626077f0c8cf6ec43c9a40118))
* update proto definition in MsgUpdateNamespace ([d7140b8](https://github.com/InjectiveLabs/injective-ts/commit/d7140b82333f44af41e494b856c9eb287966a548))
* update proto definition in MsgUpdateNamespaceRoles ([3dcdbe4](https://github.com/InjectiveLabs/injective-ts/commit/3dcdbe4f4052aca769c490581f218a4b604a8fd1))
* update proto definition in MsgUpdateParams ([cb695c2](https://github.com/InjectiveLabs/injective-ts/commit/cb695c2293d72f08d335fe97540cf83a1e1a8e65))
* update sdk-ui-ts typings to import from sdk-ts indexer instead of exchange ([950079e](https://github.com/InjectiveLabs/injective-ts/commit/950079ea7b1703ff7ea0a4d2c8a8ae14a0bb4df7))
* updated core mito indexer proto-ts ([622c66f](https://github.com/InjectiveLabs/injective-ts/commit/622c66f6e1b4860372718cde91973f663acf84eb))
* updated std fee based on gas ([0a86900](https://github.com/InjectiveLabs/injective-ts/commit/0a869004eacfaaa2fc1b1b0567937eb948bd1c59))
* uptime percentage ([ef0a1a3](https://github.com/InjectiveLabs/injective-ts/commit/ef0a1a38e3ff48064ffacaaf23bf653695603bdb))
* value decrypt from contract ([83312ac](https://github.com/InjectiveLabs/injective-ts/commit/83312acd37b7e4786b1ac36689eaa4f7c1cc6b44))
* variable casing for MsgExec ([bc50627](https://github.com/InjectiveLabs/injective-ts/commit/bc50627e50d9313f45d2a6ead12b1e2a74c45ff0))
* version ([24f63c9](https://github.com/InjectiveLabs/injective-ts/commit/24f63c9d175507982ac77ce24e5cbce4cab96804))
* version ([222b42c](https://github.com/InjectiveLabs/injective-ts/commit/222b42ccccc65daa02739b116744331dcdfffdcc))
* versions ([b7770bf](https://github.com/InjectiveLabs/injective-ts/commit/b7770bf382619115063ecdee2a9bd39b520e70de))
* wallet issues ([a67b6fb](https://github.com/InjectiveLabs/injective-ts/commit/a67b6fb15666c2b2e9f4745b522dfc493981f918))
* window obj removed from wallet instance ([2a51b62](https://github.com/InjectiveLabs/injective-ts/commit/2a51b62eb0c6259326d275cd76b3e74c8a2a818e))
* yarn version ([b51c8d9](https://github.com/InjectiveLabs/injective-ts/commit/b51c8d907c9b15ad324f55b8efcdb12863c455f9))
* zeros in a number ([107c49f](https://github.com/InjectiveLabs/injective-ts/commit/107c49f63f0ed00ac4861b8ac173c2b022f78a64))


### Features

* abacus abstractions ([08dfc49](https://github.com/InjectiveLabs/injective-ts/commit/08dfc494c78fa3fa4bc8feda19c32ff442c63895))
* activity page pagination ([068d54e](https://github.com/InjectiveLabs/injective-ts/commit/068d54e33dd2a5df91485246b3c4732bb1eeb960))
* activity page pagination ([35dc4e3](https://github.com/InjectiveLabs/injective-ts/commit/35dc4e34235f09cb8060fc2c4932a5714e118df1))
* activity page pagination ([79e85b9](https://github.com/InjectiveLabs/injective-ts/commit/79e85b99d7ff81b4c96069c1db20777e3cc94213))
* activity page pagination ([1da66fc](https://github.com/InjectiveLabs/injective-ts/commit/1da66fcdce9698687ee6fd3fbd7e00c647e5e720))
* activity page pagination ([60e91d0](https://github.com/InjectiveLabs/injective-ts/commit/60e91d09358c6b18fa7f6e234dc750e6aeb5b420))
* activity pagination ([41f2ca2](https://github.com/InjectiveLabs/injective-ts/commit/41f2ca2c4624da8ca04155826a6f870ec8855e31))
* activity pagination ([bb91c17](https://github.com/InjectiveLabs/injective-ts/commit/bb91c17460cd313d24df8666449ef0b76cbdad2f))
* activity pagination ([a91bb5e](https://github.com/InjectiveLabs/injective-ts/commit/a91bb5e94788e423e0c803a0e503a7a97a6c8eb5))
* activity pagination - bump to indexer 1.0.5 ([a7d98a3](https://github.com/InjectiveLabs/injective-ts/commit/a7d98a33fa8afecf29f9d23c750042fe7676067e))
* activity pagination - remove duplicate code ([5c6efec](https://github.com/InjectiveLabs/injective-ts/commit/5c6efece6e7d133eddfe94872216ad435d736412))
* activity pagination - removed unused code ([9e73339](https://github.com/InjectiveLabs/injective-ts/commit/9e73339f0c1b2fa111cababd2605fd4565173787))
* activity pagination - renamed paging -> pagination ([9227787](https://github.com/InjectiveLabs/injective-ts/commit/9227787ecbc8b247516004f1bc95afab4e77f44f))
* activity pagination - use indexer instead of exchange api ([7de4dca](https://github.com/InjectiveLabs/injective-ts/commit/7de4dca9a4b9b8490710d4e80a31d4951706416c))
* activity pagination updates ([#63](https://github.com/InjectiveLabs/injective-ts/issues/63)) ([f999db1](https://github.com/InjectiveLabs/injective-ts/commit/f999db13b635a95433a91815e357d927ae793602))
* add AddressRoles fn with test and tranformer ([be65227](https://github.com/InjectiveLabs/injective-ts/commit/be65227969f4e69d21465d45800c9b2960f8814a))
* add authorization ([76b6e0a](https://github.com/InjectiveLabs/injective-ts/commit/76b6e0a88154079b56e193c6d89574da17568b0b))
* add correct EIP-712 signing support ([d11a532](https://github.com/InjectiveLabs/injective-ts/commit/d11a532789d860ca9a6184d315985e51b4fe24d0))
* add fetch multiple denoms token meta ([a73872b](https://github.com/InjectiveLabs/injective-ts/commit/a73872ba58fc139e8ff4e1e01b97ae523610a6d4))
* add fetchAddressesByRole fn with test and transformer ([b3e6bb8](https://github.com/InjectiveLabs/injective-ts/commit/b3e6bb89705a2b02f1aa1465eabaf4ed7fe23c4c))
* add fetchAllNamespaces fn with test and transformers ([0911b58](https://github.com/InjectiveLabs/injective-ts/commit/0911b588a342f0f1f5fd55be2f4eb8603c15e2e1))
* add fetchModuleParams fn with tests and transformer ([0cc3e44](https://github.com/InjectiveLabs/injective-ts/commit/0cc3e446aa7b95a18540d5b19c40f8929d04fe26))
* add fetchVouchersForAddress fn with test and transformer ([4e7e31a](https://github.com/InjectiveLabs/injective-ts/commit/4e7e31af0a14bf05d1b2382990bdf6838ade2453))
* add functionality to query on chain cosmswasm contract info ([1215b7a](https://github.com/InjectiveLabs/injective-ts/commit/1215b7a84ae3506ba1fc885d8551dfeb799f9253))
* add functionality to query on chain cosmwasm data ([7b7793a](https://github.com/InjectiveLabs/injective-ts/commit/7b7793a6e34b560831779311b462bc83fead7d12))
* add functions ([4761770](https://github.com/InjectiveLabs/injective-ts/commit/4761770454e481ae85175232423f814a1c3434b5))
* add getchNamespaceByDenom fn with test and transformer ([9544df7](https://github.com/InjectiveLabs/injective-ts/commit/9544df78a2c1c73894667ed9816ace37623b15c6))
* add grpc support for ninja api ([0445623](https://github.com/InjectiveLabs/injective-ts/commit/04456234d2efa44a692beeccaf89e38894e71081))
* add image url to validator ([1f5d893](https://github.com/InjectiveLabs/injective-ts/commit/1f5d893a8ddb726efe390de45c85ae76d102fa53))
* add index file to export permission fns ([b8c9b06](https://github.com/InjectiveLabs/injective-ts/commit/b8c9b06178de39e6acfd9aa9acf9975513a624cb))
* add mito and olp proto and refactor esm imports ([f50e172](https://github.com/InjectiveLabs/injective-ts/commit/f50e1726aa2f808f0fdb53d159c01b90c59b8449))
* add more methods in ExplorerRPC ([08b4a0a](https://github.com/InjectiveLabs/injective-ts/commit/08b4a0a6f076379bbfaee6d1f25a07ed9755cf11))
* add msg multi send ([6a494aa](https://github.com/InjectiveLabs/injective-ts/commit/6a494aa9e989134f61b9c6bd7959f314d8acc72f))
* add MsgClaimVoucher file and spec file ([c24aae2](https://github.com/InjectiveLabs/injective-ts/commit/c24aae2231925992ee6a2288b8e46a6b27978cbf))
* add MsgCreateNamespace file and spec file ([6c62089](https://github.com/InjectiveLabs/injective-ts/commit/6c6208918181018cad94e232334788a535aca653))
* add MsgDeleteNamespace file and spec file ([fd13581](https://github.com/InjectiveLabs/injective-ts/commit/fd13581eb7c140c351e25d5cf757e993081b5652))
* add msgExternalTransfer ([d9b5444](https://github.com/InjectiveLabs/injective-ts/commit/d9b5444e93bbbb323e5ad6fdb84ff00d751a6196))
* add MsgRevokeNamespaceRoles file and spec file ([0e16f25](https://github.com/InjectiveLabs/injective-ts/commit/0e16f25cd035ec95a0363ccd8fb039a288a5d71d))
* add MsgUpdateNamespace file and spec file ([3de8410](https://github.com/InjectiveLabs/injective-ts/commit/3de8410dd1d81ad1af2c13446c308116aa0594f9))
* add MsgUpdateNamespaceRoles file and spec file ([13c0dad](https://github.com/InjectiveLabs/injective-ts/commit/13c0dadb4737e24397e20952706904faf83af3f4))
* add MsgUpdateParams file and spec file ([191e2f4](https://github.com/InjectiveLabs/injective-ts/commit/191e2f40db691d1da099f2bc26a804f3863d0841))
* add permissions types ([fb1bfb0](https://github.com/InjectiveLabs/injective-ts/commit/fb1bfb0c45910bbb8d6f3940f5f48f7d8b7db36c))
* add skip & limit params ([35012a4](https://github.com/InjectiveLabs/injective-ts/commit/35012a4a88ce3e24f2e2f7cfa5fcd5da97d20964))
* add streamSpotMarket ([66e392c](https://github.com/InjectiveLabs/injective-ts/commit/66e392c5e8e8cb2a6febffb9bdac00355827f8be))
* add support for CW20 balance ([0eeb3b8](https://github.com/InjectiveLabs/injective-ts/commit/0eeb3b80c5319db10d77c31b286b69b654a155d1))
* add unit test coverage for eip712 messages ([#75](https://github.com/InjectiveLabs/injective-ts/issues/75)) ([cf7e2fd](https://github.com/InjectiveLabs/injective-ts/commit/cf7e2fde727979fcf2187385d72b96efbed6d61a))
* add unit test for remaining eip 712 messages ([#77](https://github.com/InjectiveLabs/injective-ts/issues/77)) ([2584aa0](https://github.com/InjectiveLabs/injective-ts/commit/2584aa09eb3f410f911509a23aca753ba696d773))
* added ability to pass pk as a class to MsgBroadcastWithPk ([7ab121d](https://github.com/InjectiveLabs/injective-ts/commit/7ab121dd91f60484a61b92c05b12eafaa1e7b0c1))
* added amino and proper web3 support for all msgs ([83f1857](https://github.com/InjectiveLabs/injective-ts/commit/83f1857981468ed16c2295c3f814eaa12256c7b3))
* added amino sign for Keplr ([a3fa523](https://github.com/InjectiveLabs/injective-ts/commit/a3fa523179151bceb701d0216499dc2c21480ed5))
* added bonfida sol domains ([2e67999](https://github.com/InjectiveLabs/injective-ts/commit/2e67999a91854c79c6c260493ac3d629285b2c1d))
* added context to exceptions ([ccfd06b](https://github.com/InjectiveLabs/injective-ts/commit/ccfd06b84fc1acb542e28f1d39ac251730750afa))
* added cosmos fee delegation support ([f3e2b0f](https://github.com/InjectiveLabs/injective-ts/commit/f3e2b0ff1bdea77c8b408c7fa88a32c610063000))
* added cw20transfer args ([5861fe5](https://github.com/InjectiveLabs/injective-ts/commit/5861fe5b5fdec2cf5066d49fe950bdb579aca273))
* added cw20transfer args ([0b53619](https://github.com/InjectiveLabs/injective-ts/commit/0b53619d29fe3203c9a2bdc44cb819ca42e36f4c))
* added fromBase64 init for PublicKey ([77b6104](https://github.com/InjectiveLabs/injective-ts/commit/77b610476d75096176605e6c73729e0f7163dbcc))
* added granter and fee payer to std fee ([904b973](https://github.com/InjectiveLabs/injective-ts/commit/904b97336f391552e016e7789599b2e243554688))
* added httpRestClient which handles timeout exceptions ([c200bc2](https://github.com/InjectiveLabs/injective-ts/commit/c200bc25fe67901ad80462166c5cc841449df6b8))
* added insurance funds explorer api types ([5dcf7da](https://github.com/InjectiveLabs/injective-ts/commit/5dcf7da4323546ef4e4cff064960aa59f4a67ea6))
* added messages to contract response ([59f5f5a](https://github.com/InjectiveLabs/injective-ts/commit/59f5f5a2e5ea15e9eea58a40cdc1c31852562bfb))
* added metadata ([7a1e408](https://github.com/InjectiveLabs/injective-ts/commit/7a1e408e99ea320da8bf7fef91545a73ecc15a03))
* added msg store code ([7159995](https://github.com/InjectiveLabs/injective-ts/commit/715999592efa2d912e69860cec5d7d206df1f2cc))
* added msgEditValidator and msgWithdrawValidatorCommission ([09a03a5](https://github.com/InjectiveLabs/injective-ts/commit/09a03a548035c11c571d238da90f15b047fdf96a))
* added multiple signers while creating a transaction ([c10442d](https://github.com/InjectiveLabs/injective-ts/commit/c10442d172fa49a479f2e4708c3c8a5ed7ef6e77))
* added number flooring for chain numbers ([83eafe9](https://github.com/InjectiveLabs/injective-ts/commit/83eafe901501713263fbd39aef7238001afd2467))
* added number formatters ([f13d177](https://github.com/InjectiveLabs/injective-ts/commit/f13d177c2600da39af2974318e25052ea8c63101))
* added object formatter ([6a4621a](https://github.com/InjectiveLabs/injective-ts/commit/6a4621a62ea4267c3df9de82b31798bfe1245c02))
* added rest consumer example ([aa20951](https://github.com/InjectiveLabs/injective-ts/commit/aa2095126bbfae2bd851f0417cd98144b7bcbda0))
* added support for insurance funds and custom token factory denoms ([1c82a82](https://github.com/InjectiveLabs/injective-ts/commit/1c82a824c1c1876aeb88c34088e9c95e15f4d8c0))
* added testnet old endpoints ([79358b1](https://github.com/InjectiveLabs/injective-ts/commit/79358b1ce2f775cacb8c278a58caaea90a8e98bb))
* added timestamp filtering for trades ([541554f](https://github.com/InjectiveLabs/injective-ts/commit/541554fa9ff145c3ed6e64f1bd8239a9ade6ad0b))
* added token factory token type ([ad23e66](https://github.com/InjectiveLabs/injective-ts/commit/ad23e6662cc10d721da0545368642e6a6ae0665d))
* added tradeId ([21dba26](https://github.com/InjectiveLabs/injective-ts/commit/21dba26fd094b9eb15d891ac4a7ec106d0337142))
* added tx-ts ([ae9ebc7](https://github.com/InjectiveLabs/injective-ts/commit/ae9ebc7e2c34eaf60e894cd70e6b0778e6b71bbf))
* added validator details and uptime ([b775f91](https://github.com/InjectiveLabs/injective-ts/commit/b775f919eeb652d18c37abd557d2c2a429c3ac21))
* allow multiple amounts on Msgsend ([3294e7d](https://github.com/InjectiveLabs/injective-ts/commit/3294e7dc7422636c4dc1c47075d7c667256b6a36))
* arbitrary data verification ([83e36f6](https://github.com/InjectiveLabs/injective-ts/commit/83e36f68492d69743c880d41e679f0d32abd6882))
* authz module - add MsgExec and new param MsgGrant ([#57](https://github.com/InjectiveLabs/injective-ts/issues/57)) ([3c2b103](https://github.com/InjectiveLabs/injective-ts/commit/3c2b10300828c751dd2dcc92e01729b0afa9925d))
* authz stake grants ([228e884](https://github.com/InjectiveLabs/injective-ts/commit/228e8841d7b08e6a63a47c376028883e44eaa15a))
* authz types and more methods ([6e6a1d8](https://github.com/InjectiveLabs/injective-ts/commit/6e6a1d8420a19866256c895107d67e4e1099c77b))
* baseDenom introduced ([7c8f895](https://github.com/InjectiveLabs/injective-ts/commit/7c8f89557ccf4b272b1235593ba1ad6934d23cb7))
* binary options support on the sdk ([c5f6bc8](https://github.com/InjectiveLabs/injective-ts/commit/c5f6bc8313cc48281a426f84a352f212449bbb98))
* bridge-ts initial ([4320b1c](https://github.com/InjectiveLabs/injective-ts/commit/4320b1c256b58caec7a08c33854f0bdde9681c3c))
* broadcaster used instead of provider to support metamask ([bed89c0](https://github.com/InjectiveLabs/injective-ts/commit/bed89c0bbff34e74731885f5367f7276a0706383))
* caching denom traces ([7b7f89e](https://github.com/InjectiveLabs/injective-ts/commit/7b7f89eb3e61efa22f28f707bd96038371d01c6b))
* cancelation order bitmask ([70fed5e](https://github.com/InjectiveLabs/injective-ts/commit/70fed5ee71bd3ea4b5624096e6cd73ed2d43120c))
* checksum address calc ([3b1946e](https://github.com/InjectiveLabs/injective-ts/commit/3b1946e2ebdf09c075a1a53fb4d3c1ba7b851bd2))
* cid ([b286316](https://github.com/InjectiveLabs/injective-ts/commit/b286316549a80ba64af9ba946d9166e1cd638fd7))
* commented msgReclaimLockedFunds ([316af92](https://github.com/InjectiveLabs/injective-ts/commit/316af9266cc84e57a8b0b1c48d5a1e3149b36486))
* community spend pool ([d08a04b](https://github.com/InjectiveLabs/injective-ts/commit/d08a04b1dc3610371d4f2c8c65a07b3b59f36e58))
* comsostation eth version ([a10d278](https://github.com/InjectiveLabs/injective-ts/commit/a10d27849b593b6cedec2d66e7d08e691f0a0c47))
* cosmos sdk doc convenient method ([8b8dab7](https://github.com/InjectiveLabs/injective-ts/commit/8b8dab7f25b657f4419ec916823807336548852d))
* cosmwasm map ([697422e](https://github.com/InjectiveLabs/injective-ts/commit/697422ed3608750f025b315236680a185e411b5f))
* create spot grid strategy ([a57c40b](https://github.com/InjectiveLabs/injective-ts/commit/a57c40bb58071539545fc2dae45f5f50e0fb2499))
* cw20 adapter contract args ([036fc91](https://github.com/InjectiveLabs/injective-ts/commit/036fc9186ef43bd49cc526555dba0431f63a5935))
* cw20 addr validation ([c4332e0](https://github.com/InjectiveLabs/injective-ts/commit/c4332e05cc63f0f5b3bc36797970571cf0347643))
* cw20 send args ([b36e5ed](https://github.com/InjectiveLabs/injective-ts/commit/b36e5ed5e2bfbcb5e5648c6a4257a778b3784a2a))
* cw20 send args ([22ee502](https://github.com/InjectiveLabs/injective-ts/commit/22ee502ba8c7f6af165c85db15b21f5c826aed93))
* denom async client ([72127aa](https://github.com/InjectiveLabs/injective-ts/commit/72127aa9c357e22d121c8357fb9a13471ae31744))
* denom client ([581977b](https://github.com/InjectiveLabs/injective-ts/commit/581977b7e8534fa0e80fa8b41845b38500293ca0))
* denomClientAsync ([8628f46](https://github.com/InjectiveLabs/injective-ts/commit/8628f46ea30a50d1a69899f5f791612fe3cd2f38))
* denomClientAsync ([e820eb9](https://github.com/InjectiveLabs/injective-ts/commit/e820eb93cd335358c91a8627f67521b806359b49))
* eip712 signing fix ([774b1dd](https://github.com/InjectiveLabs/injective-ts/commit/774b1ddd94062820a62fecb4a33aa4882a40bdf8))
* eip712 v2 ([8eaaeba](https://github.com/InjectiveLabs/injective-ts/commit/8eaaebabe4e715d91a56eafa55366275753d05a2))
* eip712 v2 ([e14b015](https://github.com/InjectiveLabs/injective-ts/commit/e14b015403c6b3f0b1f4d81760d3e5e06102cb36))
* eip712 verification against chain ([4fd66f7](https://github.com/InjectiveLabs/injective-ts/commit/4fd66f7ff1fc88b5e41dccd4442489748626ba24))
* enable keplr on devnet ([021a315](https://github.com/InjectiveLabs/injective-ts/commit/021a3156090398fde4b645bf3aecf5fa3a327b1c))
* enabled disabling a wallet for wallet-ts, refactored to use sync broadcasting mode ([c1dde3f](https://github.com/InjectiveLabs/injective-ts/commit/c1dde3f5efd644de194d4e50b77c8c484d11a4b9))
* ethereum native wallets optional on wallet-ts ([15300dc](https://github.com/InjectiveLabs/injective-ts/commit/15300dc2a182d7e557b5337847ba7a81977e1ce8))
* evmos fix ([6d6d46e](https://github.com/InjectiveLabs/injective-ts/commit/6d6d46e4c3ba8d8411d66f84d66e86f6c1c4c83a))
* exceptions part 2 ([1919620](https://github.com/InjectiveLabs/injective-ts/commit/191962094f9ec7036c54425e35c6aa476c70ea79))
* exchange module state ([ab8fcd2](https://github.com/InjectiveLabs/injective-ts/commit/ab8fcd28cbf6bbac4b4d524d8d3d202937c935cb))
* exec exchange contracts ([3e365ce](https://github.com/InjectiveLabs/injective-ts/commit/3e365ceda17721862dc669bdd169a86a97944be4))
* experimental support for eip712 broadcasting ([69fc77a](https://github.com/InjectiveLabs/injective-ts/commit/69fc77aa16862d88556d0d8fb560e41c99710abe))
* explorer stats api ([9fdd911](https://github.com/InjectiveLabs/injective-ts/commit/9fdd91104d2807f59d162596a96067c8c9775913))
* explorer utils and generic types for wallet provider ([b31b3ff](https://github.com/InjectiveLabs/injective-ts/commit/b31b3ff3bf27e74208cf03f10ea8fff762b0cae9))
* fee payer fetching from indexer api ([439f245](https://github.com/InjectiveLabs/injective-ts/commit/439f245e52037d0f5d06a79402cad08918c25512))
* from bytes pub key ([c7c744b](https://github.com/InjectiveLabs/injective-ts/commit/c7c744b14d9d8e5d59093ddd297592c49a901bc0))
* funds stringified ([14d262f](https://github.com/InjectiveLabs/injective-ts/commit/14d262f32b7ad5d0840e1597798ee49787f66d26))
* gas based on message ([929f117](https://github.com/InjectiveLabs/injective-ts/commit/929f117934120122286e87428707d4536e026f35))
* gas limit from simulation ([6305f0d](https://github.com/InjectiveLabs/injective-ts/commit/6305f0d62da57ae3539cd203ac8314a796679073))
* gas price fetching ([476f4e4](https://github.com/InjectiveLabs/injective-ts/commit/476f4e49f62ecdfc482ddde6789483fd09fd4fff))
* gas simulation on web3 wallets ([65e5d97](https://github.com/InjectiveLabs/injective-ts/commit/65e5d97fb2f9edcb68be85dc6d98b868a7079ff6))
* geometric sgt init ([1055590](https://github.com/InjectiveLabs/injective-ts/commit/1055590ab9b17944107c82683a860146a490fe74))
* get injective address from subaccount ([203c223](https://github.com/InjectiveLabs/injective-ts/commit/203c2235fbde30eda4f6f853394112cc7c83fe66))
* getExactDecimalsFromNumber ([07421dd](https://github.com/InjectiveLabs/injective-ts/commit/07421dd15884f4b89f677ea58da1a83f6a53b80d))
* getTensMultiplier function for handling decimals ([3b66d5d](https://github.com/InjectiveLabs/injective-ts/commit/3b66d5d8e9f608b153b11c61e0e65dad0d44041a))
* grid sc config ([91c0c86](https://github.com/InjectiveLabs/injective-ts/commit/91c0c86125ad7dee2b1d66e83c564ba65663c473))
* grpc indexer campaign api ([1a2c561](https://github.com/InjectiveLabs/injective-ts/commit/1a2c561bcd128c9a69e6b8938bfaf71bac59a93f))
* helper functions for prepping a transaction ([3c9a806](https://github.com/InjectiveLabs/injective-ts/commit/3c9a8067f18ef0cbb37e2e09f2534245f35efb82))
* helper utils for sorting object keys ([b48c598](https://github.com/InjectiveLabs/injective-ts/commit/b48c598fe90ff5ba83b930f0ec60771e86fdfb02))
* ibc gateway support for wormhole ([fbf7d96](https://github.com/InjectiveLabs/injective-ts/commit/fbf7d9600507367687ebe8bebbb00485583c79d3))
* implement grpc oracle stream for prices by markets ([e24887f](https://github.com/InjectiveLabs/injective-ts/commit/e24887f01d6fe136fe55d831930c03c09ab86b6f))
* implement retries on grpc and rest query calls ([d8c4486](https://github.com/InjectiveLabs/injective-ts/commit/d8c4486722c52a669b17ffe8875855e543f573e8))
* implemented a way to fetch grpc all records from pagination ([5b2f888](https://github.com/InjectiveLabs/injective-ts/commit/5b2f888424ab21c8db825a8c5ebcdf8775794fbc))
* indexer api bump ([76635c2](https://github.com/InjectiveLabs/injective-ts/commit/76635c2e6d725c68ed10bf47171b8a4e3bda9432))
* indexer migration ([351320b](https://github.com/InjectiveLabs/injective-ts/commit/351320b46ac7244af44728db7b67472e6b9a8105))
* indexerTradingApi - autzh api - create strategy ([ec2e1a4](https://github.com/InjectiveLabs/injective-ts/commit/ec2e1a4649cbacb1b2f25d4b0b73e9d3f6d74f8a))
* initial eip712 ([956d451](https://github.com/InjectiveLabs/injective-ts/commit/956d451f487a120395d42318aafaa2fc856e4a81))
* initial exceptions setup ([6da9f2e](https://github.com/InjectiveLabs/injective-ts/commit/6da9f2eb2df2fcd2995fc9cd25a615dc607da253))
* initial grid strategies list impl ([955ac92](https://github.com/InjectiveLabs/injective-ts/commit/955ac923e52be707fda327b4bd99060a4ea6401d))
* initial order hash manage ([3f1c9ec](https://github.com/InjectiveLabs/injective-ts/commit/3f1c9ec4276120df49b5692c34fc3295714fa36d))
* initial sdk-ui-ts and sdk-ts refactor ([fe00582](https://github.com/InjectiveLabs/injective-ts/commit/fe005820114dcfca2fe28a70f465a048550f4932))
* initial setup ledger cosmos app ([d113d86](https://github.com/InjectiveLabs/injective-ts/commit/d113d86447d53fa859c2744f9895871264930adc))
* initial sig verify for cosmos ([63a3cfc](https://github.com/InjectiveLabs/injective-ts/commit/63a3cfca6c0d1486113f54808f3a50ebd3335af1))
* inj name resolution ([ce0ce62](https://github.com/InjectiveLabs/injective-ts/commit/ce0ce6281265dabfe1ceaddf90d5c7aecd3a671f))
* integrate portfolio api ([4ba36ff](https://github.com/InjectiveLabs/injective-ts/commit/4ba36ffd01f62277f5d673495e5bd26ea26bde35))
* jest setup, msgBid unit tests ([9caa08f](https://github.com/InjectiveLabs/injective-ts/commit/9caa08f68617661dc0d675c3238bbf6592b494f4))
* keplr reclaim funds ([6f35de5](https://github.com/InjectiveLabs/injective-ts/commit/6f35de51585a87dd47d37d4a34b496b234f2f185))
* leaderboard ([f69cee4](https://github.com/InjectiveLabs/injective-ts/commit/f69cee45ca4354333056cde17c35d8537ff37fb8))
* leaderboard - restore shx & link-module-alias ([71236e2](https://github.com/InjectiveLabs/injective-ts/commit/71236e20528a5306216628be96ab022e97bf988c))
* migrated to grpcWebImpl ([bbf4e37](https://github.com/InjectiveLabs/injective-ts/commit/bbf4e3715c20cd2948b77e3be4dac45123b29859))
* minor authz utils ([72fc977](https://github.com/InjectiveLabs/injective-ts/commit/72fc977a8cca34a78a7ae9b1247c233632c28b7e))
* minor util and readme update ([9be782b](https://github.com/InjectiveLabs/injective-ts/commit/9be782bf5f085743bdb631ba601368a02abca795))
* msg multi execute ([2f67682](https://github.com/InjectiveLabs/injective-ts/commit/2f67682e030be0dc3fd7eeee87c24891ad605dd2))
* msgBatchUpdate ([7bc3787](https://github.com/InjectiveLabs/injective-ts/commit/7bc3787a4feab80ba506aaa90726e8465a77bfa6))
* MsgBroadcaster in sdk-ts ([7747ea8](https://github.com/InjectiveLabs/injective-ts/commit/7747ea8f6aaa61f9a81fde8178a10b2c48535775))
* msgBroadcaster on wallet-ts ([d06a3db](https://github.com/InjectiveLabs/injective-ts/commit/d06a3db58400577a0c4cfdf6bc2b56659fac734a))
* MsgBroadcasterLocal for broadcasting tx in a node environment ([8fd484b](https://github.com/InjectiveLabs/injective-ts/commit/8fd484b7393db1d9be90da869c4de5a7dafff479))
* msgExecuteContract add typing support ([866c605](https://github.com/InjectiveLabs/injective-ts/commit/866c6059d2f54826f4d799500274b0a1d8984b06))
* msgExecuteContractCompat ([9c63a64](https://github.com/InjectiveLabs/injective-ts/commit/9c63a645493af7077a5561f25e526a4a20d2d218))
* msgMultiExecute ([c53cb78](https://github.com/InjectiveLabs/injective-ts/commit/c53cb78ec5a4df95b376eb1a4db173e9f5336280))
* msgmultisend ([77adf6f](https://github.com/InjectiveLabs/injective-ts/commit/77adf6ff9437f23fd73c2c75fd74299978c22ddd))
* msgReclaimLockedFunds ([b6b7ce8](https://github.com/InjectiveLabs/injective-ts/commit/b6b7ce8d4c7e644623068e2f5afaedb12f102a33))
* msgSubmitGenericProposal ([d9de27b](https://github.com/InjectiveLabs/injective-ts/commit/d9de27b72d97a218f12f1cc968903b21efc0c69e))
* MsgTransfer for external chains ([96ee3de](https://github.com/InjectiveLabs/injective-ts/commit/96ee3de9e1daddd802075498b03ffdc67b57ec1f))
* msgTransferAndExecute support ([4a2c286](https://github.com/InjectiveLabs/injective-ts/commit/4a2c286b1e964b9f97fe7be0439208fe376d7d17))
* msgTransferExternal ([0ebaa6e](https://github.com/InjectiveLabs/injective-ts/commit/0ebaa6e33588f003628a5fa7ad73964b76d4b5e6))
* neptune service ([68bc897](https://github.com/InjectiveLabs/injective-ts/commit/68bc897324626bbee8b9045ca2579f3e63f01398))
* new token metadata implementation ([a285b1a](https://github.com/InjectiveLabs/injective-ts/commit/a285b1aead2f7a7806169ac78fd22c5c2e4dc4c3))
* new wallet ts ([e43b933](https://github.com/InjectiveLabs/injective-ts/commit/e43b933f8a5e6bd6c51f5e890ec0f0e61992b647))
* optimise bundle size ([03bb060](https://github.com/InjectiveLabs/injective-ts/commit/03bb060357d7b89802ec1422ccbc44841acbbeb5))
* optional orderHash ([f741e35](https://github.com/InjectiveLabs/injective-ts/commit/f741e35ce79aa80bb03d76a5caa51507962d5594))
* order history ([#64](https://github.com/InjectiveLabs/injective-ts/issues/64)) ([d86021a](https://github.com/InjectiveLabs/injective-ts/commit/d86021a64228e10e6cd72f97109a114fd698a3ca))
* order history ([#65](https://github.com/InjectiveLabs/injective-ts/issues/65)) ([c179735](https://github.com/InjectiveLabs/injective-ts/commit/c179735d5b3f7168a017073720721332e44319cb))
* order history ([#68](https://github.com/InjectiveLabs/injective-ts/issues/68)) ([9e431a7](https://github.com/InjectiveLabs/injective-ts/commit/9e431a73f3f89dae4a295f4b6a77c6efbafee9ea))
* order history ([#69](https://github.com/InjectiveLabs/injective-ts/issues/69)) ([6bd506e](https://github.com/InjectiveLabs/injective-ts/commit/6bd506e24dbc549ebe921dacc7d8af68928ce372))
* order history ([#70](https://github.com/InjectiveLabs/injective-ts/issues/70)) ([74dcc0f](https://github.com/InjectiveLabs/injective-ts/commit/74dcc0f1373c3cc13934cee8b70095df17032cb4))
* order history stream ([#72](https://github.com/InjectiveLabs/injective-ts/issues/72)) ([4a1f6cd](https://github.com/InjectiveLabs/injective-ts/commit/4a1f6cd68d081bc74574b08c1a65239d8a2e6d4a))
* order history updates ([#67](https://github.com/InjectiveLabs/injective-ts/issues/67)) ([43d8472](https://github.com/InjectiveLabs/injective-ts/commit/43d84721c97fa964ef61eece8e60bcbcdd26f999))
* orderbook v2 ([889689d](https://github.com/InjectiveLabs/injective-ts/commit/889689d4939ace5b1e6396e6c91c795686e36a13))
* pagination for binary options markets ([e9ce348](https://github.com/InjectiveLabs/injective-ts/commit/e9ce3489bb20b118ecb7d2ff7d3aabb0415bad4b))
* path updated for wasmx ([2bebb9d](https://github.com/InjectiveLabs/injective-ts/commit/2bebb9d02999f2b7a1be6494c353d0650475cfdf))
* path updated for wasmx ([36b594a](https://github.com/InjectiveLabs/injective-ts/commit/36b594a4465227e01ec60d3caae226fe03c3ab1b))
* pgt and contract queries ([a9698f6](https://github.com/InjectiveLabs/injective-ts/commit/a9698f6ccc60801241c9a61330a7bf6dddc062c7))
* pgt init ([063551f](https://github.com/InjectiveLabs/injective-ts/commit/063551f55b9a9326a7741cd501612ffbcde4229e))
* portfolio balance request ([ec22208](https://github.com/InjectiveLabs/injective-ts/commit/ec222084e4c99b268c4fd719438fcbf528c062d6))
* positions v2 ([552c522](https://github.com/InjectiveLabs/injective-ts/commit/552c522892d58a0f3bbcd65302f9563e8c13df68))
* proposal decomposer ([cf63bc0](https://github.com/InjectiveLabs/injective-ts/commit/cf63bc0fa2aae144c4f1bdffd3c6bc7ecb55c41d))
* querier active stake delegation ([564335d](https://github.com/InjectiveLabs/injective-ts/commit/564335d12df0e8b5ba7d8b4cf1fe403cdf5d850c))
* redeem from sdk-ts not wormhole-sdk ([6492495](https://github.com/InjectiveLabs/injective-ts/commit/64924954d2e635c0d0098594ff18191beca300f5))
* remove gst strategy ([0c11071](https://github.com/InjectiveLabs/injective-ts/commit/0c110718956701080e4adb84ebb1f3d24b8f5b06))
* removed numbers converters from utils ([36b7bcf](https://github.com/InjectiveLabs/injective-ts/commit/36b7bcf8ec7eb5ea8a815e4a808ddd0494565735))
* response transformers ([b72ce57](https://github.com/InjectiveLabs/injective-ts/commit/b72ce575d5f613a92ad9dd49748a88f220d05bf5))
* rest endpoints decoupling ([cba0e1a](https://github.com/InjectiveLabs/injective-ts/commit/cba0e1a62ee4e24ceb4f749411618112ec0f961b))
* retries on mempool full ([309317a](https://github.com/InjectiveLabs/injective-ts/commit/309317a4be674c0538474ed5cac49b007b764e7d))
* retry on broadcast ([6aaed21](https://github.com/InjectiveLabs/injective-ts/commit/6aaed216e433260f0e2b5683d52b364bf8824db1))
* rounds api ([d4da4d4](https://github.com/InjectiveLabs/injective-ts/commit/d4da4d423a37ce3bb75f6a40dbbaadfcebdf35e9))
* sc search ([778ee05](https://github.com/InjectiveLabs/injective-ts/commit/778ee05b762ee476bf57500d4c582dd4a42a69d0))
* sdk-ts initial ([1d2ef9b](https://github.com/InjectiveLabs/injective-ts/commit/1d2ef9bdd02e3684162374479324ee9dc1f896b5))
* sdk-ui-ts ([4c8f902](https://github.com/InjectiveLabs/injective-ts/commit/4c8f90262b0d7cf2df3038c23fda4a9e83bb8c6a))
* sepholia migration ([2b7823b](https://github.com/InjectiveLabs/injective-ts/commit/2b7823bed6d8ddd2faa979dc71d7360d40e7630d))
* setup indexer grpc account portfolio api and stream ([72d7d85](https://github.com/InjectiveLabs/injective-ts/commit/72d7d85e66e2932b60b3e6215d5cda11b036e6a5))
* simulating fee on ethereum wallets ([5ff04e6](https://github.com/InjectiveLabs/injective-ts/commit/5ff04e645cb41fbc09d823bf4a52778387ffe925))
* spl tokens transfer ([bc78a26](https://github.com/InjectiveLabs/injective-ts/commit/bc78a26f89245813eb88453648799f990b5807b9))
* token service for cw20 balances ([4850924](https://github.com/InjectiveLabs/injective-ts/commit/4850924e3caa7499eef86d794f31681120d5e7f7))
* trading strategies stats api ([cfc1699](https://github.com/InjectiveLabs/injective-ts/commit/cfc1699f68ba77a2ef2d615d69821fccfc68782e))
* trailing spot sgt ([9b77594](https://github.com/InjectiveLabs/injective-ts/commit/9b775944bd8e2e52e9a2a741178739bef68eb8d9))
* transaction error handling ([d0bc738](https://github.com/InjectiveLabs/injective-ts/commit/d0bc738ab4b99248b81e3387dba5914974ae0c17))
* tx filters ([1b48cd8](https://github.com/InjectiveLabs/injective-ts/commit/1b48cd81bffe85ee8556826274d9eb92eb67fb1d))
* tx response now returned instead of the txhash only ([7959791](https://github.com/InjectiveLabs/injective-ts/commit/7959791eb86a81eb32b6b10411ad503deb9bdd07))
* txClient ([efab6c8](https://github.com/InjectiveLabs/injective-ts/commit/efab6c80190b44620cdce8aa20fed4fef213de79))
* unified tx clients ([e404930](https://github.com/InjectiveLabs/injective-ts/commit/e404930c4fe095972c135bd982d7287cdd19dddd))
* update mito indexer vesion ([96c0a35](https://github.com/InjectiveLabs/injective-ts/commit/96c0a35e3f1481e58f492b58cfaabc2ccde6bf29))
* update oracle price stream ([2c8de1b](https://github.com/InjectiveLabs/injective-ts/commit/2c8de1bd1c81a997b56f38260d9f54c70b2814bc))
* update order object ([2857701](https://github.com/InjectiveLabs/injective-ts/commit/2857701d89c94db9e2377e4efc7f970bdb58fb0c))
* update supernova folder structure ([a220ecd](https://github.com/InjectiveLabs/injective-ts/commit/a220ecd97f94819ce839ac03facfa1a3c98f5b51))
* updated docs ([7c38c6d](https://github.com/InjectiveLabs/injective-ts/commit/7c38c6def49ee6064e14cd6acefa783013219e2c))
* utils for token metadata and networks ([271ac4c](https://github.com/InjectiveLabs/injective-ts/commit/271ac4c165ee5899b01b714d75a5b2335c934d1f))
* verify sig and pk wallet strategy ([d3a4794](https://github.com/InjectiveLabs/injective-ts/commit/d3a4794720a51529167680eee54bb6c0f751ebc0))
* verify signature on pk ([85f4a0e](https://github.com/InjectiveLabs/injective-ts/commit/85f4a0e807bb313e2eb0196d812f2fac775fe620))
* wasm code grpc queries ([91e618d](https://github.com/InjectiveLabs/injective-ts/commit/91e618de8c83e58052cbebe6bc4bd3ed5d826ff5))
* wasm messages ([3773c39](https://github.com/InjectiveLabs/injective-ts/commit/3773c39d8e61c70eec3f14683240a7f787fdd70e))
* web3 client ([8f286b2](https://github.com/InjectiveLabs/injective-ts/commit/8f286b2b42d0955ecf7cc74344f4bf28e2409e0b))
* wh gateway and new tokens ([d36f586](https://github.com/InjectiveLabs/injective-ts/commit/d36f58621a359c1c1bb69a4f78f513c346eb5c47))
* wormhole gw ([1253e57](https://github.com/InjectiveLabs/injective-ts/commit/1253e57341ecae8da67e4132957b7d8dc21a65f4))
* wormhole mainnet ([600926f](https://github.com/InjectiveLabs/injective-ts/commit/600926f6e14724cfcd1d78cc0789bca15a51426a))
* wormhole redeem flow ([5509b49](https://github.com/InjectiveLabs/injective-ts/commit/5509b4978dc7d8e8c5e34b4e8c03c07f4dc34afb))


### Reverts

* Revert "chore: added cid" ([30af4a2](https://github.com/InjectiveLabs/injective-ts/commit/30af4a22d00a04d0378fdcd0dd83cd8dc63646a0))
* Revert "chore: update sdk-ts with latest indexer protos" ([fcb9d33](https://github.com/InjectiveLabs/injective-ts/commit/fcb9d33cc66211df368b25fc71b5c0627ee2d4eb))
* faulty version ([6e25b3f](https://github.com/InjectiveLabs/injective-ts/commit/6e25b3f156d964666db8bc7885df653166aac523))





## [1.14.33](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.33-beta.4...@injectivelabs/sdk-ts@1.14.33) (2024-11-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts





## [1.14.32](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.31...@injectivelabs/sdk-ts@1.14.32) (2024-11-25)

**Note:** Version bump only for package @injectivelabs/sdk-ts





## [1.14.31](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.30...@injectivelabs/sdk-ts@1.14.31) (2024-11-25)


### Bug Fixes

* import ([cfc70ec](https://github.com/InjectiveLabs/injective-ts/commit/cfc70ec11fba9e40867e554a18219055842ea6af))





## [1.14.30](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.22...@injectivelabs/sdk-ts@1.14.30) (2024-11-25)


### Bug Fixes

* version ([24f63c9](https://github.com/InjectiveLabs/injective-ts/commit/24f63c9d175507982ac77ce24e5cbce4cab96804))





## [1.14.22](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.21...@injectivelabs/sdk-ts@1.14.22) (2024-11-25)


### Bug Fixes

* import js missing ([01835b4](https://github.com/InjectiveLabs/injective-ts/commit/01835b4cb631b7b5778f77bf44c60dd4d0be18ac))





## [1.14.21](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.20...@injectivelabs/sdk-ts@1.14.21) (2024-11-25)


### Bug Fixes

* esm import grpc-web ([3cf209f](https://github.com/InjectiveLabs/injective-ts/commit/3cf209f121ca439d025a6cbe6e3d541c1934f27a))





## [1.14.20](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.20-beta.4...@injectivelabs/sdk-ts@1.14.20) (2024-11-25)


### Features

* add authorization ([76b6e0a](https://github.com/InjectiveLabs/injective-ts/commit/76b6e0a88154079b56e193c6d89574da17568b0b))





## [1.14.19](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.18...@injectivelabs/sdk-ts@1.14.19) (2024-11-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts





## [1.14.18](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.17...@injectivelabs/sdk-ts@1.14.18) (2024-11-11)


### Features

* add mito and olp proto and refactor esm imports ([f50e172](https://github.com/InjectiveLabs/injective-ts/commit/f50e1726aa2f808f0fdb53d159c01b90c59b8449))





## [1.14.17](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.17-beta.6...@injectivelabs/sdk-ts@1.14.17) (2024-11-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts





## [1.14.16](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.16-beta.0...@injectivelabs/sdk-ts@1.14.16) (2024-10-29)


### Bug Fixes

* imports ([877486d](https://github.com/InjectiveLabs/injective-ts/commit/877486d027440d54d043f5b3b8f8a6f45be6521e))
* imports ([8c7ef36](https://github.com/InjectiveLabs/injective-ts/commit/8c7ef3689b4016b9eab83f5914255933f59bec4a))





## [1.14.15](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.15-beta.10...@injectivelabs/sdk-ts@1.14.15) (2024-10-29)


### Bug Fixes

* add ethereumAddress from wallet ([5f27985](https://github.com/InjectiveLabs/injective-ts/commit/5f27985a3512fbab3f5c0a7defc7989dac6646dc))





## [1.14.14](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.14-beta.22...@injectivelabs/sdk-ts@1.14.14) (2024-09-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.13](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.13-beta.5...@injectivelabs/sdk-ts@1.14.13) (2024-07-02)

### Bug Fixes

- actual block time ([f31d2df](https://github.com/InjectiveLabs/injective-ts/commit/f31d2dfe8f03f66108793a05bdee8968ab723eda))

## [1.14.12](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.12-beta.7...@injectivelabs/sdk-ts@1.14.12) (2024-06-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.11](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.11-beta.88...@injectivelabs/sdk-ts@1.14.11) (2024-06-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.10](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.8...@injectivelabs/sdk-ts@1.14.10) (2024-03-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.8](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.7...@injectivelabs/sdk-ts@1.14.8) (2024-03-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.7](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.7-beta.2...@injectivelabs/sdk-ts@1.14.7) (2024-03-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.7-beta.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.7-beta.0...@injectivelabs/sdk-ts@1.14.7-beta.1) (2024-03-02)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.6](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.6-beta.58...@injectivelabs/sdk-ts@1.14.6) (2024-03-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.5](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.5-beta.67...@injectivelabs/sdk-ts@1.14.5) (2024-01-11)

### Features

- cid ([b286316](https://github.com/InjectiveLabs/injective-ts/commit/b286316549a80ba64af9ba946d9166e1cd638fd7))

## [1.14.4](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.4-beta.3...@injectivelabs/sdk-ts@1.14.4) (2023-11-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.3](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.3-beta.22...@injectivelabs/sdk-ts@1.14.3) (2023-11-17)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.2-beta.13...@injectivelabs/sdk-ts@1.14.2) (2023-11-07)

### Reverts

- faulty version ([6e25b3f](https://github.com/InjectiveLabs/injective-ts/commit/6e25b3f156d964666db8bc7885df653166aac523))

## [1.14.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.1-beta.24...@injectivelabs/sdk-ts@1.14.1) (2023-10-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.1-beta.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.1-beta.1...@injectivelabs/sdk-ts@1.14.1-beta.2) (2023-09-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.1-beta.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.1-beta.0...@injectivelabs/sdk-ts@1.14.1-beta.1) (2023-09-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.14.1-beta.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.0-beta.1...@injectivelabs/sdk-ts@1.14.1-beta.0) (2023-09-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.14.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.0-beta.1...@injectivelabs/sdk-ts@1.14.0) (2023-09-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.14.0-beta.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.14.0-beta.0...@injectivelabs/sdk-ts@1.14.0-beta.1) (2023-09-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.14.0-beta.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.13.1-beta.2...@injectivelabs/sdk-ts@1.14.0-beta.0) (2023-09-22)

### Features

- cw20 addr validation ([c4332e0](https://github.com/InjectiveLabs/injective-ts/commit/c4332e05cc63f0f5b3bc36797970571cf0347643))

## [1.13.1-beta.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.13.1-beta.1...@injectivelabs/sdk-ts@1.13.1-beta.2) (2023-09-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.13.1-beta.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.13.1-beta.0...@injectivelabs/sdk-ts@1.13.1-beta.1) (2023-09-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.13.1-beta.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.13.0...@injectivelabs/sdk-ts@1.13.1-beta.0) (2023-09-22)

### Bug Fixes

- bind ([f18ae29](https://github.com/InjectiveLabs/injective-ts/commit/f18ae29b91cd23f63171760d59fa5eadf440f895))

# [1.13.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.13.0-beta.3...@injectivelabs/sdk-ts@1.13.0) (2023-09-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.13.0-beta.3](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.13.0-beta.2...@injectivelabs/sdk-ts@1.13.0-beta.3) (2023-09-22)

### Features

- implemented a way to fetch grpc all records from pagination ([5b2f888](https://github.com/InjectiveLabs/injective-ts/commit/5b2f888424ab21c8db825a8c5ebcdf8775794fbc))

# [1.13.0-beta.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.13.0-beta.1...@injectivelabs/sdk-ts@1.13.0-beta.2) (2023-09-21)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.13.0-beta.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.13.0-beta.0...@injectivelabs/sdk-ts@1.13.0-beta.1) (2023-09-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.13.0-beta.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.15...@injectivelabs/sdk-ts@1.13.0-beta.0) (2023-09-20)

### Bug Fixes

- fix issues ([47c9000](https://github.com/InjectiveLabs/injective-ts/commit/47c9000481f8c38c4d08cb343cb98fd586a5390a))
- minor ([b29ec24](https://github.com/InjectiveLabs/injective-ts/commit/b29ec24c91d103ad0f18f97fff1bf5c9bb5c3359))

### Features

- inj name resolution ([ce0ce62](https://github.com/InjectiveLabs/injective-ts/commit/ce0ce6281265dabfe1ceaddf90d5c7aecd3a671f))

## [1.12.2-beta.15](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.14...@injectivelabs/sdk-ts@1.12.2-beta.15) (2023-09-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.14](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.13...@injectivelabs/sdk-ts@1.12.2-beta.14) (2023-09-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.13](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.12...@injectivelabs/sdk-ts@1.12.2-beta.13) (2023-09-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.12](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.11...@injectivelabs/sdk-ts@1.12.2-beta.12) (2023-09-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.11](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.10...@injectivelabs/sdk-ts@1.12.2-beta.11) (2023-09-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.10](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.9...@injectivelabs/sdk-ts@1.12.2-beta.10) (2023-09-12)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.9](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.8...@injectivelabs/sdk-ts@1.12.2-beta.9) (2023-09-08)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.8](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.7...@injectivelabs/sdk-ts@1.12.2-beta.8) (2023-09-07)

### Bug Fixes

- minor ([2dee193](https://github.com/InjectiveLabs/injective-ts/commit/2dee193534ddd50de1281d7aed616876fc56932f))

## [1.12.2-beta.7](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.6...@injectivelabs/sdk-ts@1.12.2-beta.7) (2023-09-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.6](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.5...@injectivelabs/sdk-ts@1.12.2-beta.6) (2023-09-05)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.5](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.4...@injectivelabs/sdk-ts@1.12.2-beta.5) (2023-09-05)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.4](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.3...@injectivelabs/sdk-ts@1.12.2-beta.4) (2023-09-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.3](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.2...@injectivelabs/sdk-ts@1.12.2-beta.3) (2023-09-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.1...@injectivelabs/sdk-ts@1.12.2-beta.2) (2023-09-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.2-beta.0...@injectivelabs/sdk-ts@1.12.2-beta.1) (2023-09-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.2-beta.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.1...@injectivelabs/sdk-ts@1.12.2-beta.0) (2023-09-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.12.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0...@injectivelabs/sdk-ts@1.12.1) (2023-08-31)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.89...@injectivelabs/sdk-ts@1.12.0) (2023-08-31)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.89](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.88...@injectivelabs/sdk-ts@1.12.0-beta.89) (2023-08-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.88](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.87...@injectivelabs/sdk-ts@1.12.0-beta.88) (2023-08-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.87](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.86...@injectivelabs/sdk-ts@1.12.0-beta.87) (2023-08-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.86](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.85...@injectivelabs/sdk-ts@1.12.0-beta.86) (2023-08-25)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.85](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.84...@injectivelabs/sdk-ts@1.12.0-beta.85) (2023-08-25)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.84](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.83...@injectivelabs/sdk-ts@1.12.0-beta.84) (2023-08-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.83](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.82...@injectivelabs/sdk-ts@1.12.0-beta.83) (2023-08-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.82](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.81...@injectivelabs/sdk-ts@1.12.0-beta.82) (2023-08-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.81](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.80...@injectivelabs/sdk-ts@1.12.0-beta.81) (2023-08-21)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.80](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.79...@injectivelabs/sdk-ts@1.12.0-beta.80) (2023-08-21)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.79](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.78...@injectivelabs/sdk-ts@1.12.0-beta.79) (2023-08-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.78](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.77...@injectivelabs/sdk-ts@1.12.0-beta.78) (2023-08-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.77](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.76...@injectivelabs/sdk-ts@1.12.0-beta.77) (2023-08-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.76](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.75...@injectivelabs/sdk-ts@1.12.0-beta.76) (2023-08-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.75](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.74...@injectivelabs/sdk-ts@1.12.0-beta.75) (2023-08-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.74](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.73...@injectivelabs/sdk-ts@1.12.0-beta.74) (2023-08-14)

### Features

- remove gst strategy ([0c11071](https://github.com/InjectiveLabs/injective-ts/commit/0c110718956701080e4adb84ebb1f3d24b8f5b06))

# [1.12.0-beta.73](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.72...@injectivelabs/sdk-ts@1.12.0-beta.73) (2023-08-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.72](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.71...@injectivelabs/sdk-ts@1.12.0-beta.72) (2023-08-10)

### Bug Fixes

- export utils ([9e3d07c](https://github.com/InjectiveLabs/injective-ts/commit/9e3d07c1d32825ba89a2b57f1e460e16f899592e))

# [1.12.0-beta.71](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.70...@injectivelabs/sdk-ts@1.12.0-beta.71) (2023-08-10)

### Features

- minor authz utils ([72fc977](https://github.com/InjectiveLabs/injective-ts/commit/72fc977a8cca34a78a7ae9b1247c233632c28b7e))

# [1.12.0-beta.70](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.69...@injectivelabs/sdk-ts@1.12.0-beta.70) (2023-08-10)

### Bug Fixes

- mapping of grantAuthorization ([58d1310](https://github.com/InjectiveLabs/injective-ts/commit/58d1310895c2a6abdd19fc9a8e651708d570ff55))
- msgGrant web3 ([9e0eb14](https://github.com/InjectiveLabs/injective-ts/commit/9e0eb14be27d89b67e8d18520956e04d3d68cd92))
- type export ([70995ef](https://github.com/InjectiveLabs/injective-ts/commit/70995ef0a64e921674b91a0cfd16b679c7d5b327))

### Features

- authz types and more methods ([6e6a1d8](https://github.com/InjectiveLabs/injective-ts/commit/6e6a1d8420a19866256c895107d67e4e1099c77b))
- create spot grid strategy ([a57c40b](https://github.com/InjectiveLabs/injective-ts/commit/a57c40bb58071539545fc2dae45f5f50e0fb2499))
- indexerTradingApi - autzh api - create strategy ([ec2e1a4](https://github.com/InjectiveLabs/injective-ts/commit/ec2e1a4649cbacb1b2f25d4b0b73e9d3f6d74f8a))

# [1.12.0-beta.69](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.68...@injectivelabs/sdk-ts@1.12.0-beta.69) (2023-08-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.68](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.67...@injectivelabs/sdk-ts@1.12.0-beta.68) (2023-08-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.67](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.66...@injectivelabs/sdk-ts@1.12.0-beta.67) (2023-08-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.66](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.65...@injectivelabs/sdk-ts@1.12.0-beta.66) (2023-08-08)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.65](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.64...@injectivelabs/sdk-ts@1.12.0-beta.65) (2023-08-06)

### Features

- initial grid strategies list impl ([955ac92](https://github.com/InjectiveLabs/injective-ts/commit/955ac923e52be707fda327b4bd99060a4ea6401d))

# [1.12.0-beta.64](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.63...@injectivelabs/sdk-ts@1.12.0-beta.64) (2023-08-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.63](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.62...@injectivelabs/sdk-ts@1.12.0-beta.63) (2023-08-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.62](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.61...@injectivelabs/sdk-ts@1.12.0-beta.62) (2023-08-02)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.61](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.60...@injectivelabs/sdk-ts@1.12.0-beta.61) (2023-08-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.60](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.59...@injectivelabs/sdk-ts@1.12.0-beta.60) (2023-08-01)

### Features

- add image url to validator ([1f5d893](https://github.com/InjectiveLabs/injective-ts/commit/1f5d893a8ddb726efe390de45c85ae76d102fa53))

# [1.12.0-beta.59](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.58...@injectivelabs/sdk-ts@1.12.0-beta.59) (2023-08-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.58](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.57...@injectivelabs/sdk-ts@1.12.0-beta.58) (2023-07-31)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.57](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.56...@injectivelabs/sdk-ts@1.12.0-beta.57) (2023-07-31)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.56](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.55...@injectivelabs/sdk-ts@1.12.0-beta.56) (2023-07-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.55](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.54...@injectivelabs/sdk-ts@1.12.0-beta.55) (2023-07-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.54](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.53...@injectivelabs/sdk-ts@1.12.0-beta.54) (2023-07-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.53](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.52...@injectivelabs/sdk-ts@1.12.0-beta.53) (2023-07-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.52](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.51...@injectivelabs/sdk-ts@1.12.0-beta.52) (2023-07-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.51](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.50...@injectivelabs/sdk-ts@1.12.0-beta.51) (2023-07-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.50](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.49...@injectivelabs/sdk-ts@1.12.0-beta.50) (2023-07-27)

### Features

- add fetch multiple denoms token meta ([a73872b](https://github.com/InjectiveLabs/injective-ts/commit/a73872ba58fc139e8ff4e1e01b97ae523610a6d4))

# [1.12.0-beta.49](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.48...@injectivelabs/sdk-ts@1.12.0-beta.49) (2023-07-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.48](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.47...@injectivelabs/sdk-ts@1.12.0-beta.48) (2023-07-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.47](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.46...@injectivelabs/sdk-ts@1.12.0-beta.47) (2023-07-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.46](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.45...@injectivelabs/sdk-ts@1.12.0-beta.46) (2023-07-26)

### Bug Fixes

- broadcasting sync mode on web3gw ([3075246](https://github.com/InjectiveLabs/injective-ts/commit/3075246a17d58bd51594f1882112630f35601ac9))

# [1.12.0-beta.45](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.44...@injectivelabs/sdk-ts@1.12.0-beta.45) (2023-07-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.44](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.43...@injectivelabs/sdk-ts@1.12.0-beta.44) (2023-07-21)

### Features

- denomClientAsync ([8628f46](https://github.com/InjectiveLabs/injective-ts/commit/8628f46ea30a50d1a69899f5f791612fe3cd2f38))

# [1.12.0-beta.43](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.42...@injectivelabs/sdk-ts@1.12.0-beta.43) (2023-07-21)

### Features

- added support for insurance funds and custom token factory denoms ([1c82a82](https://github.com/InjectiveLabs/injective-ts/commit/1c82a824c1c1876aeb88c34088e9c95e15f4d8c0))

# [1.12.0-beta.42](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.41...@injectivelabs/sdk-ts@1.12.0-beta.42) (2023-07-21)

### Features

- denom async client ([72127aa](https://github.com/InjectiveLabs/injective-ts/commit/72127aa9c357e22d121c8357fb9a13471ae31744))

# [1.12.0-beta.41](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.40...@injectivelabs/sdk-ts@1.12.0-beta.41) (2023-07-19)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.40](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.39...@injectivelabs/sdk-ts@1.12.0-beta.40) (2023-07-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.39](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.38...@injectivelabs/sdk-ts@1.12.0-beta.39) (2023-07-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.38](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.37...@injectivelabs/sdk-ts@1.12.0-beta.38) (2023-07-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.37](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.36...@injectivelabs/sdk-ts@1.12.0-beta.37) (2023-07-17)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.36](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.35...@injectivelabs/sdk-ts@1.12.0-beta.36) (2023-07-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.35](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.34...@injectivelabs/sdk-ts@1.12.0-beta.35) (2023-07-14)

### Features

- allow multiple amounts on Msgsend ([3294e7d](https://github.com/InjectiveLabs/injective-ts/commit/3294e7dc7422636c4dc1c47075d7c667256b6a36))

# [1.12.0-beta.34](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.33...@injectivelabs/sdk-ts@1.12.0-beta.34) (2023-07-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.33](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.32...@injectivelabs/sdk-ts@1.12.0-beta.33) (2023-07-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.32](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.31...@injectivelabs/sdk-ts@1.12.0-beta.32) (2023-07-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.31](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.30...@injectivelabs/sdk-ts@1.12.0-beta.31) (2023-07-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.30](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.29...@injectivelabs/sdk-ts@1.12.0-beta.30) (2023-07-02)

### Features

- community spend pool ([d08a04b](https://github.com/InjectiveLabs/injective-ts/commit/d08a04b1dc3610371d4f2c8c65a07b3b59f36e58))

# [1.12.0-beta.29](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.28...@injectivelabs/sdk-ts@1.12.0-beta.29) (2023-06-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.28](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.27...@injectivelabs/sdk-ts@1.12.0-beta.28) (2023-06-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.27](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.26...@injectivelabs/sdk-ts@1.12.0-beta.27) (2023-06-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.26](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.25...@injectivelabs/sdk-ts@1.12.0-beta.26) (2023-06-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.25](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.24...@injectivelabs/sdk-ts@1.12.0-beta.25) (2023-06-22)

### Bug Fixes

- std fee minor ([a4bfdbf](https://github.com/InjectiveLabs/injective-ts/commit/a4bfdbf907a71501348012b6ccec6e430beb18ff))

# [1.12.0-beta.24](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.23...@injectivelabs/sdk-ts@1.12.0-beta.24) (2023-06-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.23](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.22...@injectivelabs/sdk-ts@1.12.0-beta.23) (2023-06-21)

### Features

- added granter and fee payer to std fee ([904b973](https://github.com/InjectiveLabs/injective-ts/commit/904b97336f391552e016e7789599b2e243554688))

# [1.12.0-beta.22](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.21...@injectivelabs/sdk-ts@1.12.0-beta.22) (2023-06-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.21](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.20...@injectivelabs/sdk-ts@1.12.0-beta.21) (2023-06-19)

### Features

- sc search ([778ee05](https://github.com/InjectiveLabs/injective-ts/commit/778ee05b762ee476bf57500d4c582dd4a42a69d0))

# [1.12.0-beta.20](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.19...@injectivelabs/sdk-ts@1.12.0-beta.20) (2023-06-19)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.19](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.18...@injectivelabs/sdk-ts@1.12.0-beta.19) (2023-06-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.18](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.17...@injectivelabs/sdk-ts@1.12.0-beta.18) (2023-06-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.17](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.16...@injectivelabs/sdk-ts@1.12.0-beta.17) (2023-06-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.16](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.15...@injectivelabs/sdk-ts@1.12.0-beta.16) (2023-06-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.15](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.14...@injectivelabs/sdk-ts@1.12.0-beta.15) (2023-06-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.14](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.13...@injectivelabs/sdk-ts@1.12.0-beta.14) (2023-06-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.13](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.12...@injectivelabs/sdk-ts@1.12.0-beta.13) (2023-06-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.12](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.11...@injectivelabs/sdk-ts@1.12.0-beta.12) (2023-06-12)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.11](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.10...@injectivelabs/sdk-ts@1.12.0-beta.11) (2023-06-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.10](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.9...@injectivelabs/sdk-ts@1.12.0-beta.10) (2023-06-11)

### Bug Fixes

- msg parsing ([588d97e](https://github.com/InjectiveLabs/injective-ts/commit/588d97e75118be278b980c6655511ac7f0bab66c))

# [1.12.0-beta.9](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.8...@injectivelabs/sdk-ts@1.12.0-beta.9) (2023-06-08)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.8](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.7...@injectivelabs/sdk-ts@1.12.0-beta.8) (2023-06-08)

### Features

- wormhole redeem flow ([5509b49](https://github.com/InjectiveLabs/injective-ts/commit/5509b4978dc7d8e8c5e34b4e8c03c07f4dc34afb))

# [1.12.0-beta.7](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.6...@injectivelabs/sdk-ts@1.12.0-beta.7) (2023-06-05)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.6](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.5...@injectivelabs/sdk-ts@1.12.0-beta.6) (2023-06-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.5](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.4...@injectivelabs/sdk-ts@1.12.0-beta.5) (2023-05-31)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.4](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.3...@injectivelabs/sdk-ts@1.12.0-beta.4) (2023-05-31)

### Bug Fixes

- typing ([d96c26a](https://github.com/InjectiveLabs/injective-ts/commit/d96c26a74147833dbcadb59ddc0898c971aea260))

# [1.12.0-beta.3](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.2...@injectivelabs/sdk-ts@1.12.0-beta.3) (2023-05-31)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.12.0-beta.1...@injectivelabs/sdk-ts@1.12.0-beta.2) (2023-05-31)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.12.0-beta.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.2-beta.0...@injectivelabs/sdk-ts@1.12.0-beta.1) (2023-05-31)

### Bug Fixes

- versions ([b7770bf](https://github.com/InjectiveLabs/injective-ts/commit/b7770bf382619115063ecdee2a9bd39b520e70de))

## [1.11.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.1-beta.2...@injectivelabs/sdk-ts@1.11.1) (2023-05-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.11.1-beta.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.1-beta.1...@injectivelabs/sdk-ts@1.11.1-beta.2) (2023-05-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.11.1-beta.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.1-beta.0...@injectivelabs/sdk-ts@1.11.1-beta.1) (2023-05-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.11.1-beta.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.23...@injectivelabs/sdk-ts@1.11.1-beta.0) (2023-05-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.23...@injectivelabs/sdk-ts@1.11.0) (2023-05-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.23](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.22...@injectivelabs/sdk-ts@1.11.0-beta.23) (2023-05-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.22](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.21...@injectivelabs/sdk-ts@1.11.0-beta.22) (2023-05-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.21](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.20...@injectivelabs/sdk-ts@1.11.0-beta.21) (2023-05-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.20](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.19...@injectivelabs/sdk-ts@1.11.0-beta.20) (2023-05-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.19](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.18...@injectivelabs/sdk-ts@1.11.0-beta.19) (2023-05-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.18](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.17...@injectivelabs/sdk-ts@1.11.0-beta.18) (2023-05-28)

### Bug Fixes

- package version ([f861fbf](https://github.com/InjectiveLabs/injective-ts/commit/f861fbf21f5f78d1b840930a67b05c578087a3b8))

# [1.11.0-beta.17](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.16...@injectivelabs/sdk-ts@1.11.0-beta.17) (2023-05-28)

### Bug Fixes

- change log ([e039b61](https://github.com/InjectiveLabs/injective-ts/commit/e039b6173a1037bafb026c71f82cb08a073fad6a))

# [1.11.0-beta.16](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.15...@injectivelabs/sdk-ts@1.11.0-beta.16) (2023-05-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.15](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.14...@injectivelabs/sdk-ts@1.11.0-beta.15) (2023-05-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.14](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.13...@injectivelabs/sdk-ts@1.11.0-beta.14) (2023-05-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.13](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.12...@injectivelabs/sdk-ts@1.11.0-beta.13) (2023-05-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.12](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.11...@injectivelabs/sdk-ts@1.11.0-beta.12) (2023-05-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.11](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.10...@injectivelabs/sdk-ts@1.11.0-beta.11) (2023-05-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.10](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.9...@injectivelabs/sdk-ts@1.11.0-beta.10) (2023-05-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.9](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.8...@injectivelabs/sdk-ts@1.11.0-beta.9) (2023-05-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.8](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.7...@injectivelabs/sdk-ts@1.11.0-beta.8) (2023-05-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.7](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.6...@injectivelabs/sdk-ts@1.11.0-beta.7) (2023-05-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.6](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.5...@injectivelabs/sdk-ts@1.11.0-beta.6) (2023-05-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.5](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.4...@injectivelabs/sdk-ts@1.11.0-beta.5) (2023-05-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.4](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.3...@injectivelabs/sdk-ts@1.11.0-beta.4) (2023-05-25)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.3](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.2...@injectivelabs/sdk-ts@1.11.0-beta.3) (2023-05-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.1...@injectivelabs/sdk-ts@1.11.0-beta.2) (2023-05-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.11.0-beta.0...@injectivelabs/sdk-ts@1.11.0-beta.1) (2023-05-17)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.11.0-beta.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.17...@injectivelabs/sdk-ts@1.11.0-beta.0) (2023-05-17)

### Features

- implement retries on grpc and rest query calls ([d8c4486](https://github.com/InjectiveLabs/injective-ts/commit/d8c4486722c52a669b17ffe8875855e543f573e8))

## [1.10.73-beta.17](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.16...@injectivelabs/sdk-ts@1.10.73-beta.17) (2023-05-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.16](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.15...@injectivelabs/sdk-ts@1.10.73-beta.16) (2023-05-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.15](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.14...@injectivelabs/sdk-ts@1.10.73-beta.15) (2023-05-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.14](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.13...@injectivelabs/sdk-ts@1.10.73-beta.14) (2023-05-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.13](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.12...@injectivelabs/sdk-ts@1.10.73-beta.13) (2023-05-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.12](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.11...@injectivelabs/sdk-ts@1.10.73-beta.12) (2023-05-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.11](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.10...@injectivelabs/sdk-ts@1.10.73-beta.11) (2023-05-12)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.10](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.9...@injectivelabs/sdk-ts@1.10.73-beta.10) (2023-05-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.9](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.8...@injectivelabs/sdk-ts@1.10.73-beta.9) (2023-05-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.8](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.7...@injectivelabs/sdk-ts@1.10.73-beta.8) (2023-05-11)

### Bug Fixes

- minor ([1be70b2](https://github.com/InjectiveLabs/injective-ts/commit/1be70b24a01f1e6907145fd740d4aa1f425748bd))

## [1.10.73-beta.7](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.6...@injectivelabs/sdk-ts@1.10.73-beta.7) (2023-05-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.6](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.5...@injectivelabs/sdk-ts@1.10.73-beta.6) (2023-05-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.5](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.4...@injectivelabs/sdk-ts@1.10.73-beta.5) (2023-05-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.4](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.3...@injectivelabs/sdk-ts@1.10.73-beta.4) (2023-05-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.3](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.2...@injectivelabs/sdk-ts@1.10.73-beta.3) (2023-05-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.1...@injectivelabs/sdk-ts@1.10.73-beta.2) (2023-05-08)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.73-beta.0...@injectivelabs/sdk-ts@1.10.73-beta.1) (2023-05-08)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.73-beta.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.72...@injectivelabs/sdk-ts@1.10.73-beta.0) (2023-05-05)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.72](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.71...@injectivelabs/sdk-ts@1.10.72) (2023-04-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.71](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.65...@injectivelabs/sdk-ts@1.10.71) (2023-04-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.65](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.65-beta.1...@injectivelabs/sdk-ts@1.10.65) (2023-04-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.65-beta.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.65-beta.0...@injectivelabs/sdk-ts@1.10.65-beta.1) (2023-04-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.65-beta.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.64...@injectivelabs/sdk-ts@1.10.65-beta.0) (2023-04-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.64](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.63...@injectivelabs/sdk-ts@1.10.64) (2023-04-27)

### Bug Fixes

- value decrypt from contract ([83312ac](https://github.com/InjectiveLabs/injective-ts/commit/83312acd37b7e4786b1ac36689eaa4f7c1cc6b44))

## [1.10.63](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.62...@injectivelabs/sdk-ts@1.10.63) (2023-04-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.62](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.61...@injectivelabs/sdk-ts@1.10.62) (2023-04-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.61](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.60...@injectivelabs/sdk-ts@1.10.61) (2023-04-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.60](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.59...@injectivelabs/sdk-ts@1.10.60) (2023-04-25)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.59](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.58...@injectivelabs/sdk-ts@1.10.59) (2023-04-25)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.58](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.57...@injectivelabs/sdk-ts@1.10.58) (2023-04-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.57](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.56...@injectivelabs/sdk-ts@1.10.57) (2023-04-21)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.56](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.55...@injectivelabs/sdk-ts@1.10.56) (2023-04-21)

### Features

- get injective address from subaccount ([203c223](https://github.com/InjectiveLabs/injective-ts/commit/203c2235fbde30eda4f6f853394112cc7c83fe66))

## [1.10.55](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.54...@injectivelabs/sdk-ts@1.10.55) (2023-04-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.54](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.53...@injectivelabs/sdk-ts@1.10.54) (2023-04-20)

### Features

- gas limit from simulation ([6305f0d](https://github.com/InjectiveLabs/injective-ts/commit/6305f0d62da57ae3539cd203ac8314a796679073))

## [1.10.53](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.52...@injectivelabs/sdk-ts@1.10.53) (2023-04-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.52](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.51...@injectivelabs/sdk-ts@1.10.52) (2023-04-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.51](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.50...@injectivelabs/sdk-ts@1.10.51) (2023-04-19)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.50](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.49...@injectivelabs/sdk-ts@1.10.50) (2023-04-18)

### Bug Fixes

- build script ([6e8c15f](https://github.com/InjectiveLabs/injective-ts/commit/6e8c15f5d0c0d61e15766abb6217f3fa34cdf791))

## [1.10.49](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.48...@injectivelabs/sdk-ts@1.10.49) (2023-04-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.48](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.47...@injectivelabs/sdk-ts@1.10.48) (2023-04-17)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.47](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.46...@injectivelabs/sdk-ts@1.10.47) (2023-04-16)

### Bug Fixes

- updated core mito indexer proto-ts ([622c66f](https://github.com/InjectiveLabs/injective-ts/commit/622c66f6e1b4860372718cde91973f663acf84eb))

## [1.10.46](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.45...@injectivelabs/sdk-ts@1.10.46) (2023-04-15)

### Bug Fixes

- script minor ([adb7c76](https://github.com/InjectiveLabs/injective-ts/commit/adb7c764ad00a0cfa38223cecf9b221873cd31b8))

## [1.10.45](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.44...@injectivelabs/sdk-ts@1.10.45) (2023-04-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.44](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.43...@injectivelabs/sdk-ts@1.10.44) (2023-04-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.43](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.42...@injectivelabs/sdk-ts@1.10.43) (2023-04-12)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.42](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.41...@injectivelabs/sdk-ts@1.10.42) (2023-04-12)

### Features

- updated docs ([7c38c6d](https://github.com/InjectiveLabs/injective-ts/commit/7c38c6def49ee6064e14cd6acefa783013219e2c))

### Reverts

- Revert "chore: update sdk-ts with latest indexer protos" ([fcb9d33](https://github.com/InjectiveLabs/injective-ts/commit/fcb9d33cc66211df368b25fc71b5c0627ee2d4eb))

## [1.10.41](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.40...@injectivelabs/sdk-ts@1.10.41) (2023-04-12)

### Features

- tx filters ([1b48cd8](https://github.com/InjectiveLabs/injective-ts/commit/1b48cd81bffe85ee8556826274d9eb92eb67fb1d))

## [1.10.40](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.39...@injectivelabs/sdk-ts@1.10.40) (2023-04-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.39](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.38...@injectivelabs/sdk-ts@1.10.39) (2023-04-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.38](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.37...@injectivelabs/sdk-ts@1.10.38) (2023-04-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.37](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.36...@injectivelabs/sdk-ts@1.10.37) (2023-04-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.36](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.35...@injectivelabs/sdk-ts@1.10.36) (2023-04-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.35](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.34...@injectivelabs/sdk-ts@1.10.35) (2023-04-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.34](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.33...@injectivelabs/sdk-ts@1.10.34) (2023-04-08)

### Bug Fixes

- trading volume ([2b3da1a](https://github.com/InjectiveLabs/injective-ts/commit/2b3da1a0a2603447d1fc1da3ed0399ebdc0f14e6))

## [1.10.33](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.32...@injectivelabs/sdk-ts@1.10.33) (2023-04-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.32](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.31...@injectivelabs/sdk-ts@1.10.32) (2023-04-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.31](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.30...@injectivelabs/sdk-ts@1.10.31) (2023-04-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.30](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.29...@injectivelabs/sdk-ts@1.10.30) (2023-04-05)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.29](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.28...@injectivelabs/sdk-ts@1.10.29) (2023-04-05)

### Bug Fixes

- wallet issues ([a67b6fb](https://github.com/InjectiveLabs/injective-ts/commit/a67b6fb15666c2b2e9f4745b522dfc493981f918))

## [1.10.28](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.27...@injectivelabs/sdk-ts@1.10.28) (2023-04-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.27](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.26...@injectivelabs/sdk-ts@1.10.27) (2023-04-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.26](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.25...@injectivelabs/sdk-ts@1.10.26) (2023-04-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.25](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.25-alpha.6...@injectivelabs/sdk-ts@1.10.25) (2023-04-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.25-alpha.6](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.25-alpha.5...@injectivelabs/sdk-ts@1.10.25-alpha.6) (2023-04-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.25-alpha.5](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.25-alpha.4...@injectivelabs/sdk-ts@1.10.25-alpha.5) (2023-04-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.25-alpha.4](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.25-alpha.3...@injectivelabs/sdk-ts@1.10.25-alpha.4) (2023-04-04)

### Bug Fixes

- resolutions ([10f1156](https://github.com/InjectiveLabs/injective-ts/commit/10f11561ec8c38c62332f06535af63d480a0830a))

## [1.10.25-alpha.3](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.25-alpha.2...@injectivelabs/sdk-ts@1.10.25-alpha.3) (2023-04-04)

### Bug Fixes

- resolutions ([8a3b0b0](https://github.com/InjectiveLabs/injective-ts/commit/8a3b0b00c164e308e65ce6519ed923445cca8bb5))

## [1.10.25-alpha.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.25-alpha.1...@injectivelabs/sdk-ts@1.10.25-alpha.2) (2023-04-04)

### Bug Fixes

- resolutions ([bff3ca0](https://github.com/InjectiveLabs/injective-ts/commit/bff3ca0222ab4d69ff804ba9a54ee667e1dfd9fa))

## [1.10.25-alpha.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.25-alpha.0...@injectivelabs/sdk-ts@1.10.25-alpha.1) (2023-04-04)

### Bug Fixes

- resolutions ([4910ff3](https://github.com/InjectiveLabs/injective-ts/commit/4910ff361033ad22cbc52a636e0df817c988af19))

## [1.10.25-alpha.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.24...@injectivelabs/sdk-ts@1.10.25-alpha.0) (2023-04-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.24](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.23...@injectivelabs/sdk-ts@1.10.24) (2023-04-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.23](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.22...@injectivelabs/sdk-ts@1.10.23) (2023-04-03)

### Features

- update supernova folder structure ([a220ecd](https://github.com/InjectiveLabs/injective-ts/commit/a220ecd97f94819ce839ac03facfa1a3c98f5b51))

## [1.10.22](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.21...@injectivelabs/sdk-ts@1.10.22) (2023-04-03)

### Bug Fixes

- include memo ([778e3bb](https://github.com/InjectiveLabs/injective-ts/commit/778e3bb9383a77e4a22734ca5766edf6c0ba4ee5))

## [1.10.21](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.20...@injectivelabs/sdk-ts@1.10.21) (2023-04-03)

### Bug Fixes

- nonce on orderhash manager ([a269718](https://github.com/InjectiveLabs/injective-ts/commit/a269718a647c53e93612b283fcc720d8e2462dde))

## [1.10.20](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.19...@injectivelabs/sdk-ts@1.10.20) (2023-04-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.19](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.18...@injectivelabs/sdk-ts@1.10.19) (2023-03-31)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.18](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.17...@injectivelabs/sdk-ts@1.10.18) (2023-03-31)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.17](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.16...@injectivelabs/sdk-ts@1.10.17) (2023-03-31)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.16](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.15...@injectivelabs/sdk-ts@1.10.16) (2023-03-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.15](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.14...@injectivelabs/sdk-ts@1.10.15) (2023-03-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.14](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.13...@injectivelabs/sdk-ts@1.10.14) (2023-03-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.13](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.12...@injectivelabs/sdk-ts@1.10.13) (2023-03-29)

### Bug Fixes

- minor vault config ([ebdffcd](https://github.com/InjectiveLabs/injective-ts/commit/ebdffcd73dfc9356f98b9195b23dacd7dc287898))

## [1.10.12](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.10...@injectivelabs/sdk-ts@1.10.12) (2023-03-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.11](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.10...@injectivelabs/sdk-ts@1.10.11) (2023-03-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.10](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.9...@injectivelabs/sdk-ts@1.10.10) (2023-03-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.9](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.8...@injectivelabs/sdk-ts@1.10.9) (2023-03-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.8](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.7...@injectivelabs/sdk-ts@1.10.8) (2023-03-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.7](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.6...@injectivelabs/sdk-ts@1.10.7) (2023-03-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.6](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.5...@injectivelabs/sdk-ts@1.10.6) (2023-03-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.5](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.4...@injectivelabs/sdk-ts@1.10.5) (2023-03-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.4](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.3...@injectivelabs/sdk-ts@1.10.4) (2023-03-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.3](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.2...@injectivelabs/sdk-ts@1.10.3) (2023-03-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.1...@injectivelabs/sdk-ts@1.10.2) (2023-03-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.10.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.0...@injectivelabs/sdk-ts@1.10.1) (2023-03-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.10.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.10.0-alpha.14...@injectivelabs/sdk-ts@1.10.0) (2023-03-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

# [1.10.0-alpha.14](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.498...@injectivelabs/sdk-ts@1.10.0-alpha.14) (2023-03-22)

### Bug Fixes

- circular deps ([fc41599](https://github.com/InjectiveLabs/injective-ts/commit/fc415999e4494085d86924736f4dae6d77b2487a))
- esm imports ([7ba5cf6](https://github.com/InjectiveLabs/injective-ts/commit/7ba5cf69a58a3d4bb677859737089592c081552a))
- grpc error handling ([40fb0fd](https://github.com/InjectiveLabs/injective-ts/commit/40fb0fde7a8cece703d2c7c223793b0afdaeb353))
- minor ([a433519](https://github.com/InjectiveLabs/injective-ts/commit/a433519292d8a56e02d65bac2c41ae29f8d98626))
- minor ([aa83920](https://github.com/InjectiveLabs/injective-ts/commit/aa839202286c892b619500757bbe81c206b66157))
- minor ([39b553b](https://github.com/InjectiveLabs/injective-ts/commit/39b553b40cd7623836268651e892e5ed10812828))
- minor tests ([0f9baf1](https://github.com/InjectiveLabs/injective-ts/commit/0f9baf1753525018ecf352f498e2cea99f43a3df))
- sign mode ([5597703](https://github.com/InjectiveLabs/injective-ts/commit/55977038b418fea25578a985a6cf791a5155be83))
- types for createTransaction ([b08b76d](https://github.com/InjectiveLabs/injective-ts/commit/b08b76dc71a83822ddb101657ef69e5e6994085b))

### Features

- migrated to grpcWebImpl ([bbf4e37](https://github.com/InjectiveLabs/injective-ts/commit/bbf4e3715c20cd2948b77e3be4dac45123b29859))
- msgmultisend ([77adf6f](https://github.com/InjectiveLabs/injective-ts/commit/77adf6ff9437f23fd73c2c75fd74299978c22ddd))

## [1.0.498](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.497...@injectivelabs/sdk-ts@1.0.498) (2023-03-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.497](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.496...@injectivelabs/sdk-ts@1.0.497) (2023-03-22)

### Bug Fixes

- order hash manager ([f29c236](https://github.com/InjectiveLabs/injective-ts/commit/f29c236bfd4bd1b82bc34d523c6ea92f82cae0fc))

## [1.0.496](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.495...@injectivelabs/sdk-ts@1.0.496) (2023-03-21)

### Features

- migrated to grpcWebImpl ([bbf4e37](https://github.com/InjectiveLabs/injective-ts/commit/bbf4e3715c20cd2948b77e3be4dac45123b29859))
- msgmultisend ([77adf6f](https://github.com/InjectiveLabs/injective-ts/commit/77adf6ff9437f23fd73c2c75fd74299978c22ddd))

# [1.10.0-alpha.10](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.495...@injectivelabs/sdk-ts@1.10.0-alpha.10) (2023-03-21)

### Bug Fixes

- circular deps ([fc41599](https://github.com/InjectiveLabs/injective-ts/commit/fc415999e4494085d86924736f4dae6d77b2487a))
- esm imports ([7ba5cf6](https://github.com/InjectiveLabs/injective-ts/commit/7ba5cf69a58a3d4bb677859737089592c081552a))
- grpc error handling ([40fb0fd](https://github.com/InjectiveLabs/injective-ts/commit/40fb0fde7a8cece703d2c7c223793b0afdaeb353))
- minor ([aa83920](https://github.com/InjectiveLabs/injective-ts/commit/aa839202286c892b619500757bbe81c206b66157))
- minor ([39b553b](https://github.com/InjectiveLabs/injective-ts/commit/39b553b40cd7623836268651e892e5ed10812828))
- minor tests ([0f9baf1](https://github.com/InjectiveLabs/injective-ts/commit/0f9baf1753525018ecf352f498e2cea99f43a3df))
- sign mode ([5597703](https://github.com/InjectiveLabs/injective-ts/commit/55977038b418fea25578a985a6cf791a5155be83))
- types for createTransaction ([b08b76d](https://github.com/InjectiveLabs/injective-ts/commit/b08b76dc71a83822ddb101657ef69e5e6994085b))

### Features

- migrated to grpcWebImpl ([bbf4e37](https://github.com/InjectiveLabs/injective-ts/commit/bbf4e3715c20cd2948b77e3be4dac45123b29859))
- msgmultisend ([77adf6f](https://github.com/InjectiveLabs/injective-ts/commit/77adf6ff9437f23fd73c2c75fd74299978c22ddd))

## [1.0.496](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.495...@injectivelabs/sdk-ts@1.0.496) (2023-03-21)

### Bug Fixes

- checksum address calc ([3b1946e](https://github.com/InjectiveLabs/injective-ts/commit/3b1946e2ebdf09c075a1a53fb4d3c1ba7b851bd2))

## [1.0.495](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.494...@injectivelabs/sdk-ts@1.0.495) (2023-03-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.494](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.493...@injectivelabs/sdk-ts@1.0.494) (2023-03-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.493](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.492...@injectivelabs/sdk-ts@1.0.493) (2023-03-17)

### Bug Fixes

- minor ([5c6fef7](https://github.com/InjectiveLabs/injective-ts/commit/5c6fef719b7836f04612449dca4849b002f7a1df))

## [1.0.492](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.491...@injectivelabs/sdk-ts@1.0.492) (2023-03-17)

### Bug Fixes

- redundant params ([47ca9f2](https://github.com/InjectiveLabs/injective-ts/commit/47ca9f2f34ec9b2902511176c7c91df6560a1c24))

## [1.0.491](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.490...@injectivelabs/sdk-ts@1.0.491) (2023-03-17)

### Features

- add msg multi send ([6a494aa](https://github.com/InjectiveLabs/injective-ts/commit/6a494aa9e989134f61b9c6bd7959f314d8acc72f))

## [1.0.490](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.489...@injectivelabs/sdk-ts@1.0.490) (2023-03-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.489](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.488...@injectivelabs/sdk-ts@1.0.489) (2023-03-16)

### Bug Fixes

- txGrpcApi exception handling ([a5b077a](https://github.com/InjectiveLabs/injective-ts/commit/a5b077a044fa2acf051483bded9486159be5a95b))

## [1.0.488](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.487...@injectivelabs/sdk-ts@1.0.488) (2023-03-16)

### Bug Fixes

- grpc broadcast sync tx ([8fdc8de](https://github.com/InjectiveLabs/injective-ts/commit/8fdc8de4c0aacec037b5b17a885a7d780059498b))

## [1.0.487](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.486...@injectivelabs/sdk-ts@1.0.487) (2023-03-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.486](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.484...@injectivelabs/sdk-ts@1.0.486) (2023-03-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.485](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.484...@injectivelabs/sdk-ts@1.0.485) (2023-03-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.484](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.483...@injectivelabs/sdk-ts@1.0.484) (2023-03-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.483](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.482...@injectivelabs/sdk-ts@1.0.483) (2023-03-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.482](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.481...@injectivelabs/sdk-ts@1.0.482) (2023-03-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.481](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.480...@injectivelabs/sdk-ts@1.0.481) (2023-03-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.480](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.479...@injectivelabs/sdk-ts@1.0.480) (2023-03-12)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.479](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.478...@injectivelabs/sdk-ts@1.0.479) (2023-03-12)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.478](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.477...@injectivelabs/sdk-ts@1.0.478) (2023-03-08)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.477](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.476...@injectivelabs/sdk-ts@1.0.477) (2023-03-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.476](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.475...@injectivelabs/sdk-ts@1.0.476) (2023-03-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.475](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.474...@injectivelabs/sdk-ts@1.0.475) (2023-03-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.474](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.473...@injectivelabs/sdk-ts@1.0.474) (2023-03-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.473](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.472...@injectivelabs/sdk-ts@1.0.473) (2023-03-06)

### Bug Fixes

- minor ([af6fffe](https://github.com/InjectiveLabs/injective-ts/commit/af6fffe5cecec8b4405b09c27ce99ad75c6f8b3e))

## [1.0.472](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.471...@injectivelabs/sdk-ts@1.0.472) (2023-03-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.471](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.470...@injectivelabs/sdk-ts@1.0.471) (2023-03-05)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.470](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.469...@injectivelabs/sdk-ts@1.0.470) (2023-03-02)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.469](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.468...@injectivelabs/sdk-ts@1.0.469) (2023-03-02)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.468](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.467...@injectivelabs/sdk-ts@1.0.468) (2023-03-02)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.467](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.465...@injectivelabs/sdk-ts@1.0.467) (2023-03-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.465](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.464...@injectivelabs/sdk-ts@1.0.465) (2023-03-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.464](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.463...@injectivelabs/sdk-ts@1.0.464) (2023-03-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.463](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.462...@injectivelabs/sdk-ts@1.0.463) (2023-03-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.462](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.461...@injectivelabs/sdk-ts@1.0.462) (2023-03-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.461](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.460...@injectivelabs/sdk-ts@1.0.461) (2023-03-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.460](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.459...@injectivelabs/sdk-ts@1.0.460) (2023-02-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.459](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.458...@injectivelabs/sdk-ts@1.0.459) (2023-02-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.458](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.457...@injectivelabs/sdk-ts@1.0.458) (2023-02-24)

### Bug Fixes

- testnet tokens ([1209081](https://github.com/InjectiveLabs/injective-ts/commit/12090815b2c39e165c8e673487b21d5734fb690f))

## [1.0.457](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.456...@injectivelabs/sdk-ts@1.0.457) (2023-02-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.456](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.455...@injectivelabs/sdk-ts@1.0.456) (2023-02-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.455](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.454...@injectivelabs/sdk-ts@1.0.455) (2023-02-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.454](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.453...@injectivelabs/sdk-ts@1.0.454) (2023-02-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.453](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.452...@injectivelabs/sdk-ts@1.0.453) (2023-02-23)

### Bug Fixes

- minor ([8283050](https://github.com/InjectiveLabs/injective-ts/commit/82830500b133aa504c3a18143e459a34783fb291))

## [1.0.452](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.451...@injectivelabs/sdk-ts@1.0.452) (2023-02-23)

### Bug Fixes

- not awaiting for error ([b97cc8a](https://github.com/InjectiveLabs/injective-ts/commit/b97cc8aeab0f8d779342746aaf2c6ad5c48df7bc))

## [1.0.451](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.450...@injectivelabs/sdk-ts@1.0.451) (2023-02-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.450](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.449...@injectivelabs/sdk-ts@1.0.450) (2023-02-21)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.449](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.448...@injectivelabs/sdk-ts@1.0.449) (2023-02-21)

### Bug Fixes

- denom client grpc endpoints ([b5aab84](https://github.com/InjectiveLabs/injective-ts/commit/b5aab845a034458b6f312224fe7193767e4a6d5c))

## [1.0.448](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.448-alpha.0...@injectivelabs/sdk-ts@1.0.448) (2023-02-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.448-alpha.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.447...@injectivelabs/sdk-ts@1.0.448-alpha.0) (2023-02-20)

### Features

- integrate portfolio api ([4ba36ff](https://github.com/InjectiveLabs/injective-ts/commit/4ba36ffd01f62277f5d673495e5bd26ea26bde35))
- setup indexer grpc account portfolio api and stream ([72d7d85](https://github.com/InjectiveLabs/injective-ts/commit/72d7d85e66e2932b60b3e6215d5cda11b036e6a5))

## [1.0.447](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.446...@injectivelabs/sdk-ts@1.0.447) (2023-02-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.446](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.445...@injectivelabs/sdk-ts@1.0.446) (2023-02-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.445](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.444...@injectivelabs/sdk-ts@1.0.445) (2023-02-16)

### Bug Fixes

- tx error parsin ([c281fec](https://github.com/InjectiveLabs/injective-ts/commit/c281fec94e5ebaecf6b1830228ae6bada5bbea4f))

## [1.0.444](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.443...@injectivelabs/sdk-ts@1.0.444) (2023-02-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.443](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.442...@injectivelabs/sdk-ts@1.0.443) (2023-02-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.442](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.441...@injectivelabs/sdk-ts@1.0.442) (2023-02-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.441](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.440...@injectivelabs/sdk-ts@1.0.441) (2023-02-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.440](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.439...@injectivelabs/sdk-ts@1.0.440) (2023-02-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.439](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.438...@injectivelabs/sdk-ts@1.0.439) (2023-02-15)

### Bug Fixes

- error parsing and token type ([c6650fb](https://github.com/InjectiveLabs/injective-ts/commit/c6650fb53dd03fdd87792a4ae4a5b92437b254ed))

## [1.0.438](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.437...@injectivelabs/sdk-ts@1.0.438) (2023-02-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.437](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.436...@injectivelabs/sdk-ts@1.0.437) (2023-02-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.436](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.435...@injectivelabs/sdk-ts@1.0.436) (2023-02-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.435](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.434...@injectivelabs/sdk-ts@1.0.435) (2023-02-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.434](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.433...@injectivelabs/sdk-ts@1.0.434) (2023-02-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.433](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.432...@injectivelabs/sdk-ts@1.0.433) (2023-02-14)

### Bug Fixes

- account txs messages returned as empty array ([a7df3ae](https://github.com/InjectiveLabs/injective-ts/commit/a7df3ae9ebd620b4d3188bc1e9756c872b782ae9))

## [1.0.432](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.431...@injectivelabs/sdk-ts@1.0.432) (2023-02-14)

### Features

- MsgTransfer for external chains ([96ee3de](https://github.com/InjectiveLabs/injective-ts/commit/96ee3de9e1daddd802075498b03ffdc67b57ec1f))

## [1.0.431](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.430...@injectivelabs/sdk-ts@1.0.431) (2023-02-13)

### Features

- msgTransferExternal ([0ebaa6e](https://github.com/InjectiveLabs/injective-ts/commit/0ebaa6e33588f003628a5fa7ad73964b76d4b5e6))

## [1.0.430](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.429...@injectivelabs/sdk-ts@1.0.430) (2023-02-13)

### Features

- helper utils for sorting object keys ([b48c598](https://github.com/InjectiveLabs/injective-ts/commit/b48c598fe90ff5ba83b930f0ec60771e86fdfb02))

## [1.0.429](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.428...@injectivelabs/sdk-ts@1.0.429) (2023-02-13)

### Bug Fixes

- types and conditions for keplr + ledger ([5bc4a9a](https://github.com/InjectiveLabs/injective-ts/commit/5bc4a9a93af98acf76ddf98d899adb6898e28b08))

## [1.0.428](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.427...@injectivelabs/sdk-ts@1.0.428) (2023-02-13)

### Features

- added amino sign for Keplr ([a3fa523](https://github.com/InjectiveLabs/injective-ts/commit/a3fa523179151bceb701d0216499dc2c21480ed5))

## [1.0.427](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.426...@injectivelabs/sdk-ts@1.0.427) (2023-02-13)

### Bug Fixes

- token meta not populated on devnet env ([11fead4](https://github.com/InjectiveLabs/injective-ts/commit/11fead46519b883cd676db027162189402d17d06))

### Features

- implement grpc oracle stream for prices by markets ([e24887f](https://github.com/InjectiveLabs/injective-ts/commit/e24887f01d6fe136fe55d831930c03c09ab86b6f))

## [1.0.426](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.425...@injectivelabs/sdk-ts@1.0.426) (2023-02-12)

### Bug Fixes

- minor ([ef541cf](https://github.com/InjectiveLabs/injective-ts/commit/ef541cfd69ea2a6f00680e10d0d965281cabd2ee))

## [1.0.425](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.424...@injectivelabs/sdk-ts@1.0.425) (2023-02-12)

### Bug Fixes

- params for rest indexer api ([c149563](https://github.com/InjectiveLabs/injective-ts/commit/c149563be1a17b91148f2f1d96673d5051d44c4e))

## [1.0.424](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.423...@injectivelabs/sdk-ts@1.0.424) (2023-02-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.423](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.422...@injectivelabs/sdk-ts@1.0.423) (2023-02-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.422](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.421...@injectivelabs/sdk-ts@1.0.422) (2023-02-10)

### Bug Fixes

- minor typing ([9a59b76](https://github.com/InjectiveLabs/injective-ts/commit/9a59b766343ee8eae99f3a56000ed0304e4dc236))

## [1.0.421](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.420...@injectivelabs/sdk-ts@1.0.421) (2023-02-10)

### Bug Fixes

- minor undefined error ([ecec926](https://github.com/InjectiveLabs/injective-ts/commit/ecec9262d2e2137c306788ec4a35d60436e96b8a))

## [1.0.420](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.419...@injectivelabs/sdk-ts@1.0.420) (2023-02-10)

### Bug Fixes

- added symbols for erc20 ([e157eb9](https://github.com/InjectiveLabs/injective-ts/commit/e157eb91f1621ed4b3ced8b0ee81adbfb25782df))

## [1.0.419](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.418...@injectivelabs/sdk-ts@1.0.419) (2023-02-10)

### Bug Fixes

- token denom mapping ([3584927](https://github.com/InjectiveLabs/injective-ts/commit/3584927b97e40171fdae6a24f6aa528bc5a6eaae))

## [1.0.418](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.417...@injectivelabs/sdk-ts@1.0.418) (2023-02-10)

### Bug Fixes

- minor conversion to token info ([d8e3d81](https://github.com/InjectiveLabs/injective-ts/commit/d8e3d81c87e2cdea32f57a947e1b3fc20fb40dc4))

## [1.0.417](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.416...@injectivelabs/sdk-ts@1.0.417) (2023-02-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.416](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.415...@injectivelabs/sdk-ts@1.0.416) (2023-02-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.415](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.414...@injectivelabs/sdk-ts@1.0.415) (2023-02-09)

### Bug Fixes

- minor util function ([55db0c8](https://github.com/InjectiveLabs/injective-ts/commit/55db0c8debff6336950b05fd9824fcf545636497))

## [1.0.414](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.413...@injectivelabs/sdk-ts@1.0.414) (2023-02-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.413](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.412...@injectivelabs/sdk-ts@1.0.413) (2023-02-09)

### Bug Fixes

- minor ([cc45f46](https://github.com/InjectiveLabs/injective-ts/commit/cc45f46242964e1491b039f6de85f5b27c019f28))
- simplifying TokenInfo class ([1089c71](https://github.com/InjectiveLabs/injective-ts/commit/1089c717b3175b4d37e3fa145c55585c12d02daa))

## [1.0.412](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.411...@injectivelabs/sdk-ts@1.0.412) (2023-02-09)

### Bug Fixes

- minor ([6ee390a](https://github.com/InjectiveLabs/injective-ts/commit/6ee390a4336e62a7656cde9d9f7e0fc58251348b))

## [1.0.411](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.410...@injectivelabs/sdk-ts@1.0.411) (2023-02-09)

### Bug Fixes

- minor ([099b33d](https://github.com/InjectiveLabs/injective-ts/commit/099b33d0e1ce111cfdec9163bec464aa5e1a797f))

## [1.0.410](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.409...@injectivelabs/sdk-ts@1.0.410) (2023-02-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.409](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.408...@injectivelabs/sdk-ts@1.0.409) (2023-02-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.408](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.407...@injectivelabs/sdk-ts@1.0.408) (2023-02-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.407](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.406...@injectivelabs/sdk-ts@1.0.407) (2023-02-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.406](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.405...@injectivelabs/sdk-ts@1.0.406) (2023-02-09)

### Features

- new token metadata implementation ([a285b1a](https://github.com/InjectiveLabs/injective-ts/commit/a285b1aead2f7a7806169ac78fd22c5c2e4dc4c3))

## [1.0.405](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.404...@injectivelabs/sdk-ts@1.0.405) (2023-02-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.404](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.403...@injectivelabs/sdk-ts@1.0.404) (2023-02-08)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.403](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.402...@injectivelabs/sdk-ts@1.0.403) (2023-02-08)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.402](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.401...@injectivelabs/sdk-ts@1.0.402) (2023-02-08)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.401](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.400...@injectivelabs/sdk-ts@1.0.401) (2023-02-08)

### Features

- baseDenom introduced ([7c8f895](https://github.com/InjectiveLabs/injective-ts/commit/7c8f89557ccf4b272b1235593ba1ad6934d23cb7))

## [1.0.400](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.399...@injectivelabs/sdk-ts@1.0.400) (2023-02-08)

### Bug Fixes

- cached denom tokens ([a3abfdd](https://github.com/InjectiveLabs/injective-ts/commit/a3abfdd427b28b3d1e0458fac550b9a5c4d6c360))

## [1.0.399](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.398...@injectivelabs/sdk-ts@1.0.399) (2023-02-08)

### Features

- denomClientAsync ([e820eb9](https://github.com/InjectiveLabs/injective-ts/commit/e820eb93cd335358c91a8627f67521b806359b49))

## [1.0.398](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.397...@injectivelabs/sdk-ts@1.0.398) (2023-02-08)

### Features

- caching denom traces ([7b7f89e](https://github.com/InjectiveLabs/injective-ts/commit/7b7f89eb3e61efa22f28f707bd96038371d01c6b))

## [1.0.397](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.396...@injectivelabs/sdk-ts@1.0.397) (2023-02-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.396](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.395...@injectivelabs/sdk-ts@1.0.396) (2023-02-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.395](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.394...@injectivelabs/sdk-ts@1.0.395) (2023-02-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.394](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.393...@injectivelabs/sdk-ts@1.0.394) (2023-02-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.393](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.392...@injectivelabs/sdk-ts@1.0.393) (2023-02-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.392](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.391...@injectivelabs/sdk-ts@1.0.392) (2023-02-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.391](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.390...@injectivelabs/sdk-ts@1.0.391) (2023-02-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.390](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.389...@injectivelabs/sdk-ts@1.0.390) (2023-02-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.389](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.388...@injectivelabs/sdk-ts@1.0.389) (2023-02-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.388](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.387...@injectivelabs/sdk-ts@1.0.388) (2023-02-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.387](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.386...@injectivelabs/sdk-ts@1.0.387) (2023-02-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.386](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.385...@injectivelabs/sdk-ts@1.0.386) (2023-02-01)

### Bug Fixes

- minor ([82f2708](https://github.com/InjectiveLabs/injective-ts/commit/82f2708bf0bf159df75568d0e4b3298abf99bca2))

## [1.0.385](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.384...@injectivelabs/sdk-ts@1.0.385) (2023-02-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.384](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.383...@injectivelabs/sdk-ts@1.0.384) (2023-02-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.383](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.382...@injectivelabs/sdk-ts@1.0.383) (2023-01-30)

### Features

- migrated to grpcWebImpl ([bbf4e37](https://github.com/InjectiveLabs/injective-ts/commit/bbf4e3715c20cd2948b77e3be4dac45123b29859))

## [1.0.383-alpha.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.382-alpha.0...@injectivelabs/sdk-ts@1.0.383-alpha.0) (2023-01-29)

### Bug Fixes

- types for createTransaction ([b08b76d](https://github.com/InjectiveLabs/injective-ts/commit/b08b76dc71a83822ddb101657ef69e5e6994085b))

### Features

- migrated to grpcWebImpl ([bbf4e37](https://github.com/InjectiveLabs/injective-ts/commit/bbf4e3715c20cd2948b77e3be4dac45123b29859))

## [1.0.382-alpha.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.381-alpha.0...@injectivelabs/sdk-ts@1.0.382-alpha.0) (2023-01-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.381-alpha.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.380-alpha.0...@injectivelabs/sdk-ts@1.0.381-alpha.0) (2023-01-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.380-alpha.0](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.379...@injectivelabs/sdk-ts@1.0.380-alpha.0) (2023-01-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.379](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.378...@injectivelabs/sdk-ts@1.0.379) (2023-01-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.378](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.377...@injectivelabs/sdk-ts@1.0.378) (2023-01-25)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.377](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.376...@injectivelabs/sdk-ts@1.0.377) (2023-01-25)

### Bug Fixes

- transaction exceptions ([2083bb8](https://github.com/InjectiveLabs/injective-ts/commit/2083bb80770b5ad954d2249d119ed72113f6b0c2))

## [1.0.376](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.375...@injectivelabs/sdk-ts@1.0.376) (2023-01-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.375](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.374...@injectivelabs/sdk-ts@1.0.375) (2023-01-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.374](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.373...@injectivelabs/sdk-ts@1.0.374) (2023-01-23)

### Bug Fixes

- minor for MsgTransfer ([2912a65](https://github.com/InjectiveLabs/injective-ts/commit/2912a650ce7153e241cd0a86014050a58d694985))

## [1.0.373](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.372...@injectivelabs/sdk-ts@1.0.373) (2023-01-23)

### Bug Fixes

- ibc transfer memo ([8815bf9](https://github.com/InjectiveLabs/injective-ts/commit/8815bf9f3aa6571802a6715ddd7f42e9b031e372))

## [1.0.372](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.371...@injectivelabs/sdk-ts@1.0.372) (2023-01-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.371](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.370...@injectivelabs/sdk-ts@1.0.371) (2023-01-20)

### Bug Fixes

- market quantity decimals ([b34b4ee](https://github.com/InjectiveLabs/injective-ts/commit/b34b4ee743c8fdf2d95bdbe95e52a55694c7c20d))

## [1.0.370](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.369...@injectivelabs/sdk-ts@1.0.370) (2023-01-20)

### Bug Fixes

- tick sizes less than 0 not parsing properly ([5ad85dd](https://github.com/InjectiveLabs/injective-ts/commit/5ad85dde5c3a65503a5e5bbf3200269bd8dc9e6a))

## [1.0.369](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.368...@injectivelabs/sdk-ts@1.0.369) (2023-01-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.368](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.367...@injectivelabs/sdk-ts@1.0.368) (2023-01-19)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.367](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.366...@injectivelabs/sdk-ts@1.0.367) (2023-01-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.366](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.365...@injectivelabs/sdk-ts@1.0.366) (2023-01-18)

### Features

- added context to exceptions ([ccfd06b](https://github.com/InjectiveLabs/injective-ts/commit/ccfd06b84fc1acb542e28f1d39ac251730750afa))

## [1.0.365](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.364...@injectivelabs/sdk-ts@1.0.365) (2023-01-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.364](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.363...@injectivelabs/sdk-ts@1.0.364) (2023-01-13)

### Features

- added tradeId ([21dba26](https://github.com/InjectiveLabs/injective-ts/commit/21dba26fd094b9eb15d891ac4a7ec106d0337142))

## [1.0.363](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.362...@injectivelabs/sdk-ts@1.0.363) (2023-01-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.362](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.361...@injectivelabs/sdk-ts@1.0.362) (2023-01-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.361](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.360...@injectivelabs/sdk-ts@1.0.361) (2023-01-12)

### Bug Fixes

- set funds as 0 for msgExecuteContractCompat ([bbcfa54](https://github.com/InjectiveLabs/injective-ts/commit/bbcfa54a6e678b0a2f9613c9e1b5098c9d9cf63d))

## [1.0.360](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.359...@injectivelabs/sdk-ts@1.0.360) (2023-01-12)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.359](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.358...@injectivelabs/sdk-ts@1.0.359) (2023-01-12)

### Bug Fixes

- spot order price ([e278d73](https://github.com/InjectiveLabs/injective-ts/commit/e278d73a7eafe52fa22232ce7de44414ddbd3ce3))

## [1.0.358](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.357...@injectivelabs/sdk-ts@1.0.358) (2023-01-12)

### Bug Fixes

- remove blank strings ([104b4ea](https://github.com/InjectiveLabs/injective-ts/commit/104b4ea3c273492027e8eafa52d37b50a3334b6d))

## [1.0.357](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.356...@injectivelabs/sdk-ts@1.0.357) (2023-01-12)

### Bug Fixes

- nullable strings in value ([32bf7f1](https://github.com/InjectiveLabs/injective-ts/commit/32bf7f16a226fd81bd136b40db43fe9735fd83cc))

## [1.0.356](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.355...@injectivelabs/sdk-ts@1.0.356) (2023-01-12)

### Features

- funds stringified ([14d262f](https://github.com/InjectiveLabs/injective-ts/commit/14d262f32b7ad5d0840e1597798ee49787f66d26))

## [1.0.355](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.354...@injectivelabs/sdk-ts@1.0.355) (2023-01-12)

### Features

- broadcaster used instead of provider to support metamask ([bed89c0](https://github.com/InjectiveLabs/injective-ts/commit/bed89c0bbff34e74731885f5367f7276a0706383))

## [1.0.354](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.353...@injectivelabs/sdk-ts@1.0.354) (2023-01-11)

### Bug Fixes

- updated std fee based on gas ([0a86900](https://github.com/InjectiveLabs/injective-ts/commit/0a869004eacfaaa2fc1b1b0567937eb948bd1c59))

## [1.0.353](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.352...@injectivelabs/sdk-ts@1.0.353) (2023-01-11)

### Bug Fixes

- typo ([b673377](https://github.com/InjectiveLabs/injective-ts/commit/b6733777a47f659c4912015a1f373adbb2354912))

## [1.0.352](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.351...@injectivelabs/sdk-ts@1.0.352) (2023-01-11)

### Features

- path updated for wasmx ([2bebb9d](https://github.com/InjectiveLabs/injective-ts/commit/2bebb9d02999f2b7a1be6494c353d0650475cfdf))

## [1.0.351](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.350...@injectivelabs/sdk-ts@1.0.351) (2023-01-11)

### Features

- path updated for wasmx ([36b594a](https://github.com/InjectiveLabs/injective-ts/commit/36b594a4465227e01ec60d3caae226fe03c3ab1b))

## [1.0.350](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.349...@injectivelabs/sdk-ts@1.0.350) (2023-01-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.349](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.348...@injectivelabs/sdk-ts@1.0.349) (2023-01-10)

### Bug Fixes

- leftover console log ([c3d7c89](https://github.com/InjectiveLabs/injective-ts/commit/c3d7c894be06ff4ab53c8a6af818e5411df4ca84))

## [1.0.348](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.347...@injectivelabs/sdk-ts@1.0.348) (2023-01-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.347](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.346...@injectivelabs/sdk-ts@1.0.347) (2023-01-10)

### Features

- msgExecuteContractCompat ([9c63a64](https://github.com/InjectiveLabs/injective-ts/commit/9c63a645493af7077a5561f25e526a4a20d2d218))

## [1.0.346](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.345...@injectivelabs/sdk-ts@1.0.346) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.345](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.344...@injectivelabs/sdk-ts@1.0.345) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.344](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.343...@injectivelabs/sdk-ts@1.0.344) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.343](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.342...@injectivelabs/sdk-ts@1.0.343) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.342](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.341...@injectivelabs/sdk-ts@1.0.342) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.341](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.340...@injectivelabs/sdk-ts@1.0.341) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.340](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.339...@injectivelabs/sdk-ts@1.0.340) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.339](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.338...@injectivelabs/sdk-ts@1.0.339) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.338](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.337...@injectivelabs/sdk-ts@1.0.338) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.337](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.336...@injectivelabs/sdk-ts@1.0.337) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.336](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.335...@injectivelabs/sdk-ts@1.0.336) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.335](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.334...@injectivelabs/sdk-ts@1.0.335) (2023-01-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.334](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.333...@injectivelabs/sdk-ts@1.0.334) (2023-01-09)

### Features

- added httpRestClient which handles timeout exceptions ([c200bc2](https://github.com/InjectiveLabs/injective-ts/commit/c200bc25fe67901ad80462166c5cc841449df6b8))

## [1.0.333](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.332...@injectivelabs/sdk-ts@1.0.333) (2023-01-09)

### Features

- redeem from sdk-ts not wormhole-sdk ([6492495](https://github.com/InjectiveLabs/injective-ts/commit/64924954d2e635c0d0098594ff18191beca300f5))

## [1.0.332](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.331...@injectivelabs/sdk-ts@1.0.332) (2023-01-09)

### Features

- added testnet old endpoints ([79358b1](https://github.com/InjectiveLabs/injective-ts/commit/79358b1ce2f775cacb8c278a58caaea90a8e98bb))

## [1.0.331](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.330...@injectivelabs/sdk-ts@1.0.331) (2023-01-08)

### Bug Fixes

- signature list on simulating transaction ([ac77679](https://github.com/InjectiveLabs/injective-ts/commit/ac77679b8651ffc22b2e19275f2ffbb8397a5e12))

## [1.0.330](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.329...@injectivelabs/sdk-ts@1.0.330) (2023-01-06)

### Bug Fixes

- sender not set ([58cc039](https://github.com/InjectiveLabs/injective-ts/commit/58cc03947ebc051e7168159f0e717daa8ad70abe))

## [1.0.329](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.328...@injectivelabs/sdk-ts@1.0.329) (2023-01-05)

### Features

- gas based on message ([929f117](https://github.com/InjectiveLabs/injective-ts/commit/929f117934120122286e87428707d4536e026f35))

## [1.0.328](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.327...@injectivelabs/sdk-ts@1.0.328) (2023-01-05)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.327](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.326...@injectivelabs/sdk-ts@1.0.327) (2023-01-03)

### Features

- added msg store code ([7159995](https://github.com/InjectiveLabs/injective-ts/commit/715999592efa2d912e69860cec5d7d206df1f2cc))

## [1.0.326](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.325...@injectivelabs/sdk-ts@1.0.326) (2022-12-24)

### Bug Fixes

- order hash manager ([7db92b2](https://github.com/InjectiveLabs/injective-ts/commit/7db92b28f8214786e61dadad353da48c4b45cb7a))

## [1.0.325](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.324...@injectivelabs/sdk-ts@1.0.325) (2022-12-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.324](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.323...@injectivelabs/sdk-ts@1.0.324) (2022-12-24)

### Features

- tx response now returned instead of the txhash only ([7959791](https://github.com/InjectiveLabs/injective-ts/commit/7959791eb86a81eb32b6b10411ad503deb9bdd07))

## [1.0.323](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.322...@injectivelabs/sdk-ts@1.0.323) (2022-12-23)

### Features

- initial order hash manage ([3f1c9ec](https://github.com/InjectiveLabs/injective-ts/commit/3f1c9ec4276120df49b5692c34fc3295714fa36d))

## [1.0.322](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.321...@injectivelabs/sdk-ts@1.0.322) (2022-12-23)

### Features

- added cw20transfer args ([5861fe5](https://github.com/InjectiveLabs/injective-ts/commit/5861fe5b5fdec2cf5066d49fe950bdb579aca273))
- added cw20transfer args ([0b53619](https://github.com/InjectiveLabs/injective-ts/commit/0b53619d29fe3203c9a2bdc44cb819ca42e36f4c))

## [1.0.321](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.320...@injectivelabs/sdk-ts@1.0.321) (2022-12-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.320](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.319...@injectivelabs/sdk-ts@1.0.320) (2022-12-21)

### Bug Fixes

- handle 0 case differently in tens multiplier logic ([246ff6a](https://github.com/InjectiveLabs/injective-ts/commit/246ff6a2a574e07deb0ae8d58adccea0491f52ce))

## [1.0.319](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.318...@injectivelabs/sdk-ts@1.0.319) (2022-12-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.318](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.317...@injectivelabs/sdk-ts@1.0.318) (2022-12-20)

### Features

- removed numbers converters from utils ([36b7bcf](https://github.com/InjectiveLabs/injective-ts/commit/36b7bcf8ec7eb5ea8a815e4a808ddd0494565735))

## [1.0.317](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.316...@injectivelabs/sdk-ts@1.0.317) (2022-12-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.316](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.315...@injectivelabs/sdk-ts@1.0.316) (2022-12-20)

### Bug Fixes

- batch market update params ([4039440](https://github.com/InjectiveLabs/injective-ts/commit/40394409e3a4e421540380e69a946e57a8703308))

## [1.0.315](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.314...@injectivelabs/sdk-ts@1.0.315) (2022-12-20)

### Features

- added number flooring for chain numbers ([83eafe9](https://github.com/InjectiveLabs/injective-ts/commit/83eafe901501713263fbd39aef7238001afd2467))

## [1.0.314](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.313...@injectivelabs/sdk-ts@1.0.314) (2022-12-20)

### Bug Fixes

- minor ([cadaff2](https://github.com/InjectiveLabs/injective-ts/commit/cadaff2f3d89f54d6643b85dcfec0a2d74ff84d7))

## [1.0.313](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.312...@injectivelabs/sdk-ts@1.0.313) (2022-12-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.312](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.311...@injectivelabs/sdk-ts@1.0.312) (2022-12-20)

### Features

- cosmwasm map ([697422e](https://github.com/InjectiveLabs/injective-ts/commit/697422ed3608750f025b315236680a185e411b5f))

## [1.0.311](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.310...@injectivelabs/sdk-ts@1.0.311) (2022-12-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.310](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.309...@injectivelabs/sdk-ts@1.0.310) (2022-12-19)

### Bug Fixes

- denom client return undefined for no token denom ([29c6080](https://github.com/InjectiveLabs/injective-ts/commit/29c60809b7f785b23fa34fb0919731cdd40da42b))

## [1.0.309](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.308...@injectivelabs/sdk-ts@1.0.309) (2022-12-19)

### Bug Fixes

- funds array for MsgExecuteContract ([77dcb24](https://github.com/InjectiveLabs/injective-ts/commit/77dcb248cdc6de496235a8aa6a40a92949b02a9e))

## [1.0.308](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.307...@injectivelabs/sdk-ts@1.0.308) (2022-12-19)

### Features

- added ability to pass pk as a class to MsgBroadcastWithPk ([7ab121d](https://github.com/InjectiveLabs/injective-ts/commit/7ab121dd91f60484a61b92c05b12eafaa1e7b0c1))

## [1.0.307](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.306...@injectivelabs/sdk-ts@1.0.307) (2022-12-19)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.306](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.305...@injectivelabs/sdk-ts@1.0.306) (2022-12-18)

### Bug Fixes

- pk signing eip712 ([c042f4a](https://github.com/InjectiveLabs/injective-ts/commit/c042f4af8982fd5913ee9eb2b24220fc1d8aa910))

## [1.0.305](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.304...@injectivelabs/sdk-ts@1.0.305) (2022-12-18)

### Bug Fixes

- added eip712 sign on private key ([84b628c](https://github.com/InjectiveLabs/injective-ts/commit/84b628c967d57c977b981faeca2021d8711a0de1))

## [1.0.304](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.303...@injectivelabs/sdk-ts@1.0.304) (2022-12-17)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.303](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.302...@injectivelabs/sdk-ts@1.0.303) (2022-12-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.302](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.301...@injectivelabs/sdk-ts@1.0.302) (2022-12-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.301](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.300...@injectivelabs/sdk-ts@1.0.301) (2022-12-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.300](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.299...@injectivelabs/sdk-ts@1.0.300) (2022-12-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.299](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.298...@injectivelabs/sdk-ts@1.0.299) (2022-12-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.298](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.297...@injectivelabs/sdk-ts@1.0.298) (2022-12-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.297](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.296...@injectivelabs/sdk-ts@1.0.297) (2022-12-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.296](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.295...@injectivelabs/sdk-ts@1.0.296) (2022-12-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.295](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.294...@injectivelabs/sdk-ts@1.0.295) (2022-12-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.294](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.293...@injectivelabs/sdk-ts@1.0.294) (2022-12-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.293](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.292...@injectivelabs/sdk-ts@1.0.293) (2022-12-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.292](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.291...@injectivelabs/sdk-ts@1.0.292) (2022-12-14)

### Bug Fixes

- tx clients ([0160e7f](https://github.com/InjectiveLabs/injective-ts/commit/0160e7f24fed4ce49dd627f91390ebbc42721003))

## [1.0.291](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.290...@injectivelabs/sdk-ts@1.0.291) (2022-12-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.290](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.289...@injectivelabs/sdk-ts@1.0.290) (2022-12-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.289](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.288...@injectivelabs/sdk-ts@1.0.289) (2022-12-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.288](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.287...@injectivelabs/sdk-ts@1.0.288) (2022-12-14)

### Features

- wormhole mainnet ([600926f](https://github.com/InjectiveLabs/injective-ts/commit/600926f6e14724cfcd1d78cc0789bca15a51426a))

## [1.0.287](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.286...@injectivelabs/sdk-ts@1.0.287) (2022-12-13)

### Bug Fixes

- rounding to tick size ([c693113](https://github.com/InjectiveLabs/injective-ts/commit/c6931139e248a1c18faeb15255c9d7dc62c20404))

## [1.0.286](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.285...@injectivelabs/sdk-ts@1.0.286) (2022-12-13)

### Bug Fixes

- zeros in a number ([107c49f](https://github.com/InjectiveLabs/injective-ts/commit/107c49f63f0ed00ac4861b8ac173c2b022f78a64))

## [1.0.285](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.284...@injectivelabs/sdk-ts@1.0.285) (2022-12-13)

### Features

- added number formatters ([f13d177](https://github.com/InjectiveLabs/injective-ts/commit/f13d177c2600da39af2974318e25052ea8c63101))

## [1.0.284](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.283...@injectivelabs/sdk-ts@1.0.284) (2022-12-13)

### Features

- getExactDecimalsFromNumber ([07421dd](https://github.com/InjectiveLabs/injective-ts/commit/07421dd15884f4b89f677ea58da1a83f6a53b80d))

## [1.0.283](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.282...@injectivelabs/sdk-ts@1.0.283) (2022-12-13)

### Features

- getTensMultiplier function for handling decimals ([3b66d5d](https://github.com/InjectiveLabs/injective-ts/commit/3b66d5d8e9f608b153b11c61e0e65dad0d44041a))

## [1.0.282](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.281...@injectivelabs/sdk-ts@1.0.282) (2022-12-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.281](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.280...@injectivelabs/sdk-ts@1.0.281) (2022-12-12)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.280](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.279...@injectivelabs/sdk-ts@1.0.280) (2022-12-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.279](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.278...@injectivelabs/sdk-ts@1.0.279) (2022-12-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.278](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.277...@injectivelabs/sdk-ts@1.0.278) (2022-12-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.277](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.276...@injectivelabs/sdk-ts@1.0.277) (2022-12-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.276](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.275...@injectivelabs/sdk-ts@1.0.276) (2022-12-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.275](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.274...@injectivelabs/sdk-ts@1.0.275) (2022-12-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.274](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.273...@injectivelabs/sdk-ts@1.0.274) (2022-12-05)

### Bug Fixes

- transaction fail exception ([02be379](https://github.com/InjectiveLabs/injective-ts/commit/02be379f90d51982d4963c99d6985966fe170ab8))

## [1.0.273](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.272...@injectivelabs/sdk-ts@1.0.273) (2022-12-05)

### Bug Fixes

- transaction fail exception ([763931e](https://github.com/InjectiveLabs/injective-ts/commit/763931e21cdaca141149bff23fa9673b9dc5e5f0))

## [1.0.272](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.271...@injectivelabs/sdk-ts@1.0.272) (2022-12-05)

### Bug Fixes

- types ([95bc799](https://github.com/InjectiveLabs/injective-ts/commit/95bc799f96836a02c20ec9a3614d9751aa47e759))

## [1.0.271](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.270...@injectivelabs/sdk-ts@1.0.271) (2022-12-05)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.270](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.269...@injectivelabs/sdk-ts@1.0.270) (2022-12-05)

### Features

- explorer utils and generic types for wallet provider ([b31b3ff](https://github.com/InjectiveLabs/injective-ts/commit/b31b3ff3bf27e74208cf03f10ea8fff762b0cae9))

## [1.0.269](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.268...@injectivelabs/sdk-ts@1.0.269) (2022-12-05)

### Bug Fixes

- gas limit for contracts ([8677227](https://github.com/InjectiveLabs/injective-ts/commit/86772270ae17fbf69829243509f2c68fba7d0d6e))

## [1.0.268](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.267...@injectivelabs/sdk-ts@1.0.268) (2022-12-04)

### Bug Fixes

- timeout for rest queries ([4d64636](https://github.com/InjectiveLabs/injective-ts/commit/4d6463674ee9f1b63138d8cc7e1cb81b19e09835))

## [1.0.267](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.266...@injectivelabs/sdk-ts@1.0.267) (2022-12-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.266](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.265...@injectivelabs/sdk-ts@1.0.266) (2022-12-04)

### Bug Fixes

- cw20 send args ([c4a7518](https://github.com/InjectiveLabs/injective-ts/commit/c4a7518c20aaa6d79cb668c4ae70dc1b41023d2b))

## [1.0.265](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.264...@injectivelabs/sdk-ts@1.0.265) (2022-12-04)

### Bug Fixes

- exec args for cw20 send ([de5e9c2](https://github.com/InjectiveLabs/injective-ts/commit/de5e9c2e1e787959af2618e31b78c577c402a038))

## [1.0.264](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.263...@injectivelabs/sdk-ts@1.0.264) (2022-12-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.263](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.262...@injectivelabs/sdk-ts@1.0.263) (2022-12-04)

### Features

- token service for cw20 balances ([4850924](https://github.com/InjectiveLabs/injective-ts/commit/4850924e3caa7499eef86d794f31681120d5e7f7))

## [1.0.262](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.261...@injectivelabs/sdk-ts@1.0.262) (2022-12-04)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.261](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.260...@injectivelabs/sdk-ts@1.0.261) (2022-12-03)

### Features

- denom client ([581977b](https://github.com/InjectiveLabs/injective-ts/commit/581977b7e8534fa0e80fa8b41845b38500293ca0))

## [1.0.260](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.259...@injectivelabs/sdk-ts@1.0.260) (2022-12-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.259](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.258...@injectivelabs/sdk-ts@1.0.259) (2022-12-01)

### Bug Fixes

- explorer endpoint ([a39fd93](https://github.com/InjectiveLabs/injective-ts/commit/a39fd93143640d960b075c187d013682e119021a))

## [1.0.258](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.257...@injectivelabs/sdk-ts@1.0.258) (2022-12-01)

### Bug Fixes

- naming ([eee281a](https://github.com/InjectiveLabs/injective-ts/commit/eee281ae025dee267af5ad8d20b521a769c2487d))

## [1.0.257](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.256...@injectivelabs/sdk-ts@1.0.257) (2022-12-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.256](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.255...@injectivelabs/sdk-ts@1.0.256) (2022-12-01)

### Features

- msgExecuteContract add typing support ([866c605](https://github.com/InjectiveLabs/injective-ts/commit/866c6059d2f54826f4d799500274b0a1d8984b06))

## [1.0.255](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.254...@injectivelabs/sdk-ts@1.0.255) (2022-11-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.254](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.253...@injectivelabs/sdk-ts@1.0.254) (2022-11-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.253](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.252...@injectivelabs/sdk-ts@1.0.253) (2022-11-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.252](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.251...@injectivelabs/sdk-ts@1.0.252) (2022-11-30)

### Bug Fixes

- txresponse interface ([950461c](https://github.com/InjectiveLabs/injective-ts/commit/950461cc7695e28ec9f08ec1fed92e9cc095f317))

## [1.0.251](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.250...@injectivelabs/sdk-ts@1.0.251) (2022-11-30)

### Bug Fixes

- marketing info undefined on contract ([72dce9f](https://github.com/InjectiveLabs/injective-ts/commit/72dce9f8f8372b1ea9169356d53c53765a6c8eee))

## [1.0.250](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.249...@injectivelabs/sdk-ts@1.0.250) (2022-11-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.249](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.248...@injectivelabs/sdk-ts@1.0.249) (2022-11-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.248](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.247...@injectivelabs/sdk-ts@1.0.248) (2022-11-28)

### Features

- added token factory token type ([ad23e66](https://github.com/InjectiveLabs/injective-ts/commit/ad23e6662cc10d721da0545368642e6a6ae0665d))

## [1.0.247](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.246...@injectivelabs/sdk-ts@1.0.247) (2022-11-28)

### Features

- cw20 adapter contract args ([036fc91](https://github.com/InjectiveLabs/injective-ts/commit/036fc9186ef43bd49cc526555dba0431f63a5935))

## [1.0.246](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.245...@injectivelabs/sdk-ts@1.0.246) (2022-11-28)

### Bug Fixes

- args for sending cw20 ([b2395de](https://github.com/InjectiveLabs/injective-ts/commit/b2395dece37532562c9fcba442ec6733cf6e5fce))

## [1.0.245](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.244...@injectivelabs/sdk-ts@1.0.245) (2022-11-28)

### Features

- cw20 send args ([b36e5ed](https://github.com/InjectiveLabs/injective-ts/commit/b36e5ed5e2bfbcb5e5648c6a4257a778b3784a2a))

## [1.0.244](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.243...@injectivelabs/sdk-ts@1.0.244) (2022-11-28)

### Features

- cw20 send args ([22ee502](https://github.com/InjectiveLabs/injective-ts/commit/22ee502ba8c7f6af165c85db15b21f5c826aed93))

## [1.0.243](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.242...@injectivelabs/sdk-ts@1.0.243) (2022-11-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.242](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.241...@injectivelabs/sdk-ts@1.0.242) (2022-11-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.241](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.240...@injectivelabs/sdk-ts@1.0.241) (2022-11-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.240](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.239...@injectivelabs/sdk-ts@1.0.240) (2022-11-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.239](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.238...@injectivelabs/sdk-ts@1.0.239) (2022-11-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.238](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.237...@injectivelabs/sdk-ts@1.0.238) (2022-11-23)

### Bug Fixes

- projx typings ([6a3c532](https://github.com/InjectiveLabs/injective-ts/commit/6a3c53280cd9e63c682d18567277628a2d25cd15))

## [1.0.237](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.236...@injectivelabs/sdk-ts@1.0.237) (2022-11-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.236](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.235...@injectivelabs/sdk-ts@1.0.236) (2022-11-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.235](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.234...@injectivelabs/sdk-ts@1.0.235) (2022-11-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.234](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.233...@injectivelabs/sdk-ts@1.0.234) (2022-11-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.233](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.232...@injectivelabs/sdk-ts@1.0.233) (2022-11-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.232](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.231...@injectivelabs/sdk-ts@1.0.232) (2022-11-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.231](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.230...@injectivelabs/sdk-ts@1.0.231) (2022-11-22)

### Bug Fixes

- tx polling interval ([402189f](https://github.com/InjectiveLabs/injective-ts/commit/402189f62b41e6cbfd8f8ae402ab323610131d1d))

## [1.0.230](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.229...@injectivelabs/sdk-ts@1.0.230) (2022-11-22)

### Bug Fixes

- tx polling interval ([536e10f](https://github.com/InjectiveLabs/injective-ts/commit/536e10f35257d8967fa2aff1ab97513d999be3f7))

## [1.0.229](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.228...@injectivelabs/sdk-ts@1.0.229) (2022-11-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.228](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.227...@injectivelabs/sdk-ts@1.0.228) (2022-11-21)

### Bug Fixes

- timeout and blocktime ([b4e11cd](https://github.com/InjectiveLabs/injective-ts/commit/b4e11cdcafda875ab5a5cca00b8e818a55a9bf8a))

## [1.0.227](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.226...@injectivelabs/sdk-ts@1.0.227) (2022-11-21)

### Bug Fixes

- export for MsgExternalTransfer ([f241a94](https://github.com/InjectiveLabs/injective-ts/commit/f241a94ed8685658a206cb74c60d634deb11c3e7))

## [1.0.226](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.225...@injectivelabs/sdk-ts@1.0.226) (2022-11-21)

### Features

- add grpc support for ninja api ([0445623](https://github.com/InjectiveLabs/injective-ts/commit/04456234d2efa44a692beeccaf89e38894e71081))

## [1.0.225](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.224...@injectivelabs/sdk-ts@1.0.225) (2022-11-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.224](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.223...@injectivelabs/sdk-ts@1.0.224) (2022-11-17)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.223](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.222...@injectivelabs/sdk-ts@1.0.223) (2022-11-17)

### Features

- add msgExternalTransfer ([d9b5444](https://github.com/InjectiveLabs/injective-ts/commit/d9b5444e93bbbb323e5ad6fdb84ff00d751a6196))

## [1.0.222](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.221...@injectivelabs/sdk-ts@1.0.222) (2022-11-16)

### Bug Fixes

- error parsing ([bec75d4](https://github.com/InjectiveLabs/injective-ts/commit/bec75d4ef132ae29f2328f8f71a961c5cf04c4c1))

## [1.0.221](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.220...@injectivelabs/sdk-ts@1.0.221) (2022-11-16)

### Bug Fixes

- error parsing ([def2bf5](https://github.com/InjectiveLabs/injective-ts/commit/def2bf592e8bd0fc092704aaf2c45ead6be19e57))

## [1.0.220](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.219...@injectivelabs/sdk-ts@1.0.220) (2022-11-16)

### Bug Fixes

- not found tx polling ([92f2bc3](https://github.com/InjectiveLabs/injective-ts/commit/92f2bc32a9c9e7e6fa5112141ce0dee25b995202))

## [1.0.219](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.218...@injectivelabs/sdk-ts@1.0.219) (2022-11-16)

### Bug Fixes

- not found tx polling ([226f2bf](https://github.com/InjectiveLabs/injective-ts/commit/226f2bf6a4368d33cd17428f87752fe6bb56a6c5))

## [1.0.218](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.217...@injectivelabs/sdk-ts@1.0.218) (2022-11-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.217](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.216...@injectivelabs/sdk-ts@1.0.217) (2022-11-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.216](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.215...@injectivelabs/sdk-ts@1.0.216) (2022-11-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.215](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.214...@injectivelabs/sdk-ts@1.0.215) (2022-11-14)

### Features

- pagination for binary options markets ([e9ce348](https://github.com/InjectiveLabs/injective-ts/commit/e9ce3489bb20b118ecb7d2ff7d3aabb0415bad4b))

## [1.0.214](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.213...@injectivelabs/sdk-ts@1.0.214) (2022-11-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.213](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.212...@injectivelabs/sdk-ts@1.0.213) (2022-11-14)

### Features

- bridge-ts initial ([4320b1c](https://github.com/InjectiveLabs/injective-ts/commit/4320b1c256b58caec7a08c33854f0bdde9681c3c))

## [1.0.212](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.211...@injectivelabs/sdk-ts@1.0.212) (2022-11-10)

### Bug Fixes

- MsgSubmitTextProposal type not found issue ([9cb4db7](https://github.com/InjectiveLabs/injective-ts/commit/9cb4db7e80454bf2655e61dbfe0715a7487ba743))

## [1.0.211](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.210...@injectivelabs/sdk-ts@1.0.211) (2022-11-07)

### Features

- MsgBroadcaster in sdk-ts ([7747ea8](https://github.com/InjectiveLabs/injective-ts/commit/7747ea8f6aaa61f9a81fde8178a10b2c48535775))

## [1.0.210](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.209...@injectivelabs/sdk-ts@1.0.210) (2022-11-07)

### Features

- MsgBroadcasterLocal for broadcasting tx in a node environment ([8fd484b](https://github.com/InjectiveLabs/injective-ts/commit/8fd484b7393db1d9be90da869c4de5a7dafff479))

## [1.0.209](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.208...@injectivelabs/sdk-ts@1.0.209) (2022-11-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.208](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.207...@injectivelabs/sdk-ts@1.0.208) (2022-11-06)

### Features

- msgBroadcaster on wallet-ts ([d06a3db](https://github.com/InjectiveLabs/injective-ts/commit/d06a3db58400577a0c4cfdf6bc2b56659fac734a))

## [1.0.207](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.206...@injectivelabs/sdk-ts@1.0.207) (2022-11-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.206](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.205...@injectivelabs/sdk-ts@1.0.206) (2022-11-04)

### Bug Fixes

- console logs ([046c171](https://github.com/InjectiveLabs/injective-ts/commit/046c171e1e58e2bf8ba4ada3871a846e1dc013cc))

## [1.0.205](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.204...@injectivelabs/sdk-ts@1.0.205) (2022-11-04)

### Features

- fee payer fetching from indexer api ([439f245](https://github.com/InjectiveLabs/injective-ts/commit/439f245e52037d0f5d06a79402cad08918c25512))

## [1.0.204](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.203...@injectivelabs/sdk-ts@1.0.204) (2022-11-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.203](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.202...@injectivelabs/sdk-ts@1.0.203) (2022-11-03)

### Features

- added multiple signers while creating a transaction ([c10442d](https://github.com/InjectiveLabs/injective-ts/commit/c10442d172fa49a479f2e4708c3c8a5ed7ef6e77))

## [1.0.202](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.201...@injectivelabs/sdk-ts@1.0.202) (2022-11-02)

### Features

- ethereum native wallets optional on wallet-ts ([15300dc](https://github.com/InjectiveLabs/injective-ts/commit/15300dc2a182d7e557b5337847ba7a81977e1ce8))

## [1.0.201](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.200...@injectivelabs/sdk-ts@1.0.201) (2022-11-02)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.200](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.199...@injectivelabs/sdk-ts@1.0.200) (2022-11-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.199](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.198...@injectivelabs/sdk-ts@1.0.199) (2022-10-31)

### Bug Fixes

- eip712 for msgExecuteContract ([b923f1c](https://github.com/InjectiveLabs/injective-ts/commit/b923f1cd6737587f4975fdafee2553c22ec2bd4e))

## [1.0.198](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.197...@injectivelabs/sdk-ts@1.0.198) (2022-10-28)

### Bug Fixes

- ethers import ([3ea3eae](https://github.com/InjectiveLabs/injective-ts/commit/3ea3eae37f7ab3126d0d67d2a3154d7badc082bd))

## [1.0.197](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.196...@injectivelabs/sdk-ts@1.0.197) (2022-10-28)

### Bug Fixes

- signature propert typing ([da77d09](https://github.com/InjectiveLabs/injective-ts/commit/da77d09f2e36b826fdec3b9fc8a5e791aeec5571))

## [1.0.196](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.195...@injectivelabs/sdk-ts@1.0.196) (2022-10-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.195](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.194...@injectivelabs/sdk-ts@1.0.195) (2022-10-28)

### Bug Fixes

- yarn version ([b51c8d9](https://github.com/InjectiveLabs/injective-ts/commit/b51c8d907c9b15ad324f55b8efcdb12863c455f9))

## [1.0.194](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.193...@injectivelabs/sdk-ts@1.0.194) (2022-10-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.193](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.192...@injectivelabs/sdk-ts@1.0.193) (2022-10-28)

### Bug Fixes

- keplrReclaimFunds message ([dd2136e](https://github.com/InjectiveLabs/injective-ts/commit/dd2136ee3c62ab3dcdc3141928f3ef56446200e1))

## [1.0.192](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.190...@injectivelabs/sdk-ts@1.0.192) (2022-10-28)

### Features

- msg multi execute ([2f67682](https://github.com/InjectiveLabs/injective-ts/commit/2f67682e030be0dc3fd7eeee87c24891ad605dd2))

## [1.0.190](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.190...@injectivelabs/sdk-ts@1.0.190) (2022-10-28)

### Features

- msg multi execute ([2f67682](https://github.com/InjectiveLabs/injective-ts/commit/2f67682e030be0dc3fd7eeee87c24891ad605dd2))

## [1.0.190](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.189...@injectivelabs/sdk-ts@1.0.190) (2022-10-28)

### Features

- keplr reclaim funds ([6f35de5](https://github.com/InjectiveLabs/injective-ts/commit/6f35de51585a87dd47d37d4a34b496b234f2f185))

## [1.0.189](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.188...@injectivelabs/sdk-ts@1.0.189) (2022-10-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.188](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.187...@injectivelabs/sdk-ts@1.0.188) (2022-10-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.187](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.186...@injectivelabs/sdk-ts@1.0.187) (2022-10-27)

### Features

- added msgEditValidator and msgWithdrawValidatorCommission ([09a03a5](https://github.com/InjectiveLabs/injective-ts/commit/09a03a548035c11c571d238da90f15b047fdf96a))

## [1.0.186](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.185...@injectivelabs/sdk-ts@1.0.186) (2022-10-26)

### Bug Fixes

- indexerRestMarketChronosApi casing ([335757f](https://github.com/InjectiveLabs/injective-ts/commit/335757f584e25ee64c5ad05732ace69ae7a11f9d))

## [1.0.185](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.184...@injectivelabs/sdk-ts@1.0.185) (2022-10-25)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.184](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.183...@injectivelabs/sdk-ts@1.0.184) (2022-10-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.183](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.182...@injectivelabs/sdk-ts@1.0.183) (2022-10-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.182](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.181...@injectivelabs/sdk-ts@1.0.182) (2022-10-24)

### Bug Fixes

- sdk-ts README.md (format) ([27b9440](https://github.com/InjectiveLabs/injective-ts/commit/27b9440bdae644833ae02adc6661a234dfe6a202))
- sdk-ts README.md (hex string type) ([c107257](https://github.com/InjectiveLabs/injective-ts/commit/c107257d4e3210f7e537133db2d08e335003d88e))
- sdk-ts README.md (PrivateKey import path) ([9d6f6cb](https://github.com/InjectiveLabs/injective-ts/commit/9d6f6cb572fdcb4a2b18e6c502d284f193ed4d6c))
- sdk-ts README.md (pubKey type) ([0fd1a4f](https://github.com/InjectiveLabs/injective-ts/commit/0fd1a4f29f1281fcb0090e06d7a169be95baa77b))

### Features

- minor util and readme update ([9be782b](https://github.com/InjectiveLabs/injective-ts/commit/9be782bf5f085743bdb631ba601368a02abca795))

## [1.0.181](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.180...@injectivelabs/sdk-ts@1.0.181) (2022-10-21)

### Features

- added cosmos fee delegation support ([f3e2b0f](https://github.com/InjectiveLabs/injective-ts/commit/f3e2b0ff1bdea77c8b408c7fa88a32c610063000))

## [1.0.180](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.179...@injectivelabs/sdk-ts@1.0.180) (2022-10-20)

### Features

- msgMultiExecute ([c53cb78](https://github.com/InjectiveLabs/injective-ts/commit/c53cb78ec5a4df95b376eb1a4db173e9f5336280))

## [1.0.179](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.178...@injectivelabs/sdk-ts@1.0.179) (2022-10-20)

### Features

- commented msgReclaimLockedFunds ([316af92](https://github.com/InjectiveLabs/injective-ts/commit/316af9266cc84e57a8b0b1c48d5a1e3149b36486))

## [1.0.178](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.177...@injectivelabs/sdk-ts@1.0.178) (2022-10-20)

### Bug Fixes

- sdk-ts docs ([cc4bf85](https://github.com/InjectiveLabs/injective-ts/commit/cc4bf85c33389e313b7263f11091012f7f6e91ee))

### Features

- msgReclaimLockedFunds ([b6b7ce8](https://github.com/InjectiveLabs/injective-ts/commit/b6b7ce8d4c7e644623068e2f5afaedb12f102a33))

## [1.0.177](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.176...@injectivelabs/sdk-ts@1.0.177) (2022-10-19)

### Bug Fixes

- export MsgTransferAndExecute ([2c0e7dc](https://github.com/InjectiveLabs/injective-ts/commit/2c0e7dc1be7ff8a00cb27b890e84ee58a7552033))

## [1.0.176](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.175...@injectivelabs/sdk-ts@1.0.176) (2022-10-19)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.175](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.174...@injectivelabs/sdk-ts@1.0.175) (2022-10-19)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.174](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.173...@injectivelabs/sdk-ts@1.0.174) (2022-10-19)

### Features

- msgTransferAndExecute support ([4a2c286](https://github.com/InjectiveLabs/injective-ts/commit/4a2c286b1e964b9f97fe7be0439208fe376d7d17))

## [1.0.173](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.172...@injectivelabs/sdk-ts@1.0.173) (2022-10-12)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.172](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.171...@injectivelabs/sdk-ts@1.0.172) (2022-10-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.171](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.170...@injectivelabs/sdk-ts@1.0.171) (2022-10-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.170](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.169...@injectivelabs/sdk-ts@1.0.170) (2022-10-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.169](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.168...@injectivelabs/sdk-ts@1.0.169) (2022-10-05)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.168](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.167...@injectivelabs/sdk-ts@1.0.168) (2022-10-03)

### Bug Fixes

- cosmoshub endpoints ([3ddce39](https://github.com/InjectiveLabs/injective-ts/commit/3ddce399160c66853054d99bc05bc5fbf9b97291))

## [1.0.167](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.166...@injectivelabs/sdk-ts@1.0.167) (2022-09-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.166](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.165...@injectivelabs/sdk-ts@1.0.166) (2022-09-28)

### Features

- comsostation eth version ([a10d278](https://github.com/InjectiveLabs/injective-ts/commit/a10d27849b593b6cedec2d66e7d08e691f0a0c47))

## [1.0.165](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.164...@injectivelabs/sdk-ts@1.0.165) (2022-09-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.164](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.163...@injectivelabs/sdk-ts@1.0.164) (2022-09-28)

### Bug Fixes

- conditional check ([573d75a](https://github.com/InjectiveLabs/injective-ts/commit/573d75a0f9e680e9c7a759ba86070eb01d363b21))

## [1.0.163](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.162...@injectivelabs/sdk-ts@1.0.163) (2022-09-27)

### Bug Fixes

- react native check ([b7815b9](https://github.com/InjectiveLabs/injective-ts/commit/b7815b91f7fa63d049c65e8a854e43590ff3f9fe))

## [1.0.162](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.161...@injectivelabs/sdk-ts@1.0.162) (2022-09-27)

### Features

- leaderboard ([f69cee4](https://github.com/InjectiveLabs/injective-ts/commit/f69cee45ca4354333056cde17c35d8537ff37fb8))
- leaderboard - restore shx & link-module-alias ([71236e2](https://github.com/InjectiveLabs/injective-ts/commit/71236e20528a5306216628be96ab022e97bf988c))

## [1.0.161](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.160...@injectivelabs/sdk-ts@1.0.161) (2022-09-26)

### Bug Fixes

- order of conditionals ([20b78e7](https://github.com/InjectiveLabs/injective-ts/commit/20b78e7fc3101799e7ebd049cbbfd40874e4218a))

## [1.0.160](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.159...@injectivelabs/sdk-ts@1.0.160) (2022-09-25)

### Bug Fixes

- pubkey derivation ([b487019](https://github.com/InjectiveLabs/injective-ts/commit/b487019075dca1564aba55dcadb5cda4fa57b49a))

## [1.0.159](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.158...@injectivelabs/sdk-ts@1.0.159) (2022-09-25)

### Bug Fixes

- helpers export ([f0a51e2](https://github.com/InjectiveLabs/injective-ts/commit/f0a51e20862280ec78a69f78dafef8039db22836))

## [1.0.158](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.157...@injectivelabs/sdk-ts@1.0.158) (2022-09-25)

### Features

- from bytes pub key ([c7c744b](https://github.com/InjectiveLabs/injective-ts/commit/c7c744b14d9d8e5d59093ddd297592c49a901bc0))

## [1.0.157](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.156...@injectivelabs/sdk-ts@1.0.157) (2022-09-25)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.156](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.155...@injectivelabs/sdk-ts@1.0.156) (2022-09-24)

### Bug Fixes

- explorer rpc service ([6ab6652](https://github.com/InjectiveLabs/injective-ts/commit/6ab6652af86efc47b300446ea9b7db1cfe074ffc))

## [1.0.155](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.154...@injectivelabs/sdk-ts@1.0.155) (2022-09-23)

### Bug Fixes

- exceptions thrown ([5c6f2ea](https://github.com/InjectiveLabs/injective-ts/commit/5c6f2eacf241a42b52b9e22e1ddf20647aa8d360))

## [1.0.154](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.153...@injectivelabs/sdk-ts@1.0.154) (2022-09-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.153](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.152...@injectivelabs/sdk-ts@1.0.153) (2022-09-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.152](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.151...@injectivelabs/sdk-ts@1.0.152) (2022-09-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.151](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.150...@injectivelabs/sdk-ts@1.0.151) (2022-09-21)

### Features

- indexer api bump ([76635c2](https://github.com/InjectiveLabs/injective-ts/commit/76635c2e6d725c68ed10bf47171b8a4e3bda9432))

## [1.0.150](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.149...@injectivelabs/sdk-ts@1.0.150) (2022-09-21)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.149](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.148...@injectivelabs/sdk-ts@1.0.149) (2022-09-21)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.148](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.147...@injectivelabs/sdk-ts@1.0.148) (2022-09-21)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.147](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.146...@injectivelabs/sdk-ts@1.0.147) (2022-09-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.146](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.145...@injectivelabs/sdk-ts@1.0.146) (2022-09-20)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.145](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.144...@injectivelabs/sdk-ts@1.0.145) (2022-09-20)

### Features

- transaction error handling ([d0bc738](https://github.com/InjectiveLabs/injective-ts/commit/d0bc738ab4b99248b81e3387dba5914974ae0c17))

## [1.0.144](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.143...@injectivelabs/sdk-ts@1.0.144) (2022-09-20)

### Features

- exceptions part 2 ([1919620](https://github.com/InjectiveLabs/injective-ts/commit/191962094f9ec7036c54425e35c6aa476c70ea79))
- initial exceptions setup ([6da9f2e](https://github.com/InjectiveLabs/injective-ts/commit/6da9f2eb2df2fcd2995fc9cd25a615dc607da253))

## [1.0.143](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.142...@injectivelabs/sdk-ts@1.0.143) (2022-09-19)

### Bug Fixes

- auth parsing for different cosmos accounts ([eb8ebf0](https://github.com/InjectiveLabs/injective-ts/commit/eb8ebf0ce1d4ee40134c685f0dee0f9f5367a4ea))

## [1.0.142](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.141...@injectivelabs/sdk-ts@1.0.142) (2022-09-19)

### Bug Fixes

- base account parsing ([f680ece](https://github.com/InjectiveLabs/injective-ts/commit/f680ece4c4e657d6b0efdbcab1d2bf3c542ba135))

## [1.0.141](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.140...@injectivelabs/sdk-ts@1.0.141) (2022-09-19)

### Bug Fixes

- minor condition check ([418431c](https://github.com/InjectiveLabs/injective-ts/commit/418431cb7f594c2252a6534e01b30b749d084a85))

## [1.0.140](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.139...@injectivelabs/sdk-ts@1.0.140) (2022-09-19)

### Features

- helper functions for prepping a transaction ([3c9a806](https://github.com/InjectiveLabs/injective-ts/commit/3c9a8067f18ef0cbb37e2e09f2534245f35efb82))

## [1.0.139](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.138...@injectivelabs/sdk-ts@1.0.139) (2022-09-19)

### Bug Fixes

- window obj removed from wallet instance ([2a51b62](https://github.com/InjectiveLabs/injective-ts/commit/2a51b62eb0c6259326d275cd76b3e74c8a2a818e))

## [1.0.138](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.137...@injectivelabs/sdk-ts@1.0.138) (2022-09-19)

### Bug Fixes

- exports ([a232ce7](https://github.com/InjectiveLabs/injective-ts/commit/a232ce7ad3f22247ba10ba0ef22aae0f6b0c59bc))

## [1.0.137](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.136...@injectivelabs/sdk-ts@1.0.137) (2022-09-19)

### Features

- cosmos sdk doc convenient method ([8b8dab7](https://github.com/InjectiveLabs/injective-ts/commit/8b8dab7f25b657f4419ec916823807336548852d))

## [1.0.136](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.135...@injectivelabs/sdk-ts@1.0.136) (2022-09-19)

### Features

- unified tx clients ([e404930](https://github.com/InjectiveLabs/injective-ts/commit/e404930c4fe095972c135bd982d7287cdd19dddd))

## [1.0.135](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.134...@injectivelabs/sdk-ts@1.0.135) (2022-09-19)

### Bug Fixes

- time utils export ([90eb637](https://github.com/InjectiveLabs/injective-ts/commit/90eb637c61d92b6bf83b3ac4b8516f5c8fcf77b1))

## [1.0.134](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.133...@injectivelabs/sdk-ts@1.0.134) (2022-09-19)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.133](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.132...@injectivelabs/sdk-ts@1.0.133) (2022-09-18)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.132](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.131...@injectivelabs/sdk-ts@1.0.132) (2022-09-15)

### Bug Fixes

- added executionSide prop to trade objects ([#78](https://github.com/InjectiveLabs/injective-ts/issues/78)) ([35da59c](https://github.com/InjectiveLabs/injective-ts/commit/35da59c33c9fb8a198306b4bbcaf27dd407a4fda))
- minor todos ([b661ec9](https://github.com/InjectiveLabs/injective-ts/commit/b661ec9f38030c51c7cae67754ff30557e2f9275))

## [1.0.131](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.130...@injectivelabs/sdk-ts@1.0.131) (2022-09-15)

### Features

- add unit test for remaining eip 712 messages ([#77](https://github.com/InjectiveLabs/injective-ts/issues/77)) ([2584aa0](https://github.com/InjectiveLabs/injective-ts/commit/2584aa09eb3f410f911509a23aca753ba696d773))

## [1.0.130](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.127...@injectivelabs/sdk-ts@1.0.130) (2022-09-14)

### Features

- add unit test coverage for eip712 messages ([#75](https://github.com/InjectiveLabs/injective-ts/issues/75)) ([cf7e2fd](https://github.com/InjectiveLabs/injective-ts/commit/cf7e2fde727979fcf2187385d72b96efbed6d61a))

## [1.0.129](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.128...@injectivelabs/sdk-ts@1.0.129) (2022-09-14)

### Bug Fixes

- lgtm ([55ca9bb](https://github.com/InjectiveLabs/injective-ts/commit/55ca9bb8330462d38518812894af65bee395ff49))

## [1.0.128](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.127...@injectivelabs/sdk-ts@1.0.128) (2022-09-14)

### Features

- add unit test coverage for cosmos bank MsgSend message ([78a269c](https://github.com/InjectiveLabs/injective-ts/commit/78a269ce62bc3f24ae68f9bdffa49fe2dace54af))
- add unit test coverage for cosmos distribution MsgWithdrawDelegatorReward message ([0f8551d](https://github.com/InjectiveLabs/injective-ts/commit/0f8551d7a61aa4d531fcf0bf76214aac9d4a6584))
- add unit test coverage for cosmos gov MsgDeposit message ([d554213](https://github.com/InjectiveLabs/injective-ts/commit/d55421360d74bb31ddbf421d9eede100e6f00901))
- add unit test coverage for cosmos gov MsgVote message ([eb3f044](https://github.com/InjectiveLabs/injective-ts/commit/eb3f04417a5a16f987080d1586e077f88743d482))
- add unit test coverage for cosmos staking MsgBeginRedelegate message ([752f8bc](https://github.com/InjectiveLabs/injective-ts/commit/752f8bc7e7b627384949f354b03d737693062d4c))
- add unit test coverage for cosmos staking MsgDelegate message ([8992ef0](https://github.com/InjectiveLabs/injective-ts/commit/8992ef064314fd505f0c4a9c6890e4d97dca3512))
- add unit test coverage for cosmos staking MsgUndelegate message ([5c3da5b](https://github.com/InjectiveLabs/injective-ts/commit/5c3da5b578d1a02ad80f5dfdb8321f887414605e))
- add unit test coverage for injective exchange MsgCreateBinaryOptionsLimitOrder message ([a05159c](https://github.com/InjectiveLabs/injective-ts/commit/a05159c46479475abd726f27c1f3fb606040f824))
- add unit test coverage for injective exchange MsgCreateBinaryOptionsMarketOrder message ([2832942](https://github.com/InjectiveLabs/injective-ts/commit/283294239845fcbf437d914c2d1dbf2696ddd9bc))
- add unit test coverage for injective exchange MsgCreateDerivativeLimitOrder message ([712480d](https://github.com/InjectiveLabs/injective-ts/commit/712480de1238f26bf1bf16ac65d684a99b2bf2c5))
- add unit test coverage for injective exchange MsgCreateDerivativeMarketOrder message ([0af0813](https://github.com/InjectiveLabs/injective-ts/commit/0af0813cf08411d5824b5c1aa4eb31e0322241a3))
- add unit test coverage for injective exchange MsgCreateSpotLimitOrder message ([05f4eb5](https://github.com/InjectiveLabs/injective-ts/commit/05f4eb5b0520b005e7ecf3120789947e647cc40a))
- add unit test coverage for injective exchange MsgCreateSpotMarketOrder message ([a674677](https://github.com/InjectiveLabs/injective-ts/commit/a6746770967dfc8635b52162d24abe6520f096e7))
- add unit test coverage for injective exchange MsgDeposit message ([068fe70](https://github.com/InjectiveLabs/injective-ts/commit/068fe70a35a447a816e123c74a3c89e29d909810))
- add unit test coverage for injective exchange MsgIncreasePositionMargin message ([cb98d2c](https://github.com/InjectiveLabs/injective-ts/commit/cb98d2c6b42fa612ba4e7b976f537341ade5ea3d))
- add unit test coverage for injective exchange MsgInstantSpotMarketLaunch message ([27e4ce7](https://github.com/InjectiveLabs/injective-ts/commit/27e4ce7aa997dc30fca77e8302215bc573e3ee67))
- add unit test coverage for injective exchange MsgWithdraw message ([e369a93](https://github.com/InjectiveLabs/injective-ts/commit/e369a93778c9953f16d78eb406f4b8e7fe0c7165))
- add unit test coverage for injective insurance MsgCreateInsuranceFund message ([4eb34e0](https://github.com/InjectiveLabs/injective-ts/commit/4eb34e02a2f9bdb28919aa080acc10f6ab08aa25))
- add unit test coverage for injective insurance MsgRequestRedemption message ([4944809](https://github.com/InjectiveLabs/injective-ts/commit/494480941306a5132fdf96f0a6e3a3eadc17aa75))
- add unit test coverage for injective insurance MsgUnderwrite message ([b2e280a](https://github.com/InjectiveLabs/injective-ts/commit/b2e280a8e0e2209a5d1ee4306bbaa9485051711b))
- path mapping ([692362d](https://github.com/InjectiveLabs/injective-ts/commit/692362db2fe44f2a1418fd61de29d798f7044dfb))

## [1.0.127](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.126...@injectivelabs/sdk-ts@1.0.127) (2022-09-14)

### Features

- jest setup, msgBid unit tests ([9caa08f](https://github.com/InjectiveLabs/injective-ts/commit/9caa08f68617661dc0d675c3238bbf6592b494f4))

## [1.0.126](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.125...@injectivelabs/sdk-ts@1.0.126) (2022-09-14)

### Bug Fixes

- insurance fund eip712 msg ([cccb603](https://github.com/InjectiveLabs/injective-ts/commit/cccb603aca811f2661ff58c4aa280901218e155a))

## [1.0.125](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.124...@injectivelabs/sdk-ts@1.0.125) (2022-09-14)

### Bug Fixes

- eip712 improvements ([bfd0f05](https://github.com/InjectiveLabs/injective-ts/commit/bfd0f057bb282e85251c9c56e71289d630dee2a5))

## [1.0.124](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.123...@injectivelabs/sdk-ts@1.0.124) (2022-09-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.123](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.122...@injectivelabs/sdk-ts@1.0.123) (2022-09-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.122](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.121...@injectivelabs/sdk-ts@1.0.122) (2022-09-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.121](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.120...@injectivelabs/sdk-ts@1.0.121) (2022-09-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.120](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.119...@injectivelabs/sdk-ts@1.0.120) (2022-09-09)

### Bug Fixes

- tx broadcast clients ([72fb92a](https://github.com/InjectiveLabs/injective-ts/commit/72fb92a54334a6aa6d943c29f2b9c5bba699a778))

## [1.0.119](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.118...@injectivelabs/sdk-ts@1.0.119) (2022-09-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.118](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.117...@injectivelabs/sdk-ts@1.0.118) (2022-09-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.117](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.116...@injectivelabs/sdk-ts@1.0.117) (2022-09-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.116](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.115...@injectivelabs/sdk-ts@1.0.116) (2022-09-07)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.115](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.114...@injectivelabs/sdk-ts@1.0.115) (2022-09-01)

### Features

- order history stream ([#72](https://github.com/InjectiveLabs/injective-ts/issues/72)) ([4a1f6cd](https://github.com/InjectiveLabs/injective-ts/commit/4a1f6cd68d081bc74574b08c1a65239d8a2e6d4a))

## [1.0.114](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.113...@injectivelabs/sdk-ts@1.0.114) (2022-08-31)

### Bug Fixes

- add order mask to batch cancel spot order message ([#71](https://github.com/InjectiveLabs/injective-ts/issues/71)) ([def9257](https://github.com/InjectiveLabs/injective-ts/commit/def9257f957fe0f543ca02550fae86f9a59bc642))

## [1.0.113](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.112...@injectivelabs/sdk-ts@1.0.113) (2022-08-30)

### Features

- order history ([#70](https://github.com/InjectiveLabs/injective-ts/issues/70)) ([74dcc0f](https://github.com/InjectiveLabs/injective-ts/commit/74dcc0f1373c3cc13934cee8b70095df17032cb4))

## [1.0.112](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.111...@injectivelabs/sdk-ts@1.0.112) (2022-08-29)

### Features

- order history ([#69](https://github.com/InjectiveLabs/injective-ts/issues/69)) ([6bd506e](https://github.com/InjectiveLabs/injective-ts/commit/6bd506e24dbc549ebe921dacc7d8af68928ce372))

## [1.0.111](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.110...@injectivelabs/sdk-ts@1.0.111) (2022-08-29)

### Features

- order history ([#68](https://github.com/InjectiveLabs/injective-ts/issues/68)) ([9e431a7](https://github.com/InjectiveLabs/injective-ts/commit/9e431a73f3f89dae4a295f4b6a77c6efbafee9ea))

## [1.0.110](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.109...@injectivelabs/sdk-ts@1.0.110) (2022-08-29)

### Features

- order history updates ([#67](https://github.com/InjectiveLabs/injective-ts/issues/67)) ([43d8472](https://github.com/InjectiveLabs/injective-ts/commit/43d84721c97fa964ef61eece8e60bcbcdd26f999))

## [1.0.109](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.108...@injectivelabs/sdk-ts@1.0.109) (2022-08-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.108](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.107...@injectivelabs/sdk-ts@1.0.108) (2022-08-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.107](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.106...@injectivelabs/sdk-ts@1.0.107) (2022-08-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.106](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.105...@injectivelabs/sdk-ts@1.0.106) (2022-08-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.105](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.104...@injectivelabs/sdk-ts@1.0.105) (2022-08-26)

### Bug Fixes

- trigger price ([9a9294b](https://github.com/InjectiveLabs/injective-ts/commit/9a9294b46ea3b40125ae597ef3b1f07ab893412a))

## [1.0.104](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.103...@injectivelabs/sdk-ts@1.0.104) (2022-08-26)

### Bug Fixes

- snakecase fields ([96b5b47](https://github.com/InjectiveLabs/injective-ts/commit/96b5b4763f9b672e1b8e9b7782fce36671e0edd7))

### Features

- order history ([#65](https://github.com/InjectiveLabs/injective-ts/issues/65)) ([c179735](https://github.com/InjectiveLabs/injective-ts/commit/c179735d5b3f7168a017073720721332e44319cb))

## [1.0.103](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.102...@injectivelabs/sdk-ts@1.0.103) (2022-08-25)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.102](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.101...@injectivelabs/sdk-ts@1.0.102) (2022-08-24)

### Features

- update order object ([2857701](https://github.com/InjectiveLabs/injective-ts/commit/2857701d89c94db9e2377e4efc7f970bdb58fb0c))

## [1.0.101](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.100...@injectivelabs/sdk-ts@1.0.101) (2022-08-24)

### Bug Fixes

- memo as a number ([1ce2d9c](https://github.com/InjectiveLabs/injective-ts/commit/1ce2d9c897b0dcc134410056d53dd72b0b231449))

## [1.0.100](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.99...@injectivelabs/sdk-ts@1.0.100) (2022-08-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.99](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.98...@injectivelabs/sdk-ts@1.0.99) (2022-08-24)

### Bug Fixes

- orderMask field ([9670e1e](https://github.com/InjectiveLabs/injective-ts/commit/9670e1ecb0621a73aa75c7df37b9c5bf27dc9828))

## [1.0.98](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.97...@injectivelabs/sdk-ts@1.0.98) (2022-08-24)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.97](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.96...@injectivelabs/sdk-ts@1.0.97) (2022-08-23)

### Bug Fixes

- orderMask and twitter link ([0474569](https://github.com/InjectiveLabs/injective-ts/commit/047456994f5233ed099174cd7f96a34f29dfbce8))

## [1.0.96](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.95...@injectivelabs/sdk-ts@1.0.96) (2022-08-23)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.95](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.94...@injectivelabs/sdk-ts@1.0.95) (2022-08-22)

### Features

- cancelation order bitmask ([70fed5e](https://github.com/InjectiveLabs/injective-ts/commit/70fed5ee71bd3ea4b5624096e6cd73ed2d43120c))

## [1.0.94](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.93...@injectivelabs/sdk-ts@1.0.94) (2022-08-22)

### Bug Fixes

- eip712 typing order ([10e4b6d](https://github.com/InjectiveLabs/injective-ts/commit/10e4b6dad70ae7130a73f23097311f40d61f4859))

## [1.0.93](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.92...@injectivelabs/sdk-ts@1.0.93) (2022-08-22)

### Features

- order history ([#64](https://github.com/InjectiveLabs/injective-ts/issues/64)) ([d86021a](https://github.com/InjectiveLabs/injective-ts/commit/d86021a64228e10e6cd72f97109a114fd698a3ca))

## [1.0.92](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.91...@injectivelabs/sdk-ts@1.0.92) (2022-08-19)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.91](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.90...@injectivelabs/sdk-ts@1.0.91) (2022-08-17)

### Features

- activity pagination updates ([#63](https://github.com/InjectiveLabs/injective-ts/issues/63)) ([f999db1](https://github.com/InjectiveLabs/injective-ts/commit/f999db13b635a95433a91815e357d927ae793602))

## [1.0.90](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.89...@injectivelabs/sdk-ts@1.0.90) (2022-08-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.89](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.88...@injectivelabs/sdk-ts@1.0.89) (2022-08-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.88](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.87...@injectivelabs/sdk-ts@1.0.88) (2022-08-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.87](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.86...@injectivelabs/sdk-ts@1.0.87) (2022-08-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.86](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.85...@injectivelabs/sdk-ts@1.0.86) (2022-08-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.85](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.84...@injectivelabs/sdk-ts@1.0.85) (2022-08-15)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.84](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.83...@injectivelabs/sdk-ts@1.0.84) (2022-08-13)

### Features

- experimental support for eip712 broadcasting ([69fc77a](https://github.com/InjectiveLabs/injective-ts/commit/69fc77aa16862d88556d0d8fb560e41c99710abe))

## [1.0.83](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.82...@injectivelabs/sdk-ts@1.0.83) (2022-08-12)

### Bug Fixes

- eip712 generation ([767f2d7](https://github.com/InjectiveLabs/injective-ts/commit/767f2d7e6b4241945f7a488232b9f08a9093e242))

## [1.0.82](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.81...@injectivelabs/sdk-ts@1.0.82) (2022-08-12)

### Bug Fixes

- paging pagination ([bfbac3e](https://github.com/InjectiveLabs/injective-ts/commit/bfbac3ed608368d6bef066569f1b819b1afb1b36))

### Features

- activity page pagination ([068d54e](https://github.com/InjectiveLabs/injective-ts/commit/068d54e33dd2a5df91485246b3c4732bb1eeb960))
- activity page pagination ([35dc4e3](https://github.com/InjectiveLabs/injective-ts/commit/35dc4e34235f09cb8060fc2c4932a5714e118df1))
- activity page pagination ([79e85b9](https://github.com/InjectiveLabs/injective-ts/commit/79e85b99d7ff81b4c96069c1db20777e3cc94213))
- activity page pagination ([1da66fc](https://github.com/InjectiveLabs/injective-ts/commit/1da66fcdce9698687ee6fd3fbd7e00c647e5e720))
- activity page pagination ([60e91d0](https://github.com/InjectiveLabs/injective-ts/commit/60e91d09358c6b18fa7f6e234dc750e6aeb5b420))
- activity pagination ([41f2ca2](https://github.com/InjectiveLabs/injective-ts/commit/41f2ca2c4624da8ca04155826a6f870ec8855e31))
- activity pagination ([bb91c17](https://github.com/InjectiveLabs/injective-ts/commit/bb91c17460cd313d24df8666449ef0b76cbdad2f))
- activity pagination ([a91bb5e](https://github.com/InjectiveLabs/injective-ts/commit/a91bb5e94788e423e0c803a0e503a7a97a6c8eb5))
- activity pagination - bump to indexer 1.0.5 ([a7d98a3](https://github.com/InjectiveLabs/injective-ts/commit/a7d98a33fa8afecf29f9d23c750042fe7676067e))
- activity pagination - remove duplicate code ([5c6efec](https://github.com/InjectiveLabs/injective-ts/commit/5c6efece6e7d133eddfe94872216ad435d736412))
- activity pagination - removed unused code ([9e73339](https://github.com/InjectiveLabs/injective-ts/commit/9e73339f0c1b2fa111cababd2605fd4565173787))
- activity pagination - renamed paging -> pagination ([9227787](https://github.com/InjectiveLabs/injective-ts/commit/9227787ecbc8b247516004f1bc95afab4e77f44f))
- activity pagination - use indexer instead of exchange api ([7de4dca](https://github.com/InjectiveLabs/injective-ts/commit/7de4dca9a4b9b8490710d4e80a31d4951706416c))
- added amino and proper web3 support for all msgs ([83f1857](https://github.com/InjectiveLabs/injective-ts/commit/83f1857981468ed16c2295c3f814eaa12256c7b3))
- authz module - add MsgExec and new param MsgGrant ([#57](https://github.com/InjectiveLabs/injective-ts/issues/57)) ([3c2b103](https://github.com/InjectiveLabs/injective-ts/commit/3c2b10300828c751dd2dcc92e01729b0afa9925d))

## [1.0.81](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.80...@injectivelabs/sdk-ts@1.0.81) (2022-08-12)

### Bug Fixes

- update sdk-ui-ts typings to import from sdk-ts indexer instead of exchange ([950079e](https://github.com/InjectiveLabs/injective-ts/commit/950079ea7b1703ff7ea0a4d2c8a8ae14a0bb4df7))

## [1.0.80](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.79...@injectivelabs/sdk-ts@1.0.80) (2022-08-12)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.79](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.78...@injectivelabs/sdk-ts@1.0.79) (2022-08-11)

### Bug Fixes

- gov proposal msg typings ([31b354f](https://github.com/InjectiveLabs/injective-ts/commit/31b354fc52fa8d1cb58ce8a97213e8da9cddb391))

## [1.0.78](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.77...@injectivelabs/sdk-ts@1.0.78) (2022-08-11)

### Bug Fixes

- console log removal ([da3dda8](https://github.com/InjectiveLabs/injective-ts/commit/da3dda8f4e02a2bf98ff8c8448eccb437bd94f8b))

## [1.0.77](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.76...@injectivelabs/sdk-ts@1.0.77) (2022-08-10)

### Features

- enabled disabling a wallet for wallet-ts, refactored to use sync broadcasting mode ([c1dde3f](https://github.com/InjectiveLabs/injective-ts/commit/c1dde3f5efd644de194d4e50b77c8c484d11a4b9))

## [1.0.76](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.75...@injectivelabs/sdk-ts@1.0.76) (2022-08-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.75](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.74...@injectivelabs/sdk-ts@1.0.75) (2022-08-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.74](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.73...@injectivelabs/sdk-ts@1.0.74) (2022-08-09)

### Bug Fixes

- public key derivation from private key hex ([90b2de6](https://github.com/InjectiveLabs/injective-ts/commit/90b2de66bf26f7aff6fc18bfe30fb05c877bd3e8))

## [1.0.73](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.72...@injectivelabs/sdk-ts@1.0.73) (2022-08-09)

### Bug Fixes

- public key derivation from private key hex ([354b3c0](https://github.com/InjectiveLabs/injective-ts/commit/354b3c003b4e74d0392b85ea157e22a642c82aae))

## [1.0.72](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.71...@injectivelabs/sdk-ts@1.0.72) (2022-08-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.71](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.70...@injectivelabs/sdk-ts@1.0.71) (2022-08-08)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.70](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.69...@injectivelabs/sdk-ts@1.0.70) (2022-08-06)

### Features

- indexer migration ([351320b](https://github.com/InjectiveLabs/injective-ts/commit/351320b46ac7244af44728db7b67472e6b9a8105))

## [1.0.69](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.68...@injectivelabs/sdk-ts@1.0.69) (2022-08-05)

### Features

- initial eip712 ([956d451](https://github.com/InjectiveLabs/injective-ts/commit/956d451f487a120395d42318aafaa2fc856e4a81))

## [1.0.68](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.67...@injectivelabs/sdk-ts@1.0.68) (2022-08-01)

### Bug Fixes

- instantiate vault cw20 code id typing ([f2dbd5e](https://github.com/InjectiveLabs/injective-ts/commit/f2dbd5e83ea4a1519edc90486708e12193775b27))
- msgExec cannot unmarshal object into Go value of type []json.RawMessage error ([146d17e](https://github.com/InjectiveLabs/injective-ts/commit/146d17ea725eba2835776598232caa00dacc8651))

## [1.0.67](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.66...@injectivelabs/sdk-ts@1.0.67) (2022-07-30)

### Bug Fixes

- bignumber conversion ([7559a3c](https://github.com/InjectiveLabs/injective-ts/commit/7559a3c82bd0acc427d3c0528e1ae8b8ef28cced))

## [1.0.66](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.65...@injectivelabs/sdk-ts@1.0.66) (2022-07-30)

### Features

- added fromBase64 init for PublicKey ([77b6104](https://github.com/InjectiveLabs/injective-ts/commit/77b610476d75096176605e6c73729e0f7163dbcc))

## [1.0.65](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.64...@injectivelabs/sdk-ts@1.0.65) (2022-07-30)

### Bug Fixes

- simple jest setup ([0ccea6e](https://github.com/InjectiveLabs/injective-ts/commit/0ccea6ed99319adaa6a47fa7d7b4b267f5900b46))

## [1.0.64](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.63...@injectivelabs/sdk-ts@1.0.64) (2022-07-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.63](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.62...@injectivelabs/sdk-ts@1.0.63) (2022-07-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.62](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.61...@injectivelabs/sdk-ts@1.0.62) (2022-07-28)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.61](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.60...@injectivelabs/sdk-ts@1.0.61) (2022-07-28)

### Features

- add support for CW20 balance ([0eeb3b8](https://github.com/InjectiveLabs/injective-ts/commit/0eeb3b80c5319db10d77c31b286b69b654a155d1))

## [1.0.60](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.59...@injectivelabs/sdk-ts@1.0.60) (2022-07-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.59](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.58...@injectivelabs/sdk-ts@1.0.59) (2022-07-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.58](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.57...@injectivelabs/sdk-ts@1.0.58) (2022-07-27)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.57](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.56...@injectivelabs/sdk-ts@1.0.57) (2022-07-26)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.56](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.55...@injectivelabs/sdk-ts@1.0.56) (2022-07-25)

### Bug Fixes

- account pagination ([3edcd33](https://github.com/InjectiveLabs/injective-ts/commit/3edcd334245ed13d84e7ec65600c1999bada06e6))

## [1.0.55](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.54...@injectivelabs/sdk-ts@1.0.55) (2022-07-25)

### Bug Fixes

- auth support and positions querying ([bdebabb](https://github.com/InjectiveLabs/injective-ts/commit/bdebabbd3d8218e99a5ba1b66c62465994c8b5ba))

## [1.0.54](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.53...@injectivelabs/sdk-ts@1.0.54) (2022-07-25)

### Bug Fixes

- added version to sign only a hashed message ([ad31809](https://github.com/InjectiveLabs/injective-ts/commit/ad318090893900df76a6de24de55a2964f9610f0))

## [1.0.53](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.52...@injectivelabs/sdk-ts@1.0.53) (2022-07-25)

### Bug Fixes

- double hashing ([6408b32](https://github.com/InjectiveLabs/injective-ts/commit/6408b3292b38e3e3cda7a2c617c2b7cde3264727))

## [1.0.52](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.51...@injectivelabs/sdk-ts@1.0.52) (2022-07-22)

### Bug Fixes

- signing with private key ([ac1032b](https://github.com/InjectiveLabs/injective-ts/commit/ac1032b2beca129d0ba07065944ee8b65e6c80ed))

## [1.0.51](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.50...@injectivelabs/sdk-ts@1.0.51) (2022-07-22)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.50](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.49...@injectivelabs/sdk-ts@1.0.50) (2022-07-22)

### Bug Fixes

- optional params ([e4a9b24](https://github.com/InjectiveLabs/injective-ts/commit/e4a9b243690f29ff31158300d91c926b32e4a43e))

## [1.0.49](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.48...@injectivelabs/sdk-ts@1.0.49) (2022-07-20)

### Bug Fixes

- exec function ([e22460e](https://github.com/InjectiveLabs/injective-ts/commit/e22460ec5a50fb573c8a89c9ba10f645e3b10b4d))

## [1.0.48](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.47...@injectivelabs/sdk-ts@1.0.48) (2022-07-20)

### Bug Fixes

- exec vault data ([248a3c5](https://github.com/InjectiveLabs/injective-ts/commit/248a3c53f49ff1bee4beb1949de6acfb2e6c62db))

## [1.0.47](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.46...@injectivelabs/sdk-ts@1.0.47) (2022-07-20)

### Bug Fixes

- exec params for vaults ([1196e13](https://github.com/InjectiveLabs/injective-ts/commit/1196e13037f6bab7a0132c7e6dc0f6c107506113))

## [1.0.46](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.45...@injectivelabs/sdk-ts@1.0.46) (2022-07-20)

### Bug Fixes

- exec params for vaults ([ec3f4d7](https://github.com/InjectiveLabs/injective-ts/commit/ec3f4d72195a37d2c1b329ebfbf2bc7dde900495))

## [1.0.45](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.44...@injectivelabs/sdk-ts@1.0.45) (2022-07-20)

### Bug Fixes

- args for MsgExec ([33d5bf4](https://github.com/InjectiveLabs/injective-ts/commit/33d5bf42da38db60e659f640809f37895cfbc32a))

## [1.0.44](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.43...@injectivelabs/sdk-ts@1.0.44) (2022-07-20)

### Bug Fixes

- variable casing for MsgExec ([bc50627](https://github.com/InjectiveLabs/injective-ts/commit/bc50627e50d9313f45d2a6ead12b1e2a74c45ff0))

## [1.0.43](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.42...@injectivelabs/sdk-ts@1.0.43) (2022-07-20)

### Bug Fixes

- snakekeys vault exec args ([243450a](https://github.com/InjectiveLabs/injective-ts/commit/243450afc9f4a19a7ed951bf8742182e0565a4d1))

## [1.0.42](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.41...@injectivelabs/sdk-ts@1.0.42) (2022-07-19)

### Features

- enable keplr on devnet ([021a315](https://github.com/InjectiveLabs/injective-ts/commit/021a3156090398fde4b645bf3aecf5fa3a327b1c))

## [1.0.41](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.40...@injectivelabs/sdk-ts@1.0.41) (2022-07-19)

### Bug Fixes

- msgexec params ([3f01ef8](https://github.com/InjectiveLabs/injective-ts/commit/3f01ef8fc1d632014b751bb2c308d0b97471523e))

## [1.0.40](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.39...@injectivelabs/sdk-ts@1.0.40) (2022-07-19)

### Bug Fixes

- subscribe and redeem from vault ([4a47e6f](https://github.com/InjectiveLabs/injective-ts/commit/4a47e6ff14424543fbdab7e6548c55bed482dd41))

## [1.0.39](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.38...@injectivelabs/sdk-ts@1.0.39) (2022-07-19)

### Bug Fixes

- class name export ([21c58ab](https://github.com/InjectiveLabs/injective-ts/commit/21c58abd9f5496b43ccfc7a0420d424bb88aa7c3))

## [1.0.38](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.37...@injectivelabs/sdk-ts@1.0.38) (2022-07-19)

### Bug Fixes

- export wasm ([1d2112f](https://github.com/InjectiveLabs/injective-ts/commit/1d2112fa9cb715ef4ca439947c28c382de1a98db))

## [1.0.37](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.36...@injectivelabs/sdk-ts@1.0.37) (2022-07-19)

### Features

- exec exchange contracts ([3e365ce](https://github.com/InjectiveLabs/injective-ts/commit/3e365ceda17721862dc669bdd169a86a97944be4))

## [1.0.36](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.35...@injectivelabs/sdk-ts@1.0.36) (2022-07-17)

### Features

- added timestamp filtering for trades ([541554f](https://github.com/InjectiveLabs/injective-ts/commit/541554fa9ff145c3ed6e64f1bd8239a9ade6ad0b))

## [1.0.35](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.34...@injectivelabs/sdk-ts@1.0.35) (2022-07-17)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.34](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.33...@injectivelabs/sdk-ts@1.0.34) (2022-07-17)

### Features

- wasm code grpc queries ([91e618d](https://github.com/InjectiveLabs/injective-ts/commit/91e618de8c83e58052cbebe6bc4bd3ed5d826ff5))

## [1.0.33](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.32...@injectivelabs/sdk-ts@1.0.33) (2022-07-14)

### Bug Fixes

- orderbooks response ([d6225f2](https://github.com/InjectiveLabs/injective-ts/commit/d6225f20d94344ab65955b4f82f66b0a88711dbd))

## [1.0.32](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.31...@injectivelabs/sdk-ts@1.0.32) (2022-07-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.31](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.30...@injectivelabs/sdk-ts@1.0.31) (2022-07-07)

### Bug Fixes

- keplr eth sign based on features ([b70e568](https://github.com/InjectiveLabs/injective-ts/commit/b70e5688a79f250798a6b21fa4e9d9fbac2a17d1))

## [1.0.30](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.29...@injectivelabs/sdk-ts@1.0.30) (2022-07-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.29](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.28...@injectivelabs/sdk-ts@1.0.29) (2022-07-01)

### Bug Fixes

- correct eip712 hash ([ef45b0f](https://github.com/InjectiveLabs/injective-ts/commit/ef45b0f2f991e6263c04d2a4c0f3ad8a03d4fc95))

## [1.0.28](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.27...@injectivelabs/sdk-ts@1.0.28) (2022-06-28)

### Bug Fixes

- added no throw variant of oracle prices for BO ([7fbfd77](https://github.com/InjectiveLabs/injective-ts/commit/7fbfd77998aa5259f774d6f22e0b2d6cb6aeb26c))

## [1.0.27](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.26...@injectivelabs/sdk-ts@1.0.27) (2022-06-27)

### Bug Fixes

- ExchangeRestExplorerTransformer contract transaction transfomer add support for null gas_fee txs ([36b566c](https://github.com/InjectiveLabs/injective-ts/commit/36b566c5ed1bee3c73ed866061cd1e2b150b5142))

## [1.0.26](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.25...@injectivelabs/sdk-ts@1.0.26) (2022-06-22)

### Features

- update oracle price stream ([2c8de1b](https://github.com/InjectiveLabs/injective-ts/commit/2c8de1bd1c81a997b56f38260d9f54c70b2814bc))

## [1.0.25](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.24...@injectivelabs/sdk-ts@1.0.25) (2022-06-21)

### Bug Fixes

- derivative types ([324829e](https://github.com/InjectiveLabs/injective-ts/commit/324829e741f857211c31c1f657b704cb57474e8c))

## [1.0.24](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.23...@injectivelabs/sdk-ts@1.0.24) (2022-06-21)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.23](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.22...@injectivelabs/sdk-ts@1.0.23) (2022-06-21)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.22](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.21...@injectivelabs/sdk-ts@1.0.22) (2022-06-21)

### Bug Fixes

- eip712 hash ([d35d1dc](https://github.com/InjectiveLabs/injective-ts/commit/d35d1dc55b81b9b9409eb8c050d531ed024db000))

## [1.0.21](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.20...@injectivelabs/sdk-ts@1.0.21) (2022-06-21)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.20](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.19...@injectivelabs/sdk-ts@1.0.20) (2022-06-21)

### Bug Fixes

- gov transformer ([46e1113](https://github.com/InjectiveLabs/injective-ts/commit/46e111336e7cafbbef17d3be064f1e57964473a9))

## [1.0.19](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.18...@injectivelabs/sdk-ts@1.0.19) (2022-06-21)

### Bug Fixes

- binary options unify ([fa1c0aa](https://github.com/InjectiveLabs/injective-ts/commit/fa1c0aab00d977f73243703bd5f1d4d5e3ec1fb0))
- token utils coingecko api ([69c1533](https://github.com/InjectiveLabs/injective-ts/commit/69c15339bef85a9537a70ef1524debec413ddea2))
- undefined prop on PrepareTx ([a14f810](https://github.com/InjectiveLabs/injective-ts/commit/a14f810901a77f08277eb04b92e263e991bf9be3))

## [1.0.18](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.17...@injectivelabs/sdk-ts@1.0.18) (2022-06-20)

### Features

- add correct EIP-712 signing support ([d11a532](https://github.com/InjectiveLabs/injective-ts/commit/d11a532789d860ca9a6184d315985e51b4fe24d0))
- eip712 signing fix ([774b1dd](https://github.com/InjectiveLabs/injective-ts/commit/774b1ddd94062820a62fecb4a33aa4882a40bdf8))

## [1.0.17](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.16...@injectivelabs/sdk-ts@1.0.17) (2022-06-20)

### Bug Fixes

- binary options types ([be3645e](https://github.com/InjectiveLabs/injective-ts/commit/be3645e9c7504eaad89ec54538a06d6d83e99dc4))

## [1.0.16](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.15...@injectivelabs/sdk-ts@1.0.16) (2022-06-19)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.15](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.14...@injectivelabs/sdk-ts@1.0.15) (2022-06-17)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.14](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.13...@injectivelabs/sdk-ts@1.0.14) (2022-06-16)

### Features

- binary options support on the sdk ([c5f6bc8](https://github.com/InjectiveLabs/injective-ts/commit/c5f6bc8313cc48281a426f84a352f212449bbb98))

## [1.0.13](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.12...@injectivelabs/sdk-ts@1.0.13) (2022-06-16)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.12](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.11...@injectivelabs/sdk-ts@1.0.12) (2022-06-15)

### Bug Fixes

- msgs type ([7b18629](https://github.com/InjectiveLabs/injective-ts/commit/7b1862917abd07771deb7b1fbc2b5d9a2725ba9c))

## [1.0.11](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.10...@injectivelabs/sdk-ts@1.0.11) (2022-06-15)

### Bug Fixes

- export ([a56004f](https://github.com/InjectiveLabs/injective-ts/commit/a56004fc8cb8f4a933956960e4b7cb9897f698c4))

## [1.0.10](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.9...@injectivelabs/sdk-ts@1.0.10) (2022-06-15)

### Features

- add functionality to query on chain cosmswasm contract info ([1215b7a](https://github.com/InjectiveLabs/injective-ts/commit/1215b7a84ae3506ba1fc885d8551dfeb799f9253))
- add functionality to query on chain cosmwasm data ([7b7793a](https://github.com/InjectiveLabs/injective-ts/commit/7b7793a6e34b560831779311b462bc83fead7d12))

## [1.0.9](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.8...@injectivelabs/sdk-ts@1.0.9) (2022-06-15)

### Bug Fixes

- peggy denom ([d3976f6](https://github.com/InjectiveLabs/injective-ts/commit/d3976f6203ac325d9cf5a7e68a11764ac832b6a1))

## [1.0.8](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.7...@injectivelabs/sdk-ts@1.0.8) (2022-06-15)

### Bug Fixes

- icons ([c3f3ed8](https://github.com/InjectiveLabs/injective-ts/commit/c3f3ed8b37ea12bb918e992b887e1c5a8d74a686))

## [1.0.7](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.6...@injectivelabs/sdk-ts@1.0.7) (2022-06-14)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.6](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.5...@injectivelabs/sdk-ts@1.0.6) (2022-06-13)

### Bug Fixes

- broadcasting tx ([5816180](https://github.com/InjectiveLabs/injective-ts/commit/5816180ed2a5c5fdec61ef018d0ae7121f4f9072))

## [1.0.5](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.4...@injectivelabs/sdk-ts@1.0.5) (2022-06-13)

### Features

- txClient ([efab6c8](https://github.com/InjectiveLabs/injective-ts/commit/efab6c80190b44620cdce8aa20fed4fef213de79))

## [1.0.4](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.3...@injectivelabs/sdk-ts@1.0.4) (2022-06-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [1.0.3](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.2...@injectivelabs/sdk-ts@1.0.3) (2022-06-13)

### Bug Fixes

- msg import ([629478c](https://github.com/InjectiveLabs/injective-ts/commit/629478ce9943e2dd421b315ca4a4fd9e134ea2d6))

## [1.0.2](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@1.0.1...@injectivelabs/sdk-ts@1.0.2) (2022-06-13)

### Bug Fixes

- alchemy version ([b3cdb5f](https://github.com/InjectiveLabs/injective-ts/commit/b3cdb5fd3aaf0feb51332af65749d113ac666c5c))

## [1.0.1](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.76...@injectivelabs/sdk-ts@1.0.1) (2022-06-13)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.76](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.75...@injectivelabs/sdk-ts@0.0.76) (2022-06-13)

### Bug Fixes

- batch update web3 parsing ([13be8ea](https://github.com/InjectiveLabs/injective-ts/commit/13be8eae21fa0dd48c1104d57c59a6e6fbf83a0d))

## [0.0.75](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.74...@injectivelabs/sdk-ts@0.0.75) (2022-06-13)

### Bug Fixes

- export MsgBatchUpdateOrders ([1a191a4](https://github.com/InjectiveLabs/injective-ts/commit/1a191a4aaef9d4fb1b50606bcee64d12534372b0))

## [0.0.74](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.73...@injectivelabs/sdk-ts@0.0.74) (2022-06-13)

### Features

- msgBatchUpdate ([7bc3787](https://github.com/InjectiveLabs/injective-ts/commit/7bc3787a4feab80ba506aaa90726e8465a77bfa6))

## [0.0.73](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.72...@injectivelabs/sdk-ts@0.0.73) (2022-06-12)

### Bug Fixes

- bid type map ([8cd3a6d](https://github.com/InjectiveLabs/injective-ts/commit/8cd3a6db24c241eea5255e8d713a058d4036de94))

## [0.0.72](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.71...@injectivelabs/sdk-ts@0.0.72) (2022-06-12)

### Bug Fixes

- change limit param to optional ([daae254](https://github.com/InjectiveLabs/injective-ts/commit/daae254755b3f8c495e358a6b95fba0b0b35c03e))
- trigger price null ([4ea1a7c](https://github.com/InjectiveLabs/injective-ts/commit/4ea1a7ce46ad668fd12eda61479366403f0d52b0))

### Features

- add more methods in ExplorerRPC ([08b4a0a](https://github.com/InjectiveLabs/injective-ts/commit/08b4a0a6f076379bbfaee6d1f25a07ed9755cf11))

## [0.0.71](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.70...@injectivelabs/sdk-ts@0.0.71) (2022-06-12)

### Bug Fixes

- type added ([ee571c5](https://github.com/InjectiveLabs/injective-ts/commit/ee571c59ce60654ef8fa464beab4f6766a9f4983))

## [0.0.70](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.69...@injectivelabs/sdk-ts@0.0.70) (2022-06-12)

### Bug Fixes

- token type unification ([8dc921b](https://github.com/InjectiveLabs/injective-ts/commit/8dc921b6e620eb01ddff3ac3154fcb1fce651982))

## [0.0.69](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.68...@injectivelabs/sdk-ts@0.0.69) (2022-06-10)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.68](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.67...@injectivelabs/sdk-ts@0.0.68) (2022-06-10)

### Features

- added tx-ts ([ae9ebc7](https://github.com/InjectiveLabs/injective-ts/commit/ae9ebc7e2c34eaf60e894cd70e6b0778e6b71bbf))

## [0.0.67](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.66...@injectivelabs/sdk-ts@0.0.67) (2022-06-09)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.66](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.65...@injectivelabs/sdk-ts@0.0.66) (2022-06-09)

### Bug Fixes

- signature derivation ([6f0b5d2](https://github.com/InjectiveLabs/injective-ts/commit/6f0b5d27fafbddaf49831d01bc53e27fe92d53f7))

## [0.0.65](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.64...@injectivelabs/sdk-ts@0.0.65) (2022-06-09)

### Bug Fixes

- path import for icons ([ef07786](https://github.com/InjectiveLabs/injective-ts/commit/ef0778652376013a8b91109935156cd5d410932b))

## [0.0.64](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.63...@injectivelabs/sdk-ts@0.0.64) (2022-06-09)

### Bug Fixes

- cosmos wallet ([c3416df](https://github.com/InjectiveLabs/injective-ts/commit/c3416dfb68f32d6d4568a6fdb5dd0a7e2bfb60d2))

## [0.0.63](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.62...@injectivelabs/sdk-ts@0.0.63) (2022-06-08)

### Features

- proposal decomposer ([cf63bc0](https://github.com/InjectiveLabs/injective-ts/commit/cf63bc0fa2aae144c4f1bdffd3c6bc7ecb55c41d))

## [0.0.62](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.61...@injectivelabs/sdk-ts@0.0.62) (2022-06-08)

### Features

- gas price fetching ([476f4e4](https://github.com/InjectiveLabs/injective-ts/commit/476f4e49f62ecdfc482ddde6789483fd09fd4fff))

## [0.0.61](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.60...@injectivelabs/sdk-ts@0.0.61) (2022-06-08)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.60](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.59...@injectivelabs/sdk-ts@0.0.60) (2022-06-07)

### Bug Fixes

- msg params fix ([d738d01](https://github.com/InjectiveLabs/injective-ts/commit/d738d01d2e565e6d765de8472341718d43742251))

## [0.0.59](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.58...@injectivelabs/sdk-ts@0.0.59) (2022-06-07)

### Features

- web3 client ([8f286b2](https://github.com/InjectiveLabs/injective-ts/commit/8f286b2b42d0955ecf7cc74344f4bf28e2409e0b))

## [0.0.58](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.57...@injectivelabs/sdk-ts@0.0.58) (2022-06-07)

### Bug Fixes

- return types from stream ([45ff576](https://github.com/InjectiveLabs/injective-ts/commit/45ff576e663209c01f2c95e71880da3fa40f65c9))

## [0.0.57](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.56...@injectivelabs/sdk-ts@0.0.57) (2022-06-07)

### Bug Fixes

- stream exports ([a555444](https://github.com/InjectiveLabs/injective-ts/commit/a55544408c483dc29ae2f87473e2e7cbaa411e0a))

## [0.0.56](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.55...@injectivelabs/sdk-ts@0.0.56) (2022-06-07)

### Bug Fixes

- types export ([ff44030](https://github.com/InjectiveLabs/injective-ts/commit/ff44030661df32b3566efaa1b3c9403d3d59e225))

## [0.0.55](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.54...@injectivelabs/sdk-ts@0.0.55) (2022-06-07)

### Bug Fixes

- gov modules ([beb1eb4](https://github.com/InjectiveLabs/injective-ts/commit/beb1eb4935e4fd9c156d761cb9487e805a585646))

## [0.0.54](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.53...@injectivelabs/sdk-ts@0.0.54) (2022-06-07)

### Bug Fixes

- exchange auction transformer ([383c647](https://github.com/InjectiveLabs/injective-ts/commit/383c647f2cd0ac15a39a101cc99c486b60010230))

## [0.0.53](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.52...@injectivelabs/sdk-ts@0.0.53) (2022-06-07)

### Bug Fixes

- transform response ([3c56d5f](https://github.com/InjectiveLabs/injective-ts/commit/3c56d5faf71b680b80591297bfc633308f3b626b))

## [0.0.52](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.51...@injectivelabs/sdk-ts@0.0.52) (2022-06-07)

### Features

- response transformers ([b72ce57](https://github.com/InjectiveLabs/injective-ts/commit/b72ce575d5f613a92ad9dd49748a88f220d05bf5))

## [0.0.51](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.50...@injectivelabs/sdk-ts@0.0.51) (2022-06-06)

### Features

- added validator details and uptime ([b775f91](https://github.com/InjectiveLabs/injective-ts/commit/b775f919eeb652d18c37abd557d2c2a429c3ac21))

## [0.0.50](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.49...@injectivelabs/sdk-ts@0.0.50) (2022-06-06)

### Bug Fixes

- export ([9360564](https://github.com/InjectiveLabs/injective-ts/commit/9360564743b3314897700de2fc1ecda18eea7ed1))

## [0.0.49](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.48...@injectivelabs/sdk-ts@0.0.49) (2022-06-06)

### Features

- added insurance funds explorer api types ([5dcf7da](https://github.com/InjectiveLabs/injective-ts/commit/5dcf7da4323546ef4e4cff064960aa59f4a67ea6))

## [0.0.48](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.47...@injectivelabs/sdk-ts@0.0.48) (2022-06-06)

### Bug Fixes

- token service ([f94e037](https://github.com/InjectiveLabs/injective-ts/commit/f94e037a2a7124f3db5616d71be3a5c0c06d8c38))

## [0.0.47](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.46...@injectivelabs/sdk-ts@0.0.47) (2022-06-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.46](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.45...@injectivelabs/sdk-ts@0.0.46) (2022-06-06)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.45](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.44...@injectivelabs/sdk-ts@0.0.45) (2022-06-06)

### Bug Fixes

- cosmos wallet fixes ([71965cb](https://github.com/InjectiveLabs/injective-ts/commit/71965cbc3a8cba1a8fab5dbd0a9e73adf9566714))

## [0.0.44](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.43...@injectivelabs/sdk-ts@0.0.44) (2022-06-03)

### Bug Fixes

- exports ([bc77a41](https://github.com/InjectiveLabs/injective-ts/commit/bc77a4179fa642f3fd2fc38f0ac7c02eb2965f1e))

## [0.0.43](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.42...@injectivelabs/sdk-ts@0.0.43) (2022-06-03)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.42](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.41...@injectivelabs/sdk-ts@0.0.42) (2022-06-02)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.41](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.40...@injectivelabs/sdk-ts@0.0.41) (2022-06-02)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.40](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.39...@injectivelabs/sdk-ts@0.0.40) (2022-06-02)

### Bug Fixes

- feePaidAmount to volume ([88c202f](https://github.com/InjectiveLabs/injective-ts/commit/88c202f99dd930c1555b9b91b84c7f7e408c660c))

### Features

- wasm messages ([3773c39](https://github.com/InjectiveLabs/injective-ts/commit/3773c39d8e61c70eec3f14683240a7f787fdd70e))

## [0.0.39](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.38...@injectivelabs/sdk-ts@0.0.39) (2022-06-02)

### Features

- new wallet ts ([e43b933](https://github.com/InjectiveLabs/injective-ts/commit/e43b933f8a5e6bd6c51f5e890ec0f0e61992b647))

## [0.0.38](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.37...@injectivelabs/sdk-ts@0.0.38) (2022-05-31)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.37](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.36...@injectivelabs/sdk-ts@0.0.37) (2022-05-30)

### Bug Fixes

- exports ([5c775c3](https://github.com/InjectiveLabs/injective-ts/commit/5c775c3c5dff065ff426ccc2c54d7cbf6e9b08e2))
- imports ([5554857](https://github.com/InjectiveLabs/injective-ts/commit/5554857b690dc7e697f55be8d96ac12ff70caaac))

## [0.0.36](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.35...@injectivelabs/sdk-ts@0.0.36) (2022-05-30)

### Bug Fixes

- exports ([750a096](https://github.com/InjectiveLabs/injective-ts/commit/750a096aa3cea4d1793cc4775bb7f0392ce4f165))

## [0.0.35](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.34...@injectivelabs/sdk-ts@0.0.35) (2022-05-30)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.34](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.33...@injectivelabs/sdk-ts@0.0.34) (2022-05-29)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.33](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.32...@injectivelabs/sdk-ts@0.0.33) (2022-05-26)

### Features

- evmos fix ([6d6d46e](https://github.com/InjectiveLabs/injective-ts/commit/6d6d46e4c3ba8d8411d66f84d66e86f6c1c4c83a))

## [0.0.32](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.31...@injectivelabs/sdk-ts@0.0.32) (2022-05-17)

### Features

- exchange module state ([ab8fcd2](https://github.com/InjectiveLabs/injective-ts/commit/ab8fcd28cbf6bbac4b4d524d8d3d202937c935cb))

## [0.0.31](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.30...@injectivelabs/sdk-ts@0.0.31) (2022-05-17)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.30](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.29...@injectivelabs/sdk-ts@0.0.30) (2022-05-17)

### Bug Fixes

- terrajs version ([04288df](https://github.com/InjectiveLabs/injective-ts/commit/04288df12673e80fe131fa77f13aa30c7be501d4))

## [0.0.29](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.28...@injectivelabs/sdk-ts@0.0.29) (2022-05-17)

### Features

- sdk-ui-ts ([4c8f902](https://github.com/InjectiveLabs/injective-ts/commit/4c8f90262b0d7cf2df3038c23fda4a9e83bb8c6a))

## [0.0.28](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.27...@injectivelabs/sdk-ts@0.0.28) (2022-05-17)

### Features

- rest endpoints decoupling ([cba0e1a](https://github.com/InjectiveLabs/injective-ts/commit/cba0e1a62ee4e24ceb4f749411618112ec0f961b))

## [0.0.27](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.26...@injectivelabs/sdk-ts@0.0.27) (2022-05-17)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.26](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.25...@injectivelabs/sdk-ts@0.0.26) (2022-05-17)

### Features

- initial sdk-ui-ts and sdk-ts refactor ([fe00582](https://github.com/InjectiveLabs/injective-ts/commit/fe005820114dcfca2fe28a70f465a048550f4932))

## [0.0.25](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.24...@injectivelabs/sdk-ts@0.0.25) (2022-05-12)

### Bug Fixes

- uptime percentage ([ef0a1a3](https://github.com/InjectiveLabs/injective-ts/commit/ef0a1a38e3ff48064ffacaaf23bf653695603bdb))

## [0.0.24](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.23...@injectivelabs/sdk-ts@0.0.24) (2022-05-12)

### Bug Fixes

- add DerivativeOrderSide ([5ce6a71](https://github.com/InjectiveLabs/injective-ts/commit/5ce6a71ab37a6d1c6e3de0dfa7afaa505f966891))
- add missing params in functions ([3cd74e9](https://github.com/InjectiveLabs/injective-ts/commit/3cd74e91a3b77779b1bf4b77af89e098442ddc6a))
- enums ([a6cbd5a](https://github.com/InjectiveLabs/injective-ts/commit/a6cbd5abe32d56533144852284f9f2511147d70e))
- fetchSpotSubaccountTradesList ([e7c6b24](https://github.com/InjectiveLabs/injective-ts/commit/e7c6b248f46f44b057b10503adfd96be7e78dfb6))
- TradeExecutionSide enum values ([00b5325](https://github.com/InjectiveLabs/injective-ts/commit/00b53255de72fa6157a28a5b9bb4fc0df662b6ef))

### Features

- add functions ([4761770](https://github.com/InjectiveLabs/injective-ts/commit/4761770454e481ae85175232423f814a1c3434b5))
- add skip & limit params ([35012a4](https://github.com/InjectiveLabs/injective-ts/commit/35012a4a88ce3e24f2e2f7cfa5fcd5da97d20964))
- add streamSpotMarket ([66e392c](https://github.com/InjectiveLabs/injective-ts/commit/66e392c5e8e8cb2a6febffb9bdac00355827f8be))

## [0.0.23](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.22...@injectivelabs/sdk-ts@0.0.23) (2022-05-11)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.22](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.21...@injectivelabs/sdk-ts@0.0.22) (2022-05-03)

### Bug Fixes

- protoObject function ([999dbd3](https://github.com/InjectiveLabs/injective-ts/commit/999dbd3745c04f675594df5d324c5368fe6e32b3))

## [0.0.21](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.20...@injectivelabs/sdk-ts@0.0.21) (2022-05-03)

### Features

- added object formatter ([6a4621a](https://github.com/InjectiveLabs/injective-ts/commit/6a4621a62ea4267c3df9de82b31798bfe1245c02))

## [0.0.20](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.19...@injectivelabs/sdk-ts@0.0.20) (2022-05-02)

### Bug Fixes

- transport for stream ([2e3e929](https://github.com/InjectiveLabs/injective-ts/commit/2e3e929c18db669cc4461310befad34172f21d88))

## [0.0.19](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.18...@injectivelabs/sdk-ts@0.0.19) (2022-05-02)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.18](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.17...@injectivelabs/sdk-ts@0.0.18) (2022-05-01)

**Note:** Version bump only for package @injectivelabs/sdk-ts

## [0.0.17](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.16...@injectivelabs/sdk-ts@0.0.17) (2022-04-28)

### Bug Fixes

- version ([222b42c](https://github.com/InjectiveLabs/injective-ts/commit/222b42ccccc65daa02739b116744331dcdfffdcc))

## [0.0.16](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.12...@injectivelabs/sdk-ts@0.0.16) (2022-04-28)

### Bug Fixes

- removed examples ([a88625c](https://github.com/InjectiveLabs/injective-ts/commit/a88625c0f49e8bf4176905b0b5196be5c5e7ad31))

## [0.0.12](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.11...@injectivelabs/sdk-ts@0.0.12) (2022-04-26)

### Bug Fixes

- network information ([853f467](https://github.com/InjectiveLabs/injective-ts/commit/853f4677b278b0ff1f111a3c9f2cb77d993a1508))

## [0.0.11](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.10...@injectivelabs/sdk-ts@0.0.11) (2022-04-26)

### Bug Fixes

- broadcasting and proto decoding ([0cf6367](https://github.com/InjectiveLabs/injective-ts/commit/0cf6367932492aa33b9835ae565bf7a91e16f385))

## [0.0.10](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.9...@injectivelabs/sdk-ts@0.0.10) (2022-04-26)

### Bug Fixes

- address derivation ([ef5f438](https://github.com/InjectiveLabs/injective-ts/commit/ef5f43800d521a062b8a3399c844eaa1a8ef25fe))

## [0.0.9](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.8...@injectivelabs/sdk-ts@0.0.9) (2022-04-26)

### Bug Fixes

- private key import ([653d3ba](https://github.com/InjectiveLabs/injective-ts/commit/653d3ba6ce24631786cd453be2d5d92472b00195))

## [0.0.8](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.7...@injectivelabs/sdk-ts@0.0.8) (2022-04-26)

### Bug Fixes

- local only util classes ([bd99108](https://github.com/InjectiveLabs/injective-ts/commit/bd991083964a673ef54418f504e8fed959ade812))

## [0.0.7](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.6...@injectivelabs/sdk-ts@0.0.7) (2022-04-26)

### Bug Fixes

- export ([c743932](https://github.com/InjectiveLabs/injective-ts/commit/c74393231625db81a1df6359c43458e28723b1fb))

## [0.0.6](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.5...@injectivelabs/sdk-ts@0.0.6) (2022-04-26)

### Features

- added rest consumer example ([aa20951](https://github.com/InjectiveLabs/injective-ts/commit/aa2095126bbfae2bd851f0417cd98144b7bcbda0))

## [0.0.5](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.4...@injectivelabs/sdk-ts@0.0.5) (2022-04-26)

### Bug Fixes

- public key ([fe13df0](https://github.com/InjectiveLabs/injective-ts/commit/fe13df0c91088edb3d0bc7a1cc497030dade7f07))

## [0.0.4](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.3...@injectivelabs/sdk-ts@0.0.4) (2022-04-26)

### Bug Fixes

- minor typings ([5059968](https://github.com/InjectiveLabs/injective-ts/commit/5059968ef1d02454ffcf449f2da5b6573b60664d))

## [0.0.3](https://github.com/InjectiveLabs/injective-ts/compare/@injectivelabs/sdk-ts@0.0.2...@injectivelabs/sdk-ts@0.0.3) (2022-04-26)

### Bug Fixes

- exports ([a9df1bb](https://github.com/InjectiveLabs/injective-ts/commit/a9df1bb50f72feeb7f056847752995fd4f76c2c9))

## 0.0.2 (2022-04-26)

### Features

- sdk-ts initial ([1d2ef9b](https://github.com/InjectiveLabs/injective-ts/commit/1d2ef9bdd02e3684162374479324ee9dc1f896b5))
