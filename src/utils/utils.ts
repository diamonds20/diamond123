// utils.ts
import { CONSTANT } from '../constants/constants';

export function getToken(): string | null {
  return localStorage.getItem(CONSTANT.TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(CONSTANT.TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(CONSTANT.TOKEN_KEY);
}