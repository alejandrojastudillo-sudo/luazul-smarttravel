/* ============================================================
   LUAZUL SMART TRAVEL — app.js
   Shared scripts for all pages
   ============================================================ */

/* ── SMOOTH SCROLL (legacy support) ── */
function lzScrollTo(id) {
    var el = document.getElementById(id);
    if (el) {
        var offset = 75;
        var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', function () {

    /* ── GENERIC SLIDER FACTORY ── */
    function makeSlider(containerSelector, prevId, nextId, dotAttr, interval) {
        var container = document.querySelector(containerSelector);
        if (!container) return;
        var slides = container.querySelectorAll('.buggy-slide');
        var dots   = document.querySelectorAll('[' + dotAttr + ']');
        if (!slides.length) return;
        var idx = 0;
        var timer;

        function goTo(n) {
            slides[idx].classList.remove('active');
            if (dots[idx]) dots[idx].classList.remove('active');
            idx = (n + slides.length) % slides.length;
            slides[idx].classList.add('active');
            if (dots[idx]) dots[idx].classList.add('active');
        }

        function start() { timer = setInterval(function(){ goTo(idx + 1); }, interval); }
        function reset() { clearInterval(timer); start(); }

        var p = document.getElementById(prevId);
        var n = document.getElementById(nextId);
        if (p) p.addEventListener('click', function(){ goTo(idx - 1); reset(); });
        if (n) n.addEventListener('click', function(){ goTo(idx + 1); reset(); });
        dots.forEach(function(d, i){ d.addEventListener('click', function(){ goTo(i); reset(); }); });
        start();
    }

    /* Initialize each slider independently */
    makeSlider('#sliderBuggy',    'buggyPrev',    'buggyNext',    'data-dot',      4000);
    makeSlider('#sliderMambo',    'mamboPrev',    'mamboNext',    'data-mambo',    4500);
    makeSlider('#sliderBuzios',   'buziosPrev',   'buziosNext',   'data-buzios',   5000);
    makeSlider('#sliderCristo',   'cristoPrev',   'cristoNext',   'data-cristo',   4200);
    makeSlider('#sliderTijuca',   'tijucaPrev',   'tijucaNext',   'data-tijuca',   4800);
    makeSlider('#sliderIlha',     'ilhaPrev',     'ilhaNext',     'data-ilha',     5200);
    makeSlider('#sliderMaracana', 'maracanaPrev', 'maracanaNext', 'data-maracana', 4600);
    makeSlider('#sliderFamilia',  'familiaPrev',  'familiaNext',  'data-familia',  4400);

    /* ── COLLAPSIBLE TOGGLES ── */
    function makeToggle(btnId, panelId, arrowId) {
        var btn   = document.getElementById(btnId);
        var panel = document.getElementById(panelId);
        var arrow = document.getElementById(arrowId);
        if (!btn) return;
        btn.addEventListener('click', function(){
            panel.classList.toggle('open');
            if (arrow) arrow.textContent = panel.classList.contains('open') ? '▲' : '▼';
        });
    }
    makeToggle('mamboToggle',  'mamboPanel',  'mamboArrow');
    makeToggle('buziosToggle', 'buziosPanel', 'buziosArrow');

    /* ── SIMULATOR ── */
    var ds  = document.getElementById('destinoSim');
    var cs2 = document.getElementById('cuotasSim');
    if (ds)  ds.addEventListener('change', calcular);
    if (cs2) cs2.addEventListener('change', calcular);
    if (ds)  calcular();

}); /* end DOMContentLoaded */


/* ── SIMULADOR (global scope — used by onchange= attributes) ── */
var TOTALES   = { cabofrio2:1100, cabofrio4:1500, cabofrio6:2000, arraial2:1300, arraial4:2100, buzios2:900, buzios4:1400, rio2:1200, rio4:1700 };
var INTERESES = { '6':0, '10':0, '12':0.02, '18':0.05 };

function calcular() {
    var d  = document.getElementById('destinoSim');
    var cs = document.getElementById('cuotasSim');
    if (!d || !cs) return;
    var parts   = d.value.split('_');
    var key     = parts[0];
    var pax     = parseInt(parts[1]) || 1;
    var ncuotas = parseInt(cs.value);
    var tasa    = INTERESES[cs.value] || 0;
    var base    = TOTALES[key] || 1500;
    var total   = Math.round(base * (1 + tasa));
    var cuotaTot = Math.round(total / ncuotas);
    var porPersona = cuotaTot / pax;
    var mostrar  = (Math.floor(porPersona * 100 - 1) / 100).toFixed(2);
    var porDia   = (porPersona / 30).toFixed(2);
    var elM = document.getElementById('cuotaMensual');
    if (elM) elM.innerText = 'USD ' + mostrar;
    var elD = document.getElementById('porDia');
    if (elD) elD.innerText = 'USD ' + porDia;
    var elL = document.getElementById('simSubLabel');
    if (elL) elL.innerText = pax + ' persona' + (pax > 1 ? 's' : '') + ' · ' + ncuotas + ' cuotas';
}