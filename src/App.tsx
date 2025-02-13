import React, { useState } from 'react';
import { Copy, Trash, ArrowRightLeft } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJSON = () => {
    try {
      let parsed;
      const trimmedInput = input.trim();
      
      // First try to parse the input directly
      try {
        parsed = JSON.parse(trimmedInput);
      } catch {
        // If direct parsing fails, try to parse it as an escaped string
        try {
          // Handle escaped JSON string by replacing escaped quotes
          const unescaped = trimmedInput.replace(/\\"/g, '"');
          // If the string starts and ends with quotes, remove them
          const cleaned = unescaped.replace(/^"(.*)"$/, '$1');
          parsed = JSON.parse(cleaned);
        } catch {
          // If both attempts fail, throw an error
          throw new Error('Invalid JSON format');
        }
      }
      
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err) {
      setError('Invalid JSON format');
      setOutput('');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">JSON Beautifier</h1>
          <p className="text-gray-600">Format JSON and parse strings to JSON with ease</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">Input</h2>
              <button
                onClick={clearAll}
                className="text-gray-500 hover:text-red-500 transition-colors"
                title="Clear all"
              >
                <Trash size={20} />
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[400px] p-3 border rounded-md font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste your JSON or string here..."
            />
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">Output</h2>
              <button
                onClick={copyToClipboard}
                className="text-gray-500 hover:text-blue-500 transition-colors"
                title="Copy to clipboard"
                disabled={!output}
              >
                <Copy size={20} />
              </button>
            </div>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                className={`w-full h-[400px] p-3 border rounded-md font-mono text-sm resize-none bg-gray-50 ${
                  error ? 'border-red-500' : ''
                }`}
                placeholder="Formatted JSON will appear here..."
              />
              {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-100 text-red-600 p-2 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={formatJSON}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowRightLeft size={20} />
            Format JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;