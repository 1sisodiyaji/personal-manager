import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteCard from './notes/NoteCard';
import NoteForm from './notes/NoteForm';

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingNote) {
        await axios.patch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/notes/${editingNote._id}`, noteForm);
      } else {
        await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/notes`, noteForm);
      }
      fetchNotes();
      setIsModalOpen(false);
      setNoteForm({ title: '', content: '' });
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteForm({ title: note.title, content: note.content });
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (id) => {
    setIsSubmitting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}/api/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Notes</h2>
        <button
          onClick={() => {
            setEditingNote(null);
            setNoteForm({ title: '', content: '' });
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Note'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}

      <NoteForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
          setNoteForm({ title: '', content: '' });
        }}
        onSubmit={handleSaveNote}
        noteForm={noteForm}
        setNoteForm={setNoteForm}
        isSubmitting={isSubmitting}
        editingNote={editingNote}
      />
    </div>
  );
};

export default NotesList;
