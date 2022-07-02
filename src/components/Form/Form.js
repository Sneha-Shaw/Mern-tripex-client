import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPost, updatePost } from '../../actions/posts';

import useStyles from './styles';
import FileBase from 'react-file-base64';
import ChipInput from 'material-ui-chip-input';

const Form = ({ currentId, setCurrentId }) => {
  //initial state of post
  const [postData, setPostData] = useState({ title: '', message: '', tips: '', tags: [], selectedFile: '' });

  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  //getting user details from localStorage
  const user = JSON.parse(localStorage.getItem('profile'));
  const navigate = useNavigate();
  //Usage of clear button
  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: [], selectedFile: '', tips: '' });
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);
  //create or update post after clicking submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }, navigate));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      clear();
    }
  };
  //checking to see if user is logged in. If not then create post is hidden 
  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Please Sign In to share your own experiences and like other's experiences.
        </Typography>
      </Paper>
    );
  }
  // Handling tags
  const handleAddChip = (tag) => {
    setPostData({ ...postData, tags: [...postData.tags, tag] });
  };

  const handleDeleteChip = (chipToDelete) => {
    setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>

        <Typography variant="h6">{currentId ? `Editing your diary "${post?.title}"` : 'Write your diary'}</Typography>
        {/* taking location as input */}
        <TextField name="title" variant="outlined" label="Location" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />

        <TextField name="message" variant="outlined" label="Write about your experience..." fullWidth multiline minRows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />

        <TextField name="tips" variant="outlined" label="Useful tips for fellow travellers..." fullWidth multiline minRows={4} value={postData.tips} onChange={(e) => setPostData({ ...postData, tips: e.target.value })} />
        {/* tags input */}
        <div style={{ padding: '5px 0', width: '94%' }}>
          <ChipInput
            name="tags"
            variant="outlined"
            label="Tags"
            fullWidth
            value={postData.tags}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip) => handleDeleteChip(chip)}
          />
        </div>
        <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear Form</Button>
      </form>
    </Paper>
  );
};

export default Form;
