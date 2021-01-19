import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import CommentForm from './components/CommentForm';
import CommentList from './components/CommentList';

class App extends Component {
  
  state = {
    comments: [],
    loading: false
  }

  addComment(comment) {
    this.setState({
      loading: false,
      comments: [comment, ...this.state.comments]
    });
  }

  async componentDidMount() {
    // loading
    this.setState({ loading: true });

    // get all the comments
    try{
      const res = await fetch("http://localhost:7777")
      const data = await res.json()
      this.setState({
        comments: data,
        loading: false
      });
    } catch(err) {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div className="App container bg-light shadow">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            React Comments
            <span role="img" aria-label="Chat">
              💬
            </span>
          </h1>
        </header>

        <Container>
          <Row className = "pt-3">
            <Col xs={12} sm={4}>
              <h6>Say something about React</h6>
              <CommentForm addComment={this.addComment}/>
            </Col>
            <Col xs={12} sm={8}>
            <CommentList
              loading={this.state.loading}
              comments={this.state.comments}
            />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
