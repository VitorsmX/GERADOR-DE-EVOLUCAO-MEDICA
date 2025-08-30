const camposDiv = document.getElementById('campos');
const tipoSelect = document.getElementById('tipo');
const nomeInput = document.getElementById('nome');
let quill;


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


  restaurarCampos();
}


function salvarCampos() {
  const tipo = tipoSelect.value;
  const dados = {
    nome: nomeInput.value.trim(),
    queixa: document.getElementById('queixa')?.value || '',
    conduta: document.getElementById('conduta')?.value || '',
    exame: document.getElementById('exame')?.value || '',
    diagnostico: document.getElementById('diagnostico')?.value || '',
    prescricao: document.getElementById('prescricao')?.value || '',
    medicamento: document.getElementById('medicamento')?.value || '',
    dosagem: document.getElementById('dosagem')?.value || '',
    frequencia: document.getElementById('frequencia')?.value || '',
    via: document.getElementById('via')?.value || '',
    duracao: document.getElementById('duracao')?.value || '',
    observacoes: document.getElementById('observacoes')?.value || '',
    orientacoes: document.getElementById('orientacoes')?.value || ''
  };

  const chave = tipo === 'rapida' ? 'evolucaoRapida' : 'evolucaoCompleta';
  localStorage.setItem(chave, JSON.stringify(dados));
}


function restaurarCampos() {
  const tipo = tipoSelect.value;
  const chave = tipo === 'rapida' ? 'evolucaoRapida' : 'evolucaoCompleta';
  const dadosSalvos = JSON.parse(localStorage.getItem(chave));

  if (dadosSalvos) {
    nomeInput.value = dadosSalvos.nome || '';

    const setValue = (id, valor) => {
      const el = document.getElementById(id);
      if (el) el.value = valor || '';
    };

    setValue('queixa', dadosSalvos.queixa);
    setValue('conduta', dadosSalvos.conduta);
    setValue('exame', dadosSalvos.exame);
    setValue('diagnostico', dadosSalvos.diagnostico);
    setValue('prescricao', dadosSalvos.prescricao);
    setValue('medicamento', dadosSalvos.medicamento);
    setValue('dosagem', dadosSalvos.dosagem);
    setValue('frequencia', dadosSalvos.frequencia);
    setValue('via', dadosSalvos.via);
    setValue('duracao', dadosSalvos.duracao);
    setValue('observacoes', dadosSalvos.observacoes);
    setValue('orientacoes', dadosSalvos.orientacoes);
  }
}


function limparCampos() {
  nomeInput.value = '';
  tipoSelect.value = 'completa';

  const limpar = (id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  };

  [
    'queixa', 'conduta', 'exame', 'diagnostico', 'prescricao',
    'medicamento', 'dosagem', 'frequencia', 'via', 'duracao',
    'observacoes', 'orientacoes'
  ].forEach(limpar);

  localStorage.removeItem('evolucaoRapida');
  localStorage.removeItem('evolucaoCompleta');
}


function salvarAutomaticamente() {
  setInterval(salvarCampos, 1500); 
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
  salvarAutomaticamente(); // salva a cada 1.5s
});



tipoSelect.addEventListener('change', () => {
  salvarCampos();       
  renderizarCampos();   
});

