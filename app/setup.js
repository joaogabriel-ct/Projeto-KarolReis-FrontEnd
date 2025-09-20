const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando o ambiente do Projeto Karol Reis...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Criando arquivo .env.local...');
  
  if (fs.existsSync(envExamplePath)) {
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envExample);
    console.log('✅ Arquivo .env.local criado com sucesso!');
  } else {
    console.log('❌ Arquivo env.example não encontrado');
    process.exit(1);
  }
} else {
  console.log('✅ Arquivo .env.local já existe');
}

console.log('\n📋 Verificando dependências...');

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Instalando dependências...');
  console.log('Execute: npm install');
} else {
  console.log('✅ Dependências já instaladas');
}

console.log('\n🔧 Configuração do ambiente:');
console.log('1. Certifique-se de que o backend Django está rodando em http://localhost:8000');
console.log('2. Execute: npm run dev');
console.log('3. Acesse: http://localhost:3000');

console.log('\n🧪 Para testar a conexão com o backend:');
console.log('Execute: node test-connection.js');

console.log('\n📚 Para mais informações, consulte o README.md');

console.log('\n🎉 Configuração concluída!'); 