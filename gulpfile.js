const { src, dest, parallel, series, watch } = require("gulp");
const { exec } = require('child_process');

function copyFileToServer(cb) {
    exec("scp -r ./src leon@192.168.3.91:~ && ssh leon@192.168.3.91 chmod 777 -R ~/src", (err, stdout, stderr) => {
        if (err) {
            console.error('文件往服务器拷贝失败', err);
            cb();
        } else {
            // console.log('文件拷贝成功');
            cb();
        }
    });
}

function execShell(cb) {
    exec("ssh leon@192.168.3.91 ~/src/main.sh", (err, stdout, stderr) => {
        if (err) {
            console.error('脚本执行失败', err);
            cb();
        } else {
            console.log('stdout',stdout);
            cb();
        }
    });
}

function watchThenCopyFileToServer(cb) {
    watch(['src/**/*.sh'], { ignoreInitial: false }, series(copyFileToServer, execShell)).on('end', cb);
}//watchAndReCompile

exports.default = series(watchThenCopyFileToServer);

