import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { combineResolvers, skip } from 'graphql-resolvers';

const userIsAuthenticated = (parent, args, { me }) => {
    return me ? skip : new Error('Not Authenticated');
}

export default {
    Query: {
        me: async (parent, { id }, { prisma, me }) => {
            const user = await prisma.user({ id: me.user.id });
            return user;
        },
        getUser: combineResolvers(
            userIsAuthenticated,
            async (parent, { id }, { prisma }) => {
                const user = await prisma.user({ id });
                return user;
            }),
        signIn: async (parent, { email, password }, { prisma }) => {
            try {
                const user = await prisma.user({ email });

                if (!user) {
                    throw new Error("Invalid Credentials");
                }

                const passwordMatch = bcrypt.compareSync(password, user.password);

                if (!passwordMatch) {
                    throw new Error("Invalid Credentials");
                }
                const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: 36000 });
                return { token };
            } catch (error) {
                throw new Error(error);
            }
        },
        file: combineResolvers(
            userIsAuthenticated,
            async (parent, { id }, { prisma }) => {
            return await prisma.file({ id });
        }),
        files: combineResolvers(
            userIsAuthenticated,
            async (parent, args, { prisma }) => {
            return await prisma.files(args);
        }),
    },
    Mutation: {
        signUp: async (parent, { email, password }, { prisma }) => {
            try {
                const hashedPassword = bcrypt.hashSync(password, 12);

                const user = await prisma.createUser({ email, password: hashedPassword });

                const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 36000 });

                return { token };
            } catch (error) {
                throw new Error(error);
            }
        },
        renameFile: async (parent, {id, name}, { prisma }) => {
            return await prisma.updateFiles({data : {name}, where: {id}});
        },
        deleteFile: async (parent, {id}, { prisma }) => {
            return await prisma.deleteFiles({where : {id}}, info);
        }
    }
}