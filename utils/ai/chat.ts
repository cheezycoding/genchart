import { openai, defaultConfig } from './config';

export async function generateResponse(userMessage: string, conversationHistory: any[] = []) {
  try {
    const messages = [
      {
        role: "system",
        content: `You are a conversational AI that maintains a visual summary of the discussion.
        
        Respond naturally to all messages, but always include a Mermaid flowchart that:
        1. Use basic flowchart syntax (flowchart TD or LR)
        2. Keep the structure simple with main nodes and connections
        3. Avoid complex features like subgraphs, callbacks, or click events
        4. Use simple shapes ([] for process, () for start/end, {} for decisions)
        5. Keep node text concise
        6. Limit to 10-15 nodes maximum
        
        Format all flowchart data between [FLOWCHART] tags.
        
        Think of yourself as someone having a conversation while maintaining 
        a living, evolving mindmap/flowchart on a whiteboard next to you.
        
        The flowchart should:
        - Start simple and expand as the conversation grows
        - Use subgraphs to organize related information
        - Make complex topics more digestible through hierarchical organization
        - Be clear and easy to follow
        - Include interactive elements when there are details to explore`
      },
      // Convert history to OpenAI message format
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.flowchart_data 
          ? `${msg.content}\n[FLOWCHART]${msg.flowchart_data}[/FLOWCHART]`
          : msg.content
      })),
      // Add current user message
      {
        role: "user",
        content: userMessage
      }
    ];

    const completion = await openai.chat.completions.create({
      ...defaultConfig,
      messages,
    });

    const response = completion.choices[0].message.content || '';
    
    // Extract flowchart data if present
    const flowchartMatch = response.match(/\[FLOWCHART\]([\s\S]*?)\[\/FLOWCHART\]/);
    const flowchart_data = flowchartMatch ? flowchartMatch[1].trim() : undefined;
    
    // Remove flowchart data from content
    const content = response.replace(/\[FLOWCHART\][\s\S]*?\[\/FLOWCHART\]/, '').trim();

    return { content, flowchart_data };
  } catch (error: any) {
    console.error('Error generating response:', error);
    throw error;
  }
}