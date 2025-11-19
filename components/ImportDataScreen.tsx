
// components/ImportDataScreen.tsx
import React, { useState, useRef } from 'react';
import SectionHeader from './SectionHeader.tsx';

interface ImportDataScreenProps {
  onImport: (type: string, data: any[]) => void;
}

const ImportDataScreen: React.FC<ImportDataScreenProps> = ({ onImport }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [importType, setImportType] = useState('pokemon');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImportData = (parsedData: any) => {
      if (!Array.isArray(parsedData)) {
         // Some JSON formats might be { "items": [...] }
         if (parsedData.items && Array.isArray(parsedData.items)) {
             onImport(importType, parsedData.items);
             return parsedData.items.length;
         } else if (parsedData.tms && Array.isArray(parsedData.tms)) {
             onImport(importType, parsedData.tms);
             return parsedData.tms.length;
         } else {
             throw new Error('O JSON deve ser um array [] ou um objeto contendo "items" ou "tms".');
         }
      } else {
        onImport(importType, parsedData);
        return parsedData.length;
      }
  };

  const handleManualImport = () => {
    try {
      if (!jsonInput.trim()) {
        setMessage({ text: 'Por favor, cole o JSON para importar.', type: 'error' });
        return;
      }
      const parsedData = JSON.parse(jsonInput);
      const count = processImportData(parsedData);
      setMessage({ text: `Sucesso! ${count} itens importados para ${importType}.`, type: 'success' });
      setJsonInput('');
    } catch (e: any) {
      setMessage({ text: e.message || 'Erro ao processar JSON. Verifique a sintaxe.', type: 'error' });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        try {
          const parsedData = JSON.parse(content);
          const count = processImportData(parsedData);
          setMessage({ text: `Arquivo carregado! ${count} itens importados para ${importType}.`, type: 'success' });
          // Clear input value to allow re-uploading same file if needed
          if (fileInputRef.current) fileInputRef.current.value = ''; 
        } catch (err: any) {
          setMessage({ text: 'Erro ao ler o arquivo: ' + (err.message || 'JSON inválido'), type: 'error' });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 pb-20 animate-fade-in">
      <SectionHeader title="Importar Dados" />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        <p className="text-sm text-gray-600">
          Selecione o tipo de dado e carregue um arquivo JSON ou cole o texto manualmente.
        </p>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Tipo de Dado</label>
          <select
            value={importType}
            onChange={(e) => setImportType(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
          >
            <option value="pokemon">Pokémons (Pokedex)</option>
            <option value="moves">Golpes (Movedex)</option>
            <option value="items">Itens (Itemdex)</option>
            <option value="abilities">Habilidades</option>
            <option value="conditions">Condições</option>
            <option value="tms">TMs</option>
          </select>
        </div>

        {/* File Upload Section */}
        <div className="border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer relative">
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center py-6 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="font-bold text-sm">Toque para enviar arquivo JSON</span>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <div className="h-px bg-gray-200 flex-grow"></div>
            <span className="text-xs text-gray-400 font-bold uppercase">OU COLE O TEXTO</span>
            <div className="h-px bg-gray-200 flex-grow"></div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Colar JSON Manualmente</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[ { "id": "novo-mon", "name": "NovoMon", ... } ]'
            className="w-full h-32 p-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleManualImport}
          disabled={!jsonInput.trim()}
          className="w-full py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Importar Texto
        </button>
      </div>
    </div>
  );
};

export default ImportDataScreen;
