import { expect } from 'chai';
import { matchNamesToIds,
        createRowObj,
      } from '../index.js';

describe('house-holds survey csv tests', () => {

  it('should match names to IDs', () => {
    const row = {
      id: '9289427',
      info: 'Zacharia Kuria,mother;John Muiru,mother,18,no,secondary',
    };
    const obj = matchNamesToIds(row);
    expect(obj).to.deep.equal([
      { id: 9289427, name: 'Zacharia Kuria' },
      { id: 9289427, name: 'John Muiru' }
    ]);
  });
  // it('should create row object for writing to file', () => {
  //   const row = {
  //     Name:
  //   }
  //   const obj = createRowObj(row);
  //   expect(obj).to.deep.equal([
  //     { id: 9289427, name: 'Zacharia Kuria' },
  //     { id: 9289427, name: 'John Muiru' }
  //   ]);
  // });
});
