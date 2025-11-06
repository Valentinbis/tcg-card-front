import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLoadingStore } from '~/stores/loading';

describe('useLoadingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initialise avec tous les états à false', () => {
    const store = useLoadingStore();
    expect(store.loadingStates).toEqual({
      global: false,
      login: false,
      register: false,
      cards: false,
      collection: false,
    });
  });

  describe('setLoading', () => {
    it('définit un état de chargement à true', () => {
      const store = useLoadingStore();
      store.setLoading('login', true);

      expect(store.loadingStates.login).toBe(true);
    });

    it('définit un état de chargement à false', () => {
      const store = useLoadingStore();
      store.setLoading('login', true);
      store.setLoading('login', false);

      expect(store.loadingStates.login).toBe(false);
    });

    it("ne modifie que l'état spécifié", () => {
      const store = useLoadingStore();
      store.setLoading('login', true);

      expect(store.loadingStates.login).toBe(true);
      expect(store.loadingStates.register).toBe(false);
      expect(store.loadingStates.cards).toBe(false);
    });
  });

  describe('isLoading', () => {
    it("retourne true si l'état est en chargement", () => {
      const store = useLoadingStore();
      store.setLoading('cards', true);

      expect(store.isLoading('cards')).toBe(true);
    });

    it("retourne false si l'état n'est pas en chargement", () => {
      const store = useLoadingStore();

      expect(store.isLoading('cards')).toBe(false);
    });

    it('retourne false pour un état inexistant', () => {
      const store = useLoadingStore();

      expect(store.isLoading('nonexistent')).toBe(false);
    });
  });

  describe('startLoading', () => {
    it("définit l'état à true", () => {
      const store = useLoadingStore();
      store.startLoading('collection');

      expect(store.loadingStates.collection).toBe(true);
    });
  });

  describe('stopLoading', () => {
    it("définit l'état à false", () => {
      const store = useLoadingStore();
      store.startLoading('collection');
      store.stopLoading('collection');

      expect(store.loadingStates.collection).toBe(false);
    });
  });

  describe('isAnyLoading', () => {
    it('retourne true si au moins un état est en chargement', () => {
      const store = useLoadingStore();
      store.setLoading('login', true);

      expect(store.isAnyLoading()).toBe(true);
    });

    it("retourne false si aucun état n'est en chargement", () => {
      const store = useLoadingStore();

      expect(store.isAnyLoading()).toBe(false);
    });

    it('retourne true si plusieurs états sont en chargement', () => {
      const store = useLoadingStore();
      store.setLoading('login', true);
      store.setLoading('cards', true);

      expect(store.isAnyLoading()).toBe(true);
    });
  });

  it('gère plusieurs états simultanément', () => {
    const store = useLoadingStore();

    store.startLoading('login');
    store.startLoading('cards');
    expect(store.isLoading('login')).toBe(true);
    expect(store.isLoading('cards')).toBe(true);
    expect(store.isAnyLoading()).toBe(true);

    store.stopLoading('login');
    expect(store.isLoading('login')).toBe(false);
    expect(store.isLoading('cards')).toBe(true);
    expect(store.isAnyLoading()).toBe(true);

    store.stopLoading('cards');
    expect(store.isLoading('cards')).toBe(false);
    expect(store.isAnyLoading()).toBe(false);
  });
});
