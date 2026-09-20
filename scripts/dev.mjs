// Next.js development server in one process (compatible with restricted Windows pipes).
// All application state stays in the browser; this only serves Next.js development assets.
import next from 'next';
import http from 'node:http';
import { parseArgs } from 'node:util';
const { values } = parseArgs({ options: {
  port: { type:'string', short:'p', default:process.env.PORT || '3000' },
  hostname: { type:'string', short:'H', default:'localhost' },
} });
const port = Number(values.port);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Port musí být číslo od 1 do 65535.');
const app = next({dev:true,dir:process.cwd(),hostname:values.hostname,port});
await app.prepare();
const handler=app.getRequestHandler();
const server=http.createServer((req,res)=>handler(req,res));
server.on('upgrade',app.getUpgradeHandler());
server.once('error', async error=>{ console.error(error);await app.close();process.exit(1); });
server.listen(port,values.hostname,()=>console.log(`Konfigurátor dekorů: http://${values.hostname}:${port}`));
for(const signal of ['SIGINT','SIGTERM']) process.once(signal,async()=>{server.close();await app.close();process.exit(0);});
