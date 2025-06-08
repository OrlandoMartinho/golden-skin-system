document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    let plansData = [];
    let subscribersData = [];
    let usersData = [];
    let servicesData = [];
async function initializeData() {
    try {
       

        // Initialize Services
      
        const servicesResult = await getAllServices(accessToken);
     
        if (servicesResult === 200) {
            const storedServices = localStorage.getItem('services');
            servicesData = storedServices ? JSON.parse(storedServices) : [];
          
            populateServicesDropdown(servicesData);
        } else {
            showMessageModal('error', 'Erro!', 'Falha ao carregar serviços', { buttonText: 'Entendido' });
        }

      
        const usersResult = await getAllUser(accessToken);
        if (usersResult === 200) {
            const storedUsers = localStorage.getItem('users');
            usersData = storedUsers ? JSON.parse(storedUsers) : [];
        
            populateEmailDropdown(usersData);
        } else {
            showMessageModal('error', 'Erro!', 'Falha ao carregar usuários', { buttonText: 'Entendido' });
        }

       
        const plansResult = await getAllPlanss(accessToken);
        
        if (plansResult.status === 200) {
            const storedPlans = localStorage.getItem('plans');
            plansData = storedPlans ? JSON.parse(storedPlans) : [];

            populatePlansTable(plansData);
      
            populatePlanDropdown(plansData);

            populateSubscriberPlanFilter(plansData);
      
        } else {
            showMessageModal('error', 'Erro!', 'Falha ao carregar planos', { buttonText: 'Entendido' });
        }

        // Initialize Subscribers
       
        const subscribersResult = await getAllSubscribers(accessToken);
  
        if (subscribersResult === 200) {
            const storedSubscribers = localStorage.getItem('subscribers');
            subscribersData = storedSubscribers ? JSON.parse(storedSubscribers) : [];
        
            populateSubscribersTable(subscribersData);
        } else {
            showMessageModal('error', 'Erro!', 'Falha ao carregar assinantes', { buttonText: 'Entendido' });
        }

       
    } catch (error) {
        console.error('Erro ao inicializar dados:', error);
        showMessageModal('error', 'Erro!', 'Falha ao inicializar a aplicação', { buttonText: 'Entendido' });
    }
}

    function populatePlansTable(plans) {
        const tbody = document.querySelector('.plans-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        plans.forEach((plan) => {
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${plan.description || '-'}</td>
                <td>${plan.type || '-'}</td>
                <td>${((plan.priceInCents || 0) / 100).toFixed(2)}</td>
                <td>${plan.services}</td>
                <td><span class="status-${plan.status ? 'active' : 'inactive'}">${plan.status ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="action-btn" onclick="editPlan(${plan.idPlan})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deletePlan(${plan.idPlan})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function populateSubscribersTable(subscribers) {
        const tbody = document.querySelector('.subscribers-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        subscribers.forEach((subscriber) => {
            const plan = plansData.find(p => p.idPlan === subscriber.planId) || {};
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subscriber.email || '-'}</td>
                <td>${plan.name || '-'}</td>
                <td>${subscriber.startDate ? new Date(subscriber.startDate).toLocaleDateString('pt-BR') : '-'}</td>
                <td><span class="status-${subscriber.status}">${subscriber.status === 'active' ? 'Ativo' : subscriber.status === 'inactive' ? 'Inativo' : 'Cancelado'}</span></td>
                <td>
                    <button class="action-btn" onclick="editSubscriber(${subscriber.idSubscriber})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteSubscriber(${subscriber.idSubscriber})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function populateServicesDropdown(services) {
        const servicesSelect = document.getElementById('plan-services');
        if (!servicesSelect) return;

        servicesSelect.innerHTML = '';
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.idService;
            option.textContent = service.name;
            servicesSelect.appendChild(option);
        });
    }

    function populateEmailDropdown(users) {
        const emailSelect = document.getElementById('subscriber-email');
        if (!emailSelect) return;

        emailSelect.innerHTML = '<option value="">Selecione um email</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.email;
            option.textContent = user.email;
            emailSelect.appendChild(option);
        });
    }

    function populatePlanDropdown(plans) {
        const planSelect = document.getElementById('subscriber-plan');
        if (!planSelect) return;

        planSelect.innerHTML = '<option value="">Selecione um plano</option>';
        plans.filter(plan => plan.status).forEach(plan => {
            const option = document.createElement('option');
            option.value = plan.idPlan;
            option.textContent = plan.name;
            planSelect.appendChild(option);
        });
    }

    function populateSubscriberPlanFilter(plans) {
        const planFilter = document.getElementById('subscriber-plan-filter');
        if (!planFilter) return;

        planFilter.innerHTML = '<option value="all">Todos os planos</option>';
        plans.filter(plan => plan.status).forEach(plan => {
            const option = document.createElement('option');
            option.value = plan.idPlan;
            option.textContent = plan.name;
            planFilter.appendChild(option);
        });
    }

    window.openTab = function (tabName) {
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));

        const tabLinks = document.querySelectorAll('.tab-link');
        tabLinks.forEach(link => link.classList.remove('active'));

        const targetTab = document.getElementById(tabName);
        if (targetTab) targetTab.classList.add('active');

        const targetLink = Array.from(tabLinks).find(link => link.getAttribute('onclick').includes(tabName));
        if (targetLink) targetLink.classList.add('active');
    };

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    };

    window.confirmAction = async function () {
        const modal = document.getElementById('confirm-modal');
        const messageElement = document.getElementById('confirm-message');
        const action = messageElement.dataset.action;
        const confirmButton = document.getElementById('confirm-button');

        const originalConfirmText = confirmButton.innerHTML;
        confirmButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        confirmButton.disabled = true;

        try {
            if (action.startsWith('deletePlan-')) {
                const planId = parseInt(action.split('-')[1]);
                const result = await deleteAnyPlan(accessToken, planId);
                if (result.status === 200) {
                    plansData = plansData.filter(p => p.idPlan !== planId);
                    populatePlansTable(plansData);
                    populatePlanDropdown(plansData);
                    populateSubscriberPlanFilter(plansData);
                    showMessageModal('success', 'Sucesso!', 'Plano eliminado com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao excluir o plano', { buttonText: 'Entendido' });
                }
            } else if (action.startsWith('deleteSubscriber-')) {
                const subscriberId = parseInt(action.split('-')[1]);
                const result = await deleteAnySubscriber(accessToken, subscriberId);
                if (result === 200) {
                    subscribersData = subscribersData.filter(s => s.idSubscriber !== subscriberId);
                    populateSubscribersTable(subscribersData);
                    showMessageModal('success', 'Sucesso!', 'Assinante eliminado com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao excluir o assinante', { buttonText: 'Entendido' });
                }
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', `Ocorreu um erro ao processar a ação`, { buttonText: 'Entendido' });
        } finally {
            confirmButton.innerHTML = originalConfirmText;
            confirmButton.disabled = false;
            modal.classList.remove('active');
        }
    };

    window.openAddPlanModal = function () {
        const modal = document.getElementById('plan-modal');
        const form = document.getElementById('plan-form');
        const title = document.getElementById('modal-title');

        if (!modal || !form || !title) return;

        title.textContent = 'Adicionar Plano';
        form.reset();
        const servicesSelect = document.getElementById('plan-services');
        if (servicesSelect) {
            Array.from(servicesSelect.options).forEach(option => option.selected = false);
        }
        delete form.dataset.planId;
        modal.classList.add('active');
    };

    window.openAddSubscriberModal = function () {
        const modal = document.getElementById('subscriber-modal');
        const form = document.getElementById('subscriber-form');
        const title = document.getElementById('subscriber-modal-title');

        if (!modal || !form || !title) return;

        title.textContent = 'Adicionar Assinante';
        form.reset();
        delete form.dataset.subscriberId;
        modal.classList.add('active');
    };

    window.editPlan = async function (planId) {
        const modal = document.getElementById('plan-modal');
        const form = document.getElementById('plan-form');
        const title = document.getElementById('modal-title');

        if (!modal || !form || !title || !planId) {
            showMessageModal('error', 'Erro!', 'Plano não encontrado', { buttonText: 'Entendido' });
            return;
        }

        try {
            const result = await getAnyPlan(accessToken, planId);
            if (result.status === 200) {
                const plan = JSON.parse(localStorage.getItem('plan'));
                if (plan) {
                    localStorage.setItem('idPlan', plan.idPlan);
                    title.textContent = 'Editar Plano';
                    document.getElementById('plan-name').value = plan.name || '';
                    document.getElementById('plan-type').value = plan.type || '';
                    document.getElementById('plan-price').value = ((plan.priceInCents || 0) / 100).toFixed(2);
                    document.getElementById('plan-description').value = plan.description || '';
                    document.getElementById('plan-status').value = plan.status ? 'active' : 'inactive';
                    
                    const servicesSelect = document.getElementById('plan-services');
                    if (servicesSelect && Array.isArray(plan.services)) {
                        Array.from(servicesSelect.options).forEach(option => {
                            option.selected = plan.services.includes(option.value);
                        });
                    }
                    
                    form.dataset.planId = plan.idPlan;
                    modal.classList.add('active');
                } else {
                    showMessageModal('error', 'Erro!', 'Plano não encontrado', { buttonText: 'Entendido' });
                }
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar o plano', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao carregar o plano', { buttonText: 'Entendido' });
        }
    };

    window.editSubscriber = async function (subscriberId) {
        const modal = document.getElementById('subscriber-modal');
        const form = document.getElementById('subscriber-form');
        const title = document.getElementById('subscriber-modal-title');

        if (!modal || !form || !title || !subscriberId) {
            showMessageModal('error', 'Erro!', 'Assinante não encontrado', { buttonText: 'Entendido' });
            return;
        }

        try {
            const result = await getSubscriber(accessToken, subscriberId);
            if (result === 200) {
                const subscriber = JSON.parse(localStorage.getItem('subscriber'));
                if (subscriber) {
                    localStorage.setItem('idSubscriber', subscriber.idSubscriber);
                    title.textContent = 'Editar Assinante';
                    document.getElementById('subscriber-email').value = subscriber.email || '';
                    document.getElementById('subscriber-plan').value = subscriber.planId || '';
                    document.getElementById('subscriber-start-date').value = subscriber.startDate ? subscriber.startDate.split('T')[0] : '';
                    document.getElementById('subscriber-status').value = subscriber.status || 'active';
                    form.dataset.subscriberId = subscriber.idSubscriber;
                    modal.classList.add('active');
                } else {
                    showMessageModal('error', 'Erro!', 'Assinante não encontrado', { buttonText: 'Entendido' });
                }
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar o assinante', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao carregar o assinante', { buttonText: 'Entendido' });
        }
    };

    window.deletePlan = function (planId) {
        showConfirmModal(`Tem certeza que deseja excluir o plano ${planId}?`, `deletePlan-${planId}`);
    };

    window.deleteSubscriber = function (subscriberId) {
        showConfirmModal(`Tem certeza que deseja excluir o assinante ${subscriberId}?`, `deleteSubscriber-${subscriberId}`);
    };

    document.getElementById('plan-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        submitButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        submitButton.classList.add('button-loading');
        submitButton.disabled = true;

        const planId = parseInt(e.target.dataset.planId) || null;
        const name = document.getElementById('plan-name').value.trim();
        const type = document.getElementById('plan-type').value.trim();
        const price = parseFloat(document.getElementById('plan-price').value);
        const servicesSelect = document.getElementById('plan-services');
        const services = Array.from(servicesSelect.options)
            .filter(option => option.selected)
            .map(option => option.textContent);
        const description = document.getElementById('plan-description').value.trim();
        const status = document.getElementById('plan-status').value === 'active';

        if (!name || !type || isNaN(price) || services.length === 0) {
            showMessageModal('error', 'Erro!', 'Por favor, preencha todos os campos obrigatórios.', {
                buttonText: 'Entendido',
            });
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
            return;
        }

        if (price < 0) {
            showMessageModal('error', 'Erro!', 'O preço não pode ser negativo.', { buttonText: 'Entendido' });
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
            return;
        }
   
     
        const servicesString = services.toString()
        const planData = {
            name,
            type,
            priceInCents: Math.round(price * 100),
            services:servicesString,
            description,
            status,
        };

        try {
            if (planId) {
                planData.idPlan = planId;
                
                const response = await editAnyPlan(accessToken, planData);
                if (response.status === 200) {
                    const index = plansData.findIndex(p => p.idPlan === planId);
                    if (index !== -1) {
                        plansData[index] = { ...plansData[index], ...planData, updatedIn: new Date().toISOString() };
                        populatePlansTable(plansData);
                        populatePlanDropdown(plansData);
                        populateSubscriberPlanFilter(plansData);
                        showMessageModal('success', 'Sucesso!', 'Plano atualizado com sucesso', { buttonText: 'Ótimo!' });
                    }
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao atualizar o plano', { buttonText: 'Entendido' });
                }
            } else {
               
                const response = await addAnyPlan(accessToken, planData);
                if (response.status === 200) {
                    const result = await getAllPlanss(accessToken);
                   
                    plansData = JSON.parse(localStorage.getItem('plans')) || [];
                   
                    populatePlansTable(plansData);
                    populatePlanDropdown(plansData);
                    populateSubscriberPlanFilter(plansData);
                    showMessageModal('success', 'Sucesso!', 'Plano criado com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao criar o plano', { buttonText: 'Entendido' });
                }
            }
            closeModal('plan-modal');
            e.target.dataset.planId = '';
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar o plano', { buttonText: 'Entendido' });
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
        }
    });

    document.getElementById('subscriber-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        submitButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        submitButton.classList.add('button-loading');
        submitButton.disabled = true;

        const subscriberId = parseInt(e.target.dataset.subscriberId) || null;
        const email = document.getElementById('subscriber-email').value;
        const planId = parseInt(document.getElementById('subscriber-plan').value);
        const startDate = document.getElementById('subscriber-start-date').value;
        const status = document.getElementById('subscriber-status').value;

        if (!email || !planId || !startDate) {
            showMessageModal('error', 'Erro!', 'Por favor, preencha todos os campos obrigatórios.', {
                buttonText: 'Entendido',
            });
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
            return;
        }

        const subscriberData = {
            email,
            planId,
            startDate,
            status,
        };

        try {
            if (subscriberId) {
                subscriberData.idSubscriber = subscriberId;
                const response = await editAnySubscriber(accessToken, subscriberData);
                if (response === 200) {
                    const index = subscribersData.findIndex(s => s.idSubscriber === subscriberId);
                    if (index !== -1) {
                        subscribersData[index] = { ...subscribersData[index], ...subscriberData, updatedIn: new Date().toISOString() };
                        populateSubscribersTable(subscribersData);
                        showMessageModal('success', 'Sucesso!', 'Assinante atualizado com sucesso', { buttonText: 'Ótimo!' });
                    }
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao atualizar o assinante', { buttonText: 'Entendido' });
                }
            } else {
                const response = await addSubscriber(accessToken, subscriberData);
                if (response === 200) {
                    await getAllSubscribers(accessToken);
                    subscribersData = JSON.parse(localStorage.getItem('subscribers')) || [];
                    populateSubscribersTable(subscribersData);
                    showMessageModal('success', 'Sucesso!', 'Assinante criado com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao criar o assinante', { buttonText: 'Entendido' });
                }
            }
            closeModal('subscriber-modal');
            e.target.dataset.subscriberId = '';
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar o assinante', { buttonText: 'Entendido' });
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
        }
    });

    const planSearchInput = document.getElementById('plan-search');
    const planStatusFilter = document.getElementById('plan-status-filter');
    const planTypeFilter = document.getElementById('plan-type-filter');

    function filterPlans() {
        if (!planSearchInput || !planStatusFilter || !planTypeFilter) return;

        const search = planSearchInput.value.toLowerCase().trim();
        const statusFilterValue = planStatusFilter.value;
        const typeFilterValue = planTypeFilter.value;

        const filteredPlans = plansData.filter(plan => {
            const matchesSearch = (plan.name || '').toLowerCase().includes(search);
            const matchesStatus =
                statusFilterValue === 'all' ||
                (statusFilterValue === 'active' && plan.status) ||
                (statusFilterValue === 'inactive' && !plan.status);
            const matchesType =
                typeFilterValue === 'all' || (plan.type || '').toLowerCase() === typeFilterValue.toLowerCase();
            return matchesSearch && matchesStatus && matchesType;
        });
        populatePlansTable(filteredPlans);
    }

    if (planSearchInput) planSearchInput.addEventListener('input', filterPlans);
    if (planStatusFilter) planStatusFilter.addEventListener('change', filterPlans);
    if (planTypeFilter) planTypeFilter.addEventListener('change', filterPlans);

    const subscriberSearchInput = document.getElementById('subscriber-search');
    const subscriberStatusFilter = document.getElementById('subscriber-status-filter');
    const subscriberPlanFilter = document.getElementById('subscriber-plan-filter');

    function filterSubscribers() {
        if (!subscriberSearchInput || !subscriberStatusFilter || !subscriberPlanFilter) return;

        const search = subscriberSearchInput.value.toLowerCase().trim();
        const statusFilterValue = subscriberStatusFilter.value;
        const planFilterValue = subscriberPlanFilter.value;

        const filteredSubscribers = subscribersData.filter(subscriber => {
            const matchesSearch = (subscriber.email || '').toLowerCase().includes(search);
            const matchesStatus =
                statusFilterValue === 'all' || subscriber.status === statusFilterValue;
            const matchesPlan =
                planFilterValue === 'all' || subscriber.planId === parseInt(planFilterValue);
            return matchesSearch && matchesStatus && matchesPlan;
        });
        populateSubscribersTable(filteredSubscribers);
    }

    if (subscriberSearchInput) subscriberSearchInput.addEventListener('input', filterSubscribers);
    if (subscriberStatusFilter) subscriberStatusFilter.addEventListener('change', filterSubscribers);
    if (subscriberPlanFilter) subscriberPlanFilter.addEventListener('change', filterSubscribers);

    function showConfirmModal(message, action) {
        const modal = document.getElementById('confirm-modal');
        const messageElement = document.getElementById('confirm-message');
        if (!modal || !messageElement) return;

        messageElement.textContent = message;
        messageElement.dataset.action = action;
        modal.classList.add('active');
    }

    await initializeData();
});