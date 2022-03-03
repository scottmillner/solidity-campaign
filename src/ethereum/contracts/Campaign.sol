// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Campaign is Initializable {
    struct Request {
        string description;
        uint value;
        uint approvalCount;
        address payable recipient;
        bool isComplete;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    uint public approversCount;
    mapping(address => bool) public approvers;
    Request[] public requests;

    function initialize(uint _minimum, address _creator) public initializer() {
        minimumContribution = _minimum;
        manager = _creator;
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

    function createRequest(string calldata _description, uint _value, address payable _recipient) external isManager {
        Request storage request = requests.push();
        request.description = _description;
        request.value = _value;
        request.recipient = _recipient;
    }

    function approveRequest(uint _index) external {
        Request storage request = requests[_index];
        require(approvers[msg.sender], "You must be approved to make this request.");
        require(!request.approvals[msg.sender], "You have already approved this request.");
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint _index) external isManager {
        Request storage request = requests[_index];
        require(!request.isComplete, "Request already finalized.");
        require(request.approvalCount > (approversCount / 2), "Request doesn't have enough approvals.");
        request.recipient.transfer(request.value);
        request.isComplete = true;
    }

    function getSummary() external view returns(uint, uint, uint, uint, address) {
        return (minimumContribution, address(this).balance, requests.length, approversCount, manager);
    }

    function getRequestCount() external view returns(uint) {
        return requests.length;
    }
}