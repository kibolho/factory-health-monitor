import { Storage } from '.';

describe('Testing Storage Lib', () => {
  it('should set and get data', async () => {
    await Storage.save('mockedKey', 'mockedData');
    const get = await Storage.get('mockedKey');
    expect(get).toEqual('mockedData');
  });
  it('should delete and get no data', async () => {
    await Storage.del('mockedKey');
    const get = await Storage.get('mockedKey');
    expect(get).toEqual(null);
  });
});
