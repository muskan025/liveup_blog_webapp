/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { BsCheck, BsX } from "react-icons/bs"
import styles from "./styles/styles.module.css"
import { useSelector } from "react-redux"
import { useAddBlogNotesMutation, useGetAllBlogsQuery } from "../../reduxToolkit/slices/apiSlice"
import { toast } from "react-toastify"

const NoteCard = ({ isOpen, onClose, notes,blogId }) => {
    const { author } = useSelector((state) => state.userData)
    const userId = author.userId
     const [note, setNote] = useState(notes)
    const { data: blog,isLoading:noteLoading, error: noteError } = useGetAllBlogsQuery(undefined, {
        selectFromResult: (result) => ({
          data: result.data?.find(blog => blog._id === blogId)
        })
      });
    const [addBlogNotes] =  useAddBlogNotesMutation();
  
    function handleNoteChange(e){
        setNote(e.target.value)
    }

    async function handleSave(){
        try {
           await addBlogNotes({ blogId,userId,content: note }).unwrap();
           onClose();
        } catch (error) {
          toast.error('Failed to save note:', error);
        }
      }

    useEffect(() => {
        const userNote = blog?.notes?.find(note => note.userId === author.userId);
        setNote(userNote?.content || '');
      }, [blog, author._id]);


      if(noteLoading){
        return <p>Loading...</p>
      }

    return (
        <div className={`${styles.notepad_container} ${!isOpen ? styles.close_notepad : ''}`}>
            <div className={styles.header}>
                <h3>Notes</h3>
                <div className={styles.icons}>
                     <span className={styles.close} onClick={handleSave}><BsCheck title="Save" /></span>
                    <span className={styles.close} onClick={onClose}><BsX title="Close" /></span>
                </div>
            </div>
            <textarea
                className={styles.notepad}
                name="note"
                value={note}
                onChange={handleNoteChange}
                placeholder="Capture insights for a rewarding read!"
            ></textarea>
        </div>
    )
}

export default NoteCard

  

 