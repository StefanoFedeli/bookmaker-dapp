// https://coursetro.com/posts/code/99/Interacting-with-a-Smart-Contract-through-Web3.js-(Tutorial)
// https://stackoverflow.com/questions/53936076/problems-with-metamask-web3-connection


var ABIChainLink = [
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

var ABIBookmaker = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "quantity",
				"type": "uint8"
			}
		],
		"name": "buy",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "cancel_offer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
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
		"name": "collect_bet",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "collect_dust",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
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
		"name": "getAvailableTokensOnTeam",
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
		"name": "getLastOfferId",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_team",
				"type": "string"
			}
		],
		"name": "getNumberTokensOnTeam",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getOfferInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPricePerUnit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTeamNames",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "last_offer_id",
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
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "offer_getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "own",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "offer_isActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
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
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "place_bet",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "pair",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "sell",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "time_end_tournament",
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
		"name": "time_start_playoff",
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
		"name": "totalSupply",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

var dapp;
var bookmaker;
var myAddr;
var teams = ["ITA","ENG","WAL", "FRA", "GER", "SWI", "BEL", "DEN", "NED", "AUS", "UKR", "CRO", "RCZ", "SWE", "SPA", "POR"];
var new_options = [];
var active_offers = {};




/*
var LinkContract = new dapp.eth.Contract(ABI,"0x28CA76a5c0a50D3fbd8999b1336Eb9d01677f699");


dapp.eth.defaultAccount = dapp.eth.accounts[0];


LinkContract.defaultChain = "kovan"
LinkContract.defaultAccount = "0x5D4b3E0B0faAdE843021e512E534c868387B46F9"

//console.log(LinkContract.methods.res)

LinkContract.methods.isTeamOutAtStage("ITA").send({from:"0x5D4b3E0B0faAdE843021e512E534c868387B46F9"})
//LinkContract.methods.withdrawLink().send({from:"0x5D4b3E0B0faAdE843021e512E534c868387B46F9"})

LinkContract.methods.getTeamInfo("ITA").call().then(function(result){
	console.log('FUNCTION RES: ')
    console.log(result)
});
*/
//console.log(dapp.eth.getAccounts())


window.onload = function funLoad() { 
	if (window.ethereum) {
		window.ethereum.send('eth_requestAccounts');
		dapp = new Web3(window.ethereum);
	} else {
		document.getElementById('meta-mask-required').innerHTML = 'You need <a href="https://metamask.io/">MetaMask</a> browser plugin to run this example'
	}

	bookmaker = new dapp.eth.Contract(ABIBookmaker,"0xDa5A0cfc860247aAD51a07Ca38e04EA3be1682d6");

	dapp.eth.getAccounts().then( function(result) {
		myAddr = result[0]
		document.getElementById('eth.addr').textContent = myAddr;
		teams.forEach( el => {
			bookmaker.methods.getNumberTokensOnTeam(myAddr,el).call().then(function(res){
				if (res > 0) {
					document.getElementById('eth.account').innerHTML += ("<div class='"+ el +" bet-icon'></div>")
					new_options.push(el);
					document.getElementById('teamToOffer').innerHTML += ("<option value='"+ el +"'>"+ el +"</option>")
					document.getElementById('teamToCash').innerHTML += ("<option value='"+ el +"'>"+ el +"</option>")
				}
				document.getElementById('teamToBetOn').innerHTML += ("<option value='"+ el +"'>"+ el +"</option>")
			})
		})
		dapp.eth.getBalance(myAddr).then( function(res) {
			document.getElementById('eth.eth').textContent = dapp.utils.fromWei(res, 'ether');
		})
	})
	
	document.getElementById("tableBody").innerHTML = "";
	bookmaker.methods.getLastOfferId().call().then(function(res){ 
		var lastId = res; 
		for (let i = 0; i <= lastId ; i++) {
			bookmaker.methods.getOfferInfo(i).call().then(function(res){ 
				if (res[2] != "0") {
					active_offers[res[0]] = res[3];
					var htmlToAdd = "<tr>" +
					"<td>" + res[0] + "</td>" +
					"<td>" + res[1] + "</td>" +
					"<td>" + res[2] + "</td>" +
					"<td>" + dapp.utils.fromWei(res[3]) + "</td>";
					if (myAddr == res[4]) {
						htmlToAdd += "<td><button onclick='cancel("+res[0]+")'>Cancel</button></td>";
					} else {
						
					}
					document.getElementById('buyOfferID').innerHTML += ("<option value='"+ res[0] +"'>"+ res[0] +"</option>")
					htmlToAdd += "</tr>";
					document.getElementById("tableBody").innerHTML += htmlToAdd;
				}
				
			})
		}
	})
	
} 



function bet() {
	var teamtoBet = document.getElementById('teamToBetOn').value;
	var qty = document.getElementById('qty_bet').value;
	var ether = (qty*0.003).toString();
	bookmaker.methods.place_bet(teamtoBet,qty).send({from: myAddr, value: dapp.utils.toWei(ether, 'ether')}).then(function(success){
		if (success) {
			alert("YOU HAVE PLACED YOUR BET");
			window.location.reload()
		} else {
			alert("ERROR IN THE TRANSACTION");
		}
	})
}

function cashback() {
	var team = document.getElementById('teamToCash').value;
	bookmaker.methods.collect_bet(team).send({from: myAddr}).then(function(success){
		if (success) {
			alert("YOU HAVE PLACED YOUR BET");
			window.location.reload()
		} else {
			alert("ERROR IN THE TRANSACTION");
		}
	})
}

function sell() {
	var team = document.getElementById('teamToCash').value;
	var qty = document.getElementById('qty_sell').value;
	var ether = (document.getElementById('price_sell').value).toString();
	var price = dapp.utils.toWei(ether, 'ether');
	console.log(qty,ether,price)
	bookmaker.methods.sell(team, price, qty).send({from: myAddr}).then(function(success){
		if (success) {
			alert("YOU HAVE PUBLISHED A NEW OFFER");
			window.location.reload()
		} else {
			alert("ERROR IN THE TRANSACTION");
		}
	})
}

function buy() {
	var offerId = document.getElementById('buyOfferID').value;
	var qty = document.getElementById('qty_buy').value;
	var price = active_offers[offerId] * qty;
	bookmaker.methods.buy(offerId,qty).send({from: myAddr, value: price}).then(function(success){
		if (success) {
			alert("YOU HAVE BOUGHT NEW TOKENS");
			window.location.reload()
		} else {
			alert("ERROR IN THE TRANSACTION");
		}
	})
}

function cancel(offerId) {
	bookmaker.methods.cancel_offer(offerId).send({from: myAddr}).then(function(success){
		if (success) {
			alert("YOU HAVE CANCELED YOUR OFFER");
			window.location.reload()
		} else {
			alert("ERROR IN THE TRANSACTION");
		}
	})
}
