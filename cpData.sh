#!/bin/bash
# 解决build之后，直接打开win-unpacked下的.exe安装文件报错,如下：
# Error:ENOENT: no such file or directory, open 'node_modules/tinify/lib/data/cacert.pem'
cp -r ./node_modules/tinify/lib/data ./dist_electron/win-unpacked/resources/data
sleep 1
echo 'Copy completed.'