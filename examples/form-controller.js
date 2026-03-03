/**
 * Vanilla JavaScript Form Handling with Microcopy Tokens
 * 
 * This example shows how to use microcopy tokens in vanilla JavaScript
 * to manage form validation messages and user feedback.
 */

import { microcopy } from '../build/js/microcopy.js';
import { FormValidator } from './FormValidator.js';

class FormController {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.validator = new FormValidator();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Email validation
    const emailInput = this.form.querySelector('#email');
    if (emailInput) {
      emailInput.addEventListener('blur', (e) => this.validateField(e));
      emailInput.addEventListener('input', () => this.clearError());
    }

    // Password validation
    const passwordInput = this.form.querySelector('#password');
    if (passwordInput) {
      passwordInput.addEventListener('blur', (e) => this.validateField(e));
      passwordInput.addEventListener('input', () => this.clearError());
    }

    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateField(event) {
    const input = event.target;
    const type = input.type;

    let result;
    if (type === 'email') {
      result = this.validator.validateEmail(input.value);
    } else if (input.name === 'password') {
      result = this.validator.validatePassword(input.value);
    }

    if (result && !result.valid) {
      this.showError(result.message);
      input.setAttribute('aria-invalid', 'true');
    } else if (result) {
      this.clearError();
      input.setAttribute('aria-invalid', 'false');
    }
  }

  showError(message) {
    let errorElement = this.form.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.setAttribute('role', 'alert');
      this.form.insertBefore(errorElement, this.form.querySelector('button'));
    }
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }

  clearError() {
    const errorElement = this.form.querySelector('.error-message');
    if (errorElement) {
      errorElement.classList.remove('visible');
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const emailInput = this.form.querySelector('#email');
    const passwordInput = this.form.querySelector('#password');

    const emailResult = this.validator.validateEmail(emailInput.value);
    const passwordResult = this.validator.validatePassword(passwordInput.value);

    if (!emailResult.valid) {
      this.showError(emailResult.message);
      return;
    }

    if (!passwordResult.valid) {
      this.showError(passwordResult.message);
      return;
    }

    // Show success message
    this.showSuccess(microcopy.feedback.success.save);

    // Submit form (in a real app)
    // fetch('/api/signup', { ... });
  }

  showSuccess(message) {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.setAttribute('role', 'status');
    successElement.textContent = message;
    this.form.insertBefore(successElement, this.form.querySelector('button'));

    // Auto-remove after 3 seconds
    setTimeout(() => successElement.remove(), 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FormController('.signup-form');
});
