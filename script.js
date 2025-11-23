let imoveis = [
  {
    id: 1,
    titulo: "Apartamento 2qts próximo ao metrô",
    tipoNegocio: "aluguel",
    tipoImovel: "apartamento",
    preco: 2800,
    cidade: "São Paulo",
    bairro: "Vila Mariana",
    quartos: 2,
    banheiros: 1,
    vagas: 1,
    destaque: true,
    whatsapp: "11988887777",
    dataCadastro: "2025-11-20",
    fotos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd71",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
    ]
  },
  {
    id: 2,
    titulo: "Casa térrea com quintal amplo",
    tipoNegocio: "venda",
    tipoImovel: "casa",
    preco: 450000,
    cidade: "Belo Horizonte",
    bairro: "Pampulha",
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    destaque: false,
    whatsapp: "31999995555",
    dataCadastro: "2025-11-15",
    fotos: [
      "https://images.unsplash.com/photo-1560185127-6a8c5aaed51b",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
    ]
  },
  {
    id: 3,
    titulo: "Kitnet mobiliada no centro",
    tipoNegocio: "aluguel",
    tipoImovel: "kitnet",
    preco: 1500,
    cidade: "Curitiba",
    bairro: "Centro",
    quartos: 1,
    banheiros: 1,
    vagas: 0,
    destaque: true,
    whatsapp: "41988886666",
    dataCadastro: "2025-11-22",
    fotos: [
      "https://images.unsplash.com/photo-1600607687920-4ce5a178c31a",
      "https://images.unsplash.com/photo-1586105251261-72a756497a12",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427"
    ]
  },
  {
    id: 4,
    titulo: "Sala comercial 40m²",
    tipoNegocio: "aluguel",
    tipoImovel: "sala_comercial",
    preco: 2200,
    cidade: "Rio de Janeiro",
    bairro: "Centro",
    quartos: 0,
    banheiros: 1,
    vagas: 0,
    destaque: false,
    whatsapp: "21977774444",
    dataCadastro: "2025-11-10",
    fotos: [
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36"
    ]
  }
];

// 👉 Carregar imóveis cadastrados pelo painel admin (salvos no localStorage)
try {
  const extrasSalvos = JSON.parse(localStorage.getItem("imoveisExtras")) || [];
  if (extrasSalvos.length > 0) {
    // anúncios do admin aparecem antes dos imóveis fixos
    imoveis = [...extrasSalvos, ...imoveis];
  }
} catch (e) {
  console.error("Erro ao carregar imoveisExtras:", e);
}

// Elementos principais
const listaImoveis = document.getElementById("listaImoveis");
const listaDestaques = document.getElementById("listaDestaques");
const resumoResultados = document.getElementById("resumoResultados");

// Filtros
const buscaLocal = document.getElementById("buscaLocal");
const tipoNegocio = document.getElementById("tipoNegocio");
const tipoImovel = document.getElementById("tipoImovel");
const precoMin = document.getElementById("precoMin");
const precoMax = document.getElementById("precoMax");
const btnFiltrar = document.getElementById("btnFiltrar");

// Modal
const modal = document.getElementById("modalAnuncio");
const backdrop = document.getElementById("modalBackdrop");
const btnAbrir = document.getElementById("btnAbrirAnuncio");
const btnFechar = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");
const form = document.getElementById("formAnuncio");

// Campos do form
const tituloForm = document.getElementById("titulo");
const tipoNegocioForm = document.getElementById("tipoNegocioForm");
const tipoImovelForm = document.getElementById("tipoImovelForm");
const precoForm = document.getElementById("precoForm");
const cidadeForm = document.getElementById("cidadeForm");
const bairroForm = document.getElementById("bairroForm");
const quartosForm = document.getElementById("quartosForm");
const banheirosForm = document.getElementById("banheirosForm");
const vagasForm = document.getElementById("vagasForm");
const descricaoForm = document.getElementById("descricaoForm");
const whatsForm = document.getElementById("whatsForm");
const destaqueForm = document.getElementById("destaqueForm");

// Upload de fotos
const fotosForm = document.getElementById("fotosForm");
const previewFotos = document.getElementById("previewFotos");
const uploadInfo = document.getElementById("uploadInfo");


// ========== FUNÇÕES AUXILIARES ==========
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarWhats(numero) {
  const n = numero.replace(/\D/g, "");
  if (n.length >= 11) {
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  }
  return numero;
}


// ========== FAVORITAR ==========
function favoritar(event, id) {
  event.stopPropagation(); // evita abrir o imóvel

  let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(item => item !== id);
  } else {
    favoritos.push(id);
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));

  aplicarFiltros();
}


// ========== RENDERIZAR IMÓVEIS ==========
function renderizarImoveis(lista, container) {
  container.innerHTML = "";

  if (!lista.length) {
    container.innerHTML =
      '<p style="font-size: 13px; color: #9ca3af;">Nenhum imóvel encontrado com os filtros selecionados.</p>';
    return;
  }

  lista.forEach((imovel) => {
    const card = document.createElement("article");
    card.className = "card-imovel";

    const isVenda = imovel.tipoNegocio === "venda";
    const badgeTexto = isVenda ? "Venda" : "Aluguel";
    const badgeClasse = isVenda ? "badge-venda" : "badge-aluguel";

    // FOTO PRINCIPAL
    const fotoPrincipal = imovel.fotos[0] || "https://via.placeholder.com/300x200";

    // SELO NOVO
    const data = new Date(imovel.dataCadastro);
    const hoje = new Date();
    const diff = (hoje - data) / (1000 * 60 * 60 * 24);
    const badgeNovo = diff <= 7 ? '<span class="badge-novo">✨ Novo</span>' : "";

    card.innerHTML = `
      <div class="card-banner" style="
        background-image:url('${fotoPrincipal}');
        background-size:cover;
        background-position:center;
      ">
        ${badgeNovo}
        <button class="btn-fav" onclick="favoritar(event, ${imovel.id})">
          ❤
        </button>
        <span class="badge-tipo-negocio ${badgeClasse}">${badgeTexto}</span>
        ${imovel.destaque ? '<span class="badge-destaque">Destaque</span>' : ""}
      </div>

      <div class="card-corpo">
        <div class="card-titulo">${imovel.titulo}</div>
        <div class="card-preco">${formatarPreco(imovel.preco)}</div>
        <div class="card-local">${imovel.cidade} • ${imovel.bairro}</div>

        <div class="card-info">
          ${imovel.quartos > 0 ? `<span>${imovel.quartos} qt${imovel.quartos > 1 ? "s" : ""}</span>` : ""}
          ${imovel.banheiros > 0 ? `<span>${imovel.banheiros} banheiro${imovel.banheiros > 1 ? "s" : ""}</span>` : ""}
          ${imovel.vagas > 0 ? `<span>${imovel.vagas} vaga${imovel.vagas > 1 ? "s" : ""}</span>` : ""}
          <span>${imovel.tipoImovel}</span>
        </div>

        <div class="card-botao">
          <button class="btn-verdetalhes" onclick="window.location.href='imovel.html?id=${imovel.id}'">
            Ver detalhes →
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}


// ========== FILTROS ==========
function aplicarFiltros() {
  const termo = buscaLocal.value.trim().toLowerCase();
  const tipoN = tipoNegocio.value;
  const tipoI = tipoImovel.value;
  const min = precoMin.value ? Number(precoMin.value) : null;
  const max = precoMax.value ? Number(precoMax.value) : null;

  let filtrados = imoveis.filter((i) => {
    let ok = true;

    if (termo) {
      const frase = `${i.cidade} ${i.bairro}`.toLowerCase();
      if (!frase.includes(termo)) ok = false;
    }

    if (tipoN !== "" && i.tipoNegocio !== tipoN) ok = false;
    if (tipoI !== "" && i.tipoImovel !== tipoI) ok = false;

    if (min !== null && i.preco < min) ok = false;
    if (max !== null && i.preco > max) ok = false;

    return ok;
  });

  resumoResultados.textContent =
    filtrados.length === 0
      ? "Nenhum imóvel encontrado."
      : `${filtrados.length} imóvel(is) encontrado(s).`;

  const destaques = filtrados.filter((i) => i.destaque);
  renderizarImoveis(destaques, listaDestaques);
  renderizarImoveis(filtrados, listaImoveis);
}


// ========== MODAL ==========
function abrirModal() {
  modal.classList.add("ativo");
  backdrop.classList.add("ativo");
  document.body.classList.add("modal-aberto"); // trava fundo
}

function fecharModal() {
  modal.classList.remove("ativo");
  backdrop.classList.remove("ativo");
  document.body.classList.remove("modal-aberto"); // destrava fundo

  previewFotos.innerHTML = "";
  uploadInfo.textContent = "Nenhuma foto selecionada";
  fotosForm.value = "";
}

btnAbrir.addEventListener("click", abrirModal);
btnFechar.addEventListener("click", fecharModal);
btnCancelar.addEventListener("click", fecharModal);
backdrop.addEventListener("click", fecharModal);


// ========== PREVIEW FOTOS ==========
fotosForm.addEventListener("change", () => {
  previewFotos.innerHTML = "";

  const arquivos = Array.from(fotosForm.files).slice(0, 10);

  uploadInfo.textContent =
    arquivos.length > 0 ? `${arquivos.length} foto(s)` : "Nenhuma foto selecionada";

  arquivos.forEach((arq) => {
    const leitor = new FileReader();
    leitor.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      previewFotos.appendChild(img);
    };
    leitor.readAsDataURL(arq);
  });
});


// ========== SALVAR ANÚNCIO ==========
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const arquivos = Array.from(fotosForm.files).slice(0, 10);
  const fotosArray = [];

  // Converte fotos em BASE64
  const leitores = arquivos.map((arquivo) => {
    return new Promise((resolve) => {
      const leitor = new FileReader();
      leitor.onload = (e) => resolve(e.target.result);
      leitor.readAsDataURL(arquivo);
    });
  });

  Promise.all(leitores).then((resultado) => {
    const novo = {
      id: Date.now(),
      titulo: tituloForm.value.trim(),
      tipoNegocio: tipoNegocioForm.value,
      tipoImovel: tipoImovelForm.value,
      preco: Number(precoForm.value),
      cidade: cidadeForm.value.trim(),
      bairro: bairroForm.value.trim(),
      quartos: Number(quartosForm.value || 0),
      banheiros: Number(banheirosForm.value || 0),
      vagas: Number(vagasForm.value || 0),
      descricao: descricaoForm.value.trim(),
      destaque: destaqueForm.checked,
      whatsapp: whatsForm.value.trim(),
      fotos: resultado
    };

    imoveis.unshift(novo);
    form.reset();
    fecharModal();
    aplicarFiltros();

    alert("Imóvel cadastrado com sucesso! (modo local)");
  });
});


// ========== INICIALIZAR ==========
btnFiltrar.addEventListener("click", aplicarFiltros);
aplicarFiltros();
