/**
 * Validation d'email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validation de mot de passe
 * Minimum 8 caractères
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Validation de mot de passe fort
 * Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
 */
export const isStrongPassword = (password: string): boolean => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongRegex.test(password);
};

/**
 * Validation de nom (prénom/nom)
 * Au moins 2 caractères, uniquement lettres et espaces
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s-]{2,}$/;
  return nameRegex.test(name.trim());
};

/**
 * Vérifier si deux mots de passe correspondent
 */
export const passwordsMatch = (password: string, confirm: string): boolean => {
  return password === confirm && password.length > 0;
};

/**
 * Composable de validation pour formulaires
 */
export const useValidation = () => {
  const errors = ref<Record<string, string>>({});

  const validateEmail = (email: string, fieldName = 'email'): boolean => {
    if (!email) {
      errors.value[fieldName] = 'L\'email est requis';
      return false;
    }
    if (!isValidEmail(email)) {
      errors.value[fieldName] = 'L\'email n\'est pas valide';
      return false;
    }
    delete errors.value[fieldName];
    return true;
  };

  const validatePassword = (password: string, fieldName = 'password', strong = false): boolean => {
    if (!password) {
      errors.value[fieldName] = 'Le mot de passe est requis';
      return false;
    }
    if (strong && !isStrongPassword(password)) {
      errors.value[fieldName] = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre';
      return false;
    }
    if (!strong && !isValidPassword(password)) {
      errors.value[fieldName] = 'Le mot de passe doit contenir au moins 8 caractères';
      return false;
    }
    delete errors.value[fieldName];
    return true;
  };

  const validateName = (name: string, fieldName: string): boolean => {
    if (!name) {
      errors.value[fieldName] = 'Ce champ est requis';
      return false;
    }
    if (!isValidName(name)) {
      errors.value[fieldName] = 'Le nom doit contenir au moins 2 caractères';
      return false;
    }
    delete errors.value[fieldName];
    return true;
  };

  const validatePasswordMatch = (password: string, confirm: string, fieldName = 'confirmPassword'): boolean => {
    if (!passwordsMatch(password, confirm)) {
      errors.value[fieldName] = 'Les mots de passe ne correspondent pas';
      return false;
    }
    delete errors.value[fieldName];
    return true;
  };

  const clearErrors = () => {
    errors.value = {};
  };

  const clearError = (fieldName: string) => {
    delete errors.value[fieldName];
  };

  return {
    errors,
    validateEmail,
    validatePassword,
    validateName,
    validatePasswordMatch,
    clearErrors,
    clearError,
  };
};
