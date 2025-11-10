/**
 * Composable pour animer les éléments au scroll
 * Utilise IntersectionObserver pour détecter quand un élément entre dans le viewport
 */
export const useScrollAnimation = () => {
  const animatedElements = ref<Set<Element>>(new Set());

  const observeElement = (element: Element, animationClass = 'fade-in-up') => {
    if (!element || animatedElements.value.has(element)) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass);
            animatedElements.value.add(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(element);
  };

  const reset = () => {
    animatedElements.value.clear();
  };

  return {
    observeElement,
    reset,
  };
};
