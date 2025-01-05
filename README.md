# GenChart

GenChart is an AI-powered flowchart generation tool that creates real-time visual representations of conversations using Mermaid.js diagrams.

## Project Overview

GenChart enables users to:
- Chat naturally with an AI assistant
- See their conversation visualized as a flowchart in real-time
- Interact with expandable/collapsible nodes for detailed information
- Maintain a visual history of the conversation
- Export and share generated flowcharts

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **AI**: GPT-4-turbo via OpenAI API
- **Visualization**: Mermaid.js
- **Authentication**: Supabase Auth

## Project Structure
bash
genchart/
├── app/ # Next.js app directory
│ ├── api/ # API routes
│ ├── chat/ # Chat interface
│ └── test-mermaid/ # Mermaid testing page
├── components/ # React components
│ ├── test-chat.tsx # Chat interface component
│ └── mermaid-viewer.tsx # Mermaid diagram renderer
├── utils/
│ ├── ai/ # AI-related utilities
│ └── supabase/ # Supabase configuration


## Database Schema

### Conversations Table
| Column      | Type      | Description                    |
|------------|-----------|--------------------------------|
| id         | uuid      | Primary key                    |
| user_id    | uuid      | References auth.users(id)      |
| title      | text      | Conversation title             |
| created_at | timestamp | Creation timestamp (UTC)       |
| updated_at | timestamp | Last update timestamp (UTC)    |
| is_archived| boolean   | Soft deletion flag             |

### Messages Table
| Column           | Type      | Description                           |
|-----------------|-----------|---------------------------------------|
| id              | uuid      | Primary key                           |
| conversation_id | uuid      | References conversations(id)          |
| content         | text      | Message content                       |
| role            | text      | Either 'user' or 'assistant'         |
| flowchart_data  | text      | Mermaid markdown for flowchart       |
| created_at      | timestamp | Creation timestamp (UTC)              |
| tokens_used     | integer   | OpenAI token usage tracking          |
| error           | text      | Error message if AI processing failed |

## Development Setup

1. Clone the repository
2. Install dependencies:


## Current Status

- [x] Basic project setup
- [x] Database schema implementation
- [x] AI integration with GPT-4
- [] Basic chat interface
- [ ] Mermaid viewer component
- [ ] Real-time flowchart updates
- [ ] Interactive node expansion
- [ ] Flowchart persistence
- [ ] UI/UX improvements

## Development Log

See [DEVELOPMENT_LOG.md](./development_log.md) for detailed progress tracking and implementation notes.

## Testing

### Test Routes
- `/test-mermaid`: Test the Mermaid.js renderer with static diagrams
- `/chat`: Test the chat interface with AI integration

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

## Setup and Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

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

## Acknowledgments
- Thanks to the Claude AI team for their powerful API
- Mermaid.js community for the excellent diagramming tool
- Next.js team for the robust framework
- All contributors who helped debug and improve the project

