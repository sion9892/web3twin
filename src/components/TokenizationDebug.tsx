import React, { useState } from 'react';
import { debugTokenization } from '../lib/similarity';

export default function TokenizationDebug() {
  const [text, setText] = useState('Just wanted to say gm to all my friends! Your support means everything to me. This is just amazing work!');
  const [result, setResult] = useState<{ kept: string[], filtered: string[] } | null>(null);

  const handleAnalyze = () => {
    const analysis = debugTokenization(text);
    setResult(analysis);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🔍 Tokenization Debug Tool</h2>
      <p>Enter text to see which words are kept vs filtered out:</p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: '100%',
          height: '100px',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px'
        }}
        placeholder="Enter text to analyze..."
      />
      
      <button
        onClick={handleAnalyze}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Analyze Text
      </button>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ color: '#28a745' }}>✅ Kept Words ({result.kept.length})</h3>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '4px',
                minHeight: '100px',
                border: '1px solid #28a745'
              }}>
                {result.kept.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {result.kept.map((word, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No words kept</p>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ color: '#dc3545' }}>❌ Filtered Words ({result.filtered.length})</h3>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '4px',
                minHeight: '100px',
                border: '1px solid #dc3545'
              }}>
                {result.filtered.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {result.filtered.map((word, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No words filtered</p>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
            <h4>📊 Analysis Summary</h4>
            <ul>
              <li><strong>Total words:</strong> {result.kept.length + result.filtered.length}</li>
              <li><strong>Words kept:</strong> {result.kept.length} ({Math.round((result.kept.length / (result.kept.length + result.filtered.length)) * 100)}%)</li>
              <li><strong>Words filtered:</strong> {result.filtered.length} ({Math.round((result.filtered.length / (result.kept.length + result.filtered.length)) * 100)}%)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
