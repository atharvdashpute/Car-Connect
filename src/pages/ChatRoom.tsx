import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL || "/");

const ChatRoom = () => {
  const { roomId } = useParams();
  const [msgs, setMsgs] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("join", { room: roomId });

    socket.on("message", (m) => setMsgs((p) => [...p, m]));
    return () => {
      socket.off("message");
      socket.emit("leave", { room: roomId });
    };
  }, [roomId]);

  function send() {
    if (!text) return;
    socket.emit("message", { room: roomId, text });
    setText("");
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold">Chat about car {roomId}</h2>
      <div className="border rounded h-96 p-3 overflow-auto bg-white">
        {msgs.map((m, i) => <div key={i} className="mb-2"><b>{m.from}</b>: {m.text}</div>)}
      </div>
      <div className="flex gap-2 mt-3">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 p-2 border rounded"/>
        <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
