import { useSubscription } from "@apollo/client";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SUB_NAUGHTY_LISTERS,
  SUB_NICE_LISTERS,
  SUB_WITHDRAWAL_HISTORY,
} from "../graphql/queries";
import { INaughtyLister, INiceLister, IWithdrawalEvent } from "../interface";
import {
  initializeContract,
  isGlobalEthereumObjectEmpty,
  requestAccount,
} from "../utils/helper";

interface INiceListerResult {
  niceListers: INiceLister[];
}

interface INaughtyListerResult {
  naughtyListers: INaughtyLister[];
}
interface IWithdrawalEventResult {
  withdrawalEvents: IWithdrawalEvent[];
}

const SantaList = () => {
  const [fee, setFee] = useState("");
  const [totalFees, setTotalFees] = useState("");
  const [niceListers, setNiceListers] = useState<INiceLister[]>([]);
  const [naughtyListers, setNaughtyListers] = useState<INaughtyLister[]>([]);
  const [userAddress, setUserAddress] = useState("");
  const [withdrawableAmount, setWithdrawableAmount] = useState("");
  const [listOwner, setListOwner] = useState("");
  const [newNaughtyLister, setNewNaughtyLister] = useState("");
  const [withdrawals, setWithdrawals] = useState<IWithdrawalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [contractBalance, setContractBalance] = useState("");

  const { loading: loadingNiceListers, data: niceListersData } =
    useSubscription<INiceListerResult, any>(SUB_NICE_LISTERS);
  const { loading: loadingNaughtyListers, data: naughtyListersData } =
    useSubscription<INaughtyListerResult, any>(SUB_NAUGHTY_LISTERS);
  const { loading: loadingWithdrawalEvent, data: withdrawalEventData } =
    useSubscription<IWithdrawalEventResult, any>(SUB_WITHDRAWAL_HISTORY);

  const joinNiceList = async () => {
    const contract = initializeContract(true);

    if (contract == null) return;
    const entryFee = ethers.utils.parseEther(fee);
    try {
      const txn = await contract.joinNiceList({ value: entryFee });
      await txn.wait();
      await getAndSetBaseData();
    } catch (err) {
      console.error(err);
    }
  };

  const addToNaughtyList = async () => {
    const contract = initializeContract(true);
    if (contract == null) return;
    try {
      const txn = await contract.addToNaughtyList(newNaughtyLister);
      await txn.wait();
      setNewNaughtyLister("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = () => {
    if (userAddress === listOwner) {
      ownerWithdrawFunds();
      return;
    }
    withdrawFunds();
  };

  const withdrawFunds = async () => {
    const contract = initializeContract(true);
    if (contract == null) return;

    try {
      const txn = await contract.withdrawShareOfFees();
      await txn.wait();
      await getAndSetBaseData();
    } catch (err) {
      console.error(err);
    }
  };

  const ownerWithdrawFunds = async () => {
    const contract = initializeContract(true);
    if (contract == null) return;

    try {
      const txn = await contract.ownerWithdrawBounty();
      await txn.wait();
      await getAndSetBaseData();
    } catch (err) {
      console.error(err);
    }
  };

  const getFormattedEth = (num: string) => {
    return Number(num).toFixed(2).toString();
  };

  const getAndSetBaseData = useCallback(async () => {
    const contract = initializeContract(true);
    if (contract == null) return;
    const rawFeeAmount = await contract.feeAmount();
    const formattedFeeAmount = ethers.utils.formatEther(rawFeeAmount);
    const rawTotalFeeAmount = await contract.totalFeesAccrued();
    const formattedTotalFeeAmount = ethers.utils.formatEther(rawTotalFeeAmount);
    const withdrawableAmount =
      userAddress === listOwner.toLowerCase()
        ? await contract.getOwnerWithdrawableAmount()
        : await contract.getWithdrawableAmount();
    const formattedWithdrawableAmount = getFormattedEth(
      ethers.utils.formatEther(withdrawableAmount)
    );
    const contractBalance = await contract.provider.getBalance(
      contract.address
    );
    const formattedContractBalance = ethers.utils.formatEther(contractBalance);
    setContractBalance(formattedContractBalance);
    setWithdrawableAmount(formattedWithdrawableAmount);
    setFee(formattedFeeAmount);
    setTotalFees(formattedTotalFeeAmount);
  }, [listOwner, userAddress]);

  const niceListAddresses = niceListers.map((x) => x.address.toLowerCase());
  const naughtyListAddresses = naughtyListers.map((x) =>
    x.address.toLowerCase()
  );
  const isJoinNiceListAllowed = useMemo(
    () =>
      naughtyListAddresses.includes(userAddress) &&
      !niceListAddresses.includes(userAddress),
    [naughtyListAddresses, niceListAddresses, userAddress]
  );
  const isWithdrawFeesAllowed = Number(withdrawableAmount) > 0;

  const niceListersDisplay = useMemo(
    () =>
      niceListers.map((x) => ({
        ...x,
        feePaid: ethers.utils.formatEther(x.feePaid),
      })),
    [niceListers]
  );
  const naughtyListersDisplay = useMemo(
    () =>
      naughtyListers.filter(
        (x) => !niceListers.map((y) => y.address).includes(x.address)
      ),
    [naughtyListers, niceListers]
  );
  const withdrawalsDisplay = useMemo(
    () => withdrawals.sort((x, y) => (x.withdrawnAt > y.withdrawnAt ? -1 : 1)),
    [withdrawals]
  );
  const totalWithdrawn = useMemo(
    () =>
      withdrawals
        .map((x) => Number(x.amountWithdrawn))
        .reduce((x, y) => x + y, 0),
    [withdrawals]
  );

  useEffect(() => {
    if (isGlobalEthereumObjectEmpty) return;
    (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
      setUserAddress(accounts[0].toLowerCase());
    });

    return () => {
      (window as any).ethereum.removeListener("accountsChanged", () => {});
    };
  }, []);

  useEffect(() => {
    (async () => {
      const result = await requestAccount();
      setUserAddress(result[0].toLowerCase());
    })();
  }, []);

  useEffect(() => {
    if (loadingNiceListers || niceListersData == null) return;
    setNiceListers(niceListersData.niceListers);
    (async () => {
      await getAndSetBaseData();
    })();
  }, [loadingNiceListers, niceListersData, getAndSetBaseData]);

  useEffect(() => {
    if (loadingNaughtyListers || naughtyListersData == null) return;
    setNaughtyListers(naughtyListersData.naughtyListers);
    (async () => {
      await getAndSetBaseData();
    })();
  }, [loadingNaughtyListers, naughtyListersData, getAndSetBaseData]);

  useEffect(() => {
    if (loadingWithdrawalEvent || withdrawalEventData == null) return;
    setWithdrawals(withdrawalEventData.withdrawalEvents);
    (async () => {
      await getAndSetBaseData();
    })();
  }, [loadingWithdrawalEvent, withdrawalEventData, getAndSetBaseData]);

  useEffect(() => {
    if (userAddress === "") return;

    (async () => {
      await getAndSetBaseData();
      setLoading(false);
    })();
  }, [userAddress, getAndSetBaseData]);

  useEffect(() => {
    const contract = initializeContract(true);
    if (contract == null) return;

    (async () => {
      const owner = await contract.owner();
      setListOwner(owner.toLowerCase());
    })();
  }, []);

  return (
    <Container className="container" maxWidth="md">
      {loading && <CircularProgress className="loading" />}
      {!loading && (
        <>
          <Typography variant="h3">Santa's Ponzi List</Typography>
          <Card className="ponzi-description">
            <CardContent>
              <Typography variant="body1">
                Create a user tracking dapp. Build a system for tracking who is
                on their nice list and who is on their naughty list. Allow for
                people to pay a fee to get themselves off of the naughty list.
                Let users on the nice list earn a portion of the fees based on
                how many other people are on the nice list.
              </Typography>
            </CardContent>
          </Card>
          <Typography variant="h6">Overview</Typography>
          <Card className="ponzi-information">
            <CardContent>
              <Typography variant="body1">List Owner: {listOwner}</Typography>
              <Typography variant="body1">Current Fee: {fee} ETH</Typography>
              <Typography variant="body1">
                Contract Balance: {contractBalance} ETH
              </Typography>
              <Typography variant="body1">
                Total Fees Accrued: {totalFees} ETH
              </Typography>
              <Typography variant="body1">
                Total Fees Withdrawn:{" "}
                {ethers.utils.formatEther(totalWithdrawn.toString())} ETH
              </Typography>
              <Typography variant="body1">
                Withdrawable Fees: {withdrawableAmount} ETH
              </Typography>
              <Button
                className="withdraw-button"
                color="primary"
                disabled={!isWithdrawFeesAllowed}
                variant="contained"
                onClick={() => handleWithdraw()}
              >
                Withdraw fees
              </Button>

              {listOwner === userAddress && (
                <div className="add-naughty-lister-container">
                  <TextField
                    value={newNaughtyLister}
                    onChange={(e) => setNewNaughtyLister(e.target.value)}
                  />
                  <Button
                    className="add-naughty-lister-button"
                    color="primary"
                    variant="contained"
                    disabled={
                      newNaughtyLister === "" ||
                      naughtyListAddresses.includes(newNaughtyLister)
                    }
                    onClick={() => addToNaughtyList()}
                  >
                    Add to Naughty List
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <Grid className="list-container" container spacing={3}>
            <Grid item xs={6}>
              <Card className="e-nice-list">
                <Typography className="list-title" variant="h6">
                  Nice List
                </Typography>
                <div className="list-item-container">
                  {niceListersDisplay.map((x) => (
                    <div key={x.id}>
                      <Typography variant="body2">
                        {x.address} | {x.feePaid} ETH
                      </Typography>
                    </div>
                  ))}
                </div>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className="e-naughty-list">
                <Typography className="list-title" variant="h6">
                  Naughty List
                </Typography>
                <div className="list-item-container">
                  {naughtyListersDisplay.map((x) => (
                    <Typography variant="body2" key={x.id}>
                      {x.address}
                    </Typography>
                  ))}
                </div>
              </Card>
            </Grid>
          </Grid>
          <Button
            className="join-nice-list"
            disabled={!isJoinNiceListAllowed}
            color="primary"
            variant="contained"
            onClick={() => joinNiceList()}
          >
            Join Nice List
          </Button>

          {withdrawals.length > 0 && (
            <>
              <Typography variant="h6">Withdrawal History</Typography>
              <TableContainer className="table" component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Address</TableCell>
                      <TableCell>Amount Withdrawn</TableCell>
                      <TableCell>Withdraw Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {withdrawalsDisplay.map((x) => (
                      <TableRow key={x.id}>
                        <TableCell>{x.address}</TableCell>
                        <TableCell>
                          {getFormattedEth(
                            ethers.utils.formatEther(x.amountWithdrawn)
                          )}{" "}
                          ETH
                        </TableCell>
                        <TableCell>
                          {new Date(
                            Number(x.withdrawnAt) * 1000
                          ).toDateString()}{" "}
                          {new Date(
                            Number(x.withdrawnAt) * 1000
                          ).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default SantaList;
