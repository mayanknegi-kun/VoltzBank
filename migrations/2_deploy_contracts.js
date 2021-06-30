var Token = artifacts.require("./Token.sol");
var vBank = artifacts.require("./vBank.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Token)
  const token = await Token.deployed()
  await deployer.deploy(vBank,token.address)
  const vbank = await vBank.deployed()
  await token.passMinterRole(vbank.address)
};
