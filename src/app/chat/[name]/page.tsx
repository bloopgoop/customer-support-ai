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
import { useAuth } from "@/app/providers";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { getChatbot } from "@/app/action";
import { Bot } from "@/types/bot";
import { Message } from "@/types/message";

export default function ChatPage({ params }: { params: { name: string } }) {
  
  // Message : {
  //      role: "user" | "assistant";
  //      content: string;
  // }

  // chatHistory: Message[]


  // Assume user is logged in => user is authenticated in the server on the request to this page
  // if successful
  //    read from db to get the Conversation in history with this chatbot 
  //   ( this will look something like user_collection -> user_doc(id) -> history_collection -> history_doc(id) where history.chatbotName === params.name )
  //    the previous messages for this convo will be rendered
  //    New messages will be appended to the messages array[] and saved to the database[]
  // else 
  //    we are redirected to this page with no messages
  //   ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // Assume user is not logged in => this is a chat convo with no messages.
  // user messages with chatbot, storing messages in some type of array []
  // if user decides to log in to an account 
  //      From the params we get the Name of the chatbot. (This acts like an ID) 
  //      create a Conversation using the chatbotName and the messages array and save to that user doc's history colelction
  //
  const router = useRouter();
  const { user } = useAuth();
  const [currentChatbot, setCurrentChatbot] = useState<Bot | null>(null)
  const [messages, setMessages] = useState<Message[]>([
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

  useEffect(() => {
    const fetchCurrentChatbot = async () => {
      const botRef = await getChatbot(params.name)
      setCurrentChatbot(botRef)
    }
    fetchCurrentChatbot()
  }, [])

  // const EnterKeyDetector = () => {
  //   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //     if (event.key === 'Enter') {
  //       sendMessage();
  //     }
  //   };

  const scrollToBottom = () => {

    setTimeout(() => {
      (messagesEndRef.current as HTMLElement | null)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const sendMessage = () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    // We'll implement this function in the next section
    setMessage(""); // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message }, // Add the user's message to the chat
      { role: "assistant", content: "", liked: false }, // Add a placeholder for the assistant's response
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
          {params.name.toUpperCase()}
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
                    message={message}
                    bot={currentChatbot}
                  />
                ) : (
                  <UserMessage message={message} user={user} />
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
