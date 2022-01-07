// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Campaign is Initializable {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool isComplete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint40 public minimumContribution;
    uint40 public approversCount;
    mapping(address => bool) public approvers;
    Request[] public requests;

    function initialize(uint40 minimum, address creator) public initializer() {
        minimumContribution = minimum;
        manager = creator;
    }

    modifier isManager() {
        require(msg.sender == manager, "Only the manager can perform this action.");
        _;
    }

    function contribute() external payable {
        require(msg.value >= minimumContribution, "You need to contribute at least the minimum contribution amount.");
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string calldata description, uint value, address payable recipient) external isManager {
        Request storage request = requests.push();
        request.description = description;
        request.value = value;
        request.recipient = recipient;
    }

    function approveRequest(uint index) external {
        Request storage request = requests[index];
        require(approvers[msg.sender], "You must be approved to make this request");
        require(!request.approvals[msg.sender], "You are not allowed to approve this request");
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public isManager {
        Request storage request = requests[index];
        require(!request.isComplete, "Request already finalized.");
        require(request.approvalCount > (approversCount / 2), "Request doesn't have enough approvals.");
        request.recipient.transfer(request.value);
        request.isComplete = true;
    }
}