function fire () {
    if (pins.analogReadPin(AnalogPin.P1) < 500 || fire2 == 1) {
        pins.servoWritePin(AnalogPin.P2, 180)
        for (let index = 0; index < 4; index++) {
            basic.showLeds(`
                # . # . #
                # . # . #
                # . # . #
                . . . . .
                # . # . #
                `)
            pins.digitalWritePin(DigitalPin.P8, 1)
            basic.pause(100)
            basic.showLeds(`
                . # . # .
                . # . # .
                . # . # .
                . . . . .
                . # . # .
                `)
            pins.digitalWritePin(DigitalPin.P8, 0)
            basic.pause(100)
        }
    } else {
        basic.clearScreen()
        pins.digitalWritePin(DigitalPin.P8, 0)
        pins.servoWritePin(AnalogPin.P2, 0)
    }
}
OneNET.on_wifi_connected(function () {
    OneNET.OneNET_connect("382415", "645167412", "7373")
    basic.showIcon(IconNames.Yes)
})
radio.onReceivedValue(function (name, value) {
    if (name == "temp2") {
        temp2 = value
    }
    if (name == "wet2") {
        wet2 = value
    }
    if (name == "fire2") {
        fire2 = value
    }
})
OneNET.on_mqtt_receiveed(function () {
    if (OneNET.get_value() == "dooropen") {
        pins.servoWritePin(AnalogPin.P2, 0)
    }
    if (OneNET.get_value() == "doorclose") {
        pins.servoWritePin(AnalogPin.P2, 180)
    }
    if (OneNET.get_value() == "fanopen") {
        pins.digitalWritePin(DigitalPin.P12, 1)
    }
    if (OneNET.get_value() == "fanoff") {
        pins.digitalWritePin(DigitalPin.P12, 0)
    }
    if (OneNET.get_value() == "wetom") {
        pins.digitalWritePin(DigitalPin.P0, 1)
    }
    if (OneNET.get_value() == "wetoff") {
        pins.digitalWritePin(DigitalPin.P0, 0)
    }
})
let wet2 = 0
let temp2 = 0
let fire2 = 0
basic.showIcon(IconNames.No)
OneNET.WIFI_init(SerialPin.P13, SerialPin.P14)
OneNET.WIFI_connect("BSJY", "bosheng7373")
radio.setGroup(188)
basic.forever(function () {
    if (OneNET.is_connected()) {
        OneNET.OneNET_send("temp1", convertToText(input.temperature()))
        basic.pause(3000)
        OneNET.OneNET_send("wet1", convertToText(sensors.get_DHT11_value(
        DigitalPin.P0,
        sensors.Dht11Result.humidity
        )))
        basic.pause(3000)
        if (pins.analogReadPin(AnalogPin.P1) < 500) {
            OneNET.OneNET_send("fire1", "1")
        } else {
            OneNET.OneNET_send("fire1", "0")
        }
        basic.pause(3000)
        OneNET.OneNET_send("temp2", convertToText(temp2))
        basic.pause(3000)
        OneNET.OneNET_send("wet2", convertToText(wet2))
        basic.pause(3000)
        OneNET.OneNET_send("fire2", convertToText(fire2))
        basic.pause(3000)
    }
})
