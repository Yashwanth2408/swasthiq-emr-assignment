import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Use environment variable in production, localhost in development
const GRAPHQL_ENDPOINT =
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
    "http://localhost:8000/graphql";

const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: "omit",
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-and-network",
        },
        query: {
            fetchPolicy: "network-only",
            errorPolicy: "all",
        },
        mutate: {
            errorPolicy: "all",
        },
    },
});

export default client;
