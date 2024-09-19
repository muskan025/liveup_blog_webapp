import Skeleton from "react-loading-skeleton"
import styles from "../blogCards/styles/styles.module.scss";
import style from "../blogCard/styles/styles.module.scss";
 

const SkeletonCard = () => {
    return <div className={styles.grid_container} >
        {Array(8).fill().map((_, index) =>
        {
           return ( <div className={`${style.masonry_item} ${style.skeleton_item}`} key={index}>
                <Skeleton height={250} width={200} style={{ marginBottom: '6px', borderRadius: '20px' }} />
                <Skeleton count={3} width={200} style={{ marginBottom: '4px' }} />
                <Skeleton circle width={40} height={40} />
                <Skeleton width={100} style={{ marginLeft: '10px' }} />
            </div>  )
        }
        )
        }
    </div>


}

export default SkeletonCard