// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HelloWorld is Ownable {
    string public message;

    event UpdatedMessages(string oldStr, string newStr);

    constructor(string memory initMessage) Ownable(msg.sender) {
        message = initMessage;
    }

    function update(string memory newMessage) public onlyOwner {
        string memory oldMsg = message;
        message = newMessage;
        emit UpdatedMessages(oldMsg, newMessage);
    }
}