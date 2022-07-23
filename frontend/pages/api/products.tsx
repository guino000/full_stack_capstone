import {ProductApiClient} from "../../lib/products";
import {NextApiRequest, NextApiResponse} from "next";
import Flatted from "flatted";
import {getCircularReplacer} from "../../lib/utils/getCircularReplacer";

export default async function productApiHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new ProductApiClient('');

    if (await req.method === 'GET') {
      const products = await client.getAllProducts()
      const data = Flatted.stringify(products, getCircularReplacer)
      await res.json(data)
      await res.status(200).end()
    } else {
      await res.status(405).end()
    }
  } catch (error) {
    console.error(error)
    // @ts-ignore
    await res.status(error.status || 500).end(error.message)
  }
}
