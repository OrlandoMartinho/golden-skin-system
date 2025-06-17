document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    let appointmentsData = [];
    let usersData = [];
    let servicesData = [];
    let employeesData = [];

    async function initializeData() {
        try {
            // Initialize Users
            const usersResult = await getAllUser(accessToken);
            if (usersResult === 200) {
                const storedUsers = localStorage.getItem('users');
                usersData = storedUsers ? JSON.parse(storedUsers) : [];
                employeesData = usersData.filter(user => user.role === 1);
                populateEmailDropdown(usersData);
                populateEmployeeDropdown(employeesData);
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar usuários', { buttonText: 'Entendido' });
            }

            // Initialize Services
            const servicesResult = await getAllServices(accessToken);
            if (servicesResult === 200) {
                const storedServices = localStorage.getItem('services');
                servicesData = storedServices ? JSON.parse(storedServices) : [];
                populateServiceDropdown(servicesData);
                populateServiceFilter(servicesData);
                populateAppointmentDropdown(appointmentsData);
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar serviços', { buttonText: 'Entendido' });
            }

            // Initialize Appointments
            const appointmentsResult = await getAllAppointments(accessToken);
            if (appointmentsResult.status === 200) {
                const storedAppointments = localStorage.getItem('appointments');
                appointmentsData = storedAppointments ? JSON.parse(storedAppointments) : [];
                populateAppointmentsTable(appointmentsData);
                populateEmployeeAssignmentTable(appointmentsData);
                populateAppointmentDropdown(appointmentsData);
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar agendamentos', { buttonText: 'Entendido' });
            }
        } catch (error) {
            console.error('Erro ao inicializar dados:', error);
            showMessageModal('error', 'Erro!', 'Falha ao inicializar a aplicação', { buttonText: 'Entendido' });
        }
    }

    function populateAppointmentsTable(appointments) {
        const tbody = document.querySelector('.appointments-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        appointments.forEach((appointment) => {
            const service = servicesData.find(s => s.idService === appointment.idService) || {};
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.name || '-'}</td>
                <td>${appointment.email || '-'}</td>
                <td>${appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('pt-BR') : '-'}</td>
                <td>${appointment.appointmentTime || '-'}</td>
                <td>${service.name || '-'}</td>
                <td>${appointment.employeeName || '-'}</td>
                <td><span class="status-${appointment.status ? 'active' : 'inactive'}">${appointment.status ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="action-btn" onclick="editAppointment(${appointment.idAppointment})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteAppointment(${appointment.idAppointment})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function populateEmployeeAssignmentTable(appointments) {
        const tbody = document.querySelector('.employee-assignment-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        appointments.forEach((appointment) => {
            const service = servicesData.find(s => s.idService === appointment.idService) || {};
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.name || '-'}</td>
                <td>${appointment.email || '-'}</td>
                <td>${appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('pt-BR') : '-'}</td>
                <td>${appointment.appointmentTime || '-'}</td>
                <td>${service.name || '-'}</td>
                <td>${appointment.employeeName || '-'}</td>
                <td>
                    <button class="action-btn" onclick="openAssignEmployeeModal(${appointment.idAppointment})">
                        <i class="fas fa-user-plus"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function populateEmailDropdown(users) {
        const emailSelect = document.getElementById('appointment-email');
        if (!emailSelect) return;

        emailSelect.innerHTML = '<option value="">Selecione um email</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.email;
            option.textContent = user.email;
            emailSelect.appendChild(option);
        });
    }

    function populateEmployeeDropdown(employees) {
        const employeeSelect = document.getElementById('employee-id');
        if (!employeeSelect) return;

        employeeSelect.innerHTML = '<option value="">Selecione um funcionário</option>';
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.idUser;
            option.textContent = `${employee.name} (${employee.email})`;
            option.dataset.name = employee.name;
            option.dataset.email = employee.email;
            option.dataset.phone = employee.phoneNumber;
            employeeSelect.appendChild(option);
        });
    }

    function populateServiceDropdown(services) {
        const serviceSelect = document.getElementById('appointment-service');
        if (!serviceSelect) return;

        serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>';
        services.filter(service => service.status).forEach(service => {
            const option = document.createElement('option');
            option.value = service.idService;
            option.textContent = service.name;
            serviceSelect.appendChild(option);
        });
    }

    function populateServiceFilter(services) {
        const serviceFilter = document.getElementById('appointment-service-filter');
        const employeeServiceFilter = document.getElementById('employee-assignment-service-filter');
        if (!serviceFilter || !employeeServiceFilter) return;

        serviceFilter.innerHTML = '<option value="all">Todos os serviços</option>';
        employeeServiceFilter.innerHTML = '<option value="all">Todos os serviços</option>';
        services.filter(service => service.status).forEach(service => {
            const option = document.createElement('option');
            option.value = service.idService;
            option.textContent = service.name;
            serviceFilter.appendChild(option.cloneNode(true));
            employeeServiceFilter.appendChild(option);
        });
    }

    function populateAppointmentDropdown(appointments) {
        const appointmentSelect = document.getElementById('employee-appointment');
        if (!appointmentSelect) return;

        appointmentSelect.innerHTML = '<option value="">Selecione um agendamento</option>';
        appointments.filter(appointment => appointment.status).forEach(appointment => {
            const service = servicesData.find(s => s.idService === appointment.idService) || {};
            const option = document.createElement('option');
            option.value = appointment.idAppointment;
            option.textContent = `${appointment.name} - ${service.name} (${appointment.appointmentDate})`;
            appointmentSelect.appendChild(option);
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
            if (action.startsWith('deleteAppointment-')) {
                const appointmentId = parseInt(action.split('-')[1]);
                const result = await deleteAnyAppointment(accessToken, appointmentId);
                if (result.status === 200) {
                    appointmentsData = appointmentsData.filter(a => a.idAppointment !== appointmentId);
                    populateAppointmentsTable(appointmentsData);
                    populateEmployeeAssignmentTable(appointmentsData);
                    populateAppointmentDropdown(appointmentsData);
                    showMessageModal('success', 'Sucesso!', 'Agendamento eliminado com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao excluir o agendamento', { buttonText: 'Entendido' });
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

    window.openAddAppointmentModal = function () {
        const modal = document.getElementById('appointment-modal');
        const form = document.getElementById('appointment-form');
        const title = document.getElementById('modal-title');

        if (!modal || !form || !title) return;

        title.textContent = 'Adicionar Agendamento';
        form.reset();
        delete form.dataset.appointmentId;
        modal.classList.add('active');
    };

    window.openAssignEmployeeModal = function (appointmentId) {
        const modal = document.getElementById('employee-modal');
        const form = document.getElementById('employee-form');
        const title = document.getElementById('employee-modal-title');

        if (!modal || !form || !title) return;

        title.textContent = 'Atribuir Funcionário';
        form.reset();
        const appointmentSelect = document.getElementById('employee-appointment');
        if (appointmentSelect) {
            appointmentSelect.value = appointmentId || '';
        }
        form.dataset.appointmentId = appointmentId;
        modal.classList.add('active');
    };

    window.editAppointment = async function (appointmentId) {
        const modal = document.getElementById('appointment-modal');
        const form = document.getElementById('appointment-form');
        const title = document.getElementById('modal-title');

        if (!modal || !form || !title || !appointmentId) {
            showMessageModal('error', 'Erro!', 'Agendamento não encontrado', { buttonText: 'Entendido' });
            return;
        }

        try {
            const result = await getAnyAppointment(accessToken, appointmentId);
            if (result.status === 200) {
                const appointment = JSON.parse(localStorage.getItem('appointment'));
                if (appointment) {
                    localStorage.setItem('idAppointment', appointment.idAppointment);
                    title.textContent = 'Editar Agendamento';
                    document.getElementById('appointment-name').value = appointment.name || '';
                    document.getElementById('appointment-email').value = appointment.email || '';
                    document.getElementById('appointment-phone').value = appointment.phoneNumber || '';
                    document.getElementById('appointment-date').value = appointment.appointmentDate ? appointment.appointmentDate.split('T')[0] : '';
                    document.getElementById('appointment-time').value = appointment.appointmentTime || '';
                    document.getElementById('appointment-service').value = appointment.idService || '';
                    document.getElementById('appointment-status').value = appointment.status ? 'true' : 'false';
                    form.dataset.appointmentId = appointment.idAppointment;
                    modal.classList.add('active');
                } else {
                    showMessageModal('error', 'Erro!', 'Agendamento não encontrado', { buttonText: 'Entendido' });
                }
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar o agendamento', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao carregar o agendamento', { buttonText: 'Entendido' });
        }
    };

    window.deleteAppointment = function (appointmentId) {
        showConfirmModal(`Tem certeza que deseja excluir o agendamento ${appointmentId}?`, `deleteAppointment-${appointmentId}`);
    };

    document.getElementById('appointment-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        submitButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        submitButton.classList.add('button-loading');
        submitButton.disabled = true;

        const appointmentId = parseInt(e.target.dataset.appointmentId) || null;
        const name = document.getElementById('appointment-name').value.trim();
        const email = document.getElementById('appointment-email').value;
        const phoneNumber = document.getElementById('appointment-phone').value.trim();
        const appointmentDate = document.getElementById('appointment-date').value;
        const appointmentTime = document.getElementById('appointment-time').value;
        const idService = parseInt(document.getElementById('appointment-service').value);
        const status = document.getElementById('appointment-status').value === 'true';

        if (!name || !email || !phoneNumber || !appointmentDate || !appointmentTime || !idService) {
            showMessageModal('error', 'Erro!', 'Por favor, preencha todos os campos obrigatórios.', {
                buttonText: 'Entendido',
            });
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
            return;
        }

        const appointmentData = {
            name,
            email,
            phoneNumber,
            appointmentDate,
            appointmentTime,
            idService,
            status
        };

        try {
            if (appointmentId) {
                appointmentData.idAppointment = appointmentId;
                const response = await editAnyAppointment(accessToken, appointmentData);
                if (response.status === 200) {
                    const index = appointmentsData.findIndex(a => a.idAppointment === appointmentId);
                    if (index !== -1) {
                        appointmentsData[index] = { ...appointmentsData[index], ...appointmentData, updatedIn: new Date().toISOString() };
                        populateAppointmentsTable(appointmentsData);
                        populateEmployeeAssignmentTable(appointmentsData);
                        populateAppointmentDropdown(appointmentsData);
                        showMessageModal('success', 'Sucesso!', 'Agendamento atualizado com sucesso', { buttonText: 'Ótimo!' });
                    }
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao atualizar o agendamento', { buttonText: 'Entendido' });
                }
            } else {
                const response = await addAnyAppointment(accessToken, appointmentData);
                if (response.status === 200) {
                    await getAllAppointments(accessToken);
                    appointmentsData = JSON.parse(localStorage.getItem('appointments')) || [];
                    populateAppointmentsTable(appointmentsData);
                    populateEmployeeAssignmentTable(appointmentsData);
                    populateAppointmentDropdown(appointmentsData);
                    showMessageModal('success', 'Sucesso!', 'Agendamento criado com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao criar o agendamento', { buttonText: 'Entendido' });
                }
            }
            closeModal('appointment-modal');
            e.target.dataset.appointmentId = '';
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar o agendamento', { buttonText: 'Entendido' });
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
        }
    });

    document.getElementById('employee-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        submitButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        submitButton.classList.add('button-loading');
        submitButton.disabled = true;

        const idAppointment = parseInt(document.getElementById('employee-appointment').value);
        const employeeSelect = document.getElementById('employee-id');
        const selectedOption = employeeSelect.options[employeeSelect.selectedIndex];

        if (!idAppointment || !employeeSelect.value) {
            showMessageModal('error', 'Erro!', 'Por favor, preencha todos os campos obrigatórios.', {
                buttonText: 'Entendido',
            });
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
            return;
        }

        const employeeData = {
            idAppointment,
            employeeName: selectedOption.dataset.name,
            employeeEmail: selectedOption.dataset.email,
            employeePhoneNumber: selectedOption.dataset.phone
        };

        try {
            const response = await addEmployeeToAppointment(accessToken, employeeData);
            if (response.status === 200) {
                await getAllAppointments(accessToken);
                appointmentsData = JSON.parse(localStorage.getItem('appointments')) || [];
                populateAppointmentsTable(appointmentsData);
                populateEmployeeAssignmentTable(appointmentsData);
                populateAppointmentDropdown(appointmentsData);
                showMessageModal('success', 'Sucesso!', 'Funcionário atribuído com sucesso', { buttonText: 'Ótimo!' });
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao atribuir o funcionário', { buttonText: 'Entendido' });
            }
            closeModal('employee-modal');
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar a atribuição', { buttonText: 'Entendido' });
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
        }
    });

    const appointmentSearchInput = document.getElementById('appointment-search');
    const appointmentStatusFilter = document.getElementById('appointment-status-filter');
    const appointmentServiceFilter = document.getElementById('appointment-service-filter');

    function filterAppointments() {
        if (!appointmentSearchInput || !appointmentStatusFilter || !appointmentServiceFilter) return;

        const search = appointmentSearchInput.value.toLowerCase().trim();
        const statusFilterValue = appointmentStatusFilter.value;
        const serviceFilterValue = appointmentServiceFilter.value;

        const filteredAppointments = appointmentsData.filter(appointment => {
            const matchesSearch = (appointment.name || '').toLowerCase().includes(search) ||
                                 (appointment.email || '').toLowerCase().includes(search);
            const matchesStatus =
                statusFilterValue === 'all' ||
                (statusFilterValue === 'active' && appointment.status) ||
                (statusFilterValue === 'inactive' && !appointment.status);
            const matchesService =
                serviceFilterValue === 'all' || appointment.idService === parseInt(serviceFilterValue);
            return matchesSearch && matchesStatus && matchesService;
        });
        populateAppointmentsTable(filteredAppointments);
    }

    if (appointmentSearchInput) appointmentSearchInput.addEventListener('input', filterAppointments);
    if (appointmentStatusFilter) appointmentStatusFilter.addEventListener('change', filterAppointments);
    if (appointmentServiceFilter) appointmentServiceFilter.addEventListener('change', filterAppointments);

    const employeeAssignmentSearchInput = document.getElementById('employee-assignment-search');
    const employeeAssignmentStatusFilter = document.getElementById('employee-assignment-status-filter');
    const employeeAssignmentServiceFilter = document.getElementById('employee-assignment-service-filter');

    function filterEmployeeAssignments() {
        if (!employeeAssignmentSearchInput || !employeeAssignmentStatusFilter || !employeeAssignmentServiceFilter) return;

        const search = employeeAssignmentSearchInput.value.toLowerCase().trim();
        const statusFilterValue = employeeAssignmentStatusFilter.value;
        const serviceFilterValue = employeeAssignmentServiceFilter.value;

        const filteredAppointments = appointmentsData.filter(appointment => {
            const matchesSearch = (appointment.name || '').toLowerCase().includes(search) ||
                                 (appointment.email || '').toLowerCase().includes(search);
            const matchesStatus =
                statusFilterValue === 'all' ||
                (statusFilterValue === 'active' && appointment.status) ||
                (statusFilterValue === 'inactive' && !appointment.status);
            const matchesService =
                serviceFilterValue === 'all' || appointment.idService === parseInt(serviceFilterValue);
            return matchesSearch && matchesStatus && matchesService;
        });
        populateEmployeeAssignmentTable(filteredAppointments);
    }

    if (employeeAssignmentSearchInput) employeeAssignmentSearchInput.addEventListener('input', filterEmployeeAssignments);
    if (employeeAssignmentStatusFilter) employeeAssignmentStatusFilter.addEventListener('change', filterEmployeeAssignments);
    if (employeeAssignmentServiceFilter) employeeAssignmentServiceFilter.addEventListener('change', filterEmployeeAssignments);

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