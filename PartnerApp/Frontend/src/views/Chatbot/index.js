import React, { Component } from "react";
import AWS from "aws-sdk";
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import moment from "moment";

class App extends Component {
  constructor(props) {
    super(props);
    // Create a reference to the messages container
    this.messagesEndRef = React.createRef();
    AWS.config.update({
      region: "us-east-1",
      accessKeyId: "",
      secretAccessKey: "",
    });

    this.state = {
      userInput: "",
      conversations: [],
    };
  }

  // Method to scroll to the bottom of the messages container
  // scrollToBottom = () => {
  //   this.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  sendMessageToLex = (message) => {
    const lexruntime = new AWS.LexRuntime();
    const params = {
      botName: "BookBite",
      botAlias: "TestAlias",
      userId: "12313412",
      inputText: message || this.state.userInput,
      sessionAttributes: {
        UserId: "1", // Include the user ID here
      },
    };

    lexruntime.postText(params, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(data);

      const newConversations = [
        ...this.state.conversations,
        { type: "user", content: params.inputText, timestamp: new Date() },
        {
          type: "bot",
          content: data.message,
          responseCard: data.responseCard,
          timestamp: new Date(),
        },
      ];
      this.setState({ conversations: newConversations, userInput: "" });
    });
  };

  // componentDidUpdate() {
  //   this.scrollToBottom();
  // }

  handleCardButtonClick = (value) => {
    this.sendMessageToLex(value);
  };

  renderResponse = (conversation, index) => {
    const isBot = conversation.type === "bot";
    const align = isBot ? "left" : "right";
    const bubbleStyle = {
      padding: "10px",
      borderRadius: "5px",
      display: "inline-block",
      backgroundColor: isBot ? "#e0f7fa" : "#c5e1a5",
      whiteSpace: "pre-line", // This CSS property will make the newline characters effective
    };

    return (
      <Box key={index} textAlign={align} style={{ marginBottom: "10px" }}>
        <div style={bubbleStyle}>
          <Typography variant="body1">{conversation.content}</Typography>
          {isBot && conversation.responseCard
            ? this.renderResponseCard(
                conversation.responseCard.genericAttachments[0]
              )
            : null}
        </div>
        <Typography variant="caption" display="block" gutterBottom>
          {moment(conversation.timestamp).format("HH:mm:ss")}
        </Typography>
      </Box>
    );
  };

  renderResponseCard = (card) => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{card.title}</Typography>
          {card.buttons.map((button, index) => (
            <Button
              key={index}
              variant="outlined"
              style={{ margin: "5px" }}
              onClick={() => this.handleCardButtonClick(button.value)}
            >
              {button.text}
            </Button>
          ))}
        </CardContent>
      </Card>
    );
  };

  render() {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom>
            BookaBite Chat
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              marginBottom: "20px",
            }}
          >
            {this.state.conversations.map(this.renderResponse)}
            <div ref={this.messagesEndRef} />
          </Box>
          <TextField
            label="Type your message"
            variant="outlined"
            fullWidth
            value={this.state.userInput}
            onChange={(e) => this.setState({ userInput: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
            onClick={() => this.sendMessageToLex(this.state.userInput)}
          >
            Send
          </Button>
        </Paper>
      </Container>
    );
  }
}

export default App;
