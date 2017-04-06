const flatten = (inputArray, accumulator) => {
  inputArray.forEach((val) => {
    if (Array.isArray(val)) {
      flatten(val, accumulator); // tail recursion
    } else {
      accumulator.push(val);
    }
  });
  return accumulator;
};

const testArray = [[1, 2, [3]], 4];

const result = flatten(testArray, []);

console.log('flattened', result);
