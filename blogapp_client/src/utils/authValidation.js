
export const validateEmail = (email) => {
    const emailRegex = 	/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email) {
      return { error: 'Email is required.' };
    }
    if (!emailRegex.test(email)) {
      return {  error: 'Please enter a valid email address.' };
    }
    return {error: null };
  };
  
   export const validateUsername = (username) => {

     if (!username) {
      return {  error: 'Username is required.' };
    }
    if (username.length < 3) {
      return {  error: 'Username must be at least 3 characters long.' };
    }
    if (username.length > 20) {
      return {   error: 'Username cannot exceed 20 characters.' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { error: 'Username can only contain letters, numbers, and underscores.' };
    }
    return { error: null };
  };
  
   export const validatePassword = (password) => {

     if (!password) {
      return {  error: 'Password is required.' };
    }
    if (password.length < 8) {
      return {  error: 'Password must be at least 8 characters long.' };
    }
    if (!/[A-Z]/.test(password)) {
      return {  error: 'Password must contain at least one uppercase letter.' };
    }
    if (!/[a-z]/.test(password)) {
      return {  error: 'Password must contain at least one lowercase letter.' };
    }
    if (!/[0-9]/.test(password)) {
      return { error: 'Password must contain at least one number.' };
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return {  error: 'Password must contain at least one special character (!@#$%^&*).' };
    }
    return { error: null };
  };

 
  export const validateBio = (bio) => {
    if (typeof bio !== 'string') {
      return { error: 'Bio must be a string' };
    }
    if (bio.length < 10 || bio.length > 255) {
      return { error: 'Bio must be between 10 and 255 characters' };
    }
    return { error: null };  
  };

  export const validateNiche = (niche) => {
    if (typeof niche !== 'string' || niche.trim() === '') {
      return { error: 'Niche must not be empty' };
    }
    if (!isNaN(niche)) {
      return { error: 'Niche cannot be a number' };
    }
    if (niche.length < 3 || niche.length > 50) {
      return { error: 'Niche must be between 3 and 50 characters' };
    }
    return { error: null };  
  };

  export const validateBlogTitle = (title) => {
    if (typeof title !== 'string') {
      return { error: 'Title must be a string' };
    }
    if (title.length < 3 || title.length > 100) {
      return { error: 'Title must be between 3 and 100 characters' };
    }
    return { error: null }; 
  };
  
 
  export const validateBlogBody = (body) => {
    if (typeof body !== 'string') {
      return { error: 'Body must be a string' };
    }
    if (body.length < 100) {
      return { error: 'Body must be at least 100 characters long' };
    }
    return { error: null };  
  };
  
 
  export const validateReadTime = (readTime) => {
    if (typeof readTime !== 'number' || !Number.isInteger(readTime)) {
      return { error: 'Read time must be an integer' };
    }
    if (readTime < 1 || readTime > 60) {
      return { error: 'Read time must be between 1 and 60 minutes' };
    }
    return { error: null };  
  };

  export const validateImage = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webP'];
    if (!allowedTypes.includes(file.type)) {
      return {error:"Please upload a JPEG, PNG, or GIF image."}
    }
    return {error:null}
  }