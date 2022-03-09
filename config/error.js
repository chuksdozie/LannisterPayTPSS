class APIError extends Error {
  status;
  errors;

  constructor(input) {
    super(input.message);
    this.name = input.name || "APIError";
    this.status = input.status;
    this.errors = input.errors;
    Error.captureStackTrace(this, APIError);
  }
}

module.exports = {
  APIError,
};
