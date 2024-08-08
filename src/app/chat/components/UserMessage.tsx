"use client";

import { Typography, Box, Avatar } from "@mui/material";
import { HiveRounded } from "@mui/icons-material";
import { Message } from "@/types/message";
import { GoogleUser } from "@/types/google-user";

export function UserMessage({
  message,
  user,
}: {
  message: string; // TODO: replace string with Message type
  user: GoogleUser;
}) {
  console.log(user)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          {user.displayName}
        </Typography>
        <Avatar
          sx={{
            backgroundColor: "black",
          }}
          src={user.photoURL}
          slotProps={{ img: { referrerPolicy: "no-referrer" } }}
        >
          {/* <HiveRounded
                sx={{
                  color: "primary.main",
                }}
              /> */}
        </Avatar>
      </Box>
      <Box
        bgcolor={"primary.main"}
        color="black"
        sx={{
          p: 2,
          borderRadius: "15px",
        }}
      >
        {message}
      </Box>
    </Box>
  );
}
