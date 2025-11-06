import { describe, it, expect, beforeEach } from 'vitest';
import {
  isValidEmail,
  isValidPassword,
  isStrongPassword,
  isValidName,
  passwordsMatch,
  useValidation,
} from '~/composables/useValidation';

describe('useValidation - Fonctions utilitaires', () => {
  describe('isValidEmail', () => {
    it('valide un email correct', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('rejette un email invalide', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('valide un mot de passe avec au moins 8 caractères', () => {
      expect(isValidPassword('12345678')).toBe(true);
      expect(isValidPassword('password')).toBe(true);
    });

    it('rejette un mot de passe trop court', () => {
      expect(isValidPassword('1234567')).toBe(false);
      expect(isValidPassword('pass')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('valide un mot de passe fort', () => {
      expect(isStrongPassword('Password1')).toBe(true);
      expect(isStrongPassword('Secure123')).toBe(true);
      expect(isStrongPassword('MyP@ssw0rd')).toBe(true);
    });

    it('rejette un mot de passe faible', () => {
      expect(isStrongPassword('password')).toBe(false); // pas de majuscule ni chiffre
      expect(isStrongPassword('PASSWORD1')).toBe(false); // pas de minuscule
      expect(isStrongPassword('Password')).toBe(false); // pas de chiffre
      expect(isStrongPassword('pass1')).toBe(false); // trop court
    });
  });

  describe('isValidName', () => {
    it('valide un nom correct', () => {
      expect(isValidName('John')).toBe(true);
      expect(isValidName('Jean-Pierre')).toBe(true);
      expect(isValidName('Marie Claire')).toBe(true);
      expect(isValidName('François')).toBe(true);
    });

    it('rejette un nom invalide', () => {
      expect(isValidName('J')).toBe(false); // trop court
      expect(isValidName('123')).toBe(false); // chiffres
      expect(isValidName('')).toBe(false); // vide
    });
  });

  describe('passwordsMatch', () => {
    it('retourne true si les mots de passe correspondent', () => {
      expect(passwordsMatch('password123', 'password123')).toBe(true);
    });

    it('retourne false si les mots de passe ne correspondent pas', () => {
      expect(passwordsMatch('password123', 'different')).toBe(false);
    });

    it('retourne false si un des mots de passe est vide', () => {
      expect(passwordsMatch('', '')).toBe(false);
      expect(passwordsMatch('password', '')).toBe(false);
    });
  });
});

describe('useValidation - Composable', () => {
  let validation: ReturnType<typeof useValidation>;

  beforeEach(() => {
    validation = useValidation();
  });

  describe('validateEmail', () => {
    it('ajoute une erreur si email vide', () => {
      const result = validation.validateEmail('');
      expect(result).toBe(false);
      expect(validation.errors.value.email).toBe("L'email est requis");
    });

    it('ajoute une erreur si email invalide', () => {
      const result = validation.validateEmail('invalid-email');
      expect(result).toBe(false);
      expect(validation.errors.value.email).toBe("L'email n'est pas valide");
    });

    it("enlève l'erreur si email valide", () => {
      validation.errors.value.email = 'Erreur précédente';
      const result = validation.validateEmail('test@example.com');
      expect(result).toBe(true);
      expect(validation.errors.value.email).toBeUndefined();
    });

    it('permet de personnaliser le nom du champ', () => {
      validation.validateEmail('', 'customField');
      expect(validation.errors.value.customField).toBe("L'email est requis");
    });
  });

  describe('validatePassword', () => {
    it('ajoute une erreur si mot de passe vide', () => {
      const result = validation.validatePassword('');
      expect(result).toBe(false);
      expect(validation.errors.value.password).toBe('Le mot de passe est requis');
    });

    it('ajoute une erreur si mot de passe faible en mode strict', () => {
      const result = validation.validatePassword('password', 'password', true);
      expect(result).toBe(false);
      expect(validation.errors.value.password).toContain('8 caractères');
    });

    it('valide un mot de passe fort en mode strict', () => {
      validation.errors.value.password = 'Erreur précédente';
      const result = validation.validatePassword('Password1', 'password', true);
      expect(result).toBe(true);
      expect(validation.errors.value.password).toBeUndefined();
    });

    it('valide un mot de passe simple en mode non-strict', () => {
      const result = validation.validatePassword('12345678', 'password', false);
      expect(result).toBe(true);
      expect(validation.errors.value.password).toBeUndefined();
    });
  });

  describe('validateName', () => {
    it('ajoute une erreur si nom vide', () => {
      const result = validation.validateName('', 'firstName');
      expect(result).toBe(false);
      expect(validation.errors.value.firstName).toBe('Ce champ est requis');
    });

    it('ajoute une erreur si nom invalide', () => {
      const result = validation.validateName('J', 'firstName');
      expect(result).toBe(false);
      expect(validation.errors.value.firstName).toBe('Le nom doit contenir au moins 2 caractères');
    });

    it('valide un nom correct', () => {
      const result = validation.validateName('John', 'firstName');
      expect(result).toBe(true);
      expect(validation.errors.value.firstName).toBeUndefined();
    });
  });

  describe('validatePasswordMatch', () => {
    it('ajoute une erreur si les mots de passe ne correspondent pas', () => {
      const result = validation.validatePasswordMatch('password1', 'password2');
      expect(result).toBe(false);
      expect(validation.errors.value.confirmPassword).toBe(
        'Les mots de passe ne correspondent pas'
      );
    });

    it("enlève l'erreur si les mots de passe correspondent", () => {
      validation.errors.value.confirmPassword = 'Erreur précédente';
      const result = validation.validatePasswordMatch('password', 'password');
      expect(result).toBe(true);
      expect(validation.errors.value.confirmPassword).toBeUndefined();
    });
  });

  describe('clearErrors', () => {
    it('efface toutes les erreurs', () => {
      validation.errors.value = {
        email: 'Erreur email',
        password: 'Erreur password',
        name: 'Erreur name',
      };
      validation.clearErrors();
      expect(validation.errors.value).toEqual({});
    });
  });

  describe('clearError', () => {
    it('efface une erreur spécifique', () => {
      validation.errors.value = {
        email: 'Erreur email',
        password: 'Erreur password',
      };
      validation.clearError('email');
      expect(validation.errors.value.email).toBeUndefined();
      expect(validation.errors.value.password).toBe('Erreur password');
    });
  });
});
