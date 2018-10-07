const gas3 = require('..');
const web3Wallet = require('web3-wallet');

const wallet = web3Wallet.wallet.fromPrivateKey('dc6bb8b039278778b537093381dac405299d2d7c31f7c0eae515215a8d20276d');
const web3 = gas3(web3Wallet.create(wallet, 'http://10.7.15.181:8080'));

(async () => {
  await web3.eth.sendTransaction({ to: '0xb8915c565c7fe6d90ede6cb165eb64397c6798b6', value: web3.toWei(0.1, 'ether') });
})().catch(console.error);
