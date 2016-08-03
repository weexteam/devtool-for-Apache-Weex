module.exports = {
    LEVEL_COLOR: {
        "error": "\033[31;1;49m",
        "debug": "\033[36;49m",
        "log": "\033[32;49m",
        "warn": "\033[33;49m",
        "#underline": "\033[2;4m",
        "#end": "\033[0m"
    },
    dressUp: function (text) {
        return '\033[' + Array.prototype.slice.call(arguments, 1).join(';') + 'm' + text + '\033[0m';
    },
    BRIGHT: 1,
    DARK: 2,
    UNDERLINE: 4,
    REVERSE: 7,
    FG_BLACK: 30,
    FG_RED: 31,
    FG_GREEN: 32,
    FG_YELLOW: 33,
    FG_BLUE: 34,
    FG_PURPLE: 35,
    FG_CYAN: 36,
    FG_WHITE: 37,
    BG_BLACK: 40,
    BG_RED: 41,
    BG_GREEN: 42,
    BG_YELLOW: 43,
    BG_BLUE: 44,
    BG_PURPLE: 45,
    BG_CYAN: 46,
    BG_WHITE: 47
};