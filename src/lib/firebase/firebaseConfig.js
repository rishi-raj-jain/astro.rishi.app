import { GET_ENV } from '@/src/lib/getENV'

export const fireConfig = {
  type: GET_ENV('FIREBASE_type'),
  project_id: GET_ENV('FIREBASE_project_id'),
  private_key_id: GET_ENV('FIREBASE_private_key_id'),
  private_key: GET_ENV('FIREBASE_private_key').replace(/\\n/g, '\n'),
  client_email: GET_ENV('FIREBASE_client_email'),
  client_id: GET_ENV('FIREBASE_client_id'),
  auth_uri: GET_ENV('FIREBASE_auth_uri'),
  token_uri: GET_ENV('FIREBASE_token_uri'),
  auth_provider_x509_cert_url: GET_ENV('FIREBASE_auth_provider_x509_cert_url'),
  client_x509_cert_url: GET_ENV('FIREBASE_client_x509_cert_url'),
}
