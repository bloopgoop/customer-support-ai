"use client";

import {
  Typography,
  Box,
  Container,
  TextField,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import {
  ArrowBackRounded,
  SendRounded,
  HiveRounded,
} from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BotMessage } from "@/app/chat/components/BotMessage";
import { UserMessage } from "@/app/chat/components/UserMessage";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageLiked, setMessageLiked] = useState(false)
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    console.log("scrolling");

    setTimeout(() => {
      (messagesEndRef.current as HTMLElement | null)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const toggleLikeMessage = () => {
    message ? setMessageLiked(false) : setMessageLiked(true)
  }

  const sendMessage = () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    // We'll implement this function in the next section
    setMessage(""); // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message }, // Add the user's message to the chat
      { role: "assistant", content: "" }, // Add a placeholder for the assistant's response
    ]);

    // try {
    //   const response = await fetch("/api/chat", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify([...messages, { role: "user", content: message }]),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }

    //   const reader = response.body?.getReader();
    //   const decoder = new TextDecoder();

    //   while (true) {
    //     const { done, value } = await (
    //       reader as ReadableStreamDefaultReader
    //     ).read();
    //     if (done) break;
    //     const text = decoder.decode(value, { stream: true });
    //     setMessages((messages) => {
    //       let lastMessage = messages[messages.length - 1];
    //       let otherMessages = messages.slice(0, messages.length - 1);
    //       return [
    //         ...otherMessages,
    //         { ...lastMessage, content: lastMessage.content + text },
    //       ];
    //     });
    //   }
    // } catch (error) {
    // console.error("Error:", error);
    // setMessages((messages) => [
    //   ...messages,
    //   {
    //     role: "assistant",
    //     content:
    //       "I'm sorry, but I encountered an error. Please try again later.",
    //   },
    // ]);
    // }
    setIsLoading(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "900px",
      }}
      maxWidth={false}
    >
      <Box
        component="nav"
        sx={{
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          py: 2,
          top: 0,
        }}
      >
        <ArrowBackRounded
          sx={{
            position: "absolute",
            left: 0,
            color: "white",
            fontSize: "30px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/explore")}
        />
        <Typography sx={{ fontWeight: "bold", color: "white" }} variant="h5">
          --CHAT BOT NAME--
        </Typography>
      </Box>

      <Stack
        direction={"column"}
        p={0}
        spacing={3}
        sx={{
          backgroundColor: "secondary.main",
          flexGrow: 1,
          overflowY: "auto",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
        }}
      >
        <OverlayScrollbarsComponent defer>
          <Stack
            id="chat-box"
            direction={"column"}
            spacing={2}
            flexGrow={1}
            maxHeight="100%"
            sx={{
              p: 2,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                {message.role === "assistant" ? (
                  <BotMessage
                    messageLiked={messageLiked}
                    setMessageLiked={setMessageLiked}
                    message={message.content}
                    bot={{
                      name: "Bot",
                      id: 1,
                      description: "",
                      created_at: new Date(),
                      updated_at: new Date(),
                    }}
                  />
                ) : (
                  <UserMessage message={message.content} user={{uid:"123"}} />
                )}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
        </OverlayScrollbarsComponent>
      </Stack>

      <Box
        component={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        sx={{
          display: "flex",
          gap: 1,
          py: 3,
        }}
      >
        <TextField
          fullWidth
          autoFocus
          minRows={1}
          variant="outlined"
          label="Ask anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            backgroundColor: "white",
            borderRadius: "10px",
            // "&:focus": {
            //   backgroundColor: "black",
            //   color: "white",
            // },
          }}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          sx={{
            backgroundColor: "primary.main",
            color: "black",
            borderRadius: "10px",
          }}
        >
          <SendRounded />
        </Button>
      </Box>
    </Container>
  );
}
