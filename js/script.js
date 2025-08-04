'use strict';

let demandas = [
  {
    id: 'card-tabuleiro',
    nome: 'Card da Tabuleiro',
    prazo: '2025-08-01',
    checklist: [
      'Briefing realizado',
      'Arte criada',
      'Revisão interna',
      'Enviado ao cliente',
      'Aprovada/Concluída'
    ],
    checklistValores: [150, 200, 100, 50, 90],
    responsavel: 'Equipe',
    tempoEstimado: 6,
    tempoGasto: 6,
    concluido: false,
    checklistChecked: [],
    servicos: []
  },
  {
    id: 'card-oficina-coral',
    nome: 'Card inscrição Oficina de canto coral',
    prazo: '2025-08-01',
    checklist: [
      'Card para inscrição criado',
      'Formulário para inscrição pronto',
      'Aplicação das marcas para camisa e squeeze',
      'Card início das aulas criado',
      'Banner local da oficina criado'
    ],
    checklistValores: [100, 80, 90, 70, 60],
    responsavel: 'Itana',
    tempoEstimado: 8,
    tempoGasto: 7,
    concluido: false,
    checklistChecked: [],
    servicos: []
  },
  {
    id: 'fimucba',
    nome: 'FIMUCBA - Diagramação Festival',
    prazo: '2025-08-04',
    checklist: [
      'Briefing recebido',
      'Diagramação realizada',
      'Revisão interna',
      'Enviado ao cliente',
      'Aprovada/Concluída'
    ],
    checklistValores: [250, 300, 90, 75, 100],
    responsavel: 'Rose',
    tempoEstimado: 12,
    tempoGasto: 9,
    concluido: false,
    checklistChecked: [],
    servicos: []
  },
  {
    id: 'projeto-iaca',
    nome: 'Projeto Iaça',
    prazo: '2025-08-08',
    checklist: [
      'Briefing recebido',
      'Identidade visual aplicada',
      'Índice clicável criado',
      'Revisão interna',
      'Enviado ao cliente',
      'Feedbacks integrados'
    ],
    checklistValores: [180, 220, 150, 100, 90, 80],
    responsavel: 'Ana',
    tempoEstimado: 14,
    tempoGasto: 8,
    concluido: false,
    checklistChecked: [],
    servicos: []
  },
  {
    id: 'portfolio',
    nome: 'Revisar Portfolio',
    prazo: '2025-08-08',
    checklist: [
      'Alterações recebidas',
      'Atualização feita',
      'Revisão final',
      'Cliente informado'
    ],
    checklistValores: [100, 90, 80, 60],
    responsavel: 'Equipe',
    tempoEstimado: 5,
    tempoGasto: 2,
    concluido: false,
    checklistChecked: [],
    servicos: []
  },
  {
    id: 'contagem-regressiva',
    nome: 'Contagem regressiva lançamento do disco',
    prazo: '2025-08-10',
    checklist: [
      'Conceito definido',
      'Arte criada',
      'Revisão interna',
      'Publicação programada'
    ],
    checklistValores: [120, 200, 80, 110],
    responsavel: 'Equipe',
    tempoEstimado: 4,
    tempoGasto: 1,
    concluido: false,
    checklistChecked: [],
    servicos: []
  }
];

const LS_KEY = 'workflowCriativoDigitalData_v3';
const PAGAMENTO_LS_KEY = 'workflowPagamentosConfirmados_v1';

let pagamentosConfirmados = {};

function salvarLocal() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(demandas));
  } catch (e) {}
}

function carregarLocal() {
  try {
    const dataStr = localStorage.getItem(LS_KEY);
    if (!dataStr) return false;
    const data = JSON.parse(dataStr);
    if(Array.isArray(data)){
      data.forEach(d => {
        if(!('id' in d)) d.id = 'id_' + Math.random().toString(36).substr(2,9);
        if(!('checklistChecked' in d)) d.checklistChecked = [];
        if(!('servicos' in d)) d.servicos = [];
        if(!('checklist' in d)) d.checklist = [];
        if(!('checklistValores' in d)) d.checklistValores = new Array(d.checklist.length).fill(null);
        if(!('concluido' in d)) d.concluido = false;
      });
      demandas = data;
      return true;
    }
    return false;
  } catch(e) { return false; }
}

function salvarPagamentos(){
  try {
    localStorage.setItem(PAGAMENTO_LS_KEY, JSON.stringify(pagamentosConfirmados));
  } catch {}
}

function carregarPagamentos(){
  try {
    const str = localStorage.getItem(PAGAMENTO_LS_KEY);
    if (!str) return;
    pagamentosConfirmados = JSON.parse(str) || {};
  } catch {
    pagamentosConfirmados = {};
  }
}

function dateTextToISO(dateStr) {
  if(dateStr.includes('-')) return dateStr;
  if(dateStr.includes('/')) {
    const [d,m,y]=dateStr.split('/');
    return `${y}-${m.padStart(2,0)}-${d.padStart(2,0)}`;
  }
  return '';
}

function isWithinDeadline(dateStr) {
  if(!dateStr) return false;
  const d = new Date(dateStr + "T23:59:59");
  const today = new Date();
  today.setHours(0,0,0,0);
  return d >= today;
}

function calculateProgress(demanda) {
  const len = demanda.checklist.length || 1;
  const cks = demanda.checklistChecked?.filter(i=>i>=0&&i<len).length || 0;
  return Math.round((cks/len)*100);
}

function countChecked(demanda) {
  const len = demanda.checklist.length;
  return demanda.checklistChecked?.filter(i=>i>=0 && i<len).length || 0;
}

function createId(){
  return 'id_' + Math.random().toString(36).substr(2,9)+new Date().getTime();
}

function popularSelectDemandas() {
  // Campo de busca removido, nada para popular
}

function nomeParaId(nome){
  const d = demandas.find(d => d.nome.toLowerCase() === nome.toLowerCase());
  return d ? d.id : null;
}

function updateCardName(id, novoNome) {
  novoNome = novoNome.trim();
  if(!novoNome) return;
  const card = demandas.find(d => d.id === id);
  if(!card) return;
  card.nome = novoNome;
  salvarLocal();
  renderDemandas();
  atualizarEstatisticas();
}

function renderDemandas() {
  const container = document.getElementById('demandas');
  container.innerHTML = '';
  demandas.sort((a, b) => a.prazo.localeCompare(b.prazo));

  demandas.forEach(d => {
    const card = document.createElement('article');
    card.className = 'card-demanda';
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-labelledby', `titulo-${d.id}`);

    // Header
    const header = document.createElement('header');
    const title = document.createElement('h3');
    title.id = `titulo-${d.id}`;
    title.setAttribute('contenteditable', 'true');
    title.setAttribute('aria-label', `Nome do card, clique para editar`);
    title.spellcheck = false;
    title.textContent = d.nome;
    title.addEventListener('blur', () => updateCardName(d.id, title.textContent));
    title.addEventListener('keydown', e => {if(e.key === 'Enter'){ e.preventDefault(); title.blur();}});
    header.appendChild(title);

    const prazo = document.createElement('time');
prazo.className = 'prazo';
prazo.setAttribute('datetime', d.prazo);
prazo.title = 'Prazo';
prazo.textContent = (d.prazo && d.prazo.indexOf('-') === 4)
  ? d.prazo.split('-').reverse().join('/')
  : d.prazo;

prazo.style.cursor = 'pointer';
prazo.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'date';
  input.value = d.prazo;
  input.className = 'prazo';

  input.addEventListener('change', () => {
  if (input.value) {
    const novaData = input.value;
    d.prazo = novaData;

    // Atualiza o item na lista de demandas
    const index = demandas.findIndex(card => card.id === d.id);
    if (index !== -1) {
      demandas[index].prazo = novaData;
    }

    salvarCards();     // ← Aqui salva corretamente
    renderDemandas();  // ← Aqui reorganiza baseado na nova data
  }
});


  input.addEventListener('blur', () => {
    renderDemandas(); // força retorno visual mesmo se sair sem mudar
  });

  header.replaceChild(input, prazo);
  input.focus();
});
header.appendChild(prazo);



    const btnExcluirCard = document.createElement('button');
    btnExcluirCard.className = 'excluir-card';
    btnExcluirCard.title = `Excluir card "${d.nome}"`;
    btnExcluirCard.setAttribute('aria-label', `Excluir card ${d.nome}`);
    btnExcluirCard.textContent = '×';
    btnExcluirCard.type = 'button';
    btnExcluirCard.addEventListener('click', () => {
      if(confirm(`Confirma a exclusão do card "${d.nome}" e todos seus dados?`)){
        excluirCard(d.id);
      }
    });
    header.appendChild(btnExcluirCard);
    card.appendChild(header);

    // -- PAGAMENTO: BOTÃO + ETIQUETA
    const statusPago = !!pagamentosConfirmados[d.id];
    const pagamentoDiv = document.createElement('div');

    if(statusPago){
      const labelPago = document.createElement('span');
      labelPago.className = 'payment-label';
      labelPago.textContent = 'Pagamento confirmado';
      pagamentoDiv.appendChild(labelPago);
    }
    const btnPagamento = document.createElement('button');
    btnPagamento.className = 'btn-pagamento' + (statusPago ? ' reverter' : '');
    btnPagamento.type = 'button';
    btnPagamento.textContent = statusPago ? 'Reverter' : 'Confirmar Pagamento';
    btnPagamento.setAttribute('aria-label', (statusPago ? 'Reverter confirmação de pagamento' : 'Confirmar pagamento')+` para ${d.nome}`);

    btnPagamento.addEventListener('click', ()=>{
      pagamentosConfirmados[d.id] = !statusPago;
      salvarPagamentos();
      renderDemandas();
    });
    pagamentoDiv.appendChild(btnPagamento);

    pagamentoDiv.style.marginBottom = '8px';
    card.appendChild(pagamentoDiv);

    // Checklist
    const checklistDiv = document.createElement('div');
    checklistDiv.className = 'checklist';
    d.checklist.forEach((item, idx) => {
      const idChk = `${d.id}-check-${idx}`;
      const label = document.createElement('label');
      label.htmlFor = idChk;
      label.setAttribute('tabindex', '-1');
      const checked = (d.checklistChecked && d.checklistChecked.includes(idx));
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = idChk;
      checkbox.dataset.did = d.id;
      checkbox.dataset.index = idx;
      checkbox.checked = checked;
      label.appendChild(checkbox);

      const textSpan = document.createTextNode(' ' + item);
      label.appendChild(textSpan);

      if(d.checklistValores && d.checklistValores[idx] != null) {
        const valorSpan = document.createElement('span');
        valorSpan.className = 'item-valor';
        valorSpan.textContent = `R$ ${Number(d.checklistValores[idx]).toFixed(2)}`;
        label.appendChild(valorSpan);
      }

      const excluirItemBtn = document.createElement('button');
      excluirItemBtn.type = 'button';
      excluirItemBtn.className = 'excluir-item-btn';
      excluirItemBtn.title = `Excluir item: ${item}`;
      excluirItemBtn.setAttribute('aria-label', `Excluir item do checklist: ${item}`);
      excluirItemBtn.textContent = 'x';
      excluirItemBtn.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        if(confirm(`Confirma a exclusão do item "${item}" do checklist do card "${d.nome}"?`)){
          excluirItemChecklist(d.id, idx);
        }
      });
      label.appendChild(excluirItemBtn);
      checklistDiv.appendChild(label);
    });
    card.appendChild(checklistDiv);

    // Barra progresso
    const progress = calculateProgress(d);
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    const progressInner = document.createElement('div');
    progressInner.style.width = `${progress}%`;
    progressBar.appendChild(progressInner);
    card.appendChild(progressBar);

    // Texto progresso
    const progressText = document.createElement('p');
    progressText.className = 'progress-text';
    progressText.textContent = `Desempenho: ${progress}% concluído (${countChecked(d)} de ${d.checklist.length} etapas concluídas)`;
    card.appendChild(progressText);

    // Tempo gasto e prazo
    const infoTempo = document.createElement('p');
    infoTempo.style.fontSize = '13px';
    infoTempo.style.color = '#666';
    infoTempo.style.paddingTop = '0px';
    infoTempo.style.marginBottom = '6px';
    const dentroPrazo = isWithinDeadline(d.prazo);
     infoTempo.textContent = `Tempo estimado: ${d.tempoEstimado}h | Tempo gasto: ${d.tempoGasto}h | Entrega dentro do prazo? ${dentroPrazo ? '✔️ Sim' : '❌ Não'}`;
    card.appendChild(infoTempo);

    // Botão concluir
    const btnConcluir = document.createElement('button');
btnConcluir.className = 'concluir-btn';
btnConcluir.textContent = 'Marcar como Concluído';
btnConcluir.setAttribute('aria-label', `Marcar demanda ${d.nome} como concluída`);
btnConcluir.disabled = progress === 100;
btnConcluir.addEventListener('click', () => {
  concluirDemanda(d.id);
  // Atualizar o título do cartão
  const titulo = card.querySelector('h2'); // ajuste o seletor para o título do cartão
  if (titulo) {
    titulo.textContent = 'Cartão Concluído com Sucesso';
  }
  // Desabilitar o botão após clicar
  btnConcluir.disabled = true;
  btnConcluir.textContent = 'Concluído';
});
card.appendChild(btnConcluir);

    // Serviços
    const servicosDiv = document.createElement('div');
    servicosDiv.className = 'servicos-lista';
    servicosDiv.setAttribute('aria-live', 'polite');
    servicosDiv.setAttribute('aria-atomic', 'true');
    servicosDiv.setAttribute('aria-relevant', 'additions removals');
    if(d.servicos.length > 0){
      let ul = document.createElement('ul');
      d.servicos.forEach((s, i) => {
        let li = document.createElement('li');
        li.textContent = s;
        let btnRemover = document.createElement('button');
        btnRemover.className = 'servico-remover-btn';
        btnRemover.setAttribute('aria-label', `Remover serviço: ${s}`);
        btnRemover.textContent = '✕';
        btnRemover.title = 'Remover serviço';
        btnRemover.addEventListener('click', (e) => {
          e.stopPropagation();
          removerServico(d.id, i);
        });
        li.appendChild(btnRemover);
        ul.appendChild(li);
      });
      servicosDiv.appendChild(ul);
    } else {
      servicosDiv.textContent = 'Nenhuma observação adicionada';
    }
    card.appendChild(servicosDiv);

    // Adicionar novo serviço ao card
    const addServiceDiv = document.createElement('div');
    addServiceDiv.className = 'add-servico';
    addServiceDiv.setAttribute('role','group');
    addServiceDiv.setAttribute('aria-label', `Adicionar serviço para demanda ${d.nome}`);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Adicionar observação...';
    input.setAttribute('aria-label', `Novo serviço para ${d.nome}`);
    input.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){
        e.preventDefault();
        adicionarServico(d.id, input.value.trim());
        input.value = '';
      }
    });

    const btnAdd = document.createElement('button');
    btnAdd.type = 'button';
    btnAdd.textContent = '+';
    btnAdd.setAttribute('aria-label', `Adicionar serviço para demanda ${d.nome}`);
    btnAdd.addEventListener('click', () => {
      if(input.value.trim()) {
        adicionarServico(d.id, input.value.trim());
        input.value = '';
        input.focus();
      }
    });

    addServiceDiv.appendChild(input);
    addServiceDiv.appendChild(btnAdd);
    card.appendChild(addServiceDiv);
    container.appendChild(card);
  });
}

function salvarCards() {
  localStorage.setItem('cards', JSON.stringify(demandas));
}


function adicionarServico(demandaId, textoServico) {
  if(!textoServico) return;
  const demanda = demandas.find(d => d.id === demandaId);
  if(!demanda) return;
  if(!demanda.servicos) demanda.servicos = [];
  demanda.servicos.push(textoServico);
  salvarLocal();
  renderDemandas();
  atualizarEstatisticas();
}

function removerServico(demandaId, index) {
  const demanda = demandas.find(d => d.id === demandaId);
  if(!demanda || !demanda.servicos || !demanda.servicos[index]) return;
  demanda.servicos.splice(index, 1);
  salvarLocal();
  renderDemandas();
  atualizarEstatisticas();
}

function toggleChecklistItem(demandaId, index, checked) {
  const demanda = demandas.find(d => d.id === demandaId);
  if(!demanda) return;
  if(!demanda.checklistChecked) demanda.checklistChecked = [];
  let idx = demanda.checklistChecked.indexOf(index);
  if(checked){
    if(idx === -1) demanda.checklistChecked.push(index);
  } else {
    if(idx !== -1) demanda.checklistChecked.splice(idx,1);
  }
  demanda.checklistChecked.sort((a,b) => a-b);
  salvarLocal();
  atualizarEstatisticas();
}

function concluirDemanda(demandaId) {
  const d = demandas.find(x => x.id === demandaId);
  if (!d) return;
  d.checklistChecked = d.checklist.map((_, i) => i);
  d.concluido = true;
  salvarLocal();
  renderDemandas();
  atualizarEstatisticas();
}

function excluirItemChecklist(demandaId, idxItem) {
  const demanda = demandas.find(d => d.id === demandaId);
  if(!demanda) return;
  demanda.checklist.splice(idxItem, 1);
  if(demanda.checklistChecked){
    demanda.checklistChecked = demanda.checklistChecked
      .filter(i => i !== idxItem)
      .map(i => (i > idxItem ? i - 1 : i));
  }
  if(demanda.checklistValores){
    demanda.checklistValores.splice(idxItem, 1);
  }
  salvarLocal();
  renderDemandas();
  atualizarEstatisticas();
}

function excluirCard(cardId) {
  const idx = demandas.findIndex(d => d.id === cardId);
  if(idx === -1) return;
  demandas.splice(idx, 1);
  salvarLocal();
  renderDemandas();
  atualizarEstatisticas();
}

// --- CRIAR NOVO CARD E CHECKLIST ---
let checklist_novo_card = [];
let checklist_novo_card_valores = [];

function setupNovoCard() {
  const addBtn = document.getElementById('btn-add-checkitem');
  const input = document.getElementById('novo-card-item');
  const valorInput = document.getElementById('valor-item');
  const ul = document.getElementById('novo-card-list');

  input.value = '';
  valorInput.value = '';
  checklist_novo_card = [];
  checklist_novo_card_valores = [];

  function renderChecklist() {
    ul.innerHTML = '';
    checklist_novo_card.forEach((item, idx) => {
      const li = document.createElement('li');
      li.textContent = item;
      if(checklist_novo_card_valores[idx] != null  &&  checklist_novo_card_valores[idx] !== '')   {
        li.textContent += ` -------  R$ ${Number(checklist_novo_card_valores[idx]).toFixed(2)}`;
      }
      const rmv = document.createElement('button');
      rmv.type = 'button';
      rmv.textContent = 'Remover item';
      rmv.title = 'Remover item';
      rmv.className = 'remove-check';
      rmv.addEventListener('click', ()=> {
        checklist_novo_card.splice(idx,1);
        checklist_novo_card_valores.splice(idx,1);
        renderChecklist();
      });
      li.appendChild(rmv);
      ul.appendChild(li);
    });
  }

  addBtn.onclick = function() {
    const val = input.value.trim();
    let valItem = valorInput.value.trim();
    if(val){
      checklist_novo_card.push(val);
      const numericVal = valItem === '' ? null : parseFloat(valItem);
      checklist_novo_card_valores.push(numericVal);
      renderChecklist();
      input.value = '';
      valorInput.value = '';
      input.focus();
    } else {
      alert('Digite sua solicitação para adicionar como novo item.');
    }
  };

  input.onkeydown = function(e){
    if(e.key==='Enter'){
      e.preventDefault();
      addBtn.click();
    }
  };
  valorInput.onkeydown = function(e){
    if(e.key==='Enter'){
      e.preventDefault();
      addBtn.click();
    }
  };

  document.getElementById('btn-salvar-card').onclick = function() {
    const nome = document.getElementById('novo-card-nome').value.trim();
    const prazoData = document.getElementById('novo-card-prazo').value.trim();
    if(!nome || !prazoData) {
      alert('Preencha o nome e o prazo de entrega.');
      return;
    }
    if(checklist_novo_card.length === 0){
      if(!confirm('Nenhum item de checklist foi adicionado. Deseja criar o novo card mesmo assim?')) return;
    }
    const novoCard = {
      id: createId(),
      nome: nome,
      prazo: prazoData,
      checklist: [...checklist_novo_card],
      checklistValores: [...checklist_novo_card_valores],
      responsavel: 'Indefinido',
      tempoEstimado: 0,
      tempoGasto: 0,
      concluido: false,
      checklistChecked: [],
      servicos: []
    };
    demandas.push(novoCard);
    salvarLocal();
    checklist_novo_card = [];
    checklist_novo_card_valores = [];
    renderChecklist();
    document.getElementById('novo-card-nome').value = '';
    document.getElementById('novo-card-prazo').value = '';
    document.getElementById('valor-item').value = '';
    popularSelectDemandas();
    renderDemandas();
    atualizarEstatisticas();
  };
  renderChecklist();
}

function atualizarEstatisticas() {
  const total = demandas.length;
  const concluidas = demandas.filter(d => calculateProgress(d) === 100).length;
  const tempoMedio = total ? (demandas.reduce((acc, d) => acc + d.tempoGasto, 0) / total).toFixed(1) : 0;
  const progressoGeral = total ? Math.round(demandas.reduce((acc, d) => acc + calculateProgress(d), 0) / total) : 0;
  const atrasadas = demandas.filter(d => {
    if(calculateProgress(d) === 100) return false;
    return !isWithinDeadline(d.prazo);
  }).length;
  const maiorTempo = demandas.reduce((max, d) => d.tempoGasto > max.tempoGasto ? d : max, {tempoGasto: -1});
  document.getElementById('stats-concluidas').textContent = concluidas;
  document.getElementById('stats-tempo').textContent = tempoMedio;
  document.getElementById('stats-progresso').textContent = progressoGeral + '%';
  document.getElementById('stats-atraso').textContent = atrasadas;
  document.getElementById('stats-maior-tempo').textContent = maiorTempo && maiorTempo.tempoGasto >= 0 ? `${maiorTempo.nome} (${maiorTempo.tempoGasto}h)` : 'Nenhuma';
}

function setupServicoForm() {
  const form = document.getElementById('servico-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Campo "Demandas Cadastradas" foi removido. Adicione o serviço diretamente em um card existente.');
  });
  document.getElementById('btn-add-card').addEventListener('click', function(){
    document.getElementById('novo-card-nome').focus();
  });
}

function setupCheckboxListeners() {
  const container = document.getElementById('demandas');
  container.addEventListener('change', (e) => {
    if(e.target.matches('input[type="checkbox"]')){
      const demandId = e.target.getAttribute('data-did');
      const index = Number(e.target.getAttribute('data-index'));
      const checked = e.target.checked;
      toggleChecklistItem(demandId, index, checked);
      renderDemandas();
    }
  });
}
function enviarDemanda(demanda) {
  fetch('https://script.google.com/macros/s/AKfycbyGvqgfC1HMcU3_QBrLMvel0NLdHwZha0dDVFZmUN9ZRN_kClrwcPce-alKOKYRgfB0Lw/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(demanda)
  })
  .then(() => {
    console.log('Demanda enviada com sucesso!');
  })
  .catch(error => {
    console.error('Erro ao enviar demanda:', error);
  });
}

function init() {
  carregarPagamentos();
  if (!carregarLocal()) {
    demandas.forEach(d => { 
      if(!d.checklistChecked) d.checklistChecked = [];
      if(!d.servicos) d.servicos = [];
      if(!d.checklistValores) d.checklistValores = new Array(d.checklist.length).fill(null);
    });
  }
  popularSelectDemandas();
  renderDemandas();
  atualizarEstatisticas();
  setupServicoForm();
  setupNovoCard();
  setupCheckboxListeners();
}

window.onload = init;
