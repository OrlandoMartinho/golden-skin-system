document.addEventListener('DOMContentLoaded', () => {
  // Inicializar variáveis globais
  let overviewData = {
    agendamentosHoje: 0,
    vendasDia: 0,
    mensagensNaoLidas: 0,
    novosClientes: 0
  };
  let recentActivities = [];

  // Função para buscar todos os dados necessários
  async function fetchAllData() {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access Token:', accessToken ? 'Present' : 'Missing');

      let agendamentos = [];
      let vendas = [];
      let mensagens = [];
      let usuarios = [];

      // Busca agendamentos
      const result1 = await getAllAppointments(accessToken);
      console.log('Agendamentos Result:', result1);
      if (result1.status === 200) {
        agendamentos = result1.data || [];
        console.log('Agendamentos Data:', agendamentos);
      } else {
        console.warn('Erro ao carregar agendamentos:', result1.status, result1.message);
      }

      // Busca vendas
      const result2 = await getAllShoppings(accessToken);
      console.log('Vendas Result:', result2);
      if (result2.status === 200) {
        vendas = result2.data || [];
        console.log('Vendas Data:', vendas);
      } else {
        console.warn('Erro ao carregar vendas:', result2.status, result2.message);
      }

      // Busca mensagens
      const result3 = await getAlllMessages(accessToken);
      console.log('Mensagens Result:', result3);
      if (result3.status === 200) {
        mensagens = result3.data || [];
        console.log('Mensagens Data:', mensagens);
      } else {
        console.warn('Erro ao carregar mensagens:', result3.status, result3.message);
      }

      // Busca usuários
      const result4 = await getAllUser(accessToken);
      console.log('Usuários Result:', result4);
      if (result4 === 200) {
        users = localStorage.getItem("users") || []
        console.log('Usuários Data:', usuarios);
      } else {
        console.warn('Erro ao carregar usuários:', result4.status, result4.message);
      }

      return { agendamentos, vendas, mensagens, usuarios };
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return { agendamentos: [], vendas: [], mensagens: [], usuarios: [] };
    }
  }

  // Função para atualizar os cards de visão geral
  function updateOverviewCards(data) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Contagem de agendamentos hoje
    overviewData.agendamentosHoje = data.agendamentos.filter(item => {
      const appointmentDate = new Date(item.appointmentDate);
      return appointmentDate.toDateString() === today.toDateString();
    }).length;

    // Total de vendas do dia
    overviewData.vendasDia = data.vendas
      .filter(item => {
        const saleDate = new Date(item.createdIn);
        return saleDate.toDateString() === today.toDateString();
      })
      .reduce((total, item) => total + (item.priceInCents / 100 || 0), 0);

    // Mensagens não lidas
    overviewData.mensagensNaoLidas = data.mensagens.filter(item => !item.read).length;

    // Novos clientes (usuários registrados hoje)
    overviewData.novosClientes = data.usuarios.filter(item => {
      const createdDate = new Date(item.createdIn);
      return createdDate.toDateString() === today.toDateString();
    }).length;

    // Atualizar DOM
    document.querySelector('.overview-card:nth-child(1) p').textContent = overviewData.agendamentosHoje;
    document.querySelector('.overview-card:nth-child(2) p').textContent = `AOA ${overviewData.vendasDia.toFixed(2)}`;
    document.querySelector('.overview-card:nth-child(3) p').textContent = overviewData.mensagensNaoLidas;
    document.querySelector('.overview-card:nth-child(4) p').textContent = overviewData.novosClientes;

    console.log('Overview cards updated:', overviewData);
  }

  // Função para atualizar a lista de atividades recentes
  function updateRecentActivities(data) {
    recentActivities = [];

    // Coletar atividades recentes
    data.agendamentos.forEach(item => {
      recentActivities.push({
        type: 'agendamento',
        description: `Novo agendamento: ${item.name} com ${item.employeeName}`,
        timestamp: new Date(item.appointmentDate)
      });
    });

    data.vendas.forEach(item => {
      recentActivities.push({
        type: 'venda',
        description: `Compra realizada: ${item.productName || 'Produto'} (AOA ${(item.priceInCents / 100).toFixed(2)})`,
        timestamp: new Date(item.createdIn)
      });
    });

    data.mensagens.forEach(item => {
      recentActivities.push({
        type: 'mensagem',
        description: `Nova mensagem de ${item.username}`,
        timestamp: new Date(item.createdIn)
      });
    });

    data.usuarios.forEach(item => {
      recentActivities.push({
        type: 'usuario',
        description: `Novo cliente registrado: ${item.name}`,
        timestamp: new Date(item.createdIn)
      });
    });

    // Ordenar por data (mais recente primeiro) e limitar a 4 itens
    recentActivities.sort((a, b) => b.timestamp - a.timestamp);
    recentActivities = recentActivities.slice(0, 4);

    // Atualizar DOM
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = '';

    recentActivities.forEach(activity => {
      const item = document.createElement('div');
      item.classList.add('activity-item');

      let iconClass;
      switch (activity.type) {
        case 'agendamento':
          iconClass = 'fas fa-calendar-check';
          break;
        case 'venda':
          iconClass = 'fas fa-shopping-cart';
          break;
        case 'mensagem':
          iconClass = 'far fa-comments';
          break;
        case 'usuario':
          iconClass = 'fas fa-user-plus';
          break;
      }

      item.innerHTML = `
        <i class="${iconClass}"></i>
        <div>
          <p>${activity.description}</p>
          <small>${formatTimestamp(activity.timestamp)}</small>
        </div>
      `;
      activityList.appendChild(item);
    });

    console.log('Recent activities updated:', recentActivities);
  }

  // Função para formatar timestamp
  function formatTimestamp(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 1) {
      return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    } else if (days === 1) {
      return 'Ontem, ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (hours >= 1) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `Há ${minutes || 1} minutos`;
    }
  }

  // Funções para ações rápidas
  window.addNewService = function () {
    showConfirmModal('Deseja adicionar um novo serviço?', 'addService');
  };

  window.addNewProduct = function () {
    showConfirmModal('Deseja adicionar um novo produto?', 'addProduct');
  };

  window.generateReport = function () {
    showConfirmModal('Deseja gerar um relatório?', 'generateReport');
  };

  window.manageUsers = function () {
    showConfirmModal('Deseja gerenciar usuários?', 'manageUsers');
  };

  // Função para confirmar ações
  window.confirmAction = function () {
    const modal = document.getElementById('confirm-modal');
    const messageElement = document.getElementById('confirm-message');
    const action = messageElement.dataset.action;

    console.log('Confirm Action:', action);

    switch (action) {
      case 'addService':
        window.location.href = 'admin-services.html#new';
        break;
      case 'addProduct':
        window.location.href = 'admin-products.html#new';
        break;
      case 'generateReport':
        window.location.href = 'admin-reports.html';
        break;
      case 'manageUsers':
        window.location.href = 'admin-users.html';
        break;
    }

    if (modal) {
      modal.classList.remove('active');
      console.log('Modal de confirmação fechado');
    }
    alert('Ação realizada com sucesso!');
  };

  // Função para fechar modal
  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      console.log(`Modal ${modalId} fechado`);
    } else {
      console.error(`Modal ${modalId} não encontrado`);
    }
  };

  // Função para mostrar modal de confirmação
  function showConfirmModal(message, action) {
    const modal = document.getElementById('confirm-modal');
    const messageElement = document.getElementById('confirm-message');

    if (modal && messageElement) {
      messageElement.textContent = message;
      messageElement.dataset.action = action;
      modal.classList.add('active');
      console.log('Confirm modal shown:', { message, action });
    } else {
      console.error('Elementos do modal não encontrados.');
    }
  }

  // // Função para atualizar notificações
  // async function updateNotifications() {
  //   try {
  //     const accessToken = localStorage.getItem('accessToken');
  //     const notifications = await getNotifications(accessToken);;
  //     console.log('Notifications Result:', notifications);

  //     if (notifications && Array.isArray(notifications)) {
  //       const notificationBadge = document.getElementById('TotalDeNotificacoes');
  //       notificationBadge.textContent = notifications.length;

  //       const notificationContainer = document.getElementById('notification-container');
  //       notificationContainer.innerHTML = '';

  //       notifications.forEach(notification => {
  //         const div = document.createElement('div');
  //         div.classList.add('notification-item');
  //         div.innerHTML = `
  //           <p>${notification.message}</p>
  //           <small>${formatTimestamp(new Date(notification.createdAt))}</small>
  //         `;
  //         notificationContainer.appendChild(div);
  //       });

  //       console.log('Notifications updated:', notifications.data);
  //     } else {
  //       console.warn('Erro ao carregar notificações:', notifications.status, notifications.message);
  //     }
  //   } catch (error) {
  //     console.error('Erro ao buscar notificações:', error);
  //   }
  // }

  // Função para gerenciar o menu lateral
  function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    console.log('Sidebar toggled');
  }

  // Event listeners
  document.querySelector('.menu-toggle').addEventListener('click', toggleSidebar);
  document.querySelector('.close-sidebar').addEventListener('click', toggleSidebar);
  document.querySelector('.overlay').addEventListener('click', toggleSidebar);

  // Busca inicial de dados
  async function initializeDashboard() {
    const data = await fetchAllData();
    updateOverviewCards(data);
    updateRecentActivities(data);
    
    console.log('Dashboard initialized');
  }

  initializeDashboard();
});