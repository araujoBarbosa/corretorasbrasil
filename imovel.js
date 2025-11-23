// Recuperar ID da URL
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

if (!id) {
  mostrarErro("ID inválido");
  throw new Error("ID inválido");
}

// Validar se a lista existe
if (typeof imoveis === "undefined") {
  mostrarErro("Erro: lista de imóveis não carregada. Verifique se script.js foi importado antes de imovel.js.");
  throw new Error("script.js não carregado");
}

// Buscar imóvel
const imovel = imoveis.find((i) => i.id === id);

if (!imovel) {
  mostrarErro("Imóvel não encontrado.");
  throw new Error("Imóvel não encontrado");
}

// Função de erro elegante
function mostrarErro(msg) {
  document.body.innerHTML = `
    <div style="color:#fff; text-align:center; padding:40px; font-size:20px;">
      ${msg}
    </div>
  `;
}

// ------------------------------
// Preencher dados
// ------------------------------
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


// ------------------------------
// CARROSSEL DE IMAGENS
// ------------------------------

// Se não tiver fotos, usa padrão elegante
const fotos = imovel.fotos.length > 0
  ? imovel.fotos
  : [
      "https://images.unsplash.com/photo-1502672023488-70e25813a38d",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb"
    ];

let index = 0;

function renderizarCarrossel() {
  const carrossel = document.getElementById("carrosselImagens");

  carrossel.innerHTML = `
    <img src="${fotos[index]}" alt="Foto do imóvel">

    <div class="seta esq" onclick="trocar(-1)">❮</div>
    <div class="seta dir" onclick="trocar(1)">❯</div>
  `;
}

function trocar(direcao) {
  index += direcao;

  if (index < 0) index = fotos.length - 1;
  if (index >= fotos.length) index = 0;

  renderizarCarrossel();
}

renderizarCarrossel();
