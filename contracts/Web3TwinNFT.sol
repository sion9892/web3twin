// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Web3TwinNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;
    
    // Gasless minting settings
    bool public gaslessMintingEnabled = true;
    uint256 public maxGaslessMintsPerUser = 3;
    mapping(address => uint256) public userGaslessMintCount;
    
    struct TwinMatch {
        address user1;
        address user2;
        uint256 similarity;
        uint256 timestamp;
        string sharedHashtags;
        string sharedEmojis;
    }
    
    mapping(uint256 => TwinMatch) public twinMatches;
    mapping(address => uint256[]) public userTokens;
    
    event TwinMinted(
        uint256 indexed tokenId,
        address indexed user1,
        address indexed user2,
        uint256 similarity
    );
    
    constructor() ERC721("Web3Twin", "TWIN") Ownable(msg.sender) {
        _nextTokenId = 1;
    }
    
    function mintTwinNFT(
        address _user1,
        address _user2,
        uint256 _similarity,
        string memory _sharedHashtags,
        string memory _sharedEmojis,
        string memory _tokenURI
    ) public returns (uint256) {
        require(_user1 != address(0) && _user2 != address(0), "Invalid addresses");
        require(_similarity > 0 && _similarity <= 100, "Invalid similarity");
        
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(_user1, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        twinMatches[tokenId] = TwinMatch({
            user1: _user1,
            user2: _user2,
            similarity: _similarity,
            timestamp: block.timestamp,
            sharedHashtags: _sharedHashtags,
            sharedEmojis: _sharedEmojis
        });
        
        userTokens[_user1].push(tokenId);
        userTokens[_user2].push(tokenId);
        
        emit TwinMinted(tokenId, _user1, _user2, _similarity);
        
        return tokenId;
    }
    
    /**
     * Gasless minting function - user doesn't pay gas
     */
    function mintTwinNFTGasless(
        address _user1,
        address _user2,
        uint256 _similarity,
        string memory _sharedHashtags,
        string memory _sharedEmojis,
        string memory _tokenURI
    ) public nonReentrant returns (uint256) {
        require(gaslessMintingEnabled, "Gasless minting disabled");
        require(_user1 != address(0) && _user2 != address(0), "Invalid addresses");
        require(_similarity > 0 && _similarity <= 100, "Invalid similarity");
        require(userGaslessMintCount[_user1] < maxGaslessMintsPerUser, "Gasless mint limit exceeded");
        
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(_user1, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        twinMatches[tokenId] = TwinMatch({
            user1: _user1,
            user2: _user2,
            similarity: _similarity,
            timestamp: block.timestamp,
            sharedHashtags: _sharedHashtags,
            sharedEmojis: _sharedEmojis
        });
        
        userTokens[_user1].push(tokenId);
        userTokens[_user2].push(tokenId);
        
        // Increment gasless mint count
        userGaslessMintCount[_user1]++;
        
        emit TwinMinted(tokenId, _user1, _user2, _similarity);
        
        return tokenId;
    }
    
    /**
     * Owner functions for managing gasless minting
     */
    function setGaslessMintingEnabled(bool _enabled) public onlyOwner {
        gaslessMintingEnabled = _enabled;
    }
    
    function setMaxGaslessMintsPerUser(uint256 _max) public onlyOwner {
        maxGaslessMintsPerUser = _max;
    }
    
    function fundContract() public payable {
        // Allow contract to receive ETH for gas payments
    }
    
    function withdrawFunds() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function getUserTokens(address _user) public view returns (uint256[] memory) {
        return userTokens[_user];
    }
    
    function getTwinMatch(uint256 _tokenId) public view returns (TwinMatch memory) {
        require(ownerOf(_tokenId) != address(0), "Token does not exist");
        return twinMatches[_tokenId];
    }
    
    function _baseURI() internal pure override returns (string memory) {
        return "https://web3twin.vercel.app/api/metadata/";
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
