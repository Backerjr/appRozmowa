
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4100;
const wss = new WebSocketServer({ port: PORT, path: '/ws/asr' });

wss.on('connection', (ws)=>{
  let timer;
  ws.on('message', (data)=>{
    try{
      const msg = JSON.parse(data.toString());
      if(msg.type==='start'){
        // Emit fake partials + final text to let you build UI without Azure creds
        let i=0;
        const partials = ['th...','three','three '];
        timer = setInterval(()=>{
          if(i<partials.length-1){ ws.send(JSON.stringify({ type:'partial', text: partials[i++] })); }
          else { clearInterval(timer); ws.send(JSON.stringify({ type:'final', text: 'three' })); }
        }, 500);
      }
      if(msg.type==='stop'){ clearInterval(timer); }
    }catch(e){ /* ignore */ }
  });
  ws.on('close', ()=> clearInterval(timer));
});

console.log(`Speech Proxy (stub) on ws://localhost:${PORT}/ws/asr`);
