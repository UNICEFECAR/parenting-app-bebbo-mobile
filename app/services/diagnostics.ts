/** Manual nonfatal reports retain frames and error class, never payload text. */
export function diagnosticError(input: Error | string): Error {
  const type = input instanceof Error && /^(Error|TypeError|RangeError|ReferenceError|SyntaxError|URIError|EvalError)$/.test(input.name) ? input.name : 'Error';
  const error = new Error('Application operation failed');
  error.name = type;
  if (input instanceof Error && input.stack) {
    const frames = input.stack.split('\n').filter(line => /^\s*at\s|^[\w.$<>]+@/.test(line))
      .map(line => line.replace(/https?:\/\/[^\s)]+/g, '[bundle]').replace(/file:\/\/[^\s)]+/g, '[bundle]'));
    if (frames.length) error.stack = `${type}: Application operation failed\n${frames.slice(0, 40).join('\n')}`;
  }
  return error;
}
export function diagnosticBreadcrumb(message: string): string {
  return String(message).replace(/https?:\/\/\S+/g, '[url]')
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]')
    .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi, '[identifier]')
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, '[date]').slice(0, 512);
}
