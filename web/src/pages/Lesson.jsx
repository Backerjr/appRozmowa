
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ExercisePlayer } from '../shared/ExercisePlayer.jsx';

export function Lesson({ lessonId }){
  // Hardcoded exercises for demo
  const exercises = [
    { id:'ex1', type:'mcq', prompt:'Choose the correct article: ___ apple', options:['a','an'], answer:'an', hints_pl:['Przed samogłoską: an.'] },
    { id:'ex2', type:'tap_order', prompt:'Ułóż zdanie: "I am from Poland"', tiles:['from','I','Poland','am'], answer:['I','am','from','Poland'] },
    { id:'ex3', type:'listen_type', prompt:'Type what you hear (stub TTS): "three"', answer:'three', hints_pl:['/θ/ dźwięczne.'] }
  ];
  const [idx,setIdx]=useState(0);
  const ex = exercises[idx];
  return <div>
    <h2>Lesson demo</h2>
    <ExercisePlayer exercise={ex} onNext={()=> setIdx(i=> Math.min(i+1, exercises.length-1))} />
  </div>;
}

Lesson.propTypes = {
  lessonId: PropTypes.string,
};
