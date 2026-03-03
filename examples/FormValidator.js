/**
 * Form Validator using Microcopy Tokens
 * 
 * A reusable form validator that provides validation messages
 * directly from the microcopy tokens, ensuring consistency
 * across your application.
 */

import { microcopy } from '../build/js/microcopy.js';

export class FormValidator {
  validateRequired(value) {
    if (!value || value.trim() === '') {
      return {
        valid: false,
        message: microcopy.error.validation.required
      };
    }
    return { valid: true };
  }

  validateEmail(value) {
    const requiredCheck = this.validateRequired(value);
    if (!requiredCheck.valid) return requiredCheck;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return {
        valid: false,
        message: microcopy.error.validation.email.invalid
      };
    }
    return { valid: true };
  }

  validatePassword(value) {
    const requiredCheck = this.validateRequired(value);
    if (!requiredCheck.valid) return requiredCheck;

    if (value.length < 8) {
      return {
        valid: false,
        message: microcopy.error.validation.password.tooShort
      };
    }
    return { valid: true };
  }

  validatePasswordMatch(password, confirmPassword) {
    const passwordCheck = this.validatePassword(password);
    if (!passwordCheck.valid) return passwordCheck;

    const confirmCheck = this.validatePassword(confirmPassword);
    if (!confirmCheck.valid) return confirmCheck;

    if (password !== confirmPassword) {
      return {
        valid: false,
        message: microcopy.error.validation.password.mismatch
      };
    }
    return { valid: true };
  }
}

/**
 * Usage example:
 * 
 * const validator = new FormValidator();
 * const result = validator.validateEmail('user@example.com');
 * if (!result.valid) {
 *   console.error(result.message);
 * }
 */
