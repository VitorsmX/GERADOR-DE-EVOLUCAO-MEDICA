const camposDiv = document.getElementById('campos');
const tipoSelect = document.getElementById('tipo');
const nomeInput = document.getElementById('nome');
let quill;

function renderizarCampos() {
  const tipo = tipoSelect.value;
  camposDiv.innerHTML = '';

  if (tipo === 'rapida') {
    camposDiv.innerHTML = `
      <h3>Resumo da Evolução</h3>
      <label for="queixa">Queixa</label>
      <textarea id="queixa" placeholder="Descreva a queixa do paciente..."></textarea>

      <label for="conduta">Conduta</label>
      <textarea id="conduta" placeholder="Conduta médica a ser adotada..."></textarea>
    `;
  } else {
    camposDiv.innerHTML = `
      <h3>Dados Clínicos</h3>
      <label for="queixa">Queixa Principal</label>
      <textarea id="queixa" placeholder="Descreva a queixa principal..."></textarea>

      <label for="exame">Exame Físico</label>
      <textarea id="exame" placeholder="Detalhes do exame físico..."></textarea>

      <label for="diagnostico">Diagnóstico</label>
      <textarea id="diagnostico" placeholder="Hipótese diagnóstica..."></textarea>

      <h3>Tratamento</h3>
      <label for="prescricao">Prescrição</label>
      <textarea id="prescricao" placeholder="Prescrição médica..."></textarea>

      <h3>Posologia Detalhada</h3>
      <div class="grid-posologia">
        <div>
          <label for="medicamento">Medicamento</label>
          <input type="text" id="medicamento" placeholder="Nome do medicamento">
        </div>

        <div>
          <label for="dosagem">Dosagem</label>
          <input type="text" id="dosagem" placeholder="Ex: 500mg">
        </div>

        <div>
          <label for="frequencia">Frequência</label>
          <input type="text" id="frequencia" placeholder="Ex: 2x ao dia">
        </div>

        <div>
          <label for="via">Via de Administração</label>
          <input type="text" id="via" placeholder="Ex: Oral, EV...">
        </div>

        <div>
          <label for="duracao">Duração</label>
          <input type="text" id="duracao" placeholder="Ex: 7 dias">
        </div>
      </div>

      <h3>Complementos</h3>
      <label for="observacoes">Observações</label>
      <textarea id="observacoes" placeholder="Observações adicionais..."></textarea>

      <label for="orientacoes">Orientações</label>
      <textarea id="orientacoes" placeholder="Orientações ao paciente..."></textarea>
    `;
  }

  restaurarCampos();
}


function salvarCampos() {
  const tipo = tipoSelect.value;
  const chave = tipo === 'rapida' ? 'evolucaoRapida' : 'evolucaoCompleta';

  const dados = { nome: nomeInput.value.trim() };

  // salva apenas os campos visíveis no DOM atual
  camposDiv.querySelectorAll("input, textarea").forEach(el => {
    dados[el.id] = el.value;
  });

  localStorage.setItem(chave, JSON.stringify(dados));
}

function restaurarCampos() {
  const tipo = tipoSelect.value;
  const chave = tipo === 'rapida' ? 'evolucaoRapida' : 'evolucaoCompleta';
  const dadosSalvos = JSON.parse(localStorage.getItem(chave));

  if (dadosSalvos) {
    nomeInput.value = dadosSalvos.nome || '';

    for (const [id, valor] of Object.entries(dadosSalvos)) {
      if (id !== "nome") {
        const el = document.getElementById(id);
        if (el) el.value = valor || '';
      }
    }
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

  renderizarCampos();
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
  salvarAutomaticamente();
});

tipoSelect.addEventListener('change', () => {
  salvarCampos();       
  renderizarCampos();   
});
