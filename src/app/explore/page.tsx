'use client'
import { Typography, Box, Container, Stack, Button } from "@mui/material";
import HistoryCard from "./components/HistoryCard";
import ChatbotCard from "./components/ChatbotCard";
import Link from "next/link";
import { useState } from "react";

export default function Explore() {
  const [user, setUser] = useState(null);

  return (
    <Container sx={{display: "flex", flexDirection:"column", maxWidth:"900px"}} maxWidth={false}>


      <Box sx={{flexGrow:1, p:2}}>
        <Typography sx={{mb:8, fontWeight: 'bold', color:"white"}} variant="h4">Explore</Typography>

        <Stack spacing={8}>
          <ChatbotCard chatbotLikes={5} chatbotName={"ChefAI"} reverse={false}/>
          <ChatbotCard chatbotLikes={5} chatbotName={"ChefAI"} reverse={true}/>
          <ChatbotCard chatbotLikes={5} chatbotName={"ChefAI"} reverse={false}/>
        </Stack>
      </Box>


      <Box p={2}>
        <Box sx={{position:"relative"}}>
          <Box sx={{display: "flex", justifyContent:"space-between", alignItems:"center",filter: user ? 'none' : 'blur(8px)'}}>
            <Typography sx={{fontWeight: 'bold', color:"white"}} variant="h4">History</Typography>
            <Link href="/chat">
              <Typography sx={{fontWeight: 'light', color:"white", textDecoration: "underline"}}>See all</Typography>
            </Link>
          </Box>
          {/* This should be the user's chat history  */}
          <Box sx={{filter: user ? 'none' : 'blur(5px)'}}>
            <HistoryCard chatTitle="UI/UX Design for new era"/>
            <HistoryCard chatTitle="UI/UX Design for new era"/>
            <HistoryCard chatTitle="UI/UX Design for new era"/>
          </Box>
          {!user && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: "rgb(0,0, 0 / 50%)", // Optional: semi-transparent to indicate blocking
                zIndex: 99, // Ensure it is on top of other content
                display: 'flex',
                alignItems: 'center', // Center vertically
                justifyContent: 'center',
              }}
            > 
              <Box>
                <Typography color={"primary.main"} sx={{fontSize:24, mb:2}}>Log In To Access</Typography>
                <Button sx={{
                  fontSize: 32, // Increase font size
                  padding: '12px 32px', // Increase padding for height and width
                  borderRadius: "12px",
                }} variant="outlined">
                  Log In
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>


    </Container>
  )
}