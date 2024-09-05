class ImageContainer{
    constructor(imgSrc, parentEl){
        this.imgSrc = imgSrc
        this.parentEl = parentEl // slide 요소
        this.translateX = 0
        this.viewport = document.querySelector('.slider__viewport')
        this.translateNum = +this.parentEl.dataset.transform
        this.prevLeft = Infinity
        this.appendImage()
        this.setDimensions()
        this.addEventListeners()
    }
    appendImage(){
        this.el = document.createElement('div')
        this.el.classList.add('image__container')
        this.el.style.width = this.parentEl.dataset.width
        this.image = document.createElement('img')
        this.image.src = this.imgSrc
        this.el.appendChild(this.image)
        this.parentEl.appendChild(this.el)
    }
    setDimensions(){
        this.centerRef = window.innerWidth / 2
    }
    addEventListeners(){
        window.addEventListener('resize', this.setDimensions)
    }
    // 브라우저 중앙위치(this.centerRef)와 slider 중앙위치(this.parentCenter)의 거리 비교함
    // animate 함수가 동작하지 않아 확인해보니 left 값이 두개가 찍혔다. 
    animate(){
        let {left, width} = this.parentEl.getBoundingClientRect()
        // console.log(this.parentCenter = left + (width / 2))
        this.parentCenter = left + (width / 2)
        this.el.style.transform = `translateX(${(this.centerRef - this.parentCenter) * -this.translateNum}px)` // ease (슬라이드와 브라우저 중앙지점간 거리의 일정비율만큼 왼쪽이나 오른쪽으로 이동함) // skew 이펙트. 슬라이드가 브라우저 중앙에서 멀수록 슬라이더가 이동하는 방향과 반대 방향으로 이미지가 더 많이 이동함
    }
}

const images = [
    './assets/1.avif',
    './assets/2.avif',
    './assets/3.avif',
    './assets/4.avif',
    './assets/5.avif',
    './assets/6.avif',
    './assets/7.avif',
    './assets/8.avif',
    './assets/1.avif',
    './assets/2.avif',
    './assets/3.avif',
    './assets/4.avif',
    './assets/5.avif',
    './assets/6.avif',
    './assets/7.avif',
    './assets/8.avif',
]

export {ImageContainer, images}

