import {ProductApiClient} from "../../../lib/products";
import {NextApiRequest, NextApiResponse} from "next";
import Flatted from "flatted";
import {getCircularReplacer} from "../../../lib/utils/getCircularReplacer";

export default async function productDetailsApiHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new ProductApiClient('');
    const {id} = req.query
    if (id === undefined) {
      await res.status(500).end()
      return
    }
    if (req.method === 'GET') {
      const product = await client.getProduct(id.toString())
      const data = Flatted.stringify(product, getCircularReplacer)
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
