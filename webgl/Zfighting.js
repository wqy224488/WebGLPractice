var VSHADER_SOURCE=
    'attribute vec4 a_Position;\n'+
    'attribute vec4 a_Color;\n'+
    'uniform mat4 u_mvpMatrix;\n'+
    'varying vec4 v_Color;\n'+
    'void main() {\n' +
    ' gl_Position = u_mvpMatrix*a_Position;\n' +
    ' v_Color = a_Color;\n' +
    '}\n';
var FSHADER_SOURCE=
    'precision mediump float;\n'+
    'varying vec4 v_Color;\n'+
    'void main() {\n' +
    ' gl_FragColor = v_Color;\n' +
    '}\n';

function main() {
    var canvas=document.getElementById('webgl');
    var gl=getWebGLContext(canvas);
    if(!gl)
    {
        console.log('Failed to get the rendering context for webgl');
        return;
    }
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);//开启深度测试
    gl.clear(gl.DEPTH_BUFFER_BIT);//清空深度缓冲区
    gl.enable(gl.POLYGON_OFFSET_FILL);


    if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
        console.log('Failed to initialize shader.');
        return;
    }
    //设置顶点坐标和颜色
    var n=initVertexBuffers(gl);
    if(n<0)
    {
        console.log("Failed to set the positions of the vertices");
        return;
    }

    var u_mvpMatrix=gl.getUniformLocation(gl.program,'u_mvpMatrix');
    if(!u_mvpMatrix){
        console.log('Failed to get uniform position of u_mvpMatrix.');
        return;
    }

    var modelMatrix=new Matrix4();
    var viewMatrix=new Matrix4();
    var projMatrix=new Matrix4();
    var mvpMatrix=new Matrix4();
 //    viewMatrix.setLookAt(0.0,0.0,10.0,0,0,-100,0,1,0);
    projMatrix.setPerspective(30,canvas.width/canvas.height,1.0,100.0);
    //projMatrix.setOrtho(-1.0,1.0,-1.0,1.0,-10.0,1000);
 //    var mvpMatrix=new Matrix4();
 //    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
 //    gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);
 //
 //    gl.drawArrays(gl.TRIANGLES,0,n/2);
 // //   gl.polygonOffset(1.0,1.0);
 //    gl.drawArrays(gl.TRIANGLES,n/2,n/2);


    document.onkeydown=function (ev) {
        keydown(ev,gl,n,u_mvpMatrix,modelMatrix,viewMatrix,projMatrix,mvpMatrix);
    }
    draw(gl,n,u_mvpMatrix,modelMatrix,viewMatrix,projMatrix,mvpMatrix);


}

function initVertexBuffers(gl) {
    var verticesColors=new Float32Array([
        //2个三角形
         0.0, 2.5,-5.0,0.0,1.0,0.0,//绿色三角形
        -2.5,-2.5,-5.0,1.0,0.0,0.0,
         2.5,-2.5,-5.0,1.0,0.0,0.0,

         0.0, 3.0,-5.0,1.0,0.0,0.0,//黄色三角形
        -3.0,-3.0,-5.0,1.0,1.0,0.0,
         3.0,-3.0,-5.0,1.0,1.0,0.0,
    ]);
    var fsize=verticesColors.BYTES_PER_ELEMENT;
    var n=6;
    //创建缓冲区对象
    var vertexTexCoordBuffer=gl.createBuffer();
    if(!vertexTexCoordBuffer){
        console.log('Failed to create the buffer object ');
        return -1;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexTexCoordBuffer);
    //向缓冲区对象写入数据
    //gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);
    var a_Position=gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position<0){
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,fsize*6,0);
    //开启attribute变量：连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    var a_Color=gl.getAttribLocation(gl.program,'a_Color');
    if(a_Color<0){
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Color,2,gl.FLOAT,false,fsize*6,fsize*3);
    //开启attribute变量：连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Color);

    return n;
}
var g_eyeX=0.0,g_eyeY=0.0,g_eyeZ=5.0;
//g_eyeX=-0.75;//为了测试深度冲突现象，但是并没有出现
function keydown(ev,gl,n,u_mvpMatrix,modelMatrix,viewMatrix,projMatrix,mvpMatrix) {
    if(ev.keyCode==39){
        g_eyeX+=0.01;
    }
    else if(ev.keyCode==37){
        g_eyeX-=0.01;
    }
    else{
        return;
    }
    draw(gl,n,u_mvpMatrix,modelMatrix,viewMatrix,projMatrix,mvpMatrix);
}

function draw(gl,n,u_mvpMatrix,modelMatrix,viewMatrix,projMatrix,mvpMatrix) {
   // modelMatrix.setTranslate(-0.75,0,0);
    //gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
    viewMatrix.setLookAt(g_eyeX,g_eyeY,g_eyeZ,0,0,-100,0,1,0);
   // var mvpMatrix=new Matrix4();
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    //mvpMatrix.set(modelMatrix).multiply(viewMatrix).multiply(projMatrix);
    gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.drawArrays(gl.TRIANGLES,0,n/2);
    gl.polygonOffset(10.0,0.0);
   // modelMatrix.setTranslate(0.75,0,0);
  //  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    //mvpMatrix.set(modelMatrix).multiply(viewMatrix).multiply(projMatrix);
   // gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES,n/2,n/2);
}

