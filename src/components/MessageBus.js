/**
 * Created by godsong on 16/7/7.
 */
const EventEmitter=require('events').EventEmitter;
class MessageBus extends EventEmitter{
    constructor(){
        super();
    }
}
module.exports=new MessageBus();