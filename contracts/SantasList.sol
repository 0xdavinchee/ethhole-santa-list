//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SantasList {
    struct NiceLister {
        uint256 feesWithdrawn;
        bool valid;
    }

    mapping(address => NiceLister) public niceList;
    mapping(address => bool) public naughtyList;

    uint256 public feeAmount;
    uint256 public numNiceListers;
    uint256 public totalFeesAccrued;
    address private owner;

    constructor(
        address[] memory _niceList,
        address[] memory _naughtyList,
        uint256 _feeAmount
    ) {
        feeAmount = _feeAmount;
        owner = msg.sender;
        for (uint256 i = 0; i < _niceList.length; i++) {
            niceList[_niceList[i]] = NiceLister(0, true);
        }
        for (uint256 i = 0; i < _naughtyList.length; i++) {
            require(
                niceList[_naughtyList[i]].valid == false,
                "This address is on the nice list."
            );
            naughtyList[_naughtyList[i]] = true;
        }
    }
}
