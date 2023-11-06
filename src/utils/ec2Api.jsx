const ec2Api = {
  hostname: 'https://ygolonhcet.online',
  async signin(data) {
    const response = await fetch(`${this.hostname}/api/user/signin`, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    });
    return await response.json();
  },
  async getProfile(jwtToken) {
    const response = await fetch(`${this.hostname}/api/user/profile`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    });
    return await response.json();
  },
  async getAllCoupons() {
    const response = await fetch(`${this.hostname}/api/v1/coupons`);
    return await response.json();
  },
  async postClaimCoupon(id, jwtToken) {
    const response = await fetch(`${this.hostname}/api/v1/coupons`, {
      body: JSON.stringify({ id: id }),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: 'POST',
    });
    return await response.json();
  },
  async getUserValidCoupons(jwtToken) {
    const response = await fetch(`${this.hostname}/api/v1/valid-coupons`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    });
    return await response.json();
  },
  async getUserInvalidCoupons(jwtToken) {
    const response = await fetch(`${this.hostname}/api/v1/valid-coupons`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    });
    return await response.json();
  },
  async getCollection(jwtToken) {
    const response = await fetch(`${this.hostname}/api/v1/collection`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    });
    return await response.json();
  },
  async addCollection(id, jwtToken) {
    const response = await fetch(`${this.hostname}/api/v1/collection`, {
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
    const response = await fetch(`${this.hostname}/api/v1/collection`, {
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
