// ============================================
// PPMBR - SERVER STATUS BY GUTY
// Integração com BattleMetrics
// ============================================

const SERVER_ID = '32963894';
const API_URL = `https://api.battlemetrics.com/servers/${SERVER_ID}`;
const UPDATE_INTERVAL = 30000; // 30 segundos, qualquer coisa muda aqui.

class ServerStatus {
    constructor() {
        this.data = null;
        this.lastUpdate = null;
        this.updateCallbacks = [];
    }

    // Busca dados do servidor
    async fetchServerData() {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            this.data = this.parseServerData(json);
            this.lastUpdate = new Date();

            // Chama todos os callbacks registrados
            this.updateCallbacks.forEach(callback => callback(this.data));

            return this.data;
        } catch (error) {
            console.error('[GUTY] Erro ao buscar dados do servidor:', error);

            // Retorna dados de fallback
            return this.getFallbackData();
        }
    }

    // Parse dos dados da API
    parseServerData(json) {
        const attributes = json.data.attributes;
        const details = json.data.attributes.details || {};

        return {
            status: attributes.status === 'online' ? 'ONLINE' : 'OFFLINE',
            players: attributes.players || 0,
            maxPlayers: attributes.maxPlayers || 64,
            name: attributes.name || 'PPMBR',
            map: details.map || 'EVERON',
            ip: attributes.ip || '143.137.87.84',
            port: attributes.port || 2001,
            rank: attributes.rank || 0,
            country: attributes.country || 'BR',
            ping: this.calculatePing(attributes.country),
            timeOfDay: details.time || 'N/A',
            version: details.version || 'N/A',
            official: details.official || false,
            modded: details.modded || true,
            passwordProtected: details.pve || false
        };
    }

    // Calcula ping aproximado baseado no país
    calculatePing(country) {
        // Ping aproximado para Brasil
        if (country === 'BR') {
            return Math.floor(Math.random() * 20) + 10; // 10-30ms
        }
        return Math.floor(Math.random() * 50) + 50; // 50-100ms
    }

    // Dados de fallback caso a API falhe
    getFallbackData() {
        return {
            status: 'OFFLINE',
            players: 0,
            maxPlayers: 64,
            name: 'PPMBR',
            map: 'EVERON',
            ip: '143.137.87.84',
            port: 2001,
            rank: 0,
            country: 'BR',
            ping: 0,
            timeOfDay: 'N/A',
            version: 'N/A',
            official: false,
            modded: true,
            passwordProtected: false
        };
    }

    // Registra callback para quando os dados forem atualizados
    onUpdate(callback) {
        this.updateCallbacks.push(callback);
    }

    // Inicia atualização automática
    startAutoUpdate() {
        // Primeira busca imediata
        this.fetchServerData();

        // Atualiza a cada intervalo definido
        setInterval(() => {
            this.fetchServerData();
        }, UPDATE_INTERVAL);

        console.log('[GUTY] Auto-atualização iniciada (30s)');
    }

    // Formata timestamp da última atualização
    getLastUpdateFormatted() {
        if (!this.lastUpdate) return 'Nunca';

        const now = new Date();
        const diff = Math.floor((now - this.lastUpdate) / 1000); // segundos

        if (diff < 60) return `${diff}s atrás`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
        return `${Math.floor(diff / 3600)}h atrás`;
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const serverStatus = new ServerStatus();

    // Atualiza a Intel Bar
    serverStatus.onUpdate((data) => {
        updateIntelBar(data);
        console.log('[GUTY] Dados atualizados:', data);
    });

    // Inicia atualização automática
    serverStatus.startAutoUpdate();

    // Torna disponível globalmente
    window.serverStatus = serverStatus;
});

// Atualiza a Intel Bar com os dados
function updateIntelBar(data) {
    // Status
    const statusElement = document.querySelector('.intel-value.online');
    if (statusElement) {
        statusElement.textContent = data.status;
        statusElement.classList.toggle('online', data.status === 'ONLINE');
        statusElement.classList.toggle('offline', data.status === 'OFFLINE');
    }

    // Jogadores
    const playersElement = document.getElementById('playerCount');
    if (playersElement) {
        playersElement.textContent = `${data.players}/${data.maxPlayers}`;

        // Animação de mudança
        playersElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            playersElement.style.transform = 'scale(1)';
        }, 200);
    }

    // Mapa
    const mapElements = document.querySelectorAll('.intel-value');
    mapElements.forEach(el => {
        if (el.textContent.includes('EVERON') || el.textContent === data.map) {
            el.textContent = data.map.toUpperCase();
        }
    });

    // Ping
    const pingElement = document.querySelector('.intel-value.ping');
    if (pingElement) {
        pingElement.textContent = `${data.ping}ms`;

        // Muda cor baseado no ping
        if (data.ping < 50) {
            pingElement.style.color = '#4caf50'; // Verde
        } else if (data.ping < 100) {
            pingElement.style.color = '#ffa726'; // Laranja
        } else {
            pingElement.style.color = '#cf2e2e'; // Vermelho
        }
    }

    // Atualiza título da página se servidor estiver offline
    if (data.status === 'OFFLINE') {
        document.title = '[OFFLINE] PPMBR - Programado Para Matar';
    } else {
        document.title = `[${data.players}/${data.maxPlayers}] PPMBR - Programado Para Matar`;
    }
}

// Adiciona estilo para status offline
const style = document.createElement('style');
style.textContent = `
    .intel-value.offline {
        color: #cf2e2e !important;
        text-shadow: 0 0 5px rgba(207, 46, 46, 0.5) !important;
        animation: blink 1s infinite;
    }

    @keyframes blink {
        0%, 50%, 100% { opacity: 1; }
        25%, 75% { opacity: 0.5; }
    }

    .intel-value {
        transition: transform 0.2s ease, color 0.3s ease;
    }
`;
document.head.appendChild(style);
