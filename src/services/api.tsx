import Service from "./service";

export default {
  RegisterUser: (body: any) => {
    return Service(false).post('/auth/register', body);
  },

  Login: (body: any) => {
    return Service(false).post('/auth/login', body);
  },

  ListClients: () => {
    return Service(true).get('/clients');
  },

  CreateClient: (body: any) => {
    return Service(true).post('/clients', body);
  },

  UpdateClient: (id: string, body: any) => {
    return Service(true).put(`/clients/${id}`, body);
  },

  DeleteClient: (id: string) => {
    return Service(true).delete(`/clients/${id}`);
  },
};
