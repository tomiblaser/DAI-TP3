import sql from 'mssql'
import config from '../../db.js'
import 'dotenv/config'
import { parse } from 'dotenv';

const peliculaTabla=process.env.DB_TABLA_PELICULA;
const personajeXPeliculaTabla=process.env.DB_TABLA_PxP;
const personajeTabla=process.env.DB_TABLA_PERSONAJE;

export class PeliculaService {

    getAllMovies = async (Titulo, Orden, Character) => {
        console.log('This is a function on the service');
        const pool = await sql.connect(config);
        let response = 0;

        if(Orden){
            response = await pool.request()
                .query(`SELECT IdPelicula, ImagenPelicula, Titulo, FechaCreacion 
                        FROM ${peliculaTabla}
                        ORDER BY FechaCreacion ${Orden}`);
        }
        else if(Titulo){
             response = await pool.request()
                .input('Titulo',sql.VarChar, Titulo)
                .query(`SELECT IdPelicula, ImagenPelicula, Titulo, FechaCreacion 
                        FROM ${peliculaTabla} 
                        WHERE Titulo=@Titulo`);
        }
        else{
            response = await pool.request()
                .query(`SELECT IdPelicula, ImagenPelicula, Titulo, FechaCreacion 
                        FROM ${peliculaTabla}`);
        }
        console.log(response)

        return response.recordset;
    }

    getMovieById = async (id) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
                .input('id',sql.Int, id)
                .query(`SELECT p.* FROM ${peliculaTabla} m, ${personajeTabla} p, ${personajeXPeliculaTabla} pp WHERE p.idPersonaje = pp.idPersonaje and m.idPelicula = pp.idPelicula and m.idPelicula=@id`);
        let helper = await pool.request()
                .input('id',sql.Int, id)
                .query(`SELECT m.* FROM ${peliculaTabla} m WHERE m.idPelicula=@id`);
        console.log(helper);

        helper.recordset[0].personajes=response.recordset;
        return helper.recordset[0];
    }

    createMovie = async (pelicula) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('ImagenPelicula',sql.VarChar, pelicula?.ImagenPelicula ?? '')
            .input('Titulo',sql.VarChar, pelicula?.Titulo ?? '')
            .input('FechaCreacion',sql.VarChar, pelicula?.FechaCreacion ?? 0)
            .input('Calificacion',sql.Int, pelicula?.Calificacion ?? 0)
            .query(`INSERT INTO ${peliculaTabla}(ImagenPelicula, Titulo, FechaCreacion, Calificacion) VALUES (@ImagenPelicula, @Titulo, @FechaCreacion, @Calificacion)`);
        console.log(response)

        return response.recordset;
    }

    updateMovieById = async (id, pelicula) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('id',sql.Int, id)
            .input('ImagenPelicula',sql.VarChar, pelicula?.ImagenPelicula ?? '')
            .input('Titulo',sql.VarChar, pelicula?.Titulo ?? '')
            .input('FechaCreacion',sql.VarChar, pelicula?.FechaCreacion ?? 0)
            .input('Calificacion',sql.Int, pelicula?.Calificacion ?? 0)
            .query(`UPDATE ${peliculaTabla} SET ImagenPelicula = @ImagenPelicula, Titulo = @Titulo, FechaCreacion = @FechaCreacion, Calificacion = @Calificacion WHERE idPelicula = @id`);
        console.log(response)

        return response.recordset;
    }

    deleteMovieById = async (id) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('id',sql.Int, id)
            .query(`DELETE FROM ${peliculaTabla} WHERE idPelicula = @id`);
        console.log(response)

        return response.recordset;
    }
}