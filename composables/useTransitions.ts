/**
 * Composable pour gérer les transitions et animations
 * Utilise les transitions natives Vue 3
 */
export const useTransitions = () => {
  const fadeIn = {
    enterActiveClass: 'transition-opacity duration-300',
    leaveActiveClass: 'transition-opacity duration-200',
    enterFromClass: 'opacity-0',
    enterToClass: 'opacity-100',
    leaveFromClass: 'opacity-100',
    leaveToClass: 'opacity-0',
  };

  const slideUp = {
    enterActiveClass: 'transition-all duration-300',
    leaveActiveClass: 'transition-all duration-200',
    enterFromClass: 'opacity-0 translate-y-4',
    enterToClass: 'opacity-100 translate-y-0',
    leaveFromClass: 'opacity-100 translate-y-0',
    leaveToClass: 'opacity-0 translate-y-4',
  };

  const scale = {
    enterActiveClass: 'transition-all duration-300',
    leaveActiveClass: 'transition-all duration-200',
    enterFromClass: 'opacity-0 scale-95',
    enterToClass: 'opacity-100 scale-100',
    leaveFromClass: 'opacity-100 scale-100',
    leaveToClass: 'opacity-0 scale-95',
  };

  return {
    fadeIn,
    slideUp,
    scale,
  };
};
