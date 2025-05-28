import dotenv from 'dotenv';
import { hexToUint8Array } from '../utils';
import base58 from 'bs58';

dotenv.config();

describe('Utils', () => {
  describe('Base58', () => {
    it('Get discriminator', async () => {
      const hex =
        //'c1209b3341d69c810e030000003d016400011a64010234640203402c420600000000e953780100000000500000'; // instruction discriminator 
        '856e4aaf709ff59fdd8d3f6d0b01000095901b040000000000'; // event discriminator

      const data = hexToUint8Array(hex);

      console.log(data.slice(0, 8)); // instruction discriminator
      // console.log(data.slice(0, 16)); // event discriminator
    });
  });
});