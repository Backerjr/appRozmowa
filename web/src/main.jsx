
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Lesson } from './pages/Lesson.jsx';
import { Status } from './pages/Status.jsx';

function App(){
  return <div style={{fontFamily:'system-ui', padding:16}}>
    <h1>Polyglot Web (Starter)</h1>
    <Lesson lessonId={'00000000-0000-0000-0000-0000000000aa'} />
    <Status />
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
