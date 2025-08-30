const camposDiv = document.getElementById('campos');
const tipoSelect = document.getElementById('tipo');
const nomeInput = document.getElementById('nome');
let quill;

function renderizarCampos() {
  const tipo = tipoSelect.value;
  camposDiv.innerHTML = ''; // Limpa os campos existentes antes de renderizar

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

      <h3>Posologia Detalhada</h3>

      <label for="medicamento">Medicamento</label>
      <input type="text" id="medicamento">

      <label for="dosagem">Dosagem</label>
      <input type="text" id="dosagem">

      <label for="frequencia">Frequência</label>
      <input type="text" id="frequencia">

      <label for="via">Via de Administração</label>
      <input type="text" id="via">

      <label for="duracao">Duração do Tratamento</label>
      <input type="text" id="duracao">

      <label for="observacoes">Observações</label>
      <textarea id="observacoes"></textarea>

      <label for="orientacoes">Orientações</label>
      <textarea id="orientacoes"></textarea>
    `;
  }
}

function salvarCampos() {
  const tipo = tipoSelect.value;
  const dados = {
    tipo: tipo,
    nome: nomeInput.value.trim(),
    queixa: document.getElementById('queixa') ? document.getElementById('queixa').value : '',
    conduta: document.getElementById('conduta') ? document.getElementById('conduta').value : '',
    exame: document.getElementById('exame') ? document.getElementById('exame').value : '',
    diagnostico: document.getElementById('diagnostico') ? document.getElementById('diagnostico').value : '',
    prescricao: document.getElementById('prescricao') ? document.getElementById('prescricao').value : '',
    medicamento: document.getElementById('medicamento') ? document.getElementById('medicamento').value : '',
    dosagem: document.getElementById('dosagem') ? document.getElementById('dosagem').value : '',
    frequencia: document.getElementById('frequencia') ? document.getElementById('frequencia').value : '',
    via: document.getElementById('via') ? document.getElementById('via').value : '',
    duracao: document.getElementById('duracao') ? document.getElementById('duracao').value : '',
    observacoes: document.getElementById('observacoes') ? document.getElementById('observacoes').value : '',
    orientacoes: document.getElementById('orientacoes') ? document.getElementById('orientacoes').value : ''
  };

  localStorage.setItem('evolucaoDados', JSON.stringify(dados));
}

function restaurarCampos() {
  const dadosSalvos = JSON.parse(localStorage.getItem('evolucaoDados'));

  if (dadosSalvos) {
    nomeInput.value = dadosSalvos.nome || '';
    tipoSelect.value = dadosSalvos.tipo || 'rapida';

    document.getElementById('queixa').value = dadosSalvos.queixa || '';
    document.getElementById('conduta').value = dadosSalvos.conduta || '';
    document.getElementById('exame').value = dadosSalvos.exame || '';
    document.getElementById('diagnostico').value = dadosSalvos.diagnostico || '';
    document.getElementById('prescricao').value = dadosSalvos.prescricao || '';
    document.getElementById('medicamento').value = dadosSalvos.medicamento || '';
    document.getElementById('dosagem').value = dadosSalvos.dosagem || '';
    document.getElementById('frequencia').value = dadosSalvos.frequencia || '';
    document.getElementById('via').value = dadosSalvos.via || '';
    document.getElementById('duracao').value = dadosSalvos.duracao || '';
    document.getElementById('observacoes').value = dadosSalvos.observacoes || '';
    document.getElementById('orientacoes').value = dadosSalvos.orientacoes || '';
  }
}

function limparCampos() {
  nomeInput.value = '';
  tipoSelect.value = 'rapida';
  document.getElementById('queixa').value = '';
  document.getElementById('conduta').value = '';
  document.getElementById('exame').value = '';
  document.getElementById('diagnostico').value = '';
  document.getElementById('prescricao').value = '';
  document.getElementById('medicamento').value = '';
  document.getElementById('dosagem').value = '';
  document.getElementById('frequencia').value = '';
  document.getElementById('via').value = '';
  document.getElementById('duracao').value = '';
  document.getElementById('observacoes').value = '';
  document.getElementById('orientacoes').value = '';

  localStorage.removeItem('evolucaoDados');
}

function salvarAutomaticamente() {
  setInterval(salvarCampos, 5000); // Salva automaticamente a cada 5 segundos
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
Posologia Detalhada:\n
Medicamento: ${document.getElementById('medicamento').value}\n
Dosagem: ${document.getElementById('dosagem').value}\n
Frequência: ${document.getElementById('frequencia').value}\n
Via de Administração: ${document.getElementById('via').value}\n
Duração do Tratamento: ${document.getElementById('duracao').value}\n
Observações: ${document.getElementById('observacoes').value}\n
Orientações: ${document.getElementById('orientacoes').value}`;
  }

  quill.setText(texto);
}

function copiarTexto() {
  navigator.clipboard.writeText(quill.getText()).then(() => {
    alert("Texto copiado!");
  });
}

function copiarTextoHtml() {
  const textoComFormatacao = quill.root.innerHTML;
  
  navigator.clipboard.writeText(textoComFormatacao).then(() => {
    alert("Texto copiado com formatação!");
  });
}

function exportarTextoHtml() {
  const nome = nomeInput.value.trim() || "paciente-nao-nomeado";
  const agora = new Date();
  const dataHora = agora.toLocaleString('pt-BR').replace(/[\/:]/g, '').replace(' ', '-');
  const nomeArquivo = `${nome.replace(/\s+/g, '-')}-${dataHora}.html`;

  const textoComFormatacao = quill.root.innerHTML;

  const blob = new Blob([textoComFormatacao], { type: "text/html;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nomeArquivo;
  link.click();
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

document.addEventListener("DOMContentLoaded", () => {
  quill = new Quill('#editor', { theme: 'snow' });
  renderizarCampos();
  restaurarCampos();
  salvarAutomaticamente();
});

tipoSelect.addEventListener('change', renderizarCampos);
