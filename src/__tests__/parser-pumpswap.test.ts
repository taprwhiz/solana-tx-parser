import { Connection } from '@solana/web3.js';
import dotenv from 'dotenv';
import { PumpswapEventParser } from '../parsers';
import { TransactionAdapter } from '../transaction-adapter';
import { DexParser } from '../dex-parser';

dotenv.config();

const tests = [
  [
    {
      "type": "BUY",
      "inputToken": {
        "mint": "So11111111111111111111111111111111111111112",
        "amount": 0.024787666,
        "amountRaw": "24787666",
        "decimals": 9,
        "authority": "GZ4rWFVYvfYihujx5HMyPgaZFrcKAFKnDuYj65fKoqYt",
        "source": "8eBrAAvd79NLmj3ACxjRNKi7j6akBM1bzXq3KVVAgmog",
        "destination": "4aNV3y4LjnpiPjvgXqaSsJxm21DJuNy5VNzxC7ZJ2qvA",
        "destinationOwner": "7DViqDrM9eDquGWZk4hV5MbWdgyJxQgL8hR7JRJqTK6i",
        "destinationBalance": {
          "amount": "329376385435",
          "decimals": 9,
          "uiAmount": 329.376385435,
          "uiAmountString": "329.376385435"
        },
        "destinationPreBalance": {
          "amount": "329377741013",
          "decimals": 9,
          "uiAmount": 329.377741013,
          "uiAmountString": "329.377741013"
        }
      },
      "outputToken": {
        "mint": "4EpaehBiBpDZjRLix8Yuuiqh3ibYzQUnjZZPGWzDa5gm",
        "amount": 55147.699206,
        "amountRaw": "55147699206",
        "decimals": 6,
        "authority": "7DViqDrM9eDquGWZk4hV5MbWdgyJxQgL8hR7JRJqTK6i",
        "source": "DTZ2v1Yq4Yk5bTin9GTDkeVisJUA5Gds1HLrKyGvECcR",
        "destination": "6HeDihYVbJLbepuC4sD6B4rpTjG8chMmgVEpPPeBkod1",
        "destinationOwner": "GZ4rWFVYvfYihujx5HMyPgaZFrcKAFKnDuYj65fKoqYt",
        "destinationBalance": {
          "amount": "179040108085",
          "decimals": 6,
          "uiAmount": 179040.108085,
          "uiAmountString": "179040.108085"
        },
        "destinationPreBalance": {
          "amount": "123892408879",
          "decimals": 6,
          "uiAmount": 123892.408879,
          "uiAmountString": "123892.408879"
        },
        "sourceBalance": {
          "amount": "734696056136862",
          "decimals": 6,
          "uiAmount": 734696056.136862,
          "uiAmountString": "734696056.136862"
        },
        "sourcePreBalance": {
          "amount": "734692805243014",
          "decimals": 6,
          "uiAmount": 734692805.243014,
          "uiAmountString": "734692805.243014"
        }
      },
      "fee": {
        "mint": "4EpaehBiBpDZjRLix8Yuuiqh3ibYzQUnjZZPGWzDa5gm",
        "amount": 27.642957,
        "amountRaw": "27642957",
        "decimals": 6,
        "dex": "Pumpswap"
      },
      "fees": [
        {
          "mint": "4EpaehBiBpDZjRLix8Yuuiqh3ibYzQUnjZZPGWzDa5gm",
          "amount": 27.642957,
          "amountRaw": "27642957",
          "decimals": 6,
          "dex": "Pumpswap",
          "type": "protocol",
          "recipient": "7VtfL8fvgNfhz17qKRMjzQEXgbdpnHHHQRh54R9jP2RJ"
        }
      ],
      "user": "GZ4rWFVYvfYihujx5HMyPgaZFrcKAFKnDuYj65fKoqYt",
      "programId": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
      "amm": "Pumpswap",
      "route": "",
      "slot": 342946386,
      "timestamp": 1748404956,
      "signature": "5b55USAicisYVRnAWxR1PmVL9Z3eSG8wJ2jqQ57xz1EDs3GcJg1VmerYAfnyh5R4kkW35CBRGcjCJFxzSYnj3B4",
      "idx": "5-3"
    },
    {
      "type": "SELL",
      "inputToken": {
        "mint": "4EpaehBiBpDZjRLix8Yuuiqh3ibYzQUnjZZPGWzDa5gm",
        "amount": 58426.236011,
        "amountRaw": "58426236011",
        "decimals": 6,
        "authority": "BocCjigUDuJJRRmg8L1KntkT9rj2Lv3tVqPftEs9QgzT",
        "source": "DBQADpQ9ZyiGdRWMwfHvgUg38YYUBmst7YJeFfuPNKGe",
        "destination": "DTZ2v1Yq4Yk5bTin9GTDkeVisJUA5Gds1HLrKyGvECcR",
        "destinationOwner": "7DViqDrM9eDquGWZk4hV5MbWdgyJxQgL8hR7JRJqTK6i",
        "destinationBalance": {
          "amount": "734696056136862",
          "decimals": 6,
          "uiAmount": 734696056.136862,
          "uiAmountString": "734696056.136862"
        },
        "destinationPreBalance": {
          "amount": "734692805243014",
          "decimals": 6,
          "uiAmount": 734692805.243014,
          "uiAmountString": "734692805.243014"
        },
        "sourceBalance": {
          "amount": "174966567514",
          "decimals": 6,
          "uiAmount": 174966.567514,
          "uiAmountString": "174966.567514"
        },
        "sourcePreBalance": {
          "amount": "233421958334",
          "decimals": 6,
          "uiAmount": 233421.958334,
          "uiAmountString": "233421.958334"
        }
      },
      "outputToken": {
        "mint": "So11111111111111111111111111111111111111112",
        "amount": 0.026143244,
        "amountRaw": "26143244",
        "decimals": 9,
        "authority": "7DViqDrM9eDquGWZk4hV5MbWdgyJxQgL8hR7JRJqTK6i",
        "source": "4aNV3y4LjnpiPjvgXqaSsJxm21DJuNy5VNzxC7ZJ2qvA",
        "destination": "AsFibLMmxJnAUg2M3y1CJXmViATBdE9EJSYFKzcbVttb",
        "sourceBalance": {
          "amount": "329376385435",
          "decimals": 9,
          "uiAmount": 329.376385435,
          "uiAmountString": "329.376385435"
        },
        "sourcePreBalance": {
          "amount": "329377741013",
          "decimals": 9,
          "uiAmount": 329.377741013,
          "uiAmountString": "329.377741013"
        }
      },
      "fee": {
        "mint": "4EpaehBiBpDZjRLix8Yuuiqh3ibYzQUnjZZPGWzDa5gm",
        "amount": 29.154809,
        "amountRaw": "29154809",
        "decimals": 6
      },
      "fees": [
        {
          "mint": "4EpaehBiBpDZjRLix8Yuuiqh3ibYzQUnjZZPGWzDa5gm",
          "amount": 29.154809,
          "amountRaw": "29154809",
          "decimals": 6,
          "dex": "Pumpswap",
          "type": "protocol",
          "recipient": "7VtfL8fvgNfhz17qKRMjzQEXgbdpnHHHQRh54R9jP2RJ"
        }
      ],
      "user": "BocCjigUDuJJRRmg8L1KntkT9rj2Lv3tVqPftEs9QgzT",
      "programId": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
      "amm": "Pumpswap",
      "route": "",
      "slot": 342946386,
      "timestamp": 1748404956,
      "signature": "5b55USAicisYVRnAWxR1PmVL9Z3eSG8wJ2jqQ57xz1EDs3GcJg1VmerYAfnyh5R4kkW35CBRGcjCJFxzSYnj3B4",
      "idx": "8-3"
    }
  ],
  [
    {
      "type": "BUY",
      "inputToken": {
        "mint": "So11111111111111111111111111111111111111112",
        "amount": 0.000010059,
        "amountRaw": "10059",
        "decimals": 9,
        "authority": "AknTq2cJ8wqNMLejEJjbRmPrh3bhmeortyYMmMgDLVm9",
        "source": "6bwejCfQCZhBc9AUW6ukaKPKqnzP7XXUVcMrwMzRv6bj",
        "destination": "AHEjFSLkNR1EMbtLynterhKwAoUqSNfYPkYiSY9E87We",
        "destinationOwner": "AtV6yk4GATfCFXYQdMBsxXk6ujbELmMuG4EssCHNDsK9",
        "destinationBalance": {
          "amount": "31943971718",
          "decimals": 9,
          "uiAmount": 31.943971718,
          "uiAmountString": "31.943971718"
        },
        "destinationPreBalance": {
          "amount": "31943961659",
          "decimals": 9,
          "uiAmount": 31.943961659,
          "uiAmountString": "31.943961659"
        }
      },
      "outputToken": {
        "mint": "2euFBbbDQQZTevg23SV3CmFdJohJxKKGLZzqMEYpjbBQ",
        "amount": 216.28478,
        "amountRaw": "216284780",
        "decimals": 6,
        "authority": "AtV6yk4GATfCFXYQdMBsxXk6ujbELmMuG4EssCHNDsK9",
        "source": "B3e1A2EXeD4VWU4Gd3cHgLhcpSqHMbyCijBDFHET7J6m",
        "destination": "89tQPeezpRWPT3E4NFg1Z5dVzycVwSmUruUV4ii4jm11",
        "destinationOwner": "AknTq2cJ8wqNMLejEJjbRmPrh3bhmeortyYMmMgDLVm9",
        "destinationBalance": {
          "amount": "757877546120",
          "decimals": 6,
          "uiAmount": 757877.54612,
          "uiAmountString": "757877.54612"
        },
        "destinationPreBalance": {
          "amount": "757661261340",
          "decimals": 6,
          "uiAmount": 757661.26134,
          "uiAmountString": "757661.26134"
        },
        "sourceBalance": {
          "amount": "688343524484186",
          "decimals": 6,
          "uiAmount": 688343524.484186,
          "uiAmountString": "688343524.484186"
        },
        "sourcePreBalance": {
          "amount": "688343740768966",
          "decimals": 6,
          "uiAmount": 688343740.768966,
          "uiAmountString": "688343740.768966"
        }
      },
      "fee": {
        "mint": "So11111111111111111111111111111111111111112",
        "amount": 1.2e-8,
        "amountRaw": "12",
        "decimals": 9
      },
      "fees": [
        {
          "mint": "So11111111111111111111111111111111111111112",
          "amount": 6e-9,
          "amountRaw": "6",
          "decimals": 9,
          "dex": "Pumpswap",
          "type": "protocol",
          "recipient": "62qc2CNXwrYqQScmEdiZFFAnJR262PxWEuNQtxfafNgV"
        },
        {
          "mint": "So11111111111111111111111111111111111111112",
          "amount": 6e-9,
          "amountRaw": "6",
          "decimals": 9,
          "dex": "Pumpswap",
          "type": "coinCreator",
          "recipient": "5ZzRvjZZw4JiDbPQc7NuG9wp4wDjXoWiQo6JpSSYxQZe"
        }
      ],
      "user": "AknTq2cJ8wqNMLejEJjbRmPrh3bhmeortyYMmMgDLVm9",
      "programId": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
      "amm": "Pumpswap",
      "route": "",
      "slot": 342990121,
      "timestamp": 1748422171,
      "signature": "5pBu3T3iguqLpgtKTmhfiik13EruLVKNa28ZMtkrE2hhcM1hM1D7aNn7vgiqQsahFTaw6kiJiPre6suJAJdKrK2y",
      "idx": "3-4"
    }
  ],
  [
    {
      "type": "SELL",
      "inputToken": {
        "mint": "Fm7ckJswRxEoEioxADghLxpTAvPZLL5cVB5j4xnkFurc",
        "amount": 340138.099494,
        "amountRaw": "340138099494",
        "decimals": 6,
        "authority": "EQx3kmRJrpctA9WELKBN3A21QeonyKcuqNdqvcwLLBzL",
        "source": "52TTBdzHptrsyq8qps6xYWm6mpnvLCrBj8UBX1Ae6UGr",
        "destination": "2yvAmUwMmyuGB77WVPq21hCswnavAuBxC1zUW2eKA9Kp",
        "destinationOwner": "3d1jTRVGvZcisKdpi7UDsJFPy1gxKJHf8vqi6Tz3Dfhz",
        "destinationBalance": {
          "amount": "145113022999319",
          "decimals": 6,
          "uiAmount": 145113022.999319,
          "uiAmountString": "145113022.999319"
        },
        "destinationPreBalance": {
          "amount": "144772884899825",
          "decimals": 6,
          "uiAmount": 144772884.899825,
          "uiAmountString": "144772884.899825"
        },
        "sourceBalance": {
          "amount": "0",
          "decimals": 6,
          "uiAmount": null,
          "uiAmountString": "0"
        },
        "sourcePreBalance": {
          "amount": "340138099494",
          "decimals": 6,
          "uiAmount": 340138.099494,
          "uiAmountString": "340138.099494"
        }
      },
      "outputToken": {
        "mint": "So11111111111111111111111111111111111111112",
        "amount": 0.301285783,
        "amountRaw": "301285783",
        "decimals": 9,
        "authority": "3d1jTRVGvZcisKdpi7UDsJFPy1gxKJHf8vqi6Tz3Dfhz",
        "source": "DKo53GXZ33Y7fnEe5VCrcjCKXXE7WcZP97xAfHKTjrTc",
        "destination": "5kVSJKXWs6FDv4wGdxczvgZBataYaPEMZDED1WKWPXgY",
        "sourceBalance": {
          "amount": "128622655820",
          "decimals": 9,
          "uiAmount": 128.62265582,
          "uiAmountString": "128.62265582"
        },
        "sourcePreBalance": {
          "amount": "128924243797",
          "decimals": 9,
          "uiAmount": 128.924243797,
          "uiAmountString": "128.924243797"
        }
      },
      "fee": {
        "mint": "So11111111111111111111111111111111111111112",
        "amount": 0.000302194,
        "amountRaw": "151097",
        "decimals": 9,
        "dex": "Pumpswap"
      },
      "fees": [
        {
          "mint": "So11111111111111111111111111111111111111112",
          "amount": 0.000151097,
          "amountRaw": "151097",
          "decimals": 9,
          "dex": "Pumpswap",
          "type": "protocol",
          "recipient": "62qc2CNXwrYqQScmEdiZFFAnJR262PxWEuNQtxfafNgV"
        },
        {
          "mint": "So11111111111111111111111111111111111111112",
          "amount": 0.000151097,
          "amountRaw": "151097",
          "decimals": 9,
          "dex": "Pumpswap",
          "type": "coinCreator",
          "recipient": "7fUaeJtTSg9NcgerLpbByEAwsGyu2goXC4r3j439v4am"
        }
      ],
      "user": "EQx3kmRJrpctA9WELKBN3A21QeonyKcuqNdqvcwLLBzL",
      "programId": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
      "amm": "Pumpswap",
      "route": "",
      "slot": 342990121,
      "timestamp": 1748422171,
      "signature": "bKAGfAQnTh87AqSER3zE71dNv2v6JYjGs3XxFmGnic23qewrF2VXrPfjptXcnGKMyRBFVvXKqmFaqJFjZs3G7R2",
      "idx": "5-4"
    }
  ],
  [
    {
      "type": "BUY",
      "inputToken": {
        "mint": "So11111111111111111111111111111111111111112",
        "amount": 2.304025392,
        "amountRaw": "2304025392",
        "decimals": 9,
        "authority": "5SeqLEk4uu5MNJgqJqoEDz4FPo7jboB3qUfZycMA32P6",
        "source": "J7tXAi7NoqHqtim2tixfNg1w9sRaqYkVVzgA3uPuhu2z",
        "destination": "FZfobkHHAXdYhm2U4y7S7fbVZ44MvwVJQ2GdGhSv9k8b",
        "destinationOwner": "AY2rBf9K3qpmHTCy9XyrgRB1Z94bqN8PtoHWBdu7Z86B",
        "destinationBalance": {
          "amount": "81338674864",
          "decimals": 9,
          "uiAmount": 81.338674864,
          "uiAmountString": "81.338674864"
        },
        "destinationPreBalance": {
          "amount": "79034649472",
          "decimals": 9,
          "uiAmount": 79.034649472,
          "uiAmountString": "79.034649472"
        }
      },
      "outputToken": {
        "mint": "254KyaCvZftpN65RonB6F4fDFuU5ysxTE7gGYjyLcC7z",
        "amount": 1949658.417625,
        "amountRaw": "1949658417625",
        "decimals": 6,
        "authority": "AY2rBf9K3qpmHTCy9XyrgRB1Z94bqN8PtoHWBdu7Z86B",
        "source": "CD7bUECudJxVAqHQLTxT4g1HPH6vwVvNsrhyYJCJ7J3f",
        "destination": "Cmy4mh9SkeH9R1KQVnghFWftxG9qgQBam6iRrdfQtQTW",
        "destinationOwner": "5SeqLEk4uu5MNJgqJqoEDz4FPo7jboB3qUfZycMA32P6",
        "destinationBalance": {
          "amount": "2506799433271",
          "decimals": 6,
          "uiAmount": 2506799.433271,
          "uiAmountString": "2506799.433271"
        },
        "destinationPreBalance": {
          "amount": "557141015646",
          "decimals": 6,
          "uiAmount": 557141.015646,
          "uiAmountString": "557141.015646"
        },
        "sourceBalance": {
          "amount": "67050375707264",
          "decimals": 6,
          "uiAmount": 67050375.707264,
          "uiAmountString": "67050375.707264"
        },
        "sourcePreBalance": {
          "amount": "69001011397279",
          "decimals": 6,
          "uiAmount": 69001011.397279,
          "uiAmountString": "69001011.397279"
        }
      },
      "fee": {
        "mint": "254KyaCvZftpN65RonB6F4fDFuU5ysxTE7gGYjyLcC7z",
        "amount": 977.27239,
        "amountRaw": "977272390",
        "decimals": 6,
        "dex": "Pumpswap"
      },
      "fees": [
        {
          "mint": "254KyaCvZftpN65RonB6F4fDFuU5ysxTE7gGYjyLcC7z",
          "amount": 977.27239,
          "amountRaw": "977272390",
          "decimals": 6,
          "dex": "Pumpswap",
          "type": "protocol",
          "recipient": "JCRGumoE9Qi5BBgULTgdgTLjSgkCMSbF62ZZfGs84JeU"
        }
      ],
      "user": "5SeqLEk4uu5MNJgqJqoEDz4FPo7jboB3qUfZycMA32P6",
      "programId": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
      "amm": "Pumpswap",
      "route": "",
      "slot": 342990121,
      "timestamp": 1748422171,
      "signature": "3GMu8jkzqM2DHwHT4a9Jys1Qmb94jWZihzC5TzikNVBrheY5E3gnogA8odEhZGtrtvjrfavV6gzGxVGVgho3X94k",
      "idx": "3-3"
    }
  ]
]

describe('Parser', () => {
  let connection: Connection;
  beforeAll(async () => {
    // Initialize connection
    const rpcUrl = process.env.SOLANA_RPC_URL;
    if (!rpcUrl) {
      throw new Error('SOLANA_RPC_URL environment variable is not set');
    }
    connection = new Connection(rpcUrl);
  });

  describe('Pumpswap', () => {
    it('pumpfun events', async () => {
      const tx = await connection.getTransaction(
        //  '23ACnYkaTqpHDvSJkhwqFb72KUXUjL4Bd8kwLNyRS1nzjxMxjrBnp7A5Gfogr9typ8imsckGfqWrCNhJg68MDsyL', //create & buy
        // '5fiQbExgdp1FAjDnrv9aEpXajCMUtm1c3E7NnsDdu4CtKr5xBpALdK7ENzx5LN1SzZKJk7cxbWWc84T7yHwb8p2x', // create pool & buy
        // '63PQNtzDQdBDnf7FMC4jafDPhDVZHHhZwhJAbCT25efDgXt4H3fxPSQCAacV5Psaz5aKrRk35ubc97oQuozg9rwV', // deposit
        // "2Z6pDoWEVYwf4v4fzNVNLW1c2DzEK24WhpyK45ZBkZBiUBogVCfG67U5b1ff6W3ixKPotLTB2k5FTKCKgNtKYJgv", // withdraw
        '5cvgMuLS7JmbU2WTv5gzLag2YmvuMAwuBBjLvZfGsBBW29PAGQTzhevG977yqu4PUoLbYtWjFPoAtmvwMbieS8SF',//withdraw
        // 'hK2uGL365L97fmYRoapkr3wvoMbTe4DtzQqJrwLrSkdSBLF7WyuW8sxj9pBe2ikjshuFWMsxgE83Bw6VURdMEPH',//buy
        // "4oPbwpFNh4LwP1p5JqyPHYLq83cWpfyW5jj4tVVbRocKqNiAuF8LRDZzqAbawBdvXsNeh2mX2ERMT1i17n8E3SN7", // sell
        {
          maxSupportedTransactionVersion: 0,
        }
      );
      if (!tx) throw new Error('Transaction not found');
      const parser = new PumpswapEventParser(new TransactionAdapter(tx));
      const events = parser.processEvents();
      console.log(events);
      expect(events.length).toBeGreaterThan(0);
    });
  });
});

describe('Pumpswap Trades', () => {
  let connection: Connection;
  beforeAll(async () => {
    // Initialize connection
    const rpcUrl = process.env.SOLANA_RPC_URL;
    if (!rpcUrl) {
      throw new Error('SOLANA_RPC_URL environment variable is not set');
    }
    connection = new Connection(rpcUrl);
  });

  Object.values(tests)
    .forEach((testItem: any[]) => {
      const test = testItem[0];
      it(`${test.type} > ${test.signature} `, async () => {
        const tx = await connection.getTransaction(test.signature, {
          maxSupportedTransactionVersion: 0,
        });
        if (!tx) throw new Error('Transaction not found');
        const parser = new DexParser();
        const { trades } = parser.parseAll(tx, test.timestamp);

        testItem.forEach((item, idx) => {
          const trade = trades[idx];
          if (!trade) throw new Error('Transfer not found');
          expect(trade.type).toEqual(item.type);
          expect(trade.user).toEqual(item.user);
          expect(trade.inputToken.mint).toEqual(item.inputToken.mint);
          expect(trade.inputToken.amount).toEqual(item.inputToken.amount);
          expect(trade.inputToken.amountRaw).toEqual(item.inputToken.amountRaw);
          expect(trade.inputToken.decimals).toEqual(item.inputToken.decimals);
          expect(trade.outputToken.mint).toEqual(item.outputToken.mint);
          expect(trade.outputToken.amount).toEqual(item.outputToken.amount);
          expect(trade.outputToken.amountRaw).toEqual(item.outputToken.amountRaw);
          expect(trade.outputToken.decimals).toEqual(item.outputToken.decimals);
          expect(trade.fee?.mint).toEqual(item.fee?.mint);
          expect(trade.fee?.amount).toEqual(item.fee?.amount);
          expect(trade.fee?.amountRaw).toEqual(item.fee?.amountRaw);
          expect(trade.fee?.decimals).toEqual(item.fee?.decimals);
          expect(trade.fees?.length).toEqual(item.fees?.length);
          if (trade.fees) {
            trade.fees.forEach((fee, idx) => {
              expect(fee.mint).toEqual(item.fees[idx].mint);
              expect(fee.amount).toEqual(item.fees[idx].amount);
              expect(fee.amountRaw).toEqual(item.fees[idx].amountRaw);
              expect(fee.decimals).toEqual(item.fees[idx].decimals);
              expect(fee.dex).toEqual(item.fees[idx].dex);
              expect(fee.type).toEqual(item.fees[idx].type);
              expect(fee.recipient).toEqual(item.fees[idx].recipient);
            })
          }
          expect(trade.amm).toEqual(item.amm);
          expect(trade.route).toEqual(item.route);
          expect(trade.programId).toEqual(item.programId);
          expect(trade.slot).toEqual(item.slot);
          expect(trade.timestamp).toEqual(item.timestamp);
          expect(trade.signature).toEqual(item.signature);
        });
      });
    });
});
