import { expect } from "./chai-setup";
import { SantasList } from "../typechain";
import {
  ethers,
  deployments,
  getNamedAccounts,
  getUnnamedAccounts,
} from "hardhat";
import { setupUser, setupUsers } from "./utils";

const getEth = (amount: string) => ethers.utils.parseEther(amount);
const getEthFeeAmount = (numNiceListers: number) =>
  getEth((0.01 * (numNiceListers + 1) ** 2).toString());

const setup = async () => {
  await deployments.fixture(["SantasList"]);
  const contracts = {
    SantasList: (await ethers.getContract("SantasList")) as SantasList,
  };

  const { deployer } = await getNamedAccounts();
  const participants = await getUnnamedAccounts();

  return {
    deployer: await setupUser(deployer, contracts),
    participants: await setupUsers(participants, contracts),
    ...contracts,
  };
};

describe("SantasList Tests", () => {
  describe("Initialization", () => {
    it("Should initialize contract with empty variables", async () => {
      const { participants, SantasList } = await setup();
      expect(await SantasList.feeAmount()).to.equal(getEth("0.01"));
      expect(await SantasList.numNiceListers()).to.equal(0);
      expect(await SantasList.naughtyList(participants[0].address)).to.equal(
        true
      );
      expect(await SantasList.naughtyList(participants[1].address)).to.equal(
        true
      );
      expect(await SantasList.naughtyList(participants[2].address)).to.equal(
        false
      );
    });
  });

  describe("Naughty List Tests", () => {
    it("Should be able to add new participants to naughty list.", async () => {
      const { participants, SantasList } = await setup();
      await expect(SantasList.addToNaughtyList(participants[2].address))
        .to.emit(SantasList, "NewNaughtyLister")
        .withArgs(participants[2].address);
      await expect(SantasList.addToNaughtyList(participants[3].address))
        .to.emit(SantasList, "NewNaughtyLister")
        .withArgs(participants[3].address);
      await expect(SantasList.addToNaughtyList(participants[4].address))
        .to.emit(SantasList, "NewNaughtyLister")
        .withArgs(participants[4].address);
    });

    it("Should properly reject invalid naughty list adds.", async () => {
      const { deployer, participants, SantasList } = await setup();

      await expect(
        participants[0].SantasList.addToNaughtyList(participants[3].address)
      ).to.be.revertedWith("You are not the list owner.");

      await expect(
        SantasList.addToNaughtyList(participants[0].address)
      ).to.be.revertedWith("This address is already on the naughty list.");
      const feeAmount = getEthFeeAmount(
        (await SantasList.numNiceListers()).toNumber()
      );
      await participants[0].SantasList.joinNiceList({
        value: feeAmount,
      });
      await expect(
        SantasList.addToNaughtyList(participants[0].address)
      ).to.be.revertedWith("This address is on the nice list.");

      await expect(
        SantasList.addToNaughtyList(deployer.address)
      ).to.be.revertedWith(
        "You are not allowed to add yourself to the naughty list."
      );
    });
  });

  describe("Nice List Tests", () => {
    it("Should be able to join the nice list.", async () => {
      const { participants, SantasList } = await setup();
      let feeAmount = getEthFeeAmount(
        (await SantasList.numNiceListers()).toNumber()
      );
      await expect(
        participants[0].SantasList.joinNiceList({ value: feeAmount })
      )
        .to.emit(SantasList, "NewNiceLister")
        .withArgs(participants[0].address, feeAmount);
      expect(await SantasList.numNiceListers()).to.equal(1);
      expect(await SantasList.naughtyList(participants[0].address)).to.equal(
        false
      );
      feeAmount = getEthFeeAmount(
        (await SantasList.numNiceListers()).toNumber()
      );
      await expect(
        participants[1].SantasList.joinNiceList({ value: feeAmount })
      )
        .to.emit(SantasList, "NewNiceLister")
        .withArgs(participants[1].address, feeAmount);
    });

    it("Should properly reject invalid nice list adds.", async () => {
      const { participants, SantasList } = await setup();

      await expect(
        SantasList.joinNiceList({ value: getEth("0.01") })
      ).to.be.revertedWith("You aren't on the naughty list.");

      await participants[0].SantasList.joinNiceList({ value: getEth("0.01") });
      await expect(
        participants[0].SantasList.joinNiceList({ value: getEth("0.01") })
      ).to.be.revertedWith("You are already on the nice list.");

      await expect(
        participants[1].SantasList.joinNiceList({ value: getEth("0.01") })
      ).to.be.revertedWith(
        "You must pay the fee amount to get on the nice list."
      );
    });
  });

  describe("Withdraw Tests", () => {
    it("Should be able to withdraw.", async () => {
      const { participants, SantasList } = await setup();
      let feeAmount = getEthFeeAmount(
        (await SantasList.numNiceListers()).toNumber()
      );
      await participants[0].SantasList.joinNiceList({ value: feeAmount });
      await expect(participants[0].SantasList.withdrawShareOfFees())
        .to.emit(SantasList, "WithdrawFees")
        .withArgs(participants[0].address, feeAmount);

      feeAmount = getEthFeeAmount(
        (await SantasList.numNiceListers()).toNumber()
      );
      await participants[1].SantasList.joinNiceList({ value: feeAmount });
      await expect(participants[0].SantasList.withdrawShareOfFees())
        .to.emit(SantasList, "WithdrawFees")
        .withArgs(participants[0].address, getEth("0.01"));

      await expect(participants[1].SantasList.withdrawShareOfFees())
        .to.emit(SantasList, "WithdrawFees")
        .withArgs(participants[1].address, getEth("0.015"));
    });

    it("Should properly reject invalid withdrawals.", async () => {
      const { participants, SantasList } = await setup();

      let feeAmount = getEthFeeAmount(
        (await SantasList.numNiceListers()).toNumber()
      );
      await expect(SantasList.withdrawShareOfFees()).to.be.revertedWith(
        "You aren't on the nice list."
      );

      await participants[0].SantasList.joinNiceList({ value: feeAmount });
      await participants[0].SantasList.withdrawShareOfFees();
      await expect(
        participants[0].SantasList.withdrawShareOfFees()
      ).to.be.revertedWith("You have already withdrawn your share.");
    });

    it("Should properly calculate owner withdrawal amount.", async () => {
      const { deployer, participants, SantasList } = await setup();

      let feeAmount = getEthFeeAmount(
        (await SantasList.numNiceListers()).toNumber()
      );

      await expect(SantasList.ownerWithdrawBounty()).to.be.revertedWith(
        "You have nothing to withdraw."
      );

      await participants[0].SantasList.joinNiceList({ value: feeAmount }); // 0.01 in the contract

      await participants[0].SantasList.withdrawShareOfFees(); // 0.01 withdrawn

      // 0 in the contract now

      feeAmount = getEthFeeAmount(
        (await SantasList.numNiceListers()).toNumber()
      );
      await participants[1].SantasList.joinNiceList({ value: feeAmount }); // 0.04 in the contract now

      await participants[0].SantasList.withdrawShareOfFees(); // 0.04 / 2 - 0.01 = 0.01 withdrawn
      await participants[1].SantasList.withdrawShareOfFees(); // 0.03 / 2 = 0.015 withdrawn
      expect(await SantasList.getOwnerWithdrawableAmount()).to.equal(
        getEth("0.015")
      );
      await expect(SantasList.ownerWithdrawBounty())
        .to.emit(SantasList, "WithdrawFees")
        .withArgs(deployer.address, getEth("0.015"));
    });
  });
});
