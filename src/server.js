import {ApolloServer}  from "apollo-server"
import modules from './modules/index.js'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

const server = new ApolloServer({
    modules,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})

server.listen(process.env.PORT || 4500).then( ({url}) => console.log( url ))