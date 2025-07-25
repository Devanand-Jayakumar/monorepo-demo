import { utilPingIdentity } from './util-ping-identity.js';

describe('utilPingIdentity', () => {
  it('should work', () => {
    expect(utilPingIdentity()).toEqual('util-ping-identity');
  });
});
