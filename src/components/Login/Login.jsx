import React, { useState } from "react";
import styles from "./Login.module.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, database } from "../Lib/Firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../Lib/Upload";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged In Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const imgURL = await upload(avatar.file);
      await setDoc(doc(database, "users", response.user.uid), {
        username,
        email,
        avatar: imgURL,
        id: response.user.uid,
        blocked: [],
        notifications: [],
      });
      await setDoc(doc(database, "userchats", response.user.uid), {
        chats: [],
      });
      toast.success("You are Registered Successfully. Login to Continue");
      e.target.reset(); // Reset the form
      setAvatar({ file: null, url: "" }); // Reset the avatar state
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.item}>
        <h2>Welcome Back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* SEPARATOR */}
      <div className={styles.separator}></div>
      <div className={styles.item}>
        <h2>Create An Account</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Email" name="email" />
          <input type="text" placeholder="Username" name="username" />
          <input type="password" placeholder="Password" name="password" />
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload An Image
          </label>
          <input type="file" id="file" hidden onChange={handleAvatar} />

          <button disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
