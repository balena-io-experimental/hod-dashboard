export default async (url: string, options: any) => {
  try {
    const response = await fetch(url, Object.assign({}, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }, options))
    const empty = response.headers.get('Content-Length') === '0'
    const contentType = response.headers.get('Content-Type')
    let body
    if (contentType && contentType.indexOf('application/json') > -1) {
      body = await response.json()
    } else {
      body = await response.text()
    }
    return (empty) ? {} : body
  } catch (err) {
    throw err
  }
}