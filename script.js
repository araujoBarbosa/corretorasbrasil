// ==========================================
// 1) CARREGAR IMÓVEIS DO SERVIDOR (API)
// ==========================================
let imoveis = [];

async function carregarImoveis() {
  try {
    const resposta = await fetch("http://72.60.152.220:6001/listar");
    imoveis = await resposta.json();
    aplicarFiltros();
  } catch (erro) {
    console.error("Erro ao carregar imóveis do servidor:", erro);
    alert("Não foi possível carregar os imóveis. Verifique se o servidor está ativo.");
  }
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


// ======= FORMATADORES =======
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


// ======= FAVORITAR =======
function favoritar(event, id) {
  event.stopPropagation();

  let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(item => item !== id);
  } else {
    favoritos.push(id);
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));

  aplicarFiltros();
}


// ======= RENDERIZAR =======
function renderizarImoveis(lista, container) {
  container.innerHTML = "";

  if (!lista.length) {
    container.innerHTML =
      '<p style="font-size: 13px; color: #9ca3af;">Nenhum imóvel encontrado.</p>';
    return;
  }

  lista.forEach((imovel) => {
    const card = document.createElement("article");
    card.className = "card-imovel";

    const isVenda = imovel.tipoNegocio === "venda";
    const badgeTexto = isVenda ? "Venda" : "Aluguel";
    const badgeClasse = isVenda ? "badge-venda" : "badge-aluguel";

    const fotoPrincipal = imovel.fotos?.[0] || "https://via.placeholder.com/300x200";

    card.innerHTML = `
      <div class="card-banner" style="
        background-image:url('${fotoPrincipal}');
        background-size:cover;
        background-position:center;
      ">
        <button class="btn-fav" onclick="favoritar(event, ${imovel.id})">❤</button>
        <span class="badge-tipo-negocio ${badgeClasse}">${badgeTexto}</span>
        ${imovel.destaque ? '<span class="badge-destaque">Destaque</span>' : ""}
      </div>

      <div class="card-corpo">
        <div class="card-titulo">${imovel.titulo}</div>
        <div class="card-preco">${formatarPreco(imovel.preco)}</div>
        <div class="card-local">${imovel.cidade} • ${imovel.bairro}</div>

        <div class="card-info">
          ${imovel.quartos > 0 ? `<span>${imovel.quartos} qts</span>` : ""}
          ${imovel.banheiros > 0 ? `<span>${imovel.banheiros} ban</span>` : ""}
          ${imovel.vagas > 0 ? `<span>${imovel.vagas} vaga(s)</span>` : ""}
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


// ======= FILTRAR =======
function aplicarFiltros() {
  const termo = buscaLocal.value.trim().toLowerCase();
  const tipoN = tipoNegocio.value;
  const tipoI = tipoImovel.value;
  const min = precoMin.value ? Number(precoMin.value) : null;
  const max = precoMax.value ? Number(precoMax.value) : null;

  let filtrados = imoveis.filter(i => {
    let ok = true;

    if (termo) {
      const frase = `${i.cidade} ${i.bairro}`.toLowerCase();
      if (!frase.includes(termo)) ok = false;
    }

    if (tipoN && i.tipoNegocio !== tipoN) ok = false;
    if (tipoI && i.tipoImovel !== tipoI) ok = false;
    if (min !== null && i.preco < min) ok = false;
    if (max !== null && i.preco > max) ok = false;

    return ok;
  });

  resumoResultados.textContent =
    filtrados.length === 0 ? "Nenhum imóvel encontrado." :
    `${filtrados.length} imóvel(is) encontrado(s).`;

  const destaques = filtrados.filter(i => i.destaque);
  renderizarImoveis(destaques, listaDestaques);
  renderizarImoveis(filtrados, listaImoveis);
}


// ======= MODAL =======
function abrirModal() {
  modal.classList.add("ativo");
  backdrop.classList.add("ativo");
}

function fecharModal() {
  modal.classList.remove("ativo");
  backdrop.classList.remove("ativo");
  previewFotos.innerHTML = "";
  uploadInfo.textContent = "Nenhuma foto selecionada";
  fotosForm.value = "";
}

btnAbrir.addEventListener("click", abrirModal);
btnFechar.addEventListener("click", fecharModal);
btnCancelar.addEventListener("click", fecharModal);
backdrop.addEventListener("click", fecharModal);


// ======= UPLOAD PREVIEW =======
fotosForm.addEventListener("change", () => {
  previewFotos.innerHTML = "";
  const arquivos = Array.from(fotosForm.files);

  uploadInfo.textContent =
    arquivos.length > 0 ? `${arquivos.length} foto(s)` : "Nenhuma foto";

  arquivos.forEach(arq => {
    const leitor = new FileReader();
    leitor.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      previewFotos.appendChild(img);
    };
    leitor.readAsDataURL(arq);
  });
});


// ======= SALVAR NO SERVIDOR =======
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const arquivos = Array.from(fotosForm.files);
  const base64Fotos = await Promise.all(
    arquivos.map(arq => new Promise(resolve => {
      const leitor = new FileReader();
      leitor.onload = e => resolve(e.target.result);
      leitor.readAsDataURL(arq);
    }))
  );

  const novo = {
    id: Date.now(),
    titulo: tituloForm.value.trim(),
    tipoNegocio: tipoNegocioForm.value,
    tipoImovel: tipoImovelForm.value,
    preco: Number(precoForm.value),
    cidade: cidadeForm.value.trim(),
    bairro: bairroForm.value.trim(),
    quartos: Number(quartosForm.value),
    banheiros: Number(banheirosForm.value),
    vagas: Number(vagasForm.value),
    descricao: descricaoForm.value.trim(),
    whatsapp: whatsForm.value.trim(),
    destaque: destaqueForm.checked,
    fotos: base64Fotos
  };

  try {
    const resposta = await fetch("http://72.60.152.220:6001/adicionar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo)
    });

    const dados = await resposta.json();

    if (dados.status === "ok") {
      fecharModal();
      form.reset();
      carregarImoveis();
      alert("Imóvel cadastrado com sucesso!");
    } else {
      alert("Erro ao salvar imóvel!");
    }
  } catch (err) {
    console.error("Erro no envio:", err);
    alert("Falha ao enviar para o servidor.");
  }
});


// ======= INICIALIZAÇÃO =======
btnFiltrar.addEventListener("click", aplicarFiltros);
carregarImoveis();

