import {ProductApiClient} from "../../../lib/products";
import {NextApiRequest, NextApiResponse} from "next";

export default async function productDetailsApiHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new ProductApiClient('');
    const {id} = await req.query
    if (id === undefined) {
      await res.status(500).end()
      return
    }
    if (await req.method === 'GET') {
      const product = await client.getProduct(id.toString())
      const data = JSON.stringify(product)
      await res.json(data)
      await res.status(200).end()
    } else {
      await res.status(405).end()
    }
  } catch (error) {
    console.error(error)
    // @ts-ignore
    await res.status(error.status || 500).end(error.message)
    return
  }
}
