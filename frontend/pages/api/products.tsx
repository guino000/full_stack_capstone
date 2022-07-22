import {ProductApiClient} from "../../lib/products";
import {NextApiRequest, NextApiResponse} from "next";
import {getCircularReplacer} from "../../lib/utils/getCircularReplacer";

export default async function productApiHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new ProductApiClient('');

    if (req.method === 'GET') {
      const products = await client.getAllProducts()
      res.json(JSON.stringify(products, getCircularReplacer))
      res.status(200).end()
    } else {
      res.status(405).end()
    }
  } catch (error) {
    console.error(error)
    // @ts-ignore
    res.status(error.status || 500).end(error.message)
  }
}
