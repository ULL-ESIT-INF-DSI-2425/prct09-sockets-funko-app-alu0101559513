import net from 'net';
import {createReadStream, write} from 'fs';
import {access} from "fs";
net.createServer({ allowHalfOpen: true },(connection) => {
  console.log('A client has connected.');

  let wholeData = '';
  connection.on('data', (dataChunk) => {
    wholeData += dataChunk;
  });
  
  connection.on('end', () => {
    const message = JSON.parse(wholeData);
    access(message.file, (err) => {
      if (!err) {
        const inputStream = createReadStream(message.file);
        inputStream.on('data', (piece) => {
          connection.write(piece);
        });
        inputStream.on('error',(err)=> {
          console.log(err.message);
        });
        inputStream.on('close',()=> {
          connection.end();
        });
      } else {
        connection.write('ERROR: el fichero no existe');
        connection.end();
      }
    });
  });
  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});