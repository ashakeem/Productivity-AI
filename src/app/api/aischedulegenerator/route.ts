// import { OpenAIApi, Configuration } from "openai-edge";
// import { OpenAIStream, StreamingTextResponse } from "ai";

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// export async function POST(req: Request) {
//   const { userActivities } = await req.json();

//   const response = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "system",
//         content: `
//           You are an AI assistant designed to generate sample schedules based on user-provided information. 
//           Please ensure that the schedule is realistic and includes appropriate time slots for each activity.`,
//       },
//       {
//         role: "user",
//         content: `
//           I need help creating a daily schedule. Here are my activities:
//           ${userActivities.map((activity: string) => `- ${activity}`).join("\n")}
//           Please generate a sample schedule for me.`,
//       },
//     ],
//     stream: true,
//   });

//   const stream = OpenAIStream(response);
//   return new StreamingTextResponse(stream);
// }
