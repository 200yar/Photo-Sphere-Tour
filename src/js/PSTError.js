/**
 * Custom error used in the lib
 * http://stackoverflow.com/a/27724419/1207670
 * @param message (Mixed)
 */
function PSTError(message) {
  this.message = message;

  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, PSTError);
  }
  else {
    this.stack = (new Error()).stack;
  }
}

PSTError.prototype = Object.create(Error.prototype);
PSTError.prototype.name = 'PSTError';
PSTError.prototype.constructor = PSTError;
