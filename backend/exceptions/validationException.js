class validationException {
  getCode() {
    return this.code;
  }

  getDescription() {
    return this.description;
  }

  constructor(description) {
    this.code = 422;
    this.description = description;
  }
}

export default validationException;
