import { deserializeUnchecked } from 'borsh';
import { DEX_PROGRAMS, DISCRIMINATORS, TOKENS } from '../../constants';
import { convertToUiAmount, TradeInfo, TradeType, TransferData } from '../../types';
import { getAMMs, getInstructionData, getTradeType } from '../../utils';
import { BaseParser } from '../base-parser';
import { JupiterLimitOrderV2CreateOrderLayout, JupiterLimitOrderV2TradeLayout } from './layouts/jupiter-limit.layout';

export class JupiterLimitOrderParser extends BaseParser {
  public processTrades(): TradeInfo[] {
    const trades: TradeInfo[] = [];

    this.classifiedInstructions.forEach(({ instruction, programId, outerIndex, innerIndex }) => {
      if (programId == DEX_PROGRAMS.JUPITER_LIMIT_ORDER.id) {
        const data = getInstructionData(instruction);
        const discriminator = Buffer.from(data.slice(0, 16));
        if (discriminator.equals(DISCRIMINATORS.JUPITER_LIMIT_ORDER.TRADE_EVENT)) {
          trades.push(this.parseFlashFilled(data, outerIndex, `${outerIndex}-${innerIndex ?? 0}`));
        }
      }
    });

    return trades;
  }

  private parseFlashFilled(data: any, outerIndex: number, idx: string): TradeInfo {
    // find outer instruction
    const eventInstruction = this.adapter.instructions[outerIndex];
    if (!eventInstruction) {
      throw new Error('Event instruction not found');
    }

    // parse event data
    const eventData = data.slice(16);
    const layout = deserializeUnchecked(
      JupiterLimitOrderV2TradeLayout.schema,
      JupiterLimitOrderV2TradeLayout,
      Buffer.from(eventData)
    );
    const event = layout.toObject();

    // get outer instruction accounts
    const accounts = this.adapter.getInstructionAccounts(eventInstruction);
    const outerData = getInstructionData(eventInstruction);
    const [inputToken, outputToken] = outerData.slice(0, 8).equals(DISCRIMINATORS.JUPITER_LIMIT_ORDER.UNKNOWN)
      ? [
        this.adapter.splTokenMap.get(accounts[3]),
        this.adapter.splTokenMap.get(accounts[4]), // Unknown instruction
      ]
      : [
        this.adapter.splTokenMap.get(accounts[3]),
        this.adapter.splTokenMap.get(accounts[5]), // FlashFillOrder instruction
      ];

    if (!inputToken || !outputToken) {
      throw new Error('inputToken or outputToken not found');
    }
    const [inputMint, inputDecimal, outputMint, outputDecimal] = [
      inputToken.mint,
      inputToken.decimals,
      outputToken.mint,
      outputToken.decimals,
    ];
    // Jupiter fee 0.1%
    const feeAmount = BigInt(event.takingAmount) / 1000n;
    const outAmount = BigInt(event.takingAmount) - BigInt(feeAmount);
    const tradeType: TradeType = getTradeType(inputMint, outputMint);
    const trade = {
      type: tradeType,
      inputToken: {
        mint: inputMint,
        amount: convertToUiAmount(event.makingAmount, inputDecimal),
        amountRaw: event.makingAmount.toString(),
        decimals: inputDecimal ?? 0,
      },
      outputToken: {
        mint: outputMint,
        amount: convertToUiAmount(outAmount, outputDecimal),
        amountRaw: outAmount.toString(),
        decimals: outputDecimal ?? 0,
      },
      fee: {
        mint: outputMint,
        amount: convertToUiAmount(feeAmount, outputDecimal),
        amountRaw: feeAmount.toString(),
        decimals: outputDecimal ?? 0,
      },
      user: event.taker,
      programId: DEX_PROGRAMS.JUPITER_LIMIT_ORDER.id,
      amm: this.getAmm(),
      route: this.dexInfo?.route || '',
      slot: this.adapter.slot,
      timestamp: this.adapter.blockTime || 0,
      signature: this.adapter.signature,
      idx: idx || '',
    };

    return this.utils.attachTokenTransferInfo(trade, this.transferActions);
  }

  private getAmm(): string {
    const amms = getAMMs(Object.keys(this.transferActions));
    return amms.length > 0 ? amms[0] : this.dexInfo?.amm || DEX_PROGRAMS.JUPITER_LIMIT_ORDER.name;
  }

  public processTransfers(): TransferData[] {
    const transfers: TransferData[] = [];
    this.classifiedInstructions.forEach(({ instruction, programId, outerIndex, innerIndex }) => {
      if (programId == DEX_PROGRAMS.JUPITER_LIMIT_ORDER.id) {
        const data = getInstructionData(instruction);

        if (Buffer.from(data.slice(0, 8)).equals(DISCRIMINATORS.JUPITER_LIMIT_ORDER.CREATE_ORDER)) {
          transfers.push(...this.parseInitializeOrder(instruction, programId, outerIndex, innerIndex));
        } else if (Buffer.from(data.slice(0, 8)).equals(DISCRIMINATORS.JUPITER_LIMIT_ORDER.CANCEL_ORDER)) {
          transfers.push(...this.parseCancelOrder(instruction, programId, outerIndex, innerIndex));
        }
      }
    });
    // Deduplicate transfers
    if (transfers.length > 1) {
      return [...new Map(transfers.map((item) => [`${item.idx}-${item.signature}=${item.isFee}`, item])).values()];
    }
    return transfers;
  }

  private parseInitializeOrder(instruction: any, programId: string, outerIndex: number, innerIndex?: number): TransferData[] {
    // get instruction accounts
    const accounts = this.adapter.getInstructionAccounts(instruction);

    const [user, mint, source] = [accounts[1], accounts[5], accounts[4]];
    const destination = mint == TOKENS.SOL ? user : accounts[3];

    const balance =
      mint == TOKENS.SOL
        ? this.adapter.getAccountSolBalanceChanges().get(destination)
        : this.adapter.getAccountTokenBalanceChanges().get(destination)?.get(mint);

    if (!balance) return [];

    const transfers = this.getTransfersForInstruction(programId, outerIndex, innerIndex);
    const transfer = transfers.find((t) => t.info.mint == mint);

    const decimals = transfer?.info.tokenAmount.decimals || this.adapter.getTokenDecimals(mint);
    const tokenAmount = transfer?.info.tokenAmount.amount || balance.change.amount || '0';

    return [
      {
        type: 'initializeOrder',
        programId: programId,
        info: {
          authority: this.adapter.getTokenAccountOwner(source) || user,
          source: source,
          destination: destination,
          destinationOwner: this.adapter.getTokenAccountOwner(source),
          mint: mint,
          tokenAmount: {
            amount: tokenAmount,
            uiAmount: convertToUiAmount(tokenAmount, decimals),
            decimals: decimals,
          },
          sourceBalance: balance.post,
          sourcePreBalance: balance.pre,
        },
        idx: `${outerIndex}-${innerIndex ?? 0}`,
        timestamp: this.adapter.blockTime,
        signature: this.adapter.signature,
      },
    ];
  }

  private parseCancelOrder(
    instruction: any,
    programId: string,
    outerIndex: number,
    innerIndex?: number
  ): TransferData[] {
    // get instruction accounts
    const accounts = this.adapter.getInstructionAccounts(instruction);

    const [user, mint, source, authority] = [accounts[2], accounts[6], accounts[1], accounts[0]];
    const destination = mint == TOKENS.SOL ? user : accounts[3];

    const balance =
      mint == TOKENS.SOL
        ? this.adapter.getAccountSolBalanceChanges().get(destination)
        : this.adapter.getAccountTokenBalanceChanges().get(destination)?.get(mint);

    if (!balance) throw new Error('Balance not found');

    const transfers = this.getTransfersForInstruction(programId, outerIndex, innerIndex);
    const transfer = transfers.find((t) => t.info.mint == mint);

    const decimals = transfer?.info.tokenAmount.decimals || this.adapter.getTokenDecimals(mint);
    const tokenAmount = transfer?.info.tokenAmount.amount || balance.change.amount || '0';

    const tokens: TransferData[] = [];
    tokens.push({
      type: 'cancelOrder',
      programId: programId,
      info: {
        authority: transfer?.info.authority || authority,
        source: transfer?.info.source || source,
        destination: transfer ? transfer?.info.destination || destination : user,
        destinationOwner: this.adapter.getTokenAccountOwner(destination),
        mint: mint,
        tokenAmount: {
          amount: tokenAmount,
          uiAmount: convertToUiAmount(tokenAmount, decimals),
          decimals: decimals,
        },
        destinationBalance: balance.post,
        destinationPreBalance: balance.pre,
      },
      idx: `${outerIndex}-${innerIndex ?? 0}`,
      timestamp: this.adapter.blockTime,
      signature: this.adapter.signature,
    });

    if (mint !== TOKENS.SOL) {
      const solBalance = this.adapter.getAccountSolBalanceChanges().get(user);
      if (solBalance) {
        tokens.push({
          type: 'cancelOrder',
          programId: programId,
          info: {
            authority: transfer?.info.authority || authority,
            source: transfer?.info.source || source,
            destination: user,
            mint: TOKENS.SOL,
            tokenAmount: {
              amount: solBalance.change.amount,
              uiAmount: solBalance.change.uiAmount || 0,
              decimals: solBalance.change.decimals,
            },
            destinationBalance: solBalance.post,
            destinationPreBalance: solBalance.pre,
          },
          idx: `${outerIndex}-${innerIndex ?? 0}`,
          timestamp: this.adapter.blockTime,
          signature: this.adapter.signature,
          isFee: true,
        });
      }
    }

    return tokens;
  }
}
