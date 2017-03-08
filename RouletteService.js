module.exports = () => {

  const randomNumber = require("random-number-csprng");

  const RATIO_0 = 7;
  const RATIO = 2;
  const lastNumber = 14;
  const firstNumber = 0;


  function getAmountFromBet(stake, number, hasWon){
    if (hasWon){
      var ratio = number == 0 ? RATIO_0 : RATIO;
      return (ratio - 1)*stake;
    } else {
      return -1*stake;
    }
  }

  function generateNumber(){
      return randomNumber(firstNumber,lastNumber).then(function(number){
         return number;
      });
  }

  return {
    getAmountFromBet,
    generateNumber
  };

}
