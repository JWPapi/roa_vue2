import Vue from "vue";
import * as Sentry from "@sentry/vue";

if(window.roa?.sentry) {
  Sentry.init({
    Vue,
    dsn: window.roa.sentry,
    environment: process.env.NODE_ENV,
    allowUrls: [/returnonart\.com/],
    sendDefaultPii: true,
    logErrors: process.env.ENV !== 'production',
    release: getRelease()
  });
}

function getRelease() {
  if (document.currentScript) {
    const matches = document.currentScript.src.match(/=([a-z0-9]{20})/);

    if (matches && matches[1]) {
      return matches[1];
    }
  }

  return null;
}