var Contract = artifacts.require("./Contract.sol");
var User = artifacts.require("./User.sol");


module.exports = function(deployer) {
  deployer.deploy(Contract);
  deployer.deploy(User);

};
