import { mastra } from '@/src/mastra';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const myAgent = mastra.getAgent('weatherAgent');
  const threadId = uuidv4();
  console.log('messages');
  console.log(messages);
  const newMessages = messages.at(-1);
  const stream = await myAgent.stream([newMessages], { threadId, resourceId: 'weatherAgent' });

  const memory = await myAgent.getMemory();
  console.log('memory');
  console.log(memory);
  if (memory) {
    const threads = await memory?.getThreadsByResourceId({ resourceId: 'weatherAgent' });
    console.log('threads');
    console.log(threads);
    const threadbyid = await threads?.map(async thread => {
      console.log('threadbyid');
      const { messages, uiMessages } = await memory.query({
        threadId: thread.id,
        selectBy: {
          last: 50,
        },
      });
      console.log('messages');
      console.log(messages);
      console.log('uiMessages');
      console.log(uiMessages);
      return thread;
    });
  }

  return stream.toDataStreamResponse();
}
