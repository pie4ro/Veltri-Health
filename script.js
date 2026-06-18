const SUPABASE_URL = "https://kzysnmsjelqocsjtebaa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6eXNubXNqZWxxb2NzanRlYmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NDYxNTksImV4cCI6MjA5NzMyMjE1OX0.1_gOErRCHuyF8xzAZtxaPgwxIsUrYbEtzsDbqkiJPpY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const overlay = document.getElementById('modalOverlay');
  const formStep = document.getElementById('formStep');
  const successStep = document.getElementById('successStep');
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const queueNum = document.getElementById('queueNum');

  function openModal(){
    overlay.classList.add('active');
    formStep.classList.remove('hidden');
    successStep.classList.add('hidden');
    emailInput.value = '';
    emailError.textContent = '';
  }
  function closeModal(){
    overlay.classList.remove('active');
  }
  overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });

  function isValidEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

async function submitEmail(){
  const val = emailInput.value.trim();

  if(!isValidEmail(val)){
    emailError.textContent = 'Ingresa un correo válido para continuar.';
    return;
  }

  emailError.textContent = '';

  const { error } = await supabaseClient
    .from('beta_registros')
    .insert([
      { email: val }
    ]);

  if(error){
    if(error.code === "23505"){
      emailError.textContent = 'Este correo ya fue registrado.';
    } else {
      emailError.textContent = 'No se pudo registrar el correo. Intenta nuevamente.';
      console.error(error);
    }
    return;
  }

  await registrarClick('registro_correo');

  const pos = 1200 + Math.floor(Math.random() * 90);
  queueNum.textContent = pos.toLocaleString('es-PE');

  formStep.classList.add('hidden');
  successStep.classList.remove('hidden');
}

async function registrarClick(nombreBoton){
  const { error } = await supabaseClient
    .from('eventos_clicks')
    .insert([
      {
        boton: nombreBoton,
        pagina: window.location.pathname
      }
    ]);

  if(error){
    console.error('Error registrando click:', error);
  }
}

  emailInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') submitEmail();
  });
