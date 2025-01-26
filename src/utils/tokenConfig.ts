import { getNewAccessToken } from "../store/authActions";
import { store } from "../store/store";


class TokenConfig {
  static TOKEN_KEY = "accessToken";

  static saveToken(token: string) {
    localStorage.setItem(TokenConfig.TOKEN_KEY, token);
  }
  static getToken() {
    return localStorage.getItem(TokenConfig.TOKEN_KEY)
  }
  static async refreshToken() {
    const res = await store.dispatch(getNewAccessToken());
    return res;
  }
}
export default TokenConfig;