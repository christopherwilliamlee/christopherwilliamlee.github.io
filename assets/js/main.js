// ===================== Tema (claro/escuro/sistema) =====================
(() => {
  const btn = document.getElementById('themeBtn');
  if (!btn) return;

  const root = document.documentElement;
  const KEY = 'cwlee-theme';
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)');

  const iconFor = t => (t === 'light' ? '🌞' : t === 'dark' ? '🌚' : '🖥️');

  function getSaved() {
    try { return localStorage.getItem(KEY) || 'system'; }
    catch { return 'system'; }
  }
  function setSaved(t) {
    try { localStorage.setItem(KEY, t); } catch {}
  }

  function applyTheme(theme) {
    if (theme === 'system') {
      root.removeAttribute('data-theme'); // CSS decide via prefers-color-scheme
    } else {
      root.setAttribute('data-theme', theme);
    }
    btn.textContent = iconFor(theme);
    btn.setAttribute('aria-label', `Tema: ${theme}`);
    btn.title = `Tema: ${theme}`;
    btn.setAttribute('data-theme', theme);
  }

  // init
  applyTheme(getSaved());

  // reagir a mudanças do SO quando em "system"
  const onSystemChange = () => { if (getSaved() === 'system') applyTheme('system'); };
  if (mq) {
    // compat: Safari/Firefox antigos
    mq.addEventListener ? mq.addEventListener('change', onSystemChange)
                        : mq.addListener?.(onSystemChange);
  }

  // rotação light -> dark -> system
  const nextTheme = c => (c === 'light' ? 'dark' : c === 'dark' ? 'system' : 'light');

  btn.addEventListener('click', () => {
    const current = getSaved();
    const next = nextTheme(current);
    setSaved(next);
    applyTheme(next);
  });
})();


// ===================== Carousel “Envolvidos” (dados globais) =====================
(() => {
  // expõe só se ainda não existir (evita sobrescrever em hot reload)
  if (!window.__ENVOLVIDOS) {
    window.__ENVOLVIDOS = [
      { title: 'MedEpiGen', tag: 'Atual', link: 'https://medepigen.ufpr.br/', img: '/assets/img/projetos_envolvidos/medepigen.png' },
      { title: 'Mennogen',  tag: 'Atual', link: 'https://medepigen.ufpr.br/mennogen/', img: '/assets/img/projetos_envolvidos/mennogen.png' },
      { title: 'Genomas PR', tag: 'Atual', link: 'https://ipec.org.br/genomas-parana/', img: '/assets/img/projetos_envolvidos/genomas_parana.png' },
      { title: 'Genomas SUS', tag: 'Atual', link: 'https://www.gov.br/saude/pt-br/assuntos/noticias/2024/julho/no-para-nisia-participa-da-inauguracao-de-centro-ancora-da-amazonia-do-projeto-genomas-sus', img: '/assets/img/projetos_envolvidos/genomas_sus.png' },
      { title: 'S.M.I.L', tag: 'Anterior', link: 'https://portal.unila.edu.br/noticias/em-missal-pesquisadores-apresentam-primeiros-dados-coletados-em-pesquisa-sobre-cancer', img: '/assets/img/projetos_envolvidos/unila.jpg' },
      { title: 'Micropoluentes e biodiversidade', tag: 'Anterior', link: 'https://documentos.unila.edu.br/sites/default/files/plano_de_trabalho_assinado_micropoluentes_ii.pdf', img: '/assets/img/projetos_envolvidos/itaipu.png' }
    ];
  }
})();


// ===================== Utilitários =====================
/**
 * Divide um array em páginas de tamanho `size`.
 * @template T
 * @param {T[]} arr
 * @param {number} size
 * @returns {T[][]}
 */
function paginar(arr = [], size = 4) {
  const n = Math.max(1, (Number(size) | 0) || 1);
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out.length ? out : [[]];
}

/**
 * Gera um avatar (dataURL) com iniciais em gradiente baseado nas CSS vars.
 * @param {string} title
 * @returns {string} dataURL
 */
function gerarAvatar(title = '?') {
  const words = String(title).trim().split(/\s+/).filter(Boolean);
  let initials = words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  // normaliza/remover acentos (melhor render em canvas)
  initials = initials.normalize('NFD').replace(/\p{Diacritic}/gu, '') || '??';

  const W = 300, H = 300;
  const cnv = document.createElement('canvas');
  cnv.width = W; cnv.height = H;
  const ctx = cnv.getContext('2d');
  if (!ctx) return '';

  const css = getComputedStyle(document.documentElement);
  const getVar = (k, fb) => (css.getPropertyValue(k).trim() || fb);

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, getVar('--accent',  '#0ea5e9'));
  grad.addColorStop(1, getVar('--accent-2','#38bdf8'));

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 120px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, W / 2, H / 2 + 10);

  return cnv.toDataURL('image/png');
}

/**
 * Cria um item do carrossel circular.
 * @param {{title?:string,tag?:string,link?:string,img?:string}} obj
 */
function criarItem({ title, tag, link, img }) {
  const wrap = document.createElement('div');
  wrap.className = 'circle-item';

  const a = document.createElement('a');
  a.className = 'circle-link';
  a.href = link || '#';
  a.setAttribute('aria-label', title || 'Projeto');

  // Nova aba apenas para http/https absolutos
  if (link && /^https?:\/\//i.test(link)) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }

  const im = document.createElement('img');
  im.className = 'circle-thumb';
  im.alt = title || 'Projeto';
  im.loading = 'lazy';
  im.decoding = 'async';
  im.src = img || gerarAvatar(title);

  const caption = document.createElement('div');
  caption.className = 'circle-caption';
  caption.textContent = title || '—';

  if (tag) {
    const badge = document.createElement('span');
    badge.className = 'circle-tag';
    badge.textContent = tag;
    a.appendChild(badge);
  }

  a.append(im, caption);
  wrap.appendChild(a);
  return wrap;
}

/**
 * Renderiza uma página no container do carrossel.
 * @param {HTMLElement|null} container
 * @param {any[]} pagina
 */
function renderPagina(container, pagina) {
  if (!container) return;
  const page = Array.isArray(pagina) ? pagina : [];
  container.innerHTML = '';

  if (!page.length) {
    const msg = document.createElement('div');
    msg.style.opacity = '0.7';
    msg.textContent = 'Nenhum projeto encontrado.';
    container.appendChild(msg);
    return;
  }

  const frag = document.createDocumentFragment();
  for (const p of page) frag.appendChild(criarItem(p));
  container.appendChild(frag);
}


// =====================================================
// Init único
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
// Carrossel “Envolvidos” — 4 itens por página, com fallback de dados do JS
    (function initEnvolvidosCarousel() {
    const section = document.getElementById('envolvidos');
    if (!section) return;

    const container = section.querySelector('#circleCarousel, .circle-carousel');
    const prevBtn = section.querySelector('#envolvidosPrev, #prevPg, #circlePrev');
    const nextBtn = section.querySelector('#envolvidosNext, #nextPg, #circleNext');
    if (!container || !prevBtn || !nextBtn) return;

    // Helper para montar item a partir de objeto (quando usar window.__ENVOLVIDOS)
    const criarItem = ({ title, tag, link, img, alt }) => {
        const item = document.createElement('div');
        item.className = 'circle-item';

        const a = document.createElement('a');
        a.className = 'circle-link';
        a.href = link || '#';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', title || 'Projeto');

        if (tag) {
        const badge = document.createElement('span');
        badge.className = 'circle-tag';
        badge.textContent = tag;
        a.appendChild(badge);
        }

        const image = document.createElement('img');
        image.className = 'circle-thumb';
        image.src = img || '';
        image.alt = alt || title || 'Projeto';
        image.width = 140;
        image.height = 140;
        image.loading = 'lazy';
        image.decoding = 'async';
        a.appendChild(image);

        const cap = document.createElement('div');
        cap.className = 'circle-caption';
        cap.textContent = title || '';
        a.appendChild(cap);

        item.appendChild(a);
        return item;
    };

    // Coleta itens do HTML, ou monta a partir do window.__ENVOLVIDOS
    let allItems = Array.from(container.querySelectorAll('.circle-item'));
    if (!allItems.length && Array.isArray(window.__ENVOLVIDOS)) {
        const frag = document.createDocumentFragment();
        window.__ENVOLVIDOS.forEach(obj => frag.appendChild(criarItem(obj)));
        container.appendChild(frag);
        allItems = Array.from(container.querySelectorAll('.circle-item'));
    }
    if (!allItems.length) {
        container.textContent = 'Nenhum projeto encontrado.';
        return;
    }

    // Classe utilitária para esconder (garanta no CSS .hidden { display:none!important })
    const hideAll = () => allItems.forEach(el => el.classList.add('hidden'));
    const showRange = (start, end) => {
        for (let i = start; i < end && i < allItems.length; i++) {
        allItems[i].classList.remove('hidden');
        }
    };

    const itensPorPagina = () => {
        // tenta estimar responsivamente; se falhar, usa 4
        const first = allItems[0];
        const cw = container.clientWidth || 0;
        const iw = first ? first.offsetWidth : 0;
        const gap = parseFloat(getComputedStyle(container).gap || '0');
        if (cw && iw) {
        const n = Math.max(1, Math.floor((cw + gap) / (iw + gap)));
        return Math.min(4, Math.max(1, n)); // limite superior: 4 por página
        }
        return 4;
    };

    let page = 0;
    const getTotalPages = () => Math.max(1, Math.ceil(allItems.length / itensPorPagina()));

    const render = () => {
        const per = itensPorPagina();
        const total = getTotalPages();
        page = (page + total) % total; // normaliza
        const start = page * per;
        const end = start + per;
        hideAll();
        showRange(start, end);
        container.setAttribute('aria-label', `Página ${page + 1} de ${total}`);
    };

    prevBtn.addEventListener('click', () => { page--; render(); });
    nextBtn.addEventListener('click', () => { page++; render(); });

    // Auto-rotação com pausa no hover
    let timer = null;
    const start = () => {
        stop();
        timer = setInterval(() => { page++; render(); }, 6000);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);

    // Recalcula em resize para manter 4 por página quando couber
    window.addEventListener('resize', render, { passive: true });

    // Primeira renderização
    render();
    start();
    })();


    // Carrosséis horizontais (Publicações / Eventos) — escopo por wrap
    (function initScrollCarousels() {
    const WRAPS = document.querySelectorAll('.carousel-wrap');

    WRAPS.forEach(wrap => {
        // funciona para qualquer wrap que tenha .pub-carousel dentro
        const carousel = wrap.querySelector('.pub-carousel');
        if (!carousel) return;

        // procura botões apenas dentro do mesmo wrap
        const prev = wrap.querySelector('#pubPrev, #eventPrev');
        const next = wrap.querySelector('#pubNext, #eventNext');

        // se este wrap não for o de Publicações nem o de Eventos, ignore
        if (!prev || !next) return;

        const getGap = () => {
        const cs = getComputedStyle(carousel);
        // compatível com gap/column-gap dependendo do layout
        const g = parseFloat(cs.gap || cs.columnGap || '0');
        return Number.isFinite(g) ? g : 0;
        };

        const getCardWidth = () => {
        const card = carousel.querySelector('.card');
        if (!card) return 320;
        return card.offsetWidth + getGap();
        };

        prev.addEventListener('click', () => {
        carousel.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });
        next.addEventListener('click', () => {
        carousel.scrollBy({ left:  getCardWidth(), behavior: 'smooth' });
        });
    });
    })();



  // -----------------------------------------------
  // Botão "Voltar ao topo"
  // -----------------------------------------------
  (function initBackToTop() {
    const btnTop = document.getElementById('btn-top');
    if (!btnTop) return;

    const TOGGLE_Y = 120;
    const toggleBtn = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      btnTop.classList.toggle('show', y > TOGGLE_Y);
    };

    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleBtn, { passive: true });
    window.addEventListener('load', toggleBtn);
  })();
});


// ===================== GUIAS: init único =====================
document.addEventListener('DOMContentLoaded', () => {
  // --- Ano no rodapé ---
  (function initYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  })();

  // --- Wrap <pre> com botão copiar (idempotente) ---
  (function initCopyForPre() {
    const pres = document.querySelectorAll('pre');
    pres.forEach(pre => {
      // pula se já estiver dentro do wrapper
      if (pre.parentElement?.classList.contains('codeblok')) return;

      const wrap = document.createElement('div');
      wrap.className = 'codeblok';
      pre.parentNode?.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      // botão copiar
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.innerHTML = '⧉ Copiar';
      btn.setAttribute('aria-label', 'Copiar código');
      wrap.appendChild(btn);

      // badge “copiado”
      const badge = document.createElement('span');
      badge.className = 'copied-badge';
      badge.textContent = '✔ Copiado!';
      badge.setAttribute('aria-live', 'polite');
      wrap.appendChild(badge);

      // ação de copiar
      btn.addEventListener('click', async () => {
        const text = pre.textContent || '';
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            // fallback discreto
            const ta = Object.assign(document.createElement('textarea'), {
              value: text, style: 'position:fixed;opacity:0;'
            });
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
          }
          badge.classList.add('show');
          setTimeout(() => badge.classList.remove('show'), 1200);
        } catch (e) {
          console.error('Erro ao copiar', e);
        }
      });
    });
  })();

  // --- Copiar inline em .cmd-line ---
  (function initCopyInline() {
    const icon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/><rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/></svg>';

    document.querySelectorAll('.cmd-line').forEach(line => {
      const cmdEl = line.querySelector('.cmd');
      if (!cmdEl) return;

      // guarda o texto original uma única vez
      if (!cmdEl.dataset.cmd) cmdEl.dataset.cmd = (cmdEl.textContent || '').trim();

      // botão copiar (cria se não existir)
      let btn = cmdEl.querySelector('.copy-btn-inline');
      if (!btn) {
        btn = document.createElement('button');
        btn.className = 'copy-btn-inline';
        btn.type = 'button';
        btn.title = 'Copiar';
        btn.setAttribute('aria-label', 'Copiar comando');
        btn.innerHTML = icon;
        cmdEl.appendChild(btn);
      }

      // badge (cria se não existir)
      let badge = line.querySelector('.copied-inline');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'copied-inline';
        badge.setAttribute('role', 'status');
        badge.setAttribute('aria-live', 'polite');
        badge.textContent = '✔ Copiado!';
        line.appendChild(badge);
      }

      // evita múltiplos listeners
      if (!btn.dataset.bound) {
        btn.dataset.bound = '1';
        btn.addEventListener('click', async () => {
          const text = cmdEl.dataset.cmd || (cmdEl.textContent || '').trim();
          try {
            if (navigator.clipboard?.writeText) {
              await navigator.clipboard.writeText(text);
            } else {
              const ta = Object.assign(document.createElement('textarea'), {
                value: text, style: 'position:fixed;opacity:0;'
              });
              document.body.appendChild(ta);
              ta.select();
              document.execCommand('copy');
              ta.remove();
            }
            badge.classList.add('show');
            const prev = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '✔';
            setTimeout(() => {
              badge.classList.remove('show');
              btn.disabled = false;
              btn.innerHTML = prev;
            }, 1200);
          } catch (e) {
            console.error('Erro ao copiar', e);
            btn.title = 'Não foi possível copiar';
          }
        });
      }
    });
  })();

  // --- Sidebar <details> persistente ---
  (function initSideGroups() {
    const groups = document.querySelectorAll('.sidebar details.side-group');
    if (!groups.length) return;

    const LS = {
      get: k => { try { return localStorage.getItem(k); } catch { return null; } },
      set: (k, v) => { try { localStorage.setItem(k, v); } catch {} }
    };

    groups.forEach(d => {
      const label = (d.querySelector('summary')?.textContent || '').trim();
      const key = 'sg:' + label;
      const saved = LS.get(key);
      if (saved === 'open') d.open = true;
      if (saved === 'closed') d.open = false;

      d.addEventListener('toggle', () => LS.set(key, d.open ? 'open' : 'closed'));
    });

    // garante grupo aberto para item ativo
    document.querySelector('.sidebar .side-item.active')
      ?.closest('details.side-group')
      ?.setAttribute('open', '');
  })();
});

document.addEventListener('DOMContentLoaded', () => {
  // ---- Carrosséis horizontais (Publicações / Eventos)
  (function initScrollCarousels() {
    document.querySelectorAll('.carousel-wrap').forEach(wrap => {
      const carousel = wrap.querySelector('.pub-carousel');
      if (!carousel) return;

      // Botões dentro do mesmo wrap (evita conflito entre seções)
      const prev = wrap.querySelector('#pubPrev, #eventPrev');
      const next = wrap.querySelector('#pubNext, #eventNext');
      if (!prev || !next) return;

      const getGap = () => {
        const cs = getComputedStyle(carousel);
        return parseFloat(cs.gap || cs.columnGap || '0') || 0;
      };
      const getCardWidth = () => {
        const card = carousel.querySelector('.card');
        return card ? (card.offsetWidth + getGap()) : 320;
      };

      prev.addEventListener('click', () => {
        carousel.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
      });
      next.addEventListener('click', () => {
        carousel.scrollBy({ left:  getCardWidth(), behavior: 'smooth' });
      });
    });
  })();

  // ---- Carrossel “Envolvidos” (4 por página, com autoplay pausável)
  (function initEnvolvidosCarousel() {
    const section = document.getElementById('envolvidos');
    if (!section) return;

    const container = section.querySelector('#circleCarousel, .circle-carousel');
    const prevBtn = section.querySelector('#envolvidosPrev, #prevPg, #circlePrev');
    const nextBtn = section.querySelector('#envolvidosNext, #nextPg, #circleNext');
    if (!container || !prevBtn || !nextBtn) return;

    let allItems = Array.from(container.querySelectorAll('.circle-item'));
    if (!allItems.length && Array.isArray(window.__ENVOLVIDOS)) {
      // Fallback: monta itens via window.__ENVOLVIDOS (se você optar por JS dinâmico)
      const frag = document.createDocumentFragment();
      window.__ENVOLVIDOS.forEach(({ title, tag, link, img, alt }) => {
        const item = document.createElement('div');
        item.className = 'circle-item';

        const a = document.createElement('a');
        a.className = 'circle-link';
        a.href = link || '#';
        a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', title || 'Projeto');

        if (tag) {
          const badge = document.createElement('span');
          badge.className = 'circle-tag'; badge.textContent = tag;
          a.appendChild(badge);
        }

        const image = document.createElement('img');
        image.className = 'circle-thumb';
        image.src = img || '';
        image.alt = alt || title || 'Projeto';
        image.width = 140; image.height = 140;
        image.loading = 'lazy'; image.decoding = 'async';
        a.appendChild(image);

        const cap = document.createElement('div');
        cap.className = 'circle-caption'; cap.textContent = title || '';
        a.appendChild(cap);

        item.appendChild(a);
        frag.appendChild(item);
      });
      container.appendChild(frag);
      allItems = Array.from(container.querySelectorAll('.circle-item'));
    }
    if (!allItems.length) { container.textContent = 'Nenhum projeto encontrado.'; return; }

    const hideAll = () => allItems.forEach(el => el.classList.add('hidden'));
    const showRange = (start, end) => {
      for (let i = start; i < end && i < allItems.length; i++) {
        allItems[i].classList.remove('hidden');
      }
    };

    const itensPorPagina = () => {
      // Calcula responsivo e limita a 4
      const first = allItems[0];
      const cw = container.clientWidth || 0;
      const iw = first ? first.offsetWidth : 0;
      const gap = parseFloat(getComputedStyle(container).gap || '0') || 0;
      if (cw && iw) {
        const n = Math.max(1, Math.floor((cw + gap) / (iw + gap)));
        return Math.min(4, Math.max(1, n));
      }
      return 4;
    };

    let page = 0;
    const totalPages = () => Math.max(1, Math.ceil(allItems.length / itensPorPagina()));
    const render = () => {
      const per = itensPorPagina();
      const tot = totalPages();
      page = (page + tot) % tot;
      const start = page * per, end = start + per;
      hideAll(); showRange(start, end);
      container.setAttribute('aria-label', `Página ${page + 1} de ${tot}`);
    };

    prevBtn.addEventListener('click', () => { page--; render(); });
    nextBtn.addEventListener('click', () => { page++; render(); });

    // Autoplay com pausa no hover
    let timer = null;
    const start = () => { stop(); timer = setInterval(() => { page++; render(); }, 6000); };
    const stop  = () => { if (timer) { clearInterval(timer); timer = null; } };
    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);

    window.addEventListener('resize', render, { passive: true });
    render(); start();
  })();
});

document.addEventListener("DOMContentLoaded", () => {
  async function carregarMedium() {
    const feed = "https://medium.com/feed/@krakenomics";
    const url = "https://api.rss2json.com/v1/api.json?rss_url=" + feed;

    try {
      const resposta = await fetch(url);
      const dados = await resposta.json();

      const container = document.getElementById("pubCarousel");
      if (!container) return;

      container.innerHTML = "";

      dados.items.slice(0, 6).forEach(item => {
        let imgSrc = item.thumbnail;
        if (!imgSrc || imgSrc.includes("medium.com/_/stat")) {
          const match = item.content.match(/<img.*?src="(.*?)"/);
          if (match) {
            imgSrc = match[1];
          } else {
            imgSrc = "/assets/img/placeholder.png";
          }
        }

        const artigo = document.createElement("article");
        artigo.classList.add("card");

        artigo.innerHTML = `
          <a href="${item.link}" target="_blank" rel="noopener noreferrer">
            <img src="${imgSrc}" alt="${item.title}" class="thumb" loading="lazy">
          </a>
          <h3>${item.title}</h3>
          <p>${item.description.replace(/<[^>]+>/g, "").substring(0, 140)}...</p>
        `;


        container.appendChild(artigo);
      });
    } catch (erro) {
      console.error("Erro ao carregar Medium:", erro);
    }
  }

  carregarMedium();
});

const swiper = new Swiper('.swiper', {
  slidesPerView: 3,
  spaceBetween: 16,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    800: { slidesPerView: 3 },
    0: { slidesPerView: 1 }
  }
});

// cria os slides dentro do wrapper
dados.items.slice(0, 6).forEach(item => {
  const slide = document.createElement("div");
  slide.classList.add("swiper-slide");

  slide.innerHTML = `
    <a href="${item.link}" target="_blank" rel="noopener noreferrer">
      <img src="${imgSrc}" alt="${titulo}" class="thumb" loading="lazy">
    </a>
    <h3>${titulo}</h3>
    <p>${resumo}</p>
    <div class="meta">
      <span>Medium</span>
      <a href="${item.link}" target="_blank" rel="noopener noreferrer">Ler</a>
    </div>
  `;

  container.appendChild(slide);
});