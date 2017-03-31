module.exports = () => {

  const randomNumber = require("random-number-csprng");

  const RATIO_0 = 7;
  const RATIO_STD = 2;
  const lastNumber = 14;
  const firstNumber = 0;
  const RED = "red";
  const GREEN = "green";
  const BLACK = "black";


  function getAmountFromBet(stake, number, color){
    if (color == GREEN && number == 0){
      return (RATIO_0 - 1)*stake;
    } else if((color == RED && number < 8) || (color == BLACK && number > 7)){
      return (RATIO_STD - 1)*stake;
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
