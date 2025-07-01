<template>
  <div class="transactions-page">
    <div class="transactions-container">
      <div class="page-header">
        <h1 class="page-title">Transactions</h1>
      </div>

      <!-- Filtres -->
      <div class="filters-section">
        <div class="filter-tabs">
          <button 
            :class="['filter-tab', { active: activeFilter === 'tout' }]"
            @click="setActiveFilter('tout')"
          >
            Tout
          </button>
          <button 
            :class="['filter-tab', { active: activeFilter === 'achat' }]"
            @click="setActiveFilter('achat')"
          >
            Achat
          </button>
          <button 
            :class="['filter-tab', { active: activeFilter === 'retrait' }]"
            @click="setActiveFilter('retrait')"
          >
            Retrait
          </button>
        </div>
      </div>

      <!-- Liste des transactions -->
      <div class="transactions-list">
        <div 
          v-for="transaction in filteredTransactions" 
          :key="transaction.id"
          class="transaction-item"
        >
          <div class="transaction-info">
            <div class="transaction-amount">
              <span class="amount">{{ transaction.amount }}</span>
              <span class="type">{{ transaction.type }}</span>
            </div>
            <div class="transaction-date">
              Date: {{ transaction.date }}
            </div>
          </div>
          <div class="transaction-status">
            <span :class="['status-badge', transaction.status.toLowerCase()]">
              {{ transaction.status }}
            </span>
          </div>
          <div class="transaction-action">
            <button class="action-btn" @click="viewTransaction(transaction)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-if="filteredTransactions.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#9ca3af" stroke-width="2"/>
            <path d="M9 12L11 14L15 10" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="empty-message">Aucune transaction pour le moment</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Transactions',
  data() {
    return {
      activeFilter: 'tout',
      transactions: [
        {
          id: 1,
          amount: '25.36€',
          type: 'Achat',
          date: '27/01/2025 16:10:31',
          status: 'Confirmé'
        },
        {
          id: 2,
          amount: '25.36€',
          type: 'Achat',
          date: '24/01/2025 13:22:12',
          status: 'Confirmé'
        }
      ]
    }
  },
  computed: {
    filteredTransactions() {
      if (this.activeFilter === 'tout') {
        return this.transactions
      }
      return this.transactions.filter(transaction => 
        transaction.type.toLowerCase() === this.activeFilter
      )
    }
  },
  methods: {
    setActiveFilter(filter) {
      this.activeFilter = filter
    },
    viewTransaction(transaction) {
      console.log('Voir transaction:', transaction)
      // Logique pour voir les détails de la transaction
    }
  }
}
</script>

<style scoped>
.transactions-page {
  padding: 1.75rem;
}

.transactions-container {
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

/* Filtres */
.filters-section {
  margin-bottom: 1.75rem;
}

.filter-tabs {
  display: flex;
  gap: 0;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 4px;
  width: fit-content;
}

.filter-tab {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.filter-tab:hover {
  color: #374151;
}

.filter-tab.active {
  background: #7376FF;
  color: white;
  box-shadow: 0 2px 4px rgba(115, 118, 255, 0.3);
}

/* Liste des transactions */
.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.transaction-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.transaction-info {
  flex: 1;
}

.transaction-amount {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.type {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.transaction-date {
  font-size: 0.8125rem;
  color: #9ca3af;
}

.transaction-status {
  margin: 0 1.5rem;
}

.status-badge {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.status-badge.confirmé {
  background: #dcfce7;
  color: #166534;
}

.status-badge.en-attente {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.échoué {
  background: #fee2e2;
  color: #dc2626;
}

.transaction-action {
  margin-left: auto;
}

.action-btn {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

/* État vide */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.empty-icon svg {
  opacity: 0.6;
}

.empty-message {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .transactions-page {
    padding: 1.25rem;
  }
  
  .transactions-container {
    padding: 1rem;
  }
  
  .filter-tabs {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-tab {
    flex: 1;
    min-width: auto;
  }
  
  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .transaction-status {
    margin: 0;
    align-self: flex-start;
  }
  
  .transaction-action {
    margin-left: 0;
    align-self: flex-end;
    margin-top: -2rem;
  }
}

@media (max-width: 480px) {
  .transaction-amount {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .filter-tab {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }
}
</style>