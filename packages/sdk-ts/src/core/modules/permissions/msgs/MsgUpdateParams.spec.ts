import snakecaseKeys from 'snakecase-keys';
import MsgUpdateParams from './MsgUpdateParams';
import { mockFactory } from '@injectivelabs/test-utils';

const params: MsgUpdateParams['params'] = {
  authority: mockFactory.injectiveAddress,
  params: {
    wasmHookQueryMaxGas: 50000,
  },
};

const protoType = '/injective.permissions.v1beta1.MsgUpdateParams';
const protoTypeShort = 'permissions/MsgUpdateParams';
const protoParams = {
  authority: params.authority,
  params: {
    wasmHookQueryMaxGas: params.params.wasmHookQueryMaxGas,
  },
};

const protoParamsAmino = snakecaseKeys(protoParams);

const message = MsgUpdateParams.fromJSON(params);

describe('MsgUpdateParams', () => {
  it('generates proper proto', () => {
    const proto = message.toProto();

    expect(proto).toStrictEqual(protoParams);
  });

  it('generates proper data', () => {
    const data = message.toData();

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParams,
    });
  });

  it('generates proper amino', () => {
    const amino = message.toAmino();

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAmino,
    });
  });

  it('generates proper web3', () => {
    const web3 = message.toWeb3();

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    });
  });
});
