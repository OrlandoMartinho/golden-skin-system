// user-history.js
document.addEventListener('DOMContentLoaded', async () => {
  const accessToken = localStorage.getItem('accessToken'); // Supondo que o token esteja armazenado no localStorage
  const api_host = 'https://your-api-url.com'; // Substitua pela URL real da API

  // Função para formatar datas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Função para carregar agendamentos
  async function loadAppointments() {
    const response = await getAllAppointments(accessToken);
    const servicesList = document.querySelector('#services-tab .history-list');
    servicesList.innerHTML = ''; // Limpa a lista estática

    if (response.status === 200) {
      const appointments = response.data;
      if (appointments.length === 0) {
        servicesList.innerHTML = `
          <div class="no-history">
            <i class="fas fa-calendar-times"></i>
            <p>Nenhum agendamento encontrado</p>
          </div>`;
        return;
      }

      appointments.forEach(appointment => {
        const statusText = appointment.status ? 'Concluído' : 'Pendente';
        const statusClass = appointment.status ? 'status-completed' : 'status-pending';

        const item = document.createElement('div');
        item.classList.add('history-item');
        item.setAttribute('data-status', appointment.status ? 'completed' : 'pending');
        item.setAttribute('data-date', formatDate(appointment.appointmentDate));
        item.innerHTML = `
          <div class="history-info">
            <h3>${appointment.Services.name}</h3>
            <p>Profissional: ${appointment.employeeName}</p>
            <p>Duração: ${appointment.Services.duration} minutos | ${formatDate(appointment.appointmentDate)} - ${appointment.appointmentTime}</p>
          </div>
          <div class="history-meta">
            <div class="history-status ${statusClass}">${statusText}</div>
            <div class="history-amount">R$ ${(appointment.Services.priceInCents / 100).toFixed(2)}</div>
            <button class="edit-appointment" data-id="${appointment.idAppointment}">Editar</button>
            <button class="delete-appointment" data-id="${appointment.idAppointment}">Excluir</button>
          </div>
        `;
        servicesList.appendChild(item);
      });

      // Adicionar eventos para botões de edição e exclusão
      document.querySelectorAll('.edit-appointment').forEach(button => {
        button.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          const appointment = await getAnyAppointment(accessToken, id);
          // Exemplo: Abrir modal para edição com dados de appointment.data
          console.log('Editar agendamento:', appointment.data);
        });
      });

      document.querySelectorAll('.delete-appointment').forEach(button => {
        button.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          const response = await deleteAnyAppointment(accessToken, id);
          if (response.status === 200) {
            loadAppointments(); // Recarrega a lista após exclusão
          }
        });
      });
    } else {
      servicesList.innerHTML = `
        <div class="no-history">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Erro ao carregar agendamentos</p>
        </div>`;
      console.error('Erro ao carregar agendamentos:', response.error);
    }
  }

  // Função para carregar compras
  async function loadShoppings() {
    const response = await getAllShoppings(accessToken);
    const purchasesList = document.querySelector('#purchases-tab .history-list');
    purchasesList.innerHTML = ''; // Limpa a lista estática

    if (response.status === 200) {
      const shoppings = response.data;
      if (shoppings.length === 0) {
        purchasesList.innerHTML = `
          <div class="no-history">
            <i class="fas fa-shopping-bag"></i>
            <p>Nenhuma compra encontrada</p>
          </div>`;
        return;
      }

      shoppings.forEach(shopping => {
        const statusText = shopping.status === 'delivered' ? 'Entregue' : shopping.status === 'processing' ? 'Processando' : 'Cancelado';
        const statusClass = shopping.status === 'delivered' ? 'status-completed' : shopping.status === 'processing' ? 'status-pending' : 'status-cancelled';

        const item = document.createElement('div');
        item.classList.add('history-item');
        item.setAttribute('data-status', shopping.status);
        item.setAttribute('data-date', formatDate(shopping.createdIn));
        item.innerHTML = `
          <div class="history-info">
            <h3>Pedido #PD-${shopping.idShopping}</h3>
            <p>${shopping.PurchaseProducts.map(p => p.productName).join(', ')}</p>
            <p>Data: ${formatDate(shopping.createdIn)} | Método: ${shopping.PurchaseProducts[0]?.paymentMethod || 'N/A'}</p>
          </div>
          <div class="history-meta">
            <div class="history-status ${statusClass}">${statusText}</div>
            <div class="history-amount">R$ ${(shopping.PurchaseProducts.reduce((sum, p) => sum + p.priceInCents, 0) / 100).toFixed(2)}</div>
            <button class="edit-shopping" data-id="${shopping.idShopping}">Editar</button>
            <button class="delete-shopping" data-id="${shopping.idShopping}">Excluir</button>
          </div>
        `;
        purchasesList.appendChild(item);
      });

      // Adicionar eventos para botões de edição e exclusão
      document.querySelectorAll('.edit-shopping').forEach(button => {
        button.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          const shopping = await getAnyShopping(accessToken, id);
          // Exemplo: Abrir modal para edição com dados de shopping.data
          console.log('Editar compra:', shopping.data);
        });
      });

      document.querySelectorAll('.delete-shopping').forEach(button => {
        button.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          const response = await deleteAnyShopping(accessToken, id);
          if (response.status === 200) {
            loadShoppings(); // Recarrega a lista após exclusão
          }
        });
      });
    } else {
      purchasesList.innerHTML = `
        <div class="no-history">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Erro ao carregar compras</p>
        </div>`;
      console.error('Erro ao carregar compras:', response.error);
    }
  }

  // Função para filtrar agendamentos
  function filterAppointments() {
    const statusFilter = document.querySelector('#service-status-filter').value;
    const monthFilter = document.querySelector('#service-month-filter').value;
    const items = document.querySelectorAll('#services-tab .history-item');

    items.forEach(item => {
      const status = item.dataset.status;
      const date = item.dataset.date;
      const itemMonth = date.slice(3, 10); // Formato MM/YYYY

      const statusMatch = statusFilter === 'all' || status === statusFilter;
      const monthMatch = !monthFilter || itemMonth === monthFilter.replace('-', '/');

      item.style.display = statusMatch && monthMatch ? 'flex' : 'none';
    });
  }

  // Função para filtrar compras
  function filterShoppings() {
    const statusFilter = document.querySelector('#purchase-status-filter').value;
    const monthFilter = document.querySelector('#purchase-month-filter').value;
    const items = document.querySelectorAll('#purchases-tab .history-item');

    items.forEach(item => {
      const status = item.dataset.status;
      const date = item.dataset.date;
      const itemMonth = date.slice(3, 10); // Formato MM/YYYY

      const statusMatch = statusFilter === 'all' || status === statusFilter;
      const monthMatch = !monthFilter || itemMonth === monthFilter.replace('-', '/');

      item.style.display = statusMatch && monthMatch ? 'flex' : 'none';
    });
  }

  // Alternar entre abas
  const tabs = document.querySelectorAll('.history-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.history-content').forEach(c => c.classList.remove('active'));

      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });

  // Adiciona listeners para os filtros
  document.querySelector('#service-status-filter').addEventListener('change', filterAppointments);
  document.querySelector('#service-month-filter').addEventListener('change', filterAppointments);
  document.querySelector('#purchase-status-filter').addEventListener('change', filterShoppings);
  document.querySelector('#purchase-month-filter').addEventListener('change', filterShoppings);

  // Adiciona classe ativa ao item do menu de histórico
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'user-history.html') {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector('.nav-item[href="user-history.html"]')?.classList.add('active');
  }

  // Inicializar carregamento
  await loadAppointments();
  await loadShoppings();
});