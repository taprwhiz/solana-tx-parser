import { DEX_PROGRAMS, DISCRIMINATORS, TOKENS } from '../../constants';
import { InstructionClassifier } from '../../instruction-classifier';
import { TransactionAdapter } from '../../transaction-adapter';
import {
  BoopfunCompleteEvent,
  BoopfunCreateEvent,
  BoopfunEvent,
  BoopfunTradeEvent,
  ClassifiedInstruction,
  EventsParser,
  TransferData,
} from '../../types';
import { getInstructionData, sortByIdx } from '../../utils';
import { BinaryReader } from '../binary-reader';

/**
 * Parse Boopfun events (CREATE/BUY/SELL/COMPLETE)
 */
export class BoopfunEventParser {
  constructor(
    private readonly adapter: TransactionAdapter,
    private readonly transferActions: Record<string, TransferData[]>
  ) {}

  private readonly eventParsers: Record<string, EventsParser<any>> = {
    BUY: {
      discriminators: [DISCRIMINATORS.BOOPFUN.BUY],
      slice: 8,
      decode: this.decodeBuyEvent.bind(this),
    },
    SELL: {
      discriminators: [DISCRIMINATORS.BOOPFUN.SELL],
      slice: 8,
      decode: this.decodeSellEvent.bind(this),
    },
    CREATE: {
      discriminators: [DISCRIMINATORS.BOOPFUN.CREATE],
      slice: 8,
      decode: this.decodeCreateEvent.bind(this),
    },
    COMPLETE: {
      discriminators: [DISCRIMINATORS.BOOPFUN.COMPLETE],
      slice: 8,
      decode: this.decodeCompleteEvent.bind(this),
    },
  };

  public processEvents(): BoopfunEvent[] {
    const instructions = new InstructionClassifier(this.adapter).getInstructions(DEX_PROGRAMS.BOOP_FUN.id);
    return this.parseInstructions(instructions);
  }

  public parseInstructions(instructions: ClassifiedInstruction[]): BoopfunEvent[] {
    return sortByIdx(
      instructions
        .map(({ instruction, outerIndex, innerIndex }) => {
          try {
            const data = getInstructionData(instruction);

            for (const [type, parser] of Object.entries(this.eventParsers)) {
              const discriminator = Buffer.from(data.slice(0, parser.slice));
              if (parser.discriminators.some((it) => discriminator.equals(it))) {
                const options = {
                  instruction,
                  outerIndex,
                  innerIndex,
                };
                const eventData = parser.decode(data.slice(parser.slice), options);
                if (!eventData) return null;

                return {
                  type: type as 'BUY' | 'SELL' | 'CREATE' | 'COMPLETE',
                  data: eventData,
                  slot: this.adapter.slot,
                  timestamp: this.adapter.blockTime || 0,
                  signature: this.adapter.signature,
                  idx: `${outerIndex}-${innerIndex ?? 0}`,
                };
              }
            }
          } catch (error) {
            console.error('Failed to parse Boopfun event:', error);
            throw error;
          }
          return null;
        })
        .filter((event): event is BoopfunEvent => event !== null)
    );
  }

  private decodeBuyEvent(data: Buffer, options: any): BoopfunTradeEvent {
    const { instruction, outerIndex, innerIndex } = options;
    // get instruction accounts
    const accounts = this.adapter.getInstructionAccounts(instruction);
    const reader = new BinaryReader(data);

    const transfers = this.getTransfersForInstruction(
      this.adapter.getInstructionProgramId(instruction),
      outerIndex,
      innerIndex
    );
    const transfer = transfers.find((transfer) => transfer.info.mint == accounts[0]);

    return {
      mint: accounts[0],
      solAmount: reader.readU64(),
      tokenAmount: BigInt(transfer?.info.tokenAmount.amount || '0'),
      isBuy: true,
      user: accounts[6],
      bondingCurve: accounts[1],
    };
  }

  private decodeSellEvent(data: Buffer, options: any): BoopfunTradeEvent {
    const { instruction, outerIndex, innerIndex } = options;
    // get instruction accounts
    const accounts = this.adapter.getInstructionAccounts(instruction);
    const reader = new BinaryReader(data);

    const transfers = this.getTransfersForInstruction(
      this.adapter.getInstructionProgramId(instruction),
      outerIndex,
      innerIndex
    );
    const transfer = transfers.find((transfer) => transfer.info.mint == TOKENS.SOL);

    return {
      mint: accounts[0],
      solAmount: BigInt(transfer?.info.tokenAmount.amount || '0'),
      tokenAmount: reader.readU64(),
      isBuy: false,
      user: accounts[6],
      bondingCurve: accounts[1],
    };
  }

  private decodeCreateEvent(data: Buffer, options: any): BoopfunCreateEvent {
    const { instruction } = options;
    // get instruction accounts
    const accounts = this.adapter.getInstructionAccounts(instruction);
    const reader = new BinaryReader(data);
    reader.readU64();
    return {
      name: reader.readString(),
      symbol: reader.readString(),
      uri: reader.readString(),
      mint: accounts[2],
      user: accounts[3],
    };
  }

  private decodeCompleteEvent(data: Buffer, options: any): BoopfunCompleteEvent {
    const { instruction, outerIndex, innerIndex } = options;
    // get instruction accounts
    const accounts = this.adapter.getInstructionAccounts(instruction);
    const transfers = this.getTransfersForInstruction(
      this.adapter.getInstructionProgramId(instruction),
      outerIndex,
      innerIndex
    );
    const sols = transfers
      .filter((transfer) => transfer.info.mint == TOKENS.SOL)
      .sort((a, b) => b.info.tokenAmount.uiAmount - a.info.tokenAmount.uiAmount);

    return {
      user: accounts[10],
      mint: accounts[0],
      bondingCurve: accounts[7],
      solAmount: BigInt(sols[0].info.tokenAmount.amount),
      feeAmount: sols.length > 1 ? BigInt(sols[1].info.tokenAmount.amount) : BigInt(0),
    };
  }

  protected getTransfersForInstruction(programId: string, outerIndex: number, innerIndex?: number): TransferData[] {
    const key = `${programId}:${outerIndex}${innerIndex == undefined ? '' : `-${innerIndex}`}`;
    const transfers = this.transferActions[key] || [];
    return transfers.filter((t) => ['transfer', 'transferChecked'].includes(t.type));
  }
}
