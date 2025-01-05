# GenChart Development Log

## Project Vision
GenChart is an AI-powered flowchart generation tool that:
- Creates real-time flowcharts while chatting with AI
- Maintains a visual representation of the conversation
- Uses interactive and expandable flowcharts
- Updates the visualization as the conversation progresses

## Current Implementation

### Core Components
1. **Chat System** (Reference: `genchart/utils/ai/chat.ts`)
   - Implemented GPT-4 Turbo integration
   - Added system prompt for flowchart generation
   - Set up message handling with flowchart extraction

2. **API Routes** (Reference: `genchart/app/api/test-gpt/route.ts`)
   - Created test endpoints for both GET and POST requests
   - Implemented conversation history handling

### Database Schema
The database structure is defined in `genchart/utils/supabase/schema.md` and includes:
- Conversations table for chat sessions
- Messages table for individual messages and flowcharts

### Latest System Prompt
We've refined the system prompt to:
- Generate natural conversational responses
- Create interactive flowcharts with expandable nodes
- Maintain context across the conversation
- Use Mermaid markdown for visualization

## Testing Progress
- Successfully tested initial flowchart generation
- Verified Mermaid markdown formatting
- Tested interactive elements in flowcharts

## Next Steps
1. **Frontend Development**
   - Create chat interface
   - Implement Mermaid renderer
   - Add interactive flowchart display

2. **Features to Implement**
   - Real-time flowchart updates
   - Expandable/collapsible nodes
   - Conversation history visualization
   - Flowchart persistence

3. **Testing Needed**
   - Long conversation handling
   - Complex flowchart interactions
   - Performance optimization

## Technical Notes
- Using GPT-4-turbo-preview model
- Mermaid.js for flowchart rendering
- Next.js 14 for frontend
- Supabase for database

## Current Challenges
- Ensuring consistent flowchart formatting
- Managing state between conversation turns
- Optimizing prompt for interactive elements

## Resources
- [Mermaid Live Editor](https://mermaid.live/) for testing flowcharts
- Current test endpoint: `/api/test-gpt`