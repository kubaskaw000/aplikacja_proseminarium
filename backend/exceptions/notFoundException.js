class notFoundException {
  getCode() {
    return this.code;
  }

  getDescription() {
    return this.description;
  }

  constructor(description) {
    this.code = 404;
    this.description = description;
  }
}

export default notFoundException;
