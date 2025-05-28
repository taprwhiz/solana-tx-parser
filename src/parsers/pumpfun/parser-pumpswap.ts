import { TransactionAdapter } from '../../transaction-adapter';
import {
  ClassifiedInstruction,
  DexInfo,
  PumpswapBuyEvent,
  PumpswapEvent,
  PumpswapSellEvent,
  TradeInfo,
  TransferData,
} from '../../types';
import { BaseParser } from '../base-parser';
import { PumpswapEventParser } from './parser-pumpswap-event';
import { getPumpswapBuyInfo, getPumpswapSellInfo } from './util';

export class PumpswapParser extends BaseParser {
  private eventParser: PumpswapEventParser;

  constructor(
    adapter: TransactionAdapter,
    dexInfo: DexInfo,
    transferActions: Record<string, TransferData[]>,
    classifiedInstructions: ClassifiedInstruction[]
  ) {
    super(adapter, dexInfo, transferActions, classifiedInstructions);
    this.eventParser = new PumpswapEventParser(adapter);
  }

  public processTrades(): TradeInfo[] {
    const events = this.eventParser
      .parseInstructions(this.classifiedInstructions)
      .filter((event) => ['BUY', 'SELL'].includes(event.type));

    return events.map((event) => (event.type === 'BUY' ? this.createBuyInfo(event) : this.createSellInfo(event)));
  }

  private createBuyInfo(data: PumpswapEvent): TradeInfo {
    const event = data.data as PumpswapBuyEvent;

    const inputMint = this.adapter.splTokenMap.get(event.userQuoteTokenAccount)?.mint;
    if (!inputMint) throw new Error('inputMint not found');
    const outputMint = this.adapter.splTokenMap.get(event.userBaseTokenAccount)?.mint;
    if (!outputMint) throw new Error('outputMint not found');
    const feeMint = this.adapter.splTokenMap.get(event.protocolFeeRecipientTokenAccount)?.mint;
    if (!feeMint) throw new Error('feeMint not found');

    const inputDecimal = this.adapter.getTokenDecimals(inputMint);
    const ouptDecimal = this.adapter.getTokenDecimals(outputMint);
    const feeDecimal = this.adapter.getTokenDecimals(feeMint);

    const trade = getPumpswapBuyInfo(
      event,
      { mint: inputMint, decimals: inputDecimal },
      { mint: outputMint, decimals: ouptDecimal },
      { mint: feeMint, decimals: feeDecimal },
      {
        slot: data.slot,
        signature: data.signature,
        timestamp: data.timestamp,
        idx: data.idx,
        dexInfo: this.dexInfo,
      }
    );

    return this.utils.attachTokenTransferInfo(trade, this.transferActions);
  }

  private createSellInfo(data: PumpswapEvent): TradeInfo {
    const event = data.data as PumpswapSellEvent;

    const inputMint = this.adapter.splTokenMap.get(event.userBaseTokenAccount)?.mint;
    if (!inputMint) throw new Error('inputMint not found');
    const outputMint = this.adapter.splTokenMap.get(event.userQuoteTokenAccount)?.mint;
    if (!outputMint) throw new Error('outputMint not found');
    const feeMint = this.adapter.splTokenMap.get(event.protocolFeeRecipientTokenAccount)?.mint;
    if (!feeMint) throw new Error('feeMint not found');

    const inputDecimal = this.adapter.getTokenDecimals(inputMint);
    const ouptDecimal = this.adapter.getTokenDecimals(outputMint);
    const feeDecimal = this.adapter.getTokenDecimals(feeMint);

    const trade = getPumpswapSellInfo(
      event,
      { mint: inputMint, decimals: inputDecimal },
      { mint: outputMint, decimals: ouptDecimal },
      { mint: feeMint, decimals: feeDecimal },
      {
        slot: data.slot,
        signature: data.signature,
        timestamp: data.timestamp,
        idx: data.idx,
        dexInfo: this.dexInfo,
      }
    );

    return this.utils.attachTokenTransferInfo(trade, this.transferActions);
  }
}
