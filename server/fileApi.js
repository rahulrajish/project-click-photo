import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { readFileSync, statSync } from 'fs';

const uploadFile = async (filename, filepath, prisma) => {
    try {
        const name = filename;
        const filecontent = readFileSync(filepath);
        const secret = uuidv4();
        const size = statSync(filepath).size;

        const s3client = new S3({
            accessKeyId: process.env.S3_KEY,
            secretAccessKey: process.env.S3_SECRET,
            params: {
                Bucket: process.env.S3_BUCKET 
            }
        });

        const response = await s3client.upload({
            Key: secret,
            ACL: 'public-read',
            Body: filecontent,
            ContentLength: size,
        }).promise();

        const url = response.Location;

        const id = await prisma.createFile({ name, size, secret, url }, `{ id }`);

        return id;

    } catch (err) {
        throw new Error(err);
    }
};

export default uploadFile;



//let form = new multiparty.form();

/*form.on('part', async function (part) {
    if (part.name !== 'data') {
        return
    }

    const name = part.filename;
    const secret = uuidv4();
    const size = part.byteCount;
    const contentType = mime.lookup(part.filename);

    try {
        const response = await S3.upload({
            Key: secret,
            ACL: 'public-read',
            Body: parent,
            ContentLength: size,
            ContentType: contentType
        }).promise();

        const url = response.Location;

        const data = {
            name,
            size,
            secret,
            contentType,
            url
        }

        const id = await prisma.mutation.createFile({ data }, `{ id }`)

        return res.sendStatus(200).send(File);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
})

form.on('error', err => {
    console.log(err);
    return res.sendStatus(500);
})

form.parse(req);*/