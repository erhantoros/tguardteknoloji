import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { MessageCircle, Clock, CheckCircle, AlertCircle, Search, Filter, Trash2, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ContactForm } from '../../../types';

interface ContactFormWithNotes extends ContactForm {
  notes?: string[];
}

interface EditingNote {
  index: number;
  value: string;
}

function ContactRequests() {
  const [requests, setRequests] = useState<ContactFormWithNotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ContactFormWithNotes | null>(null);
  const [editingNote, setEditingNote] = useState<EditingNote | null>(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      toast.error('Talepler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'contacted' | 'completed') => {
    try {
      const { error } = await supabase
        .from('contact_forms')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Durum güncellendi');
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Durum güncellenirken bir hata oluştu');
    }
  };

  const addNote = async () => {
    if (!selectedRequest || !newNote.trim()) return;

    try {
      const notes = [...(selectedRequest.notes || []), newNote.trim()];

      const { error } = await supabase
        .from('contact_forms')
        .update({ notes })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast.success('Not eklendi');
      setNewNote('');
      fetchRequests();
      setSelectedRequest(prev => prev ? { ...prev, notes } : null);
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Not eklenirken bir hata oluştu');
    }
  };

  const updateNote = async (index: number, newValue: string) => {
    if (!selectedRequest) return;

    try {
      const notes = [...(selectedRequest.notes || [])];
      notes[index] = newValue.trim();

      const { error } = await supabase
        .from('contact_forms')
        .update({ notes })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast.success('Not güncellendi');
      setEditingNote(null);
      fetchRequests();
      setSelectedRequest(prev => prev ? { ...prev, notes } : null);
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Not güncellenirken bir hata oluştu');
    }
  };

  const deleteNote = async (index: number) => {
    if (!selectedRequest) return;

    try {
      const notes = selectedRequest.notes?.filter((_, i) => i !== index) || [];

      const { error } = await supabase
        .from('contact_forms')
        .update({ notes })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast.success('Not silindi');
      fetchRequests();
      setSelectedRequest(prev => prev ? { ...prev, notes } : null);
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Not silinirken bir hata oluştu');
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Bu talebi silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('contact_forms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Talep silindi');
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
      }
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Talep silinirken bir hata oluştu');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">İletişim Talepleri</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Talepler Listesi */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad Soyad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hizmet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500" colSpan={6}>
                        Yükleniyor...
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500" colSpan={6}>
                        Henüz iletişim talebi bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    requests.map((request) => (
                      <tr 
                        key={request.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedRequest?.id === request.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedRequest(request)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {request.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{request.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{request.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {request.service_type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={request.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateStatus(request.id, e.target.value as 'pending' | 'contacted' | 'completed');
                            }}
                            className="text-sm text-gray-500 border rounded p-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="pending">Beklemede</option>
                            <option value="contacted">İletişime Geçildi</option>
                            <option value="completed">Tamamlandı</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRequest(request.id);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detay Paneli */}
        <div>
          {selectedRequest ? (
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Talep Detayı</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Ad Soyad
                    </label>
                    <p className="mt-1 text-white">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Email
                    </label>
                    <p className="mt-1 text-white">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Telefon
                    </label>
                    <p className="mt-1 text-white">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Hizmet
                    </label>
                    <p className="mt-1 text-white">{selectedRequest.service_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Mesaj
                    </label>
                    <p className="mt-1 text-white whitespace-pre-wrap">{selectedRequest.message}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Tarih
                    </label>
                    <p className="mt-1 text-white">
                      {new Date(selectedRequest.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notlar Bölümü */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Notlar</label>
                <div className="space-y-2">
                  {selectedRequest.notes?.map((note, index) => (
                    <div 
                      key={index} 
                      className="group flex items-start gap-2 p-2 bg-gray-700 rounded-lg text-white"
                    >
                      {editingNote?.index === index ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editingNote.value}
                            onChange={(e) => setEditingNote({ index, value: e.target.value })}
                            className="flex-1 px-2 py-1 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:border-blue-500"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateNote(index, editingNote.value)}
                              disabled={!editingNote.value.trim()}
                              className="p-1 text-green-400 hover:bg-green-400/10 rounded"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingNote(null)}
                              className="p-1 text-gray-400 hover:bg-gray-600 rounded"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1">{note}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingNote({ index, value: note })}
                              className="p-1 text-blue-400 hover:bg-blue-400/10 rounded"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteNote(index)}
                              className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Yeni not ekle..."
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
              Detayları görüntülemek için bir talep seçin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactRequests;