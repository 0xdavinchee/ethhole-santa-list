//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SantasList {
    using SafeMath for uint256;
    struct NiceLister {
        uint256 feesWithdrawn;
        bool valid;
    }

    address[] niceListAddresses;

    mapping(address => NiceLister) public niceList;
    mapping(address => bool) public naughtyList;

    uint256 public feeAmount = 0.01 ether;
    uint256 public numNiceListers;
    uint256 public totalFeesAccrued;
    address public owner;

    event NewNiceLister(address niceLister, uint256 feePaid);
    event NewNaughtyLister(address naughtyLister);
    event WithdrawFees(address withdrawer, uint256 amount);

    constructor(address[] memory _naughtyList) {
        owner = msg.sender;
        for (uint256 i = 0; i < _naughtyList.length; i++) {
            naughtyList[_naughtyList[i]] = true;
            emit NewNaughtyLister(_naughtyList[i]);
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the list owner.");
        _;
    }

    function addToNaughtyList(address _address) external onlyOwner {
        require(
            naughtyList[_address] == false,
            "This address is already on the naughty list."
        );
        require(
            niceList[_address].valid == false,
            "This address is on the nice list."
        );
        require(
            _address != msg.sender,
            "You are not allowed to add yourself to the naughty list."
        );

        naughtyList[_address] = true;
        emit NewNaughtyLister(_address);
    }

    function joinNiceList() external payable {
        require(
            niceList[msg.sender].valid == false,
            "You are already on the nice list."
        );
        require(
            naughtyList[msg.sender] == true,
            "You aren't on the naughty list."
        );
        require(
            msg.value == feeAmount,
            "You must pay the fee amount to get on the nice list."
        );

        niceList[msg.sender] = NiceLister(0, true);
        naughtyList[msg.sender] = false;
        numNiceListers = numNiceListers.add(1);
        feeAmount = 0.01 ether * (numNiceListers.add(1))**2;
        niceListAddresses.push(msg.sender);
        totalFeesAccrued += msg.value;

        emit NewNiceLister(msg.sender, msg.value);
    }

    function withdrawShareOfFees() external payable {
        require(niceList[msg.sender].valid, "You aren't on the nice list.");
        uint256 withdrawableAmount = getWithdrawableAmount();
        require(
            withdrawableAmount > 0,
            "You have already withdrawn your share."
        );
        niceList[msg.sender].feesWithdrawn = niceList[msg.sender]
            .feesWithdrawn
            .add(withdrawableAmount);
        (bool sent, ) = msg.sender.call{value: withdrawableAmount}("");
        require(sent, "Unable to withdraw funds.");
        emit WithdrawFees(msg.sender, withdrawableAmount);
    }

    function ownerWithdrawBounty() external payable onlyOwner {
        uint256 withdrawableAmount = getOwnerWithdrawableAmount();
        require(withdrawableAmount > 0, "You have nothing to withdraw.");
        (bool sent, ) = msg.sender.call{value: withdrawableAmount}("");
        require(sent, "Unable to withdraw funds.");
        emit WithdrawFees(msg.sender, withdrawableAmount);
    }

    function getWithdrawableAmount() public view returns (uint256) {
        return _getWithdrawableAmount(msg.sender);
    }

    function getOwnerWithdrawableAmount() public view returns (uint256) {
        uint256 ownerAmount = totalFeesAccrued;
        if (address(this).balance == 0) {
            return 0;
        }
        for (uint256 i = 0; i < niceListAddresses.length; i++) {
            uint256 niceListWithdrawableAmount =
                _getWithdrawableAmount(niceListAddresses[i]);
            if (niceListWithdrawableAmount > 0) {
                ownerAmount = 0;
                break;
            }
            ownerAmount = ownerAmount.sub(
                niceList[niceListAddresses[i]].feesWithdrawn
            );
        }
        return ownerAmount;
    }

    function _getWithdrawableAmount(address _address)
        internal
        view
        returns (uint256)
    {
        (, uint256 averageWithdrawalAmount) =
            address(this).balance.tryDiv(numNiceListers);
        return
            address(this).balance == 0 ||
                averageWithdrawalAmount < niceList[_address].feesWithdrawn ||
                !niceList[_address].valid
                ? 0
                : averageWithdrawalAmount.sub(niceList[_address].feesWithdrawn);
    }

    receive() external payable {}
}
