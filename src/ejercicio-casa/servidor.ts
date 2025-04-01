import net from "net";
import { EventEmitter } from "events";
import { ColeccionFunkosPop, Funko } from "./funko.js";
import { RequestType, ResponseType } from "./types.js";

const emitter = new EventEmitter();

net
  .createServer((connection) => {
    console.log("Client connected");

    let wholeData = "";
    connection.setEncoding("utf-8");

    connection.on("data", (chunk) => {
      wholeData += chunk;
      if (wholeData.endsWith("\n")) {
        try {
          const object: RequestType = JSON.parse(wholeData);
          const collection = new ColeccionFunkosPop(object.user);
          const response: ResponseType = {
            type: object.type,
            success: true,
            message: "",
          };

          collection.cargarColeccion(() => {
            switch (object.type) {
              case "add":
                response.message = collection.añadirFunko(object.funko);
                break;
              case "update":
                response.message = collection.modificarFunko(object.funko);
                break;
              case "remove":
                response.message = collection.eliminarFunko(object.id);
                break;
              case "read":
                response.message = collection.mostrarInfoFunko(object.id);
                const found = collection.getFunko(object.id);
                if (found) {
                  response.funko = found;
                } else {
                  response.success = false;
                }
                break;
              case "list":
                response.message = collection.listarFunkos();
                break;
              default:
                response.success = false;
                response.message = "Invalid command";
            }

            connection.write(JSON.stringify(response) + "\n", () => {
              connection.end();
            });

            if (["add", "update", "remove"].includes(object.type)) {
              emitter.emit("change", object.user, object.type);
            }
          });
        } catch {
          const errorRes: ResponseType = {
            type: "read",
            success: false,
            message: "Invalid JSON input",
          };
          connection.write(JSON.stringify(errorRes) + "\n", () =>
            connection.end(),
          );
        }
      }
    });

    connection.on("close", () => {
      console.log("A client has disconnected.");
    });
  })
  .listen(60300, () => {
    console.log("Waiting for clients to connect.");
  });
emitter.on("change", (user, action) => {
  console.log(`Action: ${action} | User: ${user}`);
});
