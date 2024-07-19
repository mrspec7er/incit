import { PrismaClient } from "@prisma/client";
import { AuthorizationCode } from "simple-oauth2";
import { UserInfo } from "../dto/user_dto";
import bcrypt from "bcryptjs";
import * as mailService from "./mail_service";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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

export async function oauthCallback(code: string, provider: string) {
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

  return user;
}

export const registerUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateToken();
  const user = await prisma.user.create({
    data: {
      authProvider: "Email",
      email: email,
      password: hashedPassword,
      verificationToken: verificationToken,
    },
  });

  mailService.sendVerificationEmail(email, verificationToken);

  return user;
};

export const verifyUser = async (token: string) => {
  let user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
    },
  });
  if (user) {
    user = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        verifiedEmail: true,
      },
    });
  }

  return user;
};

export const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export function validatePassword(password: string): boolean {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;

  return (
    hasLowercase && hasUppercase && hasDigit && hasSpecialChar && hasMinLength
  );
}

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return {
      error: "Invalid email",
    };
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      error: "Invalid password",
    };
  }

  const token = jwt.sign({ userId: user.id }, "token_secret", {
    expiresIn: "1h",
  });
  return { user, token };
};
