const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider({ gasLimit: 8000000 }));
const compiledCloneFactory = require('../contracts/build/CloneFactory.json');
const compiledCampaign = require('../contracts/build/Campaign.json');

let accounts;
let cloneFactory;
let campaignAddress;
let campaign;
let userAccount;
const gas = '8000000';
beforeEach(async () => {
	try {
		accounts = await web3.eth.getAccounts();
		userAccount = accounts && accounts[0];
		cloneFactory = await new web3.eth.Contract(compiledCloneFactory.abi)
			.deploy({ data: compiledCloneFactory.evm.bytecode.object })
			.send({ from: userAccount, gas });

		const receipt = await cloneFactory.methods.createCampaign(100, userAccount).send({ from: userAccount, gas });
		if (receipt.status) {
			[campaignAddress] = await cloneFactory.methods.getCampaigns().call();
			campaign = new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
		}
	} catch (error) {
		throw new Error(error.message);
	}
});

describe('Campaign', () => {
	it('deploys a clone factory and campaign', () => {
		assert.ok(cloneFactory.options.address);
		assert.ok(campaign.options.address);
	});
});
