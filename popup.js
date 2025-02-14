let extractedData = null;

document.getElementById('extract').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const copyButton = document.getElementById('copy');
  const dataDiv = document.getElementById('extractedData');
  
  chrome.tabs.sendMessage(tab.id, { action: "extract" }, (response) => {
    if (response.success) {
      extractedData = response.data;
      let html = '<div class="field">';
      for (const [key, value] of Object.entries(response.data)) {
        html += `<p><strong>${key}:</strong> ${value}</p>`;
      }
      html += '</div>';
      dataDiv.innerHTML = html;
      copyButton.disabled = false;
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
  
  const textData = Object.entries(extractedData)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
    
  try {
    await navigator.clipboard.writeText(textData);
    const copyButton = document.getElementById('copy');
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
});