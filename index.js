
module.exports = function (web3) {
  web3.eth.sendTransaction = async (data, cb) => {
    const gasPriceCurrent = await new Promise((resolve, reject) => {
      web3.eth.getGasPrice((err, price) => {
        if (err) reject(err);
        else resolve(price);
      });
    });

    let gasPrice = gasPriceCurrent.div(2);
    const gasPriceMax =  new web3.BigNumber(data.gasPriceMax || gasPriceCurrent.mul(4));
    const factor = Math.pow(gasPriceMax.div(gasPrice).toNumber(), 0.125);

    let rawTx = [];
    do {
      rawTx.push(await new Promise((resolve, reject) => {
        web3.eth.signTransaction({ ...data, gasPrice }, (err, res) => {
          if (err) reject(err);
          else resolve(res.raw);
        });
      }));
      gasPrice = gasPrice.mul(factor.toFixed(15));
    } while(gasPrice.lt(gasPriceMax));

    return web3.eth.sendRawTransaction(...rawTx, cb);
  };

  return web3;
};
