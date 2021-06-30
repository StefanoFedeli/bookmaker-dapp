pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/master/evm-contracts/src/v0.6/ChainlinkClient.sol";

contract EURO2020API is ChainlinkClient {
    

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    string private focus;
    string private URL;
    address private owner;
    mapping (string => uint8) private TEAM_MAP;
    
    /**
     * Network: Kovan
     * Chainlink Contract - 0x56dd6586DB0D08c6Ce7B2f2805af28616E082455
     * Chainlink      Job - b6602d14e4734c49a5e1ce19d45a4632
     * Fee: 0.1 LINK
     */
    constructor() public {
        setPublicChainlinkToken();
        oracle = 0x56dd6586DB0D08c6Ce7B2f2805af28616E082455;
        jobId = "b6602d14e4734c49a5e1ce19d45a4632";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
        URL = "https://api.jsonbin.io/b/60d6089f8a4cd025b7a596d2/latest";
        owner = msg.sender;
    }
    
    /**
     * Call the jobID with the instruction to parse.
     */
    function isTeamOutAtStage(string memory _team) public returns (bytes32 requestId) {
        require(TEAM_MAP[_team]==0);
        //require(msg.sender == contractaddress);
        focus = _team;

        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", URL);
        
        // Set the path to find the desired data in the API response, where the response format is:
        // {"ITA": 0, "ENG": 1, ....}
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
    }

    /**
     * Withdraw the level information about _team
     */
    function getTeamInfo(string memory _team) public view returns (uint8 whenOut) {
        return TEAM_MAP[_team];
    }
    
    /**
     * Withdraw LINK from this contract
     */
    function withdrawLink() external {
        require(msg.sender==owner);
        LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
        require(linkToken.transfer(msg.sender, linkToken.balanceOf(address(this))), "Unable to transfer");
    }
    
    /**
     * Change the URL used for getting the data
     */
    function changeURL(string memory _newURL) public {
        require(msg.sender==owner);
        URL = _newURL;
    }
}