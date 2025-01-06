# GenChart

GenChart is an AI-powered flowchart generation tool that creates real-time visual representations of conversations using Mermaid.js diagrams.

## Project Overview

GenChart enables users to:
- Chat naturally with an AI assistant
- See their conversation visualized as a flowchart in real-time
- Maintain a visual history of the conversation
- Export and share generated flowcharts

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **AI**: GPT-4-turbo via OpenAI API
- **Visualization**: Mermaid.js
- **Authentication**: Supabase Auth


### Current Status
- ✅ Basic project setup
- ✅ Database schema implementation
- ✅ AI integration with GPT-4-turbo
- ✅ Basic chat interface
- ✅ Mermaid viewer component
- ✅ Real-time flowchart updates
- ✅ Interactive node expansion
- ✅ Flowchart persistence

### In Development
- [ ] Export functionality
- [ ] Collaborative features
- [ ] Advanced customization options
- [ ] Mobile responsiveness improvements
- [ ] Performance optimizations

## Contributing

This project is currently in development. Feel free to open issues or submit pull requests.

## License

MIT License - See [LICENSE](./LICENSE) for details

## Recent Updates
### Version 1.0.0 (Current)
- ✅ Fixed flowchart rendering issues
- ✅ Implemented zoom and pan controls
- ✅ Resolved message display problems
- ✅ Improved node text formatting
- ✅ Enhanced error handling
- ✅ Added proper data extraction from AI responses

### Known Issues
- Node text might get cut off with very long labels
- Sizing needs further optimization for different screen sizes
- Some complex diagrams might need simplified rendering

## Usage
1. Navigate to the application
2. Log in using Supabase authentication
3. Start a conversation by describing what you want to visualize
4. The AI will generate a flowchart based on your description
5. Use the zoom and pan controls to interact with the diagram

## Future Improvements
- [ ] Implement caching for similar prompts
- [ ] Add more diagram types support
- [ ] Improve mobile responsiveness
- [ ] Add export functionality
- [ ] Implement collaborative features
- [ ] Add more customization options for diagrams

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

