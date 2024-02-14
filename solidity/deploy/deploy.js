const main = async () => {
  const deployedContract = await ethers.deployContract("NftRigth");

  await deployedContract.waitForDeployment();

  console.log("NftRigth Contract Address:", await deployedContract.getAddress());
};
main();
