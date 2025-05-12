// Importa a função de criação do client Supabase via CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Cria o client com a URL e a chave fornecidas
export const supabase = createClient(
  'https://wqrvadycionozczmqgoj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcnZhZHljaW9ub3pjem1xZ29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0OTUzOTIsImV4cCI6MjA2MjA3MTM5Mn0.mMVAn7kJQH8bLhijfug2E0lMvpjRkKRE7CC29IFNNt4'
)