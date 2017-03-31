/**
 * Roulette game logic
 * @returns {{getAmountFromBet: getAmountFromBet, generateNumber: generateNumber}}
 */
module.exports = () => {

  const randomNumber = require("random-number-csprng");

  const RATIO_0 = 7;
  const RATIO_STD = 2;
  const lastNumber = 14;
  const firstNumber = 0;
  const RED = "Red";
  const GREEN = "Green";
  const BLACK = "Black";


    /**
     * Get the amount result from the bet
     * @param stake
     * @param number
     * @param color
     * @returns {number}
     */
  function getAmountFromBet(stake, number, color){
    console.log(stake, number, color)
    if (color == GREEN && number == 0){
      return (RATIO_0 - 1)*stake;
    } else if((color == RED && number < 8) || (color == BLACK && number > 7)){
      return (RATIO_STD - 1)*stake;
    } else {
      return -1*stake;
    }
  }

    /**
     * Randomly generate the Roulette number
     * @returns {*|Promise.<TResult>}
     */
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
