import { useState } from 'react';
import { Header } from './components/Header/Header';
import { KpiRow } from './components/KpiRow/KpiRow';
import { NewPersonModal } from './components/NewPersonModal/NewPersonModal';
import { PeopleSection } from './components/PeopleSection/PeopleSection';
import { QuickAddPanel } from './components/QuickAddPanel/QuickAddPanel';
import { RecentActivityPanel } from './components/RecentActivityPanel/RecentActivityPanel';
import { useDashboard } from './hooks/useDashboard';
import styles from './App.module.css';

function App() {
  const {
    loading,
    loadError,
    people,
    hasPeople,
    grandTotalRevenues,
    grandTotalExpenses,
    grandTotalBalance,
    recentActivity,
    addPerson,
    addTransaction,
  } = useDashboard();

  const [personModalOpen, setPersonModalOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {personModalOpen && (
          <NewPersonModal
            open={personModalOpen}
            onClose={() => setPersonModalOpen(false)}
            onSubmit={async (name, age) => {
              await addPerson(name, age);
              setPersonModalOpen(false);
            }}
          />
        )}

        <Header />

        <div className={styles.content}>
          {loading ? (
            <div className={styles.status}>Carregando…</div>
          ) : loadError ? (
            <div className={styles.status}>{loadError}</div>
          ) : (
            <>
              <KpiRow
                grandTotalRevenues={grandTotalRevenues}
                grandTotalExpenses={grandTotalExpenses}
                grandTotalBalance={grandTotalBalance}
              />

              <div className={styles.mainGrid}>
                <PeopleSection
                  people={people}
                  hasPeople={hasPeople}
                  onAddPerson={() => setPersonModalOpen(true)}
                />

                <div className={styles.sidePanel}>
                  <QuickAddPanel people={people} onSubmit={addTransaction} />
                  <RecentActivityPanel items={recentActivity} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
