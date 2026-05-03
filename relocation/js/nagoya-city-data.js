(function () {
  const DATA_URL = 'data/nagoya-city.json';

  const escapeHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const externalIcon = '<i class="fas fa-external-link-alt"></i>';

  async function loadNagoyaCityData() {
    try {
      const response = await fetch(DATA_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error('data load failed');
      const data = await response.json();
      renderPage(data);
    } catch (error) {
      console.error('名古屋市データ読み込みエラー:', error);
      const updated = document.getElementById('lastUpdated');
      if (updated) updated.textContent = '情報を読み込めませんでした';
    }
  }

  function renderPage(data) {
    setText('heroTitle', data.hero?.title);
    setText('heroSubtitle', data.hero?.subtitle);
    setText('lastUpdated', `情報更新日：${data.lastUpdated || '未設定'}`);
    setText('dataPolicyTitle', data.dataPolicy?.title);
    setText('dataPolicyBody', data.dataPolicy?.body);

    renderBasicInfo(data.basicInfo || []);
    renderAttractions(data.attractions || []);
    renderDistricts(data.districts || [], data.otherDistricts || []);
    renderHousingSteps(data.housingSteps || [], data.resources || []);
    renderFacilities(data.facilities || []);
    renderTestimonials(data.testimonials || []);
    renderFaq(data.faq || []);
    renderLinks(data.links || []);
    renderCta(data.cta || {});
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '';
  }

  function renderBasicInfo(items) {
    const el = document.getElementById('basicInfoGrid');
    if (!el) return;
    el.innerHTML = items.map(item => `
      <div class="info-card">
        <div class="info-icon"><i class="${escapeHtml(item.icon)}"></i></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="info-value">${escapeHtml(item.value)}</p>
        <p class="info-desc">${escapeHtml(item.description)}</p>
      </div>
    `).join('');
  }

  function renderAttractions(items) {
    const el = document.getElementById('attractionsGrid');
    if (!el) return;
    el.innerHTML = items.map(item => `
      <div class="attraction-card">
        <div class="attraction-icon"><i class="${escapeHtml(item.icon)}"></i></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        ${item.points ? `<ul class="access-list">${item.points.map(point => `<li><i class="fas fa-check-circle"></i> ${escapeHtml(point)}</li>`).join('')}</ul>` : ''}
        ${item.sourceNote ? `<p class="source-note">${escapeHtml(item.sourceNote)}</p>` : ''}
        ${item.link ? `<a href="${escapeHtml(item.link.href)}"><i class="fas fa-book-open"></i> ${escapeHtml(item.link.label)}</a>` : ''}
      </div>
    `).join('');
  }

  function renderDistricts(items, otherDistricts) {
    const grid = document.getElementById('districtsGrid');
    if (grid) {
      grid.innerHTML = items.map(item => `
        <div class="district-card ${item.featured ? 'featured' : ''}">
          <div class="district-header">
            <h3>${item.featured ? '<i class="fas fa-star"></i> ' : ''}${escapeHtml(item.name)}</h3>
            ${item.tag ? `<span class="district-tag">${escapeHtml(item.tag)}</span>` : ''}
          </div>
          <div class="district-body">
            <h4>おすすめポイント</h4>
            <ul class="district-points">
              ${(item.points || []).map(point => `<li><i class="fas fa-check"></i> ${escapeHtml(point)}</li>`).join('')}
            </ul>
            <div class="district-info">
              ${(item.info || []).map(info => `
                <div class="info-row">
                  <span class="info-label"><i class="${escapeHtml(info.icon)}"></i> ${escapeHtml(info.label)}</span>
                  <span class="info-value">${escapeHtml(info.value)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('');
    }

    const other = document.getElementById('otherDistrictTags');
    if (other) {
      other.innerHTML = otherDistricts.map(name => `<span class="district-tag-item">${escapeHtml(name)}</span>`).join('');
    }
  }

  function renderHousingSteps(steps, resources) {
    const el = document.getElementById('housingSteps');
    if (el) {
      el.innerHTML = steps.map((step, index) => `
        <div class="step-item">
          <div class="step-number">${index + 1}</div>
          <h3>${escapeHtml(step.title)}</h3>
          <ul>${(step.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        </div>
        ${index < steps.length - 1 ? '<div class="step-arrow"><i class="fas fa-arrow-right"></i></div>' : ''}
      `).join('');
    }

    const links = document.getElementById('resourceLinks');
    if (links) {
      links.innerHTML = resources.map(link => `
        <a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer" class="resource-link">
          ${externalIcon} ${escapeHtml(link.label)}
        </a>
      `).join('');
    }
  }

  function renderFacilities(items) {
    const el = document.getElementById('facilitiesGrid');
    if (!el) return;
    el.innerHTML = items.map(item => `
      <div class="facility-card">
        <h3><i class="${escapeHtml(item.icon)}"></i> ${escapeHtml(item.title)}</h3>
        <ul class="facility-list">${(item.items || []).map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul>
      </div>
    `).join('');
  }

  function renderTestimonials(items) {
    const el = document.getElementById('testimonialsGrid');
    if (!el) return;
    el.innerHTML = items.map(item => `
      <div class="testimonial-card">
        <div class="testimonial-header">
          <div class="testimonial-icon"><i class="fas fa-user-circle"></i></div>
          <div class="testimonial-info">
            <h3>${escapeHtml(item.title)}</h3>
            <p class="testimonial-meta">${escapeHtml(item.meta)}</p>
          </div>
        </div>
        <div class="testimonial-body">
          <p>「${escapeHtml(item.body)}」</p>
          ${item.note ? `<p class="source-note">${escapeHtml(item.note)}</p>` : ''}
        </div>
      </div>
    `).join('');
  }

  function renderFaq(items) {
    const el = document.getElementById('faqContainer');
    if (!el) return;
    el.innerHTML = items.map(item => `
      <div class="faq-item">
        <div class="faq-question">
          <i class="fas fa-question-circle"></i>
          <h3>${escapeHtml(item.question)}</h3>
        </div>
        <div class="faq-answer"><p>${escapeHtml(item.answer)}</p></div>
      </div>
    `).join('');
  }

  function renderLinks(items) {
    const el = document.getElementById('relatedLinks');
    if (!el) return;
    el.innerHTML = items.map(item => `
      <a href="${escapeHtml(item.href)}" target="_blank" rel="noopener noreferrer" class="link-card">
        ${externalIcon}
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </a>
    `).join('');
  }

  function renderCta(cta) {
    setText('ctaTitle', cta.title);
    setText('ctaStatus', cta.status);
    setText('ctaDescription', cta.description);
  }

  document.addEventListener('DOMContentLoaded', loadNagoyaCityData);
})();
