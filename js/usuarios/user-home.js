document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    let appointmentsData = [];
    let servicesData = [];

    async function initializeData() {
        try {
            // Initialize User Info
            const user = JSON.parse(localStorage.getItem('user')) || {};
            document.getElementById('user-name').textContent = user.name || 'Usuário';

            // Initialize Services
            const servicesResult = await getAllServices(accessToken);
            if (servicesResult === 200) {
                const storedServices = localStorage.getItem('services');
                servicesData = storedServices ? JSON.parse(storedServices) : [];
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar serviços', { buttonText: 'Entendido' });
            }

            // Initialize Appointments
            const appointmentsResult = await getAllAppointments(accessToken);
            if (appointmentsResult.status === 200) {
                const storedAppointments = localStorage.getItem('appointments');
                appointmentsData = storedAppointments ? JSON.parse(storedAppointments) : [];
                populateAppointmentsSection(appointmentsData);
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar agendamentos', { buttonText: 'Entendido' });
            }
        } catch (error) {
            console.error('Erro ao inicializar dados:', error);
            showMessageModal('error', 'Erro!', 'Falha ao inicializar a página', { buttonText: 'Entendido' });
        }
    }

    function populateAppointmentsSection(appointments) {
        const section = document.querySelector('.section-agendaments');
        if (!section) return;

        section.innerHTML = '';
        if (appointments.length === 0) {
            section.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
            return;
        }

        appointments.forEach(appointment => {
            const service = servicesData.find(s => s.idService === appointment.idService) || {};
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h3>Detalhes do agendamento</h3>
                <label>Data e Hora</label>
                <div class="field">${appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('pt-BR') : '-'} - ${appointment.appointmentTime || '-'}</div>
                <label>Tipo de Serviço</label>
                <div class="field">${service.name || '-'}</div>
                <label>Informações do serviço</label>
                <p class="info">${service.description || 'Sem descrição disponível'}</p>
                <label>Status</label>
                <div class="status ${appointment.status ? 'ativo' : 'inativo'}">${appointment.status ? 'Ativo' : 'Inativo'}</div>
                <div class="buttons">
                    <button class="excluir" onclick="openDeleteModal(${appointment.idAppointment})">Excluir</button>
                    <button class="reagendar" onclick="openReagendarModal(${appointment.idAppointment})">Reagendar</button>
                </div>
            `;
            section.appendChild(card);
        });
    }

    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    };

    window.openDeleteModal = function(appointmentId) {
        const modal = document.getElementById('excluir-modal');
        const confirmButton = document.getElementById('confirm-delete');
        if (modal && confirmButton) {
            confirmButton.dataset.appointmentId = appointmentId;
            modal.classList.add('active');
        }
    };

    window.openReagendarModal = function(appointmentId) {
        const modal = document.getElementById('reagendar-modal');
        const form = document.getElementById('reagendar-form');
        if (modal && form) {
            form.dataset.appointmentId = appointmentId;
            const appointment = appointmentsData.find(a => a.idAppointment === appointmentId);
            if (appointment) {
                document.getElementById('new-date').value = appointment.appointmentDate ? appointment.appointmentDate.split('T')[0] : '';
                document.getElementById('new-time').value = appointment.appointmentTime || '';
            }
            modal.classList.add('active');
        }
    };

    document.getElementById('confirm-delete').addEventListener('click', async () => {
        const confirmButton = document.getElementById('confirm-delete');
        const appointmentId = parseInt(confirmButton.dataset.appointmentId);
        const originalText = confirmButton.innerHTML;
        confirmButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        confirmButton.disabled = true;

        try {
            const result = await deleteAnyAppointment(accessToken, appointmentId);
            if (result.status === 200) {
                appointmentsData = appointmentsData.filter(a => a.idAppointment !== appointmentId);
                populateAppointmentsSection(appointmentsData);
                showMessageModal('success', 'Sucesso!', 'Agendamento excluído com sucesso', { buttonText: 'Ótimo!' });
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao excluir o agendamento', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao excluir o agendamento', { buttonText: 'Entendido' });
        } finally {
            closeModal('excluir-modal');
            confirmButton.innerHTML = originalText;
            confirmButton.disabled = false;
            delete confirmButton.dataset.appointmentId;
        }
    });

    document.getElementById('reagendar-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const appointmentId = parseInt(form.dataset.appointmentId);
        const newDate = document.getElementById('new-date').value;
        const newTime = document.getElementById('new-time').value;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        submitButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        submitButton.disabled = true;

        try {
            const appointment = appointmentsData.find(a => a.idAppointment === appointmentId);
            if (!appointment) {
                showMessageModal('error', 'Erro!', 'Agendamento não encontrado', { buttonText: 'Entendido' });
                return;
            }

            const updatedAppointment = {
                idAppointment: appointmentId,
                name: appointment.name,
                email: appointment.email,
                phoneNumber: appointment.phoneNumber,
                appointmentDate: newDate,
                appointmentTime: newTime,
                idService: appointment.idService,
                status: appointment.status
            };

            const result = await editAnyAppointment(accessToken, updatedAppointment);
            if (result.status === 200) {
                const index = appointmentsData.findIndex(a => a.idAppointment === appointmentId);
                if (index !== -1) {
                    appointmentsData[index] = { ...appointmentsData[index], appointmentDate: newDate, appointmentTime: newTime };
                    populateAppointmentsSection(appointmentsData);
                    showMessageModal('success', 'Sucesso!', 'Agendamento reagendado com sucesso', { buttonText: 'Ótimo!' });
                }
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao reagendar o agendamento', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao reagendar o agendamento', { buttonText: 'Entendido' });
        } finally {
            closeModal('reagendar-modal');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            delete form.dataset.appointmentId;
        }
    });

    function filterAppointments() {
        const searchInput = document.getElementById('search-input').value.toLowerCase().trim();
        const statusFilter = document.getElementById('status-filter').value;
        const dateFilter = document.getElementById('date-filter').value;

        const filteredAppointments = appointmentsData.filter(appointment => {
            const matchesSearch = (appointment.name || '').toLowerCase().includes(searchInput) ||
                                 (servicesData.find(s => s.idService === appointment.idService)?.name || '').toLowerCase().includes(searchInput);
            const matchesStatus = statusFilter === 'all' ||
                                 (statusFilter === 'active' && appointment.status) ||
                                 (statusFilter === 'inactive' && !appointment.status);
            const matchesDate = !dateFilter ||
                                (appointment.appointmentDate && appointment.appointmentDate.split('T')[0] === dateFilter);
            return matchesSearch && matchesStatus && matchesDate;
        });

        populateAppointmentsSection(filteredAppointments);
    }

    document.getElementById('search-input').addEventListener('input', filterAppointments);
    document.getElementById('status-filter').addEventListener('change', filterAppointments);
    document.getElementById('date-filter').addEventListener('change', filterAppointments);

    await initializeData();
});