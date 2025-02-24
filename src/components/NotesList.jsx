import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, X } from 'lucide-react';

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
        <h2 className="text-2xl font-bold text-gray-800">Notes</h2>
        <button
          onClick={() => {
            setEditingNote(null);
            setNoteForm({ title: '', content: '' });
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Note'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-800">{note.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="text-gray-600 hover:text-blue-500"
                    disabled={isSubmitting}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-gray-600 hover:text-red-500"
                    disabled={isSubmitting}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-2">{note.content}</p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between">
              <h3 className="text-xl font-bold mb-4">
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </h3>
              <X
                onClick={() => setIsModalOpen(false)}
                className="w-6 h-6 text-gray-500 cursor-pointer"
                disabled={isSubmitting}
              />
            </div>
            
            <form onSubmit={handleSaveNote}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Content
                </label>
                <textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (editingNote ? 'Saving...' : 'Adding...') 
                    : (editingNote ? 'Save' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesList;
