import fetch from './fetch'

const tradegeckoBaseUrl: string = process.env.REACT_APP_TRADEGECKO_API_BASE_URL || 'https://api.tradegecko.com'
const accessToken: string = process.env.REACT_APP_ACCESS_TOKEN || ''

class TradeGeckoAPI {
  private accessToken: string
  private tradegeckoBaseUrl: string

  constructor (accessToken: string, baseUrl?: string) {
    this.accessToken = accessToken
    this.tradegeckoBaseUrl = baseUrl || tradegeckoBaseUrl
  }

  get = (api: string) => this.call(api, 'GET')
  post = (api: string, data: any) => this.call(api, 'POST', data)
  put = (api: string, data: any) => this.call(api, 'PUT', data)
  delete = (api: string) => this.call(api, 'DELETE')

  call: (api: string, method: string, data?: any) => Promise<any | Error> = async (api, method, data?) => {
    try {
      return await fetch(`${this.tradegeckoBaseUrl}/${api}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: data
      })
    } catch (err) {
      throw err
    }
  }
}

export default new TradeGeckoAPI(accessToken)