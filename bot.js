const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const Vec3 = require('vec3');
const bot = mineflayer.createBot({
    version: '1.8.8',
    username: 'for_testing',
    host: 'localhost',
    port: '58947'
})

bot.loadPlugin(pathfinder)
let botFunc = ''
let playerCom = -1
let outMessage = ''
const silentlog = true //if you want to start bot on public server
const Owner = 'TimeToCry' //your nick for ^^^^
let tpTo = new Vec3()
let distance = new Vec3()
let sync = false
let stopVel = false
let v1 = new Vec3()
bot.on('spawn', spawnSay)
bot.on('physicsTick', main)
bot.on('chat', chatfunc)

function spawnSay() {
    if (silentlog === true) {
        bot.chat("/tell " + Owner + ' I spawn on server on coord: ' + Math.round((bot.entity.position.x * 10) / 10) + ' ' + Math.round((bot.entity.position.y * 10) / 10) + ' ' + Math.round((bot.entity.position.z * 10) / 10) + 'and gravity' + bot.physics.gravity)
    } else { 
        bot.chat('I spawn on server on coord: ' + Math.round((bot.entity.position.x * 10) / 10) + ' ' + Math.round((bot.entity.position.y * 10) / 10) + ' ' + Math.round((bot.entity.position.z * 10) / 10))
    }
}
function main() {
    if (botFunc === 'sync') {
        const pOwner = bot.players[Owner]
        const OwnerEnt = pOwner.entity
        if (!OwnerEnt) return
        bot.entity.position = OwnerEnt.position.add(OwnerEnt.velocity)
        bot.entity.pitch = OwnerEnt.pitch
        bot.entity.yaw = OwnerEnt.yaw
    }
    if (botFunc === 'setVel') {
        bot.entity.velocity = new Vec3(0, 0, 0)
    }
    if (botFunc === 'tp') {
        bot.physics.gravity = 0
        let botPosition = bot.entity.position
        let v2 = [0, 0, 0]
        const maxTpDistance = 1
        const [_, params] = outMessage.split(' ')
        //console.log(params)
        v2 = params.split(':')
        //console.log(params.split(':') + ' => ' + v2.toString())
        tpTo.x = v2[0]; tpTo.y = v2[1]; tpTo.z = v2[2]
        //console.log(tpTo.toString())
        distance = botPosition.distanceTo(tpTo)
        if (distance < 0.1) {
            botPosition = tpTo
            bot.physics.gravity = 0.08
            botFunc = ''
            bot.chat('complete') 
        }
        if (distance <= maxTpDistance) {
            botPosition = tpTo
            bot.physics.gravity = 0.08
            botFunc = ''
            bot.chat('complete')
        }
        v1 = tpTo.subtract(botPosition)
        botPosition.x += (v1.x / distance) * maxTpDistance
        botPosition.y += ((v1.y / distance) * maxTpDistance)
        botPosition.z += (v1.z / distance) * maxTpDistance
    }
}

function chatfunc(name = '' , message = '') {
    console.log(name + ' ' + message)
    if (name === bot.username) return
    if (name === Owner){
        if (message === 'setVel'){
            botFunc = 'setVel'
        }
        if (message === 'sync') {
            botFunc = 'sync'
        }
        if (message.includes('tp')) {
            botFunc = 'tp'
            outMessage = message
        }
        if (message === 'exit') {
            botFunc = 'exit'
        }
        if (message === 'help') {

        }
    }
}
