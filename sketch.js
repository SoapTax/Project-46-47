var START = 0
var PLAY = 1
var END = 2
var gameState = START
var level = 0
var lives = 3
var lever = 0
var score = 0
var hit = 0

function preload(){
bgImg = loadImage("Space background.jpeg")
startImg = loadImage("startImg.png")
titleImg = loadImage("titleImage.png")
storyImg = loadImage("storyImage.png")
playButtonImg = loadImage("startButton.png")
lifeImg = loadImage("life.gif")
playerStandingImg = loadImage("playerImage.png")
platform1Img = loadImage("platform1.png")
platform2Img = loadImage("platform2.png")
barOutlineImg = loadImage("bar1.png")
lifeBarImg1 = loadAnimation("barFull.png")
lifeBarImg2 = loadAnimation("bar2Full.png")
lifeBarImg3 = loadAnimation("bar3Full.png")
instructionsImg = loadImage("instructions.png")
portalImg = loadImage("portal.gif")
coinImg = loadImage("coin.png")
swordImg = loadImage("sword.png")
swipeImg = loadImage("swipe.png")
monsterImg = loadAnimation("monster.png")
monsterImg2 = loadAnimation("monster2.png")
}

function setup(){
  createCanvas(windowWidth, windowHeight)
  bg = createSprite(width/2, height/2)
  bg.addImage(bgImg)
  bg.scale = 0.8
  bg.visible = false

  startbg = createSprite(width/2, height/2)
  startbg.addImage(startImg)
  startbg.scale = 1.7

  title = createSprite(width/2, height/2 -100)
  title.addImage(titleImg)
  title.scale = 1

  story = createSprite(width/2 - 30, height/2 + 230)
  story.addImage(storyImg)
  story.scale = 4

  playButton = createSprite(width/2, height/2 + 230)
  playButton.addImage(playButtonImg)
  playButton.scale = 7

  lifeIndicator = createSprite(width - 270, 90)
  lifeIndicator.addImage(lifeImg)
  lifeIndicator.scale = 2

  player = createSprite(200, height/2)
  player.addImage(playerStandingImg)
  player.scale = 1
  player.setCollider("rectangle", 0, 10, 67, 67)
  player.visible = false

  barOutline = createSprite(width - 200, 100)
  barOutline.addImage(barOutlineImg)
  barOutline.scale = 2.5

  platformGroup = new Group()
  coinGroup = new Group()
  monsterGroup = new Group()

  lifeBar = createSprite(width - 190, 92)
  lifeBar.addAnimation("full life", lifeBarImg1)
  lifeBar.addAnimation("2/3 life", lifeBarImg2)
  lifeBar.addAnimation("1/3 life", lifeBarImg3)
  lifeBar.changeAnimation("full life")
  lifeBar.scale = 1.1

  instructions = createSprite(width/2, 400)
  instructions.addImage(instructionsImg)
  instructions.scale = 2
  instructions.visible = false

  portal = createSprite(width - 100, height - 300)
  portal.addImage(portalImg)
  portal.scale = 0.2
  portal.visible = false

  sword = createSprite(player.x, player.y)
  sword.addImage(swordImg)
  sword.visible = false
}

function draw() {
background(0)
if(gameState === START){
    if(mousePressedOver(playButton)){
        gameState = PLAY
        level = 1
        lever = 1
    }
}

if(gameState === PLAY){
    startbg.visible = false
    playButton.visible = false
    title.visible = false
    story.visible = false
    bg.visible = true
    player.visible = true
    player.collide(platformGroup)
    player.velocityY += 3
    portal.visible = true
    sword.visible = true
    handleCoin()
    sword.x = player.x + 50
    sword.y = player.y

    if(player.y > height){
        die()
    }

    if(keyWentDown("space")){
        swipe = createSprite(player.x + 80, player.y)
        swipe.addImage(swipeImg)
        swipe.scale = 3
        swipe.lifetime = 10
        swipe.setCollider("rectangle", 10, 0, 20, 40)
        if(hit === 0){
            monster.changeAnimation("monster2")
            hit = 1
        }
        swipe.overlap(monsterGroup, function(collecter, collected){
            if(hit === 1){
                collected.remove()
            }
        })
    }

    if(level === 1 && lever === 1){
        spawnPlatform(200, height/2 + 100)
        spawnPlatform(650, height/2 + 50)
        spawnPlatform(1250, height/2 + 250)
        spawnPlatform(650, height/2 + 50)
        spawnSmallPlatform(1000, height/2 + 150)
        spawnCoins(width/2, height/2 - 100)
        spawnMonster(width/2, height/2)
        instructions.visible = true
        lever = 2

    }

    if(keyIsDown(LEFT_ARROW)){
        player.x -= 15
    }
    if(keyIsDown(RIGHT_ARROW)){
        player.x += 15
    }
    if(keyWentDown(UP_ARROW)){
        player.velocityY = -20
    }

}

drawSprites()

fill("white")
textSize(40)
text(lives, width - 170, 110)
text("Score:" + score, 170, 110)
}

function spawnPlatform(x, y){
    var platform = createSprite(x, y)
        platform.addImage(platform1Img)
        platform.scale = 4
        invisPlatform = createSprite(x, y, 340, 50)
        invisPlatform.visible = false
        invisPlatform.setCollider("rectangle", 0, 0, 340, 35)
        platformGroup.add(invisPlatform)
        platform.depth = player.depth
        player.depth += 1
}

function spawnSmallPlatform(x, y){
    var smallPlatform = createSprite(x, y)
        smallPlatform.addImage(platform2Img)
        smallPlatform.scale = 3
        invisSmallPlatform = createSprite(x - 25, y + 35, 80, 50)
        invisSmallPlatform.visible = false
        platformGroup.add(invisSmallPlatform)
        smallPlatform.depth = player.depth
        player.depth += 1
}

function die(){
    lives -= 1
    if(lives >= 1){
        player.y = height/2
        player.x = 200
        if(lives === 2){
            lifeBar.changeAnimation("2/3 life")
        }
        if(lives === 1){
            lifeBar.changeAnimation("1/3 life")
        }
    }
}

function spawnCoins(x, y){
    var coin = createSprite(x, y)
    coin.addImage(coinImg)
    coinGroup.add(coin)
    coin.setCollider("circle", -9, -3, 25)
}

function handleCoin(){
    player.overlap(coinGroup, function(collecter, collected){
        score += 1
        collected.remove()
    })
}

function spawnMonster(x,y){
    monster = createSprite(x,y)
    monster.addAnimation("monster1", monsterImg)
    monster.addAnimation("monster2", monsterImg2)
    monster.changeAnimation("monster1")
    monster.scale = 2
    monster.setCollider("rectangle", 5, 0, 50, 50)
    monsterGroup.add(monster)
}