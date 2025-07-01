<template>
  <div class="statistics-page">
    <div class="statistics-container">
      <div class="page-header">
        <h1 class="page-title">Statistiques</h1>
      </div>

      <!-- Cartes de statistiques -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Nb d'abonnés</div>
          <div class="stat-value">12</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Nb de formations</div>
          <div class="stat-value">2</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Bénéfice net</div>
          <div class="stat-value">325.08€</div>
        </div>
      </div>

      <!-- Graphique -->
      <div class="chart-container">
        <div class="chart-area">
          <svg viewBox="0 0 900 280" class="chart-svg">
            <!-- Lignes de grille -->
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            <!-- Axe X -->
            <g class="x-axis">
              <text v-for="(date, index) in chartDates" :key="date" 
                    :x="100 + index * 120" 
                    y="260" 
                    text-anchor="middle" 
                    class="axis-label">
                {{ date }}
              </text>
            </g>
            
            <!-- Ligne Vues (verte) -->
            <polyline 
              :points="getLinePoints(vuesData, '#22c55e')"
              fill="none" 
              stroke="#22c55e" 
              stroke-width="2.5"
              class="chart-line" />
            
            <!-- Points Vues -->
            <circle v-for="(point, index) in vuesData" :key="`vues-${index}`"
                    :cx="100 + index * 120" 
                    :cy="230 - point * 1.4" 
                    r="3.5" 
                    fill="#22c55e" />
            
            <!-- Ligne Achats (bleue) -->
            <polyline 
              :points="getLinePoints(achatsData, '#3b82f6')"
              fill="none" 
              stroke="#3b82f6" 
              stroke-width="2.5"
              class="chart-line" />
            
            <!-- Points Achats -->
            <circle v-for="(point, index) in achatsData" :key="`achats-${index}`"
                    :cx="100 + index * 120" 
                    :cy="230 - point * 1.4" 
                    r="3.5" 
                    fill="#3b82f6" />
            
            <!-- Ligne Bénéfice (rouge) -->
            <polyline 
              :points="getLinePoints(beneficeData, '#ef4444')"
              fill="none" 
              stroke="#ef4444" 
              stroke-width="2.5"
              class="chart-line" />
            
            <!-- Points Bénéfice -->
            <circle v-for="(point, index) in beneficeData" :key="`benefice-${index}`"
                    :cx="100 + index * 120" 
                    :cy="230 - point * 1.4" 
                    r="3.5" 
                    fill="#ef4444" />
          </svg>
        </div>
        
        <!-- Légende -->
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-dot green"></span>
            <span class="legend-label">Vues</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot blue"></span>
            <span class="legend-label">Achats</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot red"></span>
            <span class="legend-label">Bénéfice net</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  data() {
    return {
      selectedFormation: 'formation1',
      chartDates: ['14/04', '15/04', '16/04', '17/04', '18/04', '19/04', '20/04'],
      vuesData: [80, 40, 95, 100, 95, 100, 95],
      achatsData: [85, 45, 70, 90, 85, 95, 90],
      beneficeData: [90, 30, 75, 85, 80, 90, 85]
    }
  },
  methods: {
    getLinePoints(data, color) {
      return data.map((value, index) => {
        const x = 100 + index * 120
        const y = 230 - value * 1.4
        return `${x},${y}`
      }).join(' ')
    }
  }
}
</script>

<style scoped>
.statistics-page {
  padding: 1.75rem;
  max-height: 600px;
}

.statistics-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 1.75rem;
}

.page-title {
  font-size: 1.625rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.stat-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem;
  text-align: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-label {
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 0.625rem;
  font-weight: 500;
  line-height: 1.3;
}

.stat-value {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1f2937;
}

/* Chart Controls */
.chart-controls {
  margin-bottom: 2rem;
}

.formation-selector {
  display: inline-block;
}

.formation-dropdown {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  min-width: 150px;
  transition: all 0.2s ease;
}

.formation-dropdown:focus {
  outline: none;
  border-color: #7376FF;
  box-shadow: 0 0 0 3px rgba(115, 118, 255, 0.1);
}

.formation-dropdown:hover {
  border-color: #9ca3af;
}

/* Chart Container */
.chart-container {
  background: white;
  border-radius: 14px;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
}

.chart-area {
  margin-bottom: 1.25rem;
}

.chart-svg {
  width: 100%;
  height: 280px;
}

.axis-label {
  font-size: 11px;
  fill: #6b7280;
  font-weight: 500;
}

.chart-line {
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.5;
}

/* Legend */
.chart-legend {
  display: flex;
  justify-content: center;
  gap: 1.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.legend-dot.green {
  background-color: #22c55e;
}

.legend-dot.blue {
  background-color: #3b82f6;
}

.legend-dot.red {
  background-color: #ef4444;
}

.legend-label {
  font-size: 0.8125rem;
  color: #374151;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .statistics-page {
    padding: 1.25rem;
  }
  
  .statistics-container {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .chart-legend {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .chart-svg {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .chart-legend {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
}
</style>