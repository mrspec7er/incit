import { PrismaClient } from "@prisma/client";
import {
  ClientCredentials,
  ResourceOwnerPassword,
  AuthorizationCode,
} from "simple-oauth2";
import { UserInfo } from "../dto/user_dto";

const prisma = new PrismaClient();

const client = new AuthorizationCode({
  client: {
    id: "507725183561-lnp17h8g0s7emj09efl0oalrnirlcsl1.apps.googleusercontent.com",
    secret: "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",
  },
  auth: {
    tokenHost: "https://accounts.google.com",
    tokenPath: "/o/oauth2/token",
    authorizePath: "/o/oauth2/auth",
  },
});

export async function getAuthorizationURI(provider: string) {
  const authorizationUri = client.authorizeURL({
    redirect_uri: `http://localhost:8080/users/callback?provider=${provider}`,
    scope: ["openid", "profile", "email"],
    state: "random_state_string",
  });

  return authorizationUri;
}

export async function getAllUsers() {
  const users = await prisma.user.findMany();

  return users;
}

export async function authCallback(code: string, provider: string) {
  const options = {
    code,
    redirect_uri: `http://localhost:8080/users/callback?provider=${provider}`,
  };

  const accessToken = await client.getToken(options);

  var userData: UserInfo;

  if (provider == "Google") {
    userData = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken.token.access_token}`,
      },
    }).then((res) => res.json());
  }

  const user = await prisma.user.upsert({
    where: { email: userData.email },
    create: {
      authProvider: "Google",
      email: userData.email,
    },
    update: {
      loginCount: {
        increment: 1,
      },
    },
  });

  console.log("PROVIDER: ", provider);

  return user;
}
