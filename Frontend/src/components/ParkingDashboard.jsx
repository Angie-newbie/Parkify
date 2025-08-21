import { useState, useEffect } from 'react';
import ParkingForm from '../components/ParkingForm';
import ParkingList from '../components/ParkingList';
import MapView from '../components/MapView';
import { parkingAPI } from '../services/api';

function Parking() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('form'); // 'form', 'list', 'map'

  // Fetch all notes
  const fetchAllNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await parkingAPI.getAllNotes();
      setNotes(data || []);
    } catch (err) {
      setError(`Failed to load parking notes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotes();
  }, []);

  // Form success
  const handleFormSuccess = (result) => {
    console.log('Form success:', result);
    setRefreshTrigger(prev => prev + 1);
    if (editingNote) setEditingNote(null);
    setActiveTab('list');
    fetchAllNotes();
  };

  // Edit & cancel
  const handleEdit = (note) => { setEditingNote(note); setActiveTab('form'); };
  const handleCancelEdit = () => setEditingNote(null);

  // Map selection
  const handleNoteSelect = (note) => { setSelectedNote(note); setActiveTab('map'); };

  // Tabs
  const renderTabNavigation = () => (
    <nav className="tab-navigation">
      <button className={`tab-button ${activeTab==='form'?'active':''}`} onClick={()=>setActiveTab('form')}>
        📝 {editingNote ? 'Edit Note' : 'Add Note'}
      </button>
      <button className={`tab-button ${activeTab==='list'?'active':''}`} onClick={()=>setActiveTab('list')}>
        📋 My Notes ({notes.length})
      </button>
      <button className={`tab-button ${activeTab==='map'?'active':''}`} onClick={()=>setActiveTab('map')}>
        🗺️ Map View
      </button>
    </nav>
  );

  const renderContent = () => {
    if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Loading parking notes...</p></div>;
    if (error) return (
      <div className="error-container">
        <h3>❌ Error</h3>
        <p>{error}</p>
        <button onClick={fetchAllNotes} className="btn btn-primary">🔄 Retry</button>
      </div>
    );

    switch (activeTab) {
      case 'form': return <ParkingForm editingNote={editingNote} onSuccess={handleFormSuccess} onCancel={handleCancelEdit} />;
      case 'list': return <ParkingList onEdit={handleEdit} refreshTrigger={refreshTrigger} />;
      case 'map': return <MapView notes={notes} selectedNote={selectedNote} />;
      default: return <div>Unknown tab</div>;
    }
  };

  return (
    <div>
      {renderTabNavigation()}
      {renderContent()}
    </div>
  );
}

export default Parking;
