export interface INiceLister {
  __typename: "NiceLister";
  id: string;
  address: string;
  feePaid: string;
}

export interface INaughtyLister {
  __typename: "NaughtyLister";
  id: string;
  address: string;
}

export interface IWithdrawalEvent {
  __typename: "WithdrawalFeeEvent";
  id: string;
  address: string;
  amountWithdrawn: string;
  withdrawnAt: string;
}
