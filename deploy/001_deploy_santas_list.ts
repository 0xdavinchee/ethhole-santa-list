import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getUnnamedAccounts } from "hardhat";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const listParticipants = await getUnnamedAccounts();
  const { deploy } = deployments;

  await deploy("SantasList", {
    from: deployer,
    args: [[...listParticipants.slice(0, 2)]],
    log: true,
  });
};

export default func;
func.tags = ["SantasList"];
