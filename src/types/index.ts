export interface LinkDataType {
  id: string;
  slug: string;
  url: string;
  createdAt: string;
  visited: number;
}

export interface LoginResponse {
  status: string;
  accessToken: string;
}

export interface RegisterResponse {
  status: string;
  data: {
    id: string;
    name: string;
    username: string;
  };
}

export interface GetLinksResponse {
  status: string;
  data: LinkDataType[];
  pagination: {
    limit: number;
    page: number;
    total: number;
  };
  extra: {
    mostVisitedCount: number;
  };
}

export interface GetOneLinkResponse {
  status: string;
  data: LinkDataType;
}

export interface LoginMutationType {
  username: string;
  password: string;
}

export interface RegisterMutationType {
  username: string;
  password: string;
  name: string;
}

export interface AddLinkResponse {
  status: string;
  data: {
    id: string;
    slug: string;
    url: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AddLinkMutationType {
  url: string;
  slug: string;
}

export interface EditLinkResponse {
  status: string;
  data: {
    id: string;
    slug: string;
    url: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface EditLinkMutationType {
  url: string;
  slug: string;
}

export interface DeleteLinkResponse {
  status: string;
  data: {
    id: string;
    slug: string;
    url: string;
  };
}

export interface DeleteLinkMutationType {
  id: string;
}
