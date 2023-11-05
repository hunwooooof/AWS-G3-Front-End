const ec2Api = {
  hostname: 'http://35.72.177.254:3000',
  async getAllCoupons() {
    const response = await fetch(`${this.hostname}/api/marketing/coupons`);
    return await response.json();
  },
  async postClaimCoupon(jwtToken) {
    const response = await fetch(`${this.hostname}/api/v1/coupons`, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: 'POST',
    });
    return await response.json();
  },
  async getUserCoupons() {
    const response = await fetch(`${this.hostname}/api/v1/coupons`);
    return await response.json();
  },
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
};

export default ec2Api;
