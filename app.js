// ========== LUAZUL SIMULADOR DINÁMICO ==========
// Conexión a Supabase
const SUPABASE_URL = 'https://yunvqgaljopirzvjrntc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_MqB2thv0uzVUAY2v2jh-uQ_ul6a2LzB';
const sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let catalogo = [];
let destinosMap = {};
let paquetesPorDestino = {};

async function initSimulador() {
    const selectGroup = document.getElementById('selectGroup');
    if (!selectGroup) return;

    try {
        const { data, error } = await sbClient
            .from('catalogo_precios')
            .select('*')
            .eq('activo', true)
            .order('orden');
        if (error) throw error;
        catalogo = data || [];
        if (catalogo.length === 0) throw new Error('No hay destinos activos');

        // Estructurar datos
        catalogo.forEach(item => {
            if (!destinosMap[item.slug]) {
                destinosMap[item.slug] = item.nombre_destino;
                paquetesPorDestino[item.slug] = [];
            }
            paquetesPorDestino[item.slug].push(item);
        });

        // Crear selects
        construirSelects();
    } catch (err) {
        selectGroup.innerHTML = `<p style="color:#f87171;">❌ Error: ${err.message}</p>`;
        console.error(err);
    }
}

function construirSelects() {
    const container = document.getElementById('selectGroup');
    if (!container) return;

    // Opciones de destinos
    let destinosHtml = '<select id="destinoSelect" class="web-select" onchange="cargarPaquetes()">';
    destinosHtml += '<option value="">Seleccionar destino...</option>';
    for (const [slug, nombre] of Object.entries(destinosMap)) {
        destinosHtml += `<option value="${slug}">${nombre}</option>`;
    }
    destinosHtml += '</select>';

    // Select de paquetes (inicialmente deshabilitado)
    destinosHtml += '<select id="paqueteSelect" class="web-select" disabled><option value="">Primero selecciona un destino</option></select>';

    // Select de cuotas
    destinosHtml += '<select id="cuotasSelect" class="web-select" onchange="calcular()">';
    destinosHtml += '<option value="6">6 cuotas</option>';
    destinosHtml += '<option value="10" selected>10 cuotas</option>';
    destinosHtml += '<option value="12">12 cuotas</option>';
    destinosHtml += '<option value="18">18 cuotas</option>';
    destinosHtml += '</select>';

    container.innerHTML = destinosHtml;
}

function cargarPaquetes() {
    const destinoSlug = document.getElementById('destinoSelect').value;
    const paqueteSelect = document.getElementById('paqueteSelect');
    if (!destinoSlug) {
        paqueteSelect.innerHTML = '<option value="">Primero selecciona un destino</option>';
        paqueteSelect.disabled = true;
        document.getElementById('simSubLabel').innerText = 'Seleccioná un destino y paquete';
        document.getElementById('cuotaMensual').innerText = '—';
        document.getElementById('porDia').innerText = '—';
        return;
    }

    const paquetes = paquetesPorDestino[destinoSlug] || [];
    if (paquetes.length === 0) {
        paqueteSelect.innerHTML = '<option value="">No hay paquetes para este destino</option>';
        paqueteSelect.disabled = true;
        return;
    }

    let options = '<option value="">Seleccionar paquete...</option>';
    paquetes.forEach(p => {
        options += `<option value="${p.id}" data-precio="${p.precio_usd}" data-personas="${p.personas}" data-noches="${p.noches}">${p.paquete} · ${p.personas} pers. · USD ${p.precio_usd}</option>`;
    });
    paqueteSelect.innerHTML = options;
    paqueteSelect.disabled = false;
    calcular();
}

function calcular() {
    const paqueteSelect = document.getElementById('paqueteSelect');
    const cuotasSelect = document.getElementById('cuotasSelect');
    const selectedOption = paqueteSelect.options[paqueteSelect.selectedIndex];
    if (!selectedOption || !selectedOption.value) {
        document.getElementById('simSubLabel').innerText = 'Seleccioná un paquete';
        document.getElementById('cuotaMensual').innerText = '—';
        document.getElementById('porDia').innerText = '—';
        return;
    }

    const precioTotal = parseFloat(selectedOption.getAttribute('data-precio'));
    const personas = parseInt(selectedOption.getAttribute('data-personas'), 10);
    const cuotas = parseInt(cuotasSelect.value, 10);
    if (isNaN(precioTotal) || isNaN(personas) || isNaN(cuotas)) return;

    const cuotaTotal = Math.floor(precioTotal / cuotas * 100) / 100;
    const cuotaPorPersona = cuotaTotal / personas;
    const porDia = (cuotaPorPersona / 30).toFixed(2);

    document.getElementById('cuotaMensual').innerHTML = `USD ${cuotaPorPersona.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('porDia').innerHTML = `USD ${porDia}`;
    document.getElementById('simSubLabel').innerHTML = `${personas} ${personas === 1 ? 'persona' : 'personas'} · ${cuotas} cuotas · USD ${cuotaTotal.toLocaleString('es-AR')} por mes (total)`;
}

// Estilos para los selects (para que se vean igual que el diseño original)
const estilo = document.createElement('style');
estilo.textContent = `
    .web-select {
        background-color: #0c1628;
        color: #e8eeff;
        border: 1px solid rgba(255,255,255,0.13);
        border-radius: 12px;
        padding: 12px 16px;
        font-family: inherit;
        font-size: 0.95rem;
        width: 100%;
        cursor: pointer;
        margin-bottom: 0.5rem;
    }
    .web-select option {
        background-color: #0c1628;
        color: #e8eeff;
    }
    .web-select:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    @media (min-width: 768px) {
        .select-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        .web-select {
            flex: 1;
            margin-bottom: 0;
        }
    }
`;
document.head.appendChild(estilo);

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initSimulador);
