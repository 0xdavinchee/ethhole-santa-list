import { expect } from "./chai-setup";
import { SantasList } from "../typechain";
import { ethers, deployments } from "hardhat";

const setup = async () => {
  await deployments.fixture(["SantasList"]);
  const contracts = {
    SantasList: (await ethers.getContract("SantasList")) as SantasList,
  };

  return { ...contracts };
};

describe("SantasList", function () {
  it("Should return the new greeting once it's changed", async function () {
    const { SantasList } = await setup();
    expect(await SantasList.greet()).to.equal("Hello Hardhat!");

    await SantasList.setGreeting("Hola, mundo!");
    expect(await SantasList.greet()).to.equal("Hola, mundo!");
  });
});
