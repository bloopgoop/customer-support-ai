"use client";

import {
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import {
  HiveRounded,
} from "@mui/icons-material";
import { Message } from "@/types/message";
import { Bot } from "@/types/bot";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { useAuth } from "@/context/auth-context";
import { updateChatbotLikes } from "@/app/action";
import { useState } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function BotMessage({ 
  message, 
  bot 
}: { 
  message: Message; // TODO: replace string with Message type
  bot: Bot | null
}) {
  // State to manage the like status
  const [liked, setLiked] = useState(message.liked || false);
  const { user } = useAuth()
  
  const toggleLikeMessage = async () => {
    setLiked(!message.liked)
    message.liked = !message.liked
    await updateChatbotLikes(bot, !message.liked)
  }
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1,
  }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            backgroundColor: "black",
          }}
        >
          <HiveRounded
            sx={{
              color: "primary.main",
            }}
          />
        </Avatar>
        <Typography
          variant="caption"
          sx={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          
          {bot?.name} 
        </Typography>
      </Box>
      <Box
        bgcolor={"white"}
        color="black"
        sx={{
          p: 2,
          borderRadius: "15px",
        }}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
        <Box 
          sx={{display: "flex", justifyContent:"flex-end"}}
        >
          {message.hasOwnProperty('liked') && user && message.content && <ThumbUpOffAltIcon onClick={toggleLikeMessage} sx={{transition: 'color 0.3s, transform 0.3s',
            color: liked ? "primary.main" : "black",
            '&:hover': {
              color: "primary.main", // Change color on hover
              transform: 'scale(1.1)', // Slightly enlarge on hover
            }, }}/>}
        </Box>
      </Box>
    </Box>
  );
}
