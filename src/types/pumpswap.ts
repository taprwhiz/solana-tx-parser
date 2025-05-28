export interface PumpswapBuyEvent {
  timestamp: number;
  baseAmountOut: bigint;
  maxQuoteAmountIn: bigint;
  userBaseTokenReserves: bigint;
  userQuoteTokenReserves: bigint;
  poolBaseTokenReserves: bigint;
  poolQuoteTokenReserves: bigint;
  quoteAmountIn: bigint;
  lpFeeBasisPoints: bigint;
  lpFee: bigint;
  protocolFeeBasisPoints: bigint;
  protocolFee: bigint;
  quoteAmountInWithLpFee: bigint;
  userQuoteAmountIn: bigint;
  pool: string;
  user: string;
  userBaseTokenAccount: string;
  userQuoteTokenAccount: string;
  protocolFeeRecipient: string;
  protocolFeeRecipientTokenAccount: string;
  coinCreator: string;
  coinCreatorFeeBasisPoints: bigint;
  coinCreatorFee: bigint;
}

export interface PumpswapSellEvent {
  timestamp: number;
  baseAmountIn: bigint;
  minQuoteAmountOut: bigint;
  userBaseTokenReserves: bigint;
  userQuoteTokenReserves: bigint;
  poolBaseTokenReserves: bigint;
  poolQuoteTokenReserves: bigint;
  quoteAmountOut: bigint;
  lpFeeBasisPoints: bigint;
  lpFee: bigint;
  protocolFeeBasisPoints: bigint;
  protocolFee: bigint;
  quoteAmountOutWithoutLpFee: bigint;
  userQuoteAmountOut: bigint;
  pool: string;
  user: string;
  userBaseTokenAccount: string;
  userQuoteTokenAccount: string;
  protocolFeeRecipient: string;
  protocolFeeRecipientTokenAccount: string;
  coinCreator: string;
  coinCreatorFeeBasisPoints: bigint;
  coinCreatorFee: bigint;
}

export interface PumpswapCreatePoolEvent {
  timestamp: number;
  index: number;
  creator: string;
  baseMint: string;
  quoteMint: string;
  baseMintDecimals: number;
  quoteMintDecimals: number;
  baseAmountIn: bigint;
  quoteAmountIn: bigint;
  poolBaseAmount: bigint;
  poolQuotAmount: bigint;
  minimumLiquidity: bigint;
  initialLiquidity: bigint;
  lpTokenAmountOut: bigint;
  poolBump: number;
  pool: string;
  lpMint: string;
  userBaseTokenAccount: string;
  userQuoteTokenAccount: string;
}

export interface PumpswapDepositEvent {
  timestamp: number;
  lpTokenAmountOut: bigint;
  maxBaseAmountIn: bigint;
  maxQuoteAmountIn: bigint;
  userBaseTokenReserves: bigint;
  userQuoteTokenReserves: bigint;
  poolBaseTokenReserves: bigint;
  poolQuoteTokenReserves: bigint;
  baseAmountIn: bigint;
  quoteAmountIn: bigint;
  lpMintSupply: bigint;

  pool: string;
  user: string;
  userBaseTokenAccount: string;
  userQuoteTokenAccount: string;
  userPoolTokenAccount: string;
}

export interface PumpswapWithdrawEvent {
  timestamp: number;
  lpTokenAmountIn: bigint;
  minBaseAmountOut: bigint;
  minQuoteAmountOut: bigint;
  userBaseTokenReserves: bigint;
  userQuoteTokenReserves: bigint;
  poolBaseTokenReserves: bigint;
  poolQuoteTokenReserves: bigint;
  baseAmountOut: bigint;
  quoteAmountOut: bigint;
  lpMintSupply: bigint;

  pool: string;
  user: string;
  userBaseTokenAccount: string;
  userQuoteTokenAccount: string;
  userPoolTokenAccount: string;
}

export interface PumpswapEvent {
  type: 'BUY' | 'SELL' | 'CREATE' | 'ADD' | 'REMOVE';
  data: PumpswapBuyEvent | PumpswapSellEvent | PumpswapCreatePoolEvent | PumpswapDepositEvent | PumpswapWithdrawEvent;
  slot: number;
  timestamp: number;
  signature: string;
  idx: string; // instruction indexes
}
