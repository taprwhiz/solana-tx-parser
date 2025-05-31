import { DEX_PROGRAMS, DISCRIMINATORS } from '../../constants';
import { InstructionClassifier } from '../../instruction-classifier';
import { TransactionAdapter } from '../../transaction-adapter';
import {
  ClassifiedInstruction,
  EventParser,
  PumpswapBuyEvent,
  PumpswapCreatePoolEvent,
  PumpswapDepositEvent,
  PumpswapEvent,
  PumpswapSellEvent,
  PumpswapWithdrawEvent,
} from '../../types';
import { getInstructionData } from '../../utils';
import { BinaryReader } from '../binary-reader';

export class PumpswapEventParser {
  constructor(private readonly adapter: TransactionAdapter) {}

  private readonly eventParsers: Record<string, EventParser<any>> = {
    CREATE: {
      discriminator: DISCRIMINATORS.PUMPSWAP.CREATE_POOL,
      decode: this.decodeCreateEvent.bind(this),
    },
    ADD: {
      discriminator: DISCRIMINATORS.PUMPSWAP.ADD_LIQUIDITY,
      decode: this.decodeAddLiquidity.bind(this),
    },
    REMOVE: {
      discriminator: DISCRIMINATORS.PUMPSWAP.REMOVE_LIQUIDITY,
      decode: this.decodeRemoveLiquidity.bind(this),
    },
    BUY: {
      discriminator: DISCRIMINATORS.PUMPSWAP.BUY,
      decode: this.decodeBuyEvent.bind(this),
    },
    SELL: {
      discriminator: DISCRIMINATORS.PUMPSWAP.SELL,
      decode: this.decodeSellEvent.bind(this),
    },
  };

  public processEvents(): PumpswapEvent[] {
    const instructions = new InstructionClassifier(this.adapter).getInstructions(DEX_PROGRAMS.PUMP_SWAP.id);
    return this.parseInstructions(instructions);
  }

  public parseInstructions(instructions: ClassifiedInstruction[]): PumpswapEvent[] {
    return instructions
      .map(({ instruction, outerIndex, innerIndex }) => {
        try {
          const data = getInstructionData(instruction);
          const discriminator = Buffer.from(data.slice(0, 16));

          for (const [type, parser] of Object.entries(this.eventParsers)) {
            if (discriminator.equals(parser.discriminator)) {
              const eventData = parser.decode(data.slice(16));
              if (!eventData) return null;

              const event = {
                type: type as 'CREATE' | 'ADD' | 'REMOVE' | 'BUY' | 'SELL',
                data: eventData,
                slot: this.adapter.slot,
                timestamp: this.adapter.blockTime || 0,
                signature: this.adapter.signature,
                idx: `${outerIndex}-${innerIndex ?? 0}`,
              };
              return event;
            }
          }
        } catch (error) {
          console.error('Failed to parse Pumpswap event:', error);
          throw error;
        }
        return null;
      })
      .filter((event): event is PumpswapEvent => event !== null);
  }

  private decodeBuyEvent(data: Buffer): PumpswapBuyEvent {
    const reader = new BinaryReader(data);
    return {
      timestamp: Number(reader.readI64()),
      baseAmountOut: reader.readU64(),
      maxQuoteAmountIn: reader.readU64(),
      userBaseTokenReserves: reader.readU64(),
      userQuoteTokenReserves: reader.readU64(),
      poolBaseTokenReserves: reader.readU64(),
      poolQuoteTokenReserves: reader.readU64(),
      quoteAmountIn: reader.readU64(),
      lpFeeBasisPoints: reader.readU64(),
      lpFee: reader.readU64(),
      protocolFeeBasisPoints: reader.readU64(),
      protocolFee: reader.readU64(),
      quoteAmountInWithLpFee: reader.readU64(),
      userQuoteAmountIn: reader.readU64(),
      pool: reader.readPubkey(),
      user: reader.readPubkey(),
      userBaseTokenAccount: reader.readPubkey(),
      userQuoteTokenAccount: reader.readPubkey(),
      protocolFeeRecipient: reader.readPubkey(),
      protocolFeeRecipientTokenAccount: reader.readPubkey(),
      coinCreator: data.length > 304 ? reader.readPubkey() : '11111111111111111111111111111111',
      coinCreatorFeeBasisPoints: data.length > 304 ? reader.readU64() : 0n,
      coinCreatorFee: data.length > 304 ? reader.readU64() : 0n,
    };
  }

  private decodeSellEvent(data: Buffer): PumpswapSellEvent {
    const reader = new BinaryReader(data);

    return {
      timestamp: Number(reader.readI64()),
      baseAmountIn: reader.readU64(),
      minQuoteAmountOut: reader.readU64(),
      userBaseTokenReserves: reader.readU64(),
      userQuoteTokenReserves: reader.readU64(),
      poolBaseTokenReserves: reader.readU64(),
      poolQuoteTokenReserves: reader.readU64(),
      quoteAmountOut: reader.readU64(),
      lpFeeBasisPoints: reader.readU64(),
      lpFee: reader.readU64(),
      protocolFeeBasisPoints: reader.readU64(),
      protocolFee: reader.readU64(),
      quoteAmountOutWithoutLpFee: reader.readU64(),
      userQuoteAmountOut: reader.readU64(),
      pool: reader.readPubkey(),
      user: reader.readPubkey(),
      userBaseTokenAccount: reader.readPubkey(),
      userQuoteTokenAccount: reader.readPubkey(),
      protocolFeeRecipient: reader.readPubkey(),
      protocolFeeRecipientTokenAccount: reader.readPubkey(),
      coinCreator: data.length > 304 ? reader.readPubkey() : '11111111111111111111111111111111',
      coinCreatorFeeBasisPoints: data.length > 304 ? reader.readU64() : 0n,
      coinCreatorFee: data.length > 304 ? reader.readU64() : 0n,
    };
  }

  private decodeAddLiquidity(data: Buffer): PumpswapDepositEvent {
    const reader = new BinaryReader(data);

    return {
      timestamp: Number(reader.readI64()),
      lpTokenAmountOut: reader.readU64(),
      maxBaseAmountIn: reader.readU64(),
      maxQuoteAmountIn: reader.readU64(),
      userBaseTokenReserves: reader.readU64(),
      userQuoteTokenReserves: reader.readU64(),
      poolBaseTokenReserves: reader.readU64(),
      poolQuoteTokenReserves: reader.readU64(),
      baseAmountIn: reader.readU64(),
      quoteAmountIn: reader.readU64(),
      lpMintSupply: reader.readU64(),

      pool: reader.readPubkey(),
      user: reader.readPubkey(),
      userBaseTokenAccount: reader.readPubkey(),
      userQuoteTokenAccount: reader.readPubkey(),
      userPoolTokenAccount: reader.readPubkey(),
    };
  }

  private decodeCreateEvent(data: Buffer): PumpswapCreatePoolEvent {
    const reader = new BinaryReader(data);
    return {
      timestamp: Number(reader.readI64()),
      index: reader.readU16(),
      creator: reader.readPubkey(),
      baseMint: reader.readPubkey(),
      quoteMint: reader.readPubkey(),
      baseMintDecimals: reader.readU8(),
      quoteMintDecimals: reader.readU8(),
      baseAmountIn: reader.readU64(),
      quoteAmountIn: reader.readU64(),
      poolBaseAmount: reader.readU64(),
      poolQuotAmount: reader.readU64(),
      minimumLiquidity: reader.readU64(),
      initialLiquidity: reader.readU64(),
      lpTokenAmountOut: reader.readU64(),
      poolBump: reader.readU8(),
      pool: reader.readPubkey(),
      lpMint: reader.readPubkey(),
      userBaseTokenAccount: reader.readPubkey(),
      userQuoteTokenAccount: reader.readPubkey(),
    };
  }

  private decodeRemoveLiquidity(data: Buffer): PumpswapWithdrawEvent {
    const reader = new BinaryReader(data);
    return {
      timestamp: Number(reader.readI64()),
      lpTokenAmountIn: reader.readU64(),
      minBaseAmountOut: reader.readU64(),
      minQuoteAmountOut: reader.readU64(),
      userBaseTokenReserves: reader.readU64(),
      userQuoteTokenReserves: reader.readU64(),
      poolBaseTokenReserves: reader.readU64(),
      poolQuoteTokenReserves: reader.readU64(),
      baseAmountOut: reader.readU64(),
      quoteAmountOut: reader.readU64(),
      lpMintSupply: reader.readU64(),
      pool: reader.readPubkey(),
      user: reader.readPubkey(),
      userBaseTokenAccount: reader.readPubkey(),
      userQuoteTokenAccount: reader.readPubkey(),
      userPoolTokenAccount: reader.readPubkey(),
    };
  }
}
