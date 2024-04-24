// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function TextbookPage({ match }) {
//   const [textbook, setTextbook] = useState(null);

//   useEffect(() => {
//     fetchTextbook(match.params.id);
//   }, [match.params.id]);

//   const fetchTextbook = async (id) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/textbooks/${id}`);
//       setTextbook(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (!textbook) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>{textbook.title}</h1>
//       <h2>Author: {textbook.author}</h2>

//       {textbook.topics.map((topic, index) => (
//         <div key={index}>
//           <h3>{topic.title}</h3>
//           <p>{topic.content}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default TextbookPage;
