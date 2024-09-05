import { ImageContainer, images } from "./images.js"

const slider = document.querySelector('.slider')
const slides = document.querySelectorAll('.slide')
const slidesArray = [...slides]
let slideWidth = slides[0].getBoundingClientRect().width // 슬라이드 하나의 너비

const counters = document.querySelectorAll('.counter__li')
const countersArray = [...counters]

let transform = 0
let delta = 0

window.addEventListener('resize', () => {
    slideWidth = slides[0].getBoundingClientRect().width // 슬라이드 하나의 너비
})

// elements : slide 요소들
function cloneElements(elements, pushArray){
    for (let i = 0; i < elements.length; i++) {
        const clone = elements[i].cloneNode(true) // 자식까지 전부 복제
        clone.classList.add('clone')
        elements[i].parentElement.appendChild(clone)
        pushArray.push(clone)
        
    }
}

// position: 'left' 혹은 'top'
function positionElements(elements, position){ // 배열 중앙에 위치한 요소가 가장 적게 이동하고, 배열의 중앙에서 멀어질수록 더 멀리 이동한다. (16개이므로 9번째가 브라우저 중앙에 위치함)
    elements.forEach((element, idx) => {
        let percent = (idx - (elements.length / 2)) * 100 
        element.style[`${position}`] = `${percent}%`
    })
}

cloneElements(slides, slidesArray)
// console.log(slidesArray)
positionElements(slidesArray, 'left')

cloneElements(counters, countersArray)
positionElements(countersArray, 'top')

let imageContainers = []
for (let i = 0; i < slidesArray.length; i++) {
    const imageContainer = new ImageContainer(images[i], slidesArray[i])
    imageContainers.push(imageContainer)
}

slider.addEventListener('wheel', (e) => {
    // console.log(e.deltaY)
    transform -= e.deltaY // 스크롤 내리면 transform 은 음수값으로 점점 커짐
    // console.log(transform)
    delta = e.deltaY
    // console.log('델타', delta) 
})  

// touch device
let startX = 0
let speedX = 0
let isTouching = false 
let startTime = 0
let elapsedTime = 0

slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX // 터치 시작점
    // console.log(startX)
    speedX = 0
    isTouching = true 
    startTime = performance.now()
})

slider.addEventListener('touchmove', (e) => {
    e.preventDefault() // 스크롤과 같은 동작 방지
    const deltaX = e.touches[0].clientX - startX
    // console.log(deltaX) // 왼쪽으로 드래그하면 음수. 오른쪽으로 드래그하면 양수
    transform += deltaX // 터치로 드래그한 만큼 슬라이더 이동
    startX = e.touches[0].clientX // 이전의 터치 위치 저장. 이렇게 하지 않으면 터치를 시작한 지점이랑 현재값을 빼기 때문에 점점 거리가 늘어나서 transform 값이 점점 많이 변함. 터치하다가 가만히 있으면 touchmove 이벤트는 발생하지 않는다. 그래서 현재 터치위치에서 그 다음 위치까지만 계산해야 한다.
    elapsedTime = performance.now() - startTime // 터치시간 계산
    console.log(elapsedTime) // 터치를 시작한 시각에서 드래그할수록 점점 커지는 양수값.
    // console.log(deltaX) // 드래그를 빠르게 할수록 값이 커진다. 왼쪽으로 이동하면 음수값. 오른쪽이면 양수값.
    speedX -= (deltaX / (elapsedTime * .1)) * -1 // 왼쪽으로 빠르게 많이 드래그하면 deltaX 값은 음수값으로 커지고, elapsedTime 은 짧기 때문에 speedX 값은 많이 감소한다.
    // 반대로 오른쪽으로 빠르게 많이 드래그하면 deltaX 값은 양수값으로 커지고, elapsedTime 은 짧기 때문에 speedX 값은 더 빨라진다. 
    console.log(deltaX, speedX) // 한번에 빠르게 드래그할수록 값이 크다.
    console.log('터치이동')
})

slider.addEventListener('touchend', (e) => {
    startX = 0  
    isTouching = false 
})

// 스크롤 올리다가 3000px 넘어가면 -3000px 로 된다. 스크롤 내리면 왼쪽으로 이동
// 스크롤 내리다가 -3000px 넘어가면 3000px 로 된다. 스크롤 올리면 오른쪽으로 이동
function animate(){
    console.log(speedX) // 터치하고 드래그했다가 놓으면 speedX 값이 점점 떨어진다. 이터레이션 돌때마다 speedX 값은 0.95를 곱하므로 현재값의 95%씩 감소한다. 그러다가 0.1 보다 줄어들면 슬라이드가 멈춘다. 
    if(!isTouching && Math.abs(speedX) > 0.1){ // 모바일에서 빠르게 드래그했다가 놓았을때 마지막에 좀 더 부드럽게 슬라이딩하다가 멈추기 위해서
        speedX *= 0.95
        transform += speedX // 왼쪽으로 드래그하면 speedX 는 음수. 오른쪽으로 드래그하면 speedX 는 양수. 
        console.log('부드럽다') // 왼쪽으로 드래그하면 transform 도 음수이므로 음수에서 더 빼주니까 더 왼쪽으로 이동한다. 즉 왼쪽으로 빠르게 드래그했다가 놓으면 지가 알아서 왼쪽으로 더 이동한다.
        // 반대로 오른쪽으로 빠르게 드래그했다가 놓으면 transform 이 양수이므로 양수에서 양수값을 더해주므로 오른쪽으로 지가 알아서 더 이동하다가 멈춘다.
        // 드래그를 빠르게 할수록 터치했다가 놓았을때 speedX 값이 크므로 더 많이 더 오래 이동하다가 멈춘다. 
        // speedX 값은 드래그했다가 놓는순간에는 값이 크므로 슬라이드가 많이 움직이다가 점점 speedX 값이 작아지므로 점점 이동하는 양이 작아진다. 
    }

    // console.log(transform)
    if(transform > slideWidth * (slidesArray.length / 4)){ // 총 슬라이드가 16개이므로 4로 나누면 4가 되고 slideWidth 가 슬라이드 하나의 너비이므로 마우스 휠을 사용해서 4장의 슬라이드 너비보다 더 많은 거리를 휠하면 transform 값을 점프함
        transform = -(slideWidth * (slidesArray.length / 4))
        console.log('점프1')
    }
    if(transform < -(slideWidth * (slidesArray.length / 4))){ // 총 슬라이드가 16개이므로 4로 나누면 4가 되고 slideWidth 가 슬라이드 하나의 너비이므로 마우스 휠을 사용해서 4장의 슬라이드 너비보다 더 많은 거리를 휠하면 transform 값을 점프함
        transform = (slideWidth * (slidesArray.length / 4))
        console.log('점프2')
    }
    for (let i = 0; i < slidesArray.length; i++) {
        slidesArray[i].style.transform = `translateX(${(transform / (window.innerWidth * .6)) * 100}%)` // transform 만 사용하면 너무 많이 이동한다
        countersArray[i].style.transform = `translateY(${(transform / (window.innerWidth * .6)) * 100}%)` // transform 이 브라우저 너비의 60%(60vw)만큼 이동하면 translateX 는 100%(슬라이드 한장만큼) 이동한다.
        imageContainers[i].animate() // skew 처럼 왼쪽으로 슬라이더가 이동할때 브라우저 중앙에서 멀수록 사진이 오른쪽으로 많이 이동하고, 가까울수록 오른쪽으로 조금 이동한다. 즉, 브라우저 중앙보다 우측에 있을때는 슬라이더가 왼쪽으로 이동할때 사진도 왼쪽으로 이동한다.
        // console.log(imageContainers[i])
    }
    
    requestAnimationFrame(animate)
}
animate()



