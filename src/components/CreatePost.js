import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createPost } from '../graphql/mutations';

class CreatePost extends Component {

  state = {
    postOwnerId: "",
    postOwnerUsername: "",
    postTitle: "",
    postBody: ""
  }

  componentDidMount = async () => {
    const user = await Auth.currentUserInfo();
    this.setState({
      postOwnerId: user.attributes.sub,
      postOwnerUsername: user.username
    });
  }

  handleAddPost = async (event) => {
    event.preventDefault()
    // graphqlフォルダ内のクエリ定義を参考にして各フィールドを用意
    const input = {
      postOwnerId: this.state.postOwnerId,
      postOwnerUsername: this.state.postOwnerUsername,
      postTitle: this.state.postTitle,
      postBody: this.state.postBody,
      createdAt: new Date().toISOString()
    }

    await API.graphql(graphqlOperation(createPost, { input }));
    this.setState({
      postTitle: "",
      postBody: ""
    })
  }

  handleChangePost = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    return (
      <form
        className="add-post"
        onSubmit={this.handleAddPost}
      >
        <input
          style={{ fontSize: '19px' }}
          type="text"
          name="postTitle"
          placeholder="Title"
          required
          value={this.state.postTitle}
          onChange={this.handleChangePost}
        />
        <textarea
          type="text"
          name="postBody"
          rows="3"
          cols="40"
          required
          placeholder="New Blog Post"
          value={this.state.postBody}
          onChange={this.handleChangePost}
        />
        <input
          style={{ fontSize: '19px' }}
          type="submit"
          className='btn'
        />

      </form>
    )
  }
}

export default CreatePost;
