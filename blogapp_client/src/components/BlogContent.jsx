import DOMPurify from 'dompurify';
import styles from './blogCard/styles/styles.module.scss'
export const BlogContent = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className={styles.blog_content} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  );
};

 
