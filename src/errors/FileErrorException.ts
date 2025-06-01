export default class FileErrorException extends Error {
  constructor(message = 'File error') {
    super(message);
    this.name = 'FileErrorException';
    Object.setPrototypeOf(this, FileErrorException.prototype);
  }
}
