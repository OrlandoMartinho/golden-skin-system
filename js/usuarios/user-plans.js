document.addEventListener('DOMContentLoaded', async () => {
  const accessToken = localStorage.getItem('accessToken'); // Supondo que o token esteja armazenado no localStorage

  // Função para formatar preços
  const formatPrice = (priceInCents) => `R$ ${(priceInCents / 100).toFixed(2)}`;

  // Função para formatar datas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Função para carregar planos
  async function loadPlans() {
    const response = await getAllPlanss(accessToken);
    const plansList = document.querySelector('.plans-list');
    plansList.innerHTML = '';

    if (response.status === 200) {
      const plans = response.data;
      if (plans.length === 0) {
        plansList.innerHTML = `
          <div class="no-plans">
            <i class="fas fa-crown"></i>
            <p>Nenhum plano disponível</p>
          </div>`;
        return;
      }

      plans.forEach(plan => {
        const planItem = document.createElement('div');
        planItem.classList.add('plan-item');
        planItem.innerHTML = `
          <h3>${plan.name}</h3>
          <p class="plan-description">${plan.description}</p>
          <p class="plan-services"><strong>Serviços:</strong> ${plan.services}</p>
          <p class="plan-price">${plan.priceInCents/100} AOA</p>
          <button class="subscribe-button" data-id="${plan.idPlan}" ${!plan.status ? 'disabled' : ''}>
            ${plan.status ? 'Assinar' : 'Indisponível'}
          </button>
        `;
        plansList.appendChild(planItem);
      });

      // Adicionar eventos aos botões de assinatura
      document.querySelectorAll('.subscribe-button').forEach(button => {
        button.addEventListener('click', async (e) => {
          const idPlan = Number(e.target.dataset.id);
          const response = await registerSubscriber(accessToken, { idPlan });
          if (response.status === 200) {
            showMessageModal('success', 'Sucesso!', 'Assinatura realizada com sucesso', { buttonText: 'Ótimo!' });
            loadSubscriptions(); // Atualiza a aba de subscrições
          } else {
            showMessageModal('error', 'Erro!', `Falha ao assinar: ${response.error.message}`, { buttonText: 'Entendido' });
          }
        });
      });
    } else {
      plansList.innerHTML = `
        <div class="no-plans">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Erro ao carregar planos</p>
        </div>`;
    }
  }

  // Função para carregar subscrições
  async function loadSubscriptions() {
    const response = await getAllSubscribers(accessToken);
    const subscriptionsList = document.querySelector('.subscriptions-list');
    subscriptionsList.innerHTML = '';

    if (response.status === 200) {
      const subscriptions = response.data;
      if (subscriptions.length === 0) {
        subscriptionsList.innerHTML = `
          <div class="no-subscriptions">
            <i class="fas fa-user-check"></i>
            <p>Nenhuma subscrição ativa</p>
          </div>`;
        return;
      }

      subscriptions.forEach(subscription => {
        console.log(subscription);
        const subscriptionItem = document.createElement('div');
        subscriptionItem.classList.add('subscription-item');
        subscriptionItem.innerHTML = `
          <h3>${subscription.subscriberName}</h3>
          <p><strong>Plano ID:</strong> ${subscription.planName}</p>
          <p><strong>Data de Início:</strong> ${subscription.startDate || "Não confirmado"}</p>
          <p><strong>Última Atualização:</strong> ${subscription.endDate || "Não confirmado"}</p>
          <div class="subscription-actions">
            <button class="cancel-subscription" data-id="${subscription.idSubscriber}">Cancelar</button>
          </div>
        `;
        subscriptionsList.appendChild(subscriptionItem);
      });

      // Adicionar eventos aos botões de cancelamento
      document.querySelectorAll('.cancel-subscription').forEach(button => {
        button.addEventListener('click', async (e) => {
          const idSubscriber = Number(e.target.dataset.id);
          showConfirmModal(`Tem certeza que deseja cancelar a subscrição ${idSubscriber}?`, `deleteSubscriber-${idSubscriber}`);
        });
      });
    } else {
      subscriptionsList.innerHTML = `
        <div class="no-subscriptions">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Erro ao carregar subscrições</p>
        </div>`;
    }
  }

  // Função para mostrar o modal de confirmação
  function showConfirmModal(message, action) {
    const modal = document.getElementById('confirm-modal');
    const messageElement = document.getElementById('confirm-message');
    if (!modal || !messageElement) return;

    messageElement.textContent = message;
    messageElement.dataset.action = action;
    modal.classList.add('active');
  }

  // Adicionar evento para o botão de confirmação do modal
  const confirmButton = document.getElementById('confirm-button');
  if (confirmButton) {
    confirmButton.addEventListener('click', async () => {
      const modal = document.getElementById('confirm-modal');
      const messageElement = document.getElementById('confirm-message');
      const action = messageElement.dataset.action;
      const originalConfirmText = confirmButton.innerHTML;
      confirmButton.innerHTML = `<span class="button-loader"></span>Processando...`;
      confirmButton.disabled = true;

      try {
        if (action.startsWith('deleteSubscriber-')) {
          const idSubscriber = parseInt(action.split('-')[1]);
          const response = await deleteAnySubscriber(accessToken, idSubscriber);
          if (response.status === 200) {
            showMessageModal('success', 'Sucesso!', 'Subscrição cancelada com sucesso', { buttonText: 'Ótimo!' });
            loadSubscriptions();
          } else {
            showMessageModal('error', 'Erro!', `Falha ao cancelar: ${response.error.message}`, { buttonText: 'Entendido' });
          }
        }
      } catch (error) {
        showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar a ação', { buttonText: 'Entendido' });
      } finally {
        confirmButton.innerHTML = originalConfirmText;
        confirmButton.disabled = false;
        modal.classList.remove('active');
      }
    });
  }

  
  // Alternar entre abas
  const tabs = document.querySelectorAll('.plans-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.plans-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.plans-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });

  // Adicionar classe ativa ao item do menu
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelector('.nav-item[href="user-plans.html"]').classList.add('active');

  // Inicializar carregamento
  await loadPlans();
  await loadSubscriptions();
});