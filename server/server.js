import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import resolvers from  './resolvers';
import { Prisma } from '../prisma/generated/prisma-client';
import { S3 } from 'aws-sdk';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import uploadFile from './fileApi';

const typeDefs = importSchema('./server/schemas/schema.graphql');

export const db = new Prisma({
    endpoint : process.env.PRISMA_ENDPOINT || 'http://localhost:4466',
    secret: process.env.PRISMA_SECRET,
});

//uploadFile('liverpool','./liverpool.jpg', db);

const getCurrentUser = async (request) => {
    if(!request.headers.token){
        return null;
    }
    const user = await jwt.decode(
        request.headers.token,
        process.env.JWT_SECRET
    );
    return { ...user };
}

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context : async({ request }) => {
        const me = await getCurrentUser(request);
        return {
        me,
        prisma: db,
        };
    }
})

server.start({port: process.env.PORT}, () => {
    console.log('App running on localhost:4400');
})

