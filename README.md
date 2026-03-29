#  RunningTrainer

**RunningTrainer** es una aplicación web progresiva diseñada para ayudar a corredores de todos los niveles a alcanzar sus objetivos de running mediante planes de entrenamiento estructurados, seguimiento de progreso y un sistema de gamificación con experiencia (XP) y niveles.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

##  Tabla de Contenidos

- [Características](#-características)
- [Demo](#-demo)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Planes de Entrenamiento](#-planes-de-entrenamiento)
- [Sistema de Progresión](#-sistema-de-progresión)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Detalladas](#-funcionalidades-detalladas)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

##  Características

###  **Sistema de Autenticación**
- Registro e inicio de sesión de usuarios
- Perfiles personalizados con avatares
- Persistencia de datos en localStorage
- Gestión de sesiones activas
###  **Planes de Entrenamiento**
- **9 planes especializados** adaptados a diferentes objetivos y niveles:
  -  Corre 30 Minutos (8 semanas)
  -  5K (6 semanas)
  -  10K (8 semanas)
  -  Fartlek - Cambios de ritmo (6 semanas)
  -  HIIT - Alta intensidad (6 semanas)
  -  Trail Running (6 semanas)
  -  Principiantes con Sobrepeso (6 semanas)
  -  20K Personalizado (8 semanas)
  -  Maratón 42K Personalizado (16 semanas)
- Cálculo automático de ritmos personalizados para 20K (desde marca 5K)
- Cálculo automático de ritmos personalizados para Maratón (desde marca 10K)

###  **Seguimiento de Progreso**
- Barra de progreso visual en tiempo real
- Gráficos interactivos por semana (Chart.js)
- Contadores de días completados vs totales
- Descarga de reportes semanales en PDF

###  **Temporizador Inteligente de Intervalos**
- **Detección automática de configuración** desde la descripción del entrenamiento
- Modo pantalla completa con cuenta regresiva circular
- Identificación de fases: CORRER / CAMINAR
- Alertas sonoras configurables
- Animación de círculo de progreso SVG
- Sin necesidad de configuración manual

###  **Sistema de Gamificación**
- **4 niveles de progresión**:
  - 🟦 Principiante (0-300 XP)
  - 🟩 Intermedio (300-800 XP)
  - 🟨 Avanzado (800-1500 XP)
  - 🟥 Experto (1500+ XP)
- Gana XP al completar entrenamientos
- Mensajes motivacionales personalizados por nivel
- Barra de experiencia en tiempo real

###  **Diseño Responsive**
- Compatible con móviles, tablets y escritorio
- Interfaz moderna con fuente Inter de Google Fonts
- Animaciones suaves y transiciones elegantes
- Modo adaptativo para diferentes tamaños de pantalla

###  **Prevención de Bloqueo de Pantalla**
- Wake Lock API para mantener la pantalla activa durante entrenamientos
- Feedback háptico en dispositivos móviles
- Controles táctiles optimizados

###  **Interfaz de Usuario**
- Splash screen animado al inicio
- Barra de usuario deslizable con scroll
- Modales elegantes para perfil y temporizador
- Tarjetas de planes con iconos visuales
- Sistema de notificaciones toast

---

##  Demo

### Vista Principal
La aplicación presenta un dashboard con todos los planes disponibles en tarjetas interactivas.

### Temporizador en Acción
El temporizador automático detecta las series y tiempos del día y entra en modo pantalla completa con:
- Círculo de progreso animado
- Contador de series actual/total
- Indicadores de fase (CORRER/CAMINAR)
- Botones de control (Iniciar/Pausar/Reiniciar)

### Sistema de Progreso
Visualiza tu avance con:
- Gráfica de barras por semana
- Porcentaje global de completitud
- Mensajes motivacionales dinámicos

---

##  Tecnologías

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript (ES6+)** - Lógica de aplicación

### Librerías Externas
- **[Chart.js](https://www.chartjs.org/)** v4.x - Gráficos interactivos
- **[jsPDF](https://github.com/parallax/jsPDF)** v2.5.1 - Generación de PDFs
- **[jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)** v3.5.28 - Tablas en PDF
- **[Google Fonts - Inter](https://fonts.google.com/specimen/Inter)** - Tipografía

### APIs Web Utilizadas
- **localStorage** - Persistencia de datos
- **Wake Lock API** - Prevención de bloqueo de pantalla
- **Vibration API** - Feedback háptico
- **Web Audio API** - Generación de sonidos de alerta

---

##  Instalación

### Opción 1: Clonar el repositorio

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/running-trainer.git

# Navega al directorio
cd running-trainer

# Abre con tu servidor local favorito
# Opción A: Live Server (VSCode)
# Opción B: Python
python -m http.server 8000

# Opción C: Node.js
npx http-server
```

### Opción 2: Descarga directa

1. Descarga el repositorio como ZIP
2. Extrae los archivos
3. Abre `index.html` directamente en tu navegador

### Requisitos

- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript habilitado
- Conexión a internet para CDNs (Chart.js, jsPDF, Google Fonts)

---

##  Uso

### 1. Registro / Inicio de Sesión

Al abrir la aplicación por primera vez:

1. **Registrarse**: 
   - Ingresa tu nombre completo
   - Correo electrónico
   - Contraseña
   - Selecciona tu nivel inicial (Principiante, Intermedio, Avanzado, Experto)

2. **Iniciar Sesión**:
   - Usa tus credenciales si ya tienes cuenta
   - Tus datos se guardan localmente

### 2. Seleccionar Plan de Entrenamiento

- Haz clic en cualquiera de las 9 tarjetas de planes
- El plan se marcará como activo
- Se mostrará el calendario semanal completo

### 3. Seguir el Entrenamiento

Para cada día de entrenamiento:

1. **Expandir semana**: Haz clic en "Semana X" para ver los días
2. **Usar Temporizador**: 
   - Haz clic en "Usar Temporizador"
   - El temporizador detectará automáticamente:
     - Número de series
     - Tiempo de correr
     - Tiempo de caminar
   - Presiona "Iniciar" para comenzar
   - La pantalla se volverá fullscreen con cuenta regresiva circular
3. **Marcar como Completado**:
   - Al terminar, haz clic en "Marcar"
   - Ganarás XP según el plan
   - Tu progreso se actualizará automáticamente

> **Nota**: Los días de descanso no tienen botones y no cuentan para el porcentaje de progreso.

### 4. Ver Progreso

- **Barra superior**: Muestra tu XP actual y nivel
- **Gráfica**: Visualiza tu completitud por semana
- **Perfil**: Haz clic en "Perfil" para ver estadísticas detalladas
  - Días completados / Total
  - Progreso general
  - XP necesario para siguiente nivel

### 5. Descargar PDF Semanal

- Dentro de cada semana expandida, haz clic en "📄 Descargar PDF"
- Se generará un reporte con:
  - Lista de entrenamientos de la semana
  - Estado de cada día (completado/pendiente/descanso)
  - Branding de RunningTrainer

---

##  Planes de Entrenamiento

### 1. **Corre 30 Minutos** (8 semanas)
**Objetivo**: Lograr correr 30 minutos continuos  
**Nivel**: Principiante  
**XP por día**: 15

- Progresión gradual desde series de 1 minuto
- Incremento semanal de intensidad
- Ideal para empezar desde cero

### 2. **5K** (6 semanas)
**Objetivo**: Completar 5 kilómetros  
**Nivel**: Principiante-Intermedio  
**XP por día**: 20

- Construcción de resistencia por distancia
- Introducción a cambios de ritmo
- Preparación para carreras populares

### 3. **10K** (8 semanas)
**Objetivo**: Alcanzar los 10 kilómetros  
**Nivel**: Intermedio-Avanzado  
**XP por día**: 30

- Incremento progresivo de kilometraje
- Intervalos y progresivos
- Base sólida para medio maratón

### 4. **Fartlek** (6 semanas)
**Objetivo**: Dominar cambios de ritmo  
**Nivel**: Avanzado  
**XP por día**: 25

- Juego de velocidades (Fartlek sueco)
- Mejora de resistencia anaeróbica
- Variación de intensidad constante

### 5. **HIIT** (6 semanas)
**Objetivo**: Intervalos de alta intensidad  
**Nivel**: Avanzado-Experto  
**XP por día**: 40

- Series cortas de máxima intensidad
- Descansos activos
- Quema calórica maximizada

### 6. **Trail Running** (6 semanas)
**Objetivo**: Adaptación a terreno irregular  
**Nivel**: Intermedio-Avanzado  
**XP por día**: 35

- Senderos y montaña
- Fortalecimiento de tobillos
- Conexión con naturaleza

### 7. **Principiantes con Sobrepeso** (6 semanas)
**Objetivo**: Inicio suave y seguro  
**Nivel**: Principiante  
**XP por día**: 10

- Enfoque en caminata con intervalos cortos
- Progresión muy gradual
- Prevención de lesiones

### 8. **20K Personalizado** (8 semanas)
**Objetivo**: Preparar una carrera de 20 kilómetros con ritmos individualizados  
**Nivel**: Intermedio-Avanzado  
**XP por día**: 50

- Se genera a partir de tu mejor tiempo en 5K
- Calcula ritmos Z2, Z3 y ritmo objetivo 20K
- Incluye semanas de base, calidad, pico y taper

### 9. **Maratón 42K Personalizado** (16 semanas)
**Objetivo**: Preparar un maratón completo con planificación por bloques  
**Nivel**: Avanzado-Experto  
**XP por día**: 65

- Se genera a partir de tu mejor tiempo en 10K
- Calcula ritmos Z2, Z3, tempo y ritmo maratón
- Estructura de 16 semanas: base, calidad, pico y taper

---

##  Sistema de Progresión

### Niveles y Requisitos de XP

| Nivel | Rango XP | Insignia | Descripción |
|-------|----------|----------|-------------|
| **Principiante** | 0 - 299 | 🟦 | Empezando el camino del corredor |
| **Intermedio** | 300 - 799 | 🟩 | Construyendo consistencia |
| **Avanzado** | 800 - 1499 | 🟨 | Dominando la técnica |
| **Experto** | 1500+ | 🟥 | Maestría en running |

### Ganancia de XP por Plan

Los planes más exigentes otorgan más XP:

- **Maratón 42K**: 65 XP/día (plan de mayor carga)
- **20K**: 50 XP/día
- **HIIT**: 40 XP/día
- **Trail**: 35 XP/día
- **10K**: 30 XP/día
- **Fartlek**: 25 XP/día
- **5K**: 20 XP/día
- **30 Minutos**: 15 XP/día
- **Principiantes**: 10 XP/día

### Mensajes Motivacionales

Los mensajes se adaptan a:
- **Tu nivel actual** (Principiante, Intermedio, Avanzado, Experto)
- **Tu porcentaje de progreso** (0-10%, 11-30%, 31-50%, etc.)
- **Tu nombre** (personalización automática)

Ejemplo:
> "¡Juanka, vas por buen camino! 🚀 Tu consistencia está dando resultados."

---

##  Estructura del Proyecto

```
RunningTrainer/
│
├── index.html              # Página principal HTML
├── styles.css              # Estilos CSS personalizados
├── app.js                  # Lógica JavaScript principal
├── data.js                 # Datos de planes de entrenamiento
├── README.md               # Este archivo
├── LICENSE                 # Licencia MIT
└── .gitignore             # Archivos ignorados por Git
```

### Descripción de Archivos

#### `index.html`
- Estructura HTML5 semántica
- Modales de autenticación, perfil y temporizador
- Integración de CDNs externos
- Elementos del DOM para JS

#### `styles.css`
- Variables CSS para colores y temas
- Diseño responsive con media queries
- Animaciones y transiciones CSS3
- Estilos para componentes modales
- Sistema de grid para planes

#### `app.js`
- Sistema de autenticación y usuarios
- Gestión de planes y progreso
- Lógica del temporizador automático
- Cálculo de XP y niveles
- Renderizado dinámico de semanas
- Generación de PDFs
- Actualización de gráficas

#### `data.js`
- Objeto `planes` con todos los entrenamientos
- Estructura: `plan -> semanas -> [día, descripción]`
- 7 planes base estáticos con 6-8 semanas cada uno

#### `app.js` (planes personalizados)
- Generación dinámica de plan **20K** según marca en 5K
- Generación dinámica de plan **Maratón 42K** según marca en 10K
- Cálculo de ritmos con fórmula de Riegel
- Persistencia de ritmos personalizados por usuario

---

## Funcionalidades Detalladas

### Autenticación y Perfiles

```javascript
// Estructura de usuario en localStorage
{
  name: "Juan",
  email: "juan@example.com",
  password: "***",
  level: "beginner",
  xp: 150,
  pace5k: 1530,
  pace10k: 3120,
  progressData: {
    "30min": {
      "semana0": [false, true, false, ...],
      "semana1": [true, true, false, ...]
    },
    "20k": {
      "semana0": [false, false, false, ...]
    }
  },
  createdAt: "2026-03-07T..."
}
```

### Temporizador Automático

**Parser de Entrenamiento**:
- Detecta patrones como: `"5 Series de 1 min corriendo + 2 min caminando"`
- Extrae:
  - Número de series: `5`
  - Tiempo de ejercicio: `60 segundos`
  - Tiempo de descanso: `120 segundos`
  - Labels: `CORRER`, `CAMINAR`

**Modo Pantalla Completa**:
- Círculo SVG animado que se vacía con el tiempo
- Cambio de color según fase (verde=correr, amarillo=caminar)
- Contador central con formato `m:ss`
- Alertas sonoras a los 3 segundos finales

### Sistema de Gráficas

Usa **Chart.js** para visualizar:
- Porcentaje de completitud por semana
- Diferentes colores según estado:
  - Verde (#10b981): 100% completado
  - Azul (#3b82f6): Parcialmente completado
  - Gris (#e2e8f0): Sin iniciar

**Exclusión de Días de Descanso**:
- Los descansos NO cuentan en porcentajes
- Cálculo basado solo en días entrenables
- Consistencia en gráfica, perfil y barra de progreso

### Generación de PDFs

```javascript
// Características del PDF
```

---

## APK Android (Capacitor)

Esta versión del proyecto ya está preparada para empaquetarse como APK sin afectar tu despliegue web en Vercel.

### Requisitos

- Node.js 18+
- Java JDK 17 instalado
- Variable de entorno `JAVA_HOME` apuntando al JDK real
- Android Studio (SDK + Build Tools)

### Flujo rápido

```bash
npm install
npm run android:add
npm run android:sync
npm run android:open
```

Luego en Android Studio:

1. Espera a que termine el sync de Gradle.
2. Menú Build > Build Bundle(s) / APK(s) > Build APK(s).
3. APK debug generado en `android/app/build/outputs/apk/debug/app-debug.apk`.

### Comando directo para generar APK debug

```bash
npm run android:apk
```

Si falla con `JAVA_HOME is set to an invalid directory`, corrige `JAVA_HOME` hacia tu instalación real de JDK 17.

### Configuración de Strava para APK

El token de Strava no se obtiene desde `api/` dentro de la APK. Debes usar tu backend desplegado.

Edita `runningtrainer.config.js` y define:

```javascript
window.RUNNING_TRAINER_CONFIG = {
  apiBaseUrl: 'https://tu-proyecto.vercel.app'
};
```

### Sistema de Sonidos

**Generado con Web Audio API**:
- **Campana (880 Hz)**: Cambio de fase
- **Acorde (C-E-G)**: Entrenamiento completado
- **Alerta (880 Hz)**: 3 segundos restantes

Toggle configurable: 🔔 Sonido ON/OFF

### Planes Personalizados por Ritmo

- El plan **20K** se genera tras introducir un tiempo de referencia de 5K en formato `mm:ss`.
- El plan **Maratón** se genera tras introducir un tiempo de referencia de 10K en formato `mm:ss`.
- Ambos planes muestran una vista previa de ritmos antes de generar el calendario completo.
- Los ritmos quedan guardados por usuario para reutilizarlos en futuras sesiones.

---

## Contribuir

¡Las contribuciones son bienvenidas! Aquí te explico cómo puedes ayudar:

### 1. Fork del Proyecto

```bash
# Haz fork desde GitHub
# Luego clona tu fork
git clone https://github.com/tu-usuario/running-trainer.git
```

### 2. Crea una Rama

```bash
git checkout -b feature/nueva-funcionalidad
```

### 3. Realiza tus Cambios

- Mantén el código limpio y comentado
- Sigue las convenciones de naming existentes
- Prueba en diferentes navegadores

### 4. Commit y Push

```bash
git add .
git commit -m "feat: Agregar nueva funcionalidad X"
git push origin feature/nueva-funcionalidad
```

### 5. Abre un Pull Request

- Describe claramente los cambios
- Incluye capturas si es visual
- Referencia issues relacionados

### Ideas para Contribuir

-  Traducción a otros idiomas
-  PWA completa con Service Workers
-  Backend con base de datos (Firebase, Supabase)
-  Sistema de logros y badges
-  Estadísticas avanzadas (ritmo, VO2max)
-  Integración con Spotify
-  Conexión con smartwatches
-  Mapas de rutas con GPS
### Código de Conducta

- Respeto y empatía en todas las interacciones
- Feedback constructivo en code reviews
- Inclusividad y accesibilidad

---

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2026 RunningTrainer

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia
de este software y archivos de documentación asociados (el "Software"), para 
utilizar el Software sin restricción...
```

---

##  Contacto

**Autor**: Juanka  
**Proyecto**: RunningTrainer  
**GitHub**: [github.com/tu-usuario/running-trainer](https://github.com/tu-usuario/running-trainer)

### Enlaces Útiles

-  [Reportar un Bug](https://github.com/tu-usuario/running-trainer/issues)
-  [Solicitar Funcionalidad](https://github.com/tu-usuario/running-trainer/issues/new)
-  [Dar Estrella al Proyecto](https://github.com/tu-usuario/running-trainer)

---

## Agradecimientos

- **Chart.js** - Por las increíbles gráficas interactivas
- **jsPDF** - Por la generación de PDFs del lado del cliente
- **Google Fonts** - Por la tipografía Inter
- **Comunidad de corredores** - Por la inspiración y feedback

---

##  Changelog

### v1.1.0 (2026-03-14)
-  Nuevos planes personalizados: 20K (8 semanas) y Maratón 42K (16 semanas)
-  Cálculo automático de ritmos por marca 5K/10K
-  Ajuste de recompensas y badges para los nuevos planes

### v1.0.0 (2026-03-07)
-  Lanzamiento inicial
-  7 planes de entrenamiento completos
-  Sistema de autenticación
-  Sistema de gamificación con XP
-  Temporizador automático con pantalla completa
-  Gráficas de progreso
-  Exportación a PDF
-  Diseño responsive completo

---

<div align="center">

**¡Hecho con amor y muchos kilómetros!**

Si este proyecto te ayudó, considera darle una ⭐

</div>
