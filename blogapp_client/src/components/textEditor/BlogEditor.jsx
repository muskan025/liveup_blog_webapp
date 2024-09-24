import { useEffect, useMemo, useRef, useState,lazy,Suspense} from "react";
import { FileField, InputField } from "../../common/input/Form";
import popup from "../../assets/popup.json";
import styles from "./styles/styles.module.css";
import { toast } from "react-toastify";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCreateBlogMutation, useUpdateBlogMutation, useUploadImgMutation } from "../../reduxToolkit/slices/apiSlice";
import { useLocation } from "react-router-dom";
import indexStyle from "../../styles/index.module.scss"

const BlogEditor = () => {

   const {state} = useLocation()

const [blogContent, setBlogContent] = useState({
  title: state?.title || "",
  readTime: state?.readTime || "",
});
const [editorContent, setEditorContent] = useState(state?.textBody || "");
  const [thumbnail, setThumbnail] = useState({
    file: null,
    preview: null
  })
 
  const [upDateBlog, { isUpdateLoading }] = useUpdateBlogMutation()
  const [createBlog, { isLoading }] = useCreateBlogMutation()
  const [uploadImg] = useUploadImgMutation()
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);


  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadImg(formData).unwrap()
      const url = `https://liveup-api.vercel.app/${response.url}` ;
 
      const range = editorRef.current.getEditor().getSelection();
      editorRef.current.getEditor().insertEmbed(range.index, 'image', url);
    };
  };

   const modules = useMemo(() => ({
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        [{ script:  "sub" }, { script:  "super" }],
        ["blockquote", "code-block"],
        [{ list:  "ordered" }, { list:  "bullet" }],
        [{ indent:  "-1" }, { indent:  "+1" }],
        ["link", "image", "video"],
        [{ font: [] }],
        [{"size": []},{ align: [] },{ color: [] }, { background: [] }],
        
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

 
  function handleImg(e) {
    const file = e.target.files[0];
    if (file) {
 
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload a JPEG, PNG, or GIF image.");
        return;
      }

      setThumbnail({
        file: file,
        preview: URL.createObjectURL(file)
      });
    }
  }

  function handleBlogContent(e) {
    const { name, value } = e.target

    setBlogContent((prev) => ({ ...prev, [name]: value }))
  }

  async function handlePublish(e) {

    e.preventDefault()

    const formData = new FormData();
    
    const unchangedThumbnail = state?.thumbnail && !thumbnail.file
    const unchangedTitle = state?.thumbnail === blogContent.title
    const unchangedReadTime = state?.readTime === blogContent.readTime
    const unchangedContent = state?.textBody ===  editorContent

    if(!unchangedThumbnail){

      if (!thumbnail.file) {
        toast.error("Please upload a thumbnail image.");
        return;
      }
      formData.append('file', thumbnail.file,thumbnail.file.name);
  
     }
      
    try {
      const response = !unchangedThumbnail && await uploadImg(formData).unwrap()

      const blogFormData = new FormData();
      if(response?.status === 200 || state){
        blogFormData.append('title', unchangedTitle ? state?.title : blogContent.title);
        blogFormData.append('readTime',unchangedReadTime ? state?.readTime : blogContent.readTime);
        blogFormData.append('textBody',unchangedContent ? state?.textBody : editorContent);
        blogFormData.append('thumbnail',unchangedThumbnail ? state?.thumbnail : response.url);
 
        const blogResponse = state ? await upDateBlog({
          data:blogFormData,
          blogId:state._id
        }).unwrap() : 
        await createBlog(blogFormData).unwrap()

        if (blogResponse.status === 201 || blogResponse.status === 200) {
          toast.success("Whoah! You made a mark 🤩, check your post")
        } else {
          toast.error(blogResponse?.message || "Error creating blog post")
        }
      } else {
        toast.error(response?.message || "Error uploading image")
      }

      }
    catch (error) {
       toast.error("Something went wrong, please try again later")
    }
  
  }

  useEffect(() => {
    const setToolbarWidth = () => {
      const toolbar = document.querySelector('.ql-toolbar');
      const container = editorContainerRef.current;
      if (toolbar && container) {
        toolbar.style.width = `${container.offsetWidth}px`;
      }
    };

    setToolbarWidth();
    window.addEventListener('resize', setToolbarWidth);

    return () => {
      window.removeEventListener('resize', setToolbarWidth);
    };
  }, []);
 
  return (
    <section className={styles.editor_wrapper}>
    <div className={styles.hide_content}>
      </div>
    <section className={styles.editor_container}>     
      <div className={styles.publish}>
      <button className={indexStyle.btn} onClick={handlePublish}>{isLoading || isUpdateLoading ? 'Loading...' :( state ? 'Update' :'Publish')}</button>
      </div>
       
      <div className={styles.text_editor}  ref={editorContainerRef}>
        <form className={styles.header} encType="multipart/form-data">
          <div className={`${styles.thumbnail_container} ${thumbnail?.name !== '' ? styles.no_underline : ''}`}>
            <FileField name="thumbnail" placeholder="Add thumbnail..." className={styles.create_blog_file} image={thumbnail.file} onChange={handleImg} />
          </div>
          {thumbnail?.preview && <img src={thumbnail?.preview} alt="Thumbnail Image" />}

          <div className={`${styles.title_container} ${thumbnail?.name !== '' ? styles.no_underline : ''}`}>
            <InputField type="text" name="title" placeholder=" Add title..." className={styles.create_blog_file} onChange={handleBlogContent} value={blogContent.title}/>
          </div>

          <div className={`${styles.readtime_container} ${thumbnail?.name !== '' ? styles.no_underline : ''}`}>
            <InputField type="text" name="readTime" placeholder="Add read time in mins..." onChange={handleBlogContent} value={blogContent.readTime} />
          </div>
        </form>

        <div className={`${styles.content} ${styles.quill_wrapper}`}>
          <ReactQuill
          ref={editorRef}
           modules={modules}
            theme="snow"
            placeholder="Content goes here..."
            onChange={setEditorContent}
            value={editorContent}
            formats={['font', 'header', 'bold', 'italic', 'underline', 'strike', 'color', 'background',
                    'script', 'blockquote', 'code-block', 'list', 'bullet', 'indent', 'align',
                    'link', 'image', 'video']}
          />
        </div>

      </div>
    </section>
    </section>
  );
};

export default BlogEditor;



