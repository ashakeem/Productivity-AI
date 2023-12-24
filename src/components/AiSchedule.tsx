// "use client"

// import React, { useState } from 'react';

// type Props = {};

// const AiSchedule = (props: Props) => {
//   const [inputText, setInputText] = useState<string>('');
//   const [submittedText, setSubmittedText] = useState<string | null>(null);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     // Send userActivities to the server
//     const userActivities = inputText.split('\n').filter(activity => activity.trim() !== '');

//     try {
//       const response = await fetch('/api/aischedulegenerator', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userActivities }),
//       });

//       if (response.ok) {
//         const { schedule } = await response.json();
//         setSubmittedText(schedule);
//       } else {
//         // Handle error
//         console.error('Failed to fetch schedule from the server');
//       }
//     } catch (error) {
//       console.error('Error while communicating with the server', error);
//     }

//     setInputText('');
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="inputText">Enter Text:</label>
//         <textarea
//           id="inputText"
//           name="inputText"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           required
//         />
//         <button type="submit">Submit</button>
//       </form>

//       {submittedText && (
//         <div>
//           <p>Generated Schedule:</p>
//           <p>{submittedText}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AiSchedule;
