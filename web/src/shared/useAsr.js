
import { useEffect, useRef, useState } from 'react'

export function useAsr(url){
  const wsRef = useRef(null);
  const [partial,setPartial]=useState('');
  const [final,setFinal]=useState('');
  const mediaRef = useRef(null);

  function start(){
    if(wsRef.current) wsRef.current.close();
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = async () => {
      setPartial(''); setFinal('');
      // Mic capture (stub): we won't actually stream audio in this starter.
      // Just send a start signal so the proxy can emit fake partials.
      ws.send(JSON.stringify({ type:'start' }));
    };
    ws.onmessage = (e)=>{
      const msg = JSON.parse(e.data);
      if(msg.type==='partial') setPartial(msg.text);
      if(msg.type==='final'){ setFinal(msg.text); setPartial(''); }
    };
  }
  function stop(){
    wsRef.current?.send(JSON.stringify({ type:'stop' }));
    wsRef.current?.close();
  }
  useEffect(()=>()=> wsRef.current?.close(),[]);
  return { partial, final, start, stop };
}
