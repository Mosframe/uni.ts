/**
 * server.ts
 *
 * @author mosframe / https://github.com/mosframe
 */
import * as Http from 'http';
import * as Express from 'express';
import * as Profiler from 'v8-profiler';
import * as FileStream from 'fs';
import CONST from './constant';
import * as Date from './UnitsEngine/Date';

// [ Express ]
let express = Express();
express.get( '/', ( req, res )=> { res.sendFile(__dirname + '/build/index.html'); } );
express.use( '/', Express.static(__dirname + '/build/') );

// [ HTTP server ]
let server = Http.createServer(express);
server.listen(process.env.PORT || CONST.SERVERPORT);
console.log('server started');

// [ Profiling ]
if( CONST.PROFILE ) {
    let startProfiling = (name:string,duration:number) => {
        Profiler.startProfiling(name, true );
        setTimeout(()=>{
            let profile = Profiler.stopProfiling(name);
            // write to file
            profile.export((error,result)=>{
                FileStream.writeFile('./profiles/uni.ts.server.'+Date.nowToLog()+'.cpuprofile', result );
                profile.delete();
                console.log('Profile saved.');
            });
        },duration);
    }
    startProfiling('uni.ts.10s',10000);
}

