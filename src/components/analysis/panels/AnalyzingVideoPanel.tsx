
import React from 'react';

const AnalyzingVideoPanel: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full animate-fade-in">
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', borderRadius: '0.5rem' }} className="aspect-video shadow-lg">
        <iframe 
          src="https://share.synthesia.io/embeds/videos/9081a83c-bb4a-4314-ae81-f3e227152744" 
          loading="lazy" 
          title="Synthesia video player - Boost Your AI Search Visibility: The Power of Updated Directories" 
          allowFullScreen 
          allow="encrypted-media; fullscreen;" 
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0, overflow: 'hidden' }}
        ></iframe>
      </div>
    </div>
  );
};

export default AnalyzingVideoPanel;
