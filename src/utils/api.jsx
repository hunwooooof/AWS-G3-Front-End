const api = {
  hostname: 'https://api.appworks-school.tw/api/1.0',
  async searchProducts(keyword, paging) {
    const response = await fetch(`${this.hostname}/products/search?keyword=${keyword}&paging=${paging}`);
    return await response.json();
  },
  async checkout(data, jwtToken) {
    const response = await fetch(`${this.hostname}/order/checkout`, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: 'POST',
    });
    return await response.json();
  },
};

export default api;
