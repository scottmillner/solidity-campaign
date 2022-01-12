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
let recipientAccount;
let recipientAccountBalance;

const gas = '8000000';
beforeEach(async () => {
	// Arrange
	try {
		accounts = await web3.eth.getAccounts();
		userAccount = accounts && accounts[0];
		recipientAccount = userAccount && accounts[1];
		recipientAccountBalance = await web3.eth.getBalance(recipientAccount);
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

	it('marks caller as campaign manager', async () => {
		// Act
		const manager = await campaign.methods.manager().call();

		// Assert
		assert.equal(userAccount, manager);
	});

	it('allows people to contribute money and marks them as approvers.', async () => {
		// Act
		await campaign.methods.contribute().send({ from: userAccount, value: 100 });
		const isApproved = await campaign.methods.approvers(userAccount).call();

		// Assert
		assert.ok(isApproved);
	});

	it('requires a minimum contribution', async () => {
		try {
			// Act
			await campaign.methods.contribute().send({ from: userAccount, gas, value: 50 });
			// should not reach this line since value < minimum contribution amount of 100
			assert(false);
		} catch (error) {
			assert(error.message.includes('You need to contribute at least the minimum contribution amount.'));
		}
	});

	it('allows a manager to create a request', async () => {
		// Act
		await campaign.methods.createRequest('test request', 1000, userAccount).send({ from: userAccount, gas });
		const request = await campaign.methods.requests(0).call();

		// Assert
		assert.equal('test request', request.description);
	});

	it('allows a manager to finalize a request', async () => {
		// Act
		await campaign.methods.contribute().send({ from: userAccount, gas, value: web3.utils.toWei('10', 'ether') });
		await campaign.methods.createRequest('test request', web3.utils.toWei('5', 'ether'), recipientAccount).send({ from: userAccount, gas });
		await campaign.methods.approveRequest(0).send({ from: userAccount, gas });
		await campaign.methods.finalizeRequest(0).send({ from: userAccount, gas });
		const request = await campaign.methods.requests(0).call();

		// Assert
		assert.ok(request.isComplete);
	});

	// E2E
	it('processes request', async () => {
		// Act
		await campaign.methods.contribute().send({ from: userAccount, gas, value: web3.utils.toWei('10', 'ether') });
		await campaign.methods.createRequest('test request', web3.utils.toWei('5', 'ether'), recipientAccount).send({ from: userAccount, gas });
		await campaign.methods.approveRequest(0).send({ from: userAccount, gas });
		await campaign.methods.finalizeRequest(0).send({ from: userAccount, gas });
		const request = await campaign.methods.requests(0).call();
		let balance = await web3.eth.getBalance(recipientAccount);
		balance = parseFloat(web3.utils.fromWei(balance, 'ether'));
		const recipientAccountBalanceFloat = parseFloat(web3.utils.fromWei(recipientAccountBalance, 'ether'));

		// Assert
		assert(balance > recipientAccountBalanceFloat);
		assert.ok(request.isComplete);
	});
});
