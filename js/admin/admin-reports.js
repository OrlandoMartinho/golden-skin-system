document.addEventListener('DOMContentLoaded', () => {
  let chartInstance = null;
  let currentReportData = []; // Armazenar dados do relatório para exportação

  // Função simulada para buscar dados (substitua pela sua função real)
  async function fetchAllData() {
    try {
      // Exemplo de retorno com as estruturas fornecidas
      return {
        vendas: [
          { idShopping: 1, idUser: 101, status: true, createdIn: "2025-05-29T10:00:00Z", updatedIn: "2025-05-29T10:00:00Z" },
          { idShopping: 2, idUser: 102, status: false, createdIn: "2025-05-28T12:00:00Z", updatedVehiclesIn: "2025-05-28T12:00:00Z" }
        ],
        assinantes: [
          { idSubscriber: 1, subscriberName: "João Silva", idUser: 101, idPlan: 1, createdIn: "2025-05-27T08:00:00Z", updatedIn: "2025-05-27T08:00:00Z" }
        ],
        agendamentos: [
          { idAppointment: 1, appointmentDate: "2025-05-28", appointmentTime: "14:00", status: true, name: "Maria Santos", email: "maria@example.com", phoneNumber: "123456789", employeeName: "Ana Costa", employeePhoneNumber: "987654321", employeeEmail: "ana@example.com", idService: 1, idUser: 101, createdIn: "2025-05-28T09:00:00Z", updatedIn: "2025-05-28T09:00:00Z" }
        ],
        products: [
          { idProduct: 1, name: "Creme Hidratante", description: "Creme para pele", priceInCents: 5990, status: true, category: "Cuidados Pessoais", photo: "creme.png", createdIn: "2025-05-27T15:00:00Z", amount: 10, updatedIn: "2025-05-27T15:00:00Z" }
        ],
        mensagens: [
          { idMessage: 1, idUser: 101, idChat: 1, username: "João Silva", createdIn: "2025-05-28T10:00:00Z", updatedIn: "2025-05-28T10:00:00Z" }
        ],
        users: [
          { idUser: 101, name: "João Silva", password: "hashed", token: "abc123", email: "joao@example.com", photo: "user.png", phoneNumber: "123456789", role: 1, path: "/user", status: true, createdIn: "2025-05-27T08:00:00Z", updatedIn: "2025-05-27T08:00:00Z" }
        ]
      };
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return { vendas: [], assinantes: [], agendamentos: [], products: [], mensagens: [], users: [] };
    }
  }

  // Modal control functions
  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  };

  window.confirmAction = function() {
    const modal = document.getElementById('confirm-modal');
    const messageElement = document.getElementById('confirm-message');
    const action = messageElement.dataset.action;

    if (action === 'exportReport') {
      generatePDF();
    }

    if (modal) {
      modal.classList.remove('active');
    }
    alert('Ação realizada com sucesso!');
  };

  // Form submission
  document.getElementById('report-form').addEventListener('submit', async (e) => {
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

    // Buscar dados dinamicamente
    const allData = await fetchAllData();
    
    // Filtrar dados por tipo de relatório e intervalo de datas
    currentReportData = allData[reportType].filter(item => {
      const itemDate = new Date(item.createdIn || item.appointmentDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return itemDate >= start && itemDate <= end;
    });

    updateReportTable(currentReportData, reportType);
    updateReportChart(currentReportData, reportType);
  });

  // Update report table
  function updateReportTable(data, reportType) {
    const tbody = document.getElementById('report-data');
    if (!tbody) {
      console.error('Elemento com ID "report-data" não encontrado.');
      return;
    }

    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #888;">Nenhum dado encontrado.</td></tr>';
      return;
    }

    data.forEach(item => {
      const row = document.createElement('tr');
      let date, description, value;

      switch (reportType) {
        case 'vendas':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `Compra ID ${item.idShopping} (${item.status ? 'Ativa' : 'Inativa'})`;
          value = 'N/A';
          break;
        case 'assinantes':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.subscriberName} (Plano ID ${item.idPlan})`;
          value = 'N/A';
          break;
        case 'agendamentos':
          date = new Date(item.appointmentDate).toLocaleDateString('pt-BR');
          description = `${item.name} com ${item.employeeName}`;
          value = 'N/A';
          break;
        case 'products':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.name} (${item.category})`;
          value = `AOA ${(item.priceInCents / 100).toFixed(2)}`;
          break;
        case 'mensagens':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.username} (Chat ID ${item.idChat})`;
          value = 'N/A';
          break;
        case 'users':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.name} (${item.email})`;
          value = 'N/A';
          break;
        default:
          date = description = value = 'N/A';
      }

      row.innerHTML = `
        <td>${date}</td>
        <td>${description}</td>
        <td>${value}</td>
      `;
      tbody.appendChild(row);
    });
  }

  // Update report chart
  function updateReportChart(data, reportType) {
    const canvas = document.getElementById('reportChart');
    if (!canvas) {
      console.error('Canvas element with ID "reportChart" not found.');
      return;
    }

    const ctx = canvas.getContext('2d');

    if (chartInstance) {
      chartInstance.destroy();
    }

    const labels = data.map(item => new Date(item.createdIn || item.appointmentDate).toLocaleDateString('pt-BR'));
    const values = reportType === 'products'
      ? data.map(item => item.priceInCents / 100)
      : data.map(() => 1); // Contagem para outros tipos

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: reportType.charAt(0).toUpperCase() + reportType.slice(1),
          data: values,
          backgroundColor: '#8B4513',
          borderColor: '#8B4513',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: reportType === 'products' ? 'Valor (AOA)' : 'Contagem'
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

  // Export report to PDF
  window.exportReport = function() {
    showConfirmModal('Deseja exportar o relatório atual?', 'exportReport');
  };

  // Generate PDF
  async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    const reportType = document.getElementById('report-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // Definir logoY e logoHeight fora do try para evitar ReferenceError
    let logoY = 10; // Margem superior padrão
    let logoHeight = 10; // Altura padrão caso o logo não carregue

    // Adicionar logotipo sem fundo ou borda
    const logo = new Image();
    logo.src = '../../assets/img/logo.png';
    try {
      await new Promise((resolve, reject) => {
        logo.onload = resolve;
        logo.onerror = () => reject(new Error('Erro ao carregar o logotipo'));
      });

      // Calcular proporções para manter a proporção da imagem
      const logoWidth = 25; // Largura reduzida do logotipo
      logoHeight = (logo.height / logo.width) * logoWidth; // Manter proporção
      const logoX = 10; // Margem esquerda
      logoY = 10; // Margem superior

      // Adicionar o logotipo sem fundo ou borda
      doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.error(error.message);
    }

    // Título do relatório (ajustado para não sobrepor o logotipo)
    const titleY = Math.max(logoY + logoHeight + 10, 40);
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(`Relatório de ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 10, titleY);
    doc.setFontSize(12);
    doc.text(`Período: ${startDate} a ${endDate}`, 10, titleY + 10);

    // Linha divisória
    doc.setLineWidth(0.5);
    doc.setDrawColor(139, 69, 19); // Cor marrom (#8B4513)
    doc.line(10, titleY + 15, 200, titleY + 15);

    // Dados da tabela para o PDF
    const headers = ['Data', 'Descrição', 'Valor'];
    const rows = currentReportData.map(item => {
      let date, description, value;
      switch (reportType) {
        case 'vendas':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `Compra ID ${item.idShopping} (${item.status ? 'Ativa' : 'Inativa'})`;
          value = 'N/A';
          break;
        case 'assinantes':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.subscriberName} (Plano ID ${item.idPlan})`;
          value = 'N/A';
          break;
        case 'agendamentos':
          date = new Date(item.appointmentDate).toLocaleDateString('pt-BR');
          description = `${item.name} com ${item.employeeName}`;
          value = 'N/A';
          break;
        case 'products':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.name} (${item.category})`;
          value = `AOA ${(item.priceInCents / 100).toFixed(2)}`;
          break;
        case 'mensagens':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.username} (Chat ID ${item.idChat})`;
          value = 'N/A';
          break;
        case 'users':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.name} (${item.email})`;
          value = 'N/A';
          break;
        default:
          date = description = value = 'N/A';
      }
      return [date, description, value];
    });

    // Usar autoTable para a tabela
    try {
      doc.autoTable({
        startY: titleY + 20,
        head: [headers],
        body: rows,
        theme: 'striped',
        headStyles: {
          fillColor: [124, 93, 39], 
          textColor: [255, 255, 255],
          fontSize: 12
        },
        bodyStyles: {
          fontSize: 10
        },
        alternateRowStyles: {
          fillColor: [245, 245, 220] 
        },
        margin: { top: titleY + 20, left: 10, right: 10 },
        columnStyles: {
          0: { cellWidth: 30 }, 
          1: { cellWidth: 100 }, 
          2: { cellWidth: 50 } 
        }
      });
    } catch (error) {
      console.error('Erro ao gerar a tabela no PDF:', error);
      doc.text('Erro ao gerar a tabela.', 10, titleY + 20);
    }

    // Adicionar rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(124, 93, 39); 
      doc.text(`Página ${i} de ${pageCount}`, 190, 290, { align: 'right' });
      doc.text('Pele Douro - Relatórios', 10, 290);
    }

    // Salvar o PDF
    try {
      doc.save(`Relatorio_${reportType}_${startDate}_${endDate}.pdf`);
    } catch (error) {
      console.error('Erro ao salvar o PDF:', error);
      alert('Falha ao salvar o PDF. Tente novamente.');
    }
  }

  // Helper function to show confirmation modal
  function showConfirmModal(message, action) {
    const modal = document.getElementById('confirm-modal');
    const messageElement = document.getElementById('confirm-message');
    
    if (modal && messageElement) {
      messageElement.textContent = message;
      messageElement.dataset.action = action;
      modal.classList.add('active');
    } else {
      console.error('Elementos do modal não encontrados.');
    }
  }
});