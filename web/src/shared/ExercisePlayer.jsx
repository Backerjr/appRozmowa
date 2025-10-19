
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsr } from '../shared/useAsr.js';

export function ExercisePlayer({ exercise, onNext }){
  if(!exercise) return null;
  return (
    <div style={{border:'1px solid #ddd', borderRadius:12, padding:12, marginTop:8}}>
      <div><b>{exercise.type.toUpperCase()}</b></div>
      <div style={{margin:'8px 0'}}>{exercise.prompt}</div>
      {exercise.type==='mcq' && <MCQ ex={exercise} onNext={onNext} />}
      {exercise.type==='tap_order' && <TapOrder ex={exercise} onNext={onNext} />}
      {exercise.type==='listen_type' && <ListenType ex={exercise} onNext={onNext} />}
    </div>
  );
}

function MCQ({ ex, onNext }){
  const [sel,setSel]=useState(null);
  const correct = sel && sel===ex.answer;
  return <div>
    {ex.options.map(o=> <button key={o} onClick={()=>setSel(o)} style={{marginRight:8}}>{o}</button>)}
    {sel && <div style={{marginTop:8}}>{correct?'✅':'❌'} {correct?'Good!':'Try again'}</div>}
    {correct && <button onClick={onNext} style={{marginTop:8}}>Next</button>}
  </div>;
}

function TapOrder({ ex, onNext }){
  const [picked,setPicked]=useState([]);
  function pick(t){ if(picked.includes(t)) return; setPicked([...picked, t]); }
  const correct = JSON.stringify(picked)===JSON.stringify(ex.answer);
  return <div>
    <div style={{marginBottom:6}}>{ex.tiles.map(t=> <button key={t} onClick={()=>pick(t)} style={{marginRight:6}}>{t}</button>)}</div>
    <div>Chosen: {picked.join(' ')}</div>
    {correct && <div style={{marginTop:8}}>✅ Correct <button onClick={onNext} style={{marginLeft:8}}>Next</button></div>}
  </div>;
}

function ListenType({ ex, onNext }){
  const [text,setText]=useState('');
  const { partial, final, start, stop } = useAsr('ws://localhost:4100/ws/asr');
  return <div>
    <div style={{margin:'6px 0'}}>ASR partial: <i>{partial}</i></div>
    <div style={{margin:'6px 0'}}>ASR final: <b>{final}</b></div>
    <input value={text} onChange={e=>setText(e.target.value)} placeholder="type here" />
    <div style={{marginTop:8}}>
      <button onClick={start} style={{marginRight:8}}>🎤 Start</button>
      <button onClick={stop}>🛑 Stop</button>
      <button onClick={onNext} style={{marginLeft:8}}>Next</button>
    </div>
  </div>;
}

ExercisePlayer.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    prompt: PropTypes.string,
    options: PropTypes.array,
    answer: PropTypes.any,
    tiles: PropTypes.array,
  }),
  onNext: PropTypes.func,
};

MCQ.propTypes = {
  ex: PropTypes.object.isRequired,
  onNext: PropTypes.func,
};

TapOrder.propTypes = {
  ex: PropTypes.object.isRequired,
  onNext: PropTypes.func,
};

ListenType.propTypes = {
  ex: PropTypes.object.isRequired,
  onNext: PropTypes.func,
};
