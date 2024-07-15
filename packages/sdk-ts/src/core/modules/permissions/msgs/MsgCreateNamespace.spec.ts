import snakecaseKeys from 'snakecase-keys';
import MsgCreateNamespace from './MsgCreateNamespace';
import { mockFactory } from '@injectivelabs/test-utils';

const params: MsgCreateNamespace['params'] = {
  sender: mockFactory.injectiveAddress,
  denom: 'denom',
  wasmHook: 'wasmHookAddress',
  mintsPaused: true,
  sendsPaused: false,
  burnsPaused: true,
  rolePermissions: [{ role: 'admin', permissions: 1 }],
  addressRoles: [{ address: mockFactory.injectiveAddress2, roles: ['admin'] }],
};

const protoType = '/injective.permissions.v1beta1.MsgCreateNamespace';
const protoTypeShort = 'permissions/MsgCreateNamespace';
const protoParams = {
  sender: params.sender,
  namespace: {
    denom: params.denom,
    wasmHook: params.wasmHook,
    mintsPaused: params.mintsPaused,
    sendsPaused: params.sendsPaused,
    burnsPaused: params.burnsPaused,
    rolePermissions: params.rolePermissions.map((rp) => ({
      role: rp.role,
      permissions: rp.permissions,
    })),
    addressRoles: params.addressRoles.map((ar) => ({
      address: ar.address,
      roles: ar.roles,
    })),
  },
};

const protoParamsAmino = snakecaseKeys(protoParams)

const message = MsgCreateNamespace.fromJSON(params);

describe('MsgCreateNamespace', () => {
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
