# GenChart Database Schema

## Tables

### conversations

Stores user conversations and their metadata.

| Column      | Type      | Description                    |
|------------|-----------|--------------------------------|
| id         | uuid      | Primary key                    |
| user_id    | uuid      | References auth.users(id)      |
| title      | text      | Conversation title             |
| created_at | timestamp | Creation timestamp (UTC)       |
| updated_at | timestamp | Last update timestamp (UTC)    |
| is_archived| boolean   | Soft deletion flag             |

### messages

Stores individual messages within conversations.

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

## Security

- Row Level Security (RLS) is enabled on both tables
- No RLS policies are defined as we're using server-side database access

## Relationships

- Each conversation belongs to one user (auth.users)
- Each message belongs to one conversation
- Messages are deleted when their parent conversation is deleted (ON DELETE CASCADE)