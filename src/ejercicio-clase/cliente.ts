import net from 'net';
import path from "path";
import {createWriteStream} from 'fs';
if (process.argv.length !== 4) {
  console.log('Please, provide a filename.');
} else {
  const fileName = path.resolve(process.argv[2]);
  const outputName = path.resolve(process.argv[3]);
  const client = net.connect({port: 60300},() => {
    client.write(JSON.stringify({'file': fileName}));
    client.end();
    const outputStream = createWriteStream(outputName);
    client.on('data', (dataChunk) => {
      if (dataChunk.includes("ERROR")) {
        console.log(dataChunk.toString());
      } else {
        outputStream.write(dataChunk);
        outputStream.on('error',(err) => {
         console.log(err.message);
        });
      }
    });
    client.on('end',() =>{
     console.log("Transfer finished");
    });
  });
}