"use client";

import React, { useState, useRef} from "react";
import { useRouter } from "next/navigation";
import { ContactListtype } from "../types";

interface ContactListDialerProps {
  contactListId: number;
  contactListName: string;
}

interface DialResponse {
  message: string;
  task_id: string;
}

const ContactListDialer: React.FC<ContactListDialerProps> = ({
  contactListId,
  contactListName,
}) => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<DialResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const availableTags = [
    { name: "First Name", tag: "{first_name}" },
    { name: "Last Name", tag: "{last_name}" },
    { name: "City", tag: "{city}" },
    { name: "Phone Number", tag: "{phone_number}" },
  ];
  const insertTag = (tag: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = textareaRef.current.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      setMessage(before + tag + after);
      textareaRef.current.focus();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tag.length;
        }
      }, 0);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    if (!message.trim()) {
      setError("Message is required");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/contact-lists/${contactListId}/dial/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate calls");
      }

      setResponse(data);
      setTaskId(data.task_id); // Store the latest task ID
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === "No access token found") {
          router.push("/login");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkTaskStatus = async () => {
    setIsLoading(true);
    setError(null);
    const idToCheck = taskId.trim() || response?.task_id;

    if (!idToCheck) {
      setError("No task ID available");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/contact-lists/check_dial_status/?task_id=${idToCheck}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDialogMessage(
          `Status: ${data.status}${
            data.result ? ` - Result: ${data.result}` : ""
          }${data.error ? ` - Error: ${data.error}` : ""}`
        );
      } else {
        setDialogMessage(
          `Error: ${data.error || "Failed to check task status"}`
        );
      }
      setShowDialog(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setDialogMessage(`Error: ${err.message}`);
      } else {
        setDialogMessage("An unexpected error occurred");
      }
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };
  const previewMessage = () => {
    let preview = message;
    availableTags.forEach(tag => {
      preview = preview.replace(tag.tag, `[${tag.name}]`);
    });
    return preview;
  };
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Dial Contact List: {contactListName}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <div className="mt-1 relative">
            <textarea
              ref={textareaRef}
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={5}
              placeholder="Enter your message here"
            ></textarea>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.tag}
                  type="button"
                  onClick={() => insertTag(tag.tag)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Message Preview:</h3>
          <p className="text-gray-700">{previewMessage()}</p>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? 'Initiating Calls...' : 'Initiate Calls'}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-600">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-green-100 rounded-md">
          <p className="text-green-700">{response.message}</p>
          <p className="text-sm text-green-600 mt-2">Task ID: {response.task_id}</p>
        </div>
      )}

      <div className="mt-6">
        <label
          htmlFor="taskId"
          className="block text-sm font-medium text-gray-700"
        >
          Task ID (leave blank to use latest)
        </label>
        <input
          type="text"
          id="taskId"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Enter task ID or leave blank"
        />
        <button
          onClick={checkTaskStatus}
          disabled={isLoading}
          className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Check Task Status
        </button>
      </div>

      {showDialog && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Task Status
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">{dialogMessage}</p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={() => setShowDialog(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactListDialer;
