/*
Implements EIP20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
.*/

pragma solidity  ^0.6.0;

import './oracle.sol';

contract EURO2020 {

    EURO2020API api;

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    
    uint256 constant private PRICE_PER_UNIT = 0.003 ether;
    uint256 constant private MAX_AVALIABLE = 20;
    uint256 constant private NUM_TEAMS = 8;
    uint256 public time_start_playoff;
    uint256 public time_end_tournament;
    address payable private owner;
    mapping (string => uint256) private TEAM_MAP;
    mapping (uint8 => uint256) private LEVELS;
    mapping (string => uint256) private PAYBACK;
    
    uint public last_offer_id;
    uint256 private offerCoins;
    uint256 constant private our_fee = 0.00005 ether;
    bool locked;
    mapping (uint => OfferInfo) private offers_map;
    struct OfferInfo {
        uint256  price;
        uint256  amount;
        string   pair;
        address payable owner;
        uint64   timestamp;
    }

    mapping (address => uint256) public balances;
    mapping (address => mapping (string => uint256)) private bets;

    string public name = "Euro Football bets";  //fancy name: eg Simon Bucks
    string public symbol = "EURO2020";         //An identifier: eg SBX
    uint256 public totalSupply;

    constructor() public { 
        totalSupply = MAX_AVALIABLE*NUM_TEAMS;
        TEAM_MAP['ITA'] = MAX_AVALIABLE;
        TEAM_MAP['SUI'] = MAX_AVALIABLE;
        TEAM_MAP['BEL'] = MAX_AVALIABLE;
        TEAM_MAP['DEN'] = MAX_AVALIABLE;
        TEAM_MAP['UKR'] = MAX_AVALIABLE;
        TEAM_MAP['CZE'] = MAX_AVALIABLE;
        TEAM_MAP['ESP'] = MAX_AVALIABLE;
        TEAM_MAP['ENG'] = MAX_AVALIABLE;
        
        LEVELS[0] = 0;
        LEVELS[1] = 5;
        LEVELS[2] = 10;
        LEVELS[3] = 20;
        LEVELS[4] = 60;
        
        time_end_tournament =  now + 10 days; 
        time_start_playoff = now + 1 days;
        owner = msg.sender;
        balances[owner] = totalSupply;

        api = EURO2020API(0x28CA76a5c0a50D3fbd8999b1336Eb9d01677f699);
    }
    
    /*
    * FUNCTIONs FOR ERC-20 COMPATIBILITY
    */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }
    
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
    
    
    /*
    * BOOKMAKER FUNCTIONs
    */
    function place_bet(string memory _team, uint256 _amount) public payable returns (bool success) {
        //require(now <= time_start_playoff);
        require(msg.value >= _amount * PRICE_PER_UNIT);
        require(TEAM_MAP[_team] >= _amount);
        TEAM_MAP[_team] -= _amount;
        bets[msg.sender][_team] += _amount;
        balances[msg.sender] += _amount;
        balances[owner] -= _amount;
        return true;
    }
    
    function collect_dust() public returns(bool success) {
        // instead of checking if the owner has totalSupply number of coins, it is possible to put a time condition
        require(msg.sender == owner);
        require(balances[msg.sender] == totalSupply);
        owner.transfer(address(this).balance);
        return true;
    }
    
    function oracle(string memory _team, uint8 _level) private returns (bool success) {
        if (TEAM_MAP[_team] == MAX_AVALIABLE){
            PAYBACK[_team] = 0;
        } else {
            PAYBACK[_team] = (address(this).balance * LEVELS[_level] / 100) / (MAX_AVALIABLE - TEAM_MAP[_team]);
        }
        return true;
    }
    
    function collect_bet(string memory _team) public returns (bool success) {
        //require(now >= time_end_tournament );
        require(bets[msg.sender][_team] >= 1);

        PAYBACK[_team] = api.getTeamInfo(_team);
        if (PAYBACK[_team] == 0) {
            api.isTeamOutAtStage(_team);
        }

        oracle(_team,api.getTeamInfo(_team));
        require(PAYBACK[_team] != 0);

        uint256 amount = bets[msg.sender][_team];
        bets[msg.sender][_team] = 0 ;
        balances[owner] += amount;
        balances[msg.sender] -= amount;
        msg.sender.transfer(PAYBACK[_team] * amount);
        return true;
    }
    
    
    
    /*
    * DEX FUNCTIONs
    */
    modifier can_buy(uint id) {
        require(offer_isActive(id));
        _;
    }

    modifier can_cancel(uint id) {
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
    
    function offer_isActive(uint id) public view returns (bool active) {
        return offers_map[id].timestamp > 0;
    }
    function offer_getOwner(uint id) public view returns (address own) {
        return offers_map[id].owner;
    }
    
    function getOfferInfo(uint id) public view returns (uint, string memory, uint256, uint256, address) {
      OfferInfo memory offer = offers_map[id];
      return (id, offer.pair, offer.amount, offer.price, offer.owner);
    }
    
    function _next_id() internal returns (uint) {
        last_offer_id++;
        return last_offer_id;
    }
    
    function buy(uint256 id, uint8 quantity) public payable can_buy(id) synchronized returns (bool success) {
        
        OfferInfo memory offer = offers_map[id];
        uint256 to_spend = quantity * offer.price;
        
        require(bets[offer.owner][offer.pair] >= quantity);
        require(to_spend <= address(this).balance);
        require(to_spend <= msg.value);
        require(quantity > 0);
        require(to_spend > 0);
        require(offer.amount >= quantity);

        bets[offer.owner][offer.pair] -= quantity;
        bets[msg.sender][offer.pair] += quantity;
        offerCoins -= quantity;
        balances[msg.sender] += quantity;
        offers_map[id].amount -= quantity;
        offer.owner.transfer(to_spend - our_fee * quantity);
        
        if (offers_map[id].amount == 0) {
          delete offers_map[id];
        }

        return true;
    }
    
    // Cancel an offer.
    function cancel_offer(uint id) public can_cancel(id) synchronized returns (bool success) {
        // read-only offer. Modify an offer by directly accessing offers[id]
        require(offers_map[id].owner == msg.sender);
        require(offerCoins >= offers_map[id].amount);

        offerCoins -= offers_map[id].amount;
        balances[msg.sender] += offers_map[id].amount;
        delete offers_map[id];
        return true;
    }

    // Make a new offer. Takes funds from the caller into market escrow.
    function sell(string memory pair, uint256 price, uint256 amount) public synchronized returns (bool success) {
        require(price > 0);
        require(amount > 0);
        require(bets[msg.sender][pair] >= amount);
        require(balances[msg.sender] > 0);

        OfferInfo memory info;
        info.pair = pair;
        info.price = price + our_fee;
        info.amount = amount;
        info.owner = msg.sender;
        info.timestamp = uint64(now);
        uint id = _next_id();
        balances[msg.sender] -= amount;
        offerCoins += amount;
        offers_map[id] = info;
        

        return true;
    }
    
    function getNumberTokensOnTeam(address _address, string memory _team) public view returns (uint256){
        return bets[_address][_team];
    }
    
    function getTeamNames() public pure returns (string memory){
        return "Teams: ENG, ITA, SUI, BEL, DEN, UKR, CZE, ESP";
    }
    
    function getAvailableTokensOnTeam(string memory _team) public view returns (uint256){
        return TEAM_MAP[_team];
    }
    
    /*function getPayback(string _team) public view returns (uint256){
        return PAYBACK[_team];
    }*/
    
    /*function getTeamMap(string _team) public view returns (uint256){
        return TEAM_MAP[_team];
    }*/
    
    function getPricePerUnit() public pure returns (uint256){
        return PRICE_PER_UNIT;
    }
    
    function getLastOfferId() public view returns (uint){
        return last_offer_id;
    }
    
}
