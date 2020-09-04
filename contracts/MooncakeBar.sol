pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract MooncakeBar is ERC20("MooncakeBar", "xMOONCAKE"){
    using SafeMath for uint256;
    IERC20 public mooncake;

    constructor(IERC20 _mooncake) public {
        mooncake = _mooncake;
    }

    // Enter the bar. Pay some MOONCAKEs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalMooncake = mooncake.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalMooncake == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalMooncake);
            _mint(msg.sender, what);
        }
        mooncake.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your MOONCAKEs.
    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(mooncake.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        mooncake.transfer(msg.sender, what);
    }
}