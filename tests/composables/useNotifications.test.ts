import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNotifications } from '~/composables/useNotifications';
import { useToastStore } from '~/stores/toast';

describe('useNotifications', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('appelle showSuccess avec les bons paramètres', () => {
    const toastStore = useToastStore();
    const successSpy = vi.spyOn(toastStore, 'success');

    const { showSuccess } = useNotifications();
    showSuccess('Titre', 'Message de succès');

    expect(successSpy).toHaveBeenCalledWith('Titre', 'Message de succès');
  });

  it('appelle showError avec les bons paramètres', () => {
    const toastStore = useToastStore();
    const errorSpy = vi.spyOn(toastStore, 'error');

    const { showError } = useNotifications();
    showError('Erreur', "Message d'erreur");

    expect(errorSpy).toHaveBeenCalledWith('Erreur', "Message d'erreur");
  });

  it('appelle showInfo avec les bons paramètres', () => {
    const toastStore = useToastStore();
    const infoSpy = vi.spyOn(toastStore, 'info');

    const { showInfo } = useNotifications();
    showInfo('Info', "Message d'info");

    expect(infoSpy).toHaveBeenCalledWith('Info', "Message d'info");
  });

  it('appelle showWarn avec les bons paramètres', () => {
    const toastStore = useToastStore();
    const warnSpy = vi.spyOn(toastStore, 'warn');

    const { showWarn } = useNotifications();
    showWarn('Attention', "Message d'avertissement");

    expect(warnSpy).toHaveBeenCalledWith('Attention', "Message d'avertissement");
  });
});
