const  cn  = document.querySelector('canvas') , 
       ctx = cn.getContext('2d') 

let particles 


//title 
let titleElement =  document.querySelector('h1') , 
    titleMeasur , ceil , leftWall , rightWall

function setTitleDemns(){
    titleMeasur  =  titleElement.getBoundingClientRect()

    ceil       =  {
        x :  titleMeasur.left , 
        y :  titleMeasur.top ,
        width  : titleMeasur.width ,
        height : 10
    },
    leftWall =  {
        x :  titleMeasur.left , 
        y :  titleMeasur.top  ,
        width  : 3 ,
        height : titleMeasur.height
    }, 
    rightWall = {
        x :  titleMeasur.right - 3 , 
        y :  titleMeasur.top  ,
        width  : 3 ,
        height : titleMeasur.height
    }
}

function isColl (obj , d){
    if(
        (obj.y  <= d.y + d.height&&
        obj.y + obj.size > d.y)&& 
        (obj.x - obj.size  <= d.x + d.width && 
        obj.x + obj.size > d.x)
    ){
        return true
    }
    return  false
} 
function advanceColor(y , from , to){
    if (from > to) {
        return from - (y * (from - to))/cn.height
    }
    return  (y * to)/cn.height + from
}
class Particle{
    constructor(x, y , fromRGB , toRGB){
        this.color    = [0 , 0 , 0]
        this.fromRGB  = fromRGB
        this.toRGB    = toRGB
        this.x      =  x
        this.y      =  y
        this.size   = Math.random() * 15 + 1
        this.baseSize = this.size
        this.weight = this.size / 5
        this.directionX = 1
    }
    update (){
        //reset
        if (this.y  > cn.height){
            this.color = [0 ,0 ,0]
            this.y = -this.baseSize 
            this.weight = this.size / 5
            this.x =  Math.random() * cn.width * 1.2 
            const  dr = Math.round(Math.random() * 2 -1)
            this.directionX =  dr != 0 ? dr : 1
        }
        //update position 
        this.weight += 0.05 
        this.y +=  this.weight 
        this.x +=  this.directionX
        
        //update size
        let size = this.baseSize - (this.y * this.baseSize)/cn.height  
        this.size = size >= 0 ? size : 0 

        //update color
        
        for (let i=0 ; i < 3 ; i++){    
            this.color[i]  =  advanceColor(this.y , this.fromRGB[i] , this.toRGB[i])
        }

        //ceil coll 
        if (isColl(this , ceil)){
            this.weight *= -0.7
            this.y -=3
        }

        //left or right wall
        if (isColl(this , leftWall) || isColl(this , rightWall)){
            this.directionX *= -2
        }
    }
    draw (){

        //add a border

        // ctx.fillStyle = `#000`
        // ctx.beginPath()
        // ctx.arc(this.x , this.y , this.size + 1 , 0 , Math.PI*2 )
        // ctx.closePath()
        // ctx.fill()

        ctx.fillStyle = `rgba(${this.color[0]} , ${this.color[1]} , ${this.color[2]} ,1)`
        ctx.beginPath()
        ctx.arc(this.x , this.y , this.size , 0 , Math.PI*2 )
        ctx.closePath()
        ctx.fill()
    }
}


const NumberOfParticles =  200 

function init(){  
    cn.width  =  window.innerWidth 
    cn.height =  window.innerHeight

    particles = []

    setTitleDemns()

    for (let i = 0 ; i < NumberOfParticles ;  i ++){
        particles.push(new Particle(
            Math.random() *  cn.width , 
            Math.random() *  cn.height/4, 
            [Math.random() * 255 ,  Math.random() * 255 , 0] , 
            [Math.random() * 255,  Math.random() * 255 ,  Math.random() * 255]
        ))
    }
}
init()
function animate(){
    ctx.fillStyle = "rgba(0,0,0, 0.05)"
    ctx.fillRect(0 ,0 , cn.width , cn.height)
    for (let i = 0 ; i < NumberOfParticles ;  i ++){
        particles[i].update()
        particles[i].draw()
    }
    requestAnimationFrame(animate)
}
animate()
window.addEventListener('resize' , ()=>{
    init()
})



