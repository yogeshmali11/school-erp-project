import React, { useState } from 'react';
import axios from 'axios';

const AIChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Retry function with exponential backoff
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSendWithRetry = async (retryCount = 0, maxRetries = 3) => {
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: input }],
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res;
    } catch (error) {
      if (error.response && error.response.status === 429 && retryCount < maxRetries) {
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        await delay(waitTime);
        return handleSendWithRetry(retryCount + 1, maxRetries);
      }
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setError(null);
    setLoading(true);

    try {
      const res = await handleSendWithRetry();
      const aiMessage = {
        sender: 'ai',
        text: res.data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setInput('');
    } catch (error) {
      console.error('Error talking to AI:', error);
      if (error.response && error.response.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError('Failed to get a response from the AI. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h4>Ask Anything to AI</h4>
      <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'scroll', padding: 10 }}>
        {messages.map((msg, idx) => (
          <p key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
          </p>
        ))}
        {error && (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        )}
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{ width: '80%' }}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default AIChat;






// import React, { useState } from 'react';
// import axios from 'axios';

// const AIChat = () => {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: 'user', text: input };
//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       const res = await axios.post(
//         'https://api.openai.com/v1/chat/completions',
//         {
//           model: 'gpt-3.5-turbo',
//           messages: [{ role: 'user', content: input }],
//         },
//         {
//           headers: {
//             Authorization: `Bearer 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`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       const aiMessage = {
//         sender: 'ai',
//         text: res.data.choices[0].message.content,
//       };

//       setMessages((prev) => [...prev, aiMessage]);
//       setInput('');
//     } catch (error) {
//       console.error('Error talking to AI:', error);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
//       <h4>Ask Anything to AI</h4>
//       <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'scroll', padding: 10 }}>
//         {messages.map((msg, idx) => (
//           <p key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
//             <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
//           </p>
//         ))}
//       </div>
//       <div style={{ marginTop: 10 }}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your question..."
//           style={{ width: '80%' }}
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default AIChat;
