// -----------------------------------------------------------------------------
// server.ts
// -----------------------------------------------------------------------------

import * as Http from 'http';
import * as Express from 'express';
import * as Profiler from 'v8-profiler';
import * as FileStream from 'fs';
import CONST from './constant';

// -----------------------------------------------------------------------------
/** 웹 프레임워크 */
let express = Express();
/** Http 서버 */
let server = Http.createServer(express);
// 홈 서비스 : http://mywebsite:2000 => http://mywebsite:2000/client/assets/index.html
express.get('/', ( req, res )=> {
    res.sendFile(__dirname + '/client/assets/index.html');
});
// 서버소스를 보호하기 위해 /client/assets 디렉토리 이하만 클라이언트에 서비스한다.
// http://mywebsite:2000/client => http://mywebsite:2000/client/assets
// ex) /server/secureFile.js 파일은 클라이언트에 노출되지 않는다.
express.use('/client', Express.static(__dirname + '/client/assets/'));
// Http서버에서 2000 포트를 통해서 클라이언트 요청을 받는다.
//server.listen(2000);
server.listen(process.env.PORT || 2000);
console.log('server started');
// Socket.io를 통해 WebSocket 서비스를 시작한다.
networkService.start( server );


// -----------------------------------------------------------------------------
// 프로파일링
if( CONST.PROFILE ) {
    let startProfiling = (name:string,duration:number) => {
        Profiler.startProfiling(name, true );
        setTimeout(()=>{
            let profile = Profiler.stopProfiling(name);
            // 파일로 기록
            profile.export((error,result)=>{
                FileStream.writeFile('./profiles/uni.ts.server.'+Util.nowLogString()+'.cpuprofile', result );
                profile.delete();
                console.log('Profile saved.');
            });
        },duration);
    }
    startProfiling('uni.ts.10s',10000);
}

