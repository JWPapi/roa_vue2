import Vue from "vue";
import AuthModal from "../components/AuthModal";
import firebase from "firebase/app";
import "firebase/auth";
import { PROFILES_REFERENCE, AUTH_DOMAIN } from "../db";
import axios from "axios";

function parseName(name = "") {
  const result = {};
  if (name) {
    // name tokens for spanish names
    const nameTokens =
      name.match(
        /[A-ZÁ-ÚÑÜ][a-zá-úñü]+|([aeodlsz]+\s+)+[A-ZÁ-ÚÑÜ][a-zá-úñü]+/g
      ) || [];

    if (nameTokens.length > 3)
      result.firstName = nameTokens.slice(0, 2).join(" ");
    else result.firstName = nameTokens.slice(0, 1).join(" ");

    if (nameTokens.length > 2) result.lastName = nameTokens.slice(-2).join(" ");
    else result.lastName = nameTokens.slice(-1).join(" ");
  }
  return result;
}

const AuthPlugin = {
  install(Vue) {
    const auth = Vue.observable({
      currentUser: null,
      _tokenCookieKey: 'roa_token',
      get loggedIn() {
        if (this.loading) return false;
        return Object.keys(this.currentUser).length !== 0;
      },
      get loading() {
        return !this.currentUser;
      },
      _removeTokenCookie() {
        document.cookie = `${this._tokenCookieKey}=;max-age=-1`;
      },
      _setTokenCookie(value) {
        document.cookie = `${this._tokenCookieKey}=${value.token};expires=${value.expirationTime};samesite=Strict;`
      },
      _showAuthModal(initialView = "login") {
        return new Promise((resolve, reject) => {
          const authModalClass = Vue.extend(AuthModal);
          const authModalInstance = new authModalClass({
            propsData: { initialView },
          });
          authModalInstance.$mount();
          authModalInstance.$on("success", (value) => resolve(value));
          authModalInstance.$on("cancel", () =>
            reject(new Error("Action cancelled by user."))
          );
          document.documentElement.appendChild(authModalInstance.$el);
        });
      },
      showLogin(redirect = null) {
        return this._showAuthModal("login").then(() => {
          if (redirect) location.href = redirect;
        });
      },
      async signOut() {
        return await firebase.auth().signOut();
      },
      get provider() {
        return firebase.auth().currentUser.providerData[0].providerId;
      },
      async reauthenticateEmailUser(password) {
        const credential = firebase.auth.EmailAuthProvider.credential(
          firebase.auth().currentUser.email,
          password
        );
        await firebase
          .auth()
          .currentUser.reauthenticateWithCredential(credential);
      },
      async updateEmail(newEmail) {
        await firebase.auth().currentUser.updateEmail(newEmail);
        PROFILES_REFERENCE.doc(this.currentUser.uid).set(
          { email: newEmail },
          {
            merge: true,
          }
        );
        firebase.auth().currentUser.sendEmailVerification();
        this.currentUser.email = newEmail;
      },
      async reauthenticate() {
        if (this.provider === "password") {
          await this._showAuthModal("confirm-password");
        } else if (this.provider === "google.com") {
          await firebase
            .auth()
            .currentUser.reauthenticateWithPopup(
              new firebase.auth.GoogleAuthProvider()
            );
        }
      },
      async recoverEmail() {
        const params = new URLSearchParams(location.search);
        const code = params.get("oobCode");
        try {
          const { data } = await firebase.auth().checkActionCode(code);
          await firebase.auth().applyActionCode(code);
          Vue.roast.success("Your email was recovered successfully.");
          window.history.replaceState({}, null, "/profile");
        } catch (error) {
          Vue.roast.error(error.message);
        }
      },
      async updateProfile(profile) {
        if (profile.firstName || profile.lastName) {
          await firebase.auth().currentUser.updateProfile({
            displayName: `${profile.firstName} ${profile.lastName}`,
          });
        }
        await PROFILES_REFERENCE.doc(this.currentUser.uid).set(profile, {
          merge: true,
        });
        Object.assign(this.currentUser, profile);
        return this.currentUser;
      },
      async loginWithPopup(provider) {
        const resp = await firebase.auth().signInWithPopup(provider);
        const {
          user,
          additionalUserInfo: { profile },
        } = resp;
        const firstName = profile.given_name || profile.first_name;
        const lastName = profile.family_name || profile.last_name;
        const birthday = profile.birthday?.substring(0, 5);
        const data = {
          ...(firstName && lastName
            ? { firstName, lastName }
            : parseName(user.displayName)),
          email: user.email,
        };
        if (birthday) data["birthday"] = birthday;
        await PROFILES_REFERENCE.doc(user.uid).set(data, { merge: true });
        return user;
      },
      async loginWithApple() {
        const appleAuthProvider = new firebase.auth.OAuthProvider("apple.com");
        await this.loginWithPopup(appleAuthProvider);
      },
      async loginWithGoogle() {
        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
        googleAuthProvider.addScope(
          "https://www.googleapis.com/auth/userinfo.profile"
        );
        await this.loginWithPopup(googleAuthProvider);
      },
      async loginWithFacebook() {
        const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
        // facebookAuthProvider.addScope("user_birthday");
        await this.loginWithPopup(facebookAuthProvider);
      },
      async loginWithEmail({ email }) {
        await axios.post(`https://${AUTH_DOMAIN}/login`, {
          continueUrl: window.location.href,
          email,
        });
        window.localStorage.setItem("loginEmail", email);
        return email;
      },
      async loginWithLink() {
        let email = window.localStorage.getItem("loginEmail");
        if (!email) email = await this._showAuthModal("verifyEmail");
        const {
          user,
          additionalUserInfo,
        } = await firebase
          .auth()
          .signInWithEmailLink(email, window.location.href);
        if (additionalUserInfo.isNewUser) {
          await PROFILES_REFERENCE.doc(user.uid).set(
            { email },
            { merge: true }
          );
          await this._showAuthModal("addPersonalInformation");
        }
        const getParams = new URLSearchParams(location.search);
        const url = getParams.get("continueUrl");
        window.localStorage.removeItem("loginEmail");
        if (window.location.href !== url) window.location.href = url;
        else window.history.replaceState({}, null, location.pathname);
        return user;
      },
    });
    let unsubscribeFunction;
    firebase.auth().onAuthStateChanged(async function(user) {
      if (user) {
        const userEntry = await PROFILES_REFERENCE.doc(user.uid).get();
        // listen for events from server
        unsubscribeFunction = PROFILES_REFERENCE.doc(user.uid).onSnapshot(
          (doc) => {
            const userData = doc.data();
            auth.currentUser = {
              ...auth.currentUser,
              ...userData,
            };
          }
        );
        // initially set data on login
        const userEntryData = userEntry.data();
        auth.currentUser = {
          ...user,
          ...userEntryData,
          displayName:
            user.displayName ||
            `${userEntryData.firstName} ${userEntryData.lastName}`,
        };
        user.getIdTokenResult().then((token) => auth._setTokenCookie(token));
      } else {
        auth.currentUser = {};
        auth._removeTokenCookie();
        if (unsubscribeFunction) unsubscribeFunction();
      }
    });
    Vue.prototype.$auth = auth;
    Vue.auth = auth;
  },
};
Vue.use(AuthPlugin);
