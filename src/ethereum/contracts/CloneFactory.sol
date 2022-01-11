//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/proxy/Clones.sol";
import './Campaign.sol';

contract CloneFactory {
    address baseImplementation;
    address[] campaignContracts;

    event CampaignCreated(address indexed _address);

    constructor() {
        baseImplementation = address(new Campaign());
    }

    function createCampaign(uint40 _minimum, address _creator) external {
        address _newCampaign = Clones.clone(baseImplementation);
        Campaign(_newCampaign).initialize(_minimum, _creator);
        campaignContracts.push(_newCampaign);
        emit CampaignCreated(_newCampaign);
    }

    function getCampaigns() public view returns(address[] memory) {
        return campaignContracts;
    }

}