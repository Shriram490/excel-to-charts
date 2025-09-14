import { PublicClientApplication } from "@azure/msal-browser";
export const msalConfig = {
  auth: {
    clientId: "947cefeb-0c0b-4227-b120-3a947623e0c3",
    authority: "https://login.microsoftonline.com/bedd471f-b37e-49a4-87a5-58b8fcac4375",
    redirectUri: "http://localhost:3000/", 
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);