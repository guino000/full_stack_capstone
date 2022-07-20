export type Picture = {
  id: number,
  product_id: number,
  url: string
}

export type Product = {
  id: number,
  name: string,
  description: string,
  pictures: Picture[],
  size: string,
  cost: number
}

export type IDParam = {
  params: { id: string }
}

export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch('http://localhost:5000/products/')
  const data = await res.json()
  return data.products
}

export async function getAllProductIds(): Promise<IDParam[]> {
  const res = await fetch('http://localhost:5000/products/')
  const data = await res.json()
  console.log(data)
  return data['products'].map((p: Product) => {
    return {params: {id: p.id.toString()}}
  })
}

export async function getProduct(id: string): Promise<Product[]> {
  const res = await fetch(`http://localhost:5000/products/${id}`)
  const data = await res.json()
  console.log(data)
  return data['product']
}
