import { DexParser } from "../dex-parser";
import { TransactionAdapter } from "../transaction-adapter";
import { txs } from "./shred-tx.test.case";

describe('Shred Parser', () => {
    const parser = new DexParser();
    txs.forEach((tx) => {
        if (tx.skipTest) return;
        const adapter = new TransactionAdapter(tx.transaction as any);
        it(`shred-stream-${adapter.signature}`, async () => {
            const rs = parser.parseAll(tx.transaction as any);

            console.log(rs, JSON.stringify(rs, null, 2));

        })
    })
});