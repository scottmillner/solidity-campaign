// path when running in debug mode
require('dotenv').config({ path: './src/ethereum/.env' });
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledCloneFactory = require('./contracts/build/CloneFactory.json');
const accountIndex = 0;

const provider = new HDWalletProvider(process.env.MNEMONIC, 'wss://ropsten.infura.io/ws/v3/79ad289032a049f4864b456319c01742', accountIndex);
const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();
	console.log(`Attempting to deploy from account ${accounts[accountIndex]}`);

	const result = await new web3.eth.Contract(compiledCloneFactory.abi)
		.deploy({ data: `0x${compiledCloneFactory.evm.bytecode.object}` })
		.send({ from: accounts[accountIndex], gas: '5000000' });

	console.log(`Contract deployed to ${result.options.address}`);
};

deploy();
