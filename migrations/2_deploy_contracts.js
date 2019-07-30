let ManageBooks = artifacts.require("./ManageBooks.sol")

module.exports = function(deployer) {
	deployer.deploy(ManageBooks)
}