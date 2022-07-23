import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {ProductApiClient} from "../../../lib/products";

export default withApiAuthRequired(async function productCreateApiHandler(req, res) {
  try {
    const {id} = req.query
    if (id === undefined) {
      res.status(500).end()
      return
    }
    if (req.method === 'DELETE') {
      const {accessToken} = await getAccessToken(req, res, {
        scopes: ['delete:products']
      });
      if (accessToken === undefined) {
        res.status(401).end('Could not get access token')
        return
      }
      const client = new ProductApiClient(accessToken);
      const status = await client.deleteProduct(id.toString())
      res.status(status).end()
    } else if (req.method === 'PATCH') {
      const {accessToken} = await getAccessToken(req, res, {
        scopes: ['patch:products']
      });
      if (accessToken === undefined) {
        res.status(401).end('Could not get access token')
        return
      }
      const client = new ProductApiClient(accessToken);
      const status = await client.updateProduct(id.toString(), req.body)
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
