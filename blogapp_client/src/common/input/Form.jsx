
import { BiImageAdd } from "react-icons/bi"
import styles from "./styles/styles.module.css"
import indexStyle from "../../styles/index.module.scss" 
export const FormName = ({name})=>{
  return (
    <h2 className={styles.name}>{name}</h2>
  )
}

export const InputField = ({type,name,placeholder,className,value,onChange,error}) => {
 
  return (
   <>
    <input className={`${styles.input} ${className ? styles.create_blog_file : ''}`} type={type} name={name} value={value} placeholder={placeholder} onChange={onChange} />
    <span className={styles.error}>{error}</span>
    </>
  )
}

export const FileField = ({name,placeholder,className,onChange,image}) => {
 
  return (
    <div className={`${styles.file_input_container} ${styles.input} ${className ? styles.create_blog_file : ''}`}>
    <input type="file" name={name} className={styles.file_input} placeholder={placeholder} onChange={onChange} accept="image/*"/>

    <label htmlFor={name} className={`${styles.file_input_label}`}><BiImageAdd className={styles.image_icon}/>{image?.file  ? 'Change Image' : placeholder}</label>
    
  </div>
  
  )
}

export const Button = ({name,width})=>{
  return (
    <button className={indexStyle.btn} style={{"width":`${width}`}}>{name}</button>
  )
}
