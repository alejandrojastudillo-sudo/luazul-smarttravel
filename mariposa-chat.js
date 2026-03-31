/* ============================================================
   LUAZUL Smart Travel — Mariposa Luazul 🦋
   mariposa-chat.js  —  Guided travel assistant (Phase 1)
   No external AI APIs — pure JS guided conversation.
   ============================================================ */

(function () {
  'use strict';

  /* ── CONFIG ──────────────────────────────────────────── */
  var WA_NUMBER  = '5492974726449';   // Ale (default advisor)
  var WA_NUMBER2 = '5522998977213';   // Lucía
  var TYPING_DELAY = 900;             // ms before response appears

  /* ── AVATAR (inline, no external file needed) ────────── */
  // Dynamic path: works from root and from /destinos/ subfolder
  var _isSubpage = window.location.pathname.indexOf('/destinos/') >= 0;
  var AVATAR_SRC = (_isSubpage ? '../images/' : 'images/') + 'mariposa-avatar.png';
  // Fallback: inline butterfly emoji as SVG data
  var AVATAR_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%230B3D91'/%3E%3Ctext x='50' y='62' text-anchor='middle' font-size='46'%3E🦋%3C/text%3E%3C/svg%3E";

  /* ── KNOWLEDGE BASE ──────────────────────────────────── */
  var KB = {

    welcome: {
      text: "Hola, soy <strong>Mariposa Luazul</strong> 🦋<br><br>Estoy aquí para ayudarte a descubrir todo lo que podés vivir en <em>Río de Janeiro</em> y la Costa do Sol brasileña.<br><br>¿Por dónde queremos empezar?",
      options: [
        { icon:'🌴', label:'Explorar excursiones y tours',       id:'tours' },
        { icon:'🏝️', label:'Conocer los paquetes de viaje',      id:'paquetes' },
        { icon:'📅', label:'Ayuda para planificar mi viaje',     id:'planificar' },
        { icon:'❓', label:'Preguntas frecuentes',               id:'faq' },
        { icon:'💬', label:'Hablar con un asesor humano',        id:'asesor' },
      ]
    },

    tours: {
      text: "¡Qué buena elección! Río de Janeiro y la Costa do Sol tienen experiencias que no se olvidan.<br><br>Estas son las excursiones más populares de nuestros viajeros:<br><br>🏔️ <strong>Cristo Redentor</strong> — La postal más icónica del mundo<br>🚠 <strong>Pan de Azúcar</strong> — Vistas desde las alturas con teleférico<br>🏖️ <strong>Arraial do Cabo</strong> — El Caribe Brasileño, aguas increíbles<br>⛵ <strong>Búzios</strong> — La península más sofisticada de Brasil<br>🚙 <strong>Paseo en Buggy</strong> — Aventura por las playas escondidas<br>🛥️ <strong>Paseo en Barco</strong> — 12 playas y 3 islas desde el mar<br><br>¿Querés saber más sobre alguna en particular?",
      options: [
        { icon:'🏔️', label:'Cristo Redentor y Pan de Azúcar', id:'tour_cristo' },
        { icon:'🏖️', label:'Arraial do Cabo',                  id:'tour_arraial' },
        { icon:'⛵', label:'Búzios',                           id:'tour_buzios' },
        { icon:'🚙', label:'Paseo en Buggy',                   id:'tour_buggy' },
        { icon:'🏠', label:'Volver al inicio',                  id:'home' },
      ]
    },

    tour_cristo: {
      text: "Eso suele interesar mucho a quienes visitan Río. 🏔️<br><br><strong>Cristo Redentor</strong> está a 710 metros sobre la ciudad, en la cima del Corcovado. Es una de las 7 maravillas del mundo moderno, y la vista desde arriba es simplemente inolvidable.<br><br><strong>Pan de Azúcar</strong> se suma al recorrido: un teleférico sube en dos etapas hasta los 396 metros, y desde allí tenés la bahía de Guanabara, Niterói y Copacabana en un solo plano.<br><br>Todos nuestros paquetes incluyen un día completo en Río con estos íconos. 🌟",
      options: [
        { icon:'🏝️', label:'Ver paquetes que incluyen Río',  id:'paquetes' },
        { icon:'💬', label:'Consultar con un asesor',         id:'asesor' },
        { icon:'◀️', label:'Volver a excursiones',            id:'tours' },
      ]
    },

    tour_arraial: {
      text: "Arraial do Cabo es el secreto mejor guardado de la Costa do Sol. 🌊<br><br>Sus aguas son tan transparentes que podés ver el fondo a metros de profundidad. La llaman el <em>Caribe Brasileño</em> — y no es exageración.<br><br>Nuestro tour en <strong>Buggy</strong> llega a <em>Arubinha</em>, una lengua de arena entre la laguna y el mar que parece sacada de otro planeta.<br><br>Arraial do Cabo está a solo 15 minutos de Cabo Frío, por eso está incluido en todos nuestros paquetes. 🏖️",
      options: [
        { icon:'🚙', label:'Conocer el tour en Buggy',       id:'tour_buggy' },
        { icon:'🏝️', label:'Ver paquetes a Cabo Frío',      id:'paquetes' },
        { icon:'💬', label:'Hablar con un asesor',            id:'asesor' },
        { icon:'◀️', label:'Volver',                         id:'tours' },
      ]
    },

    tour_buzios: {
      text: "Búzios es donde va quien busca sofisticación sin perder el mar. ⛵<br><br>Es una península con <strong>23 playas</strong>, cada una con personalidad propia. Brigitte Bardot llegó en los años 60 y la puso en el mapa del mundo.<br><br>El tour en goleta recorre las playas más hermosas con paradas para nadar y snorkeling. La <em>Rua das Pedras</em> de noche, con sus restaurantes y la música, tiene una magia especial.<br><br>Búzios es parte de nuestros paquetes premium de la Costa do Sol. 🌅",
      options: [
        { icon:'🏝️', label:'Ver paquetes Costa do Sol',     id:'paquetes' },
        { icon:'💬', label:'Consultar disponibilidad',        id:'asesor' },
        { icon:'◀️', label:'Volver',                         id:'tours' },
      ]
    },

    tour_buggy: {
      text: "El Paseo en Buggy es una de las experiencias favoritas de nuestros viajeros. 🚙<br><br>Recorremos las playas que los turistas comunes nunca ven — accesos imposibles para autos convencionales. El punto estrella es <em>Punta de Alcaíra (Arubinha)</em>, una franja de arena entre la laguna y el mar.<br><br>También pasamos por <strong>Praia de Massambaba</strong>, casi desierta, perfecta para fotos y un chapuzón tranquilo. Dura unas 4 horas y es apto para toda la familia. 🌊",
      options: [
        { icon:'🏝️', label:'Ver paquetes que lo incluyen', id:'paquetes' },
        { icon:'💬', label:'Reservar / consultar precio',   id:'asesor' },
        { icon:'◀️', label:'Volver a excursiones',          id:'tours' },
      ]
    },

    paquetes: {
      text: "Nuestros paquetes están diseñados para disfrutar Brasil sin preocupaciones. 🌴<br><br>Todos incluyen:<br>🏨 <strong>7 noches frente al mar</strong> en Cabo Frío<br>🚐 <strong>Traslados privados</strong> aeropuerto — hotel<br>🌆 <strong>Día completo en Río de Janeiro</strong> (Cristo + Pan de Azúcar)<br>⛵ <strong>Paseo de Barco</strong> en Arraial do Cabo con almuerzo<br>🤿 Tours y excursiones seleccionadas<br><br>Se pagan en <em>cómodas cuotas en dólares</em> — sin sorpresas.<br><br>¿Para cuántas personas estás pensando el viaje?",
      options: [
        { icon:'💑', label:'Escapada en pareja (2 personas)',   id:'pkg_2' },
        { icon:'👫', label:'Grupo de 4 personas',               id:'pkg_4' },
        { icon:'👥', label:'Grupo de 6 personas',               id:'pkg_6' },
        { icon:'✈️', label:'Pregunta sobre vuelos',             id:'vuelos' },
        { icon:'💬', label:'Consultar con asesor',              id:'asesor' },
        { icon:'🏠', label:'Volver al inicio',                  id:'home' },
      ]
    },

    pkg_2: {
      text: "¡Perfecto para una escapada romántica! 💑<br><br>El <strong>Paquete Pareja</strong> está pensado para que vivan Brasil a fondo, de a dos.<br><br>💰 <strong>USD 870</strong> total · desde <strong>USD 87/mes</strong> en 10 cuotas<br><br>Incluye las 7 noches, traslados privados, día en Río, paseo de barco y más. Es el nuestro más elegido.<br><br>¿Querés que un asesor te arme el plan completo?",
      options: [
        { icon:'💬', label:'¡Sí, quiero más información!',  id:'asesor' },
        { icon:'📊', label:'Simular mis cuotas',            id:'simulador' },
        { icon:'◀️', label:'Ver otros paquetes',             id:'paquetes' },
      ]
    },

    pkg_4: {
      text: "¡Los viajes en grupo tienen otra energía! 👫<br><br>El <strong>Paquete 4 Amigos</strong> incluye todo para que cuatro personas vivan Brasil en modo completo.<br><br>💰 <strong>USD 1.450</strong> total · desde <strong>USD 145/mes</strong> en 10 cuotas<br><br>Incluye alojamiento compartido, traslados, Río, paseo de barco, buggy y más. ¡Y la noche en Mambo Beach también! 🎉",
      options: [
        { icon:'💬', label:'Consultar disponibilidad',       id:'asesor' },
        { icon:'📊', label:'Ver simulador de cuotas',        id:'simulador' },
        { icon:'◀️', label:'Ver otros paquetes',             id:'paquetes' },
      ]
    },

    pkg_6: {
      text: "¡El grupo completo, la experiencia completa! 👥🎉<br><br>El <strong>Paquete 6 Amigos</strong> es el más festivo de todos.<br><br>💰 <strong>USD 1.740</strong> total · desde <strong>USD 174/mes</strong> en 10 cuotas<br><br>Incluye todas las excursiones, traslados privados, alojamiento y un día de Río que no van a olvidar nunca.<br><br>Nuestros asesores pueden personalizarlo aún más.",
      options: [
        { icon:'💬', label:'Hablar con asesor',              id:'asesor' },
        { icon:'📊', label:'Ir al simulador',                id:'simulador' },
        { icon:'◀️', label:'Ver otros paquetes',             id:'paquetes' },
      ]
    },

    planificar: {
      text: "Planificar bien el viaje marca toda la diferencia. 📅<br><br>Estas son las preguntas que más nos hacen:<br><br>🗓️ <strong>¿Cuándo ir?</strong> Diciembre es el mes más elegido — clima ideal, fiestas en la playa.<br>⏱️ <strong>¿Cuántos días?</strong> Recomendamos mínimo 7 noches para disfrutar bien.<br>🌡️ <strong>¿El clima?</strong> Brasil tropical — calor y sol la mayor parte del año.<br>💱 <strong>¿Moneda?</strong> Nuestros paquetes se pagan en USD en cuotas cómodas.<br>✈️ <strong>¿Vuelos?</strong> Los paquetes no incluyen vuelos — pero podemos orientarte.<br><br>¿Hay algo en particular que te preocupe del viaje?",
      options: [
        { icon:'✈️', label:'Sobre los vuelos',              id:'vuelos' },
        { icon:'💰', label:'Sobre los precios y cuotas',    id:'precios' },
        { icon:'📅', label:'¿Cuándo es la mejor época?',   id:'epoca' },
        { icon:'💬', label:'Hablar con un asesor',          id:'asesor' },
        { icon:'🏠', label:'Volver al inicio',              id:'home' },
      ]
    },

    vuelos: {
      text: "Muy buena pregunta, y es importante aclararlo bien. ✈️<br><br>Los <strong>paquetes de LUAZUL no incluyen vuelos</strong>.<br><br>Esto no es una limitación — es una ventaja. Cada viajero puede elegir cómo llegar: con el vuelo que más le conviene, desde la ciudad que quiera, en la fecha exacta.<br><br>Dicho esto, nuestros asesores conocen muy bien las rutas hacia Brasil y pueden orientarte sobre las mejores opciones de vuelo desde Argentina, Chile, Uruguay y Paraguay. 🌎",
      options: [
        { icon:'💬', label:'Consultar con asesor sobre vuelos', id:'asesor_vuelos' },
        { icon:'🏝️', label:'Ver qué incluye el paquete',       id:'paquetes' },
        { icon:'◀️', label:'Volver',                           id:'planificar' },
      ]
    },

    precios: {
      text: "Transparencia total en los precios — sin letra chica. 💰<br><br>Todos nuestros paquetes se pagan en <strong>dólares estadounidenses (USD)</strong>, en cuotas mensuales fijas. No hay sorpresas de cambio.<br><br>📌 <strong>Pareja</strong>: USD 870 total / USD 87 por mes (10 cuotas)<br>📌 <strong>4 personas</strong>: USD 1.450 total / USD 145 por mes<br>📌 <strong>6 personas</strong>: USD 1.740 total / USD 174 por mes<br><br>También hay cuotas a 12 y 18 meses disponibles. Usá el simulador para calcular exactamente lo tuyo.",
      options: [
        { icon:'📊', label:'Ir al simulador de cuotas',     id:'simulador' },
        { icon:'💬', label:'Consultar con asesor',          id:'asesor' },
        { icon:'◀️', label:'Volver',                        id:'planificar' },
      ]
    },

    epoca: {
      text: "Eso suele interesar mucho a quienes planifican con tiempo. 🗓️<br><br><strong>Diciembre</strong> es la joya de la corona — el viaje más esperado. Cabo Frío en pleno verano brasileño, sol garantizado, las playas en su mejor momento, y la energía de fin de año en Río. Es cuando más viajan nuestros clientes.<br><br><strong>Julio</strong> es otra excelente opción — invierno brasileño, pero con 25°C. Sin lluvia, y más tranquilo que diciembre.<br><br>Los paquetes LUAZUL se organizan especialmente para esas fechas. 🌞",
      options: [
        { icon:'🏝️', label:'Ver paquetes diciembre 2026',   id:'paquetes' },
        { icon:'💬', label:'Hablar con asesor',              id:'asesor' },
        { icon:'◀️', label:'Volver',                        id:'planificar' },
      ]
    },

    simulador: {
      text: "El simulador te permite calcular exactamente cuánto pagarías por mes. 📊<br><br>Podés elegir destino, cantidad de personas y número de cuotas — y ver el resultado al instante, sin compromiso.",
      options: [
        { icon:'📊', label:'Abrir simulador',               id:'_link_simulador' },
        { icon:'💬', label:'Consultar con asesor',          id:'asesor' },
        { icon:'🏠', label:'Volver al inicio',              id:'home' },
      ]
    },

    faq: {
      text: "Estas son las preguntas que más nos hacen. Elegí la que te interese: ❓",
      options: [
        { icon:'📅', label:'¿Cuántos días se recomiendan?',       id:'faq_dias' },
        { icon:'🌴', label:'¿Cuáles son las mejores excursiones?', id:'tours' },
        { icon:'💰', label:'¿Cómo funcionan las cuotas?',         id:'precios' },
        { icon:'✈️', label:'¿Los paquetes incluyen vuelos?',       id:'vuelos' },
        { icon:'🌡️', label:'¿Cómo es el clima en Brasil?',        id:'faq_clima' },
        { icon:'📋', label:'¿Qué incluye el paquete exactamente?', id:'paquetes' },
        { icon:'🏠', label:'Volver al inicio',                     id:'home' },
      ]
    },

    faq_dias: {
      text: "Muy buena pregunta. ⏱️<br><br>Recomendamos <strong>mínimo 7 noches</strong> para disfrutar Cabo Frío con calma, hacer las excursiones principales y dedicar un día entero a Río de Janeiro.<br><br>Con 7 noches podés:<br>✅ 3 días de playa en Cabo Frío<br>✅ 1 día de Buggy + Arraial do Cabo<br>✅ 1 día de Paseo de Barco<br>✅ 1 día en Río de Janeiro<br>✅ 1 día libre<br><br>Nuestros paquetes están armados exactamente para ese tiempo.",
      options: [
        { icon:'🏝️', label:'Ver paquetes 7 noches',         id:'paquetes' },
        { icon:'💬', label:'Consultar con asesor',           id:'asesor' },
        { icon:'◀️', label:'Más preguntas frecuentes',       id:'faq' },
      ]
    },

    faq_clima: {
      text: "¡El clima de Brasil es uno de los grandes atractivos! 🌡️<br><br>Cabo Frío y la Costa do Sol tienen <strong>clima tropical</strong>:<br>☀️ Verano (Dic–Mar): 28–35°C, ideal para playa<br>🌤️ Otoño (Abr–Jun): 22–28°C, agradable<br>🌤️ Invierno (Jul–Sep): 18–25°C, seco y soleado<br>🌤️ Primavera (Oct–Nov): 24–30°C, muy lindo<br><br>Nuestros viajes de <strong>diciembre</strong> son los más populares — pleno verano brasileño con playas en su mejor momento.",
      options: [
        { icon:'🏝️', label:'Ver paquetes diciembre',         id:'paquetes' },
        { icon:'◀️', label:'Más preguntas',                  id:'faq' },
        { icon:'🏠', label:'Volver al inicio',               id:'home' },
      ]
    },

    asesor: {
      text: "¡Perfecto! Nuestros asesores están para acompañarte en cada paso de la planificación. 🧡<br><br>Podés elegir con quién hablar:",
      options: [
        { icon:'💬', label:'Hablar con Lucía por WhatsApp',    id:'_wa_lucia' },
        { icon:'💬', label:'Hablar con Alejandro por WhatsApp',id:'_wa_ale' },
        { icon:'🏠', label:'Volver al inicio',                 id:'home' },
      ]
    },

    asesor_vuelos: {
      text: "Claro, nuestros asesores conocen muy bien las rutas hacia Brasil desde el Cono Sur. Pueden orientarte sobre las mejores opciones de vuelo para tu fecha y ciudad de origen. ✈️",
      options: [
        { icon:'💬', label:'Hablar con Lucía',                  id:'_wa_lucia' },
        { icon:'💬', label:'Hablar con Alejandro',              id:'_wa_ale' },
        { icon:'◀️', label:'Volver',                           id:'vuelos' },
      ]
    },

    home: 'welcome',
  };

  /* ── KEYWORD DETECTION ───────────────────────────────── */
  var KEYWORDS = [
    { words:['vuelo','vuelos','avion','aéreo','aereo','pasaje','boleto'], node:'vuelos' },
    { words:['precio','costo','cuota','pagar','cuánto','cuanto','tarifa'], node:'precios' },
    { words:['buggy','bugui'],                                            node:'tour_buggy' },
    { words:['arraial','caribe','transparente'],                          node:'tour_arraial' },
    { words:['búzios','buzios','bardot'],                                 node:'tour_buzios' },
    { words:['cristo','corcovado','redentor','pan de azúcar','teleférico'], node:'tour_cristo' },
    { words:['excursion','excursión','tour','paseo'],                     node:'tours' },
    { words:['paquete','incluye','incluido'],                             node:'paquetes' },
    { words:['clima','temperatura','calor','lluvia','tiempo'],            node:'faq_clima' },
    { words:['día','dias','noches','duración','tiempo'],                  node:'faq_dias' },
    { words:['cuando','época','mes','diciembre','julio','temporada'],     node:'epoca' },
    { words:['hola','hi','buenas','saludos'],                             node:'home' },
    { words:['asesor','asesorar','contactar','hablar','persona','humano'], node:'asesor' },
    { words:['simular','simulador','calcular','calculadora'],             node:'simulador' },
    { words:['frecuentes','faq','pregunta'],                              node:'faq' },
  ];

  function detectNode(text) {
    var t = text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    for (var i = 0; i < KEYWORDS.length; i++) {
      var k = KEYWORDS[i];
      for (var j = 0; j < k.words.length; j++) {
        if (t.indexOf(k.words[j]) !== -1) return k.node;
      }
    }
    return null;
  }

  /* ── STATE ───────────────────────────────────────────── */
  var isOpen     = false;
  var hasGreeted = false;
  var el         = {};

  /* ── DOM FACTORY ─────────────────────────────────────── */
  function avatarImg() {
    var img = document.createElement('img');
    img.src = AVATAR_SRC;
    img.alt = 'Mariposa Luazul';
    img.onerror = function(){ this.src = AVATAR_FALLBACK; };
    return img;
  }

  function buildBubble() {
    var wrap = document.createElement('div');
    wrap.id = 'mp-bubble';
    wrap.setAttribute('role','button');
    wrap.setAttribute('aria-label','Abrir asistente Mariposa Luazul');

    var avDiv = document.createElement('div');
    avDiv.id = 'mp-bubble-avatar';
    avDiv.appendChild(avatarImg());

    var txtDiv = document.createElement('div');
    txtDiv.id = 'mp-bubble-text';
    txtDiv.innerHTML = '<div class="mp-bt-name">Mariposa Luazul</div><div class="mp-bt-sub">Asistente de Viaje</div>';

    var dot = document.createElement('div');
    dot.id = 'mp-notif-dot';

    wrap.appendChild(avDiv);
    wrap.appendChild(txtDiv);
    wrap.appendChild(dot);
    wrap.addEventListener('click', toggleChat);
    return wrap;
  }

  function buildWindow() {
    var win = document.createElement('div');
    win.id = 'mp-window';
    win.setAttribute('role','dialog');
    win.setAttribute('aria-label','Chat Mariposa Luazul');

    /* header */
    var hdr = document.createElement('div');
    hdr.id = 'mp-header';

    var hAvatar = document.createElement('div');
    hAvatar.id = 'mp-header-avatar';
    hAvatar.appendChild(avatarImg());

    var hInfo = document.createElement('div');
    hInfo.id = 'mp-header-info';
    hInfo.innerHTML = '<div id="mp-header-name">Mariposa Luazul 🦋</div><div id="mp-header-status">En línea ahora</div>';

    var closeBtn = document.createElement('button');
    closeBtn.id = 'mp-close-btn';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label','Cerrar chat');
    closeBtn.addEventListener('click', toggleChat);

    hdr.appendChild(hAvatar);
    hdr.appendChild(hInfo);
    hdr.appendChild(closeBtn);

    /* messages */
    var msgs = document.createElement('div');
    msgs.id = 'mp-messages';

    /* input */
    var inputRow = document.createElement('div');
    inputRow.id = 'mp-input-row';

    var txt = document.createElement('input');
    txt.id = 'mp-text-input';
    txt.type = 'text';
    txt.placeholder = 'Escribe tu pregunta...';
    txt.setAttribute('autocomplete','off');
    txt.addEventListener('keydown', function(e){
      if (e.key === 'Enter') sendUserMessage();
    });

    var sendBtn = document.createElement('button');
    sendBtn.id = 'mp-send-btn';
    sendBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>';
    sendBtn.setAttribute('aria-label','Enviar');
    sendBtn.addEventListener('click', sendUserMessage);

    inputRow.appendChild(txt);
    inputRow.appendChild(sendBtn);

    /* footer */
    var footer = document.createElement('div');
    footer.id = 'mp-footer';
    footer.textContent = 'LUAZUL Smart Travel · Asistente Digital';

    win.appendChild(hdr);
    win.appendChild(msgs);
    win.appendChild(inputRow);
    win.appendChild(footer);

    el.msgs     = msgs;
    el.txtInput = txt;
    return win;
  }

  /* ── RENDER HELPERS ──────────────────────────────────── */
  function scrollBottom() {
    setTimeout(function(){
      el.msgs.scrollTop = el.msgs.scrollHeight;
    }, 50);
  }

  function showTyping(cb) {
    var wrap = document.createElement('div');
    wrap.className = 'mp-typing';

    var av = document.createElement('div');
    av.className = 'mp-msg-bot-avatar';
    av.appendChild(avatarImg());

    var dots = document.createElement('div');
    dots.className = 'mp-typing-dots';
    for (var i=0;i<3;i++){
      var s = document.createElement('span'); dots.appendChild(s);
    }
    wrap.appendChild(av);
    wrap.appendChild(dots);
    el.msgs.appendChild(wrap);
    scrollBottom();

    setTimeout(function(){
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      cb();
    }, TYPING_DELAY);
  }

  function appendBotMsg(html, options) {
    var wrap = document.createElement('div');
    wrap.className = 'mp-msg-bot';

    var av = document.createElement('div');
    av.className = 'mp-msg-bot-avatar';
    av.appendChild(avatarImg());

    var bubble = document.createElement('div');
    bubble.className = 'mp-msg-bot-bubble';

    var textDiv = document.createElement('div');
    textDiv.innerHTML = html;
    bubble.appendChild(textDiv);

    if (options && options.length) {
      var optsDiv = document.createElement('div');
      optsDiv.className = 'mp-options';
      options.forEach(function(opt){
        var btn = document.createElement('button');
        btn.className = 'mp-opt';
        btn.innerHTML = '<span class="mp-opt-icon">' + opt.icon + '</span>' + opt.label;
        btn.addEventListener('click', function(){
          handleOption(opt.id, opt.label);
        });
        optsDiv.appendChild(btn);
      });
      bubble.appendChild(optsDiv);
    }

    wrap.appendChild(av);
    wrap.appendChild(bubble);
    el.msgs.appendChild(wrap);
    scrollBottom();
  }

  function appendUserMsg(text) {
    var wrap = document.createElement('div');
    wrap.className = 'mp-msg-user';
    var bubble = document.createElement('div');
    bubble.className = 'mp-msg-user-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    el.msgs.appendChild(wrap);
    scrollBottom();
  }

  /* ── NAVIGATION ──────────────────────────────────────── */
  function goNode(nodeId) {
    var node = KB[nodeId];
    if (!node) { goNode('home'); return; }

    // String alias
    if (typeof node === 'string') { goNode(node); return; }

    // Special actions
    if (nodeId === '_link_simulador') {
      window.open('simulador.html', '_blank');
      return;
    }
    if (nodeId.indexOf('_wa_') === 0) {
      var num = nodeId === '_wa_lucia' ? WA_NUMBER2 : WA_NUMBER;
      var msg = encodeURIComponent('¡Hola! Me contacto desde el sitio web de LUAZUL Smart Travel. Me gustaría información sobre los paquetes de viaje a Brasil.');
      window.open('https://wa.me/' + num + '?text=' + msg, '_blank');
      return;
    }

    appendBotMsg(node.text, node.options);
  }

  function handleOption(id, label) {
    appendUserMsg(label);
    showTyping(function(){ goNode(id); });
  }

  function sendUserMessage() {
    var text = (el.txtInput.value || '').trim();
    if (!text) return;
    el.txtInput.value = '';
    appendUserMsg(text);

    var node = detectNode(text);
    showTyping(function(){
      if (node) {
        goNode(node);
      } else {
        appendBotMsg(
          '¡Gracias por tu pregunta! 🦋<br><br>Para darte la mejor orientación, te conecto con uno de nuestros asesores de viaje.',
          [
            { icon:'💬', label:'Hablar con un asesor', id:'asesor' },
            { icon:'🏠', label:'Ver opciones principales', id:'home' },
          ]
        );
      }
    });
  }

  /* ── TOGGLE ──────────────────────────────────────────── */
  function toggleChat() {
    isOpen = !isOpen;
    var win = document.getElementById('mp-window');
    if (isOpen) {
      win.classList.add('mp-open');
      // Remove notif dot
      var dot = document.getElementById('mp-notif-dot');
      if (dot) dot.style.display = 'none';
      // Greet once
      if (!hasGreeted) {
        hasGreeted = true;
        setTimeout(function(){
          goNode('welcome');
        }, 300);
      }
      setTimeout(function(){ el.txtInput && el.txtInput.focus(); }, 350);
    } else {
      win.classList.remove('mp-open');
    }
  }

  /* ── INIT ────────────────────────────────────────────── */
  function init() {
    // Inject CSS
    var link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'mariposa-chat.css';
    document.head.appendChild(link);

    var bubble = buildBubble();
    var win    = buildWindow();
    document.body.appendChild(bubble);
    document.body.appendChild(win);

    // Auto-open hint after 8s (first visit)
    setTimeout(function(){
      var dot = document.getElementById('mp-notif-dot');
      if (dot && !isOpen) dot.style.animation = 'mp-pulse .6s ease-in-out infinite';
    }, 8000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
