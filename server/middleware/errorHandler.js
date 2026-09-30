export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((item) => item.message);
    return response.status(400).json({ message: messages.join(' ') });
  }

  if (error.name === 'CastError') {
    return response.status(400).json({ message: 'The expense data is invalid.' });
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({ message: 'Request body must contain valid JSON.' });
  }

  console.error(error);
  response.status(500).json({ message: 'Something went wrong. Please try again.' });
}