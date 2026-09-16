import { useState, useEffect } from 'react';
import { useNotes } from '../hooks/useGlobalState';
import Sidebar from './Sidebar';
import Lienzo from './Lienzo';
import NoteModal from './NoteModal';
import UserPanel from './UserPanel';
import MetricsPanel from './MetricsPanel';

export default function Dashboard({ user, onLogout }) {
  const { notes, getNotes, addNote } = useNotes();
  const [page, setpage] = useState('notas');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      getNotes();
    }
    fetchData()
  }, [])

  const changePage = (value) => {
    if(value == 'usuarios' && user.role != 'admin'){
      return 0;
    }
    setpage(value)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        user={user}
        onOpenAddModal={() => setIsModalOpen(true)}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setpage={changePage}
        notesCount={notes.length}
        onLogout={onLogout}
      />

      {/* area principal */}
      {page == 'notas' && (
        <Lienzo
          onOpenAddModal={() => setIsModalOpen(true)}
          filterStatus={filterStatus}
        />
      )}
      {page == 'usuarios' && (
        <UserPanel
          user={user}
        ></UserPanel>
      )}
      {page == 'metricas' && (
        <MetricsPanel
          user={user}
          onGoToNotes={() => setpage('notas')}
        />
      )}

      {/* Modal emergente arrastrable para agregar notas */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addNote}
      />
    </div>
  );
}
