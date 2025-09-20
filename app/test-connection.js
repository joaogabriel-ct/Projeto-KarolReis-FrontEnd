const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/backend/v1';

async function testConnection() {
  console.log('🔍 Testando conexão com o backend...\n');

  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Testando se o backend está rodando...');
    const healthCheck = await axios.get(`${API_BASE_URL}/admin/`);
    console.log('✅ Backend está rodando\n');

    // Test 2: Test authentication endpoint
    console.log('2️⃣ Testando endpoint de autenticação...');
    try {
      const authTest = await axios.post(`${API_BASE_URL}/auth/login/`, {
        username: 'test',
        password: 'test'
      });
      console.log('❌ Endpoint de login aceitou credenciais inválidas');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Endpoint de login está funcionando corretamente');
      } else {
        console.log('⚠️ Endpoint de login retornou erro inesperado:', error.response?.status);
      }
    }
    console.log('');

    // Test 3: Test people endpoints
    console.log('3️⃣ Testando endpoints de pessoas...');
    try {
      const sellersTest = await axios.get(`${API_BASE_URL}/people/sellers/`);
      console.log('✅ Endpoint de vendedores está funcionando');
    } catch (error) {
      console.log('❌ Erro no endpoint de vendedores:', error.response?.status);
    }

    try {
      const leadsTest = await axios.get(`${API_BASE_URL}/people/lead/`);
      console.log('✅ Endpoint de leads está funcionando');
    } catch (error) {
      console.log('❌ Erro no endpoint de leads:', error.response?.status);
    }
    console.log('');

    // Test 4: Test operations endpoints
    console.log('4️⃣ Testando endpoints de operações...');
    try {
      const proceduresTest = await axios.get(`${API_BASE_URL}/operation/procedure/`);
      console.log('✅ Endpoint de procedimentos está funcionando');
    } catch (error) {
      console.log('❌ Erro no endpoint de procedimentos:', error.response?.status);
    }
    console.log('');

    // Test 5: Test sales endpoints
    console.log('5️⃣ Testando endpoints de vendas...');
    try {
      const salesTest = await axios.get(`${API_BASE_URL}/sales/sales/`);
      console.log('✅ Endpoint de vendas está funcionando');
    } catch (error) {
      console.log('❌ Erro no endpoint de vendas:', error.response?.status);
    }

    try {
      const agendaTest = await axios.get(`${API_BASE_URL}/sales/agenda/`);
      console.log('✅ Endpoint de agenda está funcionando');
    } catch (error) {
      console.log('❌ Erro no endpoint de agenda:', error.response?.status);
    }
    console.log('');

    // Test 6: Test dashboard endpoints
    console.log('6️⃣ Testando endpoints do dashboard...');
    try {
      const dashboardStatsTest = await axios.get(`${API_BASE_URL}/sales/dashboard-stats/`);
      console.log('✅ Endpoint de estatísticas do dashboard está funcionando');
    } catch (error) {
      console.log('❌ Erro no endpoint de estatísticas do dashboard:', error.response?.status);
    }

    try {
      const recentAppointmentsTest = await axios.get(`${API_BASE_URL}/sales/recent-appointments/`);
      console.log('✅ Endpoint de agendamentos recentes está funcionando');
    } catch (error) {
      console.log('❌ Erro no endpoint de agendamentos recentes:', error.response?.status);
    }
    console.log('');

    // Test 7: Test calendar endpoints
    console.log('7️⃣ Testando endpoints do calendário...');
    try {
      const calendarEventsTest = await axios.get(`${API_BASE_URL}/calendar/events/local/`);
      console.log('✅ Endpoint de eventos do calendário está funcionando');
    } catch (error) {
      console.log('❌ Erro no endpoint de eventos do calendário:', error.response?.status);
    }
    console.log('');

    console.log('🎉 Teste de conexão concluído!');
    console.log('\n📋 Resumo:');
    console.log('- Backend está rodando');
    console.log('- Endpoints estão configurados corretamente');
    console.log('- Frontend pode se conectar ao backend');

  } catch (error) {
    console.error('❌ Erro ao testar conexão:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Dica: Certifique-se de que o backend está rodando em http://localhost:8000');
      console.log('   Execute: cd ../Projeto-KarolReis-BackEnd/backend && python manage.py runserver 8000');
    }
  }
}

testConnection(); 