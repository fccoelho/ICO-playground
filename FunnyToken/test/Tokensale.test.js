const { assertRevert } = require('../node_modules/openzeppelin-solidity/test/helpers/assertRevert');
const { ether } = require('../node_modules/openzeppelin-solidity/test/helpers/ether');
const { ethGetBalance } = require('../node_modules/openzeppelin-solidity/test/helpers/web3');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const TokenSale = artifacts.require('TokenSale');
const FunnyToken = artifacts.require('FunnyToken');

contract('TokenSale', function ([_, investor, wallet, purchaser]) {
  const rate = new BigNumber(1);
  const value = 10;//ether(42);
  const tokenSupply = new BigNumber('1e18');
  const expectedTokenAmount = rate.mul(value);
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  it('requires a non-null token', async function () {
    await assertRevert(
      TokenSale.new(rate, wallet, ZERO_ADDRESS)
    );
  });

  context('with token', async function () {
    beforeEach(async function () {
      this.token = await FunnyToken.new();
    });

    it('requires a non-zero rate', async function () {
      await assertRevert(
        TokenSale.new(0, wallet, this.token.address)
      );
    });

    it('requires a non-null wallet', async function () {
      await assertRevert(
        TokenSale.new(rate, ZERO_ADDRESS, this.token.address)
      );
    });

    context('once deployed', async function () {
      beforeEach(async function () {
        this.tokensale = await TokenSale.new(rate, wallet, this.token.address);
        await this.token.transfer(this.tokensale.address, tokenSupply);
      });

      describe('accepting payments', function () {
        describe('bare payments', function () {
          it('should accept payments', async function () {
            await this.tokensale.send(value, { from: purchaser, gas: 220000 });
          });

          it('reverts on zero-valued payments', async function () {
            await assertRevert(
              this.tokensale.send(0, { from: purchaser })
            );
          });
        });

        describe('buyTokens', function () {
          it('should accept payments', async function () {
            await this.tokensale.buyTokens(investor, { value: value, from: purchaser, gas:220000 });
          });

          it('reverts on zero-valued payments', async function () {
            await assertRevert(
              this.tokensale.buyTokens(investor, { value: 0, from: purchaser, gas:220000 })
            );
          });

          it('requires a non-null beneficiary', async function () {
            await assertRevert(
              this.tokensale.buyTokens(ZERO_ADDRESS, { value: value, from: purchaser, gas:220000 })
            );
          });
        });
      });

      describe('high-level purchase', function () {
        it('should log purchase', async function () {
          const { logs } = await this.tokensale.sendTransaction({ value: value, from: investor, gas:220000 });
          const event = logs.find(e => e.event === 'TokensPurchased');
          should.exist(event);
          event.args.purchaser.should.equal(investor);
          event.args.beneficiary.should.equal(investor);
          event.args.value.should.be.bignumber.equal(value);
          event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
        });

        it('should assign tokens to sender', async function () {
          await this.tokensale.sendTransaction({ value: value, from: investor, gas:220000 });
          (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
        });

        it('should forward funds to wallet', async function () {
          const pre = await ethGetBalance(wallet);
          await this.tokensale.sendTransaction({ value, from: investor, gas: 220000 });
          const post = await ethGetBalance(wallet);
          post.minus(pre).should.be.bignumber.equal(value);
        });
      });

      describe('low-level purchase', function () {
        it('should log purchase', async function () {
          const { logs } = await this.tokensale.buyTokens(investor, { value: value, from: purchaser, gas:220000 });
          const event = logs.find(e => e.event === 'TokensPurchased');
          should.exist(event);
          event.args.purchaser.should.equal(purchaser);
          event.args.beneficiary.should.equal(investor);
          event.args.value.should.be.bignumber.equal(value);
          event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
        });

        it('should assign tokens to beneficiary', async function () {
          await this.tokensale.buyTokens(investor, { value, from: purchaser, gas:220000 });
          (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
        });

        it('should forward funds to wallet', async function () {
          const pre = await ethGetBalance(wallet);
          await this.tokensale.buyTokens(investor, { value, from: purchaser , gas:220000});
          const post = await ethGetBalance(wallet);
          post.minus(pre).should.be.bignumber.equal(value);
        });
      });
    });
  });
});
