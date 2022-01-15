function sum(a, b) {
  /* ваш код */
    if (typeof (a) === "number" && typeof (b) === "number"){
        return a+b;
    }
    throw new TypeError("cda or b is not number");
}

module.exports = sum;


