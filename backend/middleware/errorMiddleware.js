const handleErrors = (err) => {
  let errors = { name: "", email: "", password: "", avatar: "" };

  // Incorrect email
  if (err.message === "Incorrect email") {
    errors.email = "Email not registered";
  }

  // Incorrect password
  if (err.message === "Incorrect password") {
    errors.password = "Incorrect password";
  }

  // Email already exists error
  if (err.code === 11000) {
    errors.email = "Email already exists";
    return errors;
  }

  // Validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports = handleErrors;
