# Readme.md

This extension includes several components:

- manifest.json: Defines the extension metadata and permissions
- popup.html: Creates a simple UI for the extension
- popup.js: Handles the popup interface logic
- content.js: Contains the actual data extraction logic

## To use this extension:

- Create a new directory and save all these files in it.
- In Chrome, go to chrome://extensions/
- Enable "Developer mode" in the top right
- Click "Load unpacked" and select your directory

The plugin will now be active.

To use it, go a webpage and click on it, then click "extract" to pull the data. Click on "copy to clipboard" to copy the data.

The data will be copied in prettified JSON formatting to make it easy to ingest elsewhere.

## To customize the data extraction:

The extractors used are xpaths. To find an xpath, go to the inspector tool and find the section of the code you want to target, then right click on it and go to Copy > Xpath.
Edit the selectors object in content.js to match the fields you want to extract.
Each key in the object will be the label for the extracted data
Each value should be a valid CSS selector for the element containing your data.