import path from 'path';
import chalk from "chalk";
import { mkdir, readdir, readFile, writeFile, unlink } from 'fs';
import { mostrarFunko } from './types.js';
export enum TipoFunko { POP = 'Pop!', RIDES = 'Rides', VYNL_SODA = 'Vinyl Soda', VYNL_GOLD = 'Vinyl Gold' };
export enum TipoGenero { ANIMATION = 'Animation', TV_MOVIES = 'TV & Movies', GAMES = 'Games', SPORTS = 'Sports', MUSIC = 'Music', ANIME = 'Anime' };
export enum TipoFranquicia { THEBIGBANGTHEORY = 'The Big Bang Theory', GAMEOFTHRONES = 'Game of Thrones', SONIC = 'Sonic the Hedgehog', MARVEL = 'Marvel' };
export type Funko = {
  ID: number,
  nombre: string,
  descripcion: string,
  tipo: TipoFunko,
  genero: TipoGenero,
  franquicia: TipoFranquicia,
  numeroFranquicia: number,
  exclusivo: boolean,
  caracteristicasEspeciales: string,
  valorDeMercado: number;
}

export class ColeccionFunkosPop {
  private _coleccion: Funko[] = [];
  private _usuario: string;

  constructor(usuario: string) {
    this._usuario = usuario;
  }

  cargarColeccion(callback: () => void): void {
    const ruta = this.getRutaUsuario();
    readdir(ruta, (err, files) => {
      if (err || files.length === 0) {
        callback(); 
        return;
      }

      let cargados = 0;
      files.forEach((file) => {
        const rutaFunko = path.join(ruta, file);
        readFile(rutaFunko, (err, data) => {
          cargados++;
          if (!err) {
            try {
              const funko = JSON.parse(data.toString()) as Funko;
              this._coleccion.push(funko);
            } catch (e) {
              console.error(chalk.red(`Error parseando ${file}: ${e}`));
            }
          }
          if (cargados === files.length) callback();
        });
      });
    });
  }

  getRutaUsuario(): string {
    return path.join('data', this._usuario);
  }

  guardarFunkoEnArchivo(funko: Funko): void {
    const ruta = this.getRutaUsuario();
    mkdir(ruta, { recursive: true }, (err) => {
      if (err) {
        console.error(chalk.red(`Error creando carpeta del usuario: ${err.message}`));
        return;
      }
      const rutaFunko = path.join(ruta, `${funko.ID}.json`);
      writeFile(rutaFunko, JSON.stringify(funko, null, 2), (err) => {
        if (err) {
          console.error(chalk.red(`Error guardando Funko: ${err.message}`));
        }
      });
    });
  }

  eliminarArchivoFunko(id: number): void {
    const rutaFunko = path.join(this.getRutaUsuario(), `${id}.json`);
    unlink(rutaFunko, (err) => {
      if (err) console.error(chalk.red(`Error eliminando archivo del Funko: ${err.message}`));
    });
  }

  añadirFunko(nuevoFunko: Funko): string {
    if (!this.buscarID(nuevoFunko.ID)) {
      this._coleccion.push(nuevoFunko);
      this.guardarFunkoEnArchivo(nuevoFunko);
      return 'Funko added successfully';
    } else {
      return 'Funko with this ID already exists';
    }
  }
  modificarFunko(modiFunko: Funko): string {
    const index = this._coleccion.findIndex(f => f.ID === modiFunko.ID);
    if (index !== -1) {
      this._coleccion[index] = modiFunko;
      this.guardarFunkoEnArchivo(modiFunko);
      return 'Funko updated successfully';
    } else {
      return 'Funko with this ID does not exist. Update failed';
    }
  }
  
  eliminarFunko(id: number): string {
    const index = this._coleccion.findIndex(f => f.ID === id);
    if (index !== -1) {
      this._coleccion.splice(index, 1);
      this.eliminarArchivoFunko(id);
      return 'Funko removed successfully';
    } else {
      return 'Funko with this ID does not exist. Deletion failed';
    }
  }
  
  

  listarFunkos(): string {
    if (this._coleccion.length === 0) {
      return 'No Funkos in the collection';
    }
  
    let output = '';
    this._coleccion.forEach(funko => {
      output += mostrarFunko(funko) + '\n' + '-------------------------\n';
    });
    return output.trim();
  }
  
  mostrarInfoFunko(id: number): string {
    const funko = this._coleccion.find(item => item.ID === id);
    if (!funko) {
      return `Funko with ID ${id} not found`;
    }
    return mostrarFunko(funko);
  }
  
  buscarID(id: number): boolean {
    const resultado = this._coleccion.find((funkoBusqueda) => funkoBusqueda.ID === id);
    if (resultado) {
      return true;
    }
    return false;
  }
  getFunko(id: number): Funko | undefined {
    return this._coleccion.find(f => f.ID === id);
  }
  
  getAll(): Funko[] {
    return this._coleccion;
  }
  
}
