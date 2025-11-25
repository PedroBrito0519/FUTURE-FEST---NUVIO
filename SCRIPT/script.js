// ===== CARREGAMENTO DO SITE =====
window.addEventListener("load", () => {
  setTimeout(() => {
    const splash = document.getElementById("splash");
    splash.style.opacity = 0;

    setTimeout(() => {
      splash.style.display = "none";
      document.getElementById("main-content").style.display = "flex";

      setTimeout(() => {
        window.location.href = "home.html";
      }, 3000);

    }, 1000);
  }, 3000);
});

// ===== ROLAGEM HEADER =====
window.addEventListener("scroll", function () {
  let header = document.querySelector('#header');
  header.classList.toggle('rolagem', window.scrollY > 300);
});

// ===== TELA DE CARREGAMENTO =====
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const pageContent = document.getElementById('page-content');

  setTimeout(() => {
    loadingScreen.style.display = 'none';
    if (pageContent) pageContent.style.display = 'block';
  }, 1500);
}

// ===== COOKIES =====
var msgCookies = document.getElementById('cookies-msg');

function aceito() {
  localStorage.lgpd = 'sim';
  if (msgCookies) msgCookies.classList.remove('mostrar');
}

if (localStorage.lgpd === 'sim') {
  if (msgCookies) msgCookies.classList.remove('mostrar');
} else {
  if (msgCookies) msgCookies.classList.add('mostrar');
}

// ===== ERRO OFFLINE =====
window.addEventListener('offline', function () {
  window.location.href = 'error.html';
});

function reportError() {
  alert('Erro reportado com sucesso!');
}

// ===== LIMITAR LARGURA =====
function limitarLargura() {
  let larguraTela = window.innerWidth;
  let conteudo = document.querySelector('.conteudo');
  if (conteudo && conteudo.offsetWidth > larguraTela) {
    conteudo.style.width = larguraTela + 'px';
  }
}

window.addEventListener('resize', limitarLargura);
window.addEventListener('load', limitarLargura);

// ===== MENU LATERAL =====
function toggleMenu() {
  var menuLateral = document.getElementById('menu-lateral');
  menuLateral.classList.toggle('open');
}

// ===== CARDS 3D =====
VanillaTilt.init(document.querySelectorAll(".card"), {
  max: 25,
  speed: 400,
  glare: true,
  "max-glare": 0.5
});
// ===== TROCA DE TEMA COM MODAL =====
function toggleTheme() {
  const modal = document.getElementById('modal-tema');
  modal.style.display = 'flex';
}

function fecharModalTema() {
  const modal = document.getElementById('modal-tema');
  modal.style.display = 'none';
}

function setTheme(theme) {
  const themeLink = document.getElementById('theme-style');
  const btn = document.querySelector('.theme-toggle-btn button');

  if (theme === 'light') {
    themeLink.setAttribute('href', 'CSS/style.css');
    btn.innerHTML = "🌙";
    document.body.classList.remove('dark-theme', 'acessibilidade');
  } else if (theme === 'dark') {
    themeLink.setAttribute('href', 'CSS/styleEscuro.css');
    btn.innerHTML = "🌞";
    document.body.classList.add('dark-theme');
    document.body.classList.remove('acessibilidade');
  } else if (theme === 'acessibilidade') {
    themeLink.setAttribute('href', 'CSS/styleAcessibilidade.css');
    document.body.classList.add('acessibilidade');
    btn.innerHTML = "♿";
    document.body.classList.remove('dark-theme');
  }

  localStorage.setItem('theme', theme);
  fecharModalTema();
}

// ===== APLICA O TEMA SALVO =====
window.addEventListener('DOMContentLoaded', function () {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const themeLink = document.getElementById('theme-style');
  const btn = document.querySelector('.theme-toggle-btn button');

  if (savedTheme === 'dark') {
    themeLink.setAttribute('href', 'CSS/styleEscuro.css');
    btn.innerHTML = "🌞";
    document.body.classList.add('dark-theme');
  } else if (savedTheme === 'acessibilidade') {
    themeLink.setAttribute('href', 'CSS/styleAcessibilidade.css');
    btn.innerHTML = "♿";
    document.body.classList.add('acessibilidade');
  } else {
    themeLink.setAttribute('href', 'CSS/style.css');
    btn.innerHTML = "🌙";
    document.body.classList.remove('dark-theme', 'acessibilidade');
  }
});

// ===== CARROSSEL SCROLLADO =====
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".sh-slide");
  const indicators = document.querySelectorAll(".sh-ind");
  const counters = document.querySelectorAll(".sh-number");
  const carouselSection = document.querySelector("#sh-carousel");

  let currentIndex = 0;
  let inCarousel = false;
  let isScrolling = false;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("sh-active", i === index);
      indicators[i].classList.toggle("sh-ind-active", i === index);
    });
  }

  showSlide(currentIndex);

  function handleScroll(e) {
    if (!inCarousel || isScrolling) return;
    e.preventDefault();
    isScrolling = true;

    const direction = e.deltaY > 0 ? 1 : -1;

    if (direction > 0) {
      currentIndex = Math.min(currentIndex + direction, slides.length - 1);
    } else {
      if (currentIndex === 0) {
        inCarousel = false;
        document.body.style.overflowY = "auto";
        window.removeEventListener("wheel", handleScroll, { passive: false });
      } else {
        currentIndex = Math.max(currentIndex + direction, 0);
      }
    }

    showSlide(currentIndex);

    setTimeout(() => isScrolling = false, 600);

    if (currentIndex === slides.length - 1 && e.deltaY > 0) {
      inCarousel = false;
      document.body.style.overflowY = "auto";
      window.removeEventListener("wheel", handleScroll, { passive: false });
    }
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        inCarousel = true;
        document.body.style.overflowY = "hidden";
        window.addEventListener("wheel", handleScroll, { passive: false });
      } else {
        inCarousel = false;
        document.body.style.overflowY = "auto";
        window.removeEventListener("wheel", handleScroll, { passive: false });
      }
    });
  }, { threshold: 0.8 });

  observer.observe(carouselSection);

  indicators.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      currentIndex = index;
      showSlide(index);
    });
  });

  function animateCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      const increment = target / 150;

      const update = () => {
        const value = +counter.innerText;
        if (value < target) {
          counter.innerText = Math.ceil(value + increment);
          requestAnimationFrame(update);
        } else {
          counter.innerText = target;
        }
      };
      update();
    });
  }

  const statsSection = document.querySelector("#sh-stats");
  if (statsSection) {
    const observerStats = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) animateCounters();
      });
    }, { threshold: 0.4 });

    observerStats.observe(statsSection);
  }
});

// ===== MODAL DE PLANOS =====
const modalPlanos = document.getElementById("modalPlanos");
const modalCadastro = document.getElementById("modalCadastro");
const fechar = document.querySelector(".fechar");
const fecharCadastro = document.querySelector(".fechar-cadastro");
const tituloPlano = document.getElementById("tituloPlano");
const beneficiosPlano = document.getElementById("beneficiosPlano");
const botoesPlano = document.getElementById("botoesPlano");

const planos = {
  gratis: {
    nome: "Plano Grátis",
    beneficios: ["2 GB de espaço", "Quantidade limitada de listas (Max 10)"],
    botao: `<button id='usarGratis'>Usar modo grátis</button>`
  },
  prata: {
    nome: "Plano Prata",
    beneficios: ["5 GB de espaço", "Quantidade ilimitada de notas", "IA para organizar sua rotina"],
    botao: `
      <button id='comprarPlano'>Comprar plano</button>
      <button id='trocarPlano'>Trocar plano</button>
    `
  },
  dima: {
    nome: "Plano Dima",
    beneficios: ["10 GB de espaço", "Quantidade ilimitada de listas", "IA para organizar sua rotina", "Consultoria personalizada com IA"],
    botao: `
      <button id='comprarPlano'>Comprar plano</button>
      <button id='trocarPlano'>Trocar plano</button>
    `
  }
};

document.querySelectorAll(".btn-plano").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const planoSelecionado = e.target.closest(".plano-card").dataset.plano;
    const plano = planos[planoSelecionado];
    tituloPlano.textContent = plano.nome;
    beneficiosPlano.innerHTML = plano.beneficios.map(b => `<li>✔ ${b}</li>`).join("");
    botoesPlano.innerHTML = plano.botao;

    if (planoSelecionado === "gratis") {
      document.getElementById("usarGratis").onclick = () => {
        alert("Você está usando o modo grátis da Nuvio!");
        modalPlanos.style.display = "none";
      };
    } else {
      document.getElementById("comprarPlano").onclick = () => {
        modalPlanos.style.display = "none";
        modalCadastro.style.display = "flex";
      };
      document.getElementById("trocarPlano").onclick = () => {
        alert("Você pode escolher outro plano.");
        modalPlanos.style.display = "none";
      };
    }

    modalPlanos.style.display = "flex";
  });
});

fechar.onclick = () => modalPlanos.style.display = "none";
fecharCadastro.onclick = () => modalCadastro.style.display = "none";

window.onclick = (e) => {
  if (e.target == modalPlanos) modalPlanos.style.display = "none";
  if (e.target == modalCadastro) modalCadastro.style.display = "none";
};

document.querySelectorAll("#comprarPlano").forEach(btn => {
  btn.addEventListener("click", () => {
    const modal = document.querySelector(".modal-conteudo");
    modal.classList.add("cartao-animando");

    setTimeout(() => {
      modal.style.display = "none";
      modal.classList.remove("cartao-animando");
      document.querySelector(".modal").style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1000);
  });
});
