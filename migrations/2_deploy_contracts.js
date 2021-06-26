var Contract = artifacts.require("./Contract.sol");
var User = artifacts.require("./User.sol");
var SideLowe = artifacts.require("./SideLowe.sol");
var ArumBarut = artifacts.require("./ArumBarut.sol");
var XantheResort = artifacts.require("./XantheResort.sol");


module.exports = function(deployer) {
  deployer.deploy(Contract);
  deployer.deploy(User);
  deployer.deploy(SideLowe);
  deployer.deploy(ArumBarut);
  deployer.deploy(XantheResort);


};
