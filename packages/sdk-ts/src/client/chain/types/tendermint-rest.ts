export interface BlockLatestRestResponse {
  block_id: {
    hash: string
    part_set_header: {
      total: number
      hash: string
    }
  }
  block: {
    header: {
      version: {
        block: string
        app: string
      }
      chain_id: string
      height: string
      time: Date
      last_block_id: {
        hash: string
        part_set_header: {
          total: 0
          hash: string
        }
      }
      last_commit_hash: string
      data_hash: string
      validators_hash: string
      next_validators_hash: string
      consensus_hash: string
      app_hash: string
      last_results_hash: string
      evidence_hash: string
      proposer_address: string
    }
  }
}

export interface NodeInfoRestResponse {
  default_node_info: {
    protocol_version: {
      p2p: string
      block: string
      app: string
    }
    default_node_id: string
    listen_addr: string
    network: string
    version: string
    channels: string
    moniker: string
    other: {
      tx_index: string
      rpc_address: string
    }
  }
  application_version: {
    name: string
    app_name: string
    version: string
    git_commit: string
    build_tags: string
    go_version: string
    build_deps: [
      {
        path: string
        version: string
        sum: string
      },
    ]
    cosmos_sdk_version: string
  }
}
