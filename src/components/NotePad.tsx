
import { useState, useEffect } from 'react';
import { Save, Edit3 } from 'lucide-react';
import { useStore } from '../store/useStore';

const NotePad = () => {
  const { notes, selectedDate, addNote, updateNote } = useStore();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const todayNote = notes.find(note => note.date === selectedDate);

  useEffect(() => {
    setContent(todayNote?.content || '');
    setIsEditing(false);
  }, [todayNote, selectedDate]);

  const handleSave = () => {
    if (todayNote) {
      updateNote(todayNote.id, content);
    } else {
      addNote({
        content,
        date: selectedDate,
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Notas Diárias</h2>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(selectedDate)}
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit3 className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Salvar</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite suas notas, ideias ou reflexões do dia..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            autoFocus
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setContent(todayNote?.content || '');
                setIsEditing(false);
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-[200px]">
          {content ? (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                {content}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Edit3 className="h-12 w-12 mb-4" />
              <p className="text-center">
                Clique no botão de editar para adicionar suas notas do dia
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotePad;
