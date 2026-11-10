// =================================================================
// ARCHIVO: script.js
// PROYECTO: Enseñar Estructuras Algorítmicas en JS con Servidores
// =================================================================

// --- 1. VARIABLES DE ESTADO Y CONFIGURACIÓN ---
let towers = [[], [], []];
let numServers = 3;
let selectedTower = null;
let moveCount = 0;
let isSolving = false;

// --- 2. CONTENIDO PEDAGÓGICO DE CADA ESTRUCTURA ---
const conceptsData = {
    secuencial: {
        badge: "ESTRUCTURA SECUENCIAL",
        title: "1. Ejecución Secuencial (Paso a Paso)",
        desc: "Las instrucciones se ejecutan una tras otra en un orden estricto de arriba hacia abajo.",
        code: `// --- ESTRUCTURA SECUENCIAL EN JAVASCRIPT ---

// Paso 1: Inicializar los tres Racks (Torres)
const racks = [[], [], []];

// Paso 2: Crear variables para cada Servidor
const servidor1 = { id: 1, capacidad: "1U (Micro)" };
const servidor2 = { id: 2, capacidad: "2U (Database)" };
const servidor3 = { id: 3, capacidad: "3U (App Server)" };

// Paso 3: Apilar secuencialmente en el Rack Origen (Rack 0)
racks[0].push(servidor3); // El más grande abajo
racks[0].push(servidor2);
racks[0].push(servidor1); // El más ligero arriba

console.log("Servidores cargados secuencialmente en Rack A.");`,
        note: "¿Por qué es secuencial? Porque requiere un orden imperativo: no podemos apilar servidores sin antes inicializar la variable del Rack."
    },
    condicional: {
        badge: "ESTRUCTURA CONDICIONAL",
        title: "2. Estructuras Condicionales (IF / ELSE)",
        desc: "Evalúan condiciones lógicas para decidir qué camino tomar. Validamos si el movimiento de un servidor es permitido.",
        code: `// --- ESTRUCTURA CONDICIONAL (IF / ELSE) ---

function validarMovimiento(rackOrigen, rackDestino) {
    // Evaluación 1: ¿El rack de origen tiene servidores para mover?
    if (rackOrigen.length === 0) {
        console.warn("❌ Denegado: El Rack seleccionado no tiene servidores.");
        return false;
    }

    const servidorAMover = rackOrigen[rackOrigen.length - 1];
    const servidorDestino = rackDestino[rackDestino.length - 1];

    // Evaluación 2: ¿Cumple la regla de capacidad? (Menor sobre Mayor)
    if (!servidorDestino || servidorAMover < servidorDestino) {
        console.log("✓ Movimiento Válido: Migrando Servidor S-" + servidorAMover + "U");
        return true; 
    } else {
        console.error("❌ Violación: No se puede poner S-" + servidorAMover + "U sobre S-" + servidorDestino + "U");
        return false;
    }
} // Fin de validación condicional`,
        note: "Las condicionales permiten proteger la lógica del programa evitando que el servidor colapse por sobrecarga de peso."
    },
    iterativa: {
        badge: "ESTRUCTURA ITERATIVA",
        title: "3. Estructuras Iterativas (Bucles FOR / WHILE)",
        desc: "Repiten un bloque de código. Se usan para construir los servidores iniciales y dibujarlos automáticamente.",
        code: `// --- ESTRUCTURA ITERATIVA (BUCLES) ---

// Bucle FOR: Cargar automáticamente N servidores
function inicializarServidores(cantidad) {
    const rackA = [];
    
    // Repite la acción desde la capacidad N hasta 1
    for (let i = cantidad; i >= 1; i--) {
        rackA.push(i); // Inserta cada servidor en el arreglo
    }
    return rackA;
}

// Bucle WHILE: Proceso de migración completa automatizada
let servidoresPendientes = [3, 2, 1];
while (servidoresPendientes.length > 0) {
    let servidor = servidoresPendientes.pop();
    console.log("Procesando migración del Servidor:", servidor);
}`,
        note: "Los bucles evitan tener que repetir líneas de código manualmente al trabajar con 3, 5 o 100 servidores."
    },
    recursiva: {
        badge: "ALGORITMO RECURSIVO",
        title: "4. Algoritmo Recursivo (Torre de Hanoi)",
        desc: "Una función recursiva es aquella que se llama a sí misma para resolver sub-problemas más pequeños del mismo tipo.",
        code: `// --- ALGORITMO RECURSIVO ---

function resolverHanoiServidores(n, origen, destino, auxiliar) {
    // CASO BASE: Si solo queda 1 servidor, moverlo directamente
    if (n === 1) {
        moverServidor(origen, destino);
        return;
    }

    // PASO RECURSIVO 1: Mover (n - 1) servidores del Origen al Auxiliar
    resolverHanoiServidores(n - 1, origen, auxiliar, destino);

    // Mover el servidor base (el más grande) al Destino
    moverServidor(origen, destino);

    // PASO RECURSIVO 2: Mover los (n - 1) servidores del Auxiliar al Destino
    resolverHanoiServidores(n - 1, auxiliar, destino, origen);
}

// Ejecución con 3 servidores:
// resolverHanoiServidores(3, "Rack A", "Rack C", "Rack B");`,
        note: "La recursividad simplifica algoritmos complejos en solo 3 líneas conceptuales claras."
    }
};

// --- 3. CAMBIO DE PESTAÑAS EXPLICATIVAS ---
function setTab(key) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const activeBtn = document.getElementById(`btn-${key}`);
    if (activeBtn) activeBtn.classList.add('active');

    const data = conceptsData[key];
    if (!data) return;

    document.getElementById('concept-badge').innerText = data.badge;
    document.getElementById('concept-title').innerText = data.title;
    document.getElementById('concept-desc').innerText = data.desc;
    document.getElementById('code-display').innerText = data.code;
    document.getElementById('pedagogical-note').innerText = data.note;
}

// --- 4. LÓGICA DE LA TORRE DE HANOI / SERVIDORES ---
function resetGame() {
    if (isSolving) return;
    
    numServers = parseInt(document.getElementById('serverCount').value, 10);
    towers = [[], [], []];
    moveCount = 0;
    
    // Limpiar cualquier selección previa
    if (selectedTower !== null) {
        highlightTower(selectedTower, false);
    }
    selectedTower = null;
    document.querySelectorAll('.tower-container').forEach(c => c.classList.remove('selected'));

    // Llenar Rack Origen (Rack 0) mediante estructura iterativa
    for (let i = numServers; i >= 1; i--) {
        towers[0].push(i);
    }

    document.getElementById('moveCount').innerText = moveCount;
    document.getElementById('minMoves').innerText = Math.pow(2, numServers) - 1;
    
    const statusEl = document.getElementById('statusMessage');
    statusEl.innerText = "Listo para iniciar";
    statusEl.style.color = "#94a3b8";

    renderTowers();
}

function renderTowers() {
    for (let t = 0; t < 3; t++) {
        const rackEl = document.getElementById(`rack-${t}`);
        if (!rackEl) continue;
        rackEl.innerHTML = '';

        towers[t].forEach((serverId) => {
            const serverDiv = document.createElement('div');
            // Aplicar clases CSS dinámicas de tamaño y color
            serverDiv.className = `server-unit s-size-${serverId}`;
            
            serverDiv.innerHTML = `
                <div style="display:flex; align-items:center; gap:4px;">
                    <span class="server-led"></span>
                    <span>S-${serverId}U</span>
                </div>
                <div style="display:flex; gap:2px;">
                    <div style="width:3px; height:10px; background:rgba(0,0,0,0.5);"></div>
                    <div style="width:3px; height:10px; background:rgba(0,0,0,0.5);"></div>
                </div>
            `;
            
            rackEl.appendChild(serverDiv);
        });
    }
}

function handleTowerClick(towerIndex) {
    if (isSolving) return;

    const statusEl = document.getElementById('statusMessage');

    // SELECCIÓN DE ORIGEN
    if (selectedTower === null) {
        if (towers[towerIndex].length === 0) {
            statusEl.innerText = "⚠️ Rack vacío";
            statusEl.style.color = "#facc15";
            return;
        }
        selectedTower = towerIndex;
        highlightTower(towerIndex, true);
        statusEl.innerText = `Origen: Rack ${String.fromCharCode(65 + towerIndex)}`;
        statusEl.style.color = "#60a5fa";
        setTab('condicional');
    } 
    // SELECCIÓN DE DESTINO
    else {
        if (selectedTower === towerIndex) {
            highlightTower(selectedTower, false);
            selectedTower = null;
            statusEl.innerText = "Selección cancelada";
            statusEl.style.color = "#94a3b8";
            return;
        }

        const originStack = towers[selectedTower];
        const destStack = towers[towerIndex];
        const serverToMove = originStack[originStack.length - 1];
        const topDestServer = destStack[destStack.length - 1];

        // ESTRUCTURA CONDICIONAL: Validación de reglas
        if (!topDestServer || serverToMove < topDestServer) {
            destStack.push(originStack.pop());
            moveCount++;
            document.getElementById('moveCount').innerText = moveCount;
            
            // Verificación de condición de victoria (todos los servidores en Rack C)
            if (towers[2].length === numServers) {
                const optimal = Math.pow(2, numServers) - 1;
                statusEl.innerText = moveCount === optimal 
                    ? `🎉 ¡Perfecto! Migración óptima completada (${moveCount} movimientos)` 
                    : `🎉 ¡Completado! Migración en ${moveCount} movs. (Óptimo: ${optimal})`;
                statusEl.style.color = "#34d399";
            } else {
                statusEl.innerText = `✓ Servidor migrado a Rack ${String.fromCharCode(65 + towerIndex)}`;
                statusEl.style.color = "#34d399";
            }
        } else {
            statusEl.innerText = `❌ Inválido: S-${serverToMove}U no entra sobre S-${topDestServer}U`;
            statusEl.style.color = "#ef4444";
        }

        highlightTower(selectedTower, false);
        selectedTower = null;
        renderTowers();
    }
}

function highlightTower(index, highlight) {
    const containers = document.querySelectorAll('.tower-container');
    if (!containers[index]) return;
    if (highlight) {
        containers[index].classList.add('selected');
    } else {
        containers[index].classList.remove('selected');
    }
}

// --- 5. RESOLUCIÓN AUTOMÁTICA RECURSIVA ---
async function runAutoSolve() {
    if (isSolving) return;
    resetGame();
    isSolving = true;

    const btn = document.getElementById('solveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const serverSelect = document.getElementById('serverCount');

    if (btn) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
    }
    if (resetBtn) resetBtn.disabled = true;
    if (serverSelect) serverSelect.disabled = true;

    setTab('recursiva');

    const statusEl = document.getElementById('statusMessage');
    statusEl.innerText = "🤖 Resolviendo con Recursividad...";
    statusEl.style.color = "#c084fc";

    await hanoiRecursive(numServers, 0, 2, 1);

    statusEl.innerText = `🎉 ¡Solución recursiva completada en ${moveCount} pasos!`;
    statusEl.style.color = "#34d399";

    isSolving = false;
    if (btn) {
        btn.disabled = false;
        btn.style.opacity = "1";
    }
    if (resetBtn) resetBtn.disabled = false;
    if (serverSelect) serverSelect.disabled = false;
}

async function hanoiRecursive(n, origen, destino, auxiliar) {
    if (n === 1) {
        towers[destino].push(towers[origen].pop());
        moveCount++;
        document.getElementById('moveCount').innerText = moveCount;
        renderTowers();
        await new Promise(resolve => setTimeout(resolve, 600));
        return;
    }

    await hanoiRecursive(n - 1, origen, auxiliar, destino);
    towers[destino].push(towers[origen].pop());
    moveCount++;
    document.getElementById('moveCount').innerText = moveCount;
    renderTowers();
    await new Promise(resolve => setTimeout(resolve, 600));
    await hanoiRecursive(n - 1, auxiliar, destino, origen);
}

// --- 6. FUNCIONES DE UTILIDAD ---
function copyCode() {
    const codeText = document.getElementById('code-display').innerText;
    const copyBtn = document.querySelector('.copy-btn');

    const feedback = () => {
        if (copyBtn) {
            const originalHtml = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check icon-emerald"></i> ¡Copiado!';
            setTimeout(() => {
                copyBtn.innerHTML = originalHtml;
            }, 2000);
        }
        const status = document.getElementById('statusMessage');
        if (status) {
            status.innerText = "📋 Código JS copiado al portapapeles";
            status.style.color = "#60a5fa";
        }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codeText)
            .then(feedback)
            .catch(() => fallbackCopy(codeText, feedback));
    } else {
        fallbackCopy(codeText, feedback);
    }
}

function fallbackCopy(text, callback) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        if (callback) callback();
    } catch (err) {
        console.error("Error al copiar texto con fallback:", err);
    }
    document.body.removeChild(textArea);
}

// Inicialización de la aplicación al cargar
window.onload = function() {
    resetGame();
    setTab('secuencial');
};
