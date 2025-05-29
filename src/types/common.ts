import { PoolEvent } from './pool';
import { TokenAmount, TradeInfo, TransferData } from './trade';

export interface ClassifiedInstruction {
  instruction: any;
  programId: string;
  outerIndex: number;
  innerIndex?: number;
}

export interface BalanceChange {
  pre: TokenAmount;
  post: TokenAmount;
  change: TokenAmount;
}

export interface ParseResult {
  state: boolean;
  fee: TokenAmount; // transaction gas fee
  trades: TradeInfo[];
  liquidities: PoolEvent[];
  transfers: TransferData[];
  solBalanceChange?: BalanceChange; // SOL balance change
  tokenBalanceChange?: Map<string, BalanceChange>; // token balance change, key is token mint address
  msg?: string;
}

export type EventParser<T> = {
  discriminator: Buffer | Uint8Array;
  decode: (data: Buffer) => T;
};

export type EventsParser<T> = {
  discriminators: (Buffer | Uint8Array)[];
  slice: number;
  decode: (data: Buffer, options: any) => T;
};
