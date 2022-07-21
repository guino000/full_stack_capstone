import axios from "axios";

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

export type ProductUpdate = {
  name?: string,
  description?: string,
  pictures?: Picture[],
  size?: string,
  cost?: number
}

export type ProductCreate = {
  name: string,
  description?: string,
  pictures?: string[],
  size?: string,
  cost?: number
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

export async function deleteProduct(id: string): Promise<number> {
  const res = await axios.delete(`http://localhost:5000/products/${id}`)
  console.log(res.data)

  if (res.status !== 200) {
    console.log(res.status)
    console.log(res.statusText)
  }

  return res.status
}

export async function updateProduct(id: string, data: ProductUpdate): Promise<number> {
  const res = await axios.post(`http://localhost:5000/products/${id}`, data)

  if (res.status !== 200) {
    console.log(res.status)
    console.log(res.statusText)
  }

  return res.status
}

export async function createProduct(data: ProductCreate): Promise<number> {
  try {
    const res = await axios.post('http://localhost:5000/products/', data)

    if (res.status !== 200) {
      console.log(res.status)
      console.log(res.statusText)
    }

    return res.status
  } catch (e) {
    console.log(e)
    return 500
  }
}
