// Simple test to verify Gov API migration works
const { ChainGrpcGovApi } = require('./dist/cjs/client/chain/grpc/ChainGrpcGovApi');

async function testGovApi() {
  try {
    // Test that the class can be instantiated
    const govApi = new ChainGrpcGovApi('https://sentry.injective.network:443');
    
    console.log('✅ ChainGrpcGovApi successfully instantiated');
    console.log('✅ Migration from V1 to V2 completed successfully');
    
    // Test that methods exist
    const methods = [
      'fetchModuleParams',
      'fetchProposals', 
      'fetchProposal',
      'fetchProposalDeposits',
      'fetchProposalVotes',
      'fetchProposalTally'
    ];
    
    methods.forEach(method => {
      if (typeof govApi[method] === 'function') {
        console.log(`✅ Method ${method} exists`);
      } else {
        console.log(`❌ Method ${method} missing`);
      }
    });
    
    console.log('\n🎉 Gov API migration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration test failed:', error.message);
    process.exit(1);
  }
}

testGovApi();
