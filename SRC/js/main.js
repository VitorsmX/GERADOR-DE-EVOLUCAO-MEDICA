const camposDiv = document.getElementById('campos');
const tipoSelect = document.getElementById('tipo');
const nomeInput = document.getElementById('nome');
let quill;

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
  setInterval(salvarCampos, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  quill = new Quill('#editor', { theme: 'snow' });
  renderizarCampos();
  restaurarCampos();
  salvarAutomaticamente();
});

tipoSelect.addEventListener('change', renderizarCampos);
