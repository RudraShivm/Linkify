import React, { useEffect, useState } from 'react';
import './TypingEffect.css';
function TypingEffect() {
  const [text, setText] = useState('');
  const fullText = 'A  supply chain management project...';

  let i = -1;
  useEffect(() => {
    const typing = setInterval(() => {
      if (i++ < fullText.length-1) {
        setText((prevText) => prevText + fullText[i])
          
      } else {
        clearInterval(typing);
      }
    }, 140);

    return () => clearInterval(typing);
  }, [i]);

  return <div className='txt'>{text}</div>;
}

export default TypingEffect;