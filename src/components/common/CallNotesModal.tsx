import React, { useState, useEffect } from 'react';
import { Loader2, MessageSquare, Clock, Trash2, AlertTriangle } from 'lucide-react';
import apiClient from '../../services/apiClient';

interface CallNotesModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface CallNote {
  id?: number;
  note_details: string;
  created_at?: string;
  [key: string]: any;
}

const CallNotesModal: React.FC<CallNotesModalProps> = ({ userId, isOpen, onClose }) => {
  const [noteDetails, setNoteDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [notes, setNotes] = useState<CallNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [notesError, setNotesError] = useState('');
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  const fetchNotes = async () => {
    setIsLoadingNotes(true);
    setNotesError('');
    try {
      const response = await apiClient.get(`v1/admin/call-notes/user/${userId}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      if (response.data.success || response.status === 200) {
        // the api might return data in response.data.data
        setNotes(response.data.data || []);
      } else {
        setNotesError(response.data.message || 'Failed to load notes');
      }
    } catch (err: any) {
      console.error('Error fetching notes:', err);
      setNotesError(err.response?.data?.message || err.message || 'An error occurred while fetching notes');
    } finally {
      setIsLoadingNotes(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchNotes();
      setNoteDetails('');
      setError('');
      setSuccess('');
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteDetails.trim()) {
      setError('Note details cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.post('v1/admin/call-notes', {
        users_id: userId,
        note_details: noteDetails.trim()
      }, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });

      if (response.data.success || response.status === 200 || response.status === 201) {
        setSuccess('Call note added successfully');
        setNoteDetails('');
        // Refresh notes list instead of auto-closing
        await fetchNotes();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Failed to add call note');
      }
    } catch (err: any) {
      console.error('Error adding call note:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (noteId: number) => {
    setNoteToDelete(noteId);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    setDeletingNoteId(noteToDelete);
    setError('');
    
    try {
      const response = await apiClient.delete(`v1/admin/call-notes/${noteToDelete}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      if (response.data.success || response.status === 200) {
        setSuccess('Call note deleted successfully');
        await fetchNotes();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Failed to delete call note');
      }
    } catch (err: any) {
      console.error('Error deleting call note:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while deleting');
    } finally {
      setDeletingNoteId(null);
      setNoteToDelete(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Call Notes</h2>
              <p className="text-xs text-gray-500">User ID: {userId}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Add Note Form */}
          <form onSubmit={handleSubmit} className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Note <span className="text-red-500">*</span>
              </label>
              <textarea
                value={noteDetails}
                onChange={(e) => setNoteDetails(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                placeholder="Type your call note here..."
                disabled={isSubmitting}
              />
            </div>
            
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </form>

          {/* Previous Notes Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Previous Notes</h3>
            
            {isLoadingNotes ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : notesError ? (
              <p className="text-sm text-red-500 py-4 text-center">{notesError}</p>
            ) : notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <div key={note.id || index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap pr-8">{note.note_details}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {note.created_at ? new Date(note.created_at).toLocaleString() : 'N/A'}
                      </div>
                      {note.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(note.id!)}
                          disabled={deletingNoteId === note.id}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                          title="Delete Note"
                        >
                          {deletingNoteId === note.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500">No previous call notes found.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete Call Note</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
            </div>
            <div className="flex px-6 py-4 bg-gray-50 gap-3 justify-end">
              <button
                type="button"
                onClick={() => setNoteToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
                disabled={deletingNoteId !== null}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingNoteId !== null}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none disabled:opacity-50 flex items-center gap-2"
              >
                {deletingNoteId !== null ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallNotesModal;
