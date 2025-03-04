export class CustomeError extends Error {
  statusCode = 400;
  status: false;
  data: null;
  constructor(message: string) {
    super();
    this.message = message;
  }
}
