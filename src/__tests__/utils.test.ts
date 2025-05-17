import dotenv from 'dotenv';
import { hexToUint8Array } from '../utils';
import base58 from 'bs58';

dotenv.config();

describe('Utils', () => {
  describe('Base58', () => {
    it('Get discriminator', async () => {
      const hex =
        //'c1209b3341d69c810e030000003d016400011a64010234640203402c420600000000e953780100000000500000'; // instruction discriminator 
        'e445a52e51cb9a1d80977b6a1166718ebc90ed52597f319e61191a1e6e45a2c056b5ac0f452afca8f7a776b5340c830727ff0000000000000000920200000000000000000000000000002000000000000000'; // event discriminator

      const data = hexToUint8Array(hex);

      console.log(data.slice(0, 8)); // instruction discriminator
      console.log(data.slice(0, 16)); // event discriminator
    });
  });
});