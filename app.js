// ===========================================
// SISTEMA DE AUTENTICACIÓN Y USUARIOS
// ===========================================
let users = JSON.parse(localStorage.getItem("runningTrainerUsers")) || {};
let currentUser = null;
let planActual = "30min";
let chart;
let darkMode = localStorage.getItem('darkMode') === 'true';
let soundMode = localStorage.getItem('soundMode') || 'on'; // 'on', 'success', 'motivation', 'off'
let sharedAudioContext = null;

// Elementos de la interfaz
const authContainer = document.getElementById('authContainer');
const userBar = document.getElementById('userBar');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const userName = document.getElementById('userName');
const userAvatar = document.getElementById('userAvatar');
const userLevelBadge = document.getElementById('userLevelBadge');
const logoutBtn = document.getElementById('logoutBtn');
const profileBtn = document.getElementById('profileBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const profileModal = document.getElementById('profileModal');
const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
const soundStatus = document.getElementById('soundStatus');
const profileName = document.getElementById('profileName');
const profileAvatar = document.getElementById('profileAvatar');
const profileLevelBadge = document.getElementById('profileLevelBadge');
const profilePlan = document.getElementById('profilePlan');
const profileCompleted = document.getElementById('profileCompleted');
const profileTotal = document.getElementById('profileTotal');
const profileProgress = document.getElementById('profileProgress');
const levelProgressDetails = document.getElementById('levelProgressDetails');
const profilePhotoInput = document.getElementById('profilePhotoInput');
const badgesGrid = document.getElementById('badgesGrid');
const weeksDefaultAnchor = document.getElementById('weeksDefaultAnchor');
const weeksContainerElement = document.getElementById('weeks');

// Elementos del temporizador
const timerModal = document.getElementById('timerModal');
const closeTimerModalBtn = document.getElementById('closeTimerModalBtn');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timerWorkoutTitle = document.getElementById('timerWorkoutTitle');
const currentRepDisplay = document.getElementById('currentRep');
const totalRepsDisplay = document.getElementById('totalReps');
const timerLabel = document.getElementById('timerLabel');
const timerRingProgress = document.getElementById('timerRingProgress');
const countdownDisplay = document.getElementById('countdown');
const timerPhaseHint = document.getElementById('timerPhaseHint');

let currentDayWorkout = null;
let timerInterval = null;
let timeLeft = 0;
let phaseDuration = 0;
let isRunning = false;
let isExercise = true;
let totalReps = 0;
let currentRep = 0;

const TIMER_RING_RADIUS = 96;
const TIMER_RING_CIRCUMFERENCE = 2 * Math.PI * TIMER_RING_RADIUS;

// ===========================================
// SISTEMA DE BADGES/LOGROS
// ===========================================
const BADGES = {
  // 🎯 LOGROS INICIALES
  'primer-entrenamiento': {
    icon: '🏃',
    name: 'Primer Paso',
    description: 'Completar tu primer entrenamiento'
  },
  'bienvenida': {
    icon: '👋',
    name: 'Bienvenido',
    description: 'Crear tu cuenta'
  },
  
  // 📅 LOGROS POR SEMANA
  'semana-completa': {
    icon: '🌟',
    name: 'Semana Perfecta',
    description: 'Completa una semana entera (7 entrenamientos)'
  },
  'dos-semanas': {
    icon: '⚡',
    name: 'Imparable',
    description: 'Completa 2 semanas consecutivas'
  },
  'mes-entrenador': {
    icon: '📆',
    name: 'Hombre de Hierro',
    description: 'Entrena durante un mes completo'
  },
  
  // 📊 LOGROS DE PROGRESIÓN
  'nivel-intermedio': {
    icon: '⬆️',
    name: 'Ascenso',
    description: 'Alcanza nivel Intermedio'
  },
  'nivel-avanzado': {
    icon: '🚀',
    name: 'En Órbita',
    description: 'Alcanza nivel Avanzado'
  },
  'experto': {
    icon: '👑',
    name: 'Rey del Atletismo',
    description: 'Alcanza nivel Experto (¡Máximo!)'
  },
  
  // 💪 LOGROS DE PLANES
  'plan-completado': {
    icon: '🏆',
    name: 'Maestro del Plan',
    description: 'Completa un plan entero (56 entrenamientos)'
  },
  'plan-30min': {
    icon: '⏱️',
    name: 'Media Hora de Glory',
    description: 'Completa el plan de 30 minutos'
  },
  'plan-5k': {
    icon: '5️⃣',
    name: 'Corredor de 5K',
    description: 'Completa el plan de 5K'
  },
  'plan-10k': {
    icon: '🔟',
    name: 'Ultramaratonista',
    description: 'Completa el plan de 10K'
  },
  'plan-hiit': {
    icon: '🔥',
    name: 'Intenso',
    description: 'Completa el plan HIIT'
  },
  'plan-fartlek': {
    icon: '🌪️',
    name: 'Maestro del Ritmo',
    description: 'Completa el plan Fartlek'
  },
  'plan-trail': {
    icon: '⛰️',
    name: 'Montañero',
    description: 'Completa el plan Trail Running'
  },
  'todos-planes': {
    icon: '🎖️',
    name: 'Explorador',
    description: 'Prueba todos los planes disponibles'
  },
  
  // 🔢 LOGROS DE CANTIDAD
  '50-entrenamientos': {
    icon: '5️⃣0️⃣',
    name: 'Medio Siglo',
    description: 'Completa 50 entrenamientos'
  },
  '100-entrenamientos': {
    icon: '💯',
    name: 'Centésimo',
    description: 'Completa 100 entrenamientos'
  },
  '250-entrenamientos': {
    icon: '🌈',
    name: 'Más Allá del Límite',
    description: 'Completa 250 entrenamientos'
  },
  '500-xp': {
    icon: '⭐',
    name: 'Coleccionista de XP',
    description: 'Acumula 500 XP'
  },
  '1000-xp': {
    icon: '✨',
    name: 'XP Infinito',
    description: 'Acumula 1000 XP'
  },
  
  // 🔥 LOGROS DESAFIANTES
  'racha-3': {
    icon: '🔥',
    name: 'En Llamas',
    description: 'Completa 3 entrenamientos consecutivos'
  },
  'racha-7': {
    icon: '🌪️',
    name: 'Tormenta de Fuego',
    description: 'Completa 7 entrenamientos consecutivos'
  },
  'racha-30': {
    icon: '☄️',
    name: 'Leyenda Viva',
    description: 'Completa 30 entrenamientos consecutivos'
  },
  'semana-todos-planes': {
    icon: '🎯',
    name: 'Versátil',
    description: 'Usa todos los planes en una semana'
  },
  
  // 🎪 LOGROS ESPECIALES
  'de-vuelta': {
    icon: '🔄',
    name: 'Resurección',
    description: 'Vuelve a entrenar después de 7 días sin actividad'
  },
  'madrugador': {
    icon: '🌅',
    name: 'Madrugador',
    description: 'Completa entrenamientos en horario matutino'
  },
  'perfeccionista': {
    icon: '✅',
    name: 'Perfeccionista',
    description: 'Completa 5 semanas al 100%'
  },
  'velocista': {
    icon: '💨',
    name: 'Velocista',
    description: 'Completa un plan en menos de 50 días'
  },
  'persistencia': {
    icon: '💎',
    name: 'Diamante en Bruto',
    description: 'Entrena más de 100 días en total'
  },
  'coleccionista-badges': {
    icon: '🏅',
    name: 'Coleccionista',
    description: 'Desbloquea 15 logros'
  },
  'maestro-absolute': {
    icon: '🧙',
    name: 'Maestro Absoluto',
    description: 'Desbloquea 25 logros'
  }
};

// ===========================================
// SISTEMA DE PROGRESIÓN Y EXPERIENCIA
// ===========================================
const XP_POR_PLAN = {
  'sobrepeso': 10,    // Principiantes: 10 XP por día
  '30min': 15,        // Básico: 15 XP
  '5k': 20,           // Intermedio: 20 XP
  'fartlek': 25,      // Avanzado: 25 XP
  '10k': 30,          // Avanzado: 30 XP
  'trail': 35,        // Experto: 35 XP
  'hiit': 40          // Experto intenso: 40 XP
};

const NIVELES_XP = {
  'beginner': { nombre: 'Principiante', xpMinimo: 0, xpMaximo: 300, siguiente: 'intermediate' },
  'intermediate': { nombre: 'Intermedio', xpMinimo: 300, xpMaximo: 800, siguiente: 'advanced' },
  'advanced': { nombre: 'Avanzado', xpMinimo: 800, xpMaximo: 1500, siguiente: 'expert' },
  'expert': { nombre: 'Experto', xpMinimo: 1500, xpMaximo: 9999, siguiente: null }
};

// ===========================================
// MENSAJES MOTIVACIONALES POR NIVEL DE USUARIO
// ===========================================
const mensajesMotivadores = {
  beginner: [
    { min: 0, max: 10, mensaje: "¡Vamos! El primer paso es el más importante. 💪 Cada gran corredor empezó donde tú estás ahora." },
    { min: 11, max: 30, mensaje: "¡Buen comienzo! 🚀 Cada entrenamiento te acerca a tus metas. Sigue así." },
    { min: 31, max: 50, mensaje: "¡Ya estás en camino! 🔥 La constancia es la clave. Siente el progreso." },
    { min: 51, max: 70, mensaje: "¡Más de la mitad! 🌟 Estás haciendo un trabajo increíble. No pares ahora." },
    { min: 71, max: 90, mensaje: "¡Casi lo logras! 💯 El esfuerzo de hoy es el éxito de mañana. ¡Tú puedes!" },
    { min: 91, max: 99, mensaje: "¡Último empujón! 🏁 Prepárate para celebrar tu logro. Eres increíble." },
    { min: 100, max: 100, mensaje: "¡LO LOGRASTE! 🎉🏆 Eres un/a verdadero/a corredor/a. ¡Celebra este momento!" }
  ],
  intermediate: [
    { min: 0, max: 10, mensaje: "¡Retoma tu ritmo! 💪 Ya tienes experiencia, ahora es momento de mejorar." },
    { min: 11, max: 30, mensaje: "¡Vas por buen camino! 🚀 Tu consistencia está dando resultados." },
    { min: 31, max: 50, mensaje: "¡Mitad del camino! 🔥 Tu dedicación es inspiradora. Siente cómo mejoras." },
    { min: 51, max: 70, mensaje: "¡Más de la mitad! 🌟 Estás superando expectativas. Sigue así." },
    { min: 71, max: 90, mensaje: "¡Casi llegas! 💯 Tu perseverancia es admirable. El éxito está cerca." },
    { min: 91, max: 99, mensaje: "¡Último esfuerzo! 🏁 Estás a punto de alcanzar un nuevo nivel." },
    { min: 100, max: 100, mensaje: "¡META ALCANZADA! 🎉🏆 Has demostrado tu compromiso. ¡Eres increíble!" }
  ],
  advanced: [
    { min: 0, max: 10, mensaje: "¡A por todas! 💪 Como corredor avanzado, sabes que la disciplina es clave." },
    { min: 11, max: 30, mensaje: "¡Imparable! 🚀 Tu experiencia se nota en cada zancada." },
    { min: 31, max: 50, mensaje: "¡Mitad del recorrido! 🔥 Estás puliendo tu técnica y resistencia." },
    { min: 51, max: 70, mensaje: "¡Dominando el plan! 🌟 Tu dedicación es ejemplar." },
    { min: 71, max: 90, mensaje: "¡Casi perfection! 💯 Estás a punto de alcanzar la excelencia." },
    { min: 91, max: 99, mensaje: "¡Último sprint! 🏁 Tu determinación te llevará al éxito." },
    { min: 100, max: 100, mensaje: "¡EXCELENCIA LOGrada! 🎉🏆 Has demostrado maestría en tu entrenamiento." }
  ],
  expert: [
    { min: 0, max: 10, mensaje: "¡Maestro en acción! 💪 Como experto, sabes que cada detalle cuenta." },
    { min: 11, max: 30, mensaje: "¡Precisión experta! 🚀 Tu técnica y conocimiento marcan la diferencia." },
    { min: 31, max: 50, mensaje: "¡Mitad del camino hacia la maestría! 🔥 Estás refinando tu arte." },
    { min: 51, max: 70, mensaje: "¡Dominio total! 🌟 Tu ejecución es impecable." },
    { min: 71, max: 90, mensaje: "¡Casi perfección absoluta! 💯 Estás a un paso de la excelencia máxima." },
    { min: 91, max: 99, mensaje: "¡Último refinamiento! 🏁 Pulir estos detalles te llevará la cima." },
    { min: 100, max: 100, mensaje: "¡MAESTRÍA ALCANZADA! 🎉🏆 Has demostrado pericia total. ¡Eres una inspiración!" }
  ]
};

// ===========================================
// FUNCIONALIDADES DE LA APLICACIÓN
// ===========================================

// Animación de inicio
document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.getElementById('splashScreen');
  const splashTitle = document.getElementById('splashTitle');
  const loadingCircle = document.getElementById('loadingCircle');
  
  // Aplicar tema oscuro si está guardado
  if (darkMode) {
    applyDarkMode();
  }
  
  // Verificar autenticación primero
  const isAuthenticated = checkAuthStatus();
  
  setTimeout(() => {
    splashTitle.style.animation = 'fadeInUp 0.8s ease-out forwards';
    loadingCircle.style.animation = 'fadeInUp 0.8s ease-out 0.3s forwards';
  }, 100);
  
  setTimeout(() => {
    splashScreen.style.opacity = '0';
    document.body.classList.add('app-loaded');
    setTimeout(() => splashScreen.remove(), 500);
    
    // Si no está autenticado, mostrar el formulario de login
    if (!isAuthenticated) {
      authContainer.classList.remove('hidden');
    }
  }, 2500);
  
  // Inicializar event listeners
  initEventListeners();
});

// Inicializar event listeners
function initEventListeners() {
  // Cambiar entre pestañas de login/registro
  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
  });

  registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
  });

  // Dark Mode Toggle
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }

  // Controles de sonido mejorados
  const soundOptions = document.querySelectorAll('.sound-option');
  soundOptions.forEach(option => {
    option.addEventListener('click', async (e) => {
      const nextSoundMode = e.currentTarget.dataset.sound;
      await setSoundMode(nextSoundMode, soundOptions, true);
    });
  });

  // Establecer opción de sonido activa
  renderSoundOptions(soundOptions);

  // Registrar nuevo usuario
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const level = document.getElementById('registerLevel').value;
    
    if (users[email]) {
      showToast('Este correo ya está registrado', 'error');
      return;
    }
    
    // Crear nuevo usuario
    users[email] = {
      name,
      email,
      password,
      level,
      xp: 0,
      progressData: {},
      createdAt: new Date().toISOString()
    };
    
    // Guardar en localStorage
    localStorage.setItem("runningTrainerUsers", JSON.stringify(users));
    
    // Iniciar sesión automáticamente
    loginUser(email, password);
  });

  // Iniciar sesión
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    loginUser(email, password);
  });

  // Cerrar sesión
  logoutBtn.addEventListener('click', () => {
    profileModal.classList.remove('active');
    currentUser = null;
    disableWakeLock();
    localStorage.removeItem("currentUser");
    
    userBar.classList.add("visible");

    authContainer.classList.remove('hidden');
    
    showToast('Sesión cerrada correctamente', 'success');
  });

  // Abrir modal de perfil
  profileBtn.addEventListener('click', () => {
    updateProfileModal();
    checkBadges();
    renderBadges();
    profileModal.classList.add('active');
  });

  // Cambiar foto de perfil
  if (profileAvatar) {
    profileAvatar.addEventListener('click', () => {
      if (profilePhotoInput) profilePhotoInput.click();
    });
  }

  if (profilePhotoInput) {
    profilePhotoInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Photo = event.target?.result;
          if (currentUser && typeof base64Photo === 'string') {
            currentUser.profilePhoto = base64Photo;
            saveUserData();
            updateUserInterface();
            updateProfileModal();
            showToast('Foto de perfil actualizada', 'success');
          }
        };
        reader.readAsDataURL(file);
      }
      e.target.value = '';
    });
  }

  // Cerrar modal de perfil
  closeProfileModalBtn.addEventListener('click', () => {
    profileModal.classList.remove('active');
  });
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      profileModal.classList.remove('active');
    }
  });

  // Event Listeners del temporizador
  closeTimerModalBtn.addEventListener('click', closeTimerModal);
  timerModal.addEventListener('click', (e) => {
      if (e.target === timerModal) closeTimerModal();
  });
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
  
  // Cerrar modales con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    if (profileModal.classList.contains('active')) {
      profileModal.classList.remove('active');
      return;
    }

    if (timerModal.classList.contains('active')) {
      closeTimerModal();
    }
  });

  window.addEventListener('resize', handleWeeksContainerPlacement);
}

function toggleDarkMode() {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', darkMode);
  applyDarkMode();
  showToast(darkMode ? 'Tema oscuro activado' : 'Tema claro activado', 'success');
}

function applyDarkMode() {
  if (darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  if (darkModeToggle) {
    darkModeToggle.textContent = darkMode ? '☀️ Modo claro' : '🌙 Modo oscuro';
    darkModeToggle.title = darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    darkModeToggle.setAttribute('aria-label', darkModeToggle.title);
  }
}

function renderBadges() {
  if (!badgesGrid || !currentUser) return;

  badgesGrid.innerHTML = '';
  Object.entries(BADGES).forEach(([badgeId, badgeInfo]) => {
    const unlockedBadges = currentUser.badges || [];
    const isUnlocked = unlockedBadges.includes(badgeId);

    const badgeEl = document.createElement('div');
    badgeEl.className = `badge ${isUnlocked ? 'unlocked' : 'locked'}`;
    badgeEl.title = badgeInfo.description;
    badgeEl.innerHTML = `
      <div class="badge-icon">${badgeInfo.icon}</div>
      <div class="badge-name">${badgeInfo.name}</div>
    `;
    badgesGrid.appendChild(badgeEl);
  });
}

function unlockBadge(badgeId) {
  if (!currentUser) return;
  if (!currentUser.badges) currentUser.badges = [];

  if (!currentUser.badges.includes(badgeId)) {
    currentUser.badges.push(badgeId);
    const badgeInfo = BADGES[badgeId];
    showToast(`Logro desbloqueado: ${badgeInfo.name}`, 'success');
    saveUserData();
    renderBadges();
  }
}

function checkBadges() {
  if (!currentUser) return;

  // Calcular entrenamientos completados de forma más defensiva
  let totalCompleted = 0;
  for (const planData of Object.values(currentUser.progressData || {})) {
    if (planData && typeof planData === 'object') {
      for (const weekData of Object.values(planData)) {
        if (Array.isArray(weekData)) {
          totalCompleted += weekData.filter(v => v === true).length;
        }
      }
    }
  }

  const currentLevel = currentUser.level;
  const currentXP = currentUser.xp || 0;
  const hasTraining = totalCompleted > 0;
  const previousBadges = new Set(currentUser.badges || []);

  // Si no hay entrenamientos, limpiar TODOS los logros sin excepción
  if (!hasTraining) {
    currentUser.badges = [];
    if (previousBadges.size > 0) {
      saveUserData();
      renderBadges();
    }
    return;
  }

  const trainedPlans = Object.entries(currentUser.progressData || {}).filter(([, planData]) => {
    const completedDays = Object.values(planData || {}).flat().filter(Boolean).length;
    return completedDays > 0;
  }).length;

  const eligibleBadges = new Set();
  const grantIf = (condition, badgeId) => {
    if (condition) eligibleBadges.add(badgeId);
  };

  grantIf(totalCompleted >= 1, 'primer-entrenamiento');
  grantIf(totalCompleted >= 1, 'bienvenida');

  grantIf(totalCompleted >= 7, 'semana-completa');
  grantIf(totalCompleted >= 14, 'dos-semanas');
  grantIf(totalCompleted >= 30, 'mes-entrenador');

  grantIf(currentLevel === 'intermediate' && currentXP >= NIVELES_XP.intermediate.xpMinimo, 'nivel-intermedio');
  grantIf(currentLevel === 'advanced' && currentXP >= NIVELES_XP.advanced.xpMinimo, 'nivel-avanzado');
  grantIf(currentLevel === 'expert' && currentXP >= NIVELES_XP.expert.xpMinimo, 'experto');

  grantIf(totalCompleted >= 56, 'plan-completado');

  grantIf(currentUser.progressData['30min'] && getPlanCompletionPercentage('30min') === 100, 'plan-30min');
  grantIf(currentUser.progressData['5k'] && getPlanCompletionPercentage('5k') === 100, 'plan-5k');
  grantIf(currentUser.progressData['10k'] && getPlanCompletionPercentage('10k') === 100, 'plan-10k');
  grantIf(currentUser.progressData['hiit'] && getPlanCompletionPercentage('hiit') === 100, 'plan-hiit');
  grantIf(currentUser.progressData['fartlek'] && getPlanCompletionPercentage('fartlek') === 100, 'plan-fartlek');
  grantIf(currentUser.progressData['trail'] && getPlanCompletionPercentage('trail') === 100, 'plan-trail');
  grantIf(trainedPlans >= 6, 'todos-planes');

  grantIf(totalCompleted >= 50, '50-entrenamientos');
  grantIf(totalCompleted >= 100, '100-entrenamientos');
  grantIf(totalCompleted >= 250, '250-entrenamientos');
  grantIf(currentXP >= 500, '500-xp');
  grantIf(currentXP >= 1000, '1000-xp');

  const currentStreak = calculateCurrentStreak();
  grantIf(currentStreak >= 3, 'racha-3');
  grantIf(currentStreak >= 7, 'racha-7');
  grantIf(currentStreak >= 30, 'racha-30');

  grantIf(trainedPlans >= 7, 'semana-todos-planes');
  grantIf(totalCompleted >= 100, 'persistencia');

  const perfectWeeks = countPerfectWeeks();
  grantIf(perfectWeeks >= 5, 'perfeccionista');

  if (eligibleBadges.size >= 15) eligibleBadges.add('coleccionista-badges');
  if (eligibleBadges.size >= 25) eligibleBadges.add('maestro-absolute');

  const addedBadges = Array.from(eligibleBadges).filter(badgeId => !previousBadges.has(badgeId));
  const removedBadges = Array.from(previousBadges).filter(badgeId => !eligibleBadges.has(badgeId));

  if (addedBadges.length === 0 && removedBadges.length === 0) return;

  currentUser.badges = Array.from(eligibleBadges);
  saveUserData();
  renderBadges();

  addedBadges.forEach((badgeId) => {
    const badgeInfo = BADGES[badgeId];
    if (badgeInfo) {
      showToast(`Logro desbloqueado: ${badgeInfo.name}`, 'success');
    }
  });
}

function getPlanCompletionPercentage(plan) {
  if (!currentUser || !currentUser.progressData[plan] || !planes[plan]) return 0;
  const planData = currentUser.progressData[plan];
  const totalDays = planes[plan].length * 7;
  const completedDays = Object.values(planData).flat().filter(v => v).length;
  return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
}

function calculateCurrentStreak() {
  if (!currentUser || !currentUser.progressData) return 0;

  let streak = 0;
  let foundBreak = false;

  for (const plan of Object.keys(currentUser.progressData).reverse()) {
    const planData = currentUser.progressData[plan];
    const weeksData = Object.entries(planData).sort().reverse();

    for (const [, dayArray] of weeksData) {
      for (const day of [...dayArray].reverse()) {
        if (day) {
          streak++;
        } else {
          foundBreak = true;
          break;
        }
      }
      if (foundBreak) break;
    }
    if (foundBreak) break;
  }

  return streak;
}

function countPerfectWeeks() {
  if (!currentUser || !currentUser.progressData) return 0;

  let perfectWeeks = 0;
  for (const plan of Object.keys(currentUser.progressData)) {
    const planData = currentUser.progressData[plan];
    if (!planes[plan]) continue;
    const planWeeks = planes[plan].length;

    for (let w = 0; w < planWeeks; w++) {
      const weekKey = `semana${w}`;
      const weekDays = planData[weekKey] || [];
      const isWeekComplete = weekDays.length > 0 && weekDays.every(day => day);
      if (isWeekComplete) perfectWeeks++;
    }
  }
  return perfectWeeks;
}

function saveUserData() {
  if (currentUser) {
    users[currentUser.email] = currentUser;
    localStorage.setItem('runningTrainerUsers', JSON.stringify(users));
  }
}

function isMobileLayout() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function moveWeeksContainerBelowSelectedPlan(selectedCard) {
  if (!weeksContainerElement || !weeksDefaultAnchor) return;

  if (isMobileLayout() && selectedCard) {
    selectedCard.insertAdjacentElement('afterend', weeksContainerElement);
    return;
  }

  weeksDefaultAnchor.insertAdjacentElement('afterend', weeksContainerElement);
}

function handleWeeksContainerPlacement() {
  const activeCard = document.querySelector('.plan-card.active');
  moveWeeksContainerBelowSelectedPlan(activeCard);
}

// Función para mostrar notificaciones toast
function showToast(message, type = "") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast";
  
  if (type) {
    toast.classList.add(type);
  }
  
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function getSoundModeLabel(mode) {
  const labels = {
    on: 'Habilitado',
    success: 'Solo Éxito',
    motivation: 'Motivación',
    off: 'Silencio'
  };

  return labels[mode] || 'Habilitado';
}

function renderSoundOptions(soundOptions = document.querySelectorAll('.sound-option')) {
  soundOptions.forEach(option => {
    const isActive = option.dataset.sound === soundMode;
    option.classList.toggle('active', isActive);
    option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  if (soundStatus) {
    soundStatus.textContent = `Modo actual: ${getSoundModeLabel(soundMode)}`;
  }
}

async function ensureAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContextClass();
  }

  if (sharedAudioContext.state === 'suspended') {
    try {
      await sharedAudioContext.resume();
    } catch (error) {
      console.warn('No se pudo reactivar el audio del temporizador', error);
    }
  }

  return sharedAudioContext;
}

async function setSoundMode(nextMode, soundOptions, showFeedback = false) {
  soundMode = nextMode;
  localStorage.setItem('soundMode', soundMode);
  renderSoundOptions(soundOptions);

  if (soundMode !== 'off') {
    await ensureAudioContext();
  }

  if (showFeedback) {
    if (soundMode === 'success') {
      createCompletionSound();
    } else if (soundMode === 'on' || soundMode === 'motivation') {
      createBellSound();
    }

    showToast(`Sonido: ${getSoundModeLabel(soundMode)}`, 'success');
  }
}

function loginUser(email, password) {
  const user = users[email];
  
  if (!user) {
    showToast('Usuario no encontrado', 'error');
    return;
  }
  
  if (user.password !== password) {
    showToast('Contraseña incorrecta', 'error');
    return;
  }
  
  // Establecer usuario actual
  currentUser = user;
  localStorage.setItem("currentUser", email);
  
  // Ocultar auth y mostrar aplicación
  authContainer.classList.add('hidden');
  userBar.classList.add("visible");
  
  // Actualizar interfaz de usuario
  updateUserInterface();
  
  // Inicializar la aplicación
  initApp();
  
  showToast(`¡Bienvenido/a de nuevo, ${user.name}!`, 'success');
  activateWakeLockIfNeeded();
 }
// Verificar si hay una sesión activa al cargar la página
function checkAuthStatus() {
  const userEmail = localStorage.getItem("currentUser");
  
  if (userEmail && users[userEmail]) {
    currentUser = users[userEmail];
    // Migrar usuarios antiguos sin XP
    if (typeof currentUser.xp === 'undefined') {
      currentUser.xp = 0;
      users[userEmail] = currentUser;
      localStorage.setItem("runningTrainerUsers", JSON.stringify(users));
    }
    authContainer.classList.add('hidden');
    userBar.style.display = 'flex';
    updateUserInterface();
    activateWakeLockIfNeeded();
    return true;
  }
  
  return false;
}

// Verificar y aplicar subida de nivel
function checkLevelUp(nivelAnterior, xpGanado) {
  const infoNivelActual = NIVELES_XP[currentUser.level];
  
  if (currentUser.xp >= infoNivelActual.xpMaximo && infoNivelActual.siguiente) {
    currentUser.level = infoNivelActual.siguiente;
    const nuevoNivel = getLevelLabel(currentUser.level);
    
    // Notificación épica de subida de nivel
    setTimeout(() => {
      showToast(`🎉 ¡NIVEL SUPERIOR! Ahora eres ${nuevoNivel} 🏆`, "level-up");
      
      // Segundo mensaje motivacional
      setTimeout(() => {
        showToast(`🌟 ¡Sigue así! Tu dedicación está dando resultados.`, "success");
      }, 3500);
    }, 500);
  }
}

// Actualizar interfaz de usuario con datos del usuario
function updateUserInterface() {
  if (!currentUser) return;
  
  // Actualizar barra de usuario
  userName.textContent = currentUser.name;
  
  // Actualizar avatar con foto de perfil si existe
  if (currentUser.profilePhoto) {
    userAvatar.style.backgroundImage = `url('${currentUser.profilePhoto}')`;
    userAvatar.textContent = '';
  } else {
    userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    userAvatar.style.backgroundImage = '';
  }
  
  userLevelBadge.textContent = getLevelLabel(currentUser.level);
  userLevelBadge.className = `user-level level-${currentUser.level}`;
  
  // Actualizar mini barra de XP
  const currentXP = currentUser.xp || 0;
  const infoNivel = NIVELES_XP[currentUser.level];
  const xpEnNivel = currentXP - infoNivel.xpMinimo;
  const xpParaNivel = infoNivel.xpMaximo - infoNivel.xpMinimo;
  const porcentajeXP = Math.min(100, Math.round((xpEnNivel / xpParaNivel) * 100));
  
  const userXPBar = document.getElementById('userXPBar');
  const userXPText = document.getElementById('userXPText');
  
  if (userXPBar && userXPText) {
    userXPBar.style.width = `${porcentajeXP}%`;
    userXPText.textContent = `${currentXP} XP`;
  }
}

// Obtener etiqueta para el nivel
function getLevelLabel(level) {
  const labels = {
    'beginner': 'Principiante',
    'intermediate': 'Intermedio',
    'advanced': 'Avanzado',
    'expert': 'Experto'
  };
  return labels[level] || 'Principiante';
}

function isRestDay(description = '') {
  return /descanso|recuperaci[oó]n/i.test(description.toLowerCase());
}

function getWeekTrainingStats(weekIndex) {
  const weekDays = planes[planActual][weekIndex] || [];
  const weekProgress = currentUser.progressData[planActual]?.[`semana${weekIndex}`] || [];
  let totalTrainingDays = 0;
  let completedTrainingDays = 0;

  weekDays.forEach(([, description], dayIndex) => {
    if (isRestDay(description)) return;
    totalTrainingDays++;
    if (weekProgress[dayIndex]) completedTrainingDays++;
  });

  return { totalTrainingDays, completedTrainingDays };
}

function getPlanTrainingStats() {
  let totalTrainingDays = 0;
  let completedTrainingDays = 0;

  planes[planActual].forEach((_, weekIndex) => {
    const weekStats = getWeekTrainingStats(weekIndex);
    totalTrainingDays += weekStats.totalTrainingDays;
    completedTrainingDays += weekStats.completedTrainingDays;
  });

  return { totalTrainingDays, completedTrainingDays };
}

// Actualizar modal de perfil
function updateProfileModal() {
  if (!currentUser) return;
  
  profileName.textContent = currentUser.name;
  
  // Actualizar avatar del modal con foto de perfil si existe
  if (currentUser.profilePhoto) {
    profileAvatar.style.backgroundImage = `url('${currentUser.profilePhoto}')`;
    profileAvatar.textContent = '';
  } else {
    profileAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    profileAvatar.style.backgroundImage = '';
  }
  
  profileLevelBadge.textContent = getLevelLabel(currentUser.level);
  profileLevelBadge.className = `user-level level-${currentUser.level}`;
  
  // Calcular estadísticas (solo días de entrenamiento, sin descansos)
  const { completedTrainingDays: completedDays, totalTrainingDays: totalDays } = getPlanTrainingStats();
  
  const progress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  
  profilePlan.textContent = document.getElementById('planTitle').textContent.replace('Plan de Entrenamiento: ', '');
  profileCompleted.textContent = completedDays;
  profileTotal.textContent = totalDays;
  profileProgress.textContent = `${progress}%`;
  
  // Actualizar información de XP
  const currentXP = currentUser.xp || 0;
  const infoNivel = NIVELES_XP[currentUser.level];
  const xpEnNivel = currentXP - infoNivel.xpMinimo;
  const xpParaNivel = infoNivel.xpMaximo - infoNivel.xpMinimo;
  const porcentajeXP = Math.min(100, Math.round((xpEnNivel / xpParaNivel) * 100));
  
  document.getElementById('profileXP').textContent = `${currentXP} / ${infoNivel.xpMaximo} XP`;
  document.getElementById('profileXPBar').style.width = `${porcentajeXP}%`;
  
  if (infoNivel.siguiente) {
    const siguienteNombre = NIVELES_XP[infoNivel.siguiente].nombre;
    const xpFaltante = infoNivel.xpMaximo - currentXP;
    document.getElementById('profileNextLevel').textContent = `Siguiente nivel: ${siguienteNombre} (${xpFaltante} XP restantes)`;
  } else {
    document.getElementById('profileNextLevel').textContent = '¡Nivel máximo alcanzado! 🏆';
  }

  if (levelProgressDetails) {
    const levelProgressContent = levelProgressDetails.querySelector('.level-progress-content');
    if (levelProgressContent) {
      const content = infoNivel.siguiente
        ? `
          <div>Nivel actual: <strong>${getLevelLabel(currentUser.level)}</strong></div>
          <div>XP actual: <strong>${currentXP} / ${infoNivel.xpMaximo}</strong></div>
          <div style="margin-top: 0.5rem;">Necesitas <strong>${infoNivel.xpMaximo - currentXP} XP</strong> para alcanzar <strong>${NIVELES_XP[infoNivel.siguiente].nombre}</strong>.</div>
          <div style="margin-top: 0.5rem;">Planes que dan m&aacute;s XP:</div>
          <ul>
            <li>HIIT: 40 XP por d&iacute;a</li>
            <li>Trail: 35 XP por d&iacute;a</li>
            <li>10K: 30 XP por d&iacute;a</li>
            <li>Fartlek: 25 XP por d&iacute;a</li>
          </ul>
        `
        : `
          <div>Nivel actual: <strong>${getLevelLabel(currentUser.level)}</strong></div>
          <div>XP actual: <strong>${currentXP} / ${infoNivel.xpMaximo}</strong></div>
          <div style="margin-top: 0.5rem;"><strong>Has alcanzado el nivel m&aacute;ximo.</strong></div>
        `;

      levelProgressContent.innerHTML = content;
    }
  }
}

function initApp() {
  if (!currentUser) return;
  
  // Inicializar datos de progreso si no existen
  if (!currentUser.progressData) {
    currentUser.progressData = {};
    users[currentUser.email] = currentUser;
    localStorage.setItem("runningTrainerUsers", JSON.stringify(users));
  }
  
  cambiarPlan("30min");
  
  // Verificar si hay datos guardados
  if (currentUser.progressData) {
    showToast(`¡Bienvenido/a ${currentUser.name}! Tus datos de entrenamiento se han cargado correctamente`, "success");
  }
}

function cambiarPlan(tipo) {
  if (!currentUser) return;
  
  // Cerrar todos los desplegables de semanas del plan anterior
  document.querySelectorAll('.week-button.active').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  });
  document.querySelectorAll('.day-details.active').forEach(details => {
    details.classList.remove('active');
  });
  
  planActual = tipo;
  const nombre = {
    "30min": "Corre 30 Minutos", "5k": "Corre 5K", "10k": "Corre 10K",
    "fartlek": "Entrenamiento Fartlek", "hiit": "Entrenamiento HIIT",
    "trail": "Trail Running", "sobrepeso": "Principiantes con Sobrepeso"
  }[tipo] || "Plan";
  document.getElementById("planTitle").textContent = `Plan de Entrenamiento: ${nombre}`;

  // Actualizar clases activas de las tarjetas
  document.querySelectorAll('.plan-card').forEach(card => {
    card.classList.remove('active');
  });
  
  // Marcar la tarjeta activa
  const planIndex = ['30min', '5k', '10k', 'fartlek', 'hiit', 'trail', 'sobrepeso'].indexOf(tipo);
  if (planIndex >= 0) {
    const cards = document.querySelectorAll('.plan-card');
    if (cards[planIndex]) {
      cards[planIndex].classList.add('active');
      moveWeeksContainerBelowSelectedPlan(cards[planIndex]);
      // Scroll suave hacia el plan seleccionado
      cards[planIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } else {
    moveWeeksContainerBelowSelectedPlan(null);
  }

  if (!currentUser.progressData[tipo]) {
    currentUser.progressData[tipo] = {};
    planes[tipo].forEach((_, weekIndex) => {
      currentUser.progressData[tipo][`semana${weekIndex}`] = Array(planes[tipo][weekIndex].length).fill(false);
    });
    // Guardar los cambios
    users[currentUser.email] = currentUser;
    localStorage.setItem("runningTrainerUsers", JSON.stringify(users));
    showToast(`¡Nuevo plan "${nombre}" iniciado!`, "success");
  }
  renderWeeks();
  updateChart();
  updateMotivationalMessage();
}

function renderWeeks() {
  if (!currentUser) return;

  weeksContainerElement.innerHTML = "";
  planes[planActual].forEach((diasSemana, weekIndex) => {
    const weekWrapper = document.createElement("div");
    weekWrapper.className = `week-wrapper animate-slide-up delay-${weekIndex % 3}`;

    const weekButton = document.createElement("button");
    weekButton.className = `week-button`;
    weekButton.setAttribute("aria-expanded", "false");

    // Calcular progreso de la semana para el pill
    const ws = getWeekTrainingStats(weekIndex);
    const pillText = ws.totalTrainingDays > 0
      ? `${ws.completedTrainingDays}/${ws.totalTrainingDays} días`
      : 'Sin entrenos';

    weekButton.innerHTML = `
      <span class="week-btn-label">Semana ${weekIndex + 1}</span>
      <span class="week-btn-meta">
        <span class="week-progress-pill">${pillText}</span>
        <span class="week-btn-arrow">▶</span>
      </span>
    `;
    
    const weekDetailsDiv = document.createElement("div");
    weekDetailsDiv.className = `day-details`;
    weekButton.onclick = () => {
        // Cerrar todas las semanas abiertas
        document.querySelectorAll('.week-button.active').forEach(btn => {
            if (btn !== weekButton) {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
        document.querySelectorAll('.day-details.active').forEach(details => {
            if (details !== weekDetailsDiv) {
                details.classList.remove('active');
            }
        });
        
        // Alternar la semana actual
        const isExpanded = weekDetailsDiv.classList.toggle('active');
        weekButton.classList.toggle('active');
        weekButton.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    };

    diasSemana.forEach(([day, description], dayIndex) => {
      const dayItem = document.createElement("div");
      dayItem.className = "day-item";

      const dayText = document.createElement("div");
      dayText.className = "day-text-wrap";
      dayText.innerHTML = `<span class="day-name-badge">${day}</span><span class="day-description">${description}</span>`;

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "actions";

      if (isRestDay(description)) {
        const restLabel = document.createElement('span');
        restLabel.className = 'rest-day-label';
        restLabel.innerHTML = '💤 Descanso';

        dayItem.appendChild(dayText);
        dayItem.appendChild(restLabel);
        weekDetailsDiv.appendChild(dayItem);
        return;
      }

      const timerButton = document.createElement("button");
      timerButton.className = "btn btn-sm btn-secondary";
      timerButton.innerHTML = '⏱️ Usar Temporizador';
      timerButton.onclick = (e) => {
          e.stopPropagation();
          openTimerModal(description);
      };

      const completeButton = document.createElement("button");
      const isCompleted = currentUser.progressData[planActual][`semana${weekIndex}`][dayIndex];
      completeButton.className = `btn btn-sm ${isCompleted ? 'btn-success completed' : 'btn-secondary'}`;
      completeButton.textContent = isCompleted ? "Completado" : "Marcar";
      completeButton.onclick = (e) => {
        e.stopPropagation();
        toggleDayComplete(weekIndex, dayIndex, completeButton, weekButton);
      };

      actionsDiv.appendChild(timerButton);
      actionsDiv.appendChild(completeButton);
      dayItem.appendChild(dayText);
      dayItem.appendChild(actionsDiv);
      weekDetailsDiv.appendChild(dayItem);
    });

    const downloadButton = document.createElement("button");
    downloadButton.className = "btn btn-pdf btn-primary";
    downloadButton.innerHTML = '📄 Descargar PDF';
    downloadButton.onclick = () => downloadWeekPDF(weekIndex);
    weekDetailsDiv.appendChild(downloadButton);

    weekWrapper.appendChild(weekButton);
    weekWrapper.appendChild(weekDetailsDiv);
    weeksContainerElement.appendChild(weekWrapper);
    
    updateWeekButtonState(weekIndex, weekButton);
  });
}

function toggleDayComplete(weekIndex, dayIndex, button, weekButton) {
  if (!currentUser) return;

  const dayDescription = planes[planActual][weekIndex]?.[dayIndex]?.[1] || '';
  if (isRestDay(dayDescription)) {
    showToast('El dia de descanso no se marca como entrenamiento.', 'error');
    return;
  }
  
  const currentStatus = currentUser.progressData[planActual][`semana${weekIndex}`][dayIndex];
  currentUser.progressData[planActual][`semana${weekIndex}`][dayIndex] = !currentStatus;
  
  // Si se completa el entrenamiento, añadir XP
  if (!currentStatus) {
    const xpGanado = XP_POR_PLAN[planActual] || 15;
    const nivelAnterior = currentUser.level;
    currentUser.xp = (currentUser.xp || 0) + xpGanado;
    
    // Verificar si sube de nivel
    checkLevelUp(nivelAnterior, xpGanado);
  } else {
    // Si desmarca, restar XP
    const xpPerdido = XP_POR_PLAN[planActual] || 15;
    currentUser.xp = Math.max(0, (currentUser.xp || 0) - xpPerdido);
  }
  
  // Guardar cambios
  users[currentUser.email] = currentUser;
  localStorage.setItem("runningTrainerUsers", JSON.stringify(users));

  button.textContent = !currentStatus ? "Completado" : "Marcar";
  button.classList.toggle('btn-success', !currentStatus);
  button.classList.toggle('completed', !currentStatus);
  button.classList.toggle('btn-secondary', currentStatus);
  
  updateWeekButtonState(weekIndex, weekButton);
  updateChart();
  updateMotivationalMessage();
  updateUserInterface();
  checkBadges();
  
  // Mostrar notificación
  if (!currentStatus) {
    showToast(`¡Entrenamiento completado! +${XP_POR_PLAN[planActual] || 15} XP 🌟`, "success");
  } else {
    showToast("Entrenamiento marcado como pendiente.", "error");
  }
}

function updateWeekButtonState(weekIndex, weekButton) {
  if (!currentUser) return;
  const { totalTrainingDays, completedTrainingDays } = getWeekTrainingStats(weekIndex);
  const allDaysComplete = totalTrainingDays > 0 && completedTrainingDays === totalTrainingDays;
  weekButton.classList.toggle('completed', allDaysComplete);

  // Actualizar pill de progreso
  const pill = weekButton.querySelector('.week-progress-pill');
  if (pill) {
    pill.textContent = totalTrainingDays > 0
      ? `${completedTrainingDays}/${totalTrainingDays} días`
      : 'Sin entrenos';
  }
}

function downloadWeekPDF(weekIndex) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const planNombre = document.getElementById('planTitle').textContent.replace('Plan de Entrenamiento: ', '');
  const semana = weekIndex + 1;
  const diasSemana = planes[planActual][weekIndex];
  
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246);
  doc.setFont("helvetica", "bold");
  doc.text("RunningTrainer", 105, 20, { align: 'center' });
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(40, 25, 170, 25);
  
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text(`Plan: ${planNombre}`, 105, 35, { align: 'center' });
  doc.setFontSize(16);
  doc.setTextColor(100);
  doc.text(`Semana ${semana}`, 105, 45, { align: 'center' });
  
  const headers = [["Día", "Entrenamiento", "Estado"]];
  const data = diasSemana.map(([day, description], dayIndex) => {
    const completado = isRestDay(description)
      ? "Descanso 💤"
      : (currentUser.progressData[planActual][`semana${weekIndex}`][dayIndex] ? "Completado ✅" : "Pendiente ❌");
    return [day, description, completado];
  });
  
  doc.autoTable({
    startY: 55, head: headers, body: data, theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 125 }, 2: { cellWidth: 35, halign: 'center' }}
  });
  
  doc.save(`RunningTrainer_${planNombre.replace(/ /g, '_')}_Semana_${semana}.pdf`);
  showToast("PDF descargado correctamente", "success");
}

function updateChart() {
  if (!currentUser) return;

  const totalWeeks = planes[planActual].length;

  // ── Datos reales por semana ──────────────────────────────────────────────
  const realData = planes[planActual].map((_, wi) => {
    const s = getWeekTrainingStats(wi);
    return s.totalTrainingDays > 0
      ? Math.round((s.completedTrainingDays / s.totalTrainingDays) * 100)
      : 0;
  });

  // ── Progreso ideal (lineal 0 → 100%) ────────────────────────────────────
  const idealData = planes[planActual].map((_, wi) =>
    Math.round(((wi + 1) / totalWeeks) * 100)
  );

  // ── Semana actual (última con algún progreso o semana 0) ─────────────────
  let currentWeekIdx = realData.reduce((acc, v, i) => (v > 0 ? i : acc), -1);
  if (currentWeekIdx < 0) currentWeekIdx = 0;

  // ── Estadísticas para el resumen ─────────────────────────────────────────
  const { completedTrainingDays: doneDays, totalTrainingDays: totalDays } = getPlanTrainingStats();
  const overallPct = totalDays > 0 ? Math.round((doneDays / totalDays) * 100) : 0;
  const idealPct   = Math.round(((currentWeekIdx + 1) / totalWeeks) * 100);
  const diff       = overallPct - idealPct;

  // Resumen textual
  const badge = document.getElementById('chartWeekBadge');
  const summary = document.getElementById('chartSummary');
  if (badge) badge.textContent = `Semana ${currentWeekIdx + 1} / ${totalWeeks}`;
  if (summary) {
    const diffLabel = diff > 0
      ? `<span class="cs-ahead">+${diff}% por delante 🚀</span>`
      : diff < 0
        ? `<span class="cs-behind">${diff}% por detrás</span>`
        : `<span class="cs-on">En ritmo ideal ✓</span>`;
    summary.innerHTML = `
      <span class="cs-item">
        <span class="cs-dot" style="background:#3b82f6"></span>
        Completados: <span class="cs-val">${doneDays} / ${totalDays} días</span>
      </span>
      <span class="cs-item">
        <span class="cs-dot" style="background:#10b981"></span>
        Global: <span class="cs-val">${overallPct}%</span>
      </span>
      <span class="cs-item">${diffLabel}</span>
    `;
  }

  // ── Canvas y gradientes ──────────────────────────────────────────────────
  const ctx = document.getElementById('progressChart').getContext('2d');

  const gradReal = ctx.createLinearGradient(0, 0, 0, 260);
  gradReal.addColorStop(0,   'rgba(59,130,246,0.35)');
  gradReal.addColorStop(1,   'rgba(59,130,246,0.01)');

  const gradIdeal = ctx.createLinearGradient(0, 0, 0, 260);
  gradIdeal.addColorStop(0,  'rgba(16,185,129,0.18)');
  gradIdeal.addColorStop(1,  'rgba(16,185,129,0.01)');

  // ── Puntos especiales (100% = trofeo) ────────────────────────────────────
  const pointStyles = realData.map(v => v === 100 ? 'star' : 'circle');
  const pointRadii  = realData.map(v => v === 100 ? 8 : (v > 0 ? 5 : 3));
  const pointColors = realData.map(v =>
    v === 100 ? '#f59e0b' : (v > 0 ? '#3b82f6' : '#e2e8f0')
  );

  const labels = planes[planActual].map((_, i) => `S${i + 1}`);

  const config = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Tu progreso',
          data: realData,
          borderColor: '#3b82f6',
          borderWidth: 2.5,
          backgroundColor: gradReal,
          fill: true,
          tension: 0.4,
          pointStyle: pointStyles,
          pointRadius: pointRadii,
          pointBackgroundColor: pointColors,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 8,
          order: 1
        },
        {
          label: 'Ritmo ideal',
          data: idealData,
          borderColor: '#10b981',
          borderWidth: 2,
          borderDash: [6, 4],
          backgroundColor: gradIdeal,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#10b981',
          order: 2
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 12, boxHeight: 12, borderRadius: 6,
            usePointStyle: false,
            font: { size: 12, family: 'Inter' },
            color: '#64748b'
          }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          padding: 12,
          cornerRadius: 10,
          displayColors: true,
          callbacks: {
            title(items) {
              const wi = items[0].dataIndex;
              return `Semana ${wi + 1}`;
            },
            label(item) {
              const wi = item.dataIndex;
              if (item.datasetIndex === 0) {
                const s = getWeekTrainingStats(wi);
                const pct = item.raw;
                const trophy = pct === 100 ? ' 🏆' : '';
                return ` Tu progreso: ${s.completedTrainingDays}/${s.totalTrainingDays} días (${pct}%)${trophy}`;
              }
              return ` Ritmo ideal: ${item.raw}%`;
            },
            afterBody(items) {
              const wi = items[0].dataIndex;
              const real  = realData[wi];
              const ideal = idealData[wi];
              const d = real - ideal;
              if (d === 0) return ['  En ritmo ideal ✓'];
              return [d > 0 ? `  +${d}% por delante 🚀` : `  ${d}% por detrás`];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            callback: v => v + '%',
            font: { size: 11, family: 'Inter' },
            color: '#94a3b8',
            stepSize: 25
          },
          border: { display: false }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 11, family: 'Inter' },
            color: '#94a3b8'
          },
          border: { display: false }
        }
      },
      animation: {
        duration: 700,
        easing: 'easeInOutQuart'
      }
    },
    plugins: [
      // Plugin: línea vertical en semana actual
      {
        id: 'currentWeekLine',
        afterDraw(ch) {
          const meta = ch.getDatasetMeta(0);
          if (!meta.data[currentWeekIdx]) return;
          const x = meta.data[currentWeekIdx].x;
          const { top, bottom } = ch.chartArea;
          const { ctx: c } = ch;
          c.save();
          c.setLineDash([4, 3]);
          c.strokeStyle = 'rgba(100,116,139,0.4)';
          c.lineWidth = 1.5;
          c.beginPath();
          c.moveTo(x, top);
          c.lineTo(x, bottom);
          c.stroke();
          // Etiqueta "Hoy"
          c.setLineDash([]);
          c.fillStyle = '#64748b';
          c.font = '500 10px Inter, sans-serif';
          c.textAlign = 'center';
          c.fillText('Hoy', x, top - 4);
          c.restore();
        }
      }
    ]
  };

  if (chart) chart.destroy();
  chart = new Chart(ctx, config);
}

function updateMotivationalMessage() {
  if (!currentUser) return;

  const { completedTrainingDays: completedDays, totalTrainingDays: totalDays } = getPlanTrainingStats();

  const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  document.getElementById("progressBar").value = percentage;
  document.getElementById("progressText").textContent = `${percentage}% completado`;
  
  // Obtener mensaje según el nivel del usuario
  const userLevel = currentUser.level || 'beginner';
  const messages = mensajesMotivadores[userLevel] || mensajesMotivadores.beginner;
  const message = messages.find(m => percentage >= m.min && percentage <= m.max)?.mensaje || "";
  
  // Personalizar mensaje con el nombre del usuario
  const personalizedMessage = message.replace(/¡(\w)/, `¡${currentUser.name}, $1`);
  if (!personalizedMessage) return;

  let levelClass = 'low';
  if (percentage >= 100) levelClass = 'complete';
  else if (percentage >= 70) levelClass = 'high';
  else if (percentage >= 30) levelClass = 'medium';

  _showMotivationalBubble(personalizedMessage, levelClass);
}

// ── Globo motivacional flotante ───────────────────────────────────────────────
let _bubbleEl = null;
let _bubbleDismissHandlers = [];

function _dismissBubble() {
  if (!_bubbleEl) return;
  const el = _bubbleEl;
  _bubbleEl = null;
  _bubbleDismissHandlers.forEach(({ target, type, fn }) => target.removeEventListener(type, fn));
  _bubbleDismissHandlers = [];
  el.classList.add('bubble-out');
  setTimeout(() => el.remove(), 350);
}

function _showMotivationalBubble(text, levelClass) {
  if (_bubbleEl) {
    _bubbleDismissHandlers.forEach(({ target, type, fn }) => target.removeEventListener(type, fn));
    _bubbleDismissHandlers = [];
    _bubbleEl.remove();
    _bubbleEl = null;
  }

  const bubble = document.createElement('div');
  bubble.className = `motivational-bubble ${levelClass}`;

  bubble.appendChild(document.createTextNode(text));

  const hint = document.createElement('span');
  hint.className = 'bubble-hint';
  hint.textContent = 'Toca para cerrar';
  bubble.appendChild(hint);

  bubble.style.bottom = '90px';
  bubble.style.left = '20px';

  document.body.appendChild(bubble);
  _bubbleEl = bubble;

  const onTouch = () => _dismissBubble();

  setTimeout(() => {
    document.addEventListener('touchstart', onTouch, { once: true, passive: true });
    document.addEventListener('click', onTouch, { once: true });
    bubble.addEventListener('click', onTouch, { once: true });
    _bubbleDismissHandlers.push(
      { target: document, type: 'touchstart', fn: onTouch },
      { target: document, type: 'click',      fn: onTouch },
      { target: bubble,   type: 'click',      fn: onTouch }
    );
  }, 300);
}

// ===========================================
// LÓGICA DEL TEMPORIZADOR
// ===========================================

function parseTimeToSeconds(valueText, unitText) {
  const normalizedValue = parseFloat(valueText.replace(',', '.'));
  if (Number.isNaN(normalizedValue)) return 0;
  return unitText.toLowerCase().startsWith('min')
    ? Math.round(normalizedValue * 60)
    : Math.round(normalizedValue);
}

function extractWorkoutPreset(description) {
  const cleaned = description.trim();
  const normalized = cleaned.toLowerCase();

  if (isRestDay(normalized)) {
    return null;
  }

  const seriesMatch = normalized.match(/(\d+)\s*series?/i);
  const reps = seriesMatch ? parseInt(seriesMatch[1], 10) : 1;
  const timeMatches = [...normalized.matchAll(/(\d+(?:[\.,]\d+)?)\s*(min|minuto|minutos|seg|segundo|segundos)/gi)];
  const seconds = timeMatches.map(match => parseTimeToSeconds(match[1], match[2])).filter(Boolean);

  if (!seconds.length) {
    return null;
  }

  if (seconds.length === 1) {
    return {
      title: cleaned,
      reps,
      exerciseTime: seconds[0],
      restTime: 0,
      exerciseLabel: 'CORRER',
      restLabel: 'CAMINAR'
    };
  }

  // Detectar el orden correcto de las actividades según las palabras clave
  // Buscar qué actividad aparece primero en el texto
  const walkingWords = ['caminando', 'caminar', 'caminata'];
  const runningWords = ['corriendo', 'correr', 'fuerte', 'rápid'];
  
  const walkingIndex = Math.min(...walkingWords.map(word => {
    const idx = normalized.indexOf(word);
    return idx === -1 ? Infinity : idx;
  }));
  
  const runningIndex = Math.min(...runningWords.map(word => {
    const idx = normalized.indexOf(word);
    return idx === -1 ? Infinity : idx;
  }));
  
  // Si "caminando" aparece antes que "corriendo", invertir el orden
  const isWalkingFirst = walkingIndex < runningIndex;
  
  if (isWalkingFirst) {
    return {
      title: cleaned,
      reps,
      exerciseTime: seconds[1],  // El segundo tiempo es para correr
      restTime: seconds[0],      // El primer tiempo es para caminar
      exerciseLabel: 'CORRER',
      restLabel: 'CAMINAR'
    };
  }

  return {
    title: cleaned,
    reps,
    exerciseTime: seconds[0],
    restTime: seconds[1],
    exerciseLabel: 'CORRER',
    restLabel: 'CAMINAR'
  };
}

function formatSeconds(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  return secs.toString().padStart(2, '0');
}

function setRingProgress(remaining, total, mode = 'exercise') {
  if (!timerRingProgress) return;
  const safeTotal = Math.max(total, 1);
  const ratio = Math.max(0, Math.min(1, remaining / safeTotal));
  timerRingProgress.style.strokeDasharray = TIMER_RING_CIRCUMFERENCE;
  timerRingProgress.style.strokeDashoffset = `${TIMER_RING_CIRCUMFERENCE * (1 - ratio)}`;
  timerRingProgress.classList.toggle('exercise', mode === 'exercise');
  timerRingProgress.classList.toggle('rest', mode === 'rest');
}

function parseExerciseAndSetTimer(description) {
  currentDayWorkout = extractWorkoutPreset(description);
  const hasWorkout = Boolean(currentDayWorkout);
  startBtn.disabled = !hasWorkout;

  if (!hasWorkout) {
    timerWorkoutTitle.textContent = description;
    timerPhaseHint.textContent = 'Este dia no tiene un temporizador automatico disponible';
    totalRepsDisplay.textContent = '0';
    return;
  }

  totalReps = currentDayWorkout.reps;
  timerWorkoutTitle.textContent = currentDayWorkout.title;
  totalRepsDisplay.textContent = `${currentDayWorkout.reps}`;

  if (currentDayWorkout.restTime > 0) {
    timerPhaseHint.textContent = `${currentDayWorkout.exerciseLabel} ${formatSeconds(currentDayWorkout.exerciseTime)} / ${currentDayWorkout.restLabel} ${formatSeconds(currentDayWorkout.restTime)}`;
  } else {
    timerPhaseHint.textContent = `${currentDayWorkout.exerciseLabel} ${formatSeconds(currentDayWorkout.exerciseTime)}`;
  }
}

function openTimerModal(description) {
  parseExerciseAndSetTimer(description);
  resetTimer();
  timerModal.classList.add('active');
}

function closeTimerModal() {
  resetTimer();
  timerModal.classList.remove('running');
  timerModal.classList.remove('active');
}

function startTimer() {
  if (isRunning || !currentDayWorkout) return;

  totalReps = currentDayWorkout.reps;
  currentRep = 0;
  isRunning = true;
  isExercise = true;
  timerModal.classList.add('running');
  ensureAudioContext();
  nextPhase();
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timerLabel.textContent = 'Pausado';
  timerLabel.className = 'paused';
  timerPhaseHint.textContent = 'Presiona Iniciar para continuar';
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isExercise = true;
  timeLeft = 0;
  phaseDuration = 0;
  countdownDisplay.textContent = '00';
  timerLabel.textContent = 'Listo';
  timerLabel.className = '';
  currentRepDisplay.textContent = '0';
  setRingProgress(1, 1, 'exercise');

  if (currentDayWorkout && currentDayWorkout.restTime > 0) {
    timerPhaseHint.textContent = `${currentDayWorkout.exerciseLabel} ${formatSeconds(currentDayWorkout.exerciseTime)} / ${currentDayWorkout.restLabel} ${formatSeconds(currentDayWorkout.restTime)}`;
  } else if (currentDayWorkout) {
    timerPhaseHint.textContent = `${currentDayWorkout.exerciseLabel} ${formatSeconds(currentDayWorkout.exerciseTime)}`;
  }
}

function updateDisplay() {
  countdownDisplay.textContent = formatSeconds(timeLeft);
  setRingProgress(timeLeft, phaseDuration, isExercise ? 'exercise' : 'rest');
}

function nextPhase() {
  clearInterval(timerInterval);

  if (isExercise) {
    if (currentRep >= totalReps) {
      countdownDisplay.textContent = 'FIN';
      timerLabel.textContent = 'Entrenamiento completado';
      timerLabel.className = 'exercise';
      timerPhaseHint.textContent = 'Excelente trabajo';
      isRunning = false;
      timerModal.classList.remove('running');

      if (soundMode === 'on' || soundMode === 'success') {
        createCompletionSound();
      }

      showToast('¡Entrenamiento completado! 🎉', 'success');
      return;
    }

    currentRep++;
    currentRepDisplay.textContent = `${currentRep}`;
    timeLeft = currentDayWorkout.exerciseTime;
    phaseDuration = currentDayWorkout.exerciseTime;
    timerLabel.textContent = `¡${currentDayWorkout.exerciseLabel}!`;
    timerLabel.className = 'exercise';
    timerPhaseHint.textContent = `Serie ${currentRep} de ${totalReps}`;

    if (soundMode === 'on' || soundMode === 'motivation') {
      createBellSound();
    }
  } else {
    timeLeft = currentDayWorkout.restTime;
    phaseDuration = currentDayWorkout.restTime;
    timerLabel.textContent = `¡${currentDayWorkout.restLabel}!`;
    timerLabel.className = 'rest';
    timerPhaseHint.textContent = `Preparando serie ${Math.min(currentRep + 1, totalReps)}`;

    if (soundMode === 'on' || soundMode === 'motivation') {
      createBellSound();
    }
  }

  // Si no existe fase de descanso, saltar directamente a la siguiente serie.
  if (!phaseDuration || phaseDuration <= 0) {
    isExercise = !isExercise;
    nextPhase();
    return;
  }

  updateDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft === 3 && (soundMode === 'on' || soundMode === 'motivation')) {
      createBellSound();
    }

    if (timeLeft <= 0) {
      if (soundMode === 'on' || soundMode === 'motivation') {
        createCompletionSound();
      }

      isExercise = !isExercise;
      nextPhase();
    }
  }, 1000);
}

// Generador de sonidos
function createBellSound() {
  const context = sharedAudioContext;
  if (!context || context.state !== 'running') return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, context.currentTime); // La4
  
  gainNode.gain.setValueAtTime(0.5, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);
  
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  oscillator.start();
  oscillator.stop(context.currentTime + 1);
}

function createCompletionSound() {
  const context = sharedAudioContext;
  if (!context || context.state !== 'running') return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
  oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.2); // E5
  oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.4); // G5
  
  gainNode.gain.setValueAtTime(0.5, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);
  
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  oscillator.start();
  oscillator.stop(context.currentTime + 1);
}
// ===========================================
// PREVENIR BLOQUEO DE PANTALLA (WAKE LOCK)
// ===========================================
let wakeLock = null;

// Solicitar Wake Lock
async function enableWakeLock() {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
      console.log("🔆 Wake Lock activado");

      wakeLock.addEventListener("release", () => {
        console.log("🌙 Wake Lock liberado");
      });
    }
  } catch (err) {
    console.warn("Wake Lock no disponible:", err);
  }
}

// Liberar Wake Lock
function disableWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

// Reactivar Wake Lock si el usuario vuelve a la app
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    enableWakeLock();
  } else {
    disableWakeLock();
  }
});

// Activar Wake Lock cuando el usuario está logueado
function activateWakeLockIfNeeded() {
  if (currentUser) {
    enableWakeLock();
  }
}

/// ===========================================
// USER BAR + HAPTIC FEEDBACK (MÓVIL)
// ===========================================
(function () {
  let lastScrollY = window.scrollY;
  let startY = 0;
  let endY = 0;
  let hideTimeout = null;
  let visibleUntil = 0;

  // 🔔 HAPTIC (solo si está disponible)
  function vibrate(pattern) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  function showUserBar(withHaptic = false) {
    if (!currentUser) return;

    userBar.classList.add("visible");
    visibleUntil = Date.now() + 3000;

    if (withHaptic) {
      vibrate(15); // vibración corta
    }

    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      userBar.classList.remove("visible");
      visibleUntil = 0;
    }, 3000);
  }

  function hideUserBar(withHaptic = false, force = false) {
    if (!currentUser) return;

    if (!force && Date.now() < visibleUntil) return;

    userBar.classList.remove("visible");
    visibleUntil = 0;

    if (withHaptic) {
      vibrate([10, 40, 10]); // patrón distinto
    }

    if (hideTimeout) clearTimeout(hideTimeout);
  }

  // ===== SCROLL =====
  window.addEventListener("scroll", () => {
    if (!currentUser) return;

    const currentScroll = window.scrollY;
    const scrollDelta = currentScroll - lastScrollY;

    if (currentScroll <= 10) {
      showUserBar(false);
      lastScrollY = currentScroll;
      return;
    }

    if (Math.abs(scrollDelta) < 8) {
      return;
    }

    if (currentScroll < lastScrollY) {
      showUserBar(false);
    } else {
      hideUserBar(false);
    }

    lastScrollY = currentScroll;
  });

  // ===== TOUCH (SWIPE) =====
  window.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
  });

  window.addEventListener("touchmove", (e) => {
    endY = e.touches[0].clientY;
  });

  window.addEventListener("touchend", () => {
    if (!currentUser) return;

    const diffY = endY - startY;

    if (diffY > 60) {
      // Swipe hacia abajo
      showUserBar(true);
    } else if (diffY < -60) {
      // Swipe hacia arriba
      hideUserBar(true, true);
    }

    startY = 0;
    endY = 0;
  });

  // ===== INTERACCIÓN DIRECTA =====
  userBar.addEventListener("touchstart", () => {
    vibrate(8); // micro feedback al tocar la barra
    if (hideTimeout) clearTimeout(hideTimeout);
  });

})();
