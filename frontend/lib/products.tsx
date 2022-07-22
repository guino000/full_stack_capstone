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

export class ProductApiClient {
  token: string
  authHeader: string
  baseUrl: string

  constructor(token: string) {
    this.token = token
    this.authHeader = `Bearer ${token}`
    this.baseUrl = 'http://localhost:5000'
  }

  async getAllProducts(): Promise<Product[]> {
    const res = await axios.get(`${this.baseUrl}/products/`)
    return res.data.products
  }

  async getAllProductIds(): Promise<IDParam[]> {
    const res = await axios.get(`${this.baseUrl}/products/`)
    console.log(res.data)
    return res.data['products'].map((p: Product) => {
      return {params: {id: p.id.toString()}}
    })
  }

  async getProduct(id: string): Promise<Product[]> {
    const res = await axios.get(`${this.baseUrl}/products/${id}`)
    console.log(res.data)
    return res.data['product']
  }

  async deleteProduct(id: string): Promise<number> {
    const res = await axios.delete(`${this.baseUrl}/products/${id}`, {
      headers: {
        Authorization: this.authHeader
      }
    })
    console.log(res.data)

    if (res.status !== 200) {
      console.log(res.status)
      console.log(res.statusText)
    }

    return res.status
  }

  async updateProduct(id: string, data: ProductUpdate): Promise<number> {
    const res = await axios.patch(`${this.baseUrl}/products/${id}`, data, {
      headers: {
        Authorization: this.authHeader
      }
    })

    if (res.status !== 200) {
      console.log(res.status)
      console.log(res.statusText)
    }

    return res.status
  }

  async createProduct(data: ProductCreate): Promise<number> {
    try {
      console.log(this.authHeader)
      console.log(this.token)
      const res = await axios.post(`${this.baseUrl}/products/`, data, {
        headers: {
          Authorization: this.authHeader
        }
      })

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

}
