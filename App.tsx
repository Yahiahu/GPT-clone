import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Button } from 'react-native';

interface Message {
  user: string,
  message: string
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sideMenuButton: {
    padding: 10,
    backgroundColor: '#ccc',
    margin: 10,
    borderRadius: 5,
  },
  chatBox: {
    flex: 1,
  },
  chatLog: {
    flex: 1,
    padding: 10,
  },
  chatInputHolder: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  chatInputTextarea: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  chatMessage: {
    flexDirection: 'row',
    padding: 10,
  },
  message: {
    marginLeft: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
});

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [chatLog, setChatlog] = useState<Message[]>([
    {
      user: 'gpt' as const,
      message: "How can I help you today?"
    }
  ]);

  const chatLogRef = useRef<ScrollView>(null);

  function clearChat() {
    setChatlog([]);
  }

  async function handleSubmit() {
    let chatLogNew = [...chatLog, { user: 'me', message: input }];
    setInput("");
    setChatlog(chatLogNew);

    const messages = chatLogNew.map((message: Message) => message.message).join("\n");

    const response = await fetch("http://192.168.2.204:3090", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messages,
      })
    });

    const data = await response.json();


    setChatlog([...chatLogNew, { user: "gpt", message: data.message }]);
  }


  useEffect(() => {
    chatLogRef.current?.scrollToEnd({ animated: true });
  }, [chatLog]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.sideMenuButton} onPress={clearChat}>
        <Text>New Chat</Text>
      </TouchableOpacity>
      <View style={styles.chatBox}>
        <ScrollView style={styles.chatLog} ref={chatLogRef}>
          {chatLog.map((message: Message, index: number) => (
            <ChatMessage key={index} message={message} />
          ))}
        </ScrollView>
        <View style={styles.chatInputHolder}>
        <TextInput
          multiline
          value={input}
          onChangeText={(text: string) => setInput(text)}
          style={styles.chatInputTextarea}
          placeholder="Type your message here" 
        />
        <Button title="Send" onPress={handleSubmit} />  
        
        </View>
      </View>
    </View>
  );
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <View style={[styles.chatMessage, message.user === "gpt" && {alignItems: 'flex-end'}]}>
      <View style={styles.avatar}></View>
      <Text style={[styles.message, {flexShrink: 1}]}>{message.message}</Text>
    </View>
  );
};

export default App;