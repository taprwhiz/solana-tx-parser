import { DEX_PROGRAMS, DISCRIMINATORS } from '../../constants';
import { InstructionClassifier } from '../../instruction-classifier';
import { TransactionAdapter } from '../../transaction-adapter';
import { ClassifiedInstruction, InstructionParser, PumpfunCreateEvent, PumpfunEvent } from '../../types';
import { getInstructionData, sortByIdx } from '../../utils';
import { BinaryReader } from '../binary-reader';

export class PumpfunInstructionParser {
  constructor(
    private readonly adapter: TransactionAdapter,
    private readonly classifier: InstructionClassifier
  ) { }

  private readonly instructionParsers: Record<string, InstructionParser<any>> = {
    CREATE: {
      discriminator: DISCRIMINATORS.PUMPFUN.CREATE,
      decode: this.decodeCreateEvent.bind(this),
    },
    MIGRATE: {
      discriminator: DISCRIMINATORS.PUMPFUN.MIGRATE,
      decode: this.decodeMigrateEvent.bind(this),
    },
    BUY: {
      discriminator: DISCRIMINATORS.PUMPFUN.BUY,
      decode: this.decodeBuyEvent.bind(this),
    },
    SELL: {
      discriminator: DISCRIMINATORS.PUMPFUN.SELL,
      decode: this.decodeSellEvent.bind(this),
    },
  };

  public processInstructions(): any[] {
    const instructions = this.classifier.getInstructions(DEX_PROGRAMS.PUMP_FUN.id);
    return this.parseInstructions(instructions);
  }

  public parseInstructions(instructions: ClassifiedInstruction[]): any[] {
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
                  type: type as 'CREATE' | 'MIGRATE' | 'BUY' | 'SELL',
                  data: eventData,
                  slot: this.adapter.slot,
                  timestamp: this.adapter.blockTime || 0,
                  signature: this.adapter.signature,
                  idx: `${outerIndex}-${innerIndex ?? 0}`,
                  signer: this.adapter.signers,
                } as any;
                return event;
              }
            }
          } catch (error) {
            console.error('Failed to parse Pumpswap instruction:', error);
            throw error;
          }
          return null;
        })
        .filter((event): event is PumpfunEvent => event !== null)
    );
  }

  private decodeBuyEvent(instruction: any, options: any) {
    const { data } = options;
    const reader = new BinaryReader(data);
    const accounts = this.adapter.getInstructionAccounts(instruction);
    return {
      mint: accounts[2],
      bondingCurve: accounts[3],
      tokenAmount: reader.readU64(),
      solAmount: reader.readU64(),
      user: accounts[6],
    };
  }

  private decodeSellEvent(instruction: any, options: any) {
    const { data } = options;
    const reader = new BinaryReader(data);
    const accounts = this.adapter.getInstructionAccounts(instruction);
    return {
      mint: accounts[2],
      bondingCurve: accounts[3],
      tokenAmount: reader.readU64(),
      solAmount: reader.readU64(),
      user: accounts[6],
    };
  }

  private decodeCreateEvent(instruction: any, options: any): PumpfunCreateEvent {
    const { data } = options;
    const reader = new BinaryReader(data);
    const accounts = this.adapter.getInstructionAccounts(instruction);
    return {
      name: reader.readString(),
      symbol: reader.readString(),
      uri: reader.readString(),
      mint: accounts[0],
      bondingCurve: accounts[2],
      user: accounts[7],
    };
  }

  private decodeMigrateEvent(instruction: any, _options: any) {
    const accounts = this.adapter.getInstructionAccounts(instruction);
    return {
      mint: accounts[2],
      bondingCurve: accounts[3],
      user: accounts[5],
      poolMint: accounts[9],
      quoteMint: accounts[4],
      lpMint: accounts[15],
      userPoolTokenAccount: accounts[16],
      poolBaseTokenAccount: accounts[17],
      poolQuoteTokenAccount: accounts[18],
    };
  }
}
