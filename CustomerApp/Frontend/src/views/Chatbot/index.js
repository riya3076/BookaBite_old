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
      currentCardIndex: 0,
      totalCards: 0,
    };
  }

  sendMessageToLex = (message) => {
    const lexruntime = new AWS.LexRuntime();
    const params = {
      botName: "BookBite",
      botAlias: "TestAlias",
      userId: "12313412",
      inputText: message || this.state.userInput,
      sessionAttributes: {
        UserId: "1",
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
      this.setState({
        conversations: newConversations,
        userInput: "",
        currentCardIndex: 0,
        totalCards: data.responseCard
          ? data.responseCard.genericAttachments.length
          : 0,
      });
    });
  };

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
      whiteSpace: "pre-line",
    };

    return (
      <Box key={index} textAlign={align} style={{ marginBottom: "10px" }}>
        <div style={bubbleStyle}>
          <Typography variant="body1">{conversation.content}</Typography>
          {isBot && conversation.responseCard
            ? this.renderResponseCards(conversation.responseCard)
            : null}
        </div>
        <Typography variant="caption" display="block" gutterBottom>
          {moment(conversation.timestamp).format("HH:mm:ss")}
        </Typography>
      </Box>
    );
  };

  renderResponseCards = (responseCard) => {
    const { genericAttachments } = responseCard;
    const { currentCardIndex } = this.state;
    const card = genericAttachments[currentCardIndex];

    return (
      <div>
        {this.renderResponseCard(card)}
        {genericAttachments.length > 1 && (
          <Box display="flex" justifyContent="center" marginTop="10px">
            <Button
              onClick={this.previousCard}
              disabled={currentCardIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={this.nextCard}
              disabled={currentCardIndex === genericAttachments.length - 1}
            >
              Next
            </Button>
          </Box>
        )}
      </div>
    );
  };

  renderResponseCard = (card) => {
    if (!card) {
      return null; // Return null if the card object is not defined
    }

    const imageStyles = {
      maxWidth: "100%", // Maximum width as a percentage of the container width
      maxHeight: "200px", // Maximum height in pixels
      height: "auto", // Maintain aspect ratio
      margin: "10px 0", // Margin around the image
      display: "block", // Display block to center the image in the CardContent
      marginLeft: "auto", // Combined with marginRight 'auto' for centering
      marginRight: "auto",
    };
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{card.title}</Typography>
          {card.imageUrl && (
            <img src={card.imageUrl} alt={card.title} style={imageStyles} />
          )}
          {card.buttons?.map((button, index) => (
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

  nextCard = () => {
    this.setState((prevState) => {
      const nextIndex = prevState.currentCardIndex + 1;
      const totalCards = prevState.totalCards;

      // Ensure we don't exceed the bounds of the array
      if (nextIndex < totalCards) {
        return { currentCardIndex: nextIndex };
      } else {
        return {}; // Do nothing if we're at the end of the array
      }
    });
  };

  previousCard = () => {
    this.setState((prevState) => {
      const prevIndex = prevState.currentCardIndex - 1;

      // Ensure the index does not go below 0
      if (prevIndex >= 0) {
        return { currentCardIndex: prevIndex };
      } else {
        return {}; // Do nothing if we're at the start of the array
      }
    });
  };

  render() {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h4" gutterBottom>
            BookaBite Chat
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            style={{
              maxHeight: "600px",
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
