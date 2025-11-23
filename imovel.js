// =====================================================
// IMOVEL.JS — VERSÃO CONECTADA AO BACKEND DA VPS
// =====================================================

// 1) Pegar ID da URL
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

if (!id) {
  mostrarErro("ID do imóvel inválido.");
  throw new Error("ID inválido");
}

// 2) Buscar imóveis no servidor
async function carregarImovel() {
  try {
    const resposta = await fetch("http://72.60.152.220:6001/listar");
    const lista = await resposta.json();

    const imovel = lista.find(i => i.id === id);

    if (!imovel) {
      mostrarErro("Imóvel não encontrado.");
      return;
    }

    preencherDados(imovel);

  } catch (erro) {
    console.error(erro);
    mostrarErro("Erro ao carregar dados do servidor.");
  }
}

// 3) Exibir erro elegante
function mostrarErro(msg) {
  document.body.innerHTML = `
    <div style="color:#fff; text-align:center; padding:40px; font-size:20px;">
      ${msg}
    </div>
  `;
}

// 4) Preencher informações
function preencherDados(imovel) {
  document.getElementById("tituloImovel").textContent = imovel.titulo;
  document.getElementById("localImovel").textContent = `${imovel.cidade} • ${imovel.bairro}`;
  document.getElementById("precoImovel").textContent = formatarPreco(imovel.preco);

  document.getElementById("descricaoImovel").textContent =
    imovel.descricao || "O anunciante não adicionou uma descrição.";

  // WhatsApp
  document.getElementById("btnWhats").href =
    `https://wa.me/55${imovel.whatsapp.replace(/\D/g, "")}`;

  // Características
  let htmlCarac = "";
  if (imovel.quartos > 0) htmlCarac += `<span>${imovel.quartos} quarto(s)</span>`;
  if (imovel.banheiros > 0) htmlCarac += `<span>${imovel.banheiros} banheiro(s)</span>`;
  if (imovel.vagas > 0) htmlCarac += `<span>${imovel.vagas} vaga(s)</span>`;
  htmlCarac += `<span>${imovel.tipoImovel}</span>`;
  document.getElementById("caracteristicasImovel").innerHTML = htmlCarac;

  // Carrossel
  montarCarrossel(imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos : [
    "https://images.unsplash.com/photo-1502672023488-70e25813a38d",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb"
  ]);
}


// 5) Carrossel
let index = 0;
let fotosGlobais = [];

function montarCarrossel(fotos) {
  fotosGlobais = fotos;
  renderizarCarrossel();
}

function renderizarCarrossel() {
  const carrossel = document.getElementById("carrosselImagens");

  carrossel.innerHTML = `
    <img src="${fotosGlobais[index]}" alt="Foto do imóvel">

    <div class="seta esq" onclick="trocar(-1)">❮</div>
    <div class="seta dir" onclick="trocar(1)">❯</div>
  `;
}

function trocar(direcao) {
  index += direcao;

  if (index < 0) index = fotosGlobais.length - 1;
  if (index >= fotosGlobais.length) index = 0;

  renderizarCarrossel();
}


// 6) Iniciar carregamento
carregarImovel();

