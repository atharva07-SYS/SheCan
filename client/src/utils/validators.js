/**
 * Validates an email address format.
 * @param {string} email
 * @returns {string} Error message or empty string
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return '';
};

/**
 * Validates a phone number format (optional field).
 * @param {string} phone
 * @returns {string} Error message or empty string
 */
export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return ''; // Phone is optional
  }
  const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;
  if (!phoneRegex.test(phone.trim())) {
    return 'Please enter a valid phone number';
  }
  return '';
};

/**
 * Validates that a value is not empty.
 * @param {string} value
 * @param {string} fieldName
 * @returns {string} Error message or empty string
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

/**
 * Validates the contact form fields.
 * @param {object} values - { fullName, email, phone, subject, message, category }
 * @returns {object} Errors object with field names as keys
 */
export const validateContactForm = (values) => {
  const errors = {};

  const fullNameError = validateRequired(values.fullName, 'Full name');
  if (fullNameError) errors.fullName = fullNameError;

  const emailRequiredError = validateRequired(values.email, 'Email');
  if (emailRequiredError) {
    errors.email = emailRequiredError;
  } else {
    const emailFormatError = validateEmail(values.email);
    if (emailFormatError) errors.email = emailFormatError;
  }

  const phoneError = validatePhone(values.phone);
  if (phoneError) errors.phone = phoneError;

  const subjectError = validateRequired(values.subject, 'Subject');
  if (subjectError) errors.subject = subjectError;

  const messageError = validateRequired(values.message, 'Message');
  if (messageError) {
    errors.message = messageError;
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }

  const categoryError = validateRequired(values.category, 'Category');
  if (categoryError) errors.category = categoryError;

  return errors;
};

/**
 * Validates the volunteer form fields.
 * @param {object} values - { fullName, email, phone, skills, availability }
 * @returns {object} Errors object with field names as keys
 */
export const validateVolunteerForm = (values) => {
  const errors = {};

  const fullNameError = validateRequired(values.fullName, 'Full name');
  if (fullNameError) errors.fullName = fullNameError;

  const emailRequiredError = validateRequired(values.email, 'Email');
  if (emailRequiredError) {
    errors.email = emailRequiredError;
  } else {
    const emailFormatError = validateEmail(values.email);
    if (emailFormatError) errors.email = emailFormatError;
  }

  const phoneError = validatePhone(values.phone);
  if (phoneError) errors.phone = phoneError;

  const skillsError = validateRequired(values.skills, 'Skills');
  if (skillsError) errors.skills = skillsError;

  const availabilityError = validateRequired(values.availability, 'Availability');
  if (availabilityError) errors.availability = availabilityError;

  return errors;
};
