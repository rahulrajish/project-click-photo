import { v4 as uuidv4 } from 'uuid';
import s3client from './s3config';
import { readFileSync, statSync } from 'fs';

const uploadFile = async (args, prisma) => {
    try {
        const file = await args.file;
        const name = file;
        //const filecontent = readFileSync(filepath);
        const secret = uuidv4();
        //const size = statSync(filepath).size;

        const response = await s3client.upload({
            Key: secret,
            ACL: 'public-read',
            Body: filecontent,
            ContentLength: size,
        }).promise();

        const url = response.Location;

        return await prisma.createFile({ name, size, secret, url }, `{ id }`);

    } catch (err) {
        throw new Error(err);
    }
};

export default uploadFile;



