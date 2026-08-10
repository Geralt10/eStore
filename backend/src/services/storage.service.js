import { config } from "../config/config.js";
import ImageKit,{toFile} from "@imagekit/nodejs";

const client = new ImageKit({
    privateKey:config.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFile({buffer,fileName,folder="eStore"}){
    const result = await client.files.upload({
        file: await toFile(buffer),
        fileName: fileName,
        folder: folder,
    })

    return result;  
}


