import { DexParser } from "../dex-parser";
import { blockSubscribe } from "./grpc-block.test.case";

describe('Parser', () => {
    it("grpc-block", async () => {
        const parser = new DexParser();
        const block = blockSubscribe.block;
        block.transactions.forEach((tx, idx) => {

            if (tx) {
                const result = parser.parseAll({
                    ...tx!,
                    slot: Number(block.slot),
                    blockTime: Number(block.blockTime.timestamp)
                } as any
                );

                console.log(`tx-${tx.signature} > index:${idx}`, JSON.stringify(result, null, 2));
            }
        });
    });
});
