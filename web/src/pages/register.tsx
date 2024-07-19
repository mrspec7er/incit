// src/Components/Login.js
import React, { useState } from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import { BiLogoFacebook } from "react-icons/bi";

const Register = () => {
  async function oauthSignUp(provider: string) {
    const loginURL = await fetch(
      `${import.meta.env.VITE_BASE_URL}/users/signup?provider=${provider}`
    ).then((res) => res.json());

    console.log(loginURL);
    window.location.href = loginURL;
  }

  async function emailRegister() {
    const token = await fetch(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    ).then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        window.alert("Invalid Password");
        return;
      }

      return res.json();
    });

    // Don't have any resource to send verification token via email, so i use alert instead
    if (token) {
      const confirmation = window.confirm(
        `Copy this url to your browser ${
          import.meta.env.VITE_BASE_URL
        }/users/verify?token=${token}`
      );

      if (confirmation) {
        window.location.href = "/";
      }
    }
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image"
        />
      </div>
      <div className="md:w-1/3 max-w-sm">
        <div className="text-center md:text-left">
          <label className="mr-1">Register with</label>
          <button
            type="button"
            className="mx-1 h-9 w-9  rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_9px_-4px_#3b71ca]"
          >
            <BiLogoFacebook
              size={20}
              className="flex justify-center items-center w-full"
            />
          </button>
          <button
            onClick={() => oauthSignUp("Google")}
            type="button"
            className="inlne-block mx-1 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
          >
            <AiOutlineGoogle
              size={20}
              className="flex justify-center items-center w-full"
            />
          </button>
        </div>
        <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0 text-center font-semibold text-slate-500">
            Or
          </p>
        </div>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
          type="text"
          placeholder="Email Address"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="password"
          placeholder="Password"
        />
        <div className="text-center md:text-left">
          <button
            onClick={emailRegister}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
            type="button"
          >
            Register
          </button>
        </div>
      </div>
    </section>
  );
};

export default Register;
