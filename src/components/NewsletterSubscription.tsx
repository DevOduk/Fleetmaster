"use client";

import { useState } from "react";
import Input from "./form/input/InputField";
import Button from "./ui/button/Button";
import { useToast } from "@/context/ToastContext";

const NewsletterSubscription = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const subscribeToNewsletter = (e) => {
    e.preventDefault();

    showToast("You have been subscribed to daily newsletter!");
    setEmail("")
  };
  return (
    <form onSubmit={(e) => subscribeToNewsletter(e)} className="col-span-12">
      <p className="text-md mb-2 font-semibold text-gray-900 dark:text-white">
        Subscribe to Newsletter
      </p>
      <label className="mb-2 text-xs leading-6 text-gray-700 dark:text-gray-400">
        Get latest news and offers right in your inbox. Cancel anytime!
      </label>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <Input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          placeholder="Enter email address ..."
        />
        <Button type="submit" variant="primary" size="sm">
          Submit
        </Button>
      </div>
    </form>
  );
};
export default NewsletterSubscription;
