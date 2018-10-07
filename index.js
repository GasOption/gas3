
function execute(fn, ...args) {
  return new Promise((resolve, reject) => {
    args.push((err, res) => {
      if (err) reject(err);
      else resolve(res);
    });

    fn(...args);
  });
}

module.exports = function (web3) {
  web3.eth.sendTransaction = async (data, cb) => {
    const gasPriceCurrent = await execute(web3.eth.getGasPrice);

    let gasPrice = gasPriceCurrent.div(2);
    const gasPriceMax =  new web3.BigNumber(data.gasPriceMax || gasPriceCurrent.mul(4));
    const factor = Math.pow(gasPriceMax.div(gasPrice).toNumber(), 0.125);

    let tx = [];
    const accounts = await execute(web3.eth.getAccounts);
    const nonce = await execute(web3.eth.getTransactionCount, accounts[0], 'pending');
    do {
      const signed = await execute(web3.eth.signTransaction, { ...data, gasPrice, nonce });
      tx.push(await execute(web3.eth.sendRawTransaction, signed.raw));
      gasPrice = gasPrice.mul(factor.toFixed(15));
    } while(gasPrice.lt(gasPriceMax));

    return tx[0];
  };

  return web3;
};
