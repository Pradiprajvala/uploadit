"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordValidator from "password-validator";
import { signIn } from "next-auth/react";
import Spinner from "@/app/components/Spinner";
import Check from "@/app/components/Check";
import Cross from "@/app/components/Cross";

var passwordSchema = new PasswordValidator();
passwordSchema.is().min(8); // Minimum length 8
var usernameSchema = new PasswordValidator();
usernameSchema.is().min(3); // Minimum length 8

function SignIn() {
  const [login, setLogin] = useState(true);
  const [confirmPasswordNotMatchedError, setConfirmPasswordNotMatchedError] =
    useState(false);
  const [shortPasswordError, setShortPasswordError] = useState(false);
  const [usernameAlreadyUsedError, setUsernameAlreadyUsedError] =
    useState(false);
  const [invalidUsernameError, setInvalidUsernameError] = useState(false);
  const [invalidCredentialsError, setInvalidCredentialsError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginInvalidCredentials, setLoginInvalidCredentials] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   if (urlParams.get(name) === "CredentialsSignin")
  //     setLoginInvalidCredentials(true);
  // }, []);

  const checkUsernameAvailable = async (username) => {
    if (username === "") return;
    try {
      setIsCheckingUsername(true);
      setIsUsernameAvailable(false);
      setUsernameAlreadyUsedError(false);
      const formData = new FormData();
      formData.append("username", username);
      const data = await fetch("/api/users/validateUsername", {
        method: "POST",
        body: formData,
      });
      const res = await data.json();
      if (res.isUsernameAvailable) {
        setIsUsernameAvailable(true);
        setUsernameAlreadyUsedError(false);
      } else {
        setIsUsernameAvailable(false);
        setUsernameAlreadyUsedError(true);
      }
      setIsCheckingUsername(false);
    } catch (error) {
      console.log(error);
    }
  };

  const checkCredentialsNotValid = () =>
    !validateConfirmPassword() ||
    !validatePassword() ||
    !validateUsername() ||
    !isUsernameAvailable;

  const validatePassword = () => {
    setShortPasswordError(!passwordSchema.validate(password));
    setConfirmPasswordNotMatchedError(
      confirmPassword !== "" && password !== confirmPassword
    );
    return passwordSchema.validate(password);
  };

  const validateConfirmPassword = () => {
    setConfirmPasswordNotMatchedError(
      confirmPassword !== "" && password !== confirmPassword
    );
    return confirmPassword !== "" && password === confirmPassword;
  };

  const validateUsername = async (username) => {
    try {
      await checkUsernameAvailable(username);
      setInvalidUsernameError(!usernameSchema.validate(username));
      return usernameSchema.validate(username);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = async () => {
    if (checkCredentialsNotValid()) {
      setInvalidCredentialsError(true);
      return;
    } else {
      setInvalidCredentialsError(false);
    }
    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("password", password);
    try {
      const res = await fetch("/api/users/createAccount", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === 201) {
        await signIn("credentials", {
          username: data.username,
          password: data.password,
          callbackUrl: process.env.BASE_URL || "localhost:3000",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!login) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="w-full md:max-w-md sm:max-w-sm max-w-md m-2 items-center justify-center">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
              Create your account to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="Enter a new username"
                    onBlur={(e) => validateUsername(e.target.value)}
                    onChange={async (e) => {
                      setUsername(e.target.value);
                      validateUsername(e.target.value);
                    }}
                  />
                  {isCheckingUsername && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Spinner />
                    </div>
                  )}
                  {isUsernameAvailable && !invalidUsernameError && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Check />
                    </div>
                  )}
                  {usernameAlreadyUsedError && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Cross />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {usernameAlreadyUsedError && (
              <div className="text-red-500 font-medium">
                Username is already been used.
              </div>
            )}
            {invalidUsernameError && (
              <div className="text-red-500 font-medium">
                Enter a minimum 3 character username.
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a password"
                onBlur={validatePassword}
                onChange={(e) => setPassword(e.target.value)}
              />
              {shortPasswordError && (
                <div className="text-red-500 font-medium">
                  Please enter minimum 8 character password.
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                onBlur={validateConfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPasswordNotMatchedError && (
                <div className="text-red-500 font-medium">
                  Password and Confirm password does not match.
                </div>
              )}
              {invalidCredentialsError && (
                <div className="text-red-500 font-medium">
                  Please enter valid credentials.
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleRegister}>
              Register
            </Button>
          </CardFooter>
          <div
            className="w-full text-black-500 flex items-center justify-center mb-6 cursor-pointer"
            onClick={() => setLogin(true)}
          >
            Existing User? Log In
          </div>
        </Card>
      </div>
    );
  }

  const handleLogin = async () => {
    if (loginPassword === "" || loginUsername === "") {
      setLoginInvalidCredentials(true);
      return;
    } else setLoginInvalidCredentials(false);
    try {
      await signIn("credentials", {
        username: loginUsername,
        password: loginPassword,
        callbackUrl: process.env.BASE_URL || "http://localhost:3000",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full md:max-w-md sm:max-w-sm max-w-md m-2">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your email and password to sign in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            {/* <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm underline" prefetch={false}>
                Forgot password?
              </Link>
            </div> */}
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          {loginInvalidCredentials && (
            <div className="text-red-500 font-medium">Invalid Credentials</div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleLogin} className="w-full">
            Sign In
          </Button>
        </CardFooter>
        <div
          className="w-full text-black-500 flex items-center justify-center mb-6 cursor-pointer"
          onClick={() => setLogin(false)}
        >
          New User? Register
        </div>
      </Card>
    </div>
  );
}

export default SignIn;
