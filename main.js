"use strict";

let gKey = new Uint8Array( 0x100 );
let gTimer;

//1マスの大きさ(縦横共通)
const squareSize = 16 * 2

//縦横ブロック数
const wblock=15;
const hblock=13;
//画面サイズ
const WIDTH = squareSize * wblock;  
const HEIGHT = squareSize * hblock;

//プレイヤー情報
const user = document.createElement('img');
//壁情報
const kabe = document.createElement('img');

//プレイヤー番号
let gN = 0;

//プレイヤーのスピード、この数が座標にそのまま毎フレーム足されていく
const gSpeed = 3;

//プレイヤー座標
let gx;
let gy;

//プレイヤー番号により開始位置を変える(0:左上, 1:右上, 2:左下, 3:右下)
switch (gN) {
    case 0:
        gx = squareSize;
        gy = squareSize;
        break;
    case 1:
        gx = WIDTH-2*squareSize;
        gy = squareSize;
        break;
    case 2:
        gx = squareSize;
        gy = HEIGHT-2*squareSize;
        break;
    case 3:
        gx = WIDTH-2*squareSize;
        gy = HEIGHT-2*squareSize;
        break;
}

//プレイヤーの画像
user.src = "image/hito.png";
//壁画像
kabe.src = "image/kabe.png";

//プレイヤーの大きさを決める
let orgWidth  = user.width;     // 元画像の横幅を保存
let orgHeight = user.height;    // 元画像の高さを保存
let rWidth = squareSize         // 任意の数を入れることで、プレイヤーの大きさが決定される
let rHeight = orgHeight * (rWidth / orgWidth);  // rWidthに対して同じ比で高さも決定する。
user.style.position = "absolute";   //画面左上を(0,0)とした絶対位置でプレイヤーを配置するという状態

let operable = 1;   //操作できるか
let visible = 1;    //見えるか

//マップ生成
var map = new Map(wblock,hblock);

function onPaint ()
{
    //frameParSecond管理（60fps）

    //初回は実時間をgTimerに送る
    if( !gTimer ) {
        gTimer = performance.now();
    }
    //16.67ミリ秒たったら画面を更新することで、どんな環境でも約60fpsで動く(16.67ms/f = 1/1.667f/s = 59.9988002f/s ≒ 60f/s)
    if( gTimer + 16.67 < performance.now() ) {
        gTimer += 16.67;

        //各キーが押し込まれたら、プレイヤーの座標が毎フレーム更新される
        //斜め移動をしながら壁にぶつかった時、壁沿いに動けるように、上下左右それぞれで壁判定を行う
        if(operable) {
            gx -= gKey[65] * gSpeed;    //g[65]=1（sキーが押し込まれた）
            if (map.isInsideWall(gx,gy,map.bombermap)){gx += gKey[65] * gSpeed} //ダメならもどす

            gx += gKey[68] * gSpeed;
            if (map.isInsideWall(gx,gy,map.bombermap)){gx -= gKey[68] * gSpeed}

            gy -= gKey[87] * gSpeed;
            if (map.isInsideWall(gx,gy,map.bombermap)){gy += gKey[87] * gSpeed}

            gy += gKey[83] * gSpeed;
            if (map.isInsideWall(gx,gy,map.bombermap)){gy -= gKey[83] * gSpeed}
        }

        draw();
    }
    requestAnimationFrame( onPaint );
}

//描画
function draw()
{
    let g = document.getElementById("main").getContext("2d");

    //大外の灰色壁描画
    g.fillStyle = "#696969";
    g.fillRect( 0, 0, WIDTH, HEIGHT);

    //緑色地面描画
    g.fillStyle = "#006400";
    g.fillRect( squareSize, squareSize, WIDTH-2*squareSize, HEIGHT-2*squareSize);

    //壁の描写
    for(var i=0; i<hblock; i++){
        for(var j=0; j<wblock; j++){
            if(map.bombermap[i][j]==1){
                g.drawImage(kabe,j*squareSize,i*squareSize,squareSize,squareSize)
            }
        }
    }

    //プレイヤー描画
    if(visible) {

        user.style.left = gx;
        user.style.top = gy;
        g.drawImage(user, gx, gy, rWidth, rHeight);
    }
    
}

window.onkeydown = function(ev)
{
    gKey[ev.keyCode] = 1;
}

window.onkeyup = function(ev)
{
    gKey[ ev.keyCode ] = 0;
}


window.onload = function()
{
    requestAnimationFrame( onPaint );
}