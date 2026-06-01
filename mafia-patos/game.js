/* =====================================================
   MAFIA DE PATOS — game.js  (versión Firebase)
   Sincronización en tiempo real con Firebase RTDB
   ===================================================== */

const Game = (() => {

  /* ═══════════════════════════════════════════════
     CONSTANTES Y CONFIGURACIÓN
  ═══════════════════════════════════════════════ */
  const CONFIG = {
    TOTAL_JUGADORES : 30,
    TOTAL_MAFIAS    : 6,
    RONDAS          : 5,
    TIEMPO_RONDA    : 180,   // segundos
    DINERO_INICIAL  : 1000,
    REP_INICIAL     : 50,
    INF_INICIAL     : 30,
  };

  const MAFIAS_INFO = [
    { nombre: 'Los Patos Negros',  emoji: '🖤', idx: 0 },
    { nombre: 'Golden Ducks',      emoji: '💛', idx: 1 },
    { nombre: 'Los Verdes',        emoji: '💚', idx: 2 },
    { nombre: 'Mafia Azul',        emoji: '💙', idx: 3 },
    { nombre: 'Plumas Violetas',   emoji: '💜', idx: 4 },
    { nombre: 'Los Anaranjados',   emoji: '🧡', idx: 5 },
  ];

  const EVENTOS_DEF = [
    { id:'redada',    titulo:'🚔 ¡REDADA POLICIAL!',   desc:'La policía incautó mercancía. Todas las mafias pierden 10% de dinero.',       icono:'🚔' },
    { id:'mercado',   titulo:'📈 MERCADO AL ALZA',      desc:'El mercado negro subió precios. Las cooperaciones valen el doble esta ronda.', icono:'📈' },
    { id:'traicionI', titulo:'🗡️ TRAICIÓN INTERNA',     desc:'Una mafia al azar sufre una fuga de fondos. Pierde 15% de dinero.',           icono:'🗡️' },
    { id:'lavado',    titulo:'🏦 LAVADO DE DINERO',     desc:'Una mafia al azar convirtió efectivo en influencia (+20 INF, -200 $)',         icono:'🏦' },
    { id:'crisis',    titulo:'💸 CRISIS ECONÓMICA',     desc:'Todas las mafias pierden 5 de reputación por el pánico del mercado.',          icono:'💸' },
    { id:'espionaje', titulo:'🕵️ ESPIONAJE DETECTADO',  desc:'La mafia con mayor dinero fue espiada. Pierde 10 de influencia.',             icono:'🕵️' },
  ];

  const RESULTADOS = {
    cooperar_cooperar:    { d:+300, r:+5,  i:+3  },
    cooperar_negociar:    { d:+150, r:+3,  i:+2  },
    cooperar_traicionar:  { d:-200, r:-2,  i:-5  },
    cooperar_robar:       { d:-150, r:+1,  i:-2  },
    cooperar_alianza:     { d:+200, r:+4,  i:+5  },
    traicionar_cooperar:  { d:+500, r:-10, i:+1  },
    traicionar_negociar:  { d:+350, r:-8,  i:0   },
    traicionar_traicionar:{ d:+100, r:-5,  i:-2  },
    traicionar_robar:     { d:+400, r:-12, i:-3  },
    traicionar_alianza:   { d:+450, r:-15, i:-5  },
    negociar_cooperar:    { d:+200, r:+3,  i:+2  },
    negociar_negociar:    { d:+400, r:+6,  i:+4  },
    negociar_traicionar:  { d:-100, r:-3,  i:-1  },
    negociar_robar:       { d:+50,  r:-1,  i:+1  },
    negociar_alianza:     { d:+250, r:+5,  i:+6  },
    robar_cooperar:       { d:+300, r:-5,  i:+2  },
    robar_negociar:       { d:+150, r:-3,  i:+1  },
    robar_traicionar:     { d:+200, r:-8,  i:-2  },
    robar_robar:          { d:+50,  r:-6,  i:-4  },
    robar_alianza:        { d:+350, r:-10, i:+3  },
    alianza_cooperar:     { d:+250, r:+5,  i:+8  },
    alianza_negociar:     { d:+300, r:+6,  i:+7  },
    alianza_traicionar:   { d:-300, r:-5,  i:-8  },
    alianza_robar:        { d:-200, r:-2,  i:-3  },
    alianza_alianza:      { d:+350, r:+8,  i:+10 },
  };

  /* ═══════════════════════════════════════════════
     ESTADO LOCAL
  ═══════════════════════════════════════════════ */
  let db   = null;   // Firebase Database instance
  let auth = null;   // opcional

  let estado = {
    sala          : '',
    nombre        : '',
    mafiaIdx      : -1,
    esAdmin       : false,
    rondaActual   : 0,
    votoActual    : null,
    timerInterval : null,
    tiempoRestante: CONFIG.TIEMPO_RONDA,
    eventoActual  : null,
    _rondaSnap    : 0,       // última ronda vista por el jugador
    _traicionNotif: false,
    _prevVals     : {},
    // Listeners Firebase para desuscribirse
    _unsubEstado  : null,
    _unsubJugadores: null,
    _unsubVotos   : null,
  };

  /* ═══════════════════════════════════════════════
     FIREBASE — INICIALIZACIÓN
  ═══════════════════════════════════════════════ */
  function initFirebase(cfg) {
    // cfg = { apiKey, authDomain, databaseURL, projectId, ... }
    const app = firebase.initializeApp(cfg);
    db = firebase.database(app);
    return db;
  }

  /* Referencias Firebase */
  const ref = (path) => firebase.database.ref(db, path);
  const refSala    = (sala)        => ref(`salas/${sala}`);
  const refEstado  = (sala)        => ref(`salas/${sala}/estado`);
  const refMafias  = (sala)        => ref(`salas/${sala}/mafias`);
  const refJugadors= (sala)        => ref(`salas/${sala}/jugadores`);
  const refVotos   = (sala, ronda) => ref(`salas/${sala}/votos/${ronda}`);
  const refTimer   = (sala)        => ref(`salas/${sala}/timer`);

  /* ═══════════════════════════════════════════════
     NAVEGACIÓN
  ═══════════════════════════════════════════════ */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function showTab(id) {
    document.querySelectorAll('#screen-dashboard .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#screen-dashboard .tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('#screen-dashboard .tab').forEach(t => {
      if (t.getAttribute('onclick') && t.getAttribute('onclick').includes(id)) t.classList.add('active');
    });
    if (id === 'tab-ranking') renderRankingLive();
    if (id === 'tab-mafias')  renderMafiasLive();
  }

  function showFinalTab(id) {
    document.querySelectorAll('.final-tabs .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#screen-final .tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.final-tabs .tab').forEach(t => {
      if (t.getAttribute('onclick') && t.getAttribute('onclick').includes(id)) t.classList.add('active');
    });
  }

  function goToRegister() { showScreen('screen-registro'); }
  function goToAdmin()    { showScreen('screen-admin'); }

  /* ═══════════════════════════════════════════════
     ADMIN — CREAR SALA
  ═══════════════════════════════════════════════ */
  async function crearSala() {
    if (!db) return alert('⚠️ Firebase no está configurado.\nHaz clic en "Configurar Firebase" primero.');
    const sala = document.getElementById('admin-sala').value.trim().toUpperCase();
    if (!sala) return alert('Escribe un nombre para la sala.');

    const mafias = MAFIAS_INFO.map(m => ({
      idx          : m.idx,
      nombre       : m.nombre,
      emoji        : m.emoji,
      dinero       : CONFIG.DINERO_INICIAL,
      reputacion   : CONFIG.REP_INICIAL,
      influencia   : CONFIG.INF_INICIAL,
      traiciones   : 0,
      cooperaciones: 0,
    }));

    const salaData = {
      estado: {
        fase         : 'espera',
        ronda        : 0,
        eventoActual : null,
        mercadoDouble: false,
        ultimoResumen: null,
        creadoEn     : Date.now(),
      },
      mafias,
      jugadores: {},
      votos    : {},
    };

    try {
      await firebase.database.set(refSala(sala), salaData);
    } catch(e) {
      return alert('Error creando sala: ' + e.message);
    }

    estado.sala    = sala;
    estado.esAdmin = true;

    document.getElementById('admin-qr-section').style.display = 'block';
    generarQR(sala);
    suscribirseAdminEspera(sala);
    showScreen('screen-admin');
  }

  function generarQR(sala) {
    const url = `${location.href.split('?')[0]}?sala=${sala}`;
    document.getElementById('qr-url').textContent = url;
    const qrImg = document.createElement('img');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=180x180&color=060810&bgcolor=ffffff`;
    qrImg.alt = 'QR Code'; qrImg.style.width = '180px';
    const qrDiv = document.getElementById('qr-code');
    qrDiv.innerHTML = '';
    qrDiv.appendChild(qrImg);
  }

  function suscribirseAdminEspera(sala) {
    // Escucha cambios en jugadores en tiempo real
    firebase.database.onValue(refJugadors(sala), snap => {
      const jugadores = snap.val() ? Object.values(snap.val()) : [];
      document.getElementById('admin-jugadores').textContent     = jugadores.length;
      document.getElementById('admin-mafias-count').textContent  = CONFIG.TOTAL_MAFIAS;
      const lista = document.getElementById('admin-lista-jugadores');
      lista.innerHTML = jugadores.map(j => {
        const m = MAFIAS_INFO[j.mafiaIdx];
        return `<div class="admin-jugador-item">
          <span>🦆 ${j.nombre}</span>
          <span class="mafia-tag mafia-color-${m.idx}">${m.emoji} ${m.nombre}</span>
        </div>`;
      }).join('');
    });
  }

  async function resetearSala() {
    if (!confirm('¿Resetear toda la sala?')) return;
    try {
      await firebase.database.remove(refSala(estado.sala));
    } catch(e) {}
    location.reload();
  }

  /* ═══════════════════════════════════════════════
     JUGADOR — REGISTRO
  ═══════════════════════════════════════════════ */
  async function registrarJugador() {
    if (!db) return alert('⚠️ Firebase no está configurado.\nEscribe la URL de tu proyecto Firebase en la pantalla de inicio.');
    const sala   = document.getElementById('input-sala').value.trim().toUpperCase();
    const nombre = document.getElementById('input-nombre').value.trim();
    if (!sala)   return alert('Escribe el código de sala.');
    if (!nombre) return alert('Escribe tu alias.');

    // Verificar sala existe
    const snapEstado = await firebase.database.get(refEstado(sala));
    if (!snapEstado.exists()) return alert('Sala no encontrada. Verifica el código con el director.');

    // Verificar alias único
    const snapJug = await firebase.database.get(refJugadors(sala));
    const jugadores = snapJug.val() ? Object.values(snapJug.val()) : [];
    if (jugadores.find(j => j.nombre.toLowerCase() === nombre.toLowerCase()))
      return alert('Ese alias ya está en uso. Elige otro.');
    if (jugadores.length >= CONFIG.TOTAL_JUGADORES)
      return alert('La sala está llena (30 jugadores).');

    // Asignar mafia round-robin balanceado
    const mafiaIdx = jugadores.length % CONFIG.TOTAL_MAFIAS;
    const jugKey   = nombre.replace(/\s+/g,'_').toLowerCase();
    const jugador  = { nombre, mafiaIdx, sala, joinedAt: Date.now() };

    await firebase.database.set(ref(`salas/${sala}/jugadores/${jugKey}`), jugador);

    estado.sala     = sala;
    estado.nombre   = nombre;
    estado.mafiaIdx = mafiaIdx;

    // UI sala de espera
    document.getElementById('espera-sala-nombre').textContent = `Sala: ${sala}`;
    const m = MAFIAS_INFO[mafiaIdx];
    document.getElementById('tu-mafia-badge').style.display = 'block';
    document.getElementById('tu-mafia-nombre').textContent   = `${m.emoji} ${m.nombre}`;
    showScreen('screen-espera');

    suscribirseEspera(sala);
  }

  function suscribirseEspera(sala) {
    // Escucha jugadores en sala de espera
    firebase.database.onValue(refJugadors(sala), snap => {
      const jugadores = snap.val() ? Object.values(snap.val()) : [];
      document.getElementById('jugadores-count').textContent = jugadores.length;
      document.getElementById('lista-jugadores-espera').innerHTML = jugadores.map(j =>
        `<div class="jugador-chip ${j.nombre === estado.nombre ? 'mi-chip':''}">
          ${MAFIAS_INFO[j.mafiaIdx].emoji} ${j.nombre}
        </div>`
      ).join('');
    });

    // Escucha cambio de fase → entrar al juego
    firebase.database.onValue(refEstado(sala), snap => {
      const est = snap.val();
      if (est && est.fase === 'juego') {
        entrarAlJuego(est);
      }
    });
  }

  /* ═══════════════════════════════════════════════
     ADMIN — INICIAR JUEGO
  ═══════════════════════════════════════════════ */
  async function iniciarJuego() {
    const sala = estado.sala;
    const snapJug = await firebase.database.get(refJugadors(sala));
    const jugadores = snapJug.val() ? Object.values(snapJug.val()) : [];
    if (jugadores.length < 2) return alert('Necesitas al menos 2 jugadores.');

    const evento  = EVENTOS_DEF[Math.floor(Math.random() * EVENTOS_DEF.length)];
    estado.eventoActual = evento;

    await firebase.database.update(refEstado(sala), {
      fase         : 'juego',
      ronda        : 1,
      eventoActual : evento.id,
      mercadoDouble: evento.id === 'mercado',
      ultimoResumen: null,
    });

    // Timer del servidor: guardamos timestamp de inicio
    await firebase.database.set(refTimer(sala), {
      inicio   : firebase.database.serverTimestamp(),
      duracion : CONFIG.TIEMPO_RONDA,
    });

    mostrarAdminJuego(sala);
  }

  async function mostrarAdminJuego(sala) {
    showScreen('screen-admin-juego');
    const snapEst = await firebase.database.get(refEstado(sala));
    const est = snapEst.val();
    estado.rondaActual = est.ronda;

    const ev = EVENTOS_DEF.find(e => e.id === est.eventoActual);
    document.getElementById('admin-evento-actual').textContent =
      ev ? `${ev.icono} ${ev.titulo}: ${ev.desc}` : '';
    document.getElementById('admin-ronda-actual').textContent =
      `RONDA ${est.ronda} / ${CONFIG.RONDAS}`;

    iniciarTimerAdmin(sala);
    suscribirseAdminJuego(sala);
  }

  function iniciarTimerAdmin(sala) {
    estado.tiempoRestante = CONFIG.TIEMPO_RONDA;
    if (estado.timerInterval) clearInterval(estado.timerInterval);
    estado.timerInterval = setInterval(async () => {
      estado.tiempoRestante--;
      const el = document.getElementById('admin-timer-big');
      if (el) {
        el.textContent = formatTime(estado.tiempoRestante);
        el.classList.toggle('danger', estado.tiempoRestante <= 30);
      }
      if (estado.tiempoRestante <= 0) {
        clearInterval(estado.timerInterval);
        await autoVotarFaltantes(sala);
        await procesarRondaAdmin(sala);
      }
    }, 1000);
  }

  function suscribirseAdminJuego(sala) {
    // Escucha votos en tiempo real para mostrar ranking
    firebase.database.onValue(refVotos(sala, estado.rondaActual), snap => {
      const votos = snap.val() || {};
      const votaron = Object.keys(votos).length;
      // Actualizar contador de votos en UI
      const el = document.getElementById('admin-votos-count');
      if (el) el.textContent = `${votaron} / ${CONFIG.TOTAL_MAFIAS} mafias votaron`;
      // Si votaron todos → procesar automáticamente
      if (votaron >= CONFIG.TOTAL_MAFIAS) {
        clearInterval(estado.timerInterval);
        procesarRondaAdmin(sala);
      }
    }, { onlyOnce: false });

    // Ranking en vivo
    firebase.database.onValue(refMafias(sala), snap => {
      const mafias = snap.val();
      if (mafias) renderAdminRanking(Array.isArray(mafias) ? mafias : Object.values(mafias));
    });
  }

  async function autoVotarFaltantes(sala) {
    const ronda    = estado.rondaActual;
    const snapVotos= await firebase.database.get(refVotos(sala, ronda));
    const votos    = snapVotos.val() || {};
    const acciones = ['cooperar','negociar','cooperar','robar','traicionar'];
    const updates  = {};
    MAFIAS_INFO.forEach(m => {
      if (votos[m.idx] === undefined) {
        updates[m.idx] = acciones[Math.floor(Math.random() * acciones.length)];
      }
    });
    if (Object.keys(updates).length > 0) {
      await firebase.database.update(refVotos(sala, ronda), updates);
    }
  }

  async function forzarResultados() {
    clearInterval(estado.timerInterval);
    await autoVotarFaltantes(estado.sala);
    await procesarRondaAdmin(estado.sala);
  }

  /* ═══════════════════════════════════════════════
     PROCESAMIENTO DE RONDA (ADMIN)
  ═══════════════════════════════════════════════ */
  async function procesarRondaAdmin(sala) {
    const ronda      = estado.rondaActual;
    const snapVotos  = await firebase.database.get(refVotos(sala, ronda));
    const snapMafias = await firebase.database.get(refMafias(sala));
    const snapEst    = await firebase.database.get(refEstado(sala));

    const votos  = snapVotos.val()  || {};
    const mafias = snapMafias.val() || [];
    const est    = snapEst.val()    || {};

    // Aplicar evento especial al estado de mafias
    aplicarEvento(est.eventoActual, mafias, est);

    // Calcular resultados por mafia
    const resumen = [];
    MAFIAS_INFO.forEach(info => {
      const accionPropia = votos[info.idx] || 'cooperar';
      const accionRival  = calcularAccionRival(votos, info.idx);
      const key          = `${accionPropia}_${accionRival}`;
      let delta = RESULTADOS[key] || { d:0, r:0, i:0 };

      const m = mafias[info.idx];

      // Penalización por mala reputación
      if (m.reputacion < 20) delta = { d: Math.round(delta.d*.7), r: delta.r-3, i: delta.i-2 };

      // Bonus evento mercado
      if (est.mercadoDouble && accionPropia === 'cooperar') delta = { ...delta, d: delta.d*2 };

      // Aplicar
      m.dinero      = Math.max(0,   Math.round(m.dinero      + delta.d));
      m.reputacion  = Math.max(0,   Math.min(100, m.reputacion + delta.r));
      m.influencia  = Math.max(0,   Math.round(m.influencia  + delta.i));
      if (accionPropia === 'traicionar') m.traiciones++;
      if (accionPropia === 'cooperar')   m.cooperaciones++;

      resumen.push({ mafiaIdx: info.idx, accion: accionPropia, rival: accionRival, delta });
    });

    // Siguiente ronda o fin
    const siguienteRondaNum = ronda + 1;
    const esUltimaRonda     = ronda >= CONFIG.RONDAS;
    const nuevoEvento       = esUltimaRonda ? null : EVENTOS_DEF[Math.floor(Math.random()*EVENTOS_DEF.length)];

    // Actualizar Firebase todo de golpe
    const updates = {};
    mafias.forEach((m, i) => { updates[`salas/${sala}/mafias/${i}`] = m; });
    updates[`salas/${sala}/estado/ronda`]         = esUltimaRonda ? ronda : siguienteRondaNum;
    updates[`salas/${sala}/estado/fase`]          = esUltimaRonda ? 'fin' : 'juego';
    updates[`salas/${sala}/estado/ultimoResumen`] = resumen;
    updates[`salas/${sala}/estado/eventoActual`]  = nuevoEvento ? nuevoEvento.id : null;
    updates[`salas/${sala}/estado/mercadoDouble`] = nuevoEvento ? nuevoEvento.id === 'mercado' : false;

    await firebase.database.update(ref(''), updates);

    if (esUltimaRonda) {
      clearInterval(estado.timerInterval);
      const estFinal = { ...est, fase:'fin', mafias, ultimoResumen: resumen };
      showScreen('screen-final');
      mostrarFinal({ ...estFinal, mafias });
    } else {
      mostrarResumenRondaAdmin(sala, resumen, ronda, nuevoEvento);
    }
  }

  function calcularAccionRival(votos, propioIdx) {
    const acciones = [];
    MAFIAS_INFO.forEach(m => {
      if (m.idx !== propioIdx && votos[m.idx]) acciones.push(votos[m.idx]);
    });
    if (!acciones.length) return 'cooperar';
    const freq = {};
    acciones.forEach(a => freq[a] = (freq[a]||0)+1);
    return Object.entries(freq).sort((a,b)=>b[1]-a[1])[0][0];
  }

  function aplicarEvento(eventoId, mafias, est) {
    if (!eventoId) return;
    if (eventoId === 'redada')    mafias.forEach(m => { m.dinero = Math.max(0, Math.round(m.dinero*.9)); });
    if (eventoId === 'traicionI') { const i = Math.floor(Math.random()*CONFIG.TOTAL_MAFIAS); mafias[i].dinero = Math.max(0,Math.round(mafias[i].dinero*.85)); }
    if (eventoId === 'lavado')    { const i = Math.floor(Math.random()*CONFIG.TOTAL_MAFIAS); mafias[i].influencia+=20; mafias[i].dinero=Math.max(0,mafias[i].dinero-200); }
    if (eventoId === 'crisis')    mafias.forEach(m => { m.reputacion = Math.max(0, m.reputacion-5); });
    if (eventoId === 'espionaje') {
      const rico = [...mafias].sort((a,b)=>b.dinero-a.dinero)[0];
      mafias[rico.idx].influencia = Math.max(0, mafias[rico.idx].influencia-10);
    }
    // mercado se maneja en el cálculo de delta
  }

  function mostrarResumenRondaAdmin(sala, resumen, rondaAnterior, nuevoEvento) {
    const div = document.getElementById('admin-ronda-resumen');
    div.innerHTML = `<p class="section-sub" style="margin-bottom:12px">Resultados ronda ${rondaAnterior}:</p>` +
      resumen.map(r => {
        const m = MAFIAS_INFO[r.mafiaIdx];
        const d = r.delta;
        return `<div class="admin-jugador-item">
          <span class="mafia-color-${m.idx}">${m.emoji} ${m.nombre}</span>
          <span style="font-family:var(--font-mono);font-size:12px">
            ${r.accion.toUpperCase()} →
            <span style="color:${d.d>=0?'#39ff14':'#ff2d78'}">${d.d>=0?'+':''}$${Math.round(d.d)}</span>
          </span>
        </div>`;
      }).join('');
    document.getElementById('overlay-ronda-admin').style.display = 'flex';
    // Guardar nuevo evento para siguiente ronda
    estado._nuevoEvento = nuevoEvento;
  }

  async function siguienteRonda() {
    document.getElementById('overlay-ronda-admin').style.display = 'none';
    const sala = estado.sala;
    const snapEst = await firebase.database.get(refEstado(sala));
    const est = snapEst.val();
    estado.rondaActual = est.ronda;

    const ev = estado._nuevoEvento || EVENTOS_DEF.find(e => e.id === est.eventoActual);
    estado.eventoActual = ev;

    document.getElementById('admin-evento-actual').textContent =
      ev ? `${ev.icono} ${ev.titulo}: ${ev.desc}` : 'Sin evento especial esta ronda.';
    document.getElementById('admin-ronda-actual').textContent =
      `RONDA ${est.ronda} / ${CONFIG.RONDAS}`;

    // Escuchar nuevos votos de esta ronda
    firebase.database.onValue(refVotos(sala, est.ronda), snap => {
      const votos = snap.val() || {};
      const votaron = Object.keys(votos).length;
      const el = document.getElementById('admin-votos-count');
      if (el) el.textContent = `${votaron} / ${CONFIG.TOTAL_MAFIAS} mafias votaron`;
      if (votaron >= CONFIG.TOTAL_MAFIAS) {
        clearInterval(estado.timerInterval);
        procesarRondaAdmin(sala);
      }
    }, { onlyOnce: false });

    iniciarTimerAdmin(sala);
  }

  function renderAdminRanking(mafias) {
    const sorted = [...mafias].sort((a,b)=>b.dinero-a.dinero);
    const el = document.getElementById('admin-ranking-live');
    if (!el) return;
    el.innerHTML = sorted.map((m,i)=>{
      const info = MAFIAS_INFO[m.idx];
      return `<div class="ranking-item">
        <span class="ranking-pos ${['gold','silver','bronze'][i]||''}">${i+1}</span>
        <div class="ranking-info">
          <div class="ranking-nombre mafia-color-${info.idx}">${info.emoji} ${m.nombre}</div>
          <div class="ranking-stats">⭐${m.reputacion} · 💎${m.influencia} · 🔪${m.traiciones}</div>
        </div>
        <span class="ranking-dinero">$${m.dinero}</span>
      </div>`;
    }).join('');
  }

  async function terminarJuego() {
    if (!confirm('¿Terminar el juego ahora?')) return;
    clearInterval(estado.timerInterval);
    const sala = estado.sala;
    await firebase.database.update(refEstado(sala), { fase: 'fin' });
    const snapEst    = await firebase.database.get(refEstado(sala));
    const snapMafias = await firebase.database.get(refMafias(sala));
    showScreen('screen-final');
    mostrarFinal({ ...snapEst.val(), mafias: snapMafias.val() });
  }

  /* ═══════════════════════════════════════════════
     JUGADOR — ENTRAR AL JUEGO
  ═══════════════════════════════════════════════ */
  async function entrarAlJuego(est) {
    estado.rondaActual = est.ronda;
    document.getElementById('dash-nombre').textContent = estado.nombre;
    const m = MAFIAS_INFO[estado.mafiaIdx];
    document.getElementById('dash-mafia').textContent = `${m.emoji} ${m.nombre}`;
    showScreen('screen-dashboard');

    // Mostrar evento
    if (est.eventoActual) {
      const ev = EVENTOS_DEF.find(e => e.id === est.eventoActual);
      if (ev) mostrarEvento(ev);
    }

    iniciarTimerJugador();
    suscribirseJugador(estado.sala);
  }

  function iniciarTimerJugador() {
    estado.tiempoRestante = CONFIG.TIEMPO_RONDA;
    if (estado.timerInterval) clearInterval(estado.timerInterval);
    estado.timerInterval = setInterval(() => {
      estado.tiempoRestante--;
      const el = document.getElementById('dash-timer');
      if (el) {
        el.textContent = formatTime(estado.tiempoRestante);
        el.classList.toggle('danger', estado.tiempoRestante <= 30);
      }
      if (estado.tiempoRestante <= 0) clearInterval(estado.timerInterval);
    }, 1000);
  }

  function suscribirseJugador(sala) {
    // Listener ÚNICO en el estado de sala → reacciona a todo
    firebase.database.onValue(refEstado(sala), async snap => {
      const est = snap.val();
      if (!est) return;

      if (est.fase === 'fin') {
        clearInterval(estado.timerInterval);
        const snapMafias = await firebase.database.get(refMafias(sala));
        showScreen('screen-final');
        mostrarFinal({ ...est, mafias: snapMafias.val() });
        return;
      }

      // Nueva ronda detectada
      if (est.ronda !== estado._rondaSnap && est.ronda > 0) {
        estado._rondaSnap  = est.ronda;
        estado.rondaActual = est.ronda;
        estado.votoActual  = null;
        estado._traicionNotif = false;

        document.getElementById('dash-ronda').textContent = `RONDA ${est.ronda}/${CONFIG.RONDAS}`;
        reiniciarPanelVotacion();
        iniciarTimerJugador();

        if (est.eventoActual) {
          const ev = EVENTOS_DEF.find(e => e.id === est.eventoActual);
          if (ev) mostrarEvento(ev);
        }

        // Mostrar resultado de la ronda anterior
        if (est.ultimoResumen) {
          mostrarResultadoRonda(est.ultimoResumen);
          // Detectar traiciones
          const traiciones = est.ultimoResumen.filter(r => r.accion === 'traicionar');
          if (traiciones.length > 0 && !estado._traicionNotif) {
            estado._traicionNotif = true;
            const traidores = traiciones.map(t => MAFIAS_INFO[t.mafiaIdx].nombre).join(', ');
            mostrarTraicion(traidores);
          }
        }
      }
    });

    // Listener de mafias para actualizar recursos
    firebase.database.onValue(refMafias(sala), snap => {
      const mafias = snap.val();
      if (!mafias) return;
      actualizarRecursosJugador(mafias);

      // Actualizar tabs si están visibles
      const tabRanking = document.getElementById('tab-ranking');
      const tabMafias  = document.getElementById('tab-mafias');
      if (tabRanking && tabRanking.classList.contains('active')) renderRankingLive(mafias);
      if (tabMafias  && tabMafias.classList.contains('active'))  renderMafiasLive(mafias);
    });
  }

  async function actualizarRecursosJugador(mafias) {
    if (!mafias) {
      const snap = await firebase.database.get(refMafias(estado.sala));
      mafias = snap.val();
    }
    if (!mafias) return;
    const mafia = mafias[estado.mafiaIdx];
    if (!mafia) return;
    animarValor('dash-dinero',     `$${mafia.dinero}`,  mafia.dinero);
    animarValor('dash-reputacion', mafia.reputacion,    mafia.reputacion);
    animarValor('dash-influencia', mafia.influencia,    mafia.influencia);
  }

  function animarValor(id, texto, valor) {
    const el = document.getElementById(id);
    if (!el) return;
    const prev = estado._prevVals[id];
    if (prev !== undefined && prev !== valor) {
      el.classList.remove('up','down');
      void el.offsetWidth; // reflow para reiniciar animación
      el.classList.add(valor > prev ? 'up' : 'down');
      setTimeout(()=>el.classList.remove('up','down'), 1500);
    }
    el.textContent = texto;
    estado._prevVals[id] = valor;
  }

  /* ═══════════════════════════════════════════════
     VOTACIÓN
  ═══════════════════════════════════════════════ */
  async function votar(accion) {
    if (estado.votoActual) return;
    estado.votoActual = accion;

    // Guardar voto en Firebase (clave = mafiaIdx)
    await firebase.database.set(
      ref(`salas/${estado.sala}/votos/${estado.rondaActual}/${estado.mafiaIdx}`),
      accion
    );

    // UI
    document.querySelectorAll('.accion-btn').forEach(b => {
      b.disabled = true;
      if (b.classList.contains(accion)) b.classList.add('selected');
    });
    const iconos = { cooperar:'🤝', traicionar:'🔪', negociar:'📜', robar:'💸', alianza:'🦅' };
    document.getElementById('voto-texto').textContent =
      `${iconos[accion]} Votaste: ${accion.toUpperCase()} ✓`;
    document.getElementById('voto-confirmado').style.display = 'block';
    playSonido('tick');
  }

  function reiniciarPanelVotacion() {
    document.querySelectorAll('.accion-btn').forEach(b => {
      b.disabled = false;
      b.classList.remove('selected');
    });
    document.getElementById('voto-confirmado').style.display = 'none';
    document.getElementById('resultado-panel').style.display  = 'none';
    document.getElementById('votacion-panel').style.display   = 'block';
    showTab('tab-accion');
  }

  /* ═══════════════════════════════════════════════
     RESULTADOS DE RONDA (jugador)
  ═══════════════════════════════════════════════ */
  function mostrarResultadoRonda(resumen) {
    if (!resumen) return;
    const miResultado = resumen.find(r => r.mafiaIdx === estado.mafiaIdx);
    if (!miResultado) return;
    const d = miResultado.delta;
    const iconos = { cooperar:'🤝', traicionar:'🔪', negociar:'📜', robar:'💸', alianza:'🦅' };
    document.getElementById('resultado-contenido').innerHTML = `
      <div class="resultado-item"><span>Tu acción</span><span>${iconos[miResultado.accion]} ${miResultado.accion.toUpperCase()}</span></div>
      <div class="resultado-item"><span>Rival dominante</span><span>${iconos[miResultado.rival]} ${miResultado.rival.toUpperCase()}</span></div>
      <div class="resultado-item"><span>💰 Dinero</span><span class="resultado-delta ${d.d>=0?'pos':'neg'}">${d.d>=0?'+':''}$${Math.round(d.d)}</span></div>
      <div class="resultado-item"><span>⭐ Reputación</span><span class="resultado-delta ${d.r>=0?'pos':'neg'}">${d.r>=0?'+':''}${d.r}</span></div>
      <div class="resultado-item"><span>💎 Influencia</span><span class="resultado-delta ${d.i>=0?'pos':'neg'}">${d.i>=0?'+':''}${d.i}</span></div>
    `;
    document.getElementById('votacion-panel').style.display  = 'none';
    document.getElementById('resultado-panel').style.display = 'block';
  }

  /* ═══════════════════════════════════════════════
     RANKING Y MAFIAS (jugador)
  ═══════════════════════════════════════════════ */
  async function renderRankingLive(mafias) {
    if (!mafias) {
      const snap = await firebase.database.get(refMafias(estado.sala));
      mafias = snap.val();
    }
    if (!mafias) return;
    const sorted = [...Object.values(mafias)].sort((a,b)=>b.dinero-a.dinero);
    const posClases  = ['gold','silver','bronze'];
    const posMedallas= ['🥇','🥈','🥉'];
    document.getElementById('ranking-list').innerHTML = sorted.map((m,i)=>{
      const info = MAFIAS_INFO[m.idx];
      const esMia = m.idx === estado.mafiaIdx;
      return `<div class="ranking-item ${esMia?'mi-mafia':''}">
        <span class="ranking-pos ${posClases[i]||''}">${posMedallas[i]||`#${i+1}`}</span>
        <div class="ranking-info">
          <div class="ranking-nombre">${info.emoji} ${m.nombre}</div>
          <div class="ranking-stats">⭐${m.reputacion} · 💎${m.influencia} · 🔪${m.traiciones} traiciones</div>
        </div>
        <span class="ranking-dinero">$${m.dinero}</span>
      </div>`;
    }).join('');
  }

  async function renderMafiasLive(mafias) {
    if (!mafias) {
      const snap = await firebase.database.get(refMafias(estado.sala));
      mafias = snap.val();
    }
    if (!mafias) return;
    const snapJug = await firebase.database.get(refJugadors(estado.sala));
    const jugadores = snapJug.val() ? Object.values(snapJug.val()) : [];

    document.getElementById('mafias-list').innerHTML = Object.values(mafias).map(m=>{
      const info    = MAFIAS_INFO[m.idx];
      const esMia   = m.idx === estado.mafiaIdx;
      const miembros= jugadores.filter(j=>j.mafiaIdx===m.idx).map(j=>j.nombre).join(', ');
      return `<div class="mafia-card ${esMia?'mi-mafia-card':''} mafia-bg-${info.idx}">
        <div class="mafia-card-header">
          <span class="mafia-card-nombre mafia-color-${info.idx}">${info.emoji} ${m.nombre}</span>
          <span>💰$${m.dinero}</span>
        </div>
        <div class="rep-label">Reputación: ${m.reputacion}/100</div>
        <div class="mafia-rep-bar">
          <div class="mafia-rep-fill mafia-fill-${info.idx}" style="width:${m.reputacion}%"></div>
        </div>
        <div class="mafia-miembros">👥 ${miembros||'Sin miembros registrados'}</div>
      </div>`;
    }).join('');
  }

  /* ═══════════════════════════════════════════════
     EVENTOS ESPECIALES
  ═══════════════════════════════════════════════ */
  function mostrarEvento(ev) {
    document.getElementById('evento-icon').textContent   = ev.icono;
    document.getElementById('evento-titulo').textContent = ev.titulo;
    document.getElementById('evento-desc').textContent   = ev.desc;
    document.getElementById('evento-ronda').textContent  = `${ev.icono} ${ev.titulo}`;
    document.getElementById('overlay-evento').style.display = 'flex';
  }
  function cerrarEvento() { document.getElementById('overlay-evento').style.display = 'none'; }

  function mostrarTraicion(traidores) {
    document.getElementById('traicion-texto').textContent =
      `¡Las siguientes mafias traicionaron esta ronda: ${traidores}!`;
    document.getElementById('overlay-traicion').style.display = 'flex';
    playSonido('traicion');
  }
  function cerrarTraicion() { document.getElementById('overlay-traicion').style.display = 'none'; }

  /* ═══════════════════════════════════════════════
     PANTALLA FINAL
  ═══════════════════════════════════════════════ */
  function mostrarFinal(est) {
    const mafias = Array.isArray(est.mafias) ? est.mafias : Object.values(est.mafias);
    const sorted = [...mafias].sort((a,b)=>b.dinero-a.dinero);
    const ganador = sorted[0];
    const infoGanador = MAFIAS_INFO[ganador.idx];

    document.getElementById('winner-name').textContent = `${infoGanador.emoji} ${infoGanador.nombre}`;
    document.getElementById('winner-stats').innerHTML = `
      <div class="winner-stat"><div class="winner-stat-val">$${ganador.dinero}</div><div class="winner-stat-lbl">DINERO</div></div>
      <div class="winner-stat"><div class="winner-stat-val">${ganador.reputacion}</div><div class="winner-stat-lbl">REPUTACIÓN</div></div>
      <div class="winner-stat"><div class="winner-stat-val">${ganador.influencia}</div><div class="winner-stat-lbl">INFLUENCIA</div></div>
    `;

    const posMedallas = ['🥇','🥈','🥉'];
    document.getElementById('final-ranking').innerHTML = sorted.map((m,i)=>{
      const info = MAFIAS_INFO[m.idx];
      return `<div class="final-ranking-item">
        <span class="pos">${posMedallas[i]||`#${i+1}`}</span>
        <span class="nom mafia-color-${info.idx}">${info.emoji} ${info.nombre}</span>
        <span class="din">$${m.dinero}</span>
      </div>`;
    }).join('');

    const traicionSort = [...mafias].sort((a,b)=>b.traiciones-a.traiciones);
    const cooperaSort  = [...mafias].sort((a,b)=>b.cooperaciones-a.cooperaciones);
    document.getElementById('final-traiciones').innerHTML =
      `<p class="panel-title" style="font-size:14px;margin-bottom:8px">🔪 Más traicioneros</p>` +
      traicionSort.slice(0,3).map(m=>{
        const info=MAFIAS_INFO[m.idx];
        return `<div class="traicion-stat">
          <span class="nom mafia-color-${info.idx}">${info.emoji} ${info.nombre}</span>
          <span class="cnt">${m.traiciones} traiciones</span>
        </div>`;
      }).join('') +
      `<p class="panel-title" style="font-size:14px;margin:14px 0 8px">🤝 Más confiables</p>` +
      cooperaSort.slice(0,3).map(m=>{
        const info=MAFIAS_INFO[m.idx];
        return `<div class="traicion-stat" style="border-color:rgba(57,255,20,.2)">
          <span class="nom mafia-color-${info.idx}">${info.emoji} ${info.nombre}</span>
          <span class="cnt" style="color:var(--neon-green)">${m.cooperaciones} cooperaciones</span>
        </div>`;
      }).join('');

    const ganadorCoopero = ganador.cooperaciones > ganador.traiciones;
    document.getElementById('final-estrategia').innerHTML = `
      <h4>🧠 ¿Por qué ganó ${infoGanador.nombre}?</h4>
      <p>${ganadorCoopero
        ? 'Usó la <strong>cooperación como estrategia dominante</strong>. Construyó reputación que trajo bonificaciones acumuladas ronda tras ronda.'
        : 'Aplicó una <strong>estrategia mixta con traiciones clave</strong>. Supo cuándo traicionar para obtener dinero rápido sin destruir su reputación completamente.'
      }</p>
      <h4>📐 Dilema del Prisionero</h4>
      <p>Este juego es una versión multijugador del dilema del prisionero. Si todos cooperan, todos ganan más en total. Pero la tentación de traicionar es enorme porque genera ganancias individuales inmediatas.</p>
      <h4>⚖️ ¿Cuándo cooperar?</h4>
      <p>Cooperar es óptimo cuando <strong>confías en el historial</strong> de la otra mafia y hay muchas rondas por delante. Las ganancias acumuladas superan las traiciones puntuales.</p>
      <h4>🔪 ¿Cuándo traicionar?</h4>
      <p>Traicionar tiene sentido en la <strong>última ronda</strong> o cuando tu reputación ya es baja. Pero hacerlo temprano destruye alianzas futuras.</p>
      <h4>📊 Resultado de la clase</h4>
      <p>Total traiciones: <strong>${mafias.reduce((s,m)=>s+m.traiciones,0)}</strong> · Total cooperaciones: <strong>${mafias.reduce((s,m)=>s+m.cooperaciones,0)}</strong></p>
      <p>La mafia más confiable fue <strong>${MAFIAS_INFO[cooperaSort[0].idx].nombre}</strong> (${cooperaSort[0].cooperaciones} coop). La más traicionera: <strong>${MAFIAS_INFO[traicionSort[0].idx].nombre}</strong> (${traicionSort[0].traiciones} traiciones).</p>
      <h4>🌐 Conexión con el mundo real</h4>
      <p>Esto refleja dilemas reales: negociación internacional, acuerdos comerciales, política empresarial. La confianza a largo plazo genera más valor que la ganancia cortoplacista de romper acuerdos.</p>
    `;

    lanzarConfetti();
    playSonido('victory');
  }

  /* ═══════════════════════════════════════════════
     CONFIGURACIÓN FIREBASE (UI)
  ═══════════════════════════════════════════════ */
  function mostrarConfigFirebase() {
    document.getElementById('overlay-firebase').style.display = 'flex';
  }
  function cerrarConfigFirebase() {
    document.getElementById('overlay-firebase').style.display = 'none';
  }

  function guardarConfigFirebase() {
    const apiKey      = document.getElementById('fb-apiKey').value.trim();
    const authDomain  = document.getElementById('fb-authDomain').value.trim();
    const databaseURL = document.getElementById('fb-databaseURL').value.trim();
    const projectId   = document.getElementById('fb-projectId').value.trim();

    if (!apiKey || !databaseURL || !projectId) {
      return alert('Completa al menos: API Key, Database URL y Project ID.');
    }

    try {
      initFirebase({ apiKey, authDomain, databaseURL, projectId });
      localStorage.setItem('mp_firebase_cfg', JSON.stringify({ apiKey, authDomain, databaseURL, projectId }));
      document.getElementById('fb-status').textContent = '✅ Firebase conectado';
      document.getElementById('fb-status').style.color = 'var(--neon-green)';
      setTimeout(cerrarConfigFirebase, 1500);
    } catch(e) {
      alert('Error al conectar Firebase: ' + e.message);
    }
  }

  /* ═══════════════════════════════════════════════
     CONFETTI & SONIDOS
  ═══════════════════════════════════════════════ */
  function lanzarConfetti() {
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    const colors = ['#f5e642','#00f5ff','#ff2d78','#39ff14','#c77dff','#ff6b00'];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left:${Math.random()*100}%;top:-20px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        width:${6+Math.random()*10}px;height:${6+Math.random()*10}px;
        border-radius:${Math.random()>.5?'50%':'2px'};
        animation-duration:${2+Math.random()*3}s;
        animation-delay:${Math.random()*2}s;
      `;
      container.appendChild(el);
    }
  }

  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }
  function playSonido(tipo) {
    try {
      const ctx  = getAudioCtx();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      if (tipo==='traicion') {
        osc.type='sawtooth';
        osc.frequency.setValueAtTime(220,ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55,ctx.currentTime+.5);
        gain.gain.setValueAtTime(.3,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.5);
        osc.start(); osc.stop(ctx.currentTime+.5);
      } else if (tipo==='victory') {
        osc.type='triangle';
        [440,550,660,880].forEach((f,i)=>osc.frequency.setValueAtTime(f,ctx.currentTime+i*.1));
        gain.gain.setValueAtTime(.2,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.8);
        osc.start(); osc.stop(ctx.currentTime+.8);
      } else if (tipo==='tick') {
        osc.type='sine'; osc.frequency.setValueAtTime(800,ctx.currentTime);
        gain.gain.setValueAtTime(.1,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.05);
        osc.start(); osc.stop(ctx.currentTime+.05);
      }
    } catch(e) {}
  }

  /* ═══════════════════════════════════════════════
     UTILIDADES
  ═══════════════════════════════════════════════ */
  function formatTime(seg) {
    const m = Math.floor(seg/60), s = seg%60;
    return `${m}:${s.toString().padStart(2,'0')}`;
  }
  function reiniciar() { location.reload(); }

  /* ═══════════════════════════════════════════════
     INICIALIZACIÓN
  ═══════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', () => {
    // Auto-cargar config Firebase guardada
    const saved = localStorage.getItem('mp_firebase_cfg');
    if (saved) {
      try {
        const cfg = JSON.parse(saved);
        initFirebase(cfg);
        document.getElementById('fb-apiKey').value      = cfg.apiKey      || '';
        document.getElementById('fb-authDomain').value  = cfg.authDomain  || '';
        document.getElementById('fb-databaseURL').value = cfg.databaseURL || '';
        document.getElementById('fb-projectId').value   = cfg.projectId   || '';
        document.getElementById('fb-status-inicio').textContent = '🔥 Firebase conectado';
        document.getElementById('fb-status-inicio').style.color = 'var(--neon-green)';
      } catch(e) {}
    }

    // Auto-unirse si hay ?sala= en la URL
    const params = new URLSearchParams(location.search);
    const sala   = params.get('sala');
    if (sala) {
      document.getElementById('input-sala').value = sala.toUpperCase();
      showScreen('screen-registro');
    }
  });

  /* ═══════════════════════════════════════════════
     API PÚBLICA
  ═══════════════════════════════════════════════ */
  return {
    showScreen, showTab, showFinalTab,
    goToRegister, goToAdmin,
    crearSala, registrarJugador, iniciarJuego,
    forzarResultados, siguienteRonda,
    votar, cerrarEvento, cerrarTraicion,
    reiniciar, resetearSala, terminarJuego,
    renderRanking: renderRankingLive,
    renderMafias : renderMafiasLive,
    mostrarConfigFirebase, cerrarConfigFirebase, guardarConfigFirebase,
  };

})();
