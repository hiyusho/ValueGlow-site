(function () {
  const read = (key) => localStorage.getItem(key) || '';

  const paramsToCarry = {
    univ: read('entry_univ'),
    utm_source: read('entry_utm_source'),
    utm_medium: read('entry_utm_medium'),
    utm_campaign: read('entry_utm_campaign'),
    utm_content: read('entry_utm_content')
  };

  const targetPages = [
    'index.html',
    'registration.html',
    'log-in.html',
    'dashboard.html',
    'family-support.html'
  ];

  document.querySelectorAll('a[href]').forEach((link) => {
    const rawHref = link.getAttribute('href');

    if (
      !rawHref ||
      rawHref.startsWith('#') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('http')
    ) {
      return;
    }

    const pageName = rawHref.split('?')[0].split('#')[0];

    if (!targetPages.includes(pageName)) {
      return;
    }

    const url = new URL(rawHref, window.location.href);

    Object.entries(paramsToCarry).forEach(([key, value]) => {
      if (value && !url.searchParams.get(key)) {
        url.searchParams.set(key, value);
      }
    });

    link.setAttribute('href', url.pathname.split('/').pop() + url.search + url.hash);
  });
})();