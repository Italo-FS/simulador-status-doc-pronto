// Status possíveis para certidões
const statusCertidao = {
  "Não iniciado": { interno: "Não iniciado", externo: "Em andamento" },
  "Aguardando emissão": { interno: "Aguardando emissão", externo: "Em andamento" },
  "Aguardando orçamento": { interno: "Aguardando orçamento", externo: "Em andamento" },
  "Aguardando pagamento do orçamento": { interno: "Aguardando pagamento do orçamento", externo: "Em andamento" },
  "Pendente pelo cliente": { interno: "Pendente pelo cliente", externo: "Pendente pelo cliente" },
  "Respondida pelo cliente": { interno: "Respondida pelo cliente", externo: "Em andamento" },
  "Dispensada pelo cliente": { interno: "Dispensada pelo cliente", externo: "Dispensada" },
  "Emitida": { interno: "Emitida", externo: "Emitida" },
  "Não foi possível emitir": { interno: "Não foi possível emitir", externo: "Não foi possível emitir" }
};

const statusPesquisado = {
  "Pendente": "Pendente",
  "Em andamento": "Em andamento",
  "Concluído": "Concluído",
  "Dispensado pelo cliente": "Dispensado pelo cliente",
  "Não iniciado": "Não iniciado"
}

const statusPedido = {
  "Pendente": "Pendente",
  "Em andamento": "Em andamento",
  "Concluído": "Concluído",
  "Dispensado pelo cliente": "Dispensado pelo cliente",
  "Não iniciado": "Não iniciado"
}

// Estado inicial do pedido
let pedido = {
  pesquisados: [
    {
      id: 1,
      certidoes: [
        { id: 1, status: "Não iniciado" },
        { id: 2, status: "Não iniciado" }
      ]
    },
    {
      id: 2,
      certidoes: [
        { id: 1, status: "Não iniciado" },
        { id: 2, status: "Não iniciado" }
      ]
    }
  ]
};

// Função para calcular o status de um pesquisado baseado em suas certidões
function calcularStatusPesquisado(certidoes) {
  // 1. Pendente - se houver ao menos uma certidão com status Pendente pelo cliente
  if (certidoes.some(c => c.status === statusCertidao["Pendente pelo cliente"].interno)) {
    return statusPesquisado["Pendente"];
  }

  // 2. Em andamento - se houver ao menos uma certidão com status específicos
  const statusAndamento = [
    statusCertidao["Aguardando emissão"].interno,
    statusCertidao["Aguardando orçamento"].interno,
    statusCertidao["Aguardando pagamento do orçamento"].interno,
    statusCertidao["Respondida pelo cliente"].interno
  ];
  if (certidoes.some(c => statusAndamento.includes(c.status))) {
    return statusPesquisado["Em andamento"];
  }

  // 3. Dispensado pelo cliente - se TODAS as certidões forem Dispensada pelo cliente
  if (certidoes.every(c => c.status === "Dispensada pelo cliente")) {
    return statusPesquisado["Dispensado pelo cliente"];
  }

  // 4. Concluído - se TODAS as certidões forem Emitida
  if (certidoes.every(c => c.status === "Emitida")) {
    return statusPesquisado["Concluído"];
  }

  // 5. Em andamento (complementar) - se houver ao menos uma Emitida e nenhuma das regras acima se aplicar
  if (certidoes.some(c => c.status === "Emitida")) {
    return statusPesquisado["Em andamento"];
  }

  // 6. Não iniciado - se TODAS as certidões forem exclusivamente Não iniciado
  if (certidoes.every(c => c.status === "Não iniciado")) {
    return statusPesquisado["Não iniciado"];
  }

  // Fallback
  return statusPesquisado["Em andamento"];
}

// Função para calcular o status do pedido baseado nos pesquisados
function calcularStatusPedido(pesquisados) {
  // 1. Pendente - se pelo menos um pesquisado estiver com status Pendente
  if (pesquisados.some(p => p.status === statusPesquisado["Pendente"])) {
    return statusPedido["Pendente"];
  }

  // 2. Em andamento - se pelo menos um pesquisado estiver com status Em andamento
  if (pesquisados.some(p => p.status === statusPesquisado["Em andamento"])) {
    return statusPedido["Em andamento"];
  }

  // 3. Concluído - se todos os pesquisados estiverem com status Concluído ou Dispensado pelo cliente
  const statusConcluido = [statusPesquisado["Concluído"], statusPesquisado["Dispensado pelo cliente"]];
  if (pesquisados.every(p => statusConcluido.includes(p.status))) {
    return statusPedido["Concluído"];
  }

  // 4. Não iniciado - se todos os pesquisados estiverem exclusivamente com status Não iniciado
  if (pesquisados.every(p => p.status === statusPesquisado["Não iniciado"])) {
    return statusPedido["Não iniciado"];
  }

  // Fallback
  return "Em andamento";
}

function addCertidao(pesquisado) {
  const novaCertidaoId = pesquisado.certidoes.length + 1;
  pesquisado.certidoes.push({
    id: novaCertidaoId,
    status: statusPesquisado["Não iniciado"]
  });
  atualizarInterface();
}

function removeCertidao(pesquisado, certidaoId) {
  pesquisado.certidoes = pesquisado.certidoes.filter(certidao => certidao.id !== certidaoId);
  atualizarInterface();
}

function addPesquisado(pedido) {
  const novoPesquisadoId = pedido.pesquisados.length + 1;
  pedido.pesquisados.push({
    id: novoPesquisadoId,
    certidoes: [
      { id: 1, status: statusCertidao["Não iniciado"].interno },
      { id: 2, status: statusCertidao["Não iniciado"].interno }
    ]
  });
  atualizarInterface();
}

function removePesquisado(pesquisadoId) {
  pedido.pesquisados = pedido.pesquisados.filter(pesquisado => pesquisado.id !== pesquisadoId);
  atualizarInterface();
}

// Função para atualizar a interface
function atualizarInterface() {
  const container = document.getElementById('pesquisadosContainer');
  container.innerHTML = '';

  // Calcular status de cada pesquisado
  pedido.pesquisados.forEach(pesquisado => {
    pesquisado.status = calcularStatusPesquisado(pesquisado.certidoes);

    const pesquisadoDiv = document.createElement('div');
    pesquisadoDiv.className = 'pesquisado';

    const pesquisadoHeader = document.createElement('div');
    pesquisadoHeader.style.display = 'flex';
    pesquisadoHeader.style.justifyContent = 'space-between';
    pesquisadoHeader.style.alignItems = 'center';
    pesquisadoHeader.style.marginBottom = '10px';

    const pesquisadoTitle = document.createElement('h3');
    pesquisadoTitle.textContent = `Pesquisado ${pesquisado.id}`;

    const pesquisadoStatus = document.createElement('span');
    pesquisadoStatus.className = `pedido-status status-${pesquisado.status.toLowerCase().replaceAll(' ', '-')}`;
    pesquisadoStatus.textContent = pesquisado.status;

    pesquisadoHeader.appendChild(pesquisadoTitle);
    pesquisadoHeader.appendChild(pesquisadoStatus);

    pesquisadoDiv.appendChild(pesquisadoHeader);

    // Lista de certidões
    pesquisado.certidoes.forEach(certidao => {
      const certidaoDiv = document.createElement('div');
      certidaoDiv.className = 'certidao-item';

      const certidaoActions = document.createElement('div');
      certidaoActions.className = 'certidao-actions';

      const certidaoInfo = document.createElement('div');
      certidaoInfo.textContent = `Certidão ${certidao.id}`;

      const certidaoStatus = document.createElement('select');
      certidaoStatus.dataset.pesquisadoId = pesquisado.id;
      certidaoStatus.dataset.certidaoId = certidao.id;

      Object.values(statusCertidao).forEach(status => {
        const option = document.createElement('option');
        option.value = status.interno;
        option.textContent = status.interno;
        if (status.interno === certidao.status) {
          option.selected = true;
        }
        certidaoStatus.appendChild(option);
      });

      certidaoStatus.addEventListener('change', function () {
        const pesquisadoId = parseInt(this.dataset.pesquisadoId);
        const certidaoId = parseInt(this.dataset.certidaoId);

        const pesquisado = pedido.pesquisados.find(p => p.id === pesquisadoId);
        const certidao = pesquisado.certidoes.find(c => c.id === certidaoId);
        certidao.status = this.value;

        atualizarInterface();
      });

      const certidaoRemove = document.createElement('button');
      certidaoRemove.className = 'btn btn-remove';
      certidaoRemove.textContent = 'X';
      certidaoRemove.addEventListener('click', () => removeCertidao(pesquisado, certidao.id));

      
      certidaoDiv.appendChild(certidaoInfo);

      certidaoActions.appendChild(certidaoStatus);
      certidaoActions.appendChild(certidaoRemove);
      certidaoDiv.appendChild(certidaoActions);
      
      pesquisadoDiv.appendChild(certidaoDiv);
    });

    const pesquisadoActions = document.createElement('div');
    pesquisadoActions.className = 'pesquisado-actions';

    // Botão para adicionar certidão
    const addCertidaoBtn = document.createElement('button');
    addCertidaoBtn.className = 'btn btn-add';
    addCertidaoBtn.textContent = 'Adicionar Certidão';
    addCertidaoBtn.addEventListener('click', () => addCertidao(pesquisado));

    // Botão para remover pesquisado
    const removePesquisadoBtn = document.createElement('button');
    removePesquisadoBtn.className = 'btn btn-remove';
    removePesquisadoBtn.textContent = 'Remover Pesquisado';
    removePesquisadoBtn.addEventListener('click', () => removePesquisado(pesquisado.id));
    
    pesquisadoActions.appendChild(addCertidaoBtn);
    pesquisadoActions.appendChild(removePesquisadoBtn);

    pesquisadoDiv.appendChild(pesquisadoActions);

    container.appendChild(pesquisadoDiv);
  });

  // Atualizar status do pedido
  const statusPedido = calcularStatusPedido(pedido.pesquisados);
  const pedidoStatusElement = document.getElementById('pedidoStatus');
  pedidoStatusElement.textContent = statusPedido;
  pedidoStatusElement.className = `pedido-status status-${statusPedido.toLowerCase().replace(' ', '-')}`;
}

// Função para adicionar um novo pesquisado
document.getElementById('addPesquisado').addEventListener('click', () => addPesquisado(pedido));

// Função para resetar o pedido ao estado inicial
document.getElementById('resetBtn').addEventListener('click', function () {
  pedido = {
    pesquisados: [
      {
        id: 1,
        certidoes: [
          { id: 1, status: statusCertidao["Não iniciado"].interno },
          { id: 2, status: statusCertidao["Não iniciado"].interno }
        ]
      },
      {
        id: 2,
        certidoes: [
          { id: 1, status: statusCertidao["Não iniciado"].interno },
          { id: 2, status: statusCertidao["Não iniciado"].interno }
        ]
      }
    ]
  };
  atualizarInterface();
});

// Função para atribuir status aleatórios
document.getElementById('randomBtn').addEventListener('click', function () {
  pedido.pesquisados.forEach(pesquisado => {
    pesquisado.certidoes.forEach(certidao => {
      const randomIndex = Math.floor(Math.random() * Object.values(statusCertidao).length);
      certidao.status = Object.values(statusCertidao)[randomIndex].interno;
    });
  });
  atualizarInterface();
});

// Inicializar a interface
atualizarInterface();