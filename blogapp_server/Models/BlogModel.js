const sanitizeHtml = require('sanitize-html');
const BlogSchema = require('../Schemas/BlogSchema');
const { LIMIT } = require('../privateConstants');
const UserSchema = require('../Schemas/UserSchema');
const { default: mongoose } = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

const Blog = class {
  title;
  textBody;
  creationDateTime;
  readTime;
  thumbnail;
  userId;
  blogId;
  likes;
  notes;

  constructor({
    title,
    textBody,
    creationDateTime,
    readTime,
    thumbnail,
    userId,
    blogId,
    likes,
    notes
  }) {
    this.title = title;
    this.textBody = textBody;
    (this.creationDateTime = creationDateTime), (this.readTime = readTime);
    this.thumbnail = thumbnail;
    this.userId = userId;
    this.blogId = blogId;
    this.likes = likes;
    this.notes = notes;
  }

  createBlog() {
    return new Promise(async (resolve, reject) => {
      this.title.trim();
      this.textBody.trim();

      const sanitizedHtml = sanitizeHtml(this.textBody, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt'],
        },
      });

      const blogObj = new BlogSchema({
        title: this.title,
        textBody: sanitizedHtml,
        creationDateTime: this.creationDateTime,
        readTime: this.readTime,
        thumbnail: this.thumbnail,
        likes: this.likes,
        userId: this.userId,
        notes: this.notes
      });

      try {
        let blogDb = await blogObj.save();

        resolve(blogDb);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getBlogs({ followingUserIds, isLoggedin, SKIP }) {
    return new Promise(async (resolve, reject) => {
      let followingBlogsDb = [];
      let notfollowingBlogsDb = [];
      let blogsDb = [];

      try {
        if (!isLoggedin) {
          blogsDb = await BlogSchema.aggregate([
            {
              $sort: { creationDateTime: -1 },
            },
            {
              $facet: {
                data: [{ $skip: SKIP }, { $limit: LIMIT }],
              },
            },
          ]);

          const blogs = [...blogsDb[0].data];

           for (const blog of blogs) {
      let updated = false;
    
      // Update image URLs in the textBody
      if (blog.textBody) {
        const updatedTextBody = blog.textBody.replace(
          /http:\/\/localhost:8000/g,
          'https://liveup-api.vercel.app/'
        );
        
        if (updatedTextBody !== blog.textBody) {
          blog.textBody = updatedTextBody;
          updated = true;
        }
      }

      if (updated) {
        await blog.save();
        updatedCount++;
        console.log(`Updated blog: ${blog._id}`);
      }
    }

    console.log(`Total blogs updated: ${updatedCount}`);
  } catch (error) {
    console.error('Error updating image URLs:', error);
  } 
            const blogIds = blogs.map(blog => blog._id)
            const populatedBlogs = await BlogSchema.find({ _id: { $in: blogIds } })
          .populate('userId', 'name username profileImg bio niche followingsCount followersCount')
          .exec();

          resolve(populatedBlogs);
        }

        followingBlogsDb = await BlogSchema.aggregate([
          {
            $match: {
              userId: { $in: followingUserIds },
              isDeleted: { $ne: true },
            },
          },
          {
            $sort: { creationDateTime: -1 },
          },
          {
            $facet: {
              data: [{ $skip: SKIP }, { $limit: LIMIT }],
            },
          },
        ]);
      } catch (error) {
        reject(error);
      }

      try {
        notfollowingBlogsDb = await BlogSchema.aggregate([
          {
            $match: {
              userId: { $nin: followingUserIds },
              isDeleted: { $ne: true },
            },
          },
          {
            $sort: { creationDateTime: -1 },
          },
          {
            $facet: {
              data: [{ $skip: SKIP }, { $limit: LIMIT }],
            },
          },
        ]);

        const blogs = [
          ...followingBlogsDb[0].data,
          ...notfollowingBlogsDb[0].data,
        ];
        const blogIds = blogs.map(blog => blog._id)

        const populatedBlogs = await BlogSchema.find({ _id: { $in: blogIds } })
        .populate('userId', '_id name username profileImg bio niche followingsCount followersCount')
        .exec();

        resolve(populatedBlogs);
      } catch (error) {
        reject(error);
      }
    });
  }

  static userBlogs({ SKIP, userId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const blogs = await BlogSchema.find({
          userId: new ObjectId(userId),
          isDeleted: { $ne: true },
        })
          .sort({ creationDateTime: -1 })
          .skip(SKIP)
          .limit(LIMIT).populate('userId', '_id name username profileImg bio niche followingsCount followersCount')
          .exec();

        resolve(blogs);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getBlogWithId({ blogId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const blog = await BlogSchema.findOne({ _id: blogId });

        if (!blog) reject('Blog Id not found');

        resolve(blog);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateBlog({ blogId }) {
    return new Promise(async (resolve, reject) => {
      let newBlogData = {
        title: this.title,
        textBody: this.textBody,
        readTime: this.readTime,
        creationDateTime: this.creationDateTime,
      };

      try {
        const oldBlog = await BlogSchema.findOneAndUpdate(
          { _id: blogId },
          newBlogData
        );
        resolve(oldBlog);
      } catch (error) {
        reject(error);
      }
    });
  }

  static toggleLike({ userId, blog }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userIndex = blog.likes.findIndex((id) => id.equals(userId));

        if (userIndex === -1) {
          blog.likes.push(userId);
        } else {
          blog.likes.splice(userIndex, 1);
        }

        await blog.save();

        const likesCount = blog.likes.length;

        const updatedBlog = await BlogSchema.findByIdAndUpdate(
          { _id: blog._id },
          { likes: blog.likes, likesCount: likesCount },
          { new: true } // To return the updated document
        );

        if (!updatedBlog) {
          return reject(new Error('Blog not found'));
        }

        const message = userIndex === -1 ? 'Liked Blog' : 'Unliked Blog';
        resolve([updatedBlog, message]);
      } catch (error) {
        reject(error);
      }
    });
  }

static addNote({userId,blog,content}){
  return new Promise(async(resolve,reject) => {

    const userObjectId = new ObjectId(userId);

   
    try{
      const noteIndex = blog.notes.findIndex(note => 
         note.userId.equals(userObjectId)
      );
      console.log("note index:",noteIndex)

      if (noteIndex > -1) {
        blog.notes[noteIndex].content = content;
      } else {
        blog.notes.push({ userId: userObjectId, content });
      }
  
      await blog.save();
      resolve(blog)
    }
    catch(error){
      reject(error)
    }
  })
}

  static deleteBlog({ blogId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const deleteBlog = await BlogSchema.findOneAndUpdate(
          { _id: blogId },
          { isDeleted: true, deletionDateTime: Date.now() }
        );

        resolve(deleteBlog);
      } catch (error) {
        reject(error);
      }
    });
  }

};

module.exports = Blog;
