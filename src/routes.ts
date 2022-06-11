import { Request, Response, Router } from "express";
import multer from 'multer'; //Manda arquivos para o prisma
//Readable: é a nossa fonte de dados
import { Readable } from "stream"; //Processa dados sobre demando, com isso, o arquivo é transformado em buffer, 
//buffer divide nosso arquivo em pequenos pedeços para processar de forma independente
//Cada pedaço de arquivo é chamado de chunks

//Readable: pega o chunks e processa esses dados e os fornece para ser processados de outra forma.
import readLine from 'readline';
import { client } from "./database/client";

const multerConfig = multer();
const router = Router();

interface Products {
    estatus: string;
    name: string;
    followers: string;
    average_views: string;
    demographics: string;
    email: string;
}

router.post("/alibaba", 
multerConfig.single("file"),
        async (request: Request, response: Response) =>  {
            //console.log(request.file?.buffer.toString("utf-8"));
            const  file  = request;
            const buffer = request.file?.buffer;
            const readableFile = new Readable();
            readableFile.push(buffer);
            readableFile.push(null);

            const productsLine = readLine.createInterface({// Cria uma interface que divide o arquivo linha por linha
                input: readableFile
            })

            const products: Products[] = [];

            for await(let line of productsLine) {
               const productLineSplit = line.split(";");
               console.log(productLineSplit[0]);
               console.log(productLineSplit[1]);
               console.log(productLineSplit[2]);
               console.log(productLineSplit[3]);
               console.log(productLineSplit[4]);
               console.log(productLineSplit[5]);
                //   console.log(line);

               
              // if(line != " " && line != "\t") {
                    products.push({
                     estatus: productLineSplit[0],
                     name: productLineSplit[1],
                     followers: productLineSplit[2],
                     average_views: productLineSplit[3],
                     demographics: productLineSplit[4],
                     email: productLineSplit[5],
                     //    price: Number(productLineSplit[2]),
                     //    quantity: Number(productLineSplit[3])
                    })
                //}
            }

            for await( let {estatus, name, followers,  average_views, demographics, email} of products) {
                await client.products.create({
                    data: {
                        estatus,
                        name,
                        followers,
                        average_views,
                        demographics,
                        email
                    }
                })
            }
            return response.json(products);
    }
);

export { router };