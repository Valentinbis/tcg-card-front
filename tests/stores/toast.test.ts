import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useToastStore } from '~/stores/toast';

describe('useToastStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initialise avec un tableau vide', () => {
    const store = useToastStore();
    expect(store.toasts).toEqual([]);
  });

  describe('success', () => {
    it('ajoute un toast de succès', () => {
      const store = useToastStore();
      store.success('Succès', 'Message de succès');

      expect(store.toasts.length).toBe(1);
      expect(store.toasts[0].severity).toBe('success');
      expect(store.toasts[0].summary).toBe('Succès');
      expect(store.toasts[0].detail).toBe('Message de succès');
      expect(store.toasts[0].life).toBe(3000);
    });

    it('génère un ID unique pour chaque toast', () => {
      const store = useToastStore();
      store.success('Premier', 'Détail 1');
      store.success('Second', 'Détail 2');

      expect(store.toasts.length).toBe(2);
      expect(store.toasts[0].id).not.toBe(store.toasts[1].id);
    });
  });

  describe('error', () => {
    it("ajoute un toast d'erreur avec life par défaut de 5000ms", () => {
      const store = useToastStore();
      store.error('Erreur', "Message d'erreur");

      expect(store.toasts.length).toBe(1);
      expect(store.toasts[0].severity).toBe('error');
      expect(store.toasts[0].life).toBe(5000);
    });
  });

  describe('info', () => {
    it("ajoute un toast d'info avec life par défaut de 3000ms", () => {
      const store = useToastStore();
      store.info('Info', "Message d'info");

      expect(store.toasts.length).toBe(1);
      expect(store.toasts[0].severity).toBe('info');
      expect(store.toasts[0].life).toBe(3000);
    });
  });

  describe('warn', () => {
    it("ajoute un toast d'avertissement avec life par défaut de 4000ms", () => {
      const store = useToastStore();
      store.warn('Attention', "Message d'avertissement");

      expect(store.toasts.length).toBe(1);
      expect(store.toasts[0].severity).toBe('warn');
      expect(store.toasts[0].life).toBe(4000);
    });
  });

  describe('remove', () => {
    it('supprime un toast par son ID', () => {
      const store = useToastStore();
      store.success('Toast 1');
      store.success('Toast 2');

      const idToRemove = store.toasts[0].id;
      store.remove(idToRemove);

      expect(store.toasts.length).toBe(1);
      expect(store.toasts[0].id).not.toBe(idToRemove);
    });
  });

  describe('clear', () => {
    it('supprime tous les toasts', () => {
      const store = useToastStore();
      store.success('Toast 1');
      store.error('Toast 2');
      store.info('Toast 3');

      expect(store.toasts.length).toBe(3);

      store.clear();

      expect(store.toasts.length).toBe(0);
    });
  });

  describe('auto-remove', () => {
    it('supprime automatiquement un toast après son life', () => {
      const store = useToastStore();
      store.success('Auto-remove', 'Test', 1000);

      expect(store.toasts.length).toBe(1);

      vi.advanceTimersByTime(1000);

      expect(store.toasts.length).toBe(0);
    });

    it('ne supprime pas un toast avant son life', () => {
      const store = useToastStore();
      store.success('Auto-remove', 'Test', 1000);

      vi.advanceTimersByTime(500);

      expect(store.toasts.length).toBe(1);
    });
  });

  describe('show', () => {
    it('permet de créer un toast personnalisé', () => {
      const store = useToastStore();
      store.show({
        severity: 'success',
        summary: 'Personnalisé',
        detail: 'Message personnalisé',
        life: 10000,
      });

      expect(store.toasts.length).toBe(1);
      expect(store.toasts[0].severity).toBe('success');
      expect(store.toasts[0].summary).toBe('Personnalisé');
      expect(store.toasts[0].life).toBe(10000);
    });

    it('utilise un life par défaut de 3000ms si non spécifié', () => {
      const store = useToastStore();
      store.show({
        severity: 'info',
        summary: 'Sans life',
      });

      expect(store.toasts[0].life).toBe(3000);
    });
  });
});
