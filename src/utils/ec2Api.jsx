const ec2Api = {
  hostname: 'http://35.72.177.254:3000/api/',
  async getProducts(category, paging) {
    const response = await fetch(
      `${this.hostname}/products/${category}?paging=${paging}`,
    );
    return await response.json();
  },
  async getCampaigns() {
    const response = await fetch(`${this.hostname}/marketing/campaigns`);
    return await response.json();
  },
  async searchProducts(keyword, paging) {
    const response = await fetch(
      `${this.hostname}/products/search?keyword=${keyword}&paging=${paging}`,
    );
    return await response.json();
  },
  async getProduct(id) {
    const response = await fetch(`${this.hostname}/products/details?id=${id}`);
    console.log(response);
    const aa = await response.json();
    console.log(aa);

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
  async signin(data) {
    const response = await fetch(`${this.hostname}/user/signin`, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    });
    return await response.json();
  },
  async getProfile(jwtToken) {
    const response = await fetch(`${this.hostname}/user/profile`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    });
    return await response.json();
  },
  async getCollection(jwtToken) {
    const response = await fetch(`${this.hostname}/v1/collection`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    });
    return await response.json();
  },
  async addCollection(id, jwtToken) {
    const response = await fetch(`${this.hostname}/v1/collection`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
      body: JSON.stringify({ productId: id, method: 'create' }),
      method: 'POST',
    });
    return await response.json();
  },

  async deleteCollection(id, jwtToken) {
    const response = await fetch(`${this.hostname}/v1/collection`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
      body: JSON.stringify({ productId: id, method: 'delete' }),
      method: 'POST',
    });
    return await response.json();
  },
};
export default ec2Api;
