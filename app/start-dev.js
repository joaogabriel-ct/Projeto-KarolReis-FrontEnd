const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando ambiente de desenvolvimento...\n');

// Função para executar comandos
function runCommand(command, args, cwd, name) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'pipe',
      shell: true
    });

    child.stdout.on('data', (data) => {
      console.log(`[${name}] ${data.toString().trim()}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`[${name}] ERRO: ${data.toString().trim()}`);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Processo ${name} encerrou com código ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Função principal
async function startDev() {
  try {
    // Verificar se o backend está rodando
    console.log('📋 Verificando se o backend está rodando...');
    
    // Iniciar o frontend
    console.log('🎨 Iniciando o frontend...');
    await runCommand('npm', ['run', 'dev'], __dirname, 'Frontend');
    
  } catch (error) {
    console.error('❌ Erro ao iniciar o ambiente:', error.message);
    process.exit(1);
  }
}

// Tratamento de sinais para encerrar processos
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando processos...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Encerrando processos...');
  process.exit(0);
});

// Iniciar
startDev(); 