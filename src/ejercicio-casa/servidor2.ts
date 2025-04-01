import net from "net";
import { ColeccionFunkosPop } from "./funko.js";
import { RequestType, ResponseType } from "./types.js";

net
  .createServer((connection) => {
    console.log("Client connected");
    connection.setEncoding("utf-8");
    let wholeData = "";
    connection.on("data", (chunk) => {
      wholeData += chunk;

      if (wholeData.endsWith("\n")) {
        try {
          const parsed: RequestType = JSON.parse(wholeData.trim());
          connection.emit("request", parsed);
          wholeData = "";
        } catch {
          const errorRes: ResponseType = {
            type: "read",
            success: false,
            message: "Invalid JSON input",
          };
          connection.write(JSON.stringify(errorRes) + "\n");
          wholeData = "";
        }
      }
    });
    connection.on("request", (object: RequestType) => {
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
            if (found) response.funko = found;
            else response.success = false;
            break;
          case "list":
            response.message = "Funko list:";
            response.funkos = collection.getAll();
            break;
          default:
            response.success = false;
            response.message = "Invalid command";
        }

        connection.write(JSON.stringify(response) + "\n");
      });
    });

    connection.on("close", () => {
      console.log("A client has disconnected.");
    });
  })
  .listen(60300, () => {
    console.log("Waiting for clients to connect.");
  });
