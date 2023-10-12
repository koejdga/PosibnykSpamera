function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/;
  return emailRegex.test(email);
}

module.exports = validateEmail;
