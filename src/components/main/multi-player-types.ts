export interface ChannelOpenRequest {
  name: string;
  description: string;
}

export interface ChannelOpenResponse {
  totp: string;
  httpEndpointUrl: string;
  wsEndpointUrl: string;
  slug: string;
}
