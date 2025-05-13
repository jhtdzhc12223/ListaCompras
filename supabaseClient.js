// Importa a função de criação do client Supabase via CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Cria o client com a URL e a chave fornecidas
export const supabase = createClient(
  'https://mhlqgelfaikpijgkmkwz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obHFnZWxmYWlrcGlqZ2tta3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzU1NDIsImV4cCI6MjA2MjExMTU0Mn0.rn7uhxJf3xcHfGB4Krz6lJ8TFDPiJgx7QFnfSOu7SRw'
)