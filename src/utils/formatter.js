export const interceptorLoadingElements = (calling) => {
  const elements = document.querySelectorAll('.interceptor-loading');
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      elements[i].style.opacity = '0.5';
      elements[i].style.pointerEvents = 'none';
    } else {
      elements[i].style.opacity = 'initial';
      elements[i].style.pointerEvents = 'initial';
    }
  }
};

export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
