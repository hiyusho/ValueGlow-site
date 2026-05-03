(function () {
  const params = new URLSearchParams(window.location.search);
  const univKey =
    params.get("univ") ||
    localStorage.getItem("entry_univ") ||
    "default";

  const config =
    UNIVERSITY_CONFIG[univKey] ||
    UNIVERSITY_CONFIG.default;

  localStorage.setItem("entry_univ", univKey);
  document.documentElement.setAttribute("data-univ", univKey);

  document.documentElement.style.setProperty("--main-color", config.mainColor);
  document.documentElement.style.setProperty("--main-dark", config.mainDark);
  document.documentElement.style.setProperty("--main-light", config.mainLight);
  document.documentElement.style.setProperty("--accent-color", config.accentColor);

  const logo = document.getElementById("universityLogo");
  if (logo) {
    logo.src = config.logo;
    logo.alt = config.name + " ロゴ";
  }

  const siteTitle = document.querySelector(".site-title");
  if (siteTitle) {
    siteTitle.textContent = config.name + " パートナー帯同ポータルサイト";
  }

  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    heroTitle.textContent = config.heroTitle;
  }

  const heroText = document.querySelector(".hero-content p");
  if (heroText) {
    heroText.textContent = config.heroText;
  }
})();