import Skeleton from 'react-loading-skeleton';
import { useLocation } from 'react-router-dom';
import SkeletonCard from './SkeletonCard';
import styles from './styles/styles.module.scss'
import blogCardStyles from '../blogCard/styles/styles.module.scss'
import blogCardsStyles from '../blogCards/styles/styles.module.scss'

const SkeletonLoader = () => {
  const location = useLocation();
 
  const skeletons = {
    '/': (
      <>
        <div className={`${blogCardStyles.carousel_item} ${blogCardStyles.centered_item}`} style={{ width: '100%', height: '70vh' }}>
          <Skeleton height='70vh' width='100vw' />
          <div className={blogCardStyles.arrow_text_container}>
            <div className={`${blogCardStyles.text_container} ${blogCardStyles.text_skeleton}`}>
              <Skeleton width='40vw' height='20vh' style={{ marginBottom: '10px' }} />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton circle width={40} height={40} />
                <Skeleton width='15vw' style={{ marginLeft: '10px' }} />
              </div>
            </div>
          </div>
        </div>
        <div className={blogCardsStyles.grid_container} >
        </div>
      </>
    ),
    '/about-us': (
      <div className={`${styles.center_div} ${styles.col}`} >
        <Skeleton height={400} width='50vw' />
        <Skeleton count={3} width='40vw' style={{ marginBottom: '4px', }} />
      </div>
    ),
    '/explore-blogs': (
      <>
        <div className={styles.center_div}>
          <Skeleton height={50} width='70vw' style={{ marginBottom: '90px' }} />
          <Skeleton count={3} width='40vw' style={{ marginBottom: '4px', }} />
        </div>
      </>
    ),
    '/blog': (
      <div className={styles.center_div}>
        <Skeleton height={400} width='70vw' />
        <Skeleton width={100} style={{ margin: '0 0 10px 6px' }} />
        <Skeleton count={3} width={200} style={{ marginBottom: '4px' }} />
      </div>
    ),
    '/create-blog': (
      <div className={styles.center_div}>
        <Skeleton height={600} width='70vw' />
       </div>
    ),
    '/profile': (
      <div className={styles.center_div}>
        <Skeleton circle width={200} height={200} />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '10px', marginBlock: '10px' }}>
          <Skeleton width='15vw' height={20} />
          <Skeleton width='15vw' height={20} />
          <Skeleton width='15vw' height={20} />
        </div>
        <Skeleton count={3} width='40vw' style={{ marginBottom: '4px' }} />
      </div>
    ),
    '/sign-up': (
      <div className={styles.center_div}>
        <Skeleton height={300} width='40vw' />
      </div>
    ),
    '/login': (
      <div className={styles.center_div}>
        <Skeleton height={300} width='40vw' />
      </div>
    ),

  };

 
  const getSkeletonForPath = (path) => {
     const exactMatch = skeletons[path];
    if (exactMatch) return exactMatch;
    const partialMatch = Object.keys(skeletons).find(key => path.startsWith(key) && key !== '/');
     return skeletons[partialMatch]  
  };
  return getSkeletonForPath(location.pathname);
};

export default SkeletonLoader;



