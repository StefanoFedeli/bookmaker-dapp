// https://coursetro.com/posts/code/99/Interacting-with-a-Smart-Contract-through-Web3.js-(Tutorial)
// https://stackoverflow.com/questions/53936076/problems-with-metamask-web3-connection


var ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkFulfilled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkRequested",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_requestId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_result",
				"type": "uint256"
			}
		],
		"name": "fulfill",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_team",
				"type": "string"
			}
		],
		"name": "getTeamInfo",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "whenOut",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_team",
				"type": "string"
			}
		],
		"name": "isTeamOutAtStage",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "volume",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawLink",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];


var dapp;
if (window.ethereum) {
	window.ethereum.send('eth_requestAccounts');
	dapp = new Web3(window.ethereum);
} else {
	document.getElementById('meta-mask-required').innerHTML = 'You need <a href="https://metamask.io/">MetaMask</a> browser plugin to run this example'
}

dapp.eth.defaultAccount = dapp.eth.accounts[0];

var LinkContract = new dapp.eth.Contract(ABI,"0x0059b92830614d052384916bd7E0532912650649");
LinkContract.defaultChain = "kovan"
LinkContract.defaultAccount = "0x5D4b3E0B0faAdE843021e512E534c868387B46F9"

console.log(LinkContract)

//LinkContract.methods.isTeamOutAtStage("ITA").send({from:"0x5D4b3E0B0faAdE843021e512E534c868387B46F9"})

LinkContract.methods.getTeamInfo('ITA').call().then(function(result){
	console.log('FUNCTION RES: ')
    console.log(result)
});
//console.log(dapp.eth.getAccounts())