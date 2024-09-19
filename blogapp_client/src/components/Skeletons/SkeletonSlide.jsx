import Skeleton from "react-loading-skeleton";
import styles from '../blogCard/styles/styles.module.scss'

const SkeletonSlide = () => (
    <div className={`${styles.carousel_item} ${styles.centered_item}`} style={{ width: '100%', height: '70vh' }}>
<Skeleton height='70vh'width='100vw' />
<div className={styles.arrow_text_container}>
  <div className={`${styles.text_container} ${styles.text_skeleton}`}>
    <Skeleton width={80} height={20} style={{ marginBottom: '10px' }} />
    <Skeleton height={28} width={300} style={{ marginBottom: '10px' }} />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Skeleton circle width={40} height={40} />
      <Skeleton width={100} style={{ marginLeft: '10px' }} />
    </div>
  </div>
</div>
</div>

    
  );

  export default SkeletonSlide