import { objectType, stringArg, mutationField, interfaceType } from 'nexus';
import { fetcher } from '../dataSources/users';

const BASE_URL = 'https://2t2ez876ll.execute-api.us-east-1.amazonaws.com/prod';

export const ResponseInterface = interfaceType({
    name: 'UserResponseInterface',
    definition(t) {
        t.list.string('errors', { nullable: true });
        t.resolveType(() => undefined);
    },
});

export const LoginResponse = objectType({
    name: 'LoginResponse',
    definition(t) {
        t.implements(ResponseInterface);
        t.string('token', { nullable: true });
    }
});

export const SignupResponse = objectType({
    name: 'SignupResponse',
    definition(t) {
        t.implements(ResponseInterface);
        t.string('id', { nullable: false });
    }
});

export const login = mutationField('login', {
    type: LoginResponse,
    args: {
        email: stringArg(),
        password: stringArg()
    },
    resolve: async (_, {email, password}) => {
        const { data, errors } = await fetcher('/login', 'post', { email, password });

        if (errors) {
            return { errors };
        }

        return { token: data && data.token };
    }
});

export const signup = mutationField('signup', {
    type: SignupResponse,
    args: {
        email: stringArg({required: true}),
        password: stringArg({required: true})
    },
    resolve: async (_, {email, password}) => {
        const { data, errors } = await fetcher('/signup', 'post', { email, password });

        if (errors) {
            return { errors };
        }

        return { id: data.id };
    }
});
