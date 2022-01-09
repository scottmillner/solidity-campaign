const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

// delete build directory and contents
const buildPath = path.resolve(__dirname, 'contracts', 'build');
fs.removeSync(buildPath);

function findImports(path) {
	switch (path) {
		case 'utils/Address.sol':
		case '@openzeppelin/contracts/utils/Address.sol':
			return {
				contents: addressSource,
			};
		case '@openzeppelin/contracts/proxy/utils/Initializable.sol':
			return {
				contents: initializableSource,
			};
		case '@openzeppelin/contracts/proxy/Clones.sol':
			return {
				contents: clonesSource,
			};
		default:
			return { error: 'File not found.' };
	}
}

// compile Campaign contract
const addressPath = path.resolve('node_modules/@openzeppelin/contracts/utils/Address.sol');
const addressSource = fs.readFileSync(addressPath, 'utf8');

const initializablePath = path.resolve('node_modules/@openzeppelin/contracts/proxy/utils/Initializable.sol');
const initializableSource = fs.readFileSync(initializablePath, 'utf8');

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const campaignSource = fs.readFileSync(campaignPath, 'utf8');
const campaignInput = {
	language: 'Solidity',
	sources: {
		'Address.sol': {
			content: addressSource,
		},
		'Initializable.sol': {
			content: initializableSource,
		},
		'Campaign.sol': {
			content: campaignSource,
		},
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*'],
			},
		},
	},
};
const campaignOutput = JSON.parse(solc.compile(JSON.stringify(campaignInput), { import: findImports })).contracts['Campaign.sol'].Campaign;

// compile CloneFactory contract
const clonesPath = path.resolve('node_modules/@openzeppelin/contracts/proxy/Clones.sol');
const clonesSource = fs.readFileSync(clonesPath, 'utf8');

const cloneFactoryPath = path.resolve(__dirname, 'contracts', 'CloneFactory.sol');
const cloneFactorySource = fs.readFileSync(cloneFactoryPath, 'utf8');
const cloneFactoryInput = {
	language: 'Solidity',
	sources: {
		'Address.sol': {
			content: addressSource,
		},
		'Initializable.sol': {
			content: initializableSource,
		},
		'Campaign.sol': {
			content: campaignSource,
		},
		'Clone.sol': {
			content: clonesSource,
		},
		'CloneFactory.sol': {
			content: cloneFactorySource,
		},
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*'],
			},
		},
	},
};
const cloneFactoryOutput = JSON.parse(solc.compile(JSON.stringify(cloneFactoryInput), { import: findImports })).contracts['CloneFactory.sol']
	.CloneFactory;

// create build directory
fs.ensureDirSync(buildPath);

// create and write to build directory
fs.outputJsonSync(path.resolve(buildPath, 'CloneFactory.json'), cloneFactoryOutput);
fs.outputJsonSync(path.resolve(buildPath, 'Campaign.json'), campaignOutput);
