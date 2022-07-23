import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {ProductApiClient} from "../../../lib/products";

export default withApiAuthRequired(async function productCreateApiHandler(req, res) {
  try {
    const {accessToken} = await getAccessToken(req, res, {
      scopes: ['post:products']
    });

    if (accessToken === undefined) {
      res.status(401).end('Could not get access token')
      return
    }

    const client = new ProductApiClient(accessToken);

    if (req.method === 'POST') {
      console.log(req.body)
      const status = await client.createProduct(req.body)
      res.status(status).end()
    } else {
      res.status(405).end()
    }
  } catch (error) {
    console.error(error)
    // @ts-ignore
    res.status(error.status || 500).end(error.message)
    return
  }
})
