module.exports = () => {
  const RATIO_0 = 7;
  const RATIO = 2;

  var ObjectID = require('mongodb').ObjectID;
  let UserService = require ('./UserService');

  function getAmountFromBet(stake, number, hasWon){
    if (hasWon){
      var ratio = number == 0 ? RATIO_0 : RATIO;
      return (ratio - 1)*stake;
    } else {
      return -1*stake;
    }
  }

  return {
    getAmountFromBet
  };

}
