import { ApolloServer, gql } from 'apollo-server';
import topAnimes from '../../top-animes.json';

const schema = gql(`
  type Anime {
    title: String
    rank: Int
    score: Float
    url: String
    image: String
    info: AnimeInfo
  }

  type AnimeInfo {
    type: String
    episodes: Int
    startDate: String
    endDate: String
    members: Int
  }

  type Query {
    animes: [Anime]
  }
`);

const resolvers = {
  Query: {
    animes: () => topAnimes
  }
};

const server = new ApolloServer({ typeDefs: schema, resolvers });

server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`);
});