import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';

import resolvers from  './resolvers';
import { Prisma } from '../prisma/generated/prisma-client';

const typeDefs = importSchema('./server/schemas/user.graphql');


import 'dotenv/config';

const db = new Prisma({
    endpoint : process.env.PRISMA_ENDPOINT || 'http://localhost:4466',
    secret: process.env.PRISMA_SECRET || '',
})

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context : async() => ({
        prisma: db,
    }),
})

server.start({port: process.env.PORT}, () => {
    console.log('App running on localhost:4400');
})

