import koa from 'koa'
import koaRouter from 'koa-router'    // koa-router@next
import koaBody from 'koa-bodyparser'  // koa-bodyparser@next
import cors from 'kcors'
import {graphqlKoa, graphiqlKoa} from 'graphql-server-koa'
import {SubscriptionServer} from 'subscriptions-transport-ws'
import {subscriptionManager, schema}  from  './subscriptions'

const app = new koa()
const router = new koaRouter()
const PORT = 3000

app.use(cors())
app.use(koaBody()) // koaBody is needed just for POST.

router.post('/graphql', graphqlKoa({schema: schema}))
router.get('/graphql', graphqlKoa({schema: schema}))
router.get('/graphiql', graphiqlKoa({endpointURL: '/graphql'}))

app.use(router.routes())
app.use(router.allowedMethods())

const server = app.listen(PORT, () => {
    console.log('Server is running on', 'localhost:' + PORT)
    console.log('GraphiQL dashboard', 'localhost:' + PORT + '/graphiql')
    console.log('Websockets listening on', 'localhost:' + PORT + '/subscriptions')
})

new SubscriptionServer({
    subscriptionManager,
}, {
    path: '/subscriptions',
    server
});