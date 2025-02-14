let extractedData = null;

function createEditableFields(data) {
  let html = '<div class="field">';
  for (const [key, value] of Object.entries(data)) {
    html += `
      <div class="field-group">
        <label class="field-label" for="${key}">${key}:</label>
        <input 
          type="text" 
          id="${key}" 
          class="field-input" 
          value="${value.replace(/"/g, '&quot;')}"
          data-original-key="${key}"
        >
      </div>
    `;
  }
  html += '</div>';
  return html;
}

function getEditedData() {
  const data = {};
  const inputs = document.querySelectorAll('.field-input');
  inputs.forEach(input => {
    const key = input.dataset.originalKey;
    data[key] = input.value.trim();
  });
  return data;
}

document.getElementById('extract').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const copyButton = document.getElementById('copy');
  const dataDiv = document.getElementById('extractedData');
  
  chrome.tabs.sendMessage(tab.id, { action: "extract" }, (response) => {
    if (response.success) {
      extractedData = response.data;
      dataDiv.innerHTML = createEditableFields(response.data);
      copyButton.disabled = false;
      
      // Add input event listeners to enable/disable copy button based on content
      document.querySelectorAll('.field-input').forEach(input => {
        input.addEventListener('input', () => {
          copyButton.disabled = Array.from(document.querySelectorAll('.field-input'))
            .some(input => !input.value.trim());
        });
      });
    } else {
      dataDiv.innerHTML = `<div class="error">
        <strong>Error:</strong><br>${response.error}
      </div>`;
      copyButton.disabled = true;
      extractedData = null;
    }
  });
});

document.getElementById('copy').addEventListener('click', async () => {
  if (!extractedData) return;
  
  const currentData = getEditedData();
  
  try {
    // Format the data as a pretty-printed JSON string
    const jsonData = JSON.stringify(currentData, null, 2);
    await navigator.clipboard.writeText(jsonData);
    
    const copyButton = document.getElementById('copy');
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    
    // Add error feedback to the UI
    const dataDiv = document.getElementById('extractedData');
    dataDiv.insertAdjacentHTML('beforeend', `
      <div class="error">
        <strong>Copy Error:</strong><br>${err.message}
      </div>
    `);
  }
});