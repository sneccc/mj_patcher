# MJ Patcher

A Tampermonkey userscript for managing and submitting prompts to Midjourney. This tool provides a user-friendly interface for submitting multiple prompts, managing queues, and automating the prompt submission process.

## Features

- **Prompt Management**: Submit multiple prompts at once with variable substitution
- **Queue System**: Automatically manage and process a queue of prompts
- **Auto-Detection**: Automatically detect user ID and channel ID from network requests
- **Settings Management**: Save and load user settings including tokens and parameters
- **Random Delay**: Add random delays between prompt submissions to avoid rate limiting
- **Pre-built Prompt Collections**: Quick access to curated collections of prompts for:
  - Landscapes
  - Characters
  - Everyday Objects
  - Validation Tests

## Installation

1. Install Tampermonkey in your browser
2. Create a new script
3. Copy the contents of `main.js` into the script editor
4. Update the `@require` URLs to point to your GitHub repository
5. Save the script

## Usage

1. Visit Midjourney's website
2. The MJ Patcher interface will appear in the top-right corner
3. Configure your settings in the Settings tab:
   - Paste your Midjourney cookie/token
   - Enter your channel ID (or use auto-detect)
   - Set default parameters and delays
4. Use the Prompts tab to:
   - Enter custom prompts
   - Use pre-built prompt collections
   - Monitor the queue status
   - Process or clear the queue

## File Structure

- `main.js`: Main script file with userscript metadata and initialization
- `utils.js`: Utility functions for string manipulation and prompt processing
- `api.js`: API interaction functions and network monitoring
- `queue.js`: Queue management and processing logic
- `ui.js`: User interface components and styling

## Development

To modify or extend the script:

1. Clone the repository
2. Make changes to the source files
3. Update the `@require` URLs in `main.js` to point to your repository
4. Test the changes locally
5. Push to GitHub

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 