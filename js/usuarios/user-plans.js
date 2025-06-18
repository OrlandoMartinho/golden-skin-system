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
          <p class="plan-price">${formatPrice(plan.priceInCents)} / ${plan.type}</p>
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
            alert('Assinatura realizada com sucesso!');
            loadSubscriptions(); // Atualiza a aba de subscrições
          } else {
            alert(`Erro ao assinar: ${response.error.message}`);
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
        const subscriptionItem = document.createElement('div');
        subscriptionItem.classList.add('subscription-item');
        subscriptionItem.innerHTML = `
          <h3>${subscription.subscriberName}</h3>
          <p><strong>Plano ID:</strong> ${subscription.idPlan}</p>
          <p><strong>Data de Início:</strong> ${formatDate(subscription.createdIn)}</p>
          <p><strong>Última Atualização:</strong> ${formatDate(subscription.updatedIn)}</p>
          <div class="subscription-actions">
            <button class="update-subscription" data-id="${subscription.idSubscriber}" data-plan="${subscription.idPlan}">Atualizar Plano</button>
            <button class="cancel-subscription" data-id="${subscription.idSubscriber}">Cancelar</button>
          </div>
        `;
        subscriptionsList.appendChild(subscriptionItem);
      });

      // Adicionar eventos aos botões de atualização e cancelamento
      document.querySelectorAll('.update-subscription').forEach(button => {
        button.addEventListener('click', async (e) => {
          const idSubscriber = Number(e.target.dataset.id);
          const newPlanId = prompt('Digite o novo ID do plano:');
          if (newPlanId) {
            const response = await updateSubscriber(accessToken, { idPlan: Number(newPlanId) });
            if (response.status === 200) {
              alert('Plano atualizado com sucesso!');
              loadSubscriptions();
            } else {
              alert(`Erro ao atualizar: ${response.error.message}`);
            }
          }
        });
      });

      document.querySelectorAll('.cancel-subscription').forEach(button => {
        button.addEventListener('click', async (e) => {
          const idSubscriber = Number(e.target.dataset.id);
          if (confirm('Tem certeza que deseja cancelar esta subscrição?')) {
            const response = await deleteSubscriber(accessToken, idSubscriber);
            if (response.status === 200) {
              alert('Subscrição cancelada com sucesso!');
              loadSubscriptions();
            } else {
              alert(`Erro ao cancelar: ${response.error.message}`);
            }
          }
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