function toBeInstanceOfArray(actual, classArray) {
  const pass = Boolean(classArray.filter((classItem) => actual instanceof classItem).length);

  if (pass) {
    return {
      message: () => `expect(${this.utils.printReceived('received')}).not.toBeInstanceOf(${this.utils.printExpected('expected')}) \n\n`
        + `Expected ${this.utils.printReceived(actual.constructor.name)} not to be one of the classes ${this.utils.printExpected(classArray.map((classItem) => classItem.name))}\n`
        + `Received value: ${this.utils.printReceived(actual)}`,
      pass: true,
    };
  }
  return {
    message: () => `expect(${this.utils.printReceived('received')}).toBeInstanceOf(${this.utils.printExpected('expected')}) \n\n`
        + `Expected ${this.utils.printReceived(actual.constructor.name)} to be one of the classes ${this.utils.printExpected(classArray.map((classItem) => classItem.name))}\n`
        + `Received value: ${this.utils.printReceived(actual)}`,
    pass: false,
  };
}

expect.extend({ toBeInstanceOfArray });
