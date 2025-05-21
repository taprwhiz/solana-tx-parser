import dotenv from 'dotenv';
import { hexToUint8Array } from '../utils';
import base58 from 'bs58';

dotenv.config();

describe('Utils', () => {
  describe('Base58', () => {
    it('Get discriminator', async () => {
      const hex =
        //'c1209b3341d69c810e030000003d016400011a64010234640203402c420600000000e953780100000000500000'; // instruction discriminator 
        'e445a52e51cb9a1d9c0f77c61db5dd3727692c73befa0f901de678dcfac9a60ec33a17e401fb4894aaa37431a3803251ec6947b7db2cccefaf46b316b37984edfebb260a55a3e267da3baa9e0bbb8c119ee154a1668359b4eea2c5a9f496da165e9ce8f3a6f81305373daefef09f810e76d42db617167389e354c04eb414290b5c1d34c817474c87459f45062faa4cd2'; // event discriminator

      const data = hexToUint8Array(hex);

      console.log(data.slice(0, 8)); // instruction discriminator
      console.log(data.slice(0, 16)); // event discriminator
    });
  });
});