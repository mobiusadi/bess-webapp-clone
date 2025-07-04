import React from 'react';

// Helper function to format the keys nicely
const formatKey = (key) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

function ResourceLinkParser({ resourceKey, resourceString }) {
  // Regular Expression to find things in the format https://www.merriam-webster.com/dictionary/title
  const linkRegex = /\[(https?:\/\/[^\]]+)\s([^\]]+)\]/g;
  
  // Split the main string by the <br> tag to get individual link strings
  const resourceParts = resourceString.split(/<br\s*\/?>/i);

  return (
    <div>
      <strong>{formatKey(resourceKey)}:</strong>
      <ul style={{ margin: '0.5rem 0', paddingLeft: '20px' }}>
        {resourceParts.map((part, index) => {
          // We need to reset the regex index for each part
          linkRegex.lastIndex = 0;
          const match = linkRegex.exec(part);
          
          if (match) {
            const url = match[1]; // The first captured group is the URL
            const title = match[2]; // The second captured group is the Title
            return (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}

export default ResourceLinkParser;