import net from "net";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { Funko, TipoFunko, TipoGenero, TipoFranquicia } from "./funko.js";
import { RequestType, ResponseType, mostrarFunko } from "./types.js";

function sendMessage(message: RequestType) {
  const client = net.connect({ port: 60300 }, () => {
    client.setEncoding("utf-8");
    client.write(JSON.stringify(message) + "\n");
  });

  let wholeData = "";

  client.on("data", (chunk) => {
    wholeData += chunk;
  });

  client.on("end", () => {
    try {
      const response: ResponseType = JSON.parse(wholeData.trim());

      if (response.success) {
        console.log(chalk.green(response.message));
      } else {
        console.log(chalk.red(response.message));
      }

      if (response.funko) {
        console.log(mostrarFunko(response.funko));
      }

      if (response.funkos) {
        response.funkos.forEach((f) => {
          console.log(mostrarFunko(f));
          console.log(chalk.gray("-------------------------"));
        });
      }
    } catch {
      console.error(chalk.red("Invalid response from server"));
    }
  });

  client.on("error", (err) => {
    console.error(chalk.red(`Error: ${err.message}`));
  });
}

yargs(hideBin(process.argv))
  .command(
    "add",
    "Add a new Funko",
    {
      user: { type: "string", demandOption: true },
      id: { type: "number", demandOption: true },
      name: { type: "string", demandOption: true },
      desc: { type: "string", demandOption: true },
      type: {
        type: "string",
        choices: Object.values(TipoFunko),
        demandOption: true,
      },
      genre: {
        type: "string",
        choices: Object.values(TipoGenero),
        demandOption: true,
      },
      franchise: {
        type: "string",
        choices: Object.values(TipoFranquicia),
        demandOption: true,
      },
      franchiseNumber: { type: "number", demandOption: true },
      exclusive: { type: "boolean", demandOption: true },
      specialFeatures: { type: "string", demandOption: true },
      marketValue: { type: "number", demandOption: true },
    },
    (args) => {
      const funko: Funko = {
        ID: args.id,
        nombre: args.name,
        descripcion: args.desc,
        tipo: args.type as TipoFunko,
        genero: args.genre as TipoGenero,
        franquicia: args.franchise as TipoFranquicia,
        numeroFranquicia: args.franchiseNumber,
        exclusivo: args.exclusive,
        caracteristicasEspeciales: args.specialFeatures,
        valorDeMercado: args.marketValue,
      };

      sendMessage({ type: "add", user: args.user, funko });
    },
  )

  .command(
    "update",
    "Update an existing Funko",
    {
      user: { type: "string", demandOption: true },
      id: { type: "number", demandOption: true },
      name: { type: "string", demandOption: true },
      desc: { type: "string", demandOption: true },
      type: {
        type: "string",
        choices: Object.values(TipoFunko),
        demandOption: true,
      },
      genre: {
        type: "string",
        choices: Object.values(TipoGenero),
        demandOption: true,
      },
      franchise: {
        type: "string",
        choices: Object.values(TipoFranquicia),
        demandOption: true,
      },
      franchiseNumber: { type: "number", demandOption: true },
      exclusive: { type: "boolean", demandOption: true },
      specialFeatures: { type: "string", demandOption: true },
      marketValue: { type: "number", demandOption: true },
    },
    (args) => {
      const funko: Funko = {
        ID: args.id,
        nombre: args.name,
        descripcion: args.desc,
        tipo: args.type as TipoFunko,
        genero: args.genre as TipoGenero,
        franquicia: args.franchise as TipoFranquicia,
        numeroFranquicia: args.franchiseNumber,
        exclusivo: args.exclusive,
        caracteristicasEspeciales: args.specialFeatures,
        valorDeMercado: args.marketValue,
      };

      sendMessage({ type: "update", user: args.user, funko });
    },
  )

  .command(
    "remove",
    "Remove a Funko by ID",
    {
      user: { type: "string", demandOption: true },
      id: { type: "number", demandOption: true },
    },
    (args) => {
      sendMessage({ type: "remove", user: args.user, id: args.id });
    },
  )

  .command(
    "read",
    "Read a Funko by ID",
    {
      user: { type: "string", demandOption: true },
      id: { type: "number", demandOption: true },
    },
    (args) => {
      sendMessage({ type: "read", user: args.user, id: args.id });
    },
  )

  .command(
    "list",
    "List all Funkos from a user",
    {
      user: { type: "string", demandOption: true },
    },
    (args) => {
      sendMessage({ type: "list", user: args.user });
    },
  )

  .help().argv;
