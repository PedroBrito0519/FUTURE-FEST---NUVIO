// ==================== THEME TOGGLE (SEU CÓDIGO ORIGINAL) ====================
function toggleTheme() {
    const themeLink = document.getElementById('theme-style');
    const btn = document.querySelector('.theme-toggle-icon');
    const currentTheme = themeLink.getAttribute('href');

    if (currentTheme.includes('portalEscuro.css')) {
        themeLink.setAttribute('href', 'CSS/NUVEM/portal.css');
        btn.innerHTML = "🌙";
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        themeLink.setAttribute('href', 'CSS/NUVEM/portalEscuro.css');
        btn.innerHTML = "🌞";
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeLink = document.getElementById('theme-style');
    const btn = document.querySelector('.theme-toggle-icon');

    if (savedTheme === 'dark') {
        themeLink.setAttribute('href', 'CSS/NUVEM/portalEscuro.css');
        btn.innerHTML = "🌞";
        document.body.classList.add('dark-theme');
    } else {
        themeLink.setAttribute('href', 'CSS/NUVEM/portal.css');
        btn.innerHTML = "🌙";
        document.body.classList.remove('dark-theme');
    }
});


// ==================== Dados iniciais (adicionado notion) ====================
const fileSystem = {
  raiz: {
    type: "folder",
    date: new Date().toLocaleString("pt-BR"),
    owner: "Você",
    children: {}
  },
  compartilhados: {
    type: "folder",
    date: new Date().toLocaleString("pt-BR"),
    owner: "Sistema",
    children: {}
  },
  notion: { // <-- nova pasta dedicada ao Notion
    type: "folder",
    date: new Date().toLocaleString("pt-BR"),
    owner: "Você",
    children: {} // notas serão salvas aqui (chave = id)
  },
  lixeira: {
    type: "folder",
    date: new Date().toLocaleString("pt-BR"),
    owner: "Sistema",
    children: {}
  }
};

let currentView = "raiz"; // "raiz" | "compartilhados" | "notion" | "lixeira"
let folderStack = ["raiz"]; // Armazena o caminho das pastas pela qual o usuário navegou
let lastSort = { criteria: null, asc: true };

// ==================== Referências DOM ====================
const fileTable = document.getElementById("fileTable");
const currentPathEl = document.getElementById("currentPath");
const fileInput = document.getElementById("fileInput");
const folderInput = document.getElementById("folderInput");

const sortBtn = document.getElementById("sortBtn");
const sortOptions = document.getElementById("sortOptions");

const newFolderModal = document.getElementById("newFolderModal");
const newFolderName = document.getElementById("newFolderName");
const createFolderBtn = document.getElementById("createFolderBtn");
const cancelBtn = document.getElementById("cancelBtn");

const btnBack = document.getElementById("btnBack");

// Notion DOM elements (certifique-se de que existem no HTML)
const newNoteModal = document.getElementById("newNoteModal");
const noteModalTitle = document.getElementById("noteModalTitle");
const noteTitleInput = document.getElementById("noteTitle");
const noteDateInput = document.getElementById("noteDate");
const noteThemeInput = document.getElementById("noteTheme");
const noteImportanceInput = document.getElementById("noteImportance");
const noteDescriptionInput = document.getElementById("noteDescription");
const createNoteBtn = document.getElementById("createNoteBtn");
const cancelNoteBtn = document.getElementById("cancelNoteBtn");
const btnNewNote = document.getElementById("btnNewNote");

// ==================== Utilitários ====================
function getCurrentChildren() {
  // percorre folderStack para retornar o objeto children correto
  let children = fileSystem;
  for (const folder of folderStack) {
    children = children[folder].children;
  }
  return children;
}

function updatePathDisplay() {
  const path = folderStack.join(" > ");
  if (currentView === "notion") {
    currentPathEl.textContent = "📝 Notion";
  } else {
    currentPathEl.textContent = path ? `📂 ${path}` : "📂 Meus Arquivos";
  }
  btnBack.style.display = folderStack.length > 1 ? "inline-block" : "none";
}

// ==================== Renderização ====================
function renderFiles() {
  fileTable.innerHTML = "";

  // Mostrar botão Nova Nota apenas para Notion
  if (btnNewNote) btnNewNote.style.display = currentView === "notion" ? "inline-block" : "none";

  // Se estivermos na aba NOTION, renderiza notas com layout próprio
  if (currentView === "notion") {
    renderNotes();
    return;
  }

  // Caso normal (raiz, compartilhados, lixeira)
  const folder = getCurrentChildren();

  const keys = Object.keys(folder);
  if (keys.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" style="opacity:.8">${currentView === "lixeira" ? "Lixeira vazia." : (currentView === "compartilhados" ? "Nenhum arquivo compartilhado." : "Pasta vazia.")}</td>`;
    fileTable.appendChild(tr);
    return;
  }

  for (const name of keys) {
    const item = folder[name];
    const tr = document.createElement("tr");

    // Nome
    const tdName = document.createElement("td");
    tdName.textContent = `${item.type === "folder" ? "📁" : "📄"} ${name}`;
    if (item.type === "folder" && currentView !== "lixeira") {
      tdName.onclick = () => openFolder(name); // Ao clicar, abre a pasta
      tdName.style.cursor = "pointer";
    }
    tr.appendChild(tdName);

    // Data
    const tdDate = document.createElement("td");
    tdDate.textContent = item.date || "-";
    tr.appendChild(tdDate);

    // Tamanho (no seu layout original era 'tamanho', aqui deixo '-')
    const tdSize = document.createElement("td");
    tdSize.textContent = item.size ? `${item.size} KB` : "-";
    tr.appendChild(tdSize);

    // Dono
    const tdOwner = document.createElement("td");
    tdOwner.textContent = item.owner || "-";
    tr.appendChild(tdOwner);

    // Ações
    const tdActions = document.createElement("td");
    tdActions.classList.add("actions");

    if (currentView !== "lixeira") {
      const btnShare = document.createElement("button");
      btnShare.className = "btn-share";
      btnShare.title = "Compartilhar";
      btnShare.textContent = "🔗";
      btnShare.onclick = () => shareItem(name, item);
      tdActions.appendChild(btnShare);

      const btnDownload = document.createElement("button");
      btnDownload.className = "btn-download";
      btnDownload.title = "Baixar";
      btnDownload.textContent = "⬇️";
      btnDownload.onclick = () => downloadItem(name, item);
      tdActions.appendChild(btnDownload);

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn-delete";
      btnDelete.title = "Excluir";
      btnDelete.textContent = "🗑️";
      btnDelete.onclick = () => moveToTrash(name);
      tdActions.appendChild(btnDelete);
    }

    if (currentView === "lixeira") {
      const btnRestore = document.createElement("button");
      btnRestore.className = "btn-restore";
      btnRestore.textContent = "♻️ Restaurar";
      btnRestore.onclick = () => restoreItem(name);
      tdActions.appendChild(btnRestore);

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn-permanent";
      btnDelete.textContent = "❌ Excluir";
      btnDelete.onclick = () => deletePermanent(name);
      tdActions.appendChild(btnDelete);
    }

    tr.appendChild(tdActions);
    fileTable.appendChild(tr);
  }
}

// ==================== RENDER DE NOTAS (NOTION) ====================
function renderNotes() {
  fileTable.innerHTML = "";
  const notesObj = fileSystem.notion.children; // objeto com chaves = id
  const keys = Object.keys(notesObj);

  if (keys.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" style="opacity:.8">Nenhuma nota.</td>`;
    fileTable.appendChild(tr);
    return;
  }

  for (const id of keys) {
    const note = notesObj[id];
    const tr = document.createElement("tr");
    tr.classList.add("note-row");

    // Título (clicável para editar)
    const tdTitle = document.createElement("td");
    tdTitle.innerHTML = `${note.title || "(Sem título)"}`;
    tdTitle.classList.add("titulo-clickable");
    tdTitle.onclick = () => openEditNote(id);
    tr.appendChild(tdTitle);

    // Data (validade)
    const tdDate = document.createElement("td");
    tdDate.textContent = note.date || "-";
    tr.appendChild(tdDate);

    // Tema
    const tdTheme = document.createElement("td");
    tdTheme.textContent = note.theme || "-";
    tr.appendChild(tdTheme);

    // Importância
    const tdImportance = document.createElement("td");
    tdImportance.textContent = note.importance || "-";
    tr.appendChild(tdImportance);

    // Ações (editar, excluir -> lixeira, download)
    const tdActions = document.createElement("td");
    tdActions.classList.add("actions");
    const btnEdit = document.createElement("button");
    btnEdit.className = "btn";
    btnEdit.title = "Editar";
    btnEdit.textContent = "✏️";
    btnEdit.onclick = () => openEditNote(id);
    tdActions.appendChild(btnEdit);

    const btnDownload = document.createElement("button");
    btnDownload.className = "btn-download";
    btnDownload.title = "Baixar nota";
    btnDownload.textContent = "⬇️";
    btnDownload.onclick = () => downloadNoteAsTxt(id);
    tdActions.appendChild(btnDownload);

    const btnDelete = document.createElement("button");
    btnDelete.className = "btn-delete";
    btnDelete.title = "Excluir";
    btnDelete.textContent = "🗑️";
    btnDelete.onclick = () => moveNoteToTrash(id);
    tdActions.appendChild(btnDelete);

    tr.appendChild(tdActions);
    fileTable.appendChild(tr);
  }
}

// ==================== Função de Navegação ====================
function openFolder(name) {
  if (fileSystem[currentView].children[name].type === "folder") {
    folderStack.push(name); // Empurra a nova pasta para o stack
    updatePathDisplay();
    renderFiles();
  }
}

function goBack() {
  folderStack.pop(); // Remove a última pasta do stack
  updatePathDisplay();
  renderFiles();
}

// ==================== Nova pasta (modal) ====================
function openNewFolderModal() {
  newFolderModal.classList.add("show");
  newFolderModal.setAttribute("aria-hidden", "false");
  newFolderName.value = "";
  setTimeout(() => newFolderName.focus(), 80);
}

createFolderBtn.addEventListener("click", () => {
  const name = newFolderName.value.trim();
  if (!name) {
    alert("Digite um nome válido para a pasta.");
    return;
  }
  const children = getCurrentChildren();
  if (children[name]) {
    alert("Já existe um arquivo/pasta com esse nome aqui.");
    return;
  }
  children[name] = {
    type: "folder",
    date: new Date().toLocaleString("pt-BR"),
    owner: "Você",
    children: {}
  };
  closeNewFolderModal();
  renderFiles();
});

cancelBtn.addEventListener("click", () => closeNewFolderModal());

function closeNewFolderModal() {
  newFolderModal.classList.remove("show");
  newFolderModal.setAttribute("aria-hidden", "true");
  newFolderName.value = "";
}

// ==================== Upload ====================
function triggerUpload() {
  fileInput.value = "";
  fileInput.click();
}

fileInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const children = getCurrentChildren();
  if (children[file.name]) {
    alert("Já existe um arquivo ou pasta com esse nome!");
    return;
  }
  // armazenar o objeto File para permitir download real depois
  children[file.name] = {
    type: "file",
    date: new Date(file.lastModified).toLocaleString("pt-BR"),
    size: Math.round(file.size / 1024),
    owner: "Você",
    content: file
  };
  renderFiles();
});

// ==================== Compartilhar ====================
function shareItem(name, item) {
  const target = fileSystem.compartilhados.children;
  let newName = name;
  let i = 1;
  while (target[newName]) {
    newName = `${name} (${i++})`;
  }
  target[newName] = { ...item, sharedBy: "Você" };
  alert(`"${name}" compartilhado.`);
  if (currentView === "compartilhados") renderFiles();
}

// ==================== Lixeira (arquivos normais) ====================
function moveToTrash(name) {
  const children = getCurrentChildren();
  const item = children[name];
  if (!item) return;
  let newName = name;
  let i = 1;
  while (fileSystem.lixeira.children[newName]) {
    newName = `${name} (${i++})`;
  }
  // marca origem para restaurar depois (raiz ou outra view)
  item.origin = currentView;
  fileSystem.lixeira.children[newName] = item;
  delete children[name];
  renderFiles();
}

// ==================== Lixeira (notas) ====================
function moveNoteToTrash(id) {
  const notes = fileSystem.notion.children;
  const note = notes[id];
  if (!note) return;
  // assegura chave única na lixeira
  let newKey = id;
  let i = 1;
  while (fileSystem.lixeira.children[newKey]) {
    newKey = `${id}(${i++})`;
  }
  note.origin = "notion";
  fileSystem.lixeira.children[newKey] = note;
  delete notes[id];
  renderFiles();
}

// ==================== Restauração (ajustada) ====================
function restoreItem(name) {
  const item = fileSystem.lixeira.children[name];
  if (!item) return;

  // Se o item possui origin, restaura para lá; caso contrário, restaura para raiz
  const origin = item.origin || "raiz";

  // Se origin for notion, restauramos como nota (chave única por id)
  if (origin === "notion") {
    // cria chave única usando id ou título
    const notes = fileSystem.notion.children;
    let newKey = (item.id) ? item.id : `note_${Date.now()}`;
    let i = 1;
    while (notes[newKey]) {
      newKey = `${newKey}(${i++})`;
    }
    notes[newKey] = item;
    delete fileSystem.lixeira.children[name];
    renderFiles();
    return;
  }

  // Restaurar para raiz (com checagem de nome único) - mantém comportamento original
  let newName = name;
  let i = 1;
  while (fileSystem.raiz.children[newName]) {
    newName = `${name} (${i++})`;
  }
  fileSystem.raiz.children[newName] = item;
  delete fileSystem.lixeira.children[name];
  renderFiles();
}

// ==================== Exclusão permanente (ajustada) ====================
function deletePermanent(name) {
  if (!confirm(`Excluir permanentemente "${name}"?`)) return;
  delete fileSystem.lixeira.children[name];
  renderFiles();
}

// ==================== Ordenação ====================
function parseDateBR(str) {
  if (!str) return 0;
  const [datePart, timePart = "00:00:00"] = str.split(" ");
  const [d, m, y] = datePart.split("/");
  return new Date(`${y}-${m}-${d}T${timePart}`).getTime();
}

function sortFiles(criteria) {
  const children = getCurrentChildren();
  let items = Object.entries(children);

  if (lastSort.criteria === criteria) {
    lastSort.asc = !lastSort.asc;
  } else {
    lastSort.criteria = criteria;
    lastSort.asc = true;
  }
  const mult = lastSort.asc ? 1 : -1;

  items.sort((a, b) => {
    const A = a[1], B = b[1];
    if (criteria === "name") return a[0].localeCompare(b[0]) * mult;
    if (criteria === "date") return (parseDateBR(A.date) - parseDateBR(B.date)) * mult;
    if (criteria === "size") return ((A.size || 0) - (B.size || 0)) * mult;
    if (criteria === "owner") return ((A.owner || "").localeCompare(B.owner || "")) * mult;
    return 0;
  });

  const ordered = {};
  for (const [k, v] of items) ordered[k] = v;

  fileSystem[currentView].children = ordered;
  renderFiles();
}

// ==================== Ordenação exclusiva do Notion ====================
function sortNotion(criteria) {
    const notes = fileSystem.notion.children;
    let items = Object.entries(notes);

    if (lastSort.criteria === criteria) {
        lastSort.asc = !lastSort.asc;
    } else {
        lastSort.criteria = criteria;
        lastSort.asc = true;
    }
    const mult = lastSort.asc ? 1 : -1;

    items.sort((a, b) => {
        const A = a[1];
        const B = b[1];

        if (criteria === "noteImportance") {
            // normaliza possíveis valores
            const normA = (A.importance || "").toString().toLowerCase();
            const normB = (B.importance || "").toString().toLowerCase();
            const order = { "baixa": 1, "média": 2, "media": 2, "alta": 3, "urgente": 4 };
            return ( (order[normA]||0) - (order[normB]||0) ) * mult;
        }

        if (criteria === "noteDate") {
            // compara datas (strings no formato yyyy-mm-dd do input type=date)
            const dateA = A.date ? new Date(A.date) : new Date(0);
            const dateB = B.date ? new Date(B.date) : new Date(0);
            return (dateA - dateB) * mult;
        }

        return 0;
    });

    const ordered = {};
    for (const [k, v] of items) ordered[k] = v;
    fileSystem.notion.children = ordered;

    renderFiles();
}

// ==================== Dropdown de Ordenação ====================
sortBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  sortOptions.classList.toggle("show");
});

sortOptions.querySelectorAll("div").forEach(opt => {
  opt.addEventListener("click", (e) => {
    e.stopPropagation();
    const crit = opt.dataset.sort;

    // Se estiver no Notion, usa a ordenação do Notion (inclui noteImportance e noteDate)
    if (currentView === "notion" && (crit === "noteImportance" || crit === "noteDate")) {
        sortNotion(crit);
    } else {
        sortFiles(crit);
    }

    sortOptions.classList.remove("show");
  });
});

// Fechar dropdown se clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest("#sortOptions") && !e.target.closest("#sortBtn")) {
    sortOptions.classList.remove("show");
  }
});

// ==================== Navegação na Sidebar ====================
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    currentView = item.dataset.view;
    folderStack = [currentView]; // Reseta a navegação de pastas
    updatePathDisplay();
    renderFiles();
  });
});

// ==================== NOTION: criar / editar / fechar modal ====================

// Gera um id seguro (fallback se crypto não existir)
function generateId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

function openNewNoteModal() {
  if (!newNoteModal) return;
  noteModalTitle.textContent = "Nova Nota";
  noteTitleInput.value = "";
  noteDateInput.value = "";
  noteThemeInput.value = "";
  noteImportanceInput.value = "média";
  noteDescriptionInput.value = "";
  // guarda estado de edição em atributo do modal
  newNoteModal.dataset.editing = "";
  newNoteModal.classList.add("show");
  newNoteModal.setAttribute("aria-hidden", "false");

  // criar vs salvar (clean handlers)
  createNoteBtn.onclick = createNote;
}

function closeNewNoteModal() {
  if (!newNoteModal) return;
  newNoteModal.classList.remove("show");
  newNoteModal.setAttribute("aria-hidden", "true");
  newNoteModal.dataset.editing = "";
}

// criar nota
function createNote() {
  const title = noteTitleInput.value.trim();
  if (!title) {
    alert("Digite um título para a nota.");
    return;
  }
  const id = generateId();
  fileSystem.notion.children[id] = {
    id,
    type: "note",
    title,
    date: noteDateInput.value || "",
    theme: noteThemeInput.value || "",
    importance: noteImportanceInput.value || "média",
    description: noteDescriptionInput.value || ""
  };
  closeNewNoteModal();
  renderFiles();
}

// abrir edição
function openEditNote(id) {
  const note = fileSystem.notion.children[id];
  if (!note) return;
  noteModalTitle.textContent = "Editar Nota";
  noteTitleInput.value = note.title || "";
  noteDateInput.value = note.date || "";
  noteThemeInput.value = note.theme || "";
  noteImportanceInput.value = note.importance || "média";
  noteDescriptionInput.value = note.description || "";

  newNoteModal.dataset.editing = id;
  newNoteModal.classList.add("show");
  newNoteModal.setAttribute("aria-hidden", "false");

  createNoteBtn.onclick = () => saveNoteEdit(id);
}

function saveNoteEdit(id) {
  const note = fileSystem.notion.children[id];
  if (!note) return;
  const title = noteTitleInput.value.trim();
  if (!title) {
    alert("Digite um título para a nota.");
    return;
  }
  note.title = title;
  note.date = noteDateInput.value || "";
  note.theme = noteThemeInput.value || "";
  note.importance = noteImportanceInput.value || "média";
  note.description = noteDescriptionInput.value || "";

  closeNewNoteModal();
  renderFiles();
}

// botão cancelar do modal
if (cancelNoteBtn) cancelNoteBtn.addEventListener("click", closeNewNoteModal);

// ==================== DOWNLOADS ====================

// Download de nota como .txt
function downloadNoteAsTxt(id) {
  const note = fileSystem.notion.children[id];
  if (!note) return alert("Nota não encontrada.");

  const header = `Título: ${note.title}\nData: ${note.date}\nTema: ${note.theme}\nImportância: ${note.importance}\n\n`;
  const body = note.description || "";
  const content = header + body;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const filename = `${sanitizeFilename(note.title || 'nota')}.txt`;
  triggerDownloadBlob(blob, filename);
}

// Download de item (arquivo ou pasta)
// Se for arquivo com .content (File), baixa o arquivo real. Se for pasta, gera .txt concatenado.
function downloadItem(name, item) {
  if (!item) return;
  if (item.type === 'file') {
    // se existe File no campo content, baixe ele diretamente
    if (item.content instanceof File) {
      const url = URL.createObjectURL(item.content);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      // cria txt com metadados
      const text = `Arquivo: ${name}\nData: ${item.date || '-'}\nTamanho: ${item.size || '-'} KB\nDono: ${item.owner || '-'}\n`;
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      triggerDownloadBlob(blob, `${sanitizeFilename(name)}.txt`);
    }
  } else if (item.type === 'folder') {
    // download da pasta como .txt concatenado (recursivo)
    const content = downloadFolderAsText(getFolderRecursive(item));
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    triggerDownloadBlob(blob, `${sanitizeFilename(name)}.txt`);
  } else {
    // fallback: cria txt com info
    const text = `Item: ${name}\nTipo: ${item.type}\nData: ${item.date || '-'}\n`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    triggerDownloadBlob(blob, `${sanitizeFilename(name)}.txt`);
  }
}

// Gera uma string representando recursivamente o conteúdo de uma pasta
function getFolderRecursive(folderObj, path = '') {
  // folderObj é um objeto { children: { name: item, ... } } OR a referência exata ao objeto folder dentro fileSystem
  let out = '';
  const children = folderObj.children || folderObj; // suportar quando passa diretamente children
  for (const key of Object.keys(children)) {
    const it = children[key];
    const fullPath = path ? `${path}/${key}` : key;
    if (it.type === 'folder') {
      out += `--- Pasta: ${fullPath} ---\n`;
      out += getFolderRecursive(it, fullPath);
    } else if (it.type === 'file') {
      out += `Arquivo: ${fullPath}\nData: ${it.date || '-'}\nTamanho: ${it.size || '-'} KB\nDono: ${it.owner || '-'}\n`;
      if (it.content instanceof File) {
        out += `[Arquivo carregado: ${it.content.name} — não é possível inserir binário no TXT]\n\n`;
      } else {
        out += `Conteúdo: (não disponível)\n\n`;
      }
    } else if (it.type === 'note') {
      out += `Nota: ${fullPath}\nTítulo: ${it.title || '-'}\nData: ${it.date || '-'}\nImportância: ${it.importance || '-'}\nDescrição:\n${it.description || ''}\n\n`;
    } else {
      out += `${fullPath} — Tipo: ${it.type}\n\n`;
    }
  }
  return out;
}

// Constrói o texto final para download de pasta
function downloadFolderAsText(text) {
  const header = `Exportação de pasta - ${new Date().toLocaleString('pt-BR')}\n\n`;
  return header + text;
}

// utilitária para disparar download de Blob
function triggerDownloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// sanitiza nome de arquivo
function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').slice(0, 200);
}

// ==================== Restauração e exclusões auxiliares ====================
// mover nota para lixeira (usar moveNoteToTrash já definido)

// utilitária para exclusão direta a partir de chave da lixeira
function deleteNotePermanentByIdFromLixeiraKey(lixeiraKey) {
  delete fileSystem.lixeira.children[lixeiraKey];
  renderFiles();
}

// ==================== Inicialização e binds ====================
/* Mantive sua inicialização original: */
updatePathDisplay();
renderFiles();

/* Expondo funções globais (se algo no HTML chama diretamente) */
window.openNewFolderModal = openNewFolderModal;
window.goBack = goBack;
window.triggerUpload = triggerUpload;
window.toggleTheme = toggleTheme;
window.openNewNoteModal = openNewNoteModal;
window.openEditNote = openEditNote;
window.restoreItem = restoreItem;
window.deletePermanent = deletePermanent;
window.downloadItem = downloadItem;
window.downloadNoteAsTxt = downloadNoteAsTxt;

// ==================== FIM DO SCRIPT ====================
