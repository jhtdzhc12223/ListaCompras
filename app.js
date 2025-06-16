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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    window.location.href = 'login.html'
    return null
  }
  return user
}

// Elementos do DOM
const lista = document.getElementById('lista')
const input = document.getElementById('item')

// Carrega a lista de compras do Supabase
async function carregarLista() {
  const { data, error } = await supabase.from('lista_compras').select('*')
  if (error) {
    console.error('Erro ao carregar lista:', error)
    return
  }

  // Limpa a lista e renderiza os itens
  lista.innerHTML = ''
  data.forEach((item) => {
    const li = document.createElement('li')
    li.innerHTML = `${item.item} <button onclick="removerItem('${item.id}')">Remover</button>`
    lista.appendChild(li)
  })
}

// Adiciona novo item à lista de compras
window.adicionarItem = async function () {
  const user = await getUser()
  if (!user) return
  
  console.log('Usuário:', user)
  console.log('Item:', input.value)

  const { error } = await supabase.from('lista_compras').insert({
    item: input.value,
    adicionada_por: user.id
  })

  if (error) return alert('Erro ao adicionar: ' + error.message)

  input.value = ''
  carregarLista()
}

// Remove item da lista pelo ID
window.removerItem = async function (id) {
  const { error } = await supabase.from('lista_compras').delete().eq('id', id)
  if (error) return alert('Erro ao remover: ' + error.message)
  carregarLista()
}

// Realiza logout do usuário
window.logout = async function () {
  await supabase.auth.signOut()
  window.location.href = 'login.html'
}

// Inicializa: verifica se o usuário está logado e carrega a lista
getUser().then(user => {
  if (user) carregarLista()
})

// enter funciona para adicionar item
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
      adicionarItem()
  }
})
