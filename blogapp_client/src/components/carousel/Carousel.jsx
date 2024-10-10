
import { useCallback, useEffect, useState } from "react"
import {trackWindowScroll } from 'react-lazy-load-image-component';
import CarouselItem from "./CarouselItem"
import styles from "../blogCard/styles/styles.module.scss"

const Carousel = ({ data = [], isLoading, scrollPosition}) => {

    const [current, setCurrent] = useState(0)
    const [isAutoSliding, setIsAutoSliding] = useState(true)

    const skeletonCount = 5
    const slideCount = isLoading ? skeletonCount : data.length 

    const prev = useCallback(() => {
        setCurrent((curr) => curr === 0 ? slideCount - 1 : curr - 1)
    }, [])

    const next = useCallback(() => {
        setCurrent((curr) => curr === slideCount - 1 ? 0 : curr + 1)
    }, [])


    useEffect(() => {

        let interval
        if (isAutoSliding) {
            interval = setInterval(() => {
                next()
            }, 3000)
        }

        return () => clearInterval(interval)
    }, [isAutoSliding, next])

    function handleManualSliding(direction) {
        setIsAutoSliding(false)

        if (direction === 'next') {
            next()
        }
        else prev()

        setTimeout(() => {
            setIsAutoSliding(true)
        }, 0)

    }

     return (
        <section className={styles.carousel_container} aria-label="Featured blog posts carousel" role="region" >

            <div className={styles.carousel}
                style={{ transform: `translateX(-${current * 100}%)` }}>

                {
                     
                        data.length > 0 && data.map((blog,index) => {

                            const { _id} = blog
                            return (
                                <CarouselItem key={_id} blog={blog} totalSlides={slideCount} index={index} scrollPosition={scrollPosition} handleManualSliding={handleManualSliding}/>
                            )
                        })
                }
            </div>
        </section>
    )
}

export default trackWindowScroll(Carousel)
