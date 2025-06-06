import { DISCRIMINATORS } from '../../constants';
import { TradeInfo } from '../../types';
import { getProgramName, getInstructionData } from '../../utils';
import { BaseParser } from '../base-parser';

export class RaydiumParser extends BaseParser {
  public processTrades(): TradeInfo[] {
    const trades: TradeInfo[] = [];

    this.classifiedInstructions.forEach(({ instruction, programId, outerIndex, innerIndex }) => {
      if (this.notLiquidityEvent(instruction)) {
        const transfers = this.getTransfersForInstruction(programId, outerIndex, innerIndex);

        if (transfers.length >= 2) {
          const trade = this.utils.processSwapData(transfers.slice(0, 2), {
            ...this.dexInfo,
            amm: this.dexInfo.amm || getProgramName(programId),
          });

          if (trade) {
            if (transfers.length > 2) {
              trade.fee = this.utils.getTransferTokenInfo(transfers[2]) ?? undefined;
            }
            trades.push(this.utils.attachTokenTransferInfo(trade, this.transferActions));
          }
        }
      }
    });

    return trades;
  }

  private notLiquidityEvent(instruction: any): boolean {
    if (instruction.data) {
      const data = getInstructionData(instruction);
      const a = Object.values(DISCRIMINATORS.RAYDIUM).some((it) => data.slice(0, 1).equals(it));
      const b = Object.values(DISCRIMINATORS.RAYDIUM_CL)
        .flatMap((it) => Object.values(it))
        .some((it) => data.slice(0, 8).equals(it));
      const c = Object.values(DISCRIMINATORS.RAYDIUM_CPMM).some((it) => data.slice(0, 8).equals(it));
      return !a && !b && !c;
    }
    return true;
  }
}
