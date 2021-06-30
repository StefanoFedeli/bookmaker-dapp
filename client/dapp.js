// https://coursetro.com/posts/code/99/Interacting-with-a-Smart-Contract-through-Web3.js-(Tutorial)
// https://stackoverflow.com/questions/53936076/problems-with-metamask-web3-connection

var dapp;
var bookmaker;
var myAddr;
var teams = ["ITA","ENG", "SUI", "BEL", "DEN", "UKR", "CZE", "ESP"];
var new_options = [];
var active_offers = {};


window.onload = function funLoad() { 
	if (window.ethereum) {
		window.ethereum.send('eth_requestAccounts');
		dapp = new Web3(window.ethereum);
	} else {
		document.getElementById('meta-mask-required').innerHTML = 'You need <a href="https://metamask.io/">MetaMask</a> browser plugin to run this example'
	}

	bookmaker = new dapp.eth.Contract(ABIBookmaker,"0xceAF03F5A5fcA0f3221777Bf0d52C248e883094D");

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
