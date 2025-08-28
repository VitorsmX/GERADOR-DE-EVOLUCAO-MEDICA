const camposDiv = document.getElementById('campos');
const tipoSelect = document.getElementById('tipo');
const nomeInput = document.getElementById('nome');
let quill;

document.addEventListener("DOMContentLoaded", () => {
  quill = new Quill('#editor', { theme: 'snow' });
  renderizarCampos();
});

tipoSelect.addEventListener('change', renderizarCampos);

function renderizarCampos() {
  const tipo = tipoSelect.value;
  camposDiv.innerHTML = '';

  if (tipo === 'rapida') {
    camposDiv.innerHTML = `
      <label for="queixa">Queixa</label>
      <textarea id="queixa"></textarea>
      <label for="conduta">Conduta</label>
      <textarea id="conduta"></textarea>
    `;
  } else {
    camposDiv.innerHTML = `
      <label for="queixa">Queixa Principal</label>
      <textarea id="queixa"></textarea>

      <label for="exame">Exame Físico</label>
      <textarea id="exame"></textarea>

      <label for="diagnostico">Diagnóstico</label>
      <textarea id="diagnostico"></textarea>

      <label for="prescricao">Prescrição</label>
      <textarea id="prescricao"></textarea>

      <label for="posologia">Posologia</label>
      <textarea id="posologia"></textarea>

      <label for="orientacoes">Orientações</label>
      <textarea id="orientacoes"></textarea>
    `;
  }
}

function gerarTexto() {
  const tipo = tipoSelect.value;
  let texto = '';

  if (tipo === 'rapida') {
    texto = `Evolução Rápida:\n
Queixa: ${document.getElementById('queixa').value}\n
Conduta: ${document.getElementById('conduta').value}`;
  } else {
    texto = `Evolução Completa:\n
Queixa Principal: ${document.getElementById('queixa').value}\n
Exame Físico: ${document.getElementById('exame').value}\n
Diagnóstico: ${document.getElementById('diagnostico').value}\n
Prescrição: ${document.getElementById('prescricao').value}\n
Posologia: ${document.getElementById('posologia').value}\n
Orientações: ${document.getElementById('orientacoes').value}`;
  }

  quill.setText(texto);
}

function copiarTexto() {
  navigator.clipboard.writeText(quill.getText()).then(() => {
    alert("Texto copiado!");
  });
}

function exportarTexto() {
  const nome = nomeInput.value.trim() || "paciente-nao-nomeado";
  const agora = new Date();
  const dataHora = agora.toLocaleString('pt-BR').replace(/[\/:]/g, '').replace(' ', '-');
  const nomeArquivo = `${nome.replace(/\s+/g, '-')}-${dataHora}.txt`;

  const blob = new Blob([quill.getText()], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nomeArquivo;
  link.click();
}
