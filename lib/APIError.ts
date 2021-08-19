export default class APIError extends Error {
  status: number;
  path?: string;

  constructor(message: string, status: number, path?: string) {
    super(message);
    this.status = status;
    this.path = path;
  }
}
