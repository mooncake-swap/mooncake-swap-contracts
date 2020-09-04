const { expectRevert } = require('@openzeppelin/test-helpers');
const MooncakeToken = artifacts.require('MooncakeToken');

contract('MooncakeToken', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.mooncake = await MooncakeToken.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.mooncake.name();
        const symbol = await this.mooncake.symbol();
        const decimals = await this.mooncake.decimals();
        assert.equal(name.valueOf(), 'MooncakeToken');
        assert.equal(symbol.valueOf(), 'MOONCAKE');
        assert.equal(decimals.valueOf(), '18');
    });

    it('should only allow owner to mint token', async () => {
        await this.mooncake.mint(alice, '100', { from: alice });
        await this.mooncake.mint(bob, '1000', { from: alice });
        await expectRevert(
            this.mooncake.mint(carol, '1000', { from: bob }),
            'Ownable: caller is not the owner',
        );
        const totalSupply = await this.mooncake.totalSupply();
        const aliceBal = await this.mooncake.balanceOf(alice);
        const bobBal = await this.mooncake.balanceOf(bob);
        const carolBal = await this.mooncake.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '100');
        assert.equal(bobBal.valueOf(), '1000');
        assert.equal(carolBal.valueOf(), '0');
    });

    it('should supply token transfers properly', async () => {
        await this.mooncake.mint(alice, '100', { from: alice });
        await this.mooncake.mint(bob, '1000', { from: alice });
        await this.mooncake.transfer(carol, '10', { from: alice });
        await this.mooncake.transfer(carol, '100', { from: bob });
        const totalSupply = await this.mooncake.totalSupply();
        const aliceBal = await this.mooncake.balanceOf(alice);
        const bobBal = await this.mooncake.balanceOf(bob);
        const carolBal = await this.mooncake.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '90');
        assert.equal(bobBal.valueOf(), '900');
        assert.equal(carolBal.valueOf(), '110');
    });

    it('should fail if you try to do bad transfers', async () => {
        await this.mooncake.mint(alice, '100', { from: alice });
        await expectRevert(
            this.mooncake.transfer(carol, '110', { from: alice }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.mooncake.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });
