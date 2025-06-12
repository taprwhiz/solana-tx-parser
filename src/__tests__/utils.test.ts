import dotenv from 'dotenv';
import { hexToUint8Array } from '../utils';

dotenv.config();

describe('Utils', () => {
  describe('Base58', () => {
    it('Get discriminator', async () => {
      const hex =
        //'c1209b3341d69c810e030000003d016400011a64010234640203402c420600000000e953780100000000500000'; // instruction discriminator 
        '181ec828051c077707000000424947464f4f5407000000524f5554494e454300000068747470733a2f2f697066732e696f2f697066732f516d6453476d644a337045686f45515a735133794d4b4751647131665a61664c344671614d504c54735a475a38631b97f1274135a188c84410514fcdc0b0ac9ddd255aa3aa94cdfb091b480411c7'; // event discriminator

      const data = hexToUint8Array(hex);

      console.log(data.slice(0, 8)); // instruction discriminator
      // console.log(data.slice(0, 16)); // event discriminator
    });
  });
});