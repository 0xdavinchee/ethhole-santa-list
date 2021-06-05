import { gql } from "@apollo/client";

export const SUB_NICE_LISTERS = gql`
  subscription GetNiceListers {
    niceListers {
      id
      address
      feePaid
    }
  }
`;

export const SUB_NAUGHTY_LISTERS = gql`
  subscription GetNaughtyListers {
    naughtyListers {
      id
      address
    }
  }
`;

export const SUB_WITHDRAWAL_HISTORY = gql`
  subscription GetWithdrawalEvents {
    withdrawalEvents {
      id
      address
      amountWithdrawn
      withdrawnAt
    }
  }
`;
