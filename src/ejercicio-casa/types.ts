import { Funko } from "./funko.js";
import chalk from "chalk";
export type RequestType =
  | { type: 'add' | 'update'; user: string; funko: Funko }
  | { type: 'remove' | 'read'; user: string; id: number }
  | { type: 'list'; user: string };

export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  success: boolean;
  message: string;
  funko?: Funko;
  funkos?: Funko[];
};
export function colorearValor(valor: number): string {
  if (valor >= 1000) {
    return chalk.green(`$${valor}`);
  } else if (valor >= 500) {
    return chalk.bgCyan(`$${valor}`);
  } else if (valor >= 100) {
    return chalk.yellow(`$${valor}`);
  } else {
    return chalk.red(`$${valor}`);
  }
};
export function mostrarFunko(funko: Funko): string {
  return [
    `ID: ${funko.ID}`,
    `Name: ${funko.nombre}`,
    `Description: ${funko.descripcion}`,
    `Type: ${funko.tipo}`,
    `Genre: ${funko.genero}`,
    `Franchise: ${funko.franquicia}`,
    `Franchise Number: ${funko.numeroFranquicia}`,
    `Exclusive: ${funko.exclusivo ? 'Yes' : 'No'}`,
    `Special Features: ${funko.caracteristicasEspeciales}`,
    `Market Value: ${funko.valorDeMercado}`
  ].join('\n');
}