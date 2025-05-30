document.addEventListener('DOMContentLoaded', () => {
  let chartInstance = null;

  // Modal control functions
  window.closeModal = function(modalId) {
      const modal = document.getElementById(modalId);
      modal.classList.remove('active');
  };

  window.confirmAction = function() {
      const modal = document.getElementById('confirm-modal');
      const messageElement = document.getElementById('confirm-message');
      
      console.log('Action confirmed:', messageElement.dataset.action);
      modal.classList.remove('active');
      alert('Ação realizada com sucesso!');
  };

  // Form submission
  document.getElementById('report-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const reportType = document.getElementById('report-type').value;
      const startDate = document.getElementById('start-date').value;
      const endDate = document.getElementById('end-date').value;

      if (!startDate || !endDate) {
          alert('Por favor, selecione as datas inicial e final.');
          return;
      }

      if (new Date(endDate) < new Date(startDate)) {
          alert('A data final deve ser posterior à data inicial.');
          return;
      }

      // Simulate fetching report data (replace with API call)
      const reportData = {
          sales: [
              { date: '2025-05-27', description: 'Venda: Creme Hidratante', value: 59.90 },
              { date: '2025-05-28', description: 'Agendamento: Massagem Relaxante', value: 120.00 },
              { date: '2025-05-29', description: 'Venda: Kit Spa Completo', value: 189.90 }
          ],
          appointments: [
              { date: '2025-05-27', description: 'Massagem Relaxante', value: 120.00 },
              { date: '2025-05-28', description: 'Tratamento Facial', value: 85.00 }
          ],
          users: [
              { date: '2025-05-27', description: 'Novo usuário: Ana Silva', value: 0 },
              { date: '2025-05-28', description: 'Novo usuário: Carlos Mendes', value: 0 }
          ],
          inventory: [
              { date: '2025-05-27', description: 'Creme Hidratante (Estoque: 50)', value: 59.90 },
              { date: '2025-05-28', description: 'Óleo Corporal (Estoque: 100)', value: 39.90 }
          ]
      };

      const data = reportData[reportType] || [];
      updateReportTable(data);
      updateReportChart(data, reportType);
  });

  // Update report table
  function updateReportTable(data) {
      const tbody = document.getElementById('report-data');
      tbody.innerHTML = '';

      if (data.length === 0) {
          tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #888;">Nenhum dado encontrado.</td></tr>';
          return;
      }

      data.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${item.date}</td>
              <td>${item.description}</td>
              <td>R$ ${item.value.toFixed(2)}</td>
          `;
          tbody.appendChild(row);
      });
  }

  // Update report chart
  function updateReportChart(data, reportType) {
      const ctx = document.getElementById('reportChart').getContext('2d');

      // Destroy existing chart if it exists
      if (chartInstance) {
          chartInstance.destroy();
      }

      const labels = data.map(item => item.date);
      const values = data.map(item => item.value);

      chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labels,
              datasets: [{
                  label: reportType.charAt(0).toUpperCase() + reportType.slice(1),
                  data: values,
                  backgroundColor: '#5a8f7b',
                  borderColor: '#5a8f7b',
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: true,
                      title: {
                          display: true,
                          text: reportType === 'users' ? 'Contagem' : 'Valor (R$)'
                      }
                  },
                  x: {
                      title: {
                          display: true,
                          text: 'Data'
                      }
                  }
              },
              plugins: {
                  legend: {
                      display: true
                  }
              }
          }
      });
  }

  // Export report
  window.exportReport = function() {
      showConfirmModal('Deseja exportar o relatório atual?', 'exportReport');
      // Implement export logic (e.g., CSV, PDF) in confirmAction
  };

  // Helper function to show confirmation modal
  function showConfirmModal(message, action) {
      const modal = document.getElementById('confirm-modal');
      const messageElement = document.getElementById('confirm-message');
      
      messageElement.textContent = message;
      messageElement.dataset.action = action;
      modal.classList.add('active');
  }
});