chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract") {
    // Define your XPath expressions here
    const xpaths = {
      xpathtest: '/html/body/div[2]/div[2]/div[1]/ul/li[1]',  // Example XPath
      //price: '//span[@class="price"]',        // Example XPath
      //description: '//div[@class="description"]' // Example XPath
    };

    try {
      const data = {};
      for (const [key, xpath] of Object.entries(xpaths)) {
        const result = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        
        const element = result.singleNodeValue;
        
        if (!element) {
          throw new Error(`Element not found for "${key}" using XPath: ${xpath}`);
        }
        
        data[key] = element.textContent.trim();
      }
      
      sendResponse({ success: true, data });
    } catch (error) {
      sendResponse({ 
        success: false, 
        error: `${error.name}: ${error.message}`
      });
    }
  }
  return true;
});