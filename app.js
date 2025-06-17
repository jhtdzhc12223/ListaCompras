import { supabase } from './supabaseClient.js'

// Função para criar efeito de partículas
function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  document.body.appendChild(particlesContainer);
  
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Tamanho e posição aleatórios
    const size = Math.random() * 5 + 1;
    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}px`;
    particle.style.top = `${posY}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    particlesContainer.appendChild(particle);
  }
}

// Inicia o efeito de partículas
createParticles();

// Recupera o usuário logado. Redireciona para login se não estiver autenticado.
async function getUser() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    window.location.href = 'login.html';
    return null;
  }

  // Busca informações adicionais do perfil
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (!profileError && profile) {
    user.username = profile.username;
  }

  return user;
}

// Elementos do DOM
const lista = document.getElementById('lista');
const input = document.getElementById('item');

// Carrega a lista de compras do Supabase
async function carregarLista() {
  const user = await getUser();
  if (!user) return;
  
  // Atualiza o título com o nome do usuário se disponível
  if (user.username) {
    const titulo = document.querySelector('.titulo');
    titulo.textContent = `Lista de Compras - ${user.username}`;
  }

  const { data, error } = await supabase.from('lista_compras').select('*');
  
  if (error) {
    console.error('Erro ao carregar lista:', error);
    return;
  }

  // Limpa a lista e renderiza os itens
  lista.innerHTML = '';
  data.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.item} <button onclick="removerItem('${item.id}')">Remover</button>`;
    lista.appendChild(li);
  });
}

// Adiciona novo item à lista de compras
window.adicionarItem = async function () {
  const user = await getUser();
  if (!user) return;
  
  if (!input.value.trim()) {
    alert('Por favor, digite um item válido');
    return;
  }

  const { error } = await supabase.from('lista_compras').insert({
    item: input.value,
    adicionada_por: user.id
  });

  if (error) {
    alert('Erro ao adicionar: ' + error.message);
    return;
  }

  input.value = '';
  await carregarLista();
}

// Remove item da lista pelo ID
window.removerItem = async function (id) {
  const { error } = await supabase.from('lista_compras').delete().eq('id', id);
  if (error) {
    alert('Erro ao remover: ' + error.message);
    return;
  }
  await carregarLista();
}

// Realiza logout do usuário
window.logout = async function () {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

// Inicializa: verifica se o usuário está logado e carrega a lista
getUser().then(user => {
  if (user) {
    carregarLista();
    
    // Mostra o email do usuário no console para debug
    console.log('Usuário logado:', user.email, 'Username:', user.username || 'Não definido');
  }
});

// enter funciona para adicionar item
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    adicionarItem();
  }
});

// Atualiza a lista periodicamente (a cada 30 segundos)
setInterval(carregarLista, 30000);

// Atualiza o Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        registration.update();
        console.log('ServiceWorker registrado com sucesso:', registration.scope);
      })
      .catch(error => {
        console.log('Falha ao registrar o ServiceWorker:', error);
      });
  });
}
