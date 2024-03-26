const random_rate = () => {
  const rate_config = process.env.SCORE_RATE | "5";
  if (rate_config.toString().indexOf("-") >= 0) {
    const split = rate_config.toString().split("-");
    return getRandomArbitrary(parseInt(split[0]), parseInt(split[1]));
  } else {
    const num = parseInt(random_rate);
    if (num >= 5 || num <= 0) return "5";
    else return num.toString();
  }
};

function getRandomArbitrary(min, max) {
  if (min <= 0) min = 1;
  if (min >= 5) min = 5;
  if (max >= 5) max = 5;
  if (max <= min) max = min;
  return Math.random() * (max - min) + min;
}

module.exports = { random_rate };
