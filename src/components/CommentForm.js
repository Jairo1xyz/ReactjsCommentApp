import React, { Component } from "react";

export default class CommentForm extends Component {
  
  state = {
    loading: false,
    error: "",

    comment: {
      name: "",
      message: ""
    }
  };

  /**
   * Handle form input field changes & update the state
   */
  handleFieldChange = event => {
    const { value, name } = event.target;

    this.setState({
      ...this.state,
      comment: {
        ...this.state.comment,
        [name]: value
      }
    });
  };

  /**
   * Form submit handler
   */
  onSubmit = async e => {
    // prevent default form submission
    e.preventDefault();

    if (!this.isFormValid()) {
      this.setState({ error: "All fields are required." });
      return;
    }

    // loading status and clear error
    this.setState({ error: "", loading: true });

    // persist the comments on server
    let { comment } = this.state;
    try{
        const res = await fetch("http://localhost:7777", {
        method: "post",
        body: JSON.stringify(comment)
        });

        const data = await res.json();

        if(data.error){
            this.setState({ loading: false, error: data.error });
        } else {
            // add time return from api and push comment to parent state
            comment.time = data.time;
            this.props.addComment(comment);
    
            // clear the message box
            this.setState({
                loading: false,
                comment: { ...comment, message: "" }
            });
        }
    } catch (err) {
        this.setState({
            error: `Something went wrong while submitting form: ${err}`,
            loading: false
          });
    }
  }

  isFormValid = () => {
    return this.state.comment.name !== "" && this.state.comment.message !== "";
  }
  

  renderError = () => {
    return this.state.error ? (
      <div className="alert alert-danger">{this.state.error}</div>
    ) : null;
  }

  render() {
    return <React.Fragment>
        <form method="post" onSubmit={this.onSubmit}>
          <div className="form-group">
            <input
              onChange={this.handleFieldChange}
              value={this.state.comment.name}
              className="form-control"
              placeholder="😎 Your Name"
              name="name"
              type="text"
            />
          </div>

          <div className="form-group">
            <textarea
              onChange={this.handleFieldChange}
              value={this.state.comment.message}
              className="form-control"
              placeholder="🤬 Your Comment"
              name="message"
              rows="5"
            />
          </div>

          {this.renderError()}

          <div className="form-group">
            <button disabled={this.state.loading} className="btn btn-primary">
              Comment ➤
            </button>
          </div>
        </form>
      </React.Fragment>
    
  }
}