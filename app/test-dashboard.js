#!/usr/bin/env node

const axios = require('axios');

// Configurações
const API_BASE_URL = 'http://localhost:8000/backend/v1';
const FRONTEND_URL = 'http://localhost:3000';

async function testDashboardEndpoints() {
  console.log('=== Testando Endpoints do Dashboard ===\n');
  
  try {
    // Testar dashboard-stats
    console.log('1. Testando /sales/dashboard-stats/');
    const statsResponse = await axios.get(`${API_BASE_URL}/sales/dashboard-stats/`);
    console.log(`✅ Status: ${statsResponse.status}`);
    console.log(`📊 Dados:`, statsResponse.data);
    console.log('');
    
    // Testar recent-appointments
    console.log('2. Testando /sales/recent-appointments/');
    const appointmentsResponse = await axios.get(`${API_BASE_URL}/sales/recent-appointments/`);
    console.log(`✅ Status: ${appointmentsResponse.status}`);
    console.log(`📅 Dados:`, appointmentsResponse.data);
    console.log('');
    
    console.log('🎉 Todos os endpoints estão funcionando!');
    
  } catch (error) {
    console.error('❌ Erro nos endpoints:', error.response?.data || error.message);
  }
}

async function testFrontendConnection() {
  console.log('\n=== Testando Conexão com Frontend ===\n');
  
  try {
    const response = await axios.get(FRONTEND_URL);
    console.log(`✅ Frontend acessível: ${response.status}`);
    console.log('🌐 URL:', FRONTEND_URL);
  } catch (error) {
    console.error('❌ Frontend não acessível:', error.message);
    console.log('💡 Certifique-se de que o frontend está rodando em:', FRONTEND_URL);
  }
}

async function main() {
  console.log('🚀 Iniciando testes do Dashboard...\n');
  
  await testDashboardEndpoints();
  await testFrontendConnection();
  
  console.log('\n📋 Instruções para resolver problemas:');
  console.log('1. Se os endpoints falharem, execute: cd Projeto-KarolReis-BackEnd/backend && python manage.py migrate');
  console.log('2. Se o frontend não carregar, execute: cd Projeto-KarolReis-FrontEnd/app && npm run dev');
  console.log('3. Verifique se ambos os servidores estão rodando nas portas corretas');
}

main().catch(console.error); 