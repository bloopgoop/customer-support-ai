import {
  doc,
  setDoc,
  getDocs,
  collection,
  addDoc,
  increment,
  updateDoc,
  getDoc,
  arrayUnion,
  query,
  where,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import { User } from "firebase/auth";
import { Conversation } from "@/types/conversation";
import { Message } from "@/types/message";
import { Bot } from "@/types/bot";


export async function saveUserToDatabase(user: User) {
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    },
    { merge: true }
  );
}
export async function getChatbot(name: string): Promise<Bot | null> {
  try {
    // Reference the document with the ID that matches the name parameter
    const chatbotDocRef = doc(db, "chatbots", name);
    // Fetch the document
    const docSnapshot = await getDoc(chatbotDocRef);

    // Check if the document exists
    if (docSnapshot.exists()) {
      // Retrieve the document data
      const data = docSnapshot.data();
      // Ensure that the data matches the Bot type
      // You might want to add checks or default values if some fields can be missing
      const chatbot: Bot = {
        name: data.name,
        description: data.description,
        likes: data.likes || 0,
        prompt: data.prompt,
      };

      return chatbot;
    } else {
      console.log("No chatbot found with the specified ID");
      return null;
    }
  } catch (error) {
    console.error("Error fetching chatbot:", error);
    // Handle the error
    return null;
  }
}
export async function createExploreChatbot({ name, likes, description }: Bot) {
  await setDoc(doc(db, "chatbots", name), {
    name: name,
    likes: likes,
    description: description,
  });
}
export async function getAllExploreChatbots() {
  const querySnapshot = await getDocs(collection(db, "chatbots"));
  return querySnapshot;
}

export async function createChatHistory(
  /**
   * initialize a new conversation with the chatbot
   */
  user: User,
  conversation: Conversation
) {
  const userRef = doc(db, "users", user.uid);
  const historyCollectionRef = collection(userRef, "history");
  const docRef = await addDoc(historyCollectionRef, conversation);
  return docRef
}

export async function getAllChatHistories(user: User) {
  try {
    const userRef = doc(db, "users", user.uid);
    const historyCollectionRef = collection(userRef, "history");
    const querySnapshot = await getDocs(historyCollectionRef);
    return querySnapshot;
  } catch (error) {
    console.error("Error fetching chat histories:", error);
    throw new Error("Failed to fetch chat histories");
  }
}
export async function updateChatbotLikes(bot: Bot | null, like: boolean) {
  if (!bot) {
    console.log("Cannot find bot so cannot increment likes");
    return;
  }
  try {
    const chatbotRef = doc(db, "chatbots", bot.name);
    const update = like ? increment(1) : increment(-1);
    await updateDoc(chatbotRef, {
      likes: update,
    });
  } catch (error) {
    console.error("Error updating likes:", error);
  }
}
export async function createMessage(message: Message) {
  try {
    await addDoc(collection(db, "messages"), message);
  } catch (error) {
    console.error("Error adding message:", error);
  }
}
export async function moveMessagesToUserHistory(
  userId: string,
  chatbotName: string,
  messages: Message[]
) {
  try {
    // Reference the user's 'history' subcollection
    const userHistoryCollectionRef = collection(
      doc(db, "users", userId),
      "history"
    );

    const q = query(
      collection(db, userHistoryCollectionRef.path),
      where("chatbotName", "==", chatbotName)
    );
    const querySnapshot = await getDocs(q);
    const chatbotDoc = querySnapshot.docs[0];
    await updateDoc(chatbotDoc.ref, {
      chatHistory: arrayUnion(...messages),
    });
  } catch (error) {
    console.error("Error adding message to history:", error);
    // Handle the error, e.g., show a message to the user
  }
}

export async function addMessageToHistory(
  userId: string,
  chatbotName: string,
  message: Message
) {
  /**
   * user: {
   * history: [{
   *   chatBot: {
   *     messages: []
   *     name: string
   *     id: 12312312 //autogenerated
   *   }
   * }]
   * }
   */

  try {
    // Reference the user's 'history' subcollection
    const userHistoryCollectionRef = collection(
      doc(db, "users", userId),
      "history"
    );

    const q = query(
      collection(db, userHistoryCollectionRef.path),
      where("chatbotName", "==", chatbotName)
    );
    const querySnapshot = await getDocs(q);
    const chatbotDoc = querySnapshot.docs[0];
    await updateDoc(chatbotDoc.ref, {
      chatHistory: arrayUnion(message),
    });
  } catch (error) {
    console.error("Error adding message to history:", error);
    // Handle the error, e.g., show a message to the user
  }
}

export async function getChatHistory(
  userId: string | undefined,
  chatbotName: string
) {
  if (!userId) {
    console.error("User ID is required to fetch chat history");
    return;
  }
  try {
    // Reference the user's 'history' subcollection
    const userHistoryCollectionRef = collection(
      doc(db, "users", userId),
      "history"
    );

    const q = query(
      collection(db, userHistoryCollectionRef.path),
      where("chatbotName", "==", chatbotName)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Get the first document from the query result
      const chatbotDoc = querySnapshot.docs[0];
      return chatbotDoc.data(); // Return the data of the first document
    } else {
      // Return null if no documents were found
      return null;
    }
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return null;
  }
    // TODO: Handle case where there are no chat histories
    // check if querySnapshot is empty, 
    // if empty:
    //    create a new Conversation()
    //    save to db
    // else:
    //    return the first in the querySnapshot 
    //    ^
    //    |
    //    const chatbotDoc = querySnapshot.docs[0];



    // return chatbotDoc.data();
}
