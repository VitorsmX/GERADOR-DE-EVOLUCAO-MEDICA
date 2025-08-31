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
    texto = `=== Evolução Rápida ===\n
📌 Resumo
- Queixa: ${document.getElementById('queixa').value || '-'}
- Conduta: ${document.getElementById('conduta').value || '-'}`;
  } else {
    texto = `=== Evolução Completa ===\n
📌 Dados Clínicos
- Queixa Principal: ${document.getElementById('queixa').value || '-'}
- Exame Físico: ${document.getElementById('exame').value || '-'}
- Diagnóstico: ${document.getElementById('diagnostico').value || '-'}\n
💊 Tratamento
- Prescrição: ${document.getElementById('prescricao').value || '-'}\n
🧾 Posologia Detalhada
- Medicamento: ${document.getElementById('medicamento').value || '-'}
- Dosagem: ${document.getElementById('dosagem').value || '-'}
- Frequência: ${document.getElementById('frequencia').value || '-'}
- Via: ${document.getElementById('via').value || '-'}
- Duração: ${document.getElementById('duracao').value || '-'}\n
📝 Complementos
- Observações: ${document.getElementById('observacoes').value || '-'}
- Orientações: ${document.getElementById('orientacoes').value || '-'}`;
  }

  quill.setText(texto);
}


function copiarTexto() {
  navigator.clipboard.writeText(quill.getText()).then(() => {
    alert("Texto copiado!");
  });
}

function copiarTextoMarkdown() {
  const textoHtml = quill.root.innerHTML;

  const turndownService = new TurndownService();
  const textoMarkdown = turndownService.turndown(textoHtml);

  navigator.clipboard.writeText(textoMarkdown).then(() => {
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

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const conteudo = quill.getText();
  const tipo = document.getElementById("tipo").value || "Evolução";
  const nome = document.getElementById("nome").value || "Paciente";

  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, "0");
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const ano = agora.getFullYear();
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");
  const segundo = String(agora.getSeconds()).padStart(2, "0");

  const dataHora = `${dia}-${mes}-${ano}_${hora}-${minuto}-${segundo}`;

  const titulo = `${tipo} de ${nome}`;

  doc.setFont("times", "normal");

  doc.setFontSize(16);
  doc.text(titulo, 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Data de geração: ${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`, 105, 28, { align: "center" });

  doc.setFontSize(12);
  const marginLeft = 15;
  const marginTop = 40;
  const maxWidth = 180;
  const linhas = doc.splitTextToSize(conteudo, maxWidth);
  doc.text(linhas, marginLeft, marginTop);

  doc.save(`${tipo}_${nome}_${dataHora}.pdf`);
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
