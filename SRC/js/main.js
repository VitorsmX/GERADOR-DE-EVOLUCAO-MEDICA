const camposDiv = document.getElementById("campos");
const tipoSelect = document.getElementById("tipo");
const nomeInput = document.getElementById("nome");
let quill;

function showToast(message, type = "info", showTimeMS = 2500) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast");

  if (type === "success") toast.style.background = "#28a745";
  if (type === "error") toast.style.background = "#dc3545";
  if (type === "warning") toast.style.background = "#ffc107";
  if (type === "info") toast.style.background = "#17a2b8";

  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, showTimeMS);
}

function renderizarCampos() {
  const tipo = tipoSelect.value;
  camposDiv.innerHTML = "";

  if (tipo === "rapida") {
    camposDiv.innerHTML = `
      <h3>Resumo da Evolução</h3>
      <label for="queixa_rapida">Queixa</label>
      <textarea id="queixa_rapida" placeholder="Descreva a queixa do paciente..."></textarea>

      <label for="conduta_rapida">Conduta</label>
      <textarea id="conduta_rapida" placeholder="Conduta médica a ser adotada..."></textarea>
    `;
  } else {
    camposDiv.innerHTML = `
      <h3>Dados Clínicos</h3>
      <label for="queixa_completa">Queixa Principal</label>
      <textarea id="queixa_completa" placeholder="Descreva a queixa principal..."></textarea>

      <label for="exame_completa">Exame Físico</label>
      <textarea id="exame_completa" placeholder="Detalhes do exame físico..."></textarea>

      <label for="diagnostico_completa">Diagnóstico</label>
      <textarea id="diagnostico_completa" placeholder="Hipótese diagnóstica..."></textarea>

      <h3>Tratamento</h3>
      <label for="prescricao_completa">Prescrição</label>
      <textarea id="prescricao_completa" placeholder="Prescrição médica..."></textarea>

      <h3>Posologia Detalhada</h3>
      <div class="grid-posologia">
        <div>
          <label for="medicamento_completa">Medicamento</label>
          <input type="text" id="medicamento_completa" placeholder="Nome do medicamento">
        </div>

        <div>
          <label for="dosagem_completa">Dosagem</label>
          <input type="text" id="dosagem_completa" placeholder="Ex: 500mg">
        </div>

        <div>
          <label for="frequencia_completa">Frequência</label>
          <input type="text" id="frequencia_completa" placeholder="Ex: 2x ao dia">
        </div>

        <div>
          <label for="via_completa">Via de Administração</label>
          <input type="text" id="via_completa" placeholder="Ex: Oral, EV...">
        </div>

        <div>
          <label for="duracao_completa">Duração</label>
          <input type="text" id="duracao_completa" placeholder="Ex: 7 dias">
        </div>
      </div>

      <h3>Complementos</h3>
      <label for="observacoes_completa">Observações</label>
      <textarea id="observacoes_completa" placeholder="Observações adicionais..."></textarea>

      <label for="orientacoes_completa">Orientações</label>
      <textarea id="orientacoes_completa" placeholder="Orientações ao paciente..."></textarea>
    `;
  }

  restaurarCampos();
}

function salvarCampos() {
  const tipo = tipoSelect.value;
  const chave = tipo === "rapida" ? "evolucaoRapida" : "evolucaoCompleta";

  const dados = { nome: nomeInput.value.trim() };

  camposDiv.querySelectorAll("input, textarea").forEach((el) => {
    dados[el.id] = el.value;
  });

  localStorage.setItem(chave, JSON.stringify(dados));
}

function restaurarCampos() {
  const tipo = tipoSelect.value;
  const chave = tipo === "rapida" ? "evolucaoRapida" : "evolucaoCompleta";
  const dadosSalvos = JSON.parse(localStorage.getItem(chave));

  nomeInput.value = "";
  camposDiv
    .querySelectorAll("input, textarea")
    .forEach((el) => (el.value = ""));

  if (dadosSalvos) {
    nomeInput.value = dadosSalvos.nome || "";

    for (const [id, valor] of Object.entries(dadosSalvos)) {
      if (id !== "nome") {
        const el = document.getElementById(id);
        if (el) el.value = valor || "";
      }
    }
  }
}

document.querySelector(".limpar-btn").addEventListener("click", () => {
  mostrarConfirmModal();
});

function mostrarConfirmModal() {
  const modal = document.getElementById("confirm-modal");
  modal.style.display = "flex";

  // Cancelar
  document.getElementById("confirm-no").onclick = () => {
    modal.style.display = "none";
  };

  // Confirmar
  document.getElementById("confirm-yes").onclick = () => {
    modal.style.display = "none";
    limparCampos();
  };
}

function limparCampos() {
  const tipo = tipoSelect.value;
  const chave = tipo === "rapida" ? "evolucaoRapida" : "evolucaoCompleta";

  nomeInput.value = "";
  camposDiv
    .querySelectorAll("input, textarea")
    .forEach((el) => (el.value = ""));

  localStorage.removeItem(chave);

  renderizarCampos();
  showToast("Campos do formulário atual foram limpos!", "warning", 2500);
}

function salvarAutomaticamente() {
  setInterval(salvarCampos, 2000);
}

function gerarTexto() {
  const tipo = tipoSelect.value;
  let texto = "";

  if (tipo === "rapida") {
    texto = `=== Evolução Rápida ===\n
📌 Resumo
- Queixa: ${document.getElementById("queixa_rapida").value || "-"}
- Conduta: ${document.getElementById("conduta_rapida").value || "-"}`;
  } else {
    texto = `=== Evolução Completa ===\n
📌 Dados Clínicos
- Queixa Principal: ${document.getElementById("queixa_completa").value || "-"}
- Exame Físico: ${document.getElementById("exame_completa").value || "-"}
- Diagnóstico: ${document.getElementById("diagnostico_completa").value || "-"}\n
💊 Tratamento
- Prescrição: ${document.getElementById("prescricao_completa").value || "-"}\n
🧾 Posologia Detalhada
- Medicamento: ${document.getElementById("medicamento_completa").value || "-"}
- Dosagem: ${document.getElementById("dosagem_completa").value || "-"}
- Frequência: ${document.getElementById("frequencia_completa").value || "-"}
- Via: ${document.getElementById("via_completa").value || "-"}
- Duração: ${document.getElementById("duracao_completa").value || "-"}\n
📝 Complementos
- Observações: ${document.getElementById("observacoes_completa").value || "-"}
- Orientações: ${document.getElementById("orientacoes_completa").value || "-"}`;
  }

  quill.setText(texto);

  if (texto.length > 0) {
    showToast("Evolução gerada com sucesso!", "success", 4000);

    if (quill && quill.root) {
      quill.focus();
      quill.root.scrollIntoView({ behavior: "smooth", block: "center" });
      quill.root.classList.add("focused");
      setTimeout(() => quill.root.classList.remove("focused"), 2500);
    }
  }
}

function copiarTexto() {
  navigator.clipboard
    .writeText(quill.getText())
    .then(() => {
      showToast("Texto copiado para a área de transferência!", "success");
    })
    .catch(() => {
      showToast("Erro ao copiar o texto!", "error");
    });
}

function copiarTextoMarkdown() {
  const textoHtml = quill.root.innerHTML;
  const turndownService = new TurndownService();
  const textoMarkdown = turndownService.turndown(textoHtml);

  navigator.clipboard
    .writeText(textoMarkdown)
    .then(() => {
      showToast("Texto copiado em Markdown!", "success");
    })
    .catch(() => {
      showToast("Erro ao copiar o texto!", "error");
    });
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
  doc.text(
    `Data de geração: ${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`,
    105,
    28,
    { align: "center" }
  );

  doc.setFontSize(12);
  const marginLeft = 15;
  const marginTop = 40;
  const maxWidth = 180;
  const linhas = doc.splitTextToSize(conteudo, maxWidth);
  doc.text(linhas, marginLeft, marginTop);

  doc.save(`${tipo}_${nome}_${dataHora}.pdf`);

  showToast("PDF exportado com sucesso!", "success");
}

function exportarTexto() {
  const nome = nomeInput.value.trim() || "paciente-nao-nomeado";
  const agora = new Date();
  const dataHora = agora
    .toLocaleString("pt-BR")
    .replace(/[\/:]/g, "")
    .replace(" ", "-");
  const nomeArquivo = `${nome.replace(/\s+/g, "-")}-${dataHora}.txt`;

  const blob = new Blob([quill.getText()], {
    type: "text/plain;charset=utf-8",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nomeArquivo;
  link.click();

  showToast("Arquivo TXT exportado com sucesso!", "success");
}

document.addEventListener("DOMContentLoaded", () => {
  quill = new Quill("#editor", { theme: "snow" });
  renderizarCampos();
  salvarAutomaticamente();

  window.onload = () => {
    const loader = document.getElementById("loading-overlay");
    if (loader) {
      loader.classList.add("fade-out");
      setTimeout(() => loader.remove(), 700);
    }
  };

  window.addEventListener("load", () => {
    document.getElementById("skeleton-overlay").style.display = "none";
    document.querySelector(".page-content").style.display = "block";
  });
});

tipoSelect.addEventListener("change", () => {
  salvarCampos();
  renderizarCampos();
  restaurarCampos();
});
