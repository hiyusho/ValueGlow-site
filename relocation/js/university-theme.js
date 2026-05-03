/* university-theme.js
   大学カラー・ロゴ・可読文字色の共通適用
   university-config.js を先に読み込んでください
*/
(function () {
  function getReadableTextColor(bgColor) {
    if (!bgColor) return '#333';

    const color = String(bgColor).replace('#', '').trim();
    if (color.length !== 6) return '#333';

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 150 ? '#222' : '#fff';
  }

  function getUniversityKey() {
    const params = new URLSearchParams(window.location.search);
    const pageDefault =
      document.body?.dataset?.defaultUniv ||
      document.documentElement?.dataset?.defaultUniv ||
      'default';

    return (
      params.get('univ') ||
      localStorage.getItem('entry_univ') ||
      localStorage.getItem('universityKey') ||
      pageDefault
    );
  }

  function applyTheme() {
    const configRoot = window.UNIVERSITY_CONFIG || window.universityConfig;
    if (!configRoot) {
      console.warn('UNIVERSITY_CONFIG が見つかりません。js/university-config.js の読み込みを確認してください。');
      return;
    }

    const univKey = getUniversityKey();
    const config = configRoot[univKey] || configRoot.default;
    if (!config) {
      console.warn('大学設定が見つかりません:', univKey);
      return;
    }

    const root = document.documentElement;

    root.style.setProperty('--main-color', config.mainColor || '#379B63');
    root.style.setProperty('--main-dark', config.mainDark || '#2F7D52');
    root.style.setProperty('--main-light', config.mainLight || '#E8F5EE');
    root.style.setProperty('--accent-color', config.accentColor || config.mainDark || '#1F5C3F');

    root.style.setProperty('--main-text-color', getReadableTextColor(config.mainColor || '#379B63'));
    root.style.setProperty('--main-dark-text-color', getReadableTextColor(config.mainDark || '#2F7D52'));
    root.style.setProperty('--main-light-text-color', getReadableTextColor(config.mainLight || '#E8F5EE'));

    document.querySelectorAll('.site-title').forEach(function (el) {
      if (config.name) {
        el.textContent = config.name + ' パートナー帯同ポータルサイト';
      }
    });

    document.querySelectorAll('.university-logo, .header-logo').forEach(function (img) {
      if (config.logo) {
        img.src = config.logo;
        img.alt = (config.name || '大学') + ' ロゴ';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTheme);
  } else {
    applyTheme();
  }
})();
