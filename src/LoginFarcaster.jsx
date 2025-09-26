import React, { useState } from "react";
import {
  AuthKitProvider,
  SignInButton,
} from "@farcaster/auth-kit";

export default function LoginFarcaster({ onLogin }) {
  return (
    <AuthKitProvider
      config={{
        // RPC Neynar untuk Farcaster
        rpcUrl: "https://api.neynar.com/v2/farcaster",
        // optional: appId yang kamu dapat di Neynar dashboard
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold">Login dengan Farcaster</h2>
        <SignInButton
          onSuccess={(user) => {
            // user berisi fid, username, signature
            console.log(user);
            onLogin(user); // kirim ke parent
          }}
        />
      </div>
    </AuthKitProvider>
  );
}