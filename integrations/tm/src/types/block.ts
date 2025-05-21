// -------- UTILITY/REUSED TYPES --------

interface Parts {
	total: number;
	hash: string;
}

interface BlockId {
	hash: string;
	parts: Parts;
}

interface ConsensusVersion {
	block: string; // e.g., "11"
	app?: string; // Sometimes present, sometimes "0"
}

interface Signature {
	block_id_flag: number;
	validator_address: string;
	timestamp: string; // ISO Date string
	signature: string | null;
}

interface Attribute {
	key: string;
	value: string;
	index: boolean; // Appears to be consistently boolean
}

export interface ChainEvent {
	type: string;
	attributes: Attribute[];
}

// -------- HEADER RELATED TYPES --------

interface Header {
	version: ConsensusVersion;
	chain_id: string;
	height: string; // Numeric string
	time: string; // ISO Date string
	last_block_id: BlockId;
	last_commit_hash: string;
	data_hash: string;
	validators_hash: string;
	next_validators_hash: string;
	consensus_hash: string;
	app_hash: string;
	last_results_hash: string;
	evidence_hash: string;
	proposer_address: string;
}

// -------- BLOCK DATA & EVIDENCE --------

interface Data {
	txs: string[]; // Array of base64 encoded transaction strings
}

interface EvidenceContainer {
	// Renamed from Evidence to avoid conflict if Evidence detail was defined
	evidence: any[]; // Structure of individual evidence items not provided, empty in example
}

// -------- LAST COMMIT --------

interface LastCommit {
	height: string; // Numeric string
	round: number;
	block_id: BlockId;
	signatures: Signature[];
}

// -------- BLOCK --------

interface Block {
	header: Header;
	data: Data;
	evidence: EvidenceContainer;
	last_commit: LastCommit;
}

// -------- TX RESULT --------

interface TxResult {
	code: number;
	data: string; // Often base64 encoded response protobuf
	log: string;
	info: string;
	gas_wanted: string; // Numeric string
	gas_used: string; // Numeric string
	events: ChainEvent[];
	codespace: string;
}

// -------- CONSENSUS PARAM UPDATES --------

interface BlockParams {
	max_bytes: string; // Numeric string
	max_gas: string; // Numeric string
}

interface EvidenceParams {
	max_age_num_blocks: string; // Numeric string
	max_age_duration: string; // Numeric string
	max_bytes: string; // Numeric string
}

interface ValidatorParams {
	pub_key_types: string[];
}

type VersionParams = any;

type AbciParams = any;

interface ConsensusParamUpdates {
	block: BlockParams;
	evidence: EvidenceParams;
	validator: ValidatorParams;
	version: VersionParams;
	abci: AbciParams;
}

// -------- RESULT FINALIZE BLOCK --------

interface ResultFinalizeBlock {
	events: ChainEvent[];
	tx_results: TxResult[] | null; // Can be null if no transactions
	validator_updates: any[]; // Structure of individual validator updates not provided, empty in example
	consensus_param_updates: ConsensusParamUpdates | null; // Can be null
	app_hash: string;
}

// -------- TOP LEVEL TYPES --------

export interface BlockEvent {
	// Renamed from BlockEvent to avoid potential global name conflicts
	block: Block;
	block_id: BlockId;
	result_finalize_block: ResultFinalizeBlock;
	// validator_updates is part of result_finalize_block in the provided structure,
	// if it can also exist at this level, add it:
	// validator_updates?: any[];
}
