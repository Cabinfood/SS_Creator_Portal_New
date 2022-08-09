import { parseCookies, setCookie, destroyCookie } from "nookies";

class CookieLib {
  getCookie(field) {
    return parseCookies(null)[field];
  }

  updateCookie = (field, value) => {
    setCookie(null, field, value, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  };

  deleteCookie = (field) => {
    destroyCookie(null, field, { path: "/" });
  };
}

export default new CookieLib();
