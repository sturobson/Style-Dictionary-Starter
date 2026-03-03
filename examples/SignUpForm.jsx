/**
 * Example React component using microcopy tokens
 * 
 * This demonstrates how to use the generated microcopy tokens
 * in a React sign-up form component.
 */

import { microcopy } from '../build/js/microcopy.js';
import { useState } from 'react';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value) => {
    if (!value) {
      setError(microcopy.error.validation.required);
      return false;
    }
    if (!value.includes('@')) {
      setError(microcopy.error.validation.email.invalid);
      return false;
    }
    setError('');
    return true;
  };

  const validatePassword = (value) => {
    if (!value) {
      setError(microcopy.error.validation.required);
      return false;
    }
    if (value.length < 8) {
      setError(microcopy.error.validation.password.tooShort);
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }
    
    // Submit form
    console.log('Form submitted', { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <div className="form-group">
        <label htmlFor="email">
          {microcopy.form.input.email.label}
        </label>
        <input
          id="email"
          type="email"
          placeholder={microcopy.form.input.email.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => validateEmail(e.target.value)}
          aria-describedby="email-hint"
        />
        <small id="email-hint">
          {microcopy.form.input.email.hint}
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="password">
          {microcopy.form.input.password.label}
        </label>
        <input
          id="password"
          type="password"
          placeholder={microcopy.form.input.password.placeholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => validatePassword(e.target.value)}
          aria-describedby="password-hint"
        />
        <small id="password-hint">
          {microcopy.form.input.password.hint}
        </small>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      
      <button type="submit" className="btn-primary">
        {microcopy.button.submit.label}
      </button>
      <button type="button" className="btn-secondary">
        {microcopy.button.secondary.label}
      </button>
    </form>
  );
}
