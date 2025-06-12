import { DEX_PROGRAMS, DISCRIMINATORS } from '../../constants';
import { InstructionClassifier } from '../../instruction-classifier';
import { TransactionAdapter } from '../../transaction-adapter';
import { ClassifiedInstruction, InstructionParser, PumpswapEvent } from '../../types';
import { getInstructionData, sortByIdx } from '../../utils';
import { BinaryReader } from '../binary-reader';

export class PumpswapInstructionParser {
  constructor(
    private readonly adapter: TransactionAdapter,
    private readonly classifier: InstructionClassifier
  ) {}

  private readonly instructionParsers: Record<string, InstructionParser<any>> = {
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

  public processInstructions(): PumpswapEvent[] {
    const instructions = this.classifier.getInstructions(DEX_PROGRAMS.PUMP_SWAP.id);
    return this.parseInstructions(instructions);
  }

  public parseInstructions(instructions: ClassifiedInstruction[]): PumpswapEvent[] {
    return sortByIdx(
      instructions
        .map(({ instruction, outerIndex, innerIndex }) => {
          try {
            const data = getInstructionData(instruction);
            const discriminator = Buffer.from(data.slice(0, 8));

            for (const [type, parser] of Object.entries(this.instructionParsers)) {
              if (discriminator.equals(parser.discriminator)) {
                const eventData = parser.decode(instruction, { data: data });
                if (!eventData) return null;

                const event = {
                  type: type as 'CREATE' | 'ADD' | 'REMOVE' | 'BUY' | 'SELL',
                  data: eventData,
                  slot: this.adapter.slot,
                  timestamp: this.adapter.blockTime || 0,
                  signature: this.adapter.signature,
                  idx: `${outerIndex}-${innerIndex ?? 0}`,
                  signer: this.adapter.signers,
                } as PumpswapEvent;
                return event;
              }
            }
          } catch (error) {
            console.error('Failed to parse Pumpswap instruction:', error);
            throw error;
          }
          return null;
        })
        .filter((event): event is PumpswapEvent => event !== null)
    );
  }

  private decodeBuyEvent(instruction: any, options: any) {
    const { data } = options;
    const reader = new BinaryReader(data);
    const accounts = this.adapter.getInstructionAccounts(instruction);
    return {
      poolMint: accounts[0],
      user: accounts[1],
      baseMint: accounts[3],
      quoteMint: accounts[4],
      userBaseTokenAccount: accounts[5],
      userQuoteTokenAccount: accounts[6],
      poolBaseTokenAccount: accounts[7],
      poolQuoteTokenAccount: accounts[8],
      baseAmountOut: reader.readU64(),
      maxQuoteAmountIn: reader.readU64(),
    };
  }

  private decodeSellEvent(instruction: any, options: any) {
    const { data } = options;
    const reader = new BinaryReader(data);
    const accounts = this.adapter.getInstructionAccounts(instruction);
    return {
      poolMint: accounts[0],
      user: accounts[1],
      baseMint: accounts[3],
      quoteMint: accounts[4],
      userBaseTokenAccount: accounts[5],
      userQuoteTokenAccount: accounts[6],
      poolBaseTokenAccount: accounts[7],
      poolQuoteTokenAccount: accounts[8],
      baseAmountIn: reader.readU64(),
      minQuoteAmountOut: reader.readU64(),
    };
  }

  private decodeAddLiquidity(instruction: any, options: any) {
    const { data } = options;
    const reader = new BinaryReader(data);
    const accounts = this.adapter.getInstructionAccounts(instruction);
    return {
      poolMint: accounts[0],
      user: accounts[2],
      baseMint: accounts[3],
      quoteMint: accounts[4],
      lpMint: accounts[5],
      userBaseTokenAccount: accounts[6],
      userQuoteTokenAccount: accounts[7],
      userPoolTokenAccount: accounts[8],
      poolBaseTokenAccount: accounts[9],
      poolQuoteTokenAccount: accounts[10],
      lpTokenAmountOut: reader.readU64(),
      maxBaseAmountIn: reader.readU64(),
      maxQuoteAmountIn: reader.readU64(),
    };
  }

  private decodeCreateEvent(instruction: any, options: any) {
    const { data } = options;
    const reader = new BinaryReader(data);
    reader.readU16();
    const accounts = this.adapter.getInstructionAccounts(instruction);
    return {
      poolMint: accounts[0],
      user: accounts[2],
      baseMint: accounts[3],
      quoteMint: accounts[4],
      lpMint: accounts[5],
      userBaseTokenAccount: accounts[6],
      userQuoteTokenAccount: accounts[7],
      userPoolTokenAccount: accounts[8],
      poolBaseTokenAccount: accounts[9],
      poolQuoteTokenAccount: accounts[10],
      baseAmountIn: reader.readU64(),
      quoteAmountOut: reader.readU64(),
    };
  }

  private decodeRemoveLiquidity(instruction: any, options: any) {
    const { data } = options;
    const reader = new BinaryReader(data);
    const accounts = this.adapter.getInstructionAccounts(instruction);
    return {
      poolMint: accounts[0],
      user: accounts[2],
      baseMint: accounts[3],
      quoteMint: accounts[4],
      lpMint: accounts[5],
      userBaseTokenAccount: accounts[6],
      userQuoteTokenAccount: accounts[7],
      userPoolTokenAccount: accounts[8],
      poolBaseTokenAccount: accounts[9],
      poolQuoteTokenAccount: accounts[10],
      lpTokenAmountIn: reader.readU64(),
      minBaseAmountOut: reader.readU64(),
      minQuoteAmountOut: reader.readU64(),
    };
  }
}
