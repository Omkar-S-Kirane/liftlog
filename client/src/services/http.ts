import axios from 'axios'

import { getApiBaseUrl } from '@/utils/env'

export const http = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
})
