// https://coursetro.com/posts/code/99/Interacting-with-a-Smart-Contract-through-Web3.js-(Tutorial)
// https://stackoverflow.com/questions/53936076/problems-with-metamask-web3-connection

var dapp;
var bookmaker;
var myAddr;
var teams = ["ITA","ENG","WAL"]


window.onload = function funLoad() { 
	if (window.ethereum) {
		window.ethereum.send('eth_requestAccounts');
		dapp = new Web3(window.ethereum);
	} else {
		document.getElementById('meta-mask-required').innerHTML = 'You need <a href="https://metamask.io/">MetaMask</a> browser plugin to run this example'
	}

	bookmaker = new dapp.eth.Contract(ABIBookmaker,"0x6CE1bA7730D76e74345E851294DC9fEb0a52459e");

	dapp.eth.getAccounts().then( function(result) {
		myAddr = result[0]
		document.getElementById('eth.addr').textContent = myAddr;
		teams.forEach( el => {
			bookmaker.methods.getNumberTokensOnTeam(myAddr,el).call().then(function(res){
				if (res > 0) {
					document.getElementById('eth.account').innerHTML += ("<div class='"+ el +" bet-icon'></div>")
				}
			})
		})
		dapp.eth.getBalance(myAddr).then( function(res) {
			document.getElementById('eth.eth').textContent = dapp.utils.fromWei(res, 'ether');
		})
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