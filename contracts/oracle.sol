// This example code is designed to quickly deploy an example contract using Remix.

pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/master/evm-contracts/src/v0.6/ChainlinkClient.sol";

contract APIConsumer is ChainlinkClient {
  
    uint256 public volume;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    string private focus;
    mapping (string => uint8) private TEAM_MAP;
    
    /**
     * Network: Kovan
     * Chainlink - 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
     * Chainlink - 29fa9aa13bf1468788b7cc4a500a45b8
     * Fee: 0.1 LINK
     */
    constructor() public {
        setPublicChainlinkToken();
        oracle = 0x83F00b902cbf06E316C95F51cbEeD9D2572a349a;
        jobId = "c179a8180e034cf5a341488406c32827";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }
    
    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     ************************************************************************************
     *                                    STOP!                                         * 
     *         THIS FUNCTION WILL FAIL IF THIS CONTRACT DOES NOT OWN LINK               *
     *         ----------------------------------------------------------               *
     *         Learn how to obtain testnet LINK and fund this contract:                 *
     *         ------- https://docs.chain.link/docs/acquire-link --------               *
     *         ---- https://docs.chain.link/docs/fund-your-contract -----               *
     *                                                                                  *
     ************************************************************************************/
    function isTeamOutAtStage(string memory _team) public returns (bytes32 requestId) {

        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        focus = _team;
        
        // Set the URL to perform the GET request on
        request.add("get", "https://raw.githubusercontent.com/StefanoFedeli/bookmaker-dapp/master/contracts/EURO2020.json");
        
        // Set the path to find the desired data in the API response, where the response format is:
        // {"ITA": true, "ENG": false, ....}
        request.add("path", _team);
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId)
    {
        TEAM_MAP[focus] = uint8(_result);
        //focus = "";
    }

    function getTeamInfo(string memory _team) public view returns (uint8 whenOut) {
        return TEAM_MAP[_team];
    }
    
    /**
     * Withdraw LINK from this contract
     * 
     * NOTE: DO NOT USE THIS IN PRODUCTION AS IT CAN BE CALLED BY ANY ADDRESS.
     * THIS IS PURELY FOR EXAMPLE PURPOSES ONLY.
     */
    function withdrawLink() external {
        LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
        require(linkToken.transfer(msg.sender, linkToken.balanceOf(address(this))), "Unable to transfer");
    }
}