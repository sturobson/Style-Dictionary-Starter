export interface Microcopy {
  button: {
    primary: {
      label: string;
    };
    secondary: {
      label: string;
    };
    submit: {
      label: string;
    };
    delete: {
      label: string;
      confirm: string;
    };
  };
  error: {
    validation: {
      required: string;
      email: {
        invalid: string;
      };
      password: {
        tooShort: string;
        mismatch: string;
      };
    };
    system: {
      generic: string;
      network: string;
    };
    state: {
      saveSuccess: string;
      loading: string;
      empty: string;
    };
  };
  form: {
    input: {
      email: {
        label: string;
        placeholder: string;
        hint: string;
      };
      password: {
        label: string;
        placeholder: string;
        hint: string;
      };
    };
  };
}

export const microcopy: Microcopy;