function sum(a, b) {
  /* ваш код */
    if (typeof (a) === "number" && typeof (b) === "number"){
        return a+b;
    }
    throw new TypeError("One of the parameters is not a number");
}

module.exports = sum;


