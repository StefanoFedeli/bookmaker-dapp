// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/contracts/src/v0.6/ChainlinkClient.sol";
/**
     * Network: Kovan
     * Chainlink Contract - 0x56dd6586DB0D08c6Ce7B2f2805af28616E082455
     * Chainlink      Job - b6602d14e4734c49a5e1ce19d45a4632
     * Fee: 0.1 LINK
*/


/*
Implements EIP20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
.*/
contract DEXBookmaker is ChainlinkClient {

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    address payable private owner;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private chain_fee;
    uint8 private focus;
    string private URL;
    
    mapping (uint8 => string) private teamIDs;

    
    uint256 private price_per_unit = 0.003 ether;
    uint256 private totalPrize = 0;
    uint256 private our_fee = 1;
    uint128 private max_available = 100;
    uint8 private num_teams = 20;
    bool private is_playoff = false;
    uint256 public time_start_bets;
    uint256 public time_end_bets;
    mapping (uint8 => uint8) private odds_percentage;
    mapping (uint8 => uint256) private supply_payback;
    
    uint256 public last_offer_id = 0;
    
    bool private locked = false;
    bool private prizeLock = false;

    mapping (uint256 => OfferInfo) private offers_map;
    struct OfferInfo {
        uint256  price;
        uint128  amount;
        uint8   pairID;
        address payable owner;
        uint64   timestamp;
    }


    mapping (address => uint256) public balances;
    mapping (address => mapping (uint8 => uint128)) private bets;
    address[] private holders;

    string constant public name = "Governance Bets";  //fancy name: eg Simon Bucks
    string constant public symbol = "GOVBETS";        //An identifier: eg SBX

    
    constructor() public {
        setPublicChainlinkToken();
        oracle = 0x56dd6586DB0D08c6Ce7B2f2805af28616E082455;
        jobId = "b6602d14e4734c49a5e1ce19d45a4632";
        chain_fee = 0.1 * 10 ** 18; // 0.1 LINK
        URL = "https://api.jsonbin.io/b/60d6089f8a4cd025b7a596d2/latest";
        owner = payable(msg.sender);

        balances[msg.sender] = uint256(max_available * uint128(num_teams));
        holders.push(address(0x0));

        teamIDs[0] = "";
        teamIDs[0] = "";
        teamIDs[0] = "";
        teamIDs[0] = "";
        teamIDs[0] = "";
        teamIDs[0] = "";
        teamIDs[0] = "";
        teamIDs[0] = "";
        teamIDs[0] = "";
        teamIDs[0] = "";
        teamIDs[0] = "";
        teamIDs[0] = "";

    }



    modifier can_change(address req) {
        require(req == owner);
        require(balances[req] >= uint256(max_available * uint128(num_teams)) * 60 / 100 );
        //require( (now + 2 days) >= time_end_tournament);
        _;
    }

    function init_tournament(uint8 _teams, uint128 _max_supply, bool _playoff_format, uint256 _wei_base, uint8 _dex_fee, uint256 _start_time, uint256 _end_time) external synchronized can_change(msg.sender) {
        uint8 j = 0;
        uint i = 0;
        for (j=0; j<num_teams; j+=1) {
            odds_percentage[j] = 0;
            supply_payback[j] = 0;
        }
        for (i=0; i<holders.length; i+=1) {
            balances[holders[i]] = 0;
            for (j=0; j<num_teams; j+=1) {
                bets[holders[i]][j] = 0;
            }
            delete holders[i];
        }
        for (i=0; i<last_offer_id; i+=1) {
            delete offers_map[i];
        }


        totalPrize = 0;
        num_teams = _teams;
        max_available = _max_supply;
        is_playoff = _playoff_format;
        price_per_unit = _wei_base;
        our_fee = _dex_fee;
        time_start_bets = _start_time;
        time_end_bets = _end_time;
        prizeLock = false;

        last_offer_id = 0;

    } 

    function change_id(string memory _team_jsonpath, uint8 _id) external can_change(msg.sender) {
        require(_id < num_teams);
        teamIDs[_id] = _team_jsonpath;
        supply_payback[_id] = uint256(max_available);
    }

    function change_odds(uint8 _placement, uint8 _perc) external can_change(msg.sender) {
        require(_placement < num_teams);
        odds_percentage[_placement] = _perc;
    }







    /***************
    * DEX FUNCTIONS
    ****************/
    modifier can_buy(uint256 id) {
        require(offer_isActive(id));
        _;
    }

    modifier can_cancel(uint256 id) {
        require(offer_isActive(id));
        require(offer_getOwner(id) == msg.sender);
        _;
    }
    modifier synchronized {
        require(!locked);
        locked = true;
        _;
        locked = false;
    }
    
    function offer_isActive(uint256 id) public view returns (bool active) {
        return offers_map[id].timestamp > 0;
    }
    function offer_getOwner(uint256 id) internal view returns (address own) {
        return offers_map[id].owner;
    }
    
    function getOfferInfo(uint256 id) external view returns (uint256, uint8, uint256, uint256, address) {
      OfferInfo memory offer = offers_map[id];
      return (id, offer.pairID, offer.amount, offer.price, offer.owner);
    }
    
    function _next_id() internal returns (uint256) {
        last_offer_id++;
        return last_offer_id;
    }
    
    function buy(uint256 id, uint8 quantity) external payable can_buy(id) synchronized returns (bool success) {
        
        OfferInfo memory offer = offers_map[id];
        uint256 to_spend = quantity * offer.price;
        
        require(bets[offer.owner][offer.pairID] >= quantity);
        require(to_spend <= address(this).balance);
        require(to_spend <= msg.value);
        require(quantity > 0);
        require(to_spend > 0);
        require(offer.amount >= quantity);

        bets[offer.owner][offer.pairID] -= quantity;
        bets[msg.sender][offer.pairID] += quantity;
        balances[address(0x0)] -= quantity;
        balances[msg.sender] += quantity;
        offers_map[id].amount -= quantity;
        offer.owner.transfer(to_spend - uint256(to_spend / (100 + our_fee)) );
        
        if (offers_map[id].amount == 0) {
          delete offers_map[id];
        }

        return true;
    }
    
    // Cancel an offer.
    function cancel_offer(uint id) external can_cancel(id) synchronized returns (bool success) {
        // read-only offer. Modify an offer by directly accessing offers[id]
        require(offers_map[id].owner == msg.sender);
        require(balances[address(0x0)] >= offers_map[id].amount);

        balances[address(0x0)] -= offers_map[id].amount;
        balances[msg.sender] += offers_map[id].amount;
        delete offers_map[id];
        return true;
    }

    // Make a new offer. Takes funds from the caller into market escrow.
    function sell(uint8 pairID, uint256 price, uint128 amount) external synchronized returns (bool success) {
        require(price > 0);
        require(amount > 0);
        require(bets[msg.sender][pairID] >= amount);
        require(balances[msg.sender] > 0);

        OfferInfo memory info;
        info.pairID = pairID;
        info.price = price + uint256(our_fee * price / 100);
        info.amount = amount;
        info.owner = payable(msg.sender);
        info.timestamp = uint64(block.timestamp);
        uint id = _next_id();
        balances[msg.sender] -= amount;
        balances[address(0x0)] += amount;
        offers_map[id] = info;

        return true;
    }




    /******************
    * ORACLE FUNCTIONS
    *******************/
    // Call the jobID with the instruction to parse
    function teamOutcome(uint8 _team) private returns (bytes32 requestId) {
        focus = _team;

        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", URL);
        
        // Set the path to find the desired data in the API response, where the response format is:
        // {"ITA": 0, "ENG": 1, ....}
        request.add("path", teamIDs[_team]);
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, chain_fee);
    }
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
        if (_result <= num_teams) {
            uint256 supply_left = supply_payback[focus];
            if (supply_payback[focus] == max_available){
                supply_payback[focus] = max_available+1;
            } else {
                supply_payback[focus] = (totalPrize * odds_percentage[uint8(_result)] / 100) / (uint256(max_available) - supply_left);
            }
        }
    }
    /**
     * Withdraw LINK from this contract
     */
    function withdrawLink() external can_change(msg.sender) {
        LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
        require(linkToken.transfer(msg.sender, linkToken.balanceOf(address(this))), "Unable to transfer");
    }
    /**
     * Change the URL used for getting the data
     */
    function changeURL(string memory _newURL) external can_change(msg.sender) {
        URL = _newURL;
    }



    /*********************
    * BOOKMAKER FUNCTIONs
    **********************/
    function place_bet(uint8 _team, uint128 _amount) external payable synchronized {
        //require(now <= time_start_playoff);
        require(msg.value >= _amount * price_per_unit);
        require(supply_payback[_team] >= _amount);
        supply_payback[_team] -= _amount;
        bets[msg.sender][_team] += _amount;
        balances[msg.sender] += _amount;
        balances[owner] -= _amount;
    }
    
    function collect_dust() external can_change(msg.sender) {
        owner.transfer(address(this).balance);
    }
    
    function collect_bet(uint8 _team) external returns (bool success) {
        //require(now >= time_end_tournament );
        require(bets[msg.sender][_team] >= 1);

        if (! prizeLock) {
            totalPrize = address(this).balance;
            prizeLock = true;
        }

        if (supply_payback[_team] <= max_available) {
            teamOutcome(_team);
        }

        uint256 payback = 1;
        if (supply_payback[_team] == max_available + 1) {
            payback = 0;
        }
        if (supply_payback[_team] > max_available + 1) {
            payback = supply_payback[_team];
        }

        require(payback != 1);

        uint256 amount = bets[msg.sender][_team];
        bets[msg.sender][_team] = 0 ;
        balances[owner] += amount;
        balances[msg.sender] -= amount;
        msg.sender.transfer(payback * amount);
        return true;
    }


    /************************************
    * FUNCTIONs FOR ERC-20 COMPATIBILITY
    *************************************/
    function transfer(address _to, uint256 _value) public returns (bool success) {
        revert();
    }
    function balanceOf(address _query) public view returns (uint256 balance) {
        return balances[_query];
    }
    
    
    
    
}