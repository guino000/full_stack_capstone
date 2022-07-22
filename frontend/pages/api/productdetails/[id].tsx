import {ProductApiClient} from "../../../lib/products";
import {NextApiRequest, NextApiResponse} from "next";
import {getCircularReplacer} from "../../../lib/utils/getCircularReplacer";
import Flatted from "flatted";

export default async function productDetailsApiHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new ProductApiClient('');
    const {id} = req.query
    if (id === undefined) {
      res.status(500).end()
      return
    }
    if (req.method === 'GET') {
      console.log(req.body)
      const product = await client.getProduct(id.toString())
      res.json(Flatted.stringify(product, getCircularReplacer))
      res.status(200).end()
    } else {
      res.status(405).end()
    }
  } catch (error) {
    console.error(error)
    // @ts-ignore
    res.status(error.status || 500).end(error.message)
    return
  }
}
